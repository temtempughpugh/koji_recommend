import Papa from 'papaparse';
import type { KojiRecord } from '../types/KojiRecord';

export const parseCsvData = (csvText: string): KojiRecord[] => {
  const result = Papa.parse<string[]>(csvText, {
    skipEmptyLines: true,
    transform: (value) => value.trim()
  });

  if (result.errors.length > 0) {
    console.error('CSV解析エラー:', result.errors);
  }

  const dataRows = result.data.slice(2);
  
  return dataRows.map((row, index) => {
    try {
      // デバッグ用：生のCSVデータを確認
      console.log(`行 ${index + 3} の生データ:`, {
        '列9(時刻2-3h)': row[9],
        '列21(時刻手入れ前)': row[21],
        '列24(換気手入れ前)': row[24],
        '列25(排気手入れ前)': row[25],
        '列26(除湿機入り手入れ前)': row[26],
        '列27(除湿機戻り手入れ前)': row[27],
        '列28(風量手入れ前)': row[28]
      });
      
      return {
        // 基本情報
        machine: row[0] || '',
        date: row[1] || '',
        origin: row[2] || '',
        rice_age: row[3] || '',
        variety: row[4] || '',
        polishing_ratio: parseFloat(row[5]) || 0,
        sheets: parseInt(row[6]) || 0,
        weight: parseFloat(row[7]) || 0,
        
        // 温度データ
        temp_after_steaming: parseFloat(row[8]) || 0,
        time_2_3h_check: row[9] || '',
        time_2_3h_check_decimal: parseFloat(row[10]) || 0,
        temp_2_3h_check: parseFloat(row[11]) || 0,
        heater1_2_3h_check: parseFloat(row[12]) || 0,
        heater2_2_3h_check: parseFloat(row[13]) || 0,
        
        // 制御2→3
        ventilation_stage3: parseFloat(row[14]) || 0,
        exhaust_stage3: parseFloat(row[15]) || 0,
        dehumidifier_in_stage3: parseNumericOrString(row[16]),
        dehumidifier_out_stage3: parseNumericOrString(row[17]),
        heater1_stage3: parseFloat(row[18]) || 0,
        heater2_stage3: parseFloat(row[19]) || 0,
        airflow_stage3: parseFloat(row[20]) || 0,
        
        // 手入れ前
        time_before_handling: row[21] || '',
        time_before_handling_decimal: parseFloat(row[22]) || 0,
        temp_before_handling: parseFloat(row[23]) || 0,
        ventilation_before_handling: parseFloat(row[24]) || 0,
        exhaust_before_handling: parseFloat(row[25]) || 0,
        dehumidifier_in_before_handling: parseNumericOrString(row[26]),
        dehumidifier_out_before_handling: parseNumericOrString(row[27]),
        airflow_before_handling: parseFloat(row[28]) || 0,
        
        // 制御3→4
        change_flag_stage4: parseInt(row[29]) || 0,
        ventilation_stage4: parseFloat(row[30]) || 0,
        exhaust_stage4: parseFloat(row[31]) || 0,
        dehumidifier_in_stage4: parseNumericOrString(row[32]),
        dehumidifier_out_stage4: parseNumericOrString(row[33]),
        airflow_stage4: parseFloat(row[34]) || 0,
        
        // 制御4
        change_flag_stage5: parseInt(row[35]) || 0,
        ventilation_stage5: parseFloat(row[36]) || 0,
        exhaust_stage5: parseFloat(row[37]) || 0,
        
        // 朝から除湿
        ventilation_morning_dehumid: parseFloat(row[38]) || 0,
        exhaust_morning_dehumid: parseFloat(row[39]) || 0,
        dehumidifier_in_morning: parseNumericOrString(row[40]),
        dehumidifier_out_morning: parseNumericOrString(row[41]),
        airflow_morning_dehumid: parseFloat(row[42]) || 0,
        
        // 計算値
        temp_rise_rate_1: parseFloat(row[43]) || 0,
        temp_rise_rate_2: parseFloat(row[44]) || 0,
        time_to_41c: parseFloat(row[45]) || 0,
      } as KojiRecord;
    } catch (error) {
      console.error(`行 ${index + 3} の解析エラー:`, error, row);
      return null;
    }
  }).filter((record): record is KojiRecord => record !== null);
};

const parseNumericOrString = (value: string): string | number => {
  if (!value || value === '') return 0;
  
  const trimmed = value.trim();
  if (trimmed === '全開' || trimmed === '全閉') {
    return trimmed;
  }
  
  const numeric = parseFloat(trimmed);
  return isNaN(numeric) ? trimmed : numeric;
};

export const loadCsvFile = async (): Promise<KojiRecord[]> => {
  try {
    const response = await fetch('/麹記録集計表.csv');
    if (!response.ok) {
      throw new Error(`CSVファイルの読み込みに失敗しました: ${response.status}`);
    }
    
    const csvText = await response.text();
    return parseCsvData(csvText);
  } catch (error) {
    console.error('CSVファイル読み込みエラー:', error);
    throw error;
  }
};