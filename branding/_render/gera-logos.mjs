// Gera os SVGs oficiais da Fontesan com TODO o texto convertido em curvas
// (paths). Sem isso, um logo com <text> vira fonte genérica em gráfica,
// Illustrator ou Canva, que não têm acesso ao Google Fonts.
import opentype from 'opentype.js';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';

const load = p => opentype.parse(readFileSync(p).buffer.slice(0));
const FRAUNCES = load('fonts/fraunces-var.ttf');      // usWeightClass 600
const MONO400 = load('fonts/plexmono-400.ttf');
const MONO500 = load('fonts/plexmono-500.ttf');

const OUT = '../logos';
mkdirSync(OUT, { recursive: true });

// ---------- utilidades de path ----------

function mapCmds(cmds, fn) {
  return cmds.map(c => {
    const n = { ...c };
    if (c.type === 'M' || c.type === 'L') { [n.x, n.y] = fn(c.x, c.y); }
    else if (c.type === 'C') {
      [n.x, n.y] = fn(c.x, c.y); [n.x1, n.y1] = fn(c.x1, c.y1); [n.x2, n.y2] = fn(c.x2, c.y2);
    } else if (c.type === 'Q') {
      [n.x, n.y] = fn(c.x, c.y); [n.x1, n.y1] = fn(c.x1, c.y1);
    }
    return n;
  });
}

function cmdsToD(cmds, prec = 2) {
  const r = v => Number(v.toFixed(prec));
  return cmds.map(c => {
    if (c.type === 'M') return `M${r(c.x)} ${r(c.y)}`;
    if (c.type === 'L') return `L${r(c.x)} ${r(c.y)}`;
    if (c.type === 'C') return `C${r(c.x1)} ${r(c.y1)} ${r(c.x2)} ${r(c.y2)} ${r(c.x)} ${r(c.y)}`;
    if (c.type === 'Q') return `Q${r(c.x1)} ${r(c.y1)} ${r(c.x)} ${r(c.y)}`;
    if (c.type === 'Z') return 'Z';
    return '';
  }).join('');
}

// Larguras de avanço de cada glifo, na escala do tamanho pedido.
function medir(font, texto, size, tracking) {
  const chars = [...texto];
  const itens = chars.map(ch => {
    const g = font.charToGlyph(ch);
    return { ch, adv: (g.advanceWidth / font.unitsPerEm) * size };
  });
  const total = itens.reduce((s, i) => s + i.adv, 0) + tracking * Math.max(0, chars.length - 1);
  return { itens, total };
}

// Texto reto -> um único "d". x,y é o início da baseline.
function textoReto(font, texto, size, tracking, x, y) {
  const { itens } = medir(font, texto, size, tracking);
  let cursor = x;
  let cmds = [];
  for (const it of itens) {
    if (it.ch !== ' ') {
      const p = font.getPath(it.ch, cursor, y, size);
      cmds = cmds.concat(p.commands);
    }
    cursor += it.adv + tracking;
  }
  return cmdsToD(cmds);
}

// Texto ao longo de um círculo -> um único "d".
// cx,cy = centro; r = raio da BASELINE; angCentroDeg em graus no sistema SVG
// (0 = direita, 90 = baixo, -90 = topo). direcao: +1 corre no sentido de
// ângulo crescente (arco superior), -1 no sentido decrescente (arco inferior).
function textoCircular(font, texto, size, tracking, cx, cy, r, angCentroDeg, direcao) {
  const { itens, total } = medir(font, texto, size, tracking);
  const arcoTotal = total / r;                       // radianos ocupados
  const centro = (angCentroDeg * Math.PI) / 180;
  let ang = centro - direcao * (arcoTotal / 2);      // começa numa ponta
  let cmds = [];

  for (const it of itens) {
    const meio = (it.adv / 2) / r;                   // metade do glifo, em radianos
    const angGlifo = ang + direcao * meio;           // centro do glifo
    if (it.ch !== ' ') {
      // glifo desenhado na origem, com a baseline em y=0 e centrado em x
      const p = font.getPath(it.ch, -it.adv / 2, 0, size);
      // rotação: arco superior deixa o topo da letra para fora (+90),
      // arco inferior deixa o topo para dentro (-90), como num selo clássico.
      const rot = angGlifo + direcao * (Math.PI / 2);
      const cos = Math.cos(rot), sin = Math.sin(rot);
      const px = cx + r * Math.cos(angGlifo);
      const py = cy + r * Math.sin(angGlifo);
      cmds = cmds.concat(mapCmds(p.commands, (X, Y) => [
        px + X * cos - Y * sin,
        py + X * sin + Y * cos,
      ]));
    }
    ang += direcao * ((it.adv + tracking) / r);
  }
  return cmdsToD(cmds);
}

