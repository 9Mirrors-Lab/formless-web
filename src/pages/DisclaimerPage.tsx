import { LegalDocumentPage } from '@/components/LegalDocumentPage';
import { useContent } from '@/context/ContentContext';
import { legalDocumentFromContent } from '@/lib/legalDocument';
import { LegalPageFallback } from './LegalPageFallback';

export default function DisclaimerPage() {
  const content = useContent();
  const document = legalDocumentFromContent(content, 'disclaimer');

  if (!document) {
    return <LegalPageFallback />;
  }

  return <LegalDocumentPage document={document} currentPage="disclaimer" />;
}
