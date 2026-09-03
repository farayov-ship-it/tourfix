import type { Locale } from "./i18n";

export interface Route {
  id: string;
  from: string;
  to: string;
  price: number;
  duration: string;
  distance: string;
  popular?: boolean;
}

export interface Vehicle {
  id: string;
  name: string;
  category: "economy" | "comfort" | "premium" | "suv" | "minivan" | "van";
  capacity: number;
  priceFrom: number;
}

export interface Guide {
  id: string;
  name: string;
  city: string;
  languages: string[];
  rating: number;
  reviews: number;
  pricePerDay: number;
  specialty: string;
}

export interface DayTrip {
  id: string;
  title: Record<Locale, string>;
  city: string;
  duration: string;
  price: number;
  highlights: Record<Locale, string[]>;
}

export interface Review {
  id: string;
  name: string;
  country: string;
  rating: number;
  text: Record<Locale, string>;
  date: string;
}

export const stats = {
  routes: 240,
  vehicles: 21,
  rating: 5.0,
  guides: 45,
};

export const routes: Route[] = [
  { id: "tash-sam", from: "Tashkent", to: "Samarkand", price: 120, duration: "4.5–5h", distance: "315 km", popular: true },
  { id: "sam-buk", from: "Samarkand", to: "Bukhara", price: 110, duration: "3–3.5h", distance: "275 km", popular: true },
  { id: "buk-khi", from: "Bukhara", to: "Khiva", price: 130, duration: "7h", distance: "450 km", popular: true },
  { id: "tash-buk", from: "Tashkent", to: "Bukhara", price: 190, duration: "8–9h", distance: "480 km" },
  { id: "tash-fer", from: "Tashkent", to: "Fergana", price: 140, duration: "4.5–5h", distance: "380 km" },
  { id: "air-tash", from: "Tashkent Airport", to: "Tashkent", price: 25, duration: "30min", distance: "28 km", popular: true },
  { id: "sam-air", from: "Samarkand", to: "Samarkand Airport", price: 20, duration: "25min", distance: "18 km" },
  { id: "buk-air", from: "Bukhara", to: "Bukhara Airport", price: 18, duration: "20min", distance: "12 km" },
  { id: "khi-urg", from: "Khiva", to: "Urgench Airport", price: 22, duration: "35min", distance: "35 km" },
  { id: "tash-nuk", from: "Tashkent", to: "Nukus", price: 280, duration: "12–13h", distance: "820 km" },
];

export const vehicles: Vehicle[] = [
  { id: "cobalt", name: "Chevrolet Cobalt", category: "economy", capacity: 4, priceFrom: 30 },
  { id: "lacetti", name: "Chevrolet Lacetti", category: "economy", capacity: 4, priceFrom: 35 },
  { id: "malibu", name: "Chevrolet Malibu", category: "comfort", capacity: 4, priceFrom: 45 },
  { id: "camry", name: "Toyota Camry", category: "comfort", capacity: 4, priceFrom: 55 },
  { id: "s-class", name: "Mercedes S-Class", category: "premium", capacity: 4, priceFrom: 120 },
  { id: "tracker", name: "Chevrolet Tracker", category: "suv", capacity: 5, priceFrom: 50 },
  { id: "captiva", name: "Chevrolet Captiva", category: "suv", capacity: 7, priceFrom: 60 },
  { id: "byd", name: "BYD Song Plus", category: "suv", capacity: 5, priceFrom: 55 },
  { id: "sonet", name: "Kia Sonet", category: "suv", capacity: 5, priceFrom: 48 },
  { id: "starex", name: "Hyundai Starex", category: "minivan", capacity: 9, priceFrom: 70 },
  { id: "staria", name: "Hyundai Staria", category: "minivan", capacity: 8, priceFrom: 85 },
  { id: "alphard", name: "Toyota Alphard", category: "minivan", capacity: 7, priceFrom: 150 },
  { id: "sprinter", name: "Mercedes Sprinter", category: "van", capacity: 16, priceFrom: 120 },
  { id: "hiace", name: "Toyota Hiace", category: "van", capacity: 12, priceFrom: 90 },
  { id: "joylong", name: "Joylong", category: "van", capacity: 14, priceFrom: 85 },
];

