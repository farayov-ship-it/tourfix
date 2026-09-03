"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import type { Route } from "@/lib/data";

interface BookingData {
  from?: string;
  to?: string;
  price?: number;
}

interface BookingContextValue {
  isOpen: boolean;
  data: BookingData;
  openBooking: (data?: BookingData) => void;
  closeBooking: () => void;
}

const BookingContext = createContext<BookingContextValue | null>(null);

export function BookingProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState<BookingData>({});

  const openBooking = useCallback((bookingData?: BookingData) => {
    setData(bookingData ?? {});
    setIsOpen(true);
  }, []);

  const closeBooking = useCallback(() => {
    setIsOpen(false);
  }, []);

  return (
    <BookingContext.Provider value={{ isOpen, data, openBooking, closeBooking }}>
      {children}
    </BookingContext.Provider>
  );
}

export function useBooking() {
  const ctx = useContext(BookingContext);
  if (!ctx) throw new Error("useBooking must be used within BookingProvider");
  return ctx;
}

export function routeToBooking(route: Route): BookingData {
  return { from: route.from, to: route.to, price: route.price };
}
