import { createContext, useContext, useState, ReactNode } from "react";
import type { Product } from "../data/products";

type CompareContextType = {
  items: Product[];
  addToCompare: (product: Product) => void;
  removeFromCompare: (id: number) => void;
  clearCompare: () => void;
  hasProduct: (id: number) => boolean;  
};

const CompareContext = createContext<CompareContextType | undefined>(undefined);

export function CompareProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<Product[]>([]);

  const addToCompare = (product: Product) => {
    setItems((prev) => {
      if (prev.find((p) => p.id === product.id)) return prev;
      return [...prev, product].slice(0, 4); 
    });
  };

  const removeFromCompare = (id: number) => {
    setItems((prev) => prev.filter((p) => p.id !== id));
  };

  const clearCompare = () => setItems([]);


  const hasProduct = (id: number) => items.some((p) => p.id === id);

  return (
    <CompareContext.Provider
      value={{ items, addToCompare, removeFromCompare, clearCompare, hasProduct }}
    >
      {children}
    </CompareContext.Provider>
  );
}

export function useCompare() {
  const ctx = useContext(CompareContext);
  if (!ctx) throw new Error("useCompare must be used inside CompareProvider");
  return ctx;
}
