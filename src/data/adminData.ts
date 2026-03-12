import { DeviceModel, SkinDesign } from "@/data/mockData";

export interface AdminOrder {
  id: string;
  customerName: string;
  email: string;
  items: { device: string; skin: string; coverage: string; qty: number; price: number }[];
  total: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  date: string;
  address: string;
}

export const mockOrders: AdminOrder[] = [
  {
    id: "SL-A1B2C3",
    customerName: "Arjun Mehta",
    email: "arjun@example.com",
    items: [
      { device: "iPhone 16 Pro Max", skin: "Black Carbon", coverage: "Full Body", qty: 1, price: 599 },
    ],
    total: 826,
    status: "processing",
    date: "2026-03-07",
    address: "Mumbai, Maharashtra",
  },
  {
    id: "SL-D4E5F6",
    customerName: "Rohit Verma",
    email: "rohit@example.com",
    items: [
      { device: "Galaxy S24 Ultra", skin: "Walnut", coverage: "Back Only", qty: 1, price: 699 },
      { device: "Galaxy S24 Ultra", skin: "Titanium", coverage: "Camera Skin", qty: 1, price: 699 },
    ],
    total: 1649,
    status: "shipped",
    date: "2026-03-06",
    address: "Pune, Maharashtra",
  },
  {
    id: "SL-G7H8I9",
    customerName: "Priya Sharma",
    email: "priya@example.com",
    items: [
      { device: "iPhone 15 Pro", skin: "Rose Gold", coverage: "Full Body", qty: 2, price: 799 },
    ],
    total: 1886,
    status: "delivered",
    date: "2026-03-04",
    address: "Delhi, India",
  },
  {
    id: "SL-J0K1L2",
    customerName: "Vikram Singh",
    email: "vikram@example.com",
    items: [
      { device: "Pixel 9 Pro", skin: "Midnight Black", coverage: "Back Only", qty: 1, price: 599 },
    ],
    total: 806,
    status: "pending",
    date: "2026-03-08",
    address: "Jaipur, Rajasthan",
  },
  {
    id: "SL-M3N4O5",
    customerName: "Ananya Patel",
    email: "ananya@example.com",
    items: [
      { device: "Nothing Phone (2)", skin: "Ocean Blue", coverage: "Full Body", qty: 1, price: 649 },
    ],
    total: 865,
    status: "cancelled",
    date: "2026-03-05",
    address: "Bangalore, Karnataka",
  },
  {
    id: "SL-P6Q7R8",
    customerName: "Deepak Kumar",
    email: "deepak@example.com",
    items: [
      { device: "OnePlus 12", skin: "Green Camo", coverage: "Back Only", qty: 1, price: 499 },
    ],
    total: 688,
    status: "processing",
    date: "2026-03-07",
    address: "Hyderabad, Telangana",
  },
];

export const revenueData = [
  { month: "Oct", revenue: 348000, orders: 68 },
  { month: "Nov", revenue: 481000, orders: 94 },
  { month: "Dec", revenue: 680000, orders: 132 },
  { month: "Jan", revenue: 531000, orders: 103 },
  { month: "Feb", revenue: 589000, orders: 115 },
  { month: "Mar", revenue: 265000, orders: 52 },
];

export const topSkins = [
  { name: "Black Carbon", sales: 245, revenue: 146510 },
  { name: "Walnut", sales: 198, revenue: 138402 },
  { name: "Rose Gold", sales: 176, revenue: 140624 },
  { name: "Midnight Black", sales: 163, revenue: 97637 },
  { name: "Titanium", sales: 142, revenue: 113458 },
];

export const topDevices = [
  { name: "iPhone 16 Pro Max", orders: 312 },
  { name: "Galaxy S24 Ultra", orders: 245 },
  { name: "iPhone 15 Pro", orders: 198 },
  { name: "Pixel 9 Pro", orders: 134 },
  { name: "OnePlus 12", orders: 112 },
];
