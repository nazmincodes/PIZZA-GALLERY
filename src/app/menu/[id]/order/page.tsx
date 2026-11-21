import { notFound } from "next/navigation";
import PizzaOrderForm from "@/components/menu/PizzaOrderForm";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function PizzaOrderPage({ params }: PageProps) {
  const { id } = await params;

  const response = await fetch(`${API_URL}/api/menu/public`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch menu items");
  }

  const result = await response.json();

  const pizza = result.menuItems?.find(
    (item: { _id: string }) => item._id === id
  );

  if (!pizza) {
    notFound();
  }

  return <PizzaOrderForm pizza={pizza} />;
}