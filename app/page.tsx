"use client";

import { ChangeEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import React from "react";

const getCars = async (): Promise<TypeCars | undefined> => {
  try {
    const response = await fetch(
      "https://vpic.nhtsa.dot.gov/api/vehicles/GetMakesForVehicleType/car?format=json"
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

type TypeCar = {
  MakeId: number;
  MakeName: string;
  VehicleTypeId: number;
  VehicleTypeName: string;
};

type TypeCars = {
  Count: number;
  Message: string;
  Results: TypeCar[];
  SearchCriteria: string;
};

const getYears = () => {
  const currentYear = new Date().getFullYear();
  const years = [];

  for (let year = 2015; year <= currentYear; year++) {
    years.push(year);
  }

  return years;
};

type dataType = {
  car: TypeCar;
  year: number;
};

const generateStaticParams = (id: string, year: string) => {
  return `/results/${id}/${year}`;
};

const years = getYears();

export default function Home() {
  const router = useRouter();
  const [cars, setCars] = useState<TypeCars>();
  const [selectedData, setSelectedData] = useState<dataType>({} as dataType);

  useEffect(() => {
    const loadCars = async () => {
      const loadedCars = await getCars();
      if (loadedCars) {
        setCars(loadedCars);
      }
    };

    loadCars();
  }, []);

  const handleCarChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const carData = cars?.Results.find(
      (car) => car.MakeId === Number(event.target.value)
    );
    if (!carData) {
      return;
    }

    setSelectedData((prevState) => ({
      ...prevState,
      car: carData,
    }));
  };

  const handleYearChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setSelectedData((prevState) => ({
      ...prevState,
      year: Number(event.target.value),
    }));
  };

  const handleSelectButton = () => {
    router.push(
      generateStaticParams(
        String(selectedData.car.MakeId),
        String(selectedData.year)
      )
    );
  };

  const isButtonEnabled =
    selectedData.year !== undefined &&
    selectedData.car &&
    selectedData.car.MakeId !== 0;

  return (
    <div className="flex flex-col items-center gap-y-4 bg-gray-900 min-h-screen justify-center">
      <select
        defaultValue=""
        onChange={handleCarChange}
        className="rounded-lg p-1"
      >
        <option value="" disabled>
          Виберіть марку автомобіля
        </option>
        {cars
          ? cars.Results.map((car) => (
              <option key={car.MakeId} value={car.MakeId}>
                {car.MakeName}
              </option>
            ))
          : null}
      </select>
      <select
        defaultValue=""
        onChange={handleYearChange}
        className="rounded-lg p-1"
      >
        <option value="" disabled>
          Виберіть рік
        </option>
        {years
          ? years.map((year, index) => (
              <option key={index} value={year}>
                {year}
              </option>
            ))
          : null}
      </select>
      <button
        type="button"
        onClick={handleSelectButton}
        disabled={!isButtonEnabled}
        className={`text-white rounded-lg p-2 ${
          isButtonEnabled
            ? "bg-blue-500 hover:bg-blue-700 cursor-pointer"
            : "bg-gray-500 cursor-not-allowed"
        }`}
      >
        Пошук автомобів
      </button>
    </div>
  );
}
