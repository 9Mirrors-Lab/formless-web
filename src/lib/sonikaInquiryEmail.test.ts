import { describe, expect, it } from 'vitest';

import {
  buildSonikaInquiryNotifyEmail,
  parseSonikaInquiryNotifyPayload,
} from '@/lib/sonikaInquiryEmail';

describe('sonikaInquiryEmail', () => {
  it('builds a notify subject and includes submission details', () => {
    const mail = buildSonikaInquiryNotifyEmail({
      question: 'How do I stay present?',
      name: 'Ada',
      email: 'ada@example.com',
      topic: 'Presence',
      source: 'qa',
      createdAt: '2026-09-26T18:00:00.000Z',
    });

    expect(mail.subject).toBe('New Sonika inquiry');
    expect(mail.text).toContain('How do I stay present?');
    expect(mail.text).toContain('Ada');
    expect(mail.text).toContain('ada@example.com');
    expect(mail.text).toContain('Presence');
    expect(mail.text).toContain('qa');
    expect(mail.html).toContain('How do I stay present?');
  });

  it('rejects empty questions', () => {
    expect(parseSonikaInquiryNotifyPayload({ question: '  ' }).ok).toBe(false);
    expect(parseSonikaInquiryNotifyPayload({ question: 'Hello' }).ok).toBe(true);
  });
});
