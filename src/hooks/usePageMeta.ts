import { useEffect } from 'react';

type PageMeta = {
  title: string;
  description?: string;
};

export function usePageMeta({ title, description }: PageMeta) {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = title;

    let descriptionTag = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    const createdDescription = !descriptionTag;

    if (description) {
      if (!descriptionTag) {
        descriptionTag = document.createElement('meta');
        descriptionTag.name = 'description';
        document.head.appendChild(descriptionTag);
      }
      descriptionTag.content = description;
    }

    return () => {
      document.title = previousTitle;
      if (createdDescription && descriptionTag?.parentNode) {
        descriptionTag.parentNode.removeChild(descriptionTag);
      }
    };
  }, [title, description]);
}
