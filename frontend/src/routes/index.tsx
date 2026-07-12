import { createFileRoute, Link } from "@tanstack/react-router";
import { lazy, Suspense, useEffect, useState } from "react";
import { motion } from "motion/react";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { VehicleCard } from "@/components/VehicleCard";
import { vehicleApi } from "@/services/api";
import type { Vehicle } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";
import { ClientOnly } from "@/components/ClientOnly";
import { useAuth } from "@/hooks/use-auth";

const Car3D = lazy(() => import("@/components/Car3D"));

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const { user } = useAuth();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [featuredIdx, setFeaturedIdx] = useState(0);

  useEffect(() => {
    if (user) {
      setLoading(true);
      vehicleApi
        .list()
        .then((v) => {
          setVehicles(v);
          setLoading(false);
        })
        .catch(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [user]);

  const featured = vehicles.slice(0, 5);
  const current = featured[featuredIdx];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar transparent />

      {/* HERO */}
      <section className="relative h-[85vh] min-h-[640px] w-full overflow-hidden">
        <div className="absolute inset-0 grid-bg" />
        <div className="absolute inset-0" style={{ background: "var(--gradient-hero)" }} />

        <ClientOnly
          fallback={
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-64 w-96 animate-pulse rounded-full bg-primary/10 blur-3xl" />
            </div>
          }
        >
          <Suspense fallback={null}>
            <Car3D className="absolute inset-0 h-full w-full" />
          </Suspense>
        </ClientOnly>

        <div className="pointer-events-none absolute inset-0 flex flex-col">
          <div className="flex-1" />
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="pointer-events-auto mx-auto w-full max-w-7xl px-6 pb-16"
          >
            <div className="max-w-xl md:ml-auto">
              <div className="mb-4 text-xs uppercase tracking-[0.3em] text-muted-foreground">
                — Featured this week
              </div>
              <h1 className="font-display text-5xl font-bold leading-[1.05] md:text-6xl lg:text-7xl">
                Your next car
                <br />
                is <span className="text-gradient">closer</span> than you think.
              </h1>
              <p className="mt-6 max-w-md text-base text-muted-foreground">
                A curated marketplace for people who care about how they get somewhere.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {user && (
        <>
          {/* FEATURED CAROUSEL */}
          <section className="relative overflow-hidden py-24">
            <div className="mx-auto max-w-7xl px-6">
              <div className="mb-12 flex items-end justify-between">
                <div>
                  <div className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                    Configurator
                  </div>
                  <h2 className="mt-2 font-display text-4xl font-bold md:text-5xl">
                    Featured vehicles
                  </h2>
                </div>
                <div className="hidden gap-2 md:flex">
                  <button
                    onClick={() =>
                      setFeaturedIdx(
                        (i) => (i - 1 + featured.length) % Math.max(featured.length, 1),
                      )
                    }
                    className="flex h-12 w-12 items-center justify-center rounded-full border border-border hover:bg-card"
                    disabled={!featured.length}
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => setFeaturedIdx((i) => (i + 1) % Math.max(featured.length, 1))}
                    className="flex h-12 w-12 items-center justify-center rounded-full border border-border hover:bg-card"
                    disabled={!featured.length}
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {current ? (
                <motion.div
                  key={current.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4 }}
                  className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-secondary via-card to-background p-10 md:p-16"
                >
                  <div className="grid gap-8 md:grid-cols-2 md:items-center">
                    <div>
                      <div className="text-xs font-bold uppercase tracking-[0.3em] text-muted-foreground">
                        {current.make}
                      </div>
                      <h3 className="mt-2 font-display text-5xl font-bold md:text-6xl">
                        {current.model}
                      </h3>
                      <div className="mt-3 text-sm text-muted-foreground">{current.category}</div>

                      {current.description && current.description.includes("•") ? (
                        <div className="mt-8 flex flex-wrap gap-8">
                          {current.description.split("•").map((part, idx) => {
                            const labels = ["HORSEPOWER", "0-100 KM/H", "RANGE"];
                            const label = labels[idx] || "SPEC";
                            let val = part.trim();
                            // Clean up the text slightly to match the screenshot if possible
                            if (idx === 1) val = val.replace("0-100 km/h", "").trim();
                            if (idx === 2) val = val.replace("range", "").trim();

                            return (
                              <div key={idx} className="flex flex-col gap-1">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                                  {label}
                                </span>
                                <span className="font-display text-xl font-bold">{val}</span>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="mt-8 text-sm text-muted-foreground line-clamp-3">
                          {current.description || "No description available."}
                        </div>
                      )}

                      <div className="mt-10">
                        <Button
                          asChild
                          className="rounded-full bg-[#00A3FF] text-white hover:bg-[#008DD6] px-8 py-6 font-bold"
                        >
                          <Link to="/catalog">
                            Configure — ${Number(current.price).toLocaleString()}
                          </Link>
                        </Button>
                      </div>
                    </div>
                    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-black/20 flex items-center justify-center">
                      {current.image_url ? (
                        <img
                          src={current.image_url}
                          alt={`${current.make} ${current.model}`}
                          className="absolute inset-0 h-full w-full object-cover"
                        />
                      ) : (
                        <div className="text-muted-foreground text-sm">Image Unavailable</div>
                      )}
                    </div>
                  </div>

                  <div className="mt-8 flex gap-2 md:hidden">
                    <button
                      onClick={() =>
                        setFeaturedIdx((i) => (i - 1 + featured.length) % featured.length)
                      }
                      className="flex h-10 w-10 items-center justify-center rounded-full border border-border"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setFeaturedIdx((i) => (i + 1) % featured.length)}
                      className="flex h-10 w-10 items-center justify-center rounded-full border border-border"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </motion.div>
              ) : (
                <Skeleton className="h-[500px] w-full rounded-3xl" />
              )}
            </div>
          </section>

          {/* CATALOG PREVIEW */}
          <section id="catalog" className="border-t border-border py-24">
            <div className="mx-auto max-w-7xl px-6">
              <div className="mb-12 flex items-end justify-between">
                <div>
                  <div className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                    Inventory
                  </div>
                  <h2 className="mt-2 font-display text-4xl font-bold md:text-5xl">
                    Latest additions
                  </h2>
                </div>
                <Button asChild variant="ghost" className="rounded-full">
                  <Link to="/catalog">
                    View all <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>

              {loading ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <Skeleton key={i} className="h-96 rounded-2xl" />
                  ))}
                </div>
              ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {vehicles.map((v) => (
                    <VehicleCard
                      key={v.id}
                      vehicle={v}
                      onPurchased={() => vehicleApi.list().then(setVehicles)}
                    />
                  ))}
                </div>
              )}
            </div>
          </section>
        </>
      )}

      <footer className="border-t border-border py-12 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} DriveHub. Designed for drivers.
      </footer>
    </div>
  );
}
