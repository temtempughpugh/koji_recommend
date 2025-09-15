// src/types/FilterTypes.ts
export interface FilterState {
  variety: string;
  origin: string;
  polishing_ratio: number;
  polishing_range: number; // ±範囲
  weight_min: number;
  weight_max: number;
  sheets: number[]; // 数値から配列に変更
}

export interface FilterOptions {
  varieties: string[];
  origins: string[];
  sheets: number[];
}