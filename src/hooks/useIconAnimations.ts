import { useLayoutEffect } from 'react';
import gsap from 'gsap';

import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

function scopeTargets(root: HTMLElement, selector: string): Element[] {
  return gsap.utils.toArray<Element>(selector, root);
}

function hasScopeTargets(root: HTMLElement, selector: string): boolean {
  return scopeTargets(root, selector).length > 0;
}

export type UseIconAnimationsOptions = {
  /**
   * Design reference surfaces (/icons, /design-system) pass true so reviewers
   * can still see the loops when the OS has Reduce Motion enabled.
   */
  ignoreReducedMotion?: boolean;
};

/**
 * GSAP loops for site iconography. Shared by /icons and /design-system.
 * Only animates selectors that exist inside the provided scope element.
 */
export function useIconAnimations(
  scope: React.RefObject<HTMLElement | null>,
  options: UseIconAnimationsOptions = {},
) {
  const reducedMotion = usePrefersReducedMotion();
  const { ignoreReducedMotion = false } = options;

  useLayoutEffect(() => {
    const root = scope.current;
    if (!root || (reducedMotion && !ignoreReducedMotion)) return;

    const ctx = gsap.context(() => {
      const $ = (selector: string) => scopeTargets(root, selector);

      if (hasScopeTargets(root, '.dna-gear')) {
        gsap.to($('.dna-gear'), { rotation: 360, repeat: -1, ease: 'none', duration: 12 });
      }
      if (hasScopeTargets(root, '.laser-line')) {
        gsap.to($('.laser-line'), { top: '100%', repeat: -1, yoyo: true, ease: 'sine.inOut', duration: 2.5 });
      }
      if (hasScopeTargets(root, '.ekg-path')) {
        gsap.to($('.ekg-path'), { strokeDashoffset: 0, repeat: -1, ease: 'none', duration: 1.5 });
      }

      if (hasScopeTargets(root, '.neural-node')) {
        gsap.to($('.neural-node'), {
          scale: 1.3,
          duration: 1.2,
          yoyo: true,
          repeat: -1,
          stagger: { each: 0.2, from: 'random' },
          ease: 'sine.inOut',
          transformOrigin: '50% 50%',
        });
      }
      if (hasScopeTargets(root, '.neural-link')) {
        gsap.to($('.neural-link'), {
          opacity: 0.3,
          duration: 1.5,
          yoyo: true,
          repeat: -1,
          stagger: { each: 0.3, from: 'random' },
          ease: 'power1.inOut',
        });
      }
      if (hasScopeTargets(root, '.molecule-group')) {
        gsap.to($('.molecule-group'), {
          rotation: 360,
          repeat: -1,
          ease: 'none',
          duration: 20,
          transformOrigin: '50% 50%',
        });
      }
      if (hasScopeTargets(root, '.molecule-atom')) {
        gsap.to($('.molecule-atom'), {
          scale: 1.4,
          duration: 1.5,
          yoyo: true,
          repeat: -1,
          stagger: 0.4,
          ease: 'sine.inOut',
          transformOrigin: '50% 50%',
        });
      }
      if (hasScopeTargets(root, '.quantum-ring-1')) {
        gsap.to($('.quantum-ring-1'), {
          rotation: 360,
          repeat: -1,
          duration: 8,
          ease: 'none',
          transformOrigin: '50% 50%',
        });
      }
      if (hasScopeTargets(root, '.quantum-ring-2')) {
        gsap.to($('.quantum-ring-2'), {
          rotation: -360,
          repeat: -1,
          duration: 12,
          ease: 'none',
          transformOrigin: '50% 50%',
        });
      }
      if (hasScopeTargets(root, '.quantum-ring-3')) {
        gsap.to($('.quantum-ring-3'), {
          rotation: 360,
          repeat: -1,
          duration: 16,
          ease: 'none',
          transformOrigin: '50% 50%',
        });
      }
      if (hasScopeTargets(root, '.quantum-core-dot')) {
        gsap.to($('.quantum-core-dot'), {
          scale: 1.5,
          opacity: 0.7,
          duration: 1,
          yoyo: true,
          repeat: -1,
          ease: 'power1.inOut',
          transformOrigin: '50% 50%',
        });
      }

      if (hasScopeTargets(root, '.observer-wave')) {
        gsap.to($('.observer-wave'), {
          scale: 2.5,
          opacity: 0,
          duration: 2.5,
          repeat: -1,
          stagger: 0.6,
          ease: 'power1.out',
          transformOrigin: '50% 50%',
        });
      }
      if (hasScopeTargets(root, '.observer-ring')) {
        gsap.to($('.observer-ring'), {
          scale: 2.5,
          opacity: 0,
          duration: 2.5,
          repeat: -1,
          stagger: 0.6,
          ease: 'power1.out',
          transformOrigin: '50% 50%',
        });
      }

      if (hasScopeTargets(root, '.space-circle-left')) {
        gsap.to($('.space-circle-left'), {
          attr: { cx: 28 },
          duration: 2.5,
          yoyo: true,
          repeat: -1,
          ease: 'power2.inOut',
        });
      }
      if (hasScopeTargets(root, '.space-circle-right')) {
        gsap.to($('.space-circle-right'), {
          attr: { cx: 72 },
          duration: 2.5,
          yoyo: true,
          repeat: -1,
          ease: 'power2.inOut',
        });
      }

      if (hasScopeTargets(root, '.wake-sun')) {
        gsap.fromTo($('.wake-sun'), { y: 15 }, { y: -10, duration: 3, yoyo: true, repeat: -1, ease: 'power2.inOut' });
      }
      if (hasScopeTargets(root, '.wake-beam')) {
        gsap.fromTo(
          $('.wake-beam'),
          { scaleY: 0, opacity: 0 },
          {
            scaleY: 1,
            opacity: 1,
            duration: 1.5,
            yoyo: true,
            repeat: -1,
            stagger: 0.15,
            ease: 'power2.out',
            transformOrigin: 'bottom center',
            delay: 1.5,
          },
        );
      }

      if (hasScopeTargets(root, '.ground-wind')) {
        gsap.to($('.ground-wind'), {
          rotation: 360,
          duration: 8,
          repeat: -1,
          ease: 'none',
          transformOrigin: '50% 50%',
        });
      }
      if (hasScopeTargets(root, '.ground-root')) {
        gsap.fromTo(
          $('.ground-root'),
          { strokeDasharray: '0 100' },
          { strokeDasharray: '100 100', duration: 3, repeat: -1, yoyo: true, ease: 'power1.inOut' },
        );
      }

      if (hasScopeTargets(root, '.fog-dot')) {
        const tlFog = gsap.timeline({ repeat: -1, yoyo: true, repeatDelay: 1 });
        tlFog.to($('.fog-dot'), {
          x: 0,
          y: 0,
          opacity: 1,
          duration: 2,
          stagger: { each: 0.05, from: 'random' },
          ease: 'power3.inOut',
        });
      }

      if (hasScopeTargets(root, '.illusion-box')) {
        gsap.to($('.illusion-box'), {
          opacity: 0,
          scale: 1.2,
          duration: 3,
          repeat: -1,
          yoyo: true,
          ease: 'power2.inOut',
          transformOrigin: '50% 50%',
        });
      }
      if (hasScopeTargets(root, '.illusion-ring')) {
        gsap.fromTo(
          $('.illusion-ring'),
          { scale: 0.8, opacity: 0 },
          {
            scale: 1,
            opacity: 1,
            duration: 3,
            repeat: -1,
            yoyo: true,
            ease: 'power2.inOut',
            delay: 1.5,
            transformOrigin: '50% 50%',
          },
        );
      }

      if (hasScopeTargets(root, '.undertow-group')) {
        const tlUnder = gsap.timeline({ repeat: -1, repeatDelay: 1 });
        tlUnder.fromTo(
          $('.undertow-group'),
          { rotation: 0 },
          { rotation: 1080, duration: 4, ease: 'power3.out', transformOrigin: '50% 50%' },
        );
      }

      if (hasScopeTargets(root, '.flow-wave')) {
        gsap.to($('.flow-wave'), { x: -100, duration: 2.5, repeat: -1, ease: 'none' });
      }

      if (hasScopeTargets(root, '.release-knot')) {
        gsap.to($('.release-knot'), {
          scale: 0.5,
          opacity: 0,
          duration: 2.5,
          repeat: -1,
          yoyo: true,
          ease: 'power2.inOut',
          transformOrigin: '50% 50%',
        });
      }
      if (hasScopeTargets(root, '.release-line')) {
        gsap.fromTo(
          $('.release-line'),
          { y: 20, opacity: 0 },
          { y: -15, opacity: 1, duration: 2, repeat: -1, yoyo: true, ease: 'power1.inOut', stagger: 0.2, delay: 1 },
        );
      }

      if (hasScopeTargets(root, '.north-needle')) {
        const tlNorth = gsap.timeline({ repeat: -1, repeatDelay: 2 });
        tlNorth
          .to($('.north-needle'), { rotation: 70, duration: 0.15, transformOrigin: '50% 50%', ease: 'power1.inOut' })
          .to($('.north-needle'), { rotation: -50, duration: 0.2, ease: 'power1.inOut' })
          .to($('.north-needle'), { rotation: 30, duration: 0.15, ease: 'power1.inOut' })
          .to($('.north-needle'), { rotation: -10, duration: 0.15, ease: 'power1.inOut' })
          .to($('.north-needle'), { rotation: 0, duration: 1.5, ease: 'elastic.out(1, 0.3)' });
      }

      if (hasScopeTargets(root, '.voice-ring')) {
        const tlVoice = gsap.timeline({ repeat: -1 });
        tlVoice
          .to($('.voice-ring'), { rotation: 180, duration: 2, ease: 'power2.inOut', transformOrigin: '50% 50%' })
          .to(
            $('.voice-ring'),
            { scale: 0.8, opacity: 0, duration: 1, ease: 'power1.in', transformOrigin: '50% 50%' },
            '+=0.5',
          )
          .to(
            $('.voice-ring'),
            { scale: 1, opacity: 1, rotation: 0, duration: 1, transformOrigin: '50% 50%' },
            '+=0.5',
          );
      }

      if (hasScopeTargets(root, '.pause-bar-left') && hasScopeTargets(root, '.pause-bar-right')) {
        const tlPause = gsap.timeline({ repeat: -1, yoyo: true, repeatDelay: 1 });
        tlPause
          .to($('.pause-bar-left'), { x: 12, duration: 1.5, ease: 'power2.inOut' }, 0)
          .to($('.pause-bar-right'), { x: -12, duration: 1.5, ease: 'power2.inOut' }, 0)
          .to($('.pause-bar-left, .pause-bar-right'), {
            scaleY: 0.2,
            duration: 1,
            ease: 'power2.inOut',
            transformOrigin: '50% 50%',
          }, 1.5);
      }

      if (
        hasScopeTargets(root, '.reflect-circle-left') &&
        hasScopeTargets(root, '.reflect-circle-right') &&
        hasScopeTargets(root, '.reflect-line')
      ) {
        const tlReflect = gsap.timeline({ repeat: -1, yoyo: true, repeatDelay: 1 });
        tlReflect
          .fromTo($('.reflect-circle-left'), { x: -20 }, { x: -5, duration: 2, ease: 'power2.inOut' }, 0)
          .fromTo($('.reflect-circle-right'), { x: 20 }, { x: 5, duration: 2, ease: 'power2.inOut' }, 0)
          .to($('.reflect-line'), { opacity: 0.2, scaleY: 0.5, duration: 1, transformOrigin: '50% 50%' }, 1);
      }

      if (hasScopeTargets(root, '.relief-box')) {
        gsap.to($('.relief-box'), {
          attr: { rx: 25, ry: 25 },
          rotation: 90,
          scale: 0.8,
          strokeWidth: 1,
          opacity: 0.5,
          duration: 2.5,
          repeat: -1,
          yoyo: true,
          ease: 'power1.inOut',
          transformOrigin: '50% 50%',
        });
      }

      if (hasScopeTargets(root, '.trigger-arrow') && hasScopeTargets(root, '.trigger-shield')) {
        const tlTrigger = gsap.timeline({ repeat: -1, repeatDelay: 1 });
        tlTrigger
          .to($('.trigger-arrow'), { x: 15, duration: 0.5, ease: 'power2.in' })
          .to(
            $('.trigger-shield'),
            { x: 5, scaleX: 0.6, duration: 0.5, ease: 'power2.out', transformOrigin: 'center left' },
            '<',
          )
          .to($('.trigger-shield'), { x: 0, scaleX: 1, duration: 1, ease: 'elastic.out(1, 0.3)' })
          .to($('.trigger-arrow'), { x: 0, duration: 1, ease: 'elastic.out(1, 0.3)' }, '<0.1');
      }

      if (hasScopeTargets(root, '.shift-diamond') && hasScopeTargets(root, '.shift-core')) {
        const tlShift = gsap.timeline({ repeat: -1, yoyo: true, repeatDelay: 1 });
        tlShift
          .to($('.shift-diamond'), {
            rotation: 45,
            scale: 0.8,
            duration: 1.5,
            ease: 'power2.inOut',
            transformOrigin: '50% 50%',
          })
          .to(
            $('.shift-core'),
            { scale: 3, opacity: 0.8, duration: 1.5, ease: 'power2.inOut', transformOrigin: '50% 50%' },
            '<',
          );
      }

      if (hasScopeTargets(root, '.tangle-chaos') && hasScopeTargets(root, '.tangle-straight')) {
        const tlTangle = gsap.timeline({ repeat: -1, yoyo: true, repeatDelay: 1 });
        tlTangle
          .to($('.tangle-chaos'), {
            opacity: 0,
            scale: 0.8,
            duration: 1.5,
            ease: 'power1.inOut',
            transformOrigin: '50% 50%',
          }, 0)
          .fromTo(
            $('.tangle-straight'),
            { opacity: 0, scaleX: 0 },
            {
              opacity: 1,
              scaleX: 1,
              duration: 1.5,
              ease: 'power2.inOut',
              transformOrigin: '50% 50%',
            },
            0.5,
          );
      }

      if (hasScopeTargets(root, '.anchor-pendulum')) {
        gsap.fromTo(
          $('.anchor-pendulum'),
          { rotation: -18, immediateRender: true, svgOrigin: '50 20' },
          {
            rotation: 18,
            duration: 2.8,
            ease: 'sine.inOut',
            yoyo: true,
            repeat: -1,
            svgOrigin: '50 20',
          },
        );
      }

      if (hasScopeTargets(root, '.formless-ring')) {
        gsap.to($('.formless-ring'), {
          scale: 2,
          opacity: 0,
          duration: 4,
          repeat: -1,
          ease: 'power1.out',
          stagger: 1.3,
          transformOrigin: '50% 50%',
        });
      }

      if (hasScopeTargets(root, '.rift-lines line') && hasScopeTargets(root, '.rift-core')) {
        const tlRift = gsap.timeline({ repeat: -1, yoyo: true, repeatDelay: 1 });
        const riftLines = $('.rift-lines line');
        tlRift
          .to(
            riftLines,
            {
              x: (i, _target, targets) => {
                const center = targets.length / 2;
                const dist = i - center;
                return dist * Math.abs(dist) * 0.15;
              },
              strokeOpacity: (i, _target, targets) => {
                const dist = Math.abs(i - targets.length / 2);
                return dist < 8 ? 0 : 1;
              },
              duration: 3,
              ease: 'power2.inOut',
            },
            0,
          )
          .to($('.rift-core'), {
            opacity: 0.9,
            scale: 1.5,
            duration: 3,
            ease: 'power2.inOut',
            transformOrigin: '50% 50%',
          }, 0);
      }

      if (hasScopeTargets(root, '.horizon-ring')) {
        const rings = $('.horizon-ring');
        rings.forEach((ring, i) => {
          gsap.fromTo(
            ring,
            { scale: 0.15, opacity: 0, transformOrigin: '50% 50%' },
            {
              keyframes: [
                { opacity: 0.85, scale: 4, duration: 1, ease: 'power1.out' },
                { opacity: 0, scale: 22, duration: 3, ease: 'power2.in' },
              ],
              repeat: -1,
              delay: (i * 4) / rings.length,
              transformOrigin: '50% 50%',
            },
          );
        });
      }

      if (hasScopeTargets(root, '.tangle-arm')) {
        gsap.to($('.tangle-arm'), {
          attr: { d: 'M 0 0 Q 75 -75 150 0' },
          duration: 1.5,
          yoyo: true,
          repeat: -1,
          ease: 'sine.inOut',
          stagger: { each: 0.05, from: 'random' },
        });
      }
      if (hasScopeTargets(root, '.tangle-group')) {
        gsap.to($('.tangle-group'), {
          rotation: 360,
          duration: 40,
          repeat: -1,
          ease: 'none',
          transformOrigin: '50% 50%',
        });
      }
    }, root);

    return () => ctx.revert();
  }, [scope, reducedMotion, ignoreReducedMotion]);
}
