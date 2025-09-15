import type { KojiRecord, ControlStats, SummaryStats } from '../types/KojiRecord';

export const calculateStats = (values: (string | number)[]): ControlStats => {
  const numericValues = values
    .filter(v => v !== null && v !== undefined && v !== '' && v !== '全開' && v !== '全閉')
    .map(v => typeof v === 'string' ? parseFloat(v) : v)
    .filter(v => !isNaN(v));

  if (numericValues.length === 0) {
    return {
      count: 0,
      min: 0,
      max: 0,
      average: 0,
      median: 0,
      frequentValues: []
    };
  }

  const sorted = [...numericValues].sort((a, b) => a - b);
  const sum = numericValues.reduce((acc, val) => acc + val, 0);
  const median = sorted.length % 2 === 0
    ? (sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2
    : sorted[Math.floor(sorted.length / 2)];

  // 頻出値を計算
  const frequencyMap = new Map<number, number>();
  numericValues.forEach(value => {
    const rounded = Math.round(value * 100) / 100;
    frequencyMap.set(rounded, (frequencyMap.get(rounded) || 0) + 1);
  });

  const frequentValues = Array.from(frequencyMap.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([value, count]) => ({ value, count }));

  return {
    count: numericValues.length,
    min: Math.min(...numericValues),
    max: Math.max(...numericValues),
    average: sum / numericValues.length,
    median,
    frequentValues
  };
};

export const calculateSummaryStats = (records: KojiRecord[]): SummaryStats => {
  return {
    beforeHandling: {
      ventilation: calculateStats(records.map(r => r.ventilation_stage3)),
      exhaust: calculateStats(records.map(r => r.exhaust_stage3)),
      dehumidifier_in: calculateStats(records.map(r => r.dehumidifier_in_stage3)),
      dehumidifier_out: calculateStats(records.map(r => r.dehumidifier_out_stage3)),
      heater1: calculateStats(records.map(r => r.heater1_stage3)),
      heater2: calculateStats(records.map(r => r.heater2_stage3)),
      airflow: calculateStats(records.map(r => r.airflow_stage3))
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