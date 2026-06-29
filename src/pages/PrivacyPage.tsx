import { LegalDocumentPage } from '@/components/LegalDocumentPage';
import { useContent } from '@/context/ContentContext';
import { legalDocumentFromContent } from '@/lib/legalDocument';
import { LegalPageFallback } from './LegalPageFallback';

export default function PrivacyPage() {
  const content = useContent();
  const document = legalDocumentFromContent(content, 'privacy');

  if (!document) {
    return <LegalPageFallback />;
  }

  return (
    <LegalDocumentPage
      document={document}
      companion={{ href: '/terms', label: 'Terms of Use' }}
    />
  );
}
