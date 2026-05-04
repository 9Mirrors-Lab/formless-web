/**
 * Design System Foundations
 * Visual documentation of all design tokens extracted from Tailwind v4 @theme.
 * Captured into Figma as a Foundations page.
 */

const colors = {
  Brand: [
    { name: 'Moss', token: 'moss', hex: '#2E4036', textLight: true },
    { name: 'Clay', token: 'clay', hex: '#CC5833', textLight: true },
    { name: 'Cream', token: 'cream', hex: '#F2F0E9', textLight: false },
    { name: 'Charcoal', token: 'charcoal', hex: '#1A1A1A', textLight: true },
  ],
  'Moss Scale': [
    { name: 'Moss 900', token: 'moss-900', hex: '#1A2520', textLight: true },
    { name: 'Moss 700', token: 'moss-700', hex: '#243229', textLight: true },
    { name: 'Moss 500', token: 'moss-500', hex: '#2E4036', textLight: true },
    { name: 'Moss 300', token: 'moss-300', hex: '#4E6B5C', textLight: true },
    { name: 'Moss 100', token: 'moss-100', hex: '#A8C0B2', textLight: false },
  ],
  'Clay Scale': [
    { name: 'Clay 900', token: 'clay-900', hex: '#7A3420', textLight: true },
    { name: 'Clay 700', token: 'clay-700', hex: '#A34323', textLight: true },
    { name: 'Clay 500', token: 'clay-500', hex: '#CC5833', textLight: true },
    { name: 'Clay 300', token: 'clay-300', hex: '#E07A52', textLight: false },
    { name: 'Clay 100', token: 'clay-100', hex: '#F2C4B0', textLight: false },
  ],
  Neutral: [
    { name: 'White', token: 'white', hex: '#FFFFFF', textLight: false },
    { name: 'Cream', token: 'cream', hex: '#F2F0E9', textLight: false },
    { name: 'Cream Dark', token: 'cream-dark', hex: '#E8E5DA', textLight: false },
    { name: 'Charcoal Light', token: 'charcoal-light', hex: '#3A3A3A', textLight: true },
    { name: 'Charcoal', token: 'charcoal', hex: '#1A1A1A', textLight: true },
  ],
  Semantic: [
    { name: 'Background', token: 'bg', hex: '#F2F0E9', textLight: false },
    { name: 'Surface', token: 'surface', hex: '#FFFFFF', textLight: false },
    { name: 'Surface Dark', token: 'surface-dark', hex: '#1A1A1A', textLight: true },
    { name: 'Text Primary', token: 'text-primary', hex: '#1A1A1A', textLight: true },
    { name: 'Text Muted', token: 'text-muted', hex: '#1A1A1A99', textLight: true },
    { name: 'Accent', token: 'accent', hex: '#CC5833', textLight: true },
    { name: 'Accent Alt', token: 'accent-alt', hex: '#2E4036', textLight: true },
  ],
};

const typeScale = [
  { label: 'Display / Hero', size: '7.5rem', weight: 700, family: 'Plus Jakarta Sans', tracking: '-0.02em', lineHeight: '1.05' },
  { label: 'Display LG', size: '6.5rem', weight: 700, family: 'Plus Jakarta Sans', tracking: '-0.02em', lineHeight: '1.05' },
  { label: 'Display MD', size: '5rem', weight: 700, family: 'Plus Jakarta Sans', tracking: '-0.02em', lineHeight: '1.1' },
  { label: 'Heading 1', size: '3.75rem', weight: 700, family: 'Plus Jakarta Sans', tracking: '-0.01em', lineHeight: '1.1' },
  { label: 'Heading 2', size: '3rem', weight: 700, family: 'Plus Jakarta Sans', tracking: '-0.01em', lineHeight: '1.15' },
  { label: 'Heading 3', size: '2.25rem', weight: 600, family: 'Plus Jakarta Sans', tracking: '0', lineHeight: '1.2' },
  { label: 'Heading 4', size: '1.5rem', weight: 600, family: 'Plus Jakarta Sans', tracking: '0', lineHeight: '1.3' },
  { label: 'Body LG', size: '1.25rem', weight: 400, family: 'Plus Jakarta Sans', tracking: '0', lineHeight: '1.6' },
  { label: 'Body', size: '1rem', weight: 400, family: 'Plus Jakarta Sans', tracking: '0', lineHeight: '1.65' },
  { label: 'Body SM', size: '0.875rem', weight: 400, family: 'Plus Jakarta Sans', tracking: '0', lineHeight: '1.65' },
  { label: 'Label', size: '0.75rem', weight: 500, family: 'Plus Jakarta Sans', tracking: '0.1em', lineHeight: '1.5' },
  { label: 'Caption', size: '0.75rem', weight: 400, family: 'Plus Jakarta Sans', tracking: '0.2em', lineHeight: '1.5' },
];

