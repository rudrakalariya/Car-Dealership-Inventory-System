import { lazy, Suspense } from "react";
import { ClientOnly } from "@/components/ClientOnly";

const Car3D = lazy(() => import("@/components/Car3D"));

export function HeroSide() {
  return (
    <div className="relative hidden overflow-hidden bg-gradient-to-br from-secondary via-card to-background lg:block">
      <div className="absolute inset-0 grid-bg" />
      <div className="absolute inset-0" style={{ background: "var(--gradient-hero)" }} />
      <ClientOnly>
        <Suspense fallback={null}>
          <Car3D className="absolute inset-0" />
        </Suspense>
      </ClientOnly>
      <div className="pointer-events-none absolute bottom-16 left-16 right-16 z-10">
        <div className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
          Drive. Configure. Own.
        </div>
        <h2 className="mt-3 font-display text-4xl font-bold leading-tight text-foreground">
          A marketplace built <br /> for people who <span className="text-gradient">love cars</span>
          .
        </h2>
      </div>
    </div>
  );
}
