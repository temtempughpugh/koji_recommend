import type { KojiRecord, ControlStats, SummaryStats } from '../types/KojiRecord';

export const calculateStats = (values: (string | number)[]): ControlStats => {
  // 数値データの処理（0も除外）
  const numericValues = values
    .filter(v => v !== null && v !== undefined && v !== '' && v !== 0 && v !== '全開' && v !== '全閉')
    .map(v => typeof v === 'string' ? parseFloat(v) : v)
    .filter(v => !isNaN(v) && v !== 0);

  // 文字列データの処理（全開・全閉）
  const stringValues = values
    .filter(v => v === '全開' || v === '全閉') as string[];

  // 数値統計計算（データがない場合の初期化も修正）
  let numericStats = {
    count: numericValues.length,
    min: numericValues.length > 0 ? Math.min(...numericValues) : 0,
    max: numericValues.length > 0 ? Math.max(...numericValues) : 0,
    average: 0,
    median: 0
  };

  if (numericValues.length > 0) {
    const sorted = [...numericValues].sort((a, b) => a - b);
    const sum = numericValues.reduce((acc, val) => acc + val, 0);
    const median = sorted.length % 2 === 0
      ? (sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2
      : sorted[Math.floor(sorted.length / 2)];

    numericStats.average = sum / numericValues.length;
    numericStats.median = median;
  }

  // 数値の頻出値を計算
  const frequencyMap = new Map<number, number>();
  numericValues.forEach(value => {
    const rounded = Math.round(value * 100) / 100;
    frequencyMap.set(rounded, (frequencyMap.get(rounded) || 0) + 1);
  });

  const frequentValues = Array.from(frequencyMap.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([value, count]) => ({ value, count }));

  // 文字列の頻出値を計算
  const stringFrequencyMap = new Map<string, number>();
  stringValues.forEach(value => {
    stringFrequencyMap.set(value, (stringFrequencyMap.get(value) || 0) + 1);
  });

  const frequentStringValues = Array.from(stringFrequencyMap.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([value, count]) => ({ value, count }));

  return {
    ...numericStats,
    frequentValues,
    frequentStringValues
  };
};

export const calculateSummaryStats = (records: KojiRecord[]): SummaryStats => {
  return {
    beforeHandling: {
      ventilation: calculateStats(records.map(r => r.ventilation_before_handling)),
      exhaust: calculateStats(records.map(r => r.exhaust_before_handling)),
      dehumidifier_in: calculateStats(records.map(r => r.dehumidifier_in_before_handling)),
      dehumidifier_out: calculateStats(records.map(r => r.dehumidifier_out_before_handling)),
      heater1: calculateStats(records.map(r => r.heater1_stage3)),
      heater2: calculateStats(records.map(r => r.heater2_stage3)),
      airflow: calculateStats(records.map(r => r.airflow_before_handling))
    },
    afterHandling: {
      ventilation: calculateStats(records.map(r => r.ventilation_stage4)),
      exhaust: calculateStats(records.map(r => r.exhaust_stage4)),
      dehumidifier_in: calculateStats(records.map(r => r.dehumidifier_in_stage4)),
      dehumidifier_out: calculateStats(records.map(r => r.dehumidifier_out_stage4)),
      airflow: calculateStats(records.map(r => r.airflow_stage4))
    }
  };
};