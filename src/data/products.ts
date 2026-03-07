export type Product = {
  id: number;
  name: string;
  price: number;
  category: string;
  description: string;
  image: string;
};

export const products: Product[] = [
  // CLOTHES (12 items)
  { id: 1, name: "Red T-Shirt", price: 19.99, category: "clothes", description: "100% cotton red T-shirt.", image: "https://placehold.co/300x400/ff4444/ffffff?text=Red+T-Shirt" },
  { id: 2, name: "Blue T-Shirt", price: 21.99, category: "clothes", description: "Premium blue T-shirt.", image: "https://placehold.co/300x400/0066cc/ffffff?text=Blue+T-Shirt" },
  { id: 3, name: "Black Hoodie", price: 45.99, category: "clothes", description: "Oversized black hoodie.", image: "https://placehold.co/300x400/1a1a1a/ffffff?text=Black+Hoodie" },
  { id: 4, name: "Denim Jeans", price: 59.99, category: "clothes", description: "Slim fit denim jeans.", image: "https://placehold.co/300x400/4682b4/ffffff?text=Denim+Jeans" },
  { id: 5, name: "White Sneakers", price: 89.99, category: "clothes", description: "Leather white sneakers.", image: "https://placehold.co/300x400/ffffff/333333?text=Sneakers" },
  { id: 6, name: "Gray Jacket", price: 79.99, category: "clothes", description: "Water-resistant jacket.", image: "https://placehold.co/300x400/808080/ffffff?text=Gray+Jacket" },
  { id: 7, name: "Green Sweater", price: 39.99, category: "clothes", description: "Wool blend sweater.", image: "https://placehold.co/300x400/228b22/ffffff?text=Green+SVR" },
  { id: 8, name: "Black Cap", price: 24.99, category: "clothes", description: "Adjustable baseball cap.", image: "https://placehold.co/300x400/000000/ffffff?text=Black+Cap" },
  { id: 9, name: "Brown Belt", price: 34.99, category: "clothes", description: "Genuine leather belt.", image: "https://placehold.co/300x400/8b4513/ffffff?text=Brown+Belt" },
  { id: 10, name: "White Socks", price: 9.99, category: "clothes", description: "Cotton crew socks 3-pack.", image: "https://placehold.co/300x400/f5f5f5/333333?text=Socks" },
  { id: 11, name: "Pink Scarf", price: 29.99, category: "clothes", description: "Soft wool scarf.", image: "https://placehold.co/300x400/ff69b4/ffffff?text=Pink+Scarf" },
  { id: 12, name: "Cargo Shorts", price: 32.99, category: "clothes", description: "Multi-pocket cargo shorts.", image: "https://placehold.co/300x400/556b2f/ffffff?text=Cargo+Shorts" },

  // HOME (8 items)
  { id: 13, name: "Coffee Mug", price: 9.99, category: "home", description: "16oz ceramic mug.", image: "https://placehold.co/300x400/8b4513/ffffff?text=Coffee+Mug" },
  { id: 14, name: "Plant Pot", price: 14.99, category: "home", description: "Matte ceramic pot.", image: "https://placehold.co/300x400/228b22/ffffff?text=Plant+Pot" },
  { id: 15, name: "Cushion Cover", price: 12.99, category: "home", description: "Velvet cushion 45x45cm.", image: "https://placehold.co/300x400/9370db/ffffff?text=Cushion" },
  { id: 16, name: "Desk Lamp", price: 39.99, category: "home", description: "Adjustable LED lamp.", image: "https://placehold.co/300x400/ffa500/333333?text=Desk+Lamp" },
  { id: 17, name: "Wall Clock", price: 24.99, category: "home", description: "Minimalist 30cm clock.", image: "https://placehold.co/300x400/696969/ffffff?text=Wall+Clock" },
  { id: 18, name: "Throw Blanket", price: 49.99, category: "home", description: "Fleece throw 130x160cm.", image: "https://placehold.co/300x400/a8a8a8/ffffff?text=Blanket" },
  { id: 19, name: "Picture Frame", price: 19.99, category: "home", description: "Wooden A4 photo frame.", image: "https://placehold.co/300x400/d2b48c/ffffff?text=Picture+Frame" },
  { id: 20, name: "Coasters Set", price: 15.99, category: "home", description: "Cork coasters 4-pack.", image: "https://placehold.co/300x400/8b4513/ffffff?text=Coasters" },

  // ELECTRONICS (10 items)
  { id: 21, name: "Wireless Earbuds", price: 29.99, category: "electronics", description: "Bluetooth 5.0 earbuds.", image: "https://placehold.co/300x400/4169e1/ffffff?text=Earbuds" },
  { id: 22, name: "Phone Stand", price: 15.99, category: "electronics", description: "Adjustable phone stand.", image: "https://placehold.co/300x400/808080/ffffff?text=Phone+Stand" },
  { id: 23, name: "USB-C Charger", price: 19.99, category: "electronics", description: "65W fast charger.", image: "https://placehold.co/300x400/dc143c/ffffff?text=USB-C+Charger" },
  { id: 24, name: "Bluetooth Mouse", price: 34.99, category: "electronics", description: "Wireless ergonomic mouse.", image: "https://placehold.co/300x400/32cd32/ffffff?text=Mouse" },
  { id: 25, name: "Power Bank", price: 44.99, category: "electronics", description: "10000mAh power bank.", image: "https://placehold.co/300x400/ff8c00/ffffff?text=Power+Bank" },
  { id: 26, name: "HDMI Cable", price: 12.99, category: "electronics", description: "2m 4K HDMI cable.", image: "https://placehold.co/300x400/191970/ffffff?text=HDMI+Cable" },
  { id: 27, name: "USB Hub", price: 24.99, category: "electronics", description: "7-port USB hub.", image: "https://placehold.co/300x400/4169e1/ffffff?text=USB+Hub" },
  { id: 28, name: "Screen Protector", price: 9.99, category: "electronics", description: "Tempered glass protector.", image: "https://placehold.co/300x400/00bfff/ffffff?text=Screen+Protector" },
  { id: 29, name: "Phone Case", price: 14.99, category: "electronics", description: "Silicone phone case.", image: "https://placehold.co/300x400/9932cc/ffffff?text=Phone+Case" },
  { id: 30, name: "Memory Card", price: 29.99, category: "electronics", description: "128GB microSD card.", image: "https://placehold.co/300x400/ffd700/333333?text=Memory+Card" },

  // BOOKS (6 items)
  { id: 31, name: "JavaScript Guide", price: 24.99, category: "books", description: "Complete JS guide.", image: "https://placehold.co/300x400/ffd700/000000?text=JS+Guide" },
  { id: 32, name: "React Cookbook", price: 34.99, category: "books", description: "150+ React recipes.", image: "https://placehold.co/300x400/00bfff/ffffff?text=React+Book" },
  { id: 33, name: "Node.js Basics", price: 19.99, category: "books", description: "Node.js beginner guide.", image: "https://placehold.co/300x400/32cd32/ffffff?text=Node.js" },
  { id: 34, name: "TypeScript Handbook", price: 28.99, category: "books", description: "Official TS guide.", image: "https://placehold.co/300x400/4169e1/ffffff?text=TypeScript" },
  { id: 35, name: "CSS Mastery", price: 32.99, category: "books", description: "Advanced CSS techniques.", image: "https://placehold.co/300x400/9932cc/ffffff?text=CSS+Book" },
  { id: 36, name: "Python Crash Course", price: 29.99, category: "books", description: "Python beginner book.", image: "https://placehold.co/300x400/4169e1/ffffff?text=Python" },

  // SPORTS (6 items)
  { id: 37, name: "Yoga Mat", price: 29.99, category: "sports", description: "Non-slip yoga mat.", image: "https://placehold.co/300x400/32cd32/ffffff?text=Yoga+Mat" },
  { id: 38, name: "Running Shoes", price: 79.99, category: "sports", description: "Lightweight runners.", image: "https://placehold.co/300x400/ff4500/ffffff?text=Running+Shoes" },
  { id: 39, name: "Water Bottle", price: 19.99, category: "sports", description: "Insulated 750ml bottle.", image: "https://placehold.co/300x400/00ced1/ffffff?text=Water+Bottle" },
  { id: 40, name: "Dumbbells", price: 49.99, category: "sports", description: "5kg adjustable dumbbells.", image: "https://placehold.co/300x400/8b0000/ffffff?text=Dumbbells" },
  { id: 41, name: "Jump Rope", price: 14.99, category: "sports", description: "Adjustable speed rope.", image: "https://placehold.co/300x400/ff1493/ffffff?text=Jump+Rope" },
  { id: 42, name: "Fitness Bands", price: 24.99, category: "sports", description: "Resistance bands set.", image: "https://placehold.co/300x400/9370db/ffffff?text=Fitness+Bands" },

  // TOYS (4 items)
  { id: 43, name: "Puzzle 1000pc", price: 19.99, category: "toys", description: "1000 piece jigsaw.", image: "https://placehold.co/300x400/4169e1/ffffff?text=Puzzle" },
  { id: 44, name: "RC Car", price: 59.99, category: "toys", description: "1:16 scale RC car.", image: "https://placehold.co/300x400/ff0000/ffffff?text=RC+Car" },
  { id: 45, name: "Board Game", price: 34.99, category: "toys", description: "Strategy board game.", image: "https://placehold.co/300x400/8b4513/ffffff?text=Board+Game" },
  { id: 46, name: "Lego Set", price: 89.99, category: "toys", description: "300 piece city set.", image: "https://placehold.co/300x400/ff8c00/ffffff?text=Lego" },

  // BEAUTY (2 items)
  { id: 47, name: "Face Moisturizer", price: 24.99, category: "beauty", description: "Hydrating day cream.", image: "https://placehold.co/300x400/9932cc/ffffff?text=Moisturizer" },
  { id: 48, name: "Lip Balm", price: 8.99, category: "beauty", description: "Natural lip balm SPF15.", image: "https://placehold.co/300x400/ff69b4/ffffff?text=Lip+Balm" },

  // FOOD (2 items)
  { id: 49, name: "Coffee Beans", price: 14.99, category: "food", description: "250g medium roast.", image: "https://placehold.co/300x400/8b4513/ffffff?text=Coffee+Beans" },
  { id: 50, name: "Protein Bar", price: 2.99, category: "food", description: "Chocolate protein bar.", image: "https://placehold.co/300x400/8b4513/333333?text=Protein+Bar" },
];
