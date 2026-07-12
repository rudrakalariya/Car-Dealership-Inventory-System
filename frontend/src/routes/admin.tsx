import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Pencil, Plus, Trash2, PackagePlus } from "lucide-react";
import { toast } from "sonner";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAuth } from "@/hooks/use-auth";
import { vehicleApi } from "@/services/api";
import type { Vehicle, VehicleCategory } from "@/types";

export const Route = createFileRoute("/admin")({
  component: AdminPage,
});

type FormState = {
  make: string;
  model: string;
  price: number;
  quantity: number;
  category: VehicleCategory;
  description: string;
};

const empty: FormState = {
  make: "",
  model: "",
  price: 0,
  quantity: 1,
  category: "Sedan",
  description: "",
};

function AdminPage() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(empty);
  const [confirmDelete, setConfirmDelete] = useState<Vehicle | null>(null);
  const [restockItem, setRestockItem] = useState<Vehicle | null>(null);
  const [restockQty, setRestockQty] = useState(1);
  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      navigate({ to: "/login" });
      return;
    }
    if (user.role !== "admin") {
      toast.error("Admin access required");
      navigate({ to: "/catalog" });
    }
  }, [user, authLoading, navigate]);

  const refresh = () => {
    setLoading(true);
    vehicleApi.list().then((v) => {
      setVehicles(v);
      setLoading(false);
    });
  };
  useEffect(refresh, []);

  const openAdd = () => {
    setEditingId(null);
    setForm(empty);
    setDialogOpen(true);
  };

  const openEdit = (v: Vehicle) => {
    setEditingId(v.id.toString());
    setForm({
      make: v.make,
      model: v.model,
      price: Number(v.price) || 0,
      quantity: Number(v.quantity) || 0,
      category: v.category,
      description: v.description || "",
    });
    setDialogOpen(true);
  };

  const save = async () => {
    if (!form.make || !form.model) {
      toast.error("Make and model are required");
      return;
    }
    try {
      if (editingId) {
        await vehicleApi.update(editingId, form);
        toast.success("Vehicle updated");
      } else {
        await vehicleApi.create(form);
        toast.success("Vehicle added");
      }
      setDialogOpen(false);
      refresh();
    } catch (err: unknown) {
      toast.error((err as Error).message || "Failed to save vehicle");
    }
  };

  const doDelete = async () => {
    if (!confirmDelete) return;
    try {
      await vehicleApi.remove(confirmDelete.id.toString());
      toast.success("Vehicle deleted");
      setConfirmDelete(null);
      refresh();
    } catch (err: unknown) {
      toast.error((err as Error).message || "Failed to delete vehicle");
    }
  };

  const doRestock = async () => {
    if (!restockItem) return;
    try {
      await vehicleApi.restock(restockItem.id.toString(), restockQty);
      toast.success(`Restocked ${restockItem.make} ${restockItem.model}`);
      setRestockItem(null);
      setRestockQty(1);
      refresh();
    } catch (err: unknown) {
      toast.error((err as Error).message || "Failed to restock vehicle");
    }
  };

  if (authLoading || !user || user.role !== "admin") {
    return <div className="min-h-screen bg-background" />;
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      <Navbar />
      <div className="pt-24" />
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Admin</div>
            <h1 className="mt-2 font-display text-4xl font-bold">Inventory management</h1>
          </div>
          <Button onClick={openAdd} className="rounded-full">
            <Plus className="mr-2 h-4 w-4" /> Add vehicle
          </Button>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <Stat label="Total vehicles" value={vehicles.length} />
          <Stat label="In stock" value={vehicles.reduce((a, v) => a + v.quantity, 0)} />
          <Stat
            label="Inventory value"
            value={
              "$" +
              vehicles
                .reduce((a, v) => a + Number(v.price) * Number(v.quantity), 0)
                .toLocaleString()
            }
          />
        </div>

        <div className="mt-10 overflow-hidden rounded-2xl border border-border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Vehicle</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="py-12 text-center text-muted-foreground">
                    Loading…
                  </TableCell>
                </TableRow>
              ) : vehicles.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="py-12 text-center text-muted-foreground">
                    No vehicles yet. Add your first one.
                  </TableCell>
                </TableRow>
              ) : (
                vehicles.map((v) => (
                  <TableRow key={v.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div>
                          <div className="font-medium">
                            {v.make} {v.model}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{v.category}</TableCell>
                    <TableCell>${Number(v.price).toLocaleString()}</TableCell>
                    <TableCell>
                      <span
                        className={
                          "inline-flex items-center rounded-full px-2 py-0.5 text-xs " +
                          (v.quantity > 0
                            ? "bg-primary/15 text-primary"
                            : "bg-destructive/15 text-destructive")
                        }
                      >
                        {v.quantity > 0 ? `${v.quantity} in stock` : "Out"}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setRestockItem(v);
                          setRestockQty(1);
                        }}
                        aria-label="Restock"
                      >
                        <PackagePlus className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openEdit(v)}
                        aria-label="Edit"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setConfirmDelete(v)}
                        aria-label="Delete"
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl">
              {editingId ? "Edit vehicle" : "Add vehicle"}
            </DialogTitle>
            <DialogDescription>Details visible to customers on the catalog.</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Make">
              <Input
                value={form.make}
                onChange={(e) => setForm({ ...form, make: e.target.value })}
              />
            </Field>
            <Field label="Model">
              <Input
                value={form.model}
                onChange={(e) => setForm({ ...form, model: e.target.value })}
              />
            </Field>
            <Field label="Price (USD)">
              <Input
                type="number"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: +e.target.value })}
              />
            </Field>
            <Field label="Quantity">
              <Input
                type="number"
                value={form.quantity}
                onChange={(e) => setForm({ ...form, quantity: +e.target.value })}
              />
            </Field>
            <Field label="Category">
              <Select
                value={form.category}
                onValueChange={(v) => setForm({ ...form, category: v as VehicleCategory })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(["SUV", "Sedan", "Truck", "Coupe", "Hatchback"] as VehicleCategory[]).map(
                    (t) => (
                      <SelectItem key={t} value={t}>
                        {t}
                      </SelectItem>
                    ),
                  )}
                </SelectContent>
              </Select>
            </Field>
            <div className="col-span-2">
              <Field label="Description">
                <Textarea
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                />
              </Field>
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={save}>{editingId ? "Save changes" : "Add vehicle"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!confirmDelete} onOpenChange={(o) => !o && setConfirmDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this vehicle?</AlertDialogTitle>
            <AlertDialogDescription>
              {confirmDelete &&
                `${confirmDelete.make} ${confirmDelete.model} will be removed from inventory. This can't be undone.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={doDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={!!restockItem} onOpenChange={(o) => !o && setRestockItem(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Restock {restockItem?.make} {restockItem?.model}
            </DialogTitle>
            <DialogDescription>Add more inventory to this vehicle.</DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-2">
            <Label>Quantity to add</Label>
            <Input
              type="number"
              min={1}
              value={restockQty}
              onChange={(e) => setRestockQty(Number(e.target.value) || 0)}
            />
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setRestockItem(null)}>
              Cancel
            </Button>
            <Button onClick={doRestock}>Confirm Restock</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <div className="text-xs uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="mt-2 font-display text-3xl font-bold">{value}</div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {children}
    </div>
  );
}
