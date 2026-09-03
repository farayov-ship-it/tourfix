/** Cinematic AI-enhanced Uzbekistan tourism photos in /public/images */
/** ?v= busts browser cache after photo swaps */

const V = "ai3";

export const images = {
  hero: {
    main: `/images/hero-main.jpg?v=${V}`, // Registan sunset
    secondary: `/images/hero-2.jpg?v=${V}`, // Khiva Ichon-Qala
    accent: `/images/hero-3.jpg?v=${V}`, // Bukhara Po-i-Kalyan
  },
  destinations: [
    {
      id: "samarkand",
      name: { en: "Samarkand", ru: "Самарканд", uz: "Samarqand" },
      tagline: { en: "Registan & Silk Road", ru: "Регистан и Шёлковый путь", uz: "Registon va Ipak yo'li" },
      image: `/images/dest-sam.jpg?v=${V}`,
    },
    {
      id: "bukhara",
      name: { en: "Bukhara", ru: "Бухара", uz: "Buxoro" },
      tagline: { en: "Po-i-Kalyan", ru: "Пои-Калян", uz: "Po-i-Kalon" },
      image: `/images/dest-buk.jpg?v=${V}`,
    },
    {
      id: "khiva",
      name: { en: "Khiva", ru: "Хива", uz: "Xiva" },
      tagline: { en: "Ichon-Qala", ru: "Ичан-Кала", uz: "Ichon-Qala" },
      image: `/images/dest-khi.jpg?v=${V}`,
    },
    {
      id: "tashkent",
      name: { en: "Tashkent", ru: "Ташкент", uz: "Toshkent" },
      tagline: { en: "Modern capital", ru: "Современная столица", uz: "Zamonaviy poytaxt" },
      image: `/images/dest-tash.jpg?v=${V}`,
    },
    {
      id: "desert",
      name: { en: "Kyzylkum", ru: "Кызылкум", uz: "Qizilqum" },
      tagline: { en: "Desert horizons", ru: "Пустынные горизонты", uz: "Cho'l manzaralari" },
      image: `/images/dest-desert.jpg?v=${V}`,
    },
    {
      id: "road",
      name: { en: "Silk Road night", ru: "Ночь на Шёлковом пути", uz: "Ipak yo'li kechasi" },
      tagline: { en: "Yurts in the desert", ru: "Юрты в пустыне", uz: "Cho'ldagi o'tovlar" },
      image: `/images/dest-road.jpg?v=${V}`,
    },
  ],
  services: {
    transfers: `/images/svc-transfer.jpg?v=${V}`, // Samarkand traffic / local cars
    guides: `/images/svc-guide.jpg?v=${V}`, // Po-i-Kalyan Bukhara
    dayTrips: `/images/svc-trip.jpg?v=${V}`, // Khiva Kalta Minor
  },
  /** Per vehicle model (homepage shows first 6) */
  vehiclesById: {
    cobalt: `/images/car-cobalt.jpg?v=${V}`,
    lacetti: `/images/car-lacetti.jpg?v=${V}`,
    malibu: `/images/car-malibu.jpg?v=${V}`,
    camry: `/images/car-camry.jpg?v=${V}`,
    "s-class": `/images/car-sclass.jpg?v=${V}`,
    tracker: `/images/car-tracker.jpg?v=${V}`,
  } as Record<string, string>,
  /** Category fallbacks for remaining fleet */
  vehicles: {
    economy: `/images/car-economy.jpg?v=${V}`,
    comfort: `/images/car-comfort.jpg?v=${V}`,
    premium: `/images/car-premium.jpg?v=${V}`,
    suv: `/images/car-suv.jpg?v=${V}`,
    minivan: `/images/car-minivan.jpg?v=${V}`,
    van: `/images/car-van.jpg?v=${V}`,
  } as Record<string, string>,
  dayTrips: {
    dt1: `/images/dest-sam.jpg?v=${V}`,
    dt2: `/images/dest-buk.jpg?v=${V}`,
    dt3: `/images/dest-khi.jpg?v=${V}`,
  },
  guides: {
    g1: `/images/g1.jpg?v=${V}`,
    g2: `/images/g2.jpg?v=${V}`,
    g3: `/images/g3.jpg?v=${V}`,
    g4: `/images/g4.jpg?v=${V}`,
    g5: `/images/g5.jpg?v=${V}`,
    g6: `/images/g6.jpg?v=${V}`,
  },
  routes: {
    "tash-sam": `/images/dest-sam.jpg?v=${V}`,
    "sam-buk": `/images/dest-buk.jpg?v=${V}`,
    "buk-khi": `/images/dest-khi.jpg?v=${V}`,
    "tash-buk": `/images/dest-buk.jpg?v=${V}`,
    "tash-fer": `/images/dest-tash.jpg?v=${V}`,
    "air-tash": "/images/airport.jpg",
    "sam-air": `/images/dest-sam.jpg?v=${V}`,
    "buk-air": `/images/dest-buk.jpg?v=${V}`,
    "khi-urg": `/images/dest-khi.jpg?v=${V}`,
    "tash-nuk": `/images/dest-desert.jpg?v=${V}`,
  } as Record<string, string>,
  cta: `/images/cta.jpg?v=${V}`,
};

export function vehicleImage(id: string, category: string): string {
  return images.vehiclesById[id] ?? images.vehicles[category] ?? images.vehicles.economy;
}

