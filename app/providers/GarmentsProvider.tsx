"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";
import {
  normalizeGarmentCategory,
  normalizeGarmentSeason,
} from "@/lib/garment-utils";

export type GarmentCategory = "top" | "bottom" | "shoes" | "outerwear";
export type GarmentSeason = "all" | "summer" | "winter";

export type Garment = {
  _id: string;
  name: string;
  category: GarmentCategory;
  color: string;
  style?: string;
  material?: string;
  season: GarmentSeason;
  imageUrl: string;
  isFavorite?: boolean;
  favorite?: boolean;
};

type GarmentsContextValue = {
  garments: Garment[];
  loaded: boolean;
  isLoadingGarments: boolean;
  refreshGarments: (force?: boolean) => Promise<Garment[]>;
  setGarments: Dispatch<SetStateAction<Garment[]>>;
};

const GarmentsContext = createContext<GarmentsContextValue | null>(null);

function normalizeGarment(garment: Garment): Garment {
  return {
    ...garment,
    category: normalizeGarmentCategory(garment.category),
    season: normalizeGarmentSeason(garment.season),
    isFavorite: Boolean(garment.isFavorite ?? garment.favorite),
    favorite: Boolean(garment.isFavorite ?? garment.favorite),
    style: garment.style ?? "",
    material: garment.material ?? "",
  };
}

export function GarmentsProvider({ children }: { children: ReactNode }) {
  const [garments, setGarmentsState] = useState<Garment[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [isLoadingGarments, setIsLoadingGarments] = useState(false);
  const hasFetchedRef = useRef(false);
  const fetchPromiseRef = useRef<Promise<Garment[]> | null>(null);

  const setGarments = useCallback<Dispatch<SetStateAction<Garment[]>>>((next) => {
    setGarmentsState((current) => {
      const resolved =
        typeof next === "function"
          ? (next as (garments: Garment[]) => Garment[])(current)
          : next;

      return resolved.map(normalizeGarment);
    });
    setLoaded(true);
  }, []);

  const refreshGarments = useCallback(async (force = false) => {
    console.log("GARMENTS IN STATE:", garments.length);

    if (!force && garments.length > 0) {
      setLoaded(true);
      return garments;
    }

    if (!force && (loaded || hasFetchedRef.current)) {
      return garments;
    }

    if (fetchPromiseRef.current && !force) {
      return fetchPromiseRef.current;
    }

    console.log("FETCHING GARMENTS...");
    hasFetchedRef.current = true;
    setIsLoadingGarments(true);

    const fetchPromise = (async () => {
      const res = await fetch("/api/wardrobe", { credentials: "include" });

      if (!res.ok) {
        hasFetchedRef.current = false;
        return garments;
      }

      const data = await res.json();
      const normalizedGarments = Array.isArray(data)
        ? (data as Garment[]).map(normalizeGarment)
        : [];

      setGarmentsState(normalizedGarments);
      setLoaded(true);
      return normalizedGarments;
    })();

    fetchPromiseRef.current = fetchPromise;

    try {
      return await fetchPromise;
    } finally {
      fetchPromiseRef.current = null;
      setIsLoadingGarments(false);
    }
  }, [garments, loaded]);

  const value = useMemo<GarmentsContextValue>(
    () => ({
      garments,
      loaded,
      isLoadingGarments,
      refreshGarments,
      setGarments,
    }),
    [garments, loaded, isLoadingGarments, refreshGarments, setGarments]
  );

  return (
    <GarmentsContext.Provider value={value}>
      {children}
    </GarmentsContext.Provider>
  );
}

export function useGarments() {
  const context = useContext(GarmentsContext);

  if (!context) {
    throw new Error("useGarments must be used within GarmentsProvider");
  }

  return context;
}
