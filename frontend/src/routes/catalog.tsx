import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { VehicleCard } from "@/components/VehicleCard";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { vehicleApi } from "@/services/api";
import type { Vehicle } from "@/types";

export const Route = createFileRoute("/catalog")({
  component: Catalog,
});

const CATEGORIES = ["all", "SUV", "Sedan", "Truck", "Coupe", "Convertible", "Hatchback"];

function Catalog() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);

  const [q, setQ] = useState("");
  const [category, setCategory] = useState("all");
  const [minPrice, setMinPrice] = useState<number | "">("");
  const [maxPrice, setMaxPrice] = useState<number | "">("");

  const refresh = () => {
    setLoading(true);
    vehicleApi.list().then((v) => {
      setVehicles(v);
      setLoading(false);
    });
  };
  useEffect(refresh, []);

  const filtered = useMemo(() => {
    const list = vehicles.filter((v) => {
      const matchesQ =
        !q ||
        (v.make + " " + v.model).toLowerCase().includes(q.toLowerCase()) ||
        (v.description || "").toLowerCase().includes(q.toLowerCase());
      const matchesCategory =
        category === "all" || v.category.toLowerCase() === category.toLowerCase();

      const min = minPrice === "" ? 0 : Number(minPrice);
      const max = maxPrice === "" ? Infinity : Number(maxPrice);
      const matchesPrice = v.price >= min && v.price <= max;

      return matchesQ && matchesCategory && matchesPrice;
    });

    // Sort newest first by default (assuming higher id = newer since no created_at available)
    list.sort((a, b) => b.id - a.id);
    return list;
  }, [vehicles, q, category, minPrice, maxPrice]);

  return (
    <div className="min-h-screen bg-background pb-24">
      <Navbar />
      <div className="pt-24 pb-12">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-primary">
            THE ARCHIVE • VOL. IV
          </div>
          <h1 className="font-display text-5xl md:text-7xl font-bold tracking-tight">
            Discover Your <span className="text-gradient">Drive</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-muted-foreground/80 leading-relaxed">
            A meticulously curated collection of premium vehicles. Each car is rigorously inspected
            to ensure uncompromised quality, performance, and reliability.
          </p>
        </div>
      </div>

      {/* Sticky filter bar */}
      <div className="sticky top-[72px] z-30 border-b border-border bg-background/90 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            {/* Category Pills */}
            <div className="flex flex-wrap items-center gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`rounded-full px-4 py-2 text-[11px] font-bold uppercase tracking-[0.1em] transition-colors ${
                    category === cat
                      ? "border border-primary bg-primary/10 text-primary"
                      : "border border-border text-muted-foreground hover:bg-secondary"
                  }`}
                >
                  {cat === "all" ? "ALL CHASSIS" : cat}
                </button>
              ))}
            </div>

            {/* Search and Price Filters */}
            <div className="flex items-center gap-3">
              <div className="relative w-full sm:w-[240px]">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search make or model..."
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  className="h-10 rounded-full border-border bg-secondary/50 pl-9 text-sm focus-visible:ring-1 focus-visible:ring-primary focus-visible:ring-offset-0"
                />
              </div>
              <Input
                type="number"
                placeholder="Min $"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value === "" ? "" : Number(e.target.value))}
                className="h-10 w-[90px] rounded-full border-border bg-secondary/50 px-4 text-sm focus-visible:ring-1 focus-visible:ring-primary focus-visible:ring-offset-0"
              />
              <Input
                type="number"
                placeholder="Max"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value === "" ? "" : Number(e.target.value))}
                className="h-10 w-[90px] rounded-full border-border bg-secondary/50 px-4 text-sm focus-visible:ring-1 focus-visible:ring-primary focus-visible:ring-offset-0"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 pt-10">
        <div className="mb-6 text-sm font-medium text-muted-foreground">
          {loading ? "Loading inventory…" : `${filtered.length} vehicles matching criteria`}
        </div>
        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-80 rounded-2xl" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-border py-24 text-center">
            <div className="mb-4 text-6xl opacity-50">🚗</div>
            <h3 className="font-display text-2xl font-bold">Nothing matches</h3>
            <p className="mt-2 max-w-sm text-sm text-muted-foreground">
              Try widening your filters or clearing the search to see the full inventory.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {filtered.map((v) => (
              <VehicleCard key={v.id} vehicle={v} onPurchased={refresh} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
