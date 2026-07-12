export type Role = "customer" | "admin" | "manager";

export interface User {
  id: number;
  username: string;
  email: string;
  role: Role;
}

export type VehicleCategory = "SUV" | "Sedan" | "Truck" | "Coupe" | "Hatchback";

export interface Vehicle {
  id: number;
  make: string;
  model: string;
  price: number;
  quantity: number;
  category: VehicleCategory;
  description?: string;
  image_url?: string;
}
