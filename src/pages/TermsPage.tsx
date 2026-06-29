import { LegalDocumentPage } from '@/components/LegalDocumentPage';
import { useContent } from '@/context/ContentContext';
import { legalDocumentFromContent } from '@/lib/legalDocument';
import { LegalPageFallback } from './LegalPageFallback';

export default function TermsPage() {
  const content = useContent();
  const document = legalDocumentFromContent(content, 'terms');

  if (!document) {
    return <LegalPageFallback />;
  }

  return (
    <LegalDocumentPage
      document={document}
      companion={{ href: '/privacy', label: 'Privacy Policy' }}
    />
  );
}
