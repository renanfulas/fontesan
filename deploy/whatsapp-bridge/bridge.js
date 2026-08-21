// Bridge WhatsApp (Baileys, canal nao-oficial) para o numero da Fontesan.
//
// Responsabilidades:
// - manter UMA sessao WhatsApp pareada via QR code, persistida em disco
// - receber mensagens de texto 1:1 (ignora grupo) e repassar (forward) para o
//   webhook assinado do backend supportfaqagent (HERMES_CHAT_FORWARD_URL)
// - expor POST /send {chatId, message} para o backend responder pelo mesmo numero
//
// Contrato de evento de entrada (consumido por
// backend/app/integrations/hermes/inbound.py:parse_hermes_inbound):
//   { "chatId": "...", "senderId": "...", "body": "...", "messageId": "...", "isGroup": false }
//
// So escuta em 127.0.0.1: nunca deve ficar acessivel pela internet.

import { randomBytes } from 'node:crypto';
import { unlink } from 'node:fs/promises';
import crypto from 'crypto';
import makeWASocket, {
  DisconnectReason,
  fetchLatestBaileysVersion,
  useMultiFileAuthState,
} from '@whiskeysockets/baileys';
import { Boom } from '@hapi/boom';
import qrcodeTerminal from 'qrcode-terminal';
import qrcode from 'qrcode';
import express from 'express';
import pino from 'pino';

const PORT = Number(process.env.PORT || 3000);
const HOST = process.env.HOST || '127.0.0.1';
const AUTH_DIR = process.env.WHATSAPP_AUTH_DIR || './auth_state';
const LOG_LEVEL = process.env.LOG_LEVEL || 'warn';
// Caminho fixo, sobrescrito a cada novo QR emitido (a cada ~20-30s ate ser
// escaneado). Serve so para pareamento inicial; nao guarda nada sensivel por
// si so (o QR expira rapido).
const QR_IMAGE_PATH = process.env.WHATSAPP_QR_IMAGE_PATH || './latest-qr.png';

// Allowlist de numeros autorizados a falar com o bot, formato so-digitos (ex.
// "5511999999999"). "*" libera geral. Vazio = ninguem passa (fail-closed).
const ALLOWED_USERS = (process.env.WHATSAPP_ALLOWED_USERS || '')
  .split(',')
  .map((entry) => entry.trim())
  .filter(Boolean);

const CHAT_FORWARD_URL = process.env.HERMES_CHAT_FORWARD_URL || '';
const CHAT_FORWARD_SECRET = process.env.HERMES_CHAT_FORWARD_SECRET || '';

const logger = pino({ level: LOG_LEVEL });

let sock;
let connectionStatus = 'starting';

function isAllowed(phoneDigits) {
  if (ALLOWED_USERS.includes('*')) return true;
  return ALLOWED_USERS.includes(phoneDigits);
}

function extractText(message) {
  if (!message) return '';
  return (
    message.conversation ||
    message.extendedTextMessage?.text ||
    message.imageMessage?.caption ||
    message.videoMessage?.caption ||
    ''
  );
}

async function forwardToBackend(event) {
  if (!CHAT_FORWARD_URL) return;
  try {
    const body = JSON.stringify(event);
    const timestamp = Math.floor(Date.now() / 1000).toString();
    const signature = crypto
      .createHmac('sha256', CHAT_FORWARD_SECRET)
      .update(body)
      .digest('hex');
    const response = await fetch(CHAT_FORWARD_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Webhook-Timestamp': timestamp,
        'X-Webhook-Signature': signature,
      },
      body,
      redirect: 'manual',
    });
    if (!response.ok) {
      logger.error({ status: response.status }, 'forward to backend returned non-2xx');
    }
  } catch (err) {
    logger.error({ err: err.message }, 'forward to backend failed');
  }
}

