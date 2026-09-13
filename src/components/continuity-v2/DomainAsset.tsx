import { motion, useReducedMotion } from 'framer-motion';

import { ServiceMark } from '@/components/continuity-v2/ServiceMark';
import { EASE } from '@/components/continuity-v2/motion';
import { DetailList, Emphasis, Reveal, TechnicalDetails } from '@/components/continuity-v2/primitives';
import { CONTINUITY_DOMAIN } from '@/data/continuityHome';

const LIFECYCLE = [
  {
    label: 'Registered',
    blurb: 'The name was claimed and is held in the registrar account.',
    angle: 200,
  },
  {
    label: 'Renewed',
    blurb: 'It renews every year. Automatic renewal is the safeguard.',
    angle: 290,
  },
  {
    label: 'Connected',
    blurb: 'DNS settings tell the internet where the website lives.',
    angle: 20,
  },
  {
    label: 'Reaches Eyes Closed',
    blurb: 'A visitor typing the name arrives at the live site.',
    angle: 110,
  },
] as const;

const RING = { cx: 210, cy: 210, r: 138 };

function ringPoint(angle: number, radius = RING.r) {
  const radians = ((angle - 90) * Math.PI) / 180;
  return {
    x: RING.cx + Math.cos(radians) * radius,
    y: RING.cy + Math.sin(radians) * radius,
  };
}

export function DomainAsset() {
  const reduce = useReducedMotion();

  const practical = [
    { label: 'Registrar', value: CONTINUITY_DOMAIN.registrar },
    { label: 'Registrar account', value: CONTINUITY_DOMAIN.registrarAccount },
    { label: 'Expiration', value: CONTINUITY_DOMAIN.expirationDate },
    { label: 'Automatic renewal', value: CONTINUITY_DOMAIN.automaticRenewal },
    { label: 'Renewal payment', value: CONTINUITY_DOMAIN.renewalPayment },
    { label: 'DNS provider', value: CONTINUITY_DOMAIN.dnsProvider },
  ];

  return (
    <div className="grid grid-cols-1 gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.02fr)] lg:items-center lg:gap-20">
      <div>
        <Reveal>
          <Emphasis>Critical asset</Emphasis>
          <p className="mt-7 break-words font-sans text-[2.4rem] font-light leading-[1] tracking-[-0.045em] text-cream sm:text-[3.4rem] lg:text-[4rem]">
            {CONTINUITY_DOMAIN.name}
          </p>
          <p className="mt-5 font-sans text-[1.05rem] tracking-[0.02em] text-cream/50">
            The address of Eyes Closed
          </p>
          <p className="mt-8 max-w-[50ch] font-sans text-[15.5px] leading-[1.8] text-cream/65">
            Maintaining ownership of {CONTINUITY_DOMAIN.name} is one of the most important parts of
            continuity. Keep the registration active, and do not change its configuration without
            understanding why.
          </p>
        </Reveal>

        <Reveal className="mt-12">
          <DetailList rows={practical} />
          <TechnicalDetails
            rows={[
              { label: 'Nameservers', value: CONTINUITY_DOMAIN.nameservers },
              {
                label: 'DNS records',
                value:
                  'Read the live records at the registrar before changing anything. A wrong record disconnects the domain from the website.',
              },
            ]}
          />
        </Reveal>
      </div>

      <Reveal delay={0.1}>
        <div className="relative mx-auto w-full max-w-[480px]">
          <svg viewBox="-40 0 560 420" className="w-full" role="img" aria-label="The domain lifecycle: registered, renewed, connected, and reaching Eyes Closed.">
            <defs>
              <linearGradient id="domain-ring" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#cc5833" stopOpacity="0.65" />
                <stop offset="100%" stopColor="#f2f0e9" stopOpacity="0.5" />
              </linearGradient>
            </defs>

            <circle cx={RING.cx} cy={RING.cy} r={RING.r + 42} fill="none" stroke="rgba(242,240,233,0.06)" />
            <circle
              cx={RING.cx}
              cy={RING.cy}
              r={RING.r}
              fill="none"
              stroke="rgba(242,240,233,0.12)"
              strokeWidth={1}
            />
            <motion.circle
              cx={RING.cx}
              cy={RING.cy}
              r={RING.r}
              fill="none"
              stroke="url(#domain-ring)"
              strokeWidth={1.8}
              strokeLinecap="round"
              initial={reduce ? false : { pathLength: 0, rotate: -90 }}
              whileInView={{ pathLength: 1, rotate: -90 }}
              viewport={{ once: true }}
              transition={{ duration: 2, ease: EASE }}
              style={{ transformOrigin: `${RING.cx}px ${RING.cy}px` }}
            />

            {!reduce ? (
              <circle r={4} fill="#f2f0e9">
                <animateMotion
                  dur="16s"
                  repeatCount="indefinite"
                  path={`M ${RING.cx} ${RING.cy - RING.r} a ${RING.r} ${RING.r} 0 1 1 -0.1 0`}
                />
              </circle>
            ) : null}

            {LIFECYCLE.map((stage, index) => {
              const point = ringPoint(stage.angle);
              const labelPoint = ringPoint(stage.angle, RING.r + 34);
              const anchor =
                labelPoint.x > RING.cx + 20 ? 'start' : labelPoint.x < RING.cx - 20 ? 'end' : 'middle';
              return (
                <g key={stage.label}>
                  <motion.circle
                    cx={point.x}
                    cy={point.y}
                    r={7}
                    fill="#080a09"
                    stroke="rgba(242,240,233,0.7)"
                    strokeWidth={1.2}
                    initial={reduce ? false : { scale: 0, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.4 + index * 0.16, ease: EASE }}
                    style={{ transformOrigin: `${point.x}px ${point.y}px` }}
                  />
                  <text
                    x={labelPoint.x}
                    y={labelPoint.y + 4}
                    textAnchor={anchor}
                    className="font-sans"
                    fill="#f2f0e9"
                    fillOpacity={0.72}
                    fontSize={12.5}
                    letterSpacing={0.6}
                  >
                    {stage.label}
                  </text>
                </g>
              );
            })}

            <circle cx={RING.cx} cy={RING.cy} r={52} fill="#080a09" stroke="rgba(242,240,233,0.14)" />
            <text
              x={RING.cx}
              y={RING.cy - 4}
              textAnchor="middle"
              className="font-sans"
              fill="#f2f0e9"
              fillOpacity={0.55}
              fontSize={10.5}
              letterSpacing={2.4}
            >
              ONE NAME
            </text>
            <text
              x={RING.cx}
              y={RING.cy + 14}
              textAnchor="middle"
              className="font-sans"
              fill="#f2f0e9"
              fillOpacity={0.35}
              fontSize={10.5}
              letterSpacing={2.4}
            >
              ONE YEAR
            </text>
          </svg>

          <ul className="mt-6 flex flex-col gap-3">
            {LIFECYCLE.map((stage) => (
              <li key={stage.label} className="flex items-start gap-3">
                <ServiceMark id="domain" className="mt-0.5 size-4 shrink-0 text-cream/35" />
                <p className="font-sans text-[13.5px] leading-relaxed text-cream/55">
                  <span className="text-cream/85">{stage.label}.</span> {stage.blurb}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </Reveal>
    </div>
  );
}
