import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { motion } from "motion/react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/use-auth";
import { HeroSide } from "@/components/HeroSide";
import { ArrowRight } from "lucide-react";

export const Route = createFileRoute("/register")({
  component: RegisterPage,
});

const schema = z
  .object({
    username: z.string().trim().min(2, "Enter your username"),
    email: z.string().trim().email("Enter a valid email"),
    password: z.string().min(6, "At least 6 characters"),
    confirm: z.string(),
  })
  .refine((d) => d.password === d.confirm, {
    message: "Passwords do not match",
    path: ["confirm"],
  });

function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", email: "", password: "", confirm: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      const errs: Record<string, string> = {};
      parsed.error.issues.forEach((i) => (errs[i.path[0] as string] = i.message));
      setErrors(errs);
      return;
    }
    setErrors({});
    setLoading(true);
    try {
      const u = await register(form.username, form.email, form.password);
      toast.success(`Welcome to DriveHub, ${u.username}`);
      navigate({ to: "/" });
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const bind = (k: keyof typeof form) => ({
    value: form[k],
    onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((f) => ({ ...f, [k]: e.target.value })),
  });

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-center px-6 py-16"
      >
        <div className="w-full max-w-md">
          <Link to="/" className="font-display text-2xl font-bold">
            DRIVE<span className="text-gradient">HUB</span>
          </Link>
          <div className="mb-4 text-xs font-bold tracking-widest text-red-500 uppercase">
            New Membership
          </div>
          <h1 className="mt-2 font-display text-4xl font-bold">
            Join the <span className="italic">Circle.</span>
          </h1>
          <p className="mt-4 text-muted-foreground">
            A private registry for collectors of consequential machinery.
          </p>

          <form onSubmit={submit} className="mt-10 space-y-5">
            {(
              [
                { k: "username", label: "FULL NAME", type: "text" },
                { k: "email", label: "EMAIL", type: "email" },
                { k: "password", label: "PASSWORD", type: "password" },
                { k: "confirm", label: "CONFIRM PASSWORD", type: "password" },
              ] as const
            ).map((f) => (
              <div key={f.k} className="space-y-2">
                <Label
                  htmlFor={f.k}
                  className="text-xs font-bold tracking-widest uppercase text-muted-foreground"
                >
                  {f.label}
                </Label>
                <Input
                  id={f.k}
                  type={f.type}
                  className="h-12"
                  aria-invalid={!!errors[f.k]}
                  {...bind(f.k)}
                />
                {errors[f.k] && <p className="text-xs text-destructive">{errors[f.k]}</p>}
              </div>
            ))}
            <Button
              type="submit"
              size="lg"
              className="w-full rounded-md bg-blue-600 hover:bg-blue-700 text-white font-semibold"
              disabled={loading}
            >
              {loading ? "Initiating..." : "Initiate Registration"}{" "}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </form>

          <p className="mt-8 text-sm text-muted-foreground text-center">
            Already registered?{" "}
            <Link to="/login" className="text-foreground hover:underline font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>
      <HeroSide />
    </div>
  );
}
