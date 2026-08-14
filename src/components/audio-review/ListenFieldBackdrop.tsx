import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

import {
  listenFieldThemeForChapter,
  type ListenFieldTheme,
} from '@/components/audio-review/listenFieldThemes';
import { ShaderBackdrop } from '@/components/shader/ShaderBackdrop';

const EASE_FIELD = [0.32, 0.72, 0, 1] as const;
const FIELD_FADE_SECONDS = 0.7;

type ListenFieldBackdropProps = {
  chapterId: number;
};

function FieldMesh({ theme }: { theme: ListenFieldTheme }) {
  return (
    <ShaderBackdrop
      theme={theme.motion}
      palette={theme.palette}
      shaderId={theme.id}
      position="absolute"
      overlay={false}
    />
  );
}

export function ListenFieldBackdrop({ chapterId }: ListenFieldBackdropProps) {
  const incoming = listenFieldThemeForChapter(chapterId);
  const [shown, setShown] = useState(incoming);
  const [base, setBase] = useState<ListenFieldTheme | null>(null);
  const shownRef = useRef(shown);
  shownRef.current = shown;

  useEffect(() => {
    if (incoming.id === shownRef.current.id) {
      return;
    }
    setBase((current) => current ?? shownRef.current);
    setShown(incoming);
  }, [incoming]);

  return (
    <div className="absolute inset-0 bg-[#060807]">
      {base ? (
        <div className="absolute inset-0">
          <FieldMesh theme={base} />
        </div>
      ) : null}
      <motion.div
        key={shown.id}
        className="absolute inset-0"
        initial={base ? { opacity: 0 } : false}
        animate={{ opacity: 1 }}
        transition={{ duration: FIELD_FADE_SECONDS, ease: EASE_FIELD }}
        onAnimationComplete={() => {
          if (shownRef.current.id === incoming.id) {
            setBase(null);
          }
        }}
      >
        <FieldMesh theme={shown} />
      </motion.div>
    </div>
  );
}