const serifScale = [
  { label: 'Serif Display', size: '6.5rem', weight: 300, family: 'Cormorant Garamond', tracking: '0', lineHeight: '1.1', italic: true },
  { label: 'Serif XL', size: '4rem', weight: 300, family: 'Cormorant Garamond', tracking: '0', lineHeight: '1.2', italic: true },
  { label: 'Serif LG', size: '3rem', weight: 400, family: 'Cormorant Garamond', tracking: '0', lineHeight: '1.25', italic: true },
  { label: 'Serif MD', size: '1.5rem', weight: 400, family: 'Cormorant Garamond', tracking: '0', lineHeight: '1.4', italic: true },
  { label: 'Serif Body', size: '1.125rem', weight: 400, family: 'Cormorant Garamond', tracking: '0', lineHeight: '1.6', italic: true },
];

const monoScale = [
  { label: 'Mono SM', size: '0.75rem', weight: 400, tracking: '0.2em' },
  { label: 'Mono Base', size: '0.875rem', weight: 400, tracking: '0.1em' },
  { label: 'Mono LG', size: '1rem', weight: 400, tracking: '0.05em' },
];

const spacing = [
  { token: 'space-1', value: '0.25rem', px: '4px' },
  { token: 'space-2', value: '0.5rem', px: '8px' },
  { token: 'space-3', value: '0.75rem', px: '12px' },
  { token: 'space-4', value: '1rem', px: '16px' },
  { token: 'space-6', value: '1.5rem', px: '24px' },
  { token: 'space-8', value: '2rem', px: '32px' },
  { token: 'space-10', value: '2.5rem', px: '40px' },
  { token: 'space-12', value: '3rem', px: '48px' },
  { token: 'space-16', value: '4rem', px: '64px' },
  { token: 'space-20', value: '5rem', px: '80px' },
  { token: 'space-24', value: '6rem', px: '96px' },
  { token: 'space-32', value: '8rem', px: '128px' },
];

const radii = [
  { token: 'radius-sm', value: '0.25rem', label: 'SM: 4px', tailwind: 'rounded-sm' },
  { token: 'radius-md', value: '0.5rem', label: 'MD: 8px', tailwind: 'rounded-md' },
  { token: 'radius-lg', value: '0.75rem', label: 'LG: 12px', tailwind: 'rounded-lg' },
  { token: 'radius-xl', value: '1rem', label: 'XL: 16px', tailwind: 'rounded-xl' },
  { token: 'radius-2xl', value: '1.5rem', label: '2XL: 24px', tailwind: 'rounded-2xl' },
  { token: 'radius-card', value: '2rem', label: 'Card: 32px', tailwind: 'rounded-[2rem]' },
  { token: 'radius-card-lg', value: '3rem', label: 'Card LG: 48px', tailwind: 'rounded-[3rem]' },
  { token: 'radius-section', value: '4rem', label: 'Section: 64px', tailwind: 'rounded-[4rem]' },
  { token: 'radius-full', value: '9999px', label: 'Full: pill', tailwind: 'rounded-full' },
];

const shadows = [
  { token: 'shadow-sm', css: '0 1px 2px rgba(0,0,0,0.05)', label: 'SM' },
  { token: 'shadow-md', css: '0 4px 6px rgba(0,0,0,0.07), 0 2px 4px rgba(0,0,0,0.05)', label: 'MD' },
  { token: 'shadow-lg', css: '0 10px 15px rgba(0,0,0,0.1), 0 4px 6px rgba(0,0,0,0.05)', label: 'LG' },
  { token: 'shadow-xl', css: '0 20px 25px rgba(0,0,0,0.1), 0 10px 10px rgba(0,0,0,0.04)', label: 'XL' },
  { token: 'shadow-2xl', css: '0 25px 50px rgba(0,0,0,0.25)', label: '2XL' },
  { token: 'shadow-moss', css: '0 8px 32px rgba(46,64,54,0.18)', label: 'Moss' },
  { token: 'shadow-clay', css: '0 8px 24px rgba(204,88,51,0.25)', label: 'Clay' },
];

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: '80px' }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: '16px',
        marginBottom: '32px', paddingBottom: '16px',
        borderBottom: '1px solid #1a1a1a14',
      }}>
        <span style={{
          fontFamily: 'ui-monospace, monospace', fontSize: '10px',
          letterSpacing: '0.2em', textTransform: 'uppercase',
          color: '#2e4036', fontWeight: 500,
        }}>Foundations</span>
        <span style={{ color: '#1a1a1a20', fontSize: '12px' }}>/</span>
        <h2 style={{
          fontFamily: '"Plus Jakarta Sans", sans-serif', fontSize: '22px',
          fontWeight: 700, color: '#1a1a1a', margin: 0, letterSpacing: '-0.01em',
        }}>{title}</h2>
      </div>
      {children}
    </div>
  );
}

