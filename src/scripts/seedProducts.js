// src/scripts/seedProducts.js
import { collection, addDoc } from "firebase/firestore";
import { db } from "../services/firebase";

const initialProducts = [
  {
    title: "Metallica - Master of Puppets",
    type: "show",
    artist: "Metallica",
    date: "2025-03-15",
    venue: "Estadio Monumental",
    images: [
      "/images/shows/metallica-1.jpg",
      "/images/shows/metallica-2.jpg",
      "/images/shows/metallica-3.jpg"
    ],
    spaces: [
      { name: "Campo Delantero", price: 15000, stock: 100 },
      { name: "Campo Trasero", price: 12000, stock: 150 },
      { name: "Campo VIP", price: 25000, stock: 50 },
      { name: "Platea Baja", price: 10000, stock: 80 },
      { name: "Platea Media", price: 8000, stock: 100 },
      { name: "Platea Alta", price: 6000, stock: 120 }
    ],
    merchandise: [
      { id: "m1", name: "Remera Metallica", price: 8000, stock: 50 },
      { id: "m2", name: "Gorra Metallica", price: 5000, stock: 30 }
    ],
    category: "metallica",
    createdAt: new Date().toISOString()
  },
  {
    title: "AC/DC - Back in Black Tour",
    type: "show",
    artist: "AC/DC",
    date: "2025-04-20",
    venue: "Estadio River Plate",
    images: [
      "/images/shows/acdc-1.jpg",
      "/images/shows/acdc-2.jpg"
    ],
    spaces: [
      { name: "Campo Delantero", price: 14000, stock: 100 },
      { name: "Campo Trasero", price: 11000, stock: 150 },
      { name: "Campo VIP", price: 23000, stock: 50 },
      { name: "Platea Baja", price: 9500, stock: 80 },
      { name: "Platea Media", price: 7500, stock: 100 },
      { name: "Platea Alta", price: 5500, stock: 120 }
    ],
    merchandise: [
      { id: "m4", name: "Remera AC/DC", price: 7500, stock: 50 }
    ],
    category: "acdc",
    createdAt: new Date().toISOString()
  },
  {
    title: "Sylvania - Tour Místico",
    type: "show",
    artist: "Sylvania",
    date: "2025-05-10",
    venue: "Teatro Colón",
    images: [
      "/images/shows/sylvania-1.jpg"
    ],
    spaces: [
      { name: "Campo Delantero", price: 10000, stock: 80 },
      { name: "Campo Trasero", price: 8000, stock: 100 },
      { name: "Campo VIP", price: 18000, stock: 30 },
      { name: "Platea Baja", price: 7000, stock: 60 },
      { name: "Platea Media", price: 5500, stock: 80 },
      { name: "Platea Alta", price: 4000, stock: 100 }
    ],
    merchandise: [
      { id: "m6", name: "Remera Sylvania", price: 6500, stock: 40 }
    ],
    category: "sylvania",
    createdAt: new Date().toISOString()
  },
  {
    title: "Linkin Park - Hybrid Theory Anniversary",
    type: "show",
    artist: "Linkin Park",
    date: "2025-06-15",
    venue: "Movistar Arena",
    images: [
      "/images/shows/linkin-park-1.jpg"
    ],
    spaces: [
      { name: "Campo Delantero", price: 16000, stock: 90 },
      { name: "Campo Trasero", price: 13000, stock: 140 },
      { name: "Campo VIP", price: 26000, stock: 40 },
      { name: "Platea Baja", price: 11000, stock: 70 },
      { name: "Platea Media", price: 9000, stock: 90 },
      { name: "Platea Alta", price: 7000, stock: 110 }
    ],
    merchandise: [],
    category: "linkin-park",
    createdAt: new Date().toISOString()
  },
  {
    title: "Mago de Oz - Gaia III Tour",
    type: "show",
    artist: "Mago de Oz",
    date: "2025-07-20",
    venue: "Luna Park",
    images: [
      "/images/shows/mago-de-oz-1.jpg"
    ],
    spaces: [
      { name: "Campo Delantero", price: 12000, stock: 85 },
      { name: "Campo Trasero", price: 9500, stock: 130 },
      { name: "Campo VIP", price: 20000, stock: 35 },
      { name: "Platea Baja", price: 8500, stock: 75 },
      { name: "Platea Media", price: 6500, stock: 95 },
      { name: "Platea Alta", price: 5000, stock: 115 }
    ],
    merchandise: [
      { id: "m7", name: "Bandera Mago de Oz", price: 4500, stock: 25 }
    ],
    category: "mago-de-oz",
    createdAt: new Date().toISOString()
  },
  {
    title: "Feuerschwanz - Medieval Rock Fest",
    type: "show",
    artist: "Feuerschwanz",
    date: "2025-08-10",
    venue: "C Complejo Art Media",
    images: [
      "/images/shows/feuerschwanz-1.jpg"
    ],
    spaces: [
      { name: "Campo Delantero", price: 11000, stock: 70 },
      { name: "Campo Trasero", price: 8500, stock: 110 },
      { name: "Campo VIP", price: 19000, stock: 30 },
      { name: "Platea Baja", price: 7500, stock: 65 },
      { name: "Platea Media", price: 6000, stock: 85 },
      { name: "Platea Alta", price: 4500, stock: 105 }
    ],
    merchandise: [],
    category: "feuerschwanz",
    createdAt: new Date().toISOString()
  }
];

export const seedProducts = async () => {
  try {
    console.log("🌱 Iniciando seed con imágenes locales...");
    
    const productsRef = collection(db, "products");
    
    for (const product of initialProducts) {
      await addDoc(productsRef, product);
      console.log(`✅ ${product.title}`);
    }
    
    console.log("🎉 6 productos cargados exitosamente!");
    return true;
  } catch (error) {
    console.error("❌ Error:", error);
    return false;
  }
};