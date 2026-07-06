import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sparkles, Store, Building2, ShieldCheck, Cpu, ArrowRight, Zap, Globe } from "lucide-react";

export default function HomePage() {
  return (
    <div className="space-y-16 pb-24">
      {/* Futuristic Cyber Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-16 md:pt-20 md:pb-28 border-b border-[var(--border)]">
        <div className="absolute inset-0 bg-cyber-grid opacity-50 pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[500px] rounded-full bg-gradient-to-tr from-[var(--primary)]/20 via-[var(--ring)]/15 to-transparent blur-3xl pointer-events-none" />

        <div className="relative z-10 mx-auto max-w-5xl px-6 text-center space-y-8">
          <div className="inline-flex items-center gap-2 rounded-full bg-[var(--primary)]/10 border border-[var(--primary)]/30 px-4 py-1.5 text-xs font-mono font-bold text-[var(--primary)] uppercase tracking-widest shadow-glow-blue animate-pulse">
            <Sparkles className="size-3.5 text-[var(--ring)]" />
            <span>Next-Gen Exhibition Space Matrix</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight leading-tight text-[var(--foreground)]">
            Architecting Global <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-[var(--primary)] via-[var(--blue-400)] to-[var(--ring)] bg-clip-text text-transparent">
              Exhibition Spaces
            </span>{" "}
            in Real-Time.
          </h1>

          <p className="mx-auto max-w-2xl text-base sm:text-lg text-[var(--muted-foreground)] leading-relaxed font-normal">
            Experience interactive floor blueprints, instant 256-bit corporate checkout, and AI-powered venue zoning with <strong className="text-[var(--foreground)]">Clausis Reserve</strong>.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Button
              asChild
              size="lg"
              className="w-full sm:w-auto rounded-xl bg-gradient-to-r from-[var(--primary)] via-[var(--blue-600)] to-[var(--ring)] text-[var(--primary-foreground)] font-bold shadow-glow-yellow hover:opacity-95 px-8 h-12 text-base transition-all duration-300 hover:scale-105"
            >
              <Link to="/events" className="flex items-center gap-2">
                <Store className="size-5" />
                <span>Explore Floor Matrix</span>
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="w-full sm:w-auto rounded-xl border-[var(--border)] bg-[var(--card)]/80 backdrop-blur-md hover:bg-[var(--accent)] text-[var(--foreground)] font-semibold px-8 h-12 text-base transition-all hover:border-[var(--ring)]"
            >
              <Link to="/venues" className="flex items-center gap-2">
                <Building2 className="size-5 text-[var(--primary)]" />
                <span>Discover Global Venues</span>
              </Link>
            </Button>
          </div>

          {/* Cyber Live Stats Bar */}
          <div className="pt-8 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto text-left">
            <div className="rounded-xl border border-[var(--border)] bg-[var(--card)]/60 backdrop-blur-md p-4 space-y-1">
              <p className="text-[10px] font-mono font-bold uppercase tracking-wider text-[var(--muted-foreground)] flex items-center gap-1">
                <Zap className="size-3 text-amber-500" /> Latency
              </p>
              <p className="text-lg font-black text-[var(--foreground)]">&lt; 12ms Sync</p>
            </div>
            <div className="rounded-xl border border-[var(--border)] bg-[var(--card)]/60 backdrop-blur-md p-4 space-y-1">
              <p className="text-[10px] font-mono font-bold uppercase tracking-wider text-[var(--muted-foreground)] flex items-center gap-1">
                <Globe className="size-3 text-blue-500" /> Coverage
              </p>
              <p className="text-lg font-black text-[var(--foreground)]">48+ Countries</p>
            </div>
            <div className="rounded-xl border border-[var(--border)] bg-[var(--card)]/60 backdrop-blur-md p-4 space-y-1">
              <p className="text-[10px] font-mono font-bold uppercase tracking-wider text-[var(--muted-foreground)] flex items-center gap-1">
                <ShieldCheck className="size-3 text-green-500" /> Security
              </p>
              <p className="text-lg font-black text-[var(--foreground)]">256-Bit SSL</p>
            </div>
            <div className="rounded-xl border border-[var(--border)] bg-[var(--card)]/60 backdrop-blur-md p-4 space-y-1">
              <p className="text-[10px] font-mono font-bold uppercase tracking-wider text-[var(--muted-foreground)] flex items-center gap-1">
                <Cpu className="size-3 text-[var(--ring)]" /> AI Pricing
              </p>
              <p className="text-lg font-black text-[var(--foreground)]">Active Engine</p>
            </div>
          </div>
        </div>
      </section>

      {/* Cyber Feature Bento Grid */}
      <section className="mx-auto max-w-6xl px-6 space-y-10">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Engineered for Commercial Excellence
          </h2>
          <p className="text-sm text-[var(--muted-foreground)]">
            Our portal bridges physical exhibition architecture with digital lease automation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="group rounded-2xl border border-[var(--border)] bg-[var(--card)]/80 backdrop-blur-md p-8 shadow-sm hover:shadow-glow-blue transition-all duration-300 space-y-4">
            <div className="flex size-12 items-center justify-center rounded-2xl bg-[var(--primary)]/10 text-[var(--primary)] border border-[var(--primary)]/30 group-hover:scale-110 transition-transform">
              <Store className="size-6" />
            </div>
            <h3 className="text-lg font-bold">Interactive Floor Matrix</h3>
            <p className="text-xs text-[var(--muted-foreground)] leading-relaxed">
              Navigate real-time venue blueprints with sub-meter accuracy. Click any available green booth to instantly place a 24-hour commercial hold.
            </p>
          </div>

          <div className="group rounded-2xl border border-[var(--border)] bg-[var(--card)]/80 backdrop-blur-md p-8 shadow-sm hover:shadow-glow-yellow transition-all duration-300 space-y-4">
            <div className="flex size-12 items-center justify-center rounded-2xl bg-[var(--ring)]/10 text-[var(--ring)] border border-[var(--ring)]/30 group-hover:scale-110 transition-transform">
              <ShieldCheck className="size-6" />
            </div>
            <h3 className="text-lg font-bold">Enterprise Checkout & VAT</h3>
            <p className="text-xs text-[var(--muted-foreground)] leading-relaxed">
              Seamlessly transition from reservation holds to confirmed leases via encrypted Stripe card processing or approved corporate electronic tax invoicing.
            </p>
          </div>

          <div className="group rounded-2xl border border-[var(--border)] bg-[var(--card)]/80 backdrop-blur-md p-8 shadow-sm hover:shadow-glow-blue transition-all duration-300 space-y-4">
            <div className="flex size-12 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-500 border border-blue-500/30 group-hover:scale-110 transition-transform">
              <Cpu className="size-6" />
            </div>
            <h3 className="text-lg font-bold">Dynamic Smart Zoning</h3>
            <p className="text-xs text-[var(--muted-foreground)] leading-relaxed">
              Our automated pricing engine calculates real-time booth valuations based on square footage, hall traffic density, and commercial genre demand.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