export default function DesignSystem() {
  return (
    <div style={{
      fontFamily: '"Plus Jakarta Sans", sans-serif',
      backgroundColor: '#F2F0E9',
      minHeight: '100vh',
      padding: '80px 96px',
      color: '#1a1a1a',
    }}>
      {/* Header */}
      <div style={{ marginBottom: '96px' }}>
        <span style={{
          fontFamily: 'ui-monospace, monospace', fontSize: '11px',
          letterSpacing: '0.25em', textTransform: 'uppercase',
          color: '#2e4036', display: 'block', marginBottom: '12px',
        }}>Formless: Design System v1.0</span>
        <h1 style={{
          fontSize: '56px', fontWeight: 800, letterSpacing: '-0.03em',
          color: '#1a1a1a', margin: '0 0 20px',
          fontFamily: '"Plus Jakarta Sans", sans-serif',
        }}>Foundations</h1>
        <p style={{
          fontSize: '18px', color: '#1a1a1a80', maxWidth: '480px',
          lineHeight: '1.6', fontWeight: 400,
        }}>
          Tokens extracted from Tailwind v4 <code style={{ fontFamily: 'monospace', fontSize: '14px', background: '#1a1a1a0d', padding: '2px 6px', borderRadius: '4px' }}>@theme</code>.
          Colors · Typography · Spacing · Radius · Shadows.
        </p>
      </div>

      {/* ── COLOR ───────────────────────────────── */}
      <Section title="Color">
        {Object.entries(colors).map(([group, swatches]) => (
          <div key={group} style={{ marginBottom: '40px' }}>
            <p style={{
              fontSize: '11px', fontFamily: 'monospace',
              letterSpacing: '0.15em', textTransform: 'uppercase',
              color: '#1a1a1a50', marginBottom: '12px',
            }}>{group}</p>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {swatches.map(s => (
                <div key={s.token} style={{
                  width: '120px', borderRadius: '12px', overflow: 'hidden',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                  border: s.hex === '#FFFFFF' ? '1px solid #1a1a1a10' : 'none',
                }}>
                  <div style={{
                    height: '72px', backgroundColor: s.hex,
                    display: 'flex', alignItems: 'flex-end',
                    padding: '8px',
                  }}>
                    <span style={{
                      fontSize: '9px', fontFamily: 'monospace',
                      letterSpacing: '0.05em',
                      color: s.textLight ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.5)',
                    }}>{s.hex}</span>
                  </div>
                  <div style={{
                    padding: '8px 10px 10px',
                    backgroundColor: 'white',
                  }}>
                    <p style={{ margin: 0, fontSize: '11px', fontWeight: 600, color: '#1a1a1a' }}>{s.name}</p>
                    <p style={{ margin: 0, fontSize: '10px', fontFamily: 'monospace', color: '#1a1a1a50', letterSpacing: '0.05em' }}>{s.token}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </Section>

      {/* ── TYPOGRAPHY ──────────────────────────── */}
      <Section title="Typography">
        {/* Sans */}
        <div style={{ marginBottom: '48px' }}>
          <p style={{ fontSize: '11px', fontFamily: 'monospace', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#1a1a1a50', marginBottom: '20px' }}>
            Sans: Plus Jakarta Sans
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
            {typeScale.map((t, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'baseline', gap: '32px',
                padding: '16px 0',
                borderBottom: '1px solid #1a1a1a08',
              }}>
                <div style={{ width: '140px', flexShrink: 0 }}>
                  <p style={{ margin: 0, fontSize: '10px', fontFamily: 'monospace', letterSpacing: '0.1em', color: '#2e4036', textTransform: 'uppercase' }}>{t.label}</p>
                  <p style={{ margin: '2px 0 0', fontSize: '9px', fontFamily: 'monospace', color: '#1a1a1a40' }}>{t.size} / {t.weight} / {t.lineHeight}</p>
                </div>
                <span style={{
                  fontFamily: `"Plus Jakarta Sans", sans-serif`,
                  fontSize: t.size,
                  fontWeight: t.weight,
                  letterSpacing: t.tracking,
                  lineHeight: t.lineHeight,
                  color: '#1a1a1a',
                  flexShrink: 1,
                  overflow: 'hidden',
                  whiteSpace: 'nowrap',
                  textOverflow: 'ellipsis',
                  maxWidth: '800px',
                }}>Formless</span>
              </div>
            ))}
          </div>
        </div>

        {/* Serif */}
        <div style={{ marginBottom: '48px' }}>
          <p style={{ fontSize: '11px', fontFamily: 'monospace', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#1a1a1a50', marginBottom: '20px' }}>
            Serif: Cormorant Garamond
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
            {serifScale.map((t, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'baseline', gap: '32px',
                padding: '16px 0',
                borderBottom: '1px solid #1a1a1a08',
              }}>
                <div style={{ width: '140px', flexShrink: 0 }}>
                  <p style={{ margin: 0, fontSize: '10px', fontFamily: 'monospace', letterSpacing: '0.1em', color: '#cc5833', textTransform: 'uppercase' }}>{t.label}</p>
                  <p style={{ margin: '2px 0 0', fontSize: '9px', fontFamily: 'monospace', color: '#1a1a1a40' }}>{t.size} / {t.weight}</p>
                </div>
                <span style={{
                  fontFamily: '"Cormorant Garamond", serif',
                  fontSize: t.size,
                  fontWeight: t.weight,
                  letterSpacing: t.tracking,
                  lineHeight: t.lineHeight,
                  fontStyle: t.italic ? 'italic' : 'normal',
                  color: '#1a1a1a',
                }}>The bridge between nature and science.</span>
              </div>
            ))}
          </div>
        </div>

        {/* Mono */}
        <div>
          <p style={{ fontSize: '11px', fontFamily: 'monospace', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#1a1a1a50', marginBottom: '20px' }}>
            Mono: System Monospace
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
            {monoScale.map((t, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'baseline', gap: '32px',
                padding: '16px 0',
                borderBottom: '1px solid #1a1a1a08',
              }}>
                <div style={{ width: '140px', flexShrink: 0 }}>
                  <p style={{ margin: 0, fontSize: '10px', fontFamily: 'monospace', letterSpacing: '0.1em', color: '#1a1a1a60', textTransform: 'uppercase' }}>{t.label}</p>
                  <p style={{ margin: '2px 0 0', fontSize: '9px', fontFamily: 'monospace', color: '#1a1a1a40' }}>{t.size} / tracking {t.tracking}</p>
                </div>
                <span style={{
                  fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
                  fontSize: t.size,
                  fontWeight: t.weight,
                  letterSpacing: t.tracking,
                  color: '#1a1a1a',
                }}>SYSTEM.OPERATIONAL • PHASE.01</span>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* ── SPACING ─────────────────────────────── */}
      <Section title="Spacing">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {spacing.map(s => (
            <div key={s.token} style={{
              display: 'flex', alignItems: 'center', gap: '20px',
            }}>
              <div style={{ width: '100px', flexShrink: 0 }}>
                <p style={{ margin: 0, fontSize: '10px', fontFamily: 'monospace', color: '#2e4036', letterSpacing: '0.1em' }}>{s.token}</p>
                <p style={{ margin: '2px 0 0', fontSize: '9px', fontFamily: 'monospace', color: '#1a1a1a40' }}>{s.value} · {s.px}</p>
              </div>
              <div style={{
                height: '24px',
                width: s.value,
                backgroundColor: '#2e4036',
                borderRadius: '3px',
                minWidth: '4px',
                maxWidth: '512px',
              }} />
              <span style={{ fontSize: '11px', fontFamily: 'monospace', color: '#1a1a1a40' }}>{s.px}</span>
            </div>
          ))}
        </div>
      </Section>

      {/* ── BORDER RADIUS ───────────────────────── */}
      <Section title="Border Radius">
        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
          {radii.map(r => (
            <div key={r.token} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: r.token === 'radius-full' ? '80px' : '80px',
                height: '80px',
                backgroundColor: '#2e4036',
                borderRadius: r.value,
                opacity: 0.85,
              }} />
              <div style={{ textAlign: 'center' }}>
                <p style={{ margin: 0, fontSize: '10px', fontFamily: 'monospace', color: '#2e4036', letterSpacing: '0.05em' }}>{r.token}</p>
                <p style={{ margin: '2px 0 0', fontSize: '9px', fontFamily: 'monospace', color: '#1a1a1a50' }}>{r.value}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* ── SHADOWS ─────────────────────────────── */}
      <Section title="Shadows">
        <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
          {shadows.map(s => (
            <div key={s.token} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px' }}>
              <div style={{
                width: '112px',
                height: '80px',
                backgroundColor: 'white',
                borderRadius: '16px',
                boxShadow: s.css,
              }} />
              <div style={{ textAlign: 'center' }}>
                <p style={{ margin: 0, fontSize: '10px', fontFamily: 'monospace', color: '#1a1a1a', letterSpacing: '0.05em' }}>{s.token}</p>
                <p style={{ margin: '2px 0 0', fontSize: '9px', fontFamily: 'monospace', color: '#1a1a1a50' }}>{s.label}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}
