"use client";

import { usePathname } from "next/navigation";
import { lazy, Suspense, useEffect, useState } from "react";
import { Car } from "./CarList";
import React from "react";

const CarList = lazy(() => import("./CarList"));

type FindedCars = {
  Count: number;
  Message: string;
  SearchCriteria: string;
  Results: Car[];
};

const getCarsByFilter = async (
  carId: string,
  year: string
): Promise<FindedCars | undefined> => {
  try {
    const response = await fetch(
      `https://vpic.nhtsa.dot.gov/api/vehicles/GetModelsForMakeIdYear/makeId/${carId}/modelyear/${year}?format=json`
    );
    if (!response.ok) {
      throw new Error("Помилка завантаження");
    }

    const data = await response.json();
    return data;
  } catch (e) {
    console.log(e);
  }
};

export default function CarByFilted() {
  const [carsByFilet, setCarsByFilter] = useState<FindedCars>();
  const [isLoad, setIsLoad] = useState(true);
  const router = usePathname().split("/");
  const car = String(router[2]);
  const year = String(router[3]);

  useEffect(() => {
    const loadCars = async () => {
      setIsLoad(true);
      const cars = await getCarsByFilter(car, year);
      if (cars && cars.Count !== 0) {
        setCarsByFilter(cars);
      }
      setIsLoad(false);
    };

    loadCars();
  }, [car, year]);

  if (isLoad) {
    return (
      <div className="flex items-center bg-gray-900 min-h-screen justify-center text-white">
        Пошук авто ...
      </div>
    );
  }

  return (
    <div className="bg-gray-900 min-h-screen">
      <Suspense
        fallback={
          <p className="text-white flex items-center bg-gray-900 min-h-screen justify-center">
            Завантаження авто...
          </p>
        }
      >
        <CarList cars={carsByFilet ? carsByFilet.Results : []} />
      </Suspense>
    </div>
  );
}
