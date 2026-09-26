import { createBrowserSupabaseClient, hasSupabaseEnv } from '@/lib/supabase';

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

function blankToNull(value: string | null | undefined): string | null {
  const trimmed = value?.trim() ?? '';
  return trimmed.length > 0 ? trimmed : null;
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

  try {
    const supabase = createBrowserSupabaseClient();
    const { error } = await supabase.from('sonika_inquiries').insert({
      question,
      name: blankToNull(input.name),
      email: blankToNull(input.email)?.toLowerCase() ?? null,
      topic: blankToNull(input.topic),
      source: input.source,
    });

    if (error) {
      return {
        ok: false,
        error: 'Something went wrong sending your inquiry. Please try again.',
      };
    }

    return { ok: true };
  } catch {
    return {
      ok: false,
      error: 'Something went wrong sending your inquiry. Please try again.',
    };
  }
}
