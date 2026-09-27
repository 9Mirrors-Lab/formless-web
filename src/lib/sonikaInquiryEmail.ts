export type SonikaInquiryNotifyPayload = {
  question: string;
  name?: string | null;
  email?: string | null;
  topic?: string | null;
  source: string;
  createdAt?: string | null;
};

export const SONIKA_INQUIRY_NOTIFY_PATH = '/api/notify-sonika-inquiry';

export const DEFAULT_INQUIRY_NOTIFY_TO = 'soni@eyesclosed.love';
export const DEFAULT_INQUIRY_NOTIFY_FROM = 'Eyes Closed <hello@eyesclosed.love>';

function displayOrDash(value: string | null | undefined): string {
  const trimmed = value?.trim() ?? '';
  return trimmed.length > 0 ? trimmed : '—';
}

export function buildSonikaInquiryNotifyEmail(payload: SonikaInquiryNotifyPayload): {
  subject: string;
  text: string;
  html: string;
} {
  const question = payload.question.trim();
  const name = displayOrDash(payload.name);
  const email = displayOrDash(payload.email);
  const topic = displayOrDash(payload.topic);
  const source = displayOrDash(payload.source);
  const when = payload.createdAt
    ? new Date(payload.createdAt).toLocaleString('en-US', {
        dateStyle: 'medium',
        timeStyle: 'short',
      })
    : new Date().toLocaleString('en-US', {
        dateStyle: 'medium',
        timeStyle: 'short',
      });

  const subject = 'New Sonika inquiry';
  const text = [
    'You have a new question from the Eyes Closed site.',
    '',
    `Source: ${source}`,
    `Received: ${when}`,
    `Name: ${name}`,
    `Email: ${email}`,
    `Topic: ${topic}`,
    '',
    'Question:',
    question,
  ].join('\n');

  const html = `
    <div style="font-family:Georgia,serif;line-height:1.5;color:#1a1f1c;">
      <p style="margin:0 0 1rem;">You have a new question from the Eyes Closed site.</p>
      <table style="border-collapse:collapse;width:100%;max-width:36rem;font-family:system-ui,sans-serif;font-size:14px;">
        <tr><td style="padding:0.35rem 0;color:#666;width:6rem;">Source</td><td style="padding:0.35rem 0;">${escapeHtml(source)}</td></tr>
        <tr><td style="padding:0.35rem 0;color:#666;">Received</td><td style="padding:0.35rem 0;">${escapeHtml(when)}</td></tr>
        <tr><td style="padding:0.35rem 0;color:#666;">Name</td><td style="padding:0.35rem 0;">${escapeHtml(name)}</td></tr>
        <tr><td style="padding:0.35rem 0;color:#666;">Email</td><td style="padding:0.35rem 0;">${escapeHtml(email)}</td></tr>
        <tr><td style="padding:0.35rem 0;color:#666;">Topic</td><td style="padding:0.35rem 0;">${escapeHtml(topic)}</td></tr>
      </table>
      <p style="margin:1.25rem 0 0.4rem;font-family:system-ui,sans-serif;font-size:12px;letter-spacing:0.08em;text-transform:uppercase;color:#666;">Question</p>
      <p style="margin:0;white-space:pre-wrap;">${escapeHtml(question)}</p>
    </div>
  `.trim();

  return { subject, text, html };
}

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

export function parseSonikaInquiryNotifyPayload(
  body: unknown,
): { ok: true; payload: SonikaInquiryNotifyPayload } | { ok: false; error: string } {
  if (!body || typeof body !== 'object') {
    return { ok: false, error: 'Expected a JSON object.' };
  }

  const record = body as Record<string, unknown>;
  const question = typeof record.question === 'string' ? record.question.trim() : '';
  if (!question) {
    return { ok: false, error: 'Question is required.' };
  }

  const source =
    typeof record.source === 'string' && record.source.trim().length > 0
      ? record.source.trim()
      : 'inquire';

  return {
    ok: true,
    payload: {
      question,
      name: typeof record.name === 'string' ? record.name : null,
      email: typeof record.email === 'string' ? record.email : null,
      topic: typeof record.topic === 'string' ? record.topic : null,
      source,
      createdAt: typeof record.createdAt === 'string' ? record.createdAt : null,
    },
  };
}

export type SendSonikaInquiryEmailResult =
  | { ok: true; id?: string }
  | { ok: false; error: string; status?: number };

/**
 * Sends the Sonika inquiry notify mail through Resend.
 * Server-only: reads RESEND_API_KEY and optional notify from/to env vars.
 */
export async function sendSonikaInquiryNotifyEmail(
  payload: SonikaInquiryNotifyPayload,
  env: NodeJS.ProcessEnv = process.env,
): Promise<SendSonikaInquiryEmailResult> {
  const apiKey = env.RESEND_API_KEY?.trim();
  if (!apiKey) {
    return {
      ok: false,
      error: 'RESEND_API_KEY is not configured.',
      status: 503,
    };
  }

  const to = env.INQUIRY_NOTIFY_TO?.trim() || DEFAULT_INQUIRY_NOTIFY_TO;
  const from = env.INQUIRY_NOTIFY_FROM?.trim() || DEFAULT_INQUIRY_NOTIFY_FROM;
  const { subject, text, html } = buildSonikaInquiryNotifyEmail(payload);

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from,
      to: [to],
      subject,
      text,
      html,
    }),
  });

  const raw = await response.text();
  let parsed: { id?: string; message?: string; name?: string } = {};
  try {
    parsed = raw ? (JSON.parse(raw) as typeof parsed) : {};
  } catch {
    parsed = {};
  }

  if (!response.ok) {
    return {
      ok: false,
      status: response.status,
      error: parsed.message || parsed.name || `Resend returned ${response.status}.`,
    };
  }

  return { ok: true, id: parsed.id };
}
