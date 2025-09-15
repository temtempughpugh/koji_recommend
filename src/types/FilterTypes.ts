// src/types/FilterTypes.ts
export interface FilterState {
  variety: string;
  origin: string;
  polishing_ratio: number;
  polishing_range: number; // ±範囲
  weight_min: number;
  weight_max: number;
  sheets: number;
}

export interface FilterOptions {
  varieties: string[];
  origins: string[];
  sheets: number[];
}