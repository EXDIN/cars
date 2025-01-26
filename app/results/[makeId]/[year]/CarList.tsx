import { log } from "console";
import React from "react";

export type Car = {
  Make_ID: number;
  Make_Name: string;
  Model_ID: number;
  Model_Name: string;
};

const CarList = ({ cars }: { cars: Car[] }) => {
  if (cars.length === 0) {
    return (
      <h2 className="flex items-center bg-gray-900 min-h-screen justify-center text-white">
        Авто за вказаними параметрами не знайдені ...
      </h2>
    );
  }
  return (
    <ul className="flex flex-col items-center gap-y-4 bg-gray-900 min-h-screen justify-center pt-4 pb-4">
      <h2 className="text-white">Знайдені Авто: </h2>
      {cars.map((car, index) => (
        <li key={car.Make_ID+""+car.Model_ID+""+index} className="rounded-md bg-beige p-2 text-black">
          {car.Make_Name + "  " + car.Model_Name}
        </li>
      ))}
    </ul>
  );
};

export default CarList;
