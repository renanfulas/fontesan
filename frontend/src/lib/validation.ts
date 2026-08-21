import { z } from "zod";

// Strip ASCII control chars (except \n, \r, \t) and zero-width / bidi-override
// chars commonly used in prompt-injection and homoglyph attacks.
const CONTROL_CODES = [
  ...Array.from({ length: 9 }, (_, i) => i), // 0x00-0x08
  0x0b,
  0x0c,
  ...Array.from({ length: 18 }, (_, i) => 0x0e + i), // 0x0E-0x1F
  0x7f,
];
const INVISIBLE_CODES = [
  ...Array.from({ length: 5 }, (_, i) => 0x200b + i), // 0x200B-0x200F zero-width
  ...Array.from({ length: 8 }, (_, i) => 0x2028 + i), // 0x2028-0x202F line/bidi
  ...Array.from({ length: 16 }, (_, i) => 0x2060 + i), // 0x2060-0x206F
  0xfeff,
];
const STRIP_RE = new RegExp(
  `[${[...CONTROL_CODES, ...INVISIBLE_CODES]
    .map((code) => `\\u${code.toString(16).padStart(4, "0")}`)
    .join("")}]`,
  "g",
);

export function sanitizeUserText(raw: string): string {
  return raw.replace(STRIP_RE, "");
}

export const CHAT_MAX_LEN = 2000;

export const chatMessageSchema = z
  .string()
  .transform((v) => sanitizeUserText(v).trim())
  .pipe(
    z
      .string()
      .min(1, "Escreva sua dúvida antes de enviar.")
      .max(CHAT_MAX_LEN, `Máximo de ${CHAT_MAX_LEN} caracteres.`),
  );

export const feedbackSchema = z.object({
  request_id: z.string().min(1).max(128),
  helpful: z.boolean(),
  reason: z.enum(["resolved", "not_resolved"]),
});

// Server response schemas — defense against malformed payloads.
export const chatResponseSchema = z.object({
  request_id: z.string(),
  answer: z.string(),
  escalated: z.boolean(),
  handoff_reasons: z.array(z.string()).default([]),
  references: z.array(z.string()).default([]),
  support_code: z.string(),
  error_code: z.string().nullable(),
});

export const feedbackResponseSchema = z.object({
  feedback_id: z.string(),
  accepted: z.boolean(),
  status: z.string(),
  storage: z.string(),
});

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ValidationError";
  }
}