// ---------- peças reutilizáveis ----------

// A marca central (check + folha). cor = traço/preenchimento, nervura = cor do vazado.
const marca = (cor, nervura) => `
    <path d="M140 292 L224 372 L316 248" fill="none" stroke="${cor}" stroke-width="46" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M316 248 C288 178 316 106 398 88 C406 170 376 228 316 248 Z" fill="${cor}"/>
    <path d="M326 226 L384 116" stroke="${nervura}" stroke-width="11" stroke-linecap="round" fill="none"/>`;

const icone = (cor, nervura) => `  <circle cx="256" cy="256" r="230" fill="none" stroke="${cor}" stroke-width="22"/>
  <g transform="translate(250 266) scale(.92) translate(-256 -256)">${marca(cor, nervura)}
  </g>`;

function selo(cor, nervura, textoTopo, textoBaixo, corBaixo) {
  const dTopo = textoCircular(MONO500, textoTopo, 46, 16, 256, 256, 204, -90, +1);
  const dBaixo = textoCircular(MONO400, textoBaixo, 30, 7, 256, 256, 222, 90, -1);
  return `  <circle cx="256" cy="256" r="244" fill="none" stroke="${cor}" stroke-width="12"/>
  <circle cx="256" cy="256" r="172" fill="none" stroke="${cor}" stroke-width="4" opacity=".6"/>
  <path d="${dTopo}" fill="${cor}"/>
  <path d="${dBaixo}" fill="${corBaixo || cor}"/>
  <circle cx="52" cy="256" r="9" fill="${cor}"/>
  <circle cx="460" cy="256" r="9" fill="${cor}"/>
  <g transform="translate(252 272) scale(.56) translate(-256 -256)">${marca(cor, nervura)}
  </g>`;
}

const svg = (w, h, vb, inner, nota) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="${vb}">
  <!-- ${nota}
       Texto convertido em curvas: não depende de fonte instalada. -->
