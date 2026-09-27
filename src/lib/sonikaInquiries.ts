import { createBrowserSupabaseClient, hasSupabaseEnv } from '@/lib/supabase';
import { SONIKA_INQUIRY_NOTIFY_PATH } from '@/lib/sonikaInquiryEmail';

export type SonikaInquirySource = 'inquire' | 'qa';

export type SonikaInquirySubmission = {
  question: string;
  name?: string | null;
  email?: string | null;
  topic?: string | null;
  source: SonikaInquirySource;
};

export type SubmitSonikaInquiryResult =
  | { ok: true }
  | { ok: false; error: string };

export type SonikaInquiryRow = {
  id: string;
  question: string;
  name: string | null;
  email: string | null;
  topic: string | null;
  source: string;
  createdAt: string;
};

export type FetchSonikaInquiriesResult =
  | { ok: true; rows: SonikaInquiryRow[] }
  | { ok: false; error: string };

function blankToNull(value: string | null | undefined): string | null {
  const trimmed = value?.trim() ?? '';
  return trimmed.length > 0 ? trimmed : null;
}

async function notifySonikaInquiryEmail(payload: {
  question: string;
  name: string | null;
  email: string | null;
  topic: string | null;
  source: SonikaInquirySource;
}): Promise<void> {
  try {
    await fetch(SONIKA_INQUIRY_NOTIFY_PATH, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        question: payload.question,
        name: payload.name,
        email: payload.email,
        topic: payload.topic,
        source: payload.source,
        createdAt: new Date().toISOString(),
      }),
    });
  } catch {
    // Email is best-effort; the inquiry is already stored.
  }
}

export async function submitSonikaInquiry(
  input: SonikaInquirySubmission,
): Promise<SubmitSonikaInquiryResult> {
  const question = input.question.trim();
  if (!question) {
    return { ok: false, error: 'Please enter your question before sending.' };
  }

  if (!hasSupabaseEnv()) {
    return {
      ok: false,
      error: 'Submissions are unavailable right now. Please try again later.',
    };
  }

  const name = blankToNull(input.name);
  const email = blankToNull(input.email)?.toLowerCase() ?? null;
  const topic = blankToNull(input.topic);

  try {
    const supabase = createBrowserSupabaseClient();
    const { error } = await supabase.from('sonika_inquiries').insert({
      question,
      name,
      email,
      topic,
      source: input.source,
    });

    if (error) {
      return {
        ok: false,
        error: 'Something went wrong sending your inquiry. Please try again.',
      };
    }

    void notifySonikaInquiryEmail({
      question,
      name,
      email,
      topic,
      source: input.source,
    });

    return { ok: true };
  } catch {
    return {
      ok: false,
      error: 'Something went wrong sending your inquiry. Please try again.',
    };
  }
}

type InquiryDbRow = {
  id: string;
  question: string | null;
  name: string | null;
  email: string | null;
  topic: string | null;
  source: string | null;
  created_at: string;
};

export async function fetchSonikaInquiries(): Promise<FetchSonikaInquiriesResult> {
  if (!hasSupabaseEnv()) {
    return { ok: false, error: 'Supabase is not configured.' };
  }

  try {
    const supabase = createBrowserSupabaseClient();
    const { data, error } = await supabase
      .from('sonika_inquiries')
      .select('id, question, name, email, topic, source, created_at')
      .order('created_at', { ascending: false });

    if (error) {
      return { ok: false, error: error.message };
    }

    const rows: SonikaInquiryRow[] = ((data ?? []) as InquiryDbRow[]).map((row) => ({
      id: row.id,
      question: row.question?.trim() || '—',
      name: blankToNull(row.name),
      email: blankToNull(row.email),
      topic: blankToNull(row.topic),
      source: blankToNull(row.source) ?? 'inquire',
      createdAt: row.created_at,
    }));

    return { ok: true, rows };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : 'Could not load inquiries.',
    };
  }
}

export function inquirySourceLabel(source: string): string {
  switch (source) {
    case 'qa':
      return 'Ask Sonika';
    case 'inquire':
      return 'Inquire';
    default:
      return source;
  }
}

export function inquirySourcePath(source: string): string {
  switch (source) {
    case 'qa':
      return '/qa';
    case 'inquire':
      return '/inquire';
    default:
      return source;
  }
}
