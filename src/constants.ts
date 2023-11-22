import { z } from "zod";

//
//
//everytime a typescript type is changed, the corresponding zod type must be updated
export type CategoriesType =
  | "camisas"
  | "jeans"
  | "abrigos"
  | "pantalones"
  | "shorts"
  | "zapatos"
  | "vestidos"
  | "enaguas"
  | "blusa"
  | "accesorio";

export type GenreType = "male" | "female";

export type SizeType = "3XS" | "2XS" | "XS" | "S" | "M" | "L" | "2XL" | "3XL";
//
//

export interface FiltersType {
  genre?: string;
  category?: string;
  size?: string;
}

export const PROVINCES_NAMES = [
  "Alajuela",
  "Cartago",
  "Guanacaste",
  "Heredia",
  "Limón",
  "Puntarenas",
  "San José",
];

export const PROVINCES_MUNICIPALITIES = {
  Alajuela: {
    municipalities: [
      "San Carlos",
      "Zarcero",
      "Sarchí",
      "Upala",
      "Los Chiles",
      "Guatuso",
      "Río Cuarto",
      "Central",
      "San Ramón",
      "Grecia",
      "San Mateo",
      "Atenas",
      "Naranjo",
      "Palmares",
      "Poás",
      "Orotina",
    ],
  },
  Cartago: {
    municipalities: [
      "Central",
      "Paraíso",
      "La Unión",
      "Jiménez",
      "Turrialba",
      "Alvarado",
      "Oreamuno",
      "El Guarco",
    ],
  },
  Guanacaste: {
    municipalities: [
      "La Cruz",
      "Hojancha",
      "Liberia",
      "Nicoya",
      "Santa Cruz",
      "Bagaces",
      "Carrillo",
      "Cañas",
      "Abangares",
      "Tilarán",
      "Nandayure",
    ],
  },
  Heredia: {
    municipalities: [
      "Sarapiquí",
      "Central",
      "Barva",
      "Santo Domingo",
      "Santa Barbara",
      "San Rafael",
      "San Isidro",
      "Belén",
      "Flores",
      "San Pablo",
    ],
  },
  ["Limón"]: {
    municipalities: [
      "Central",
      "Pococí",
      "Siquirres",
      "Talamanca",
      "Matina",
      "Guácimo",
    ],
  },
  Puntarenas: {
    municipalities: [
      "Corredores",
      "Garabito",
      "Central",
      "Esparza",
      "Buenos Aires",
      "Montes De Oro",
      "Monte Verde",
      "Osa",
      "Quepos",
      "Golfito",
      "Coto Brus",
      "Parrita",
      "Puerto Jiménez",
    ],
  },
  ["San José"]: {
    municipalities: [
      "Alajuelita",
      "Vázquez De Coronado",
      "Acosta",
      "Tibás",
      "Moravia",
      "Montes De Oca",
      "Turrubares",
      "Dota",
      "Curridabat",
      "Pérez Zeledón",
      "León Cortés Castro",
      "Central",
      "Escazú",
      "Desamparados",
      "Puriscal",
      "Tarrazú",
      "Aserrí",
      "Mora",
      "Goicoechea",
      "Santa Ana",
    ],
  },
};