${inner}
</svg>
`;

const AVISO = 'Fontesan · marca oficial. Não distorcer, girar ou recolorir fora da paleta.';

// ---------- ícone ----------
writeFileSync(`${OUT}/icone.svg`,
  svg(512, 512, '0 0 512 512', icone('#1f3826', '#f5eee1'),
    `${AVISO}\n       Ícone para fundo claro (creme #f5eee1). A nervura da folha é vazada na cor\n       do fundo: sobre outro fundo, ajuste o stroke da nervura para essa cor.`));

writeFileSync(`${OUT}/icone-fundo-escuro.svg`,
  svg(512, 512, '0 0 512 512', icone('#f2ecdd', '#16281c'),
    `${AVISO}\n       Ícone para fundo verde profundo (#16281c).`));

writeFileSync(`${OUT}/icone-mono-preto.svg`,
  svg(512, 512, '0 0 512 512', icone('#000000', '#ffffff'),
    `${AVISO}\n       Versão 1 cor: carimbo, gravação, fax, impressão monocromática.`));

// ---------- selo ----------
writeFileSync(`${OUT}/selo.svg`,
  svg(512, 512, '0 0 512 512', selo('#1f3826', '#f5eee1', 'FONTESAN', 'SEGURANÇA DE ALIMENTOS'),
    `${AVISO}\n       Selo completo para fundo claro. Tamanho mínimo: 64px (abaixo disso use o ícone).`));

writeFileSync(`${OUT}/selo-fundo-escuro.svg`,
  svg(512, 512, '0 0 512 512', selo('#f2ecdd', '#16281c', 'FONTESAN', 'SEGURANÇA DE ALIMENTOS'),
    `${AVISO}\n       Selo completo para fundo verde profundo (#16281c).`));

// ---------- adesivo Casa em dia ----------
{
  const dTopo = textoCircular(MONO500, 'CASA EM DIA', 47, 14, 256, 256, 196, -90, +1);
  const dBaixo = textoCircular(MONO400, 'FONTESAN · 2026', 29, 8, 256, 256, 212, 90, -1);
  const inner = `  <circle cx="256" cy="256" r="250" fill="#16281c"/>
  <circle cx="256" cy="256" r="234" fill="none" stroke="#d9821b" stroke-width="8"/>
  <circle cx="256" cy="256" r="168" fill="none" stroke="#f2ecdd" stroke-width="3" opacity=".55"/>
  <path d="${dTopo}" fill="#f2ecdd"/>
  <path d="${dBaixo}" fill="#d9821b"/>
  <circle cx="60" cy="256" r="8" fill="#d9821b"/>
  <circle cx="452" cy="256" r="8" fill="#d9821b"/>
  <g transform="translate(252 272) scale(.54) translate(-256 -256)">${marca('#f2ecdd', '#16281c')}
  </g>`;
  writeFileSync(`${OUT}/adesivo-casa-em-dia.svg`,
    svg(512, 512, '0 0 512 512', inner,
      `Fontesan · selo "Casa em dia" para o cliente com rotina ativa.\n       Trocar o ano a cada ciclo. Não é o logo da marca: é uma peça de campanha.`));
}

// ---------- lockups ----------
{
  // horizontal: ícone + Fontesan + linha de apoio
  const dNome = textoReto(FRAUNCES, 'Fontesan', 64, 0, 136, 76);
  const dApoio = textoReto(MONO400, 'SEGURANÇA DE ALIMENTOS', 16.6, 5.4, 139, 110);
  const inner = `  <g transform="translate(0 10) scale(.215)">
${icone('#1f3826', '#f5eee1')}
  </g>
  <path d="${dNome}" fill="#1f3826"/>
  <path d="${dApoio}" fill="#9c5a0d"/>`;
  writeFileSync(`${OUT}/logo-horizontal.svg`,
    svg(494, 130, '0 0 494 130', inner,
      `${AVISO}\n       Lockup horizontal, fundo claro. Respiro mínimo: a altura do "F" em todo o contorno.`));
}

{
  // horizontal em fundo escuro
  const dNome = textoReto(FRAUNCES, 'Fontesan', 64, 0, 136, 76);
  const dApoio = textoReto(MONO400, 'SEGURANÇA DE ALIMENTOS', 16.6, 5.4, 139, 110);
  const inner = `  <g transform="translate(0 10) scale(.215)">
${icone('#f2ecdd', '#16281c')}
  </g>
  <path d="${dNome}" fill="#f2ecdd"/>
  <path d="${dApoio}" fill="#d9821b"/>`;
  writeFileSync(`${OUT}/logo-horizontal-fundo-escuro.svg`,
    svg(494, 130, '0 0 494 130', inner,
      `${AVISO}\n       Lockup horizontal para fundo verde profundo (#16281c).`));
}

{
  // vertical: centralizado
  const nome = medir(FRAUNCES, 'Fontesan', 58, 0);
  const apoio = medir(MONO400, 'SEGURANÇA DE ALIMENTOS', 14.9, 4.85);
  const dNome = textoReto(FRAUNCES, 'Fontesan', 58, 0, 190 - nome.total / 2, 235);
  const dApoio = textoReto(MONO400, 'SEGURANÇA DE ALIMENTOS', 14.9, 4.85, 190 - apoio.total / 2, 270);
  const inner = `  <g transform="translate(115 0) scale(.293)">
${icone('#1f3826', '#f5eee1')}
  </g>
  <path d="${dNome}" fill="#1f3826"/>
  <path d="${dApoio}" fill="#9c5a0d"/>`;
  writeFileSync(`${OUT}/logo-vertical.svg`,
    svg(380, 290, '0 0 380 290', inner,
      `${AVISO}\n       Lockup vertical, fundo claro.`));
}

console.log('SVGs gerados com texto em curvas em', OUT);
