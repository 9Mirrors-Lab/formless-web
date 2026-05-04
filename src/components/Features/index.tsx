import { DiagnosticShuffler } from './DiagnosticShuffler';
import { TelemetryTypewriter } from './TelemetryTypewriter';
import { ProtocolScheduler } from './ProtocolScheduler';

export function Features() {
  return (
    <section id="features" className="w-full py-32 px-6 md:px-16 lg:px-24 bg-cream relative z-20">
      <div className="max-w-7xl mx-auto">
        <div className="mb-20 max-w-2xl">
          <span className="font-mono text-xs tracking-[0.2em] text-moss uppercase mb-4 block">System Capabilities</span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-sans font-bold text-charcoal leading-[1.1] tracking-tight">
            The Precision<br />Micro-UI Dashboard.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12 lg:gap-8 items-center">
          <div className="w-full h-[400px] lg:h-[450px]">
            <DiagnosticShuffler />
          </div>
          <div className="w-full h-[400px] lg:h-[450px]">
            <TelemetryTypewriter />
          </div>
          <div className="w-full h-[400px] lg:h-[450px]">
            <ProtocolScheduler />
          </div>
        </div>
      </div>
    </section>
  );
}
