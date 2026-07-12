import type { Vehicle, User, Role } from "@/types";

const API_BASE = "http://localhost:5000/api";

function getHeaders() {
  const token = localStorage.getItem("drivehub:token");
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
}

export const vehicleApi = {
  async list(): Promise<Vehicle[]> {
    const res = await fetch(`${API_BASE}/vehicles`, {
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error("Failed to fetch vehicles");
    return res.json();
  },

  async get(id: string): Promise<Vehicle | undefined> {
    // Backend doesn't support get by ID, fetching all and filtering in-memory as a fallback
    // Note: User confirmed no need for detailed view, but keeping this safe just in case
    const list = await this.list();
    return list.find((v) => v.id.toString() === id);
  },

  async create(vehicle: Omit<Vehicle, "id">): Promise<Vehicle> {
    const res = await fetch(`${API_BASE}/vehicles`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(vehicle),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || "Failed to create vehicle");
    }
    return res.json();
  },

  async update(id: string, patch: Partial<Vehicle>): Promise<Vehicle | undefined> {
    const res = await fetch(`${API_BASE}/vehicles/${id}`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(patch),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || "Failed to update vehicle");
    }
    return res.json();
  },

  async remove(id: string): Promise<void> {
    const res = await fetch(`${API_BASE}/vehicles/${id}`, {
      method: "DELETE",
      headers: getHeaders(),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || "Failed to delete vehicle");
    }
  },

  async purchase(id: string): Promise<Vehicle | undefined> {
    const res = await fetch(`${API_BASE}/vehicles/${id}/purchase`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({ quantity: 1 }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || "Failed to purchase vehicle");
    }
    const data = await res.json();
    return data.vehicle;
  },

  async restock(id: string, quantity: number): Promise<Vehicle | undefined> {
    const res = await fetch(`${API_BASE}/vehicles/${id}/restock`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({ quantity }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || "Failed to restock vehicle");
    }
    const data = await res.json();
    return data.vehicle;
  },
};

// -----------------------------------------------------------------------------
// Auth
// -----------------------------------------------------------------------------

const LS_USER = "drivehub:user";

export const authApi = {
  async login(email: string, password: string): Promise<User> {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || "Invalid email or password.");
    }
    const data = await res.json();
    localStorage.setItem(LS_USER, JSON.stringify(data.user));
    localStorage.setItem("drivehub:token", data.token);
    return data.user;
  },

  async register(
    username: string,
    email: string,
    password: string,
    role: Role = "customer",
  ): Promise<User> {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password, role }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || "Failed to register.");
    }
    const user = await res.json();
    // After registration, log them in automatically to get token
    return this.login(email, password);
  },

  logout() {
    localStorage.removeItem(LS_USER);
    localStorage.removeItem("drivehub:token");
  },

  current(): User | null {
    if (typeof window === "undefined") return null;
    const raw = localStorage.getItem(LS_USER);
    return raw ? (JSON.parse(raw) as User) : null;
  },
};