export const guides: Guide[] = [
  { id: "g1", name: "Aziz Karimov", city: "Samarkand", languages: ["English", "Russian", "Uzbek"], rating: 5.0, reviews: 127, pricePerDay: 80, specialty: "Registan & Shah-i-Zinda" },
  { id: "g2", name: "Dilnoza Rakhimova", city: "Bukhara", languages: ["English", "French", "Russian"], rating: 4.9, reviews: 89, pricePerDay: 75, specialty: "Old City & Trading Domes" },
  { id: "g3", name: "Jasur Tursunov", city: "Khiva", languages: ["English", "German", "Russian"], rating: 5.0, reviews: 64, pricePerDay: 70, specialty: "Ichon-Qala & Khorezm" },
  { id: "g4", name: "Madina Yusupova", city: "Tashkent", languages: ["English", "Korean", "Russian"], rating: 4.8, reviews: 52, pricePerDay: 65, specialty: "Modern Tashkent & Chorsu" },
  { id: "g5", name: "Bobur Ismoilov", city: "Samarkand", languages: ["English", "Japanese", "Uzbek"], rating: 4.9, reviews: 98, pricePerDay: 85, specialty: "Silk Road History" },
  { id: "g6", name: "Nigora Saidova", city: "Bukhara", languages: ["English", "Spanish", "Russian"], rating: 5.0, reviews: 71, pricePerDay: 78, specialty: "Architecture & Crafts" },
];

export const dayTrips: DayTrip[] = [
  {
    id: "dt1",
    title: { en: "Samarkand Silk Road Highlights", ru: "Жемчужины Самарканда", uz: "Samarqand ipak yo'li sayohati" },
    city: "Samarkand",
    duration: "8h",
    price: 150,
    highlights: {
      en: ["Registan Square", "Shah-i-Zinda", "Bibi-Khanym Mosque", "Siab Bazaar"],
      ru: ["Площадь Регистан", "Шах-i-Зинда", "Мечеть Бibi-Ханым", "Бazaar Siab"],
      uz: ["Registon maydoni", "Shohi Zinda", "Bibi Xonim masjidi", "Siab bozori"],
    },
  },
  {
    id: "dt2",
    title: { en: "Bukhara Old Town Discovery", ru: "Старый город Бухары", uz: "Buxoro qadimiy shahar" },
    city: "Bukhara",
    duration: "7h",
    price: 140,
    highlights: {
      en: ["Lyabi-Hauz", "Ark Fortress", "Trading Domes", "Chor-Minor"],
      ru: ["Ляби-Хауз", "Крепость Арк", "Торговые купола", "Чор-Минор"],
      uz: ["Lyabi Xovuz", "Ark qal'asi", "Savdo gumbazlari", "Chor Minor"],
    },
  },
  {
    id: "dt3",
    title: { en: "Khiva Fortress & Desert", ru: "Хива и пустыня", uz: "Xiva qal'asi va cho'l" },
    city: "Khiva",
    duration: "9h",
    price: 160,
    highlights: {
      en: ["Ichon-Qala", "Kalta Minor", "Kunya-Ark", "Sunset at city walls"],
      ru: ["Ичан-Кала", "Калta Минор", "Кunya-Ark", "Закат у стен"],
      uz: ["Ichon Qala", "Kalta Minor", "Kunya Ark", "Devorlarida quyosh botishi"],
    },
  },
];

export const reviews: Review[] = [
  {
    id: "r1",
    name: "Sarah Mitchell",
    country: "UK",
    rating: 5,
    text: {
      en: "Flawless transfer from Tashkent to Samarkand. Driver was punctual, car was spotless, and the fixed price meant no surprises.",
      ru: "Безупречный трансфер из Ташкента в Самарканд. Водитель пунктуален, машина чистая, фиксированная цена — никаких сюрпризов.",
      uz: "Toshkentdan Samarqandga mukammal transfer. Haydovchi vaqtida keldi, mashina toza, narx aniq — hech qanday kutilmagan xarajat yo'q.",
    },
    date: "2026-01-15",
  },
  {
    id: "r2",
    name: "Thomas Weber",
    country: "Germany",
    rating: 5,
    text: {
      en: "Our guide in Bukhara was exceptional — deep knowledge of Silk Road history and perfect English.",
      ru: "Наш гид в Бухаре был превосходен — глубокие знания истории Шёлкового пути и отличный английский.",
      uz: "Buxorodagi gidimiz ajoyib edi — ipak yo'li tarixi bo'yicha chuqur bilim va mukammal ingliz tili.",
    },
    date: "2026-02-03",
  },
  {
    id: "r3",
    name: "Yuki Tanaka",
    country: "Japan",
    rating: 5,
    text: {
      en: "Booked airport pickup at 2 AM — driver was waiting with a sign. Highly recommend for Uzbekistan travel.",
      ru: "Заказали трансфер из аэропорта в 2 часа ночи — водитель ждал с табличкой. Очень рекомендую.",
      uz: "Tungi 2 da aeroportdan transfer buyurtma qildik — haydovchi yozuv bilan kutib oldi. O'zbekiston sayohati uchun tavsiya qilaman.",
    },
    date: "2026-03-10",
  },
];

export const cities = ["Tashkent", "Samarkand", "Bukhara", "Khiva", "Fergana", "Nukus"];

export const contact = {
  whatsapp: "+998901234567",
  telegram: "turkuztan_uz",
  email: "hello@turkuztan.uz",
  instagram: "turkuztan_uz",
};

export function getWhatsAppLink(message: string) {
  return `https://wa.me/${contact.whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(message)}`;
}
