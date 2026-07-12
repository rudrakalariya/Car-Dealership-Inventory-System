import { motion } from "motion/react";
import type { Vehicle } from "@/types";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { vehicleApi } from "@/services/api";

export function VehicleCard({
  vehicle,
  onPurchased,
}: {
  vehicle: Vehicle;
  onPurchased?: () => void;
}) {
  const outOfStock = vehicle.quantity <= 0;

  const handlePurchase = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (outOfStock) return;
    const updated = await vehicleApi.purchase(vehicle.id.toString());
    if (updated) {
      toast.success(`Reserved ${vehicle.make} ${vehicle.model}`, {});
      onPurchased?.();
    }
  };

  // Placeholder images based on category or make
  const getImageUrl = () => {
    if (vehicle.image_url) return vehicle.image_url;
    if (vehicle.category === "SUV")
      return "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=800&q=80";
    if (vehicle.category === "Coupe")
      return "https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=800&q=80";
    if (vehicle.category === "Hatchback")
      return "https://images.unsplash.com/photo-1516828551139-2ce32a76f2b6?auto=format&fit=crop&w=800&q=80";
    if (vehicle.category === "Truck")
      return "https://images.unsplash.com/photo-1559416523-140ddc3d238c?auto=format&fit=crop&w=800&q=80";
    return "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&w=800&q=80";
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className="group relative flex h-full flex-col bg-transparent"
    >
      <div className="relative overflow-hidden rounded-2xl bg-secondary/30 aspect-[4/3]">
        <img
          src={getImageUrl()}
          alt={`${vehicle.make} ${vehicle.model}`}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute right-3 top-3 z-10 rounded-full bg-black/80 px-3 py-1.5 text-[10px] font-bold tracking-wider text-white uppercase backdrop-blur-md">
          {outOfStock ? "Out of Stock" : "Available"}
        </div>

        {/* Overlay for Hover Action */}
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <Button
            onClick={handlePurchase}
            disabled={outOfStock}
            className="rounded-full bg-white/20 border border-white/30 px-6 py-2 text-sm font-semibold text-white shadow-xl backdrop-blur-lg hover:bg-white/30"
          >
            {outOfStock ? "Out of Stock" : "Initiate Acquisition"}
          </Button>
        </div>
      </div>

      <div className="mt-5 flex flex-col px-1">
        <h3 className="font-display text-xl font-bold tracking-tight">
          {vehicle.make} {vehicle.model}
        </h3>
        <div className="mt-1 text-sm text-muted-foreground/80">• {vehicle.category}</div>
        <div className="mt-3 font-display text-lg font-medium text-foreground">
          $
          {Number(vehicle.price).toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </div>
      </div>
    </motion.div>
  );
}