async function startSock() {
  const { state, saveCreds } = await useMultiFileAuthState(AUTH_DIR);
  // Sem isso, a lib usa uma versao do protocolo WhatsApp Web pinada no pacote,
  // que fica desatualizada com o tempo e faz o servidor fechar a conexao
  // (statusCode 405) antes mesmo de emitir o QR code.
  const { version, isLatest } = await fetchLatestBaileysVersion();
  logger.info({ version, isLatest }, 'usando versao do protocolo WhatsApp Web');

  sock = makeWASocket({
    auth: state,
    version,
    logger: pino({ level: LOG_LEVEL }),
    // Identidade do "aparelho" pareado, aparece em Aparelhos Conectados no app.
    browser: ['Fontesan Bot', 'Chrome', '1.0'],
  });

  sock.ev.on('creds.update', saveCreds);

  sock.ev.on('connection.update', (update) => {
    const { connection, lastDisconnect, qr } = update;

    if (qr) {
      connectionStatus = 'awaiting_qr';
      console.log('\n[bridge] escaneie este QR code em WhatsApp > Aparelhos conectados:\n');
      qrcodeTerminal.generate(qr, { small: true });
      qrcode
        .toFile(QR_IMAGE_PATH, qr, { width: 512, margin: 2 })
        .then(() => logger.info({ path: QR_IMAGE_PATH }, 'QR code tambem salvo como imagem'))
        .catch((err) => logger.error({ err: err.message }, 'falha ao salvar QR code como imagem'));
    }

    if (connection === 'close') {
      connectionStatus = 'disconnected';
      const statusCode = new Boom(lastDisconnect?.error)?.output?.statusCode;
      const loggedOut = statusCode === DisconnectReason.loggedOut;
      logger.warn({ statusCode, loggedOut }, 'connection closed');
      if (!loggedOut) {
        // Pequeno atraso para nao martelar reconexao contra o servidor do
        // WhatsApp em loop apertado (evita parecer trafego automatizado
        // agressivo e da tempo de uma falha transitoria de rede passar).
        setTimeout(() => {
          startSock();
        }, 3000);
      } else {
        logger.error('sessao deslogada no proprio WhatsApp; apague auth_state e repareie com QR novo');
      }
    } else if (connection === 'open') {
      connectionStatus = 'connected';
      logger.info('conectado ao WhatsApp');
      // QR ja pareado e expirado; nao precisa mais ficar em disco.
      unlink(QR_IMAGE_PATH).catch(() => {});
    }
  });

  sock.ev.on('messages.upsert', async ({ messages, type }) => {
    if (type !== 'notify') return;
    for (const msg of messages) {
      try {
        if (!msg.message || msg.key.fromMe) continue;
        const chatId = msg.key.remoteJid || '';
        if (!chatId || chatId.endsWith('@g.us') || chatId === 'status@broadcast') continue;

        const phoneDigits = chatId.split('@')[0];
        if (!isAllowed(phoneDigits)) {
          logger.info('mensagem de numero fora da allowlist, ignorada');
          continue;
        }

        const body = extractText(msg.message).trim();
        const messageId = msg.key.id || randomBytes(8).toString('hex');
        if (!body) continue;

        forwardToBackend({
          chatId,
          senderId: chatId,
          body,
          messageId,
          isGroup: false,
        });
      } catch (err) {
        logger.error({ err: err.message }, 'falha ao processar mensagem recebida');
      }
    }
  });
}

startSock().catch((err) => {
  logger.error({ err: err.message }, 'falha ao iniciar sessao WhatsApp');
  process.exit(1);
});

const app = express();
app.use(express.json({ limit: '256kb' }));

app.get('/health', (req, res) => {
  res.json({ status: connectionStatus });
});

app.post('/send', async (req, res) => {
  const { chatId, message } = req.body || {};
  if (typeof chatId !== 'string' || !chatId || typeof message !== 'string' || !message) {
    return res.status(400).json({ error: 'chatId and message are required' });
  }
  if (connectionStatus !== 'connected') {
    return res.status(503).json({ error: 'whatsapp_not_connected' });
  }
  try {
    const result = await sock.sendMessage(chatId, { text: message });
    res.json({ messageId: result?.key?.id || null });
  } catch (err) {
    logger.error({ err: err.message }, 'envio falhou');
    res.status(502).json({ error: 'send_failed' });
  }
});

app.listen(PORT, HOST, () => {
  logger.info({ host: HOST, port: PORT }, 'bridge http listening');
});
