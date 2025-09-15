export interface KojiRecord {
  machine: string;
  date: string;
  origin: string;
  rice_age: string;
  variety: string;
  polishing_ratio: number;
  sheets: number;
  weight: number;
  
  // 温度データ
  temp_after_steaming: number;
  time_2_3h_check: string;
  time_2_3h_check_decimal: number;
  temp_2_3h_check: number;
  heater1_2_3h_check: number;
  heater2_2_3h_check: number;
  
  // 制御2→3
  ventilation_stage3: number;
  exhaust_stage3: number;
  dehumidifier_in_stage3: string | number;
  dehumidifier_out_stage3: string | number;
  heater1_stage3: number;
  heater2_stage3: number;
  airflow_stage3: number;
  
  // 手入れ前
  time_before_handling: string;
  time_before_handling_decimal: number;
  temp_before_handling: number;
  ventilation_before_handling: number;
  exhaust_before_handling: number;
  dehumidifier_in_before_handling: string | number;
  dehumidifier_out_before_handling: string | number;
  airflow_before_handling: number;
  
  // 制御3→4
  change_flag_stage4: number;
  ventilation_stage4: number;
  exhaust_stage4: number;
  dehumidifier_in_stage4: string | number;
  dehumidifier_out_stage4: string | number;
  airflow_stage4: number;
  
  // 制御4
  change_flag_stage5: number;
  ventilation_stage5: number;
  exhaust_stage5: number;
  
  // 朝から除湿
  ventilation_morning_dehumid: number;
  exhaust_morning_dehumid: number;
  dehumidifier_in_morning: string | number;
  dehumidifier_out_morning: string | number;
  airflow_morning_dehumid: number;
  
  // 計算値
  temp_rise_rate_1: number;
  temp_rise_rate_2: number;
  time_to_41c: number;
}

// 統計データの型
export interface ControlStats {
  count: number;
  min: number;
  max: number;
  average: number;
  median: number;
  frequentValues: Array<{ value: number; count: number }>;
}

// 要約統計データの型
export interface SummaryStats {
  // 手入れ前（③制御2→3）
  beforeHandling: {
    ventilation: ControlStats;
    exhaust: ControlStats;
    dehumidifier_in: ControlStats;
    dehumidifier_out: ControlStats;
    heater1: ControlStats;
    heater2: ControlStats;
    airflow: ControlStats;
  };
  // 手入れ後（⑤制御3→4）
  afterHandling: {
    ventilation: ControlStats;
    exhaust: ControlStats;
    dehumidifier_in: ControlStats;
    dehumidifier_out: ControlStats;
    airflow: ControlStats;
  };
}