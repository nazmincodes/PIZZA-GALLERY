export type PizzaType = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  badge?: string;
};

export const featuredPizzas: PizzaType[] = [
  {
    id: "pizza-01",
    name: "Italian Margherita",
    description: "Fresh mozzarella, basil, and rich Italian tomato sauce.",
    price: 450,
    category: "Classic",
    image:
      "https://images.unsplash.com/photo-1579751626657-72bc17010498?auto=format&fit=crop&w=900&q=85",
    badge: "Bestseller",
  },
  {
    id: "pizza-02",
    name: "Garden Veggie",
    description: "A delicious combination of fresh and colorful vegetables.",
    price: 520,
    category: "Vegetarian",
    image:
      "https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?auto=format&fit=crop&w=900&q=85",
    badge: "Healthy Choice",
  },
  {
    id: "pizza-03",
    name: "Pepperoni Feast",
    description: "Loaded with pepperoni, mozzarella, and signature sauce.",
    price: 650,
    category: "Meat Lovers",
    image:
      "https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=900&q=85",
    badge: "Popular",
  },
  {
    id: "pizza-04",
    name: "Four Cheese Delight",
    description: "A rich blend of four delicious cheeses in every bite.",
    price: 590,
    category: "Specialty",
    image:
      "https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?auto=format&fit=crop&w=900&q=85",
  },
];