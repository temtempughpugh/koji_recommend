import React, { useState } from 'react';
import type { SummaryStats as SummaryStatsType } from '../types/KojiRecord';

interface SummaryStatsProps {
  stats: SummaryStatsType;
}

export const SummaryStatsComponent: React.FC<SummaryStatsProps> = ({ stats }) => {
  const [showBeforeHandling, setShowBeforeHandling] = useState(false);
  const [showAfterHandling, setShowAfterHandling] = useState(true);

  const formatValue = (value: number): string => {
    if (value === 0) return '-';
    return value.toFixed(2);
  };

  const StatRow = ({ label, controlStats }: { label: string; controlStats: any }) => (
    <tr>
      <td>{label}</td>
      <td>{controlStats.count}</td>
      <td>
        {controlStats.frequentValues?.length > 0 ? (
          <div className="frequent-values">
            {controlStats.frequentValues.map((fv: any, index: number) => (
              <span key={index} className="frequent-item">
                {formatValue(fv.value)}({fv.count}回)
              </span>
            ))}
          </div>
        ) : '-'}
      </td>
      <td>{formatValue(controlStats.min)} 〜 {formatValue(controlStats.max)}</td>
      <td>{formatValue(controlStats.average)}</td>
      <td>{formatValue(controlStats.median)}</td>
    </tr>
  );

  return (
    <div className="summary-stats">
      <h2>要約データ</h2>
      
      <div className="toggle-controls">
        <label>
          <input 
            type="checkbox"
            checked={showBeforeHandling}
            onChange={(e) => setShowBeforeHandling(e.target.checked)}
          />
          手入れ前を表示
        </label>
        <label>
          <input 
            type="checkbox"
            checked={showAfterHandling}
            onChange={(e) => setShowAfterHandling(e.target.checked)}
          />
          手入れ後を表示
        </label>
      </div>

      {showBeforeHandling && (
        <div className="stats-section">
          <h3>手入れ前（③制御2→3）</h3>
          <table>
            <thead>
              <tr>
                <th>項目</th>
                <th>件数</th>
                <th>頻出値(回数)</th>
                <th>範囲（最小〜最大）</th>
                <th>平均値</th>
                <th>中央値</th>
              </tr>
            </thead>
            <tbody>
              <StatRow label="換気" controlStats={stats.beforeHandling.ventilation} />
              <StatRow label="排気" controlStats={stats.beforeHandling.exhaust} />
              <StatRow label="除湿機入り" controlStats={stats.beforeHandling.dehumidifier_in} />
              <StatRow label="除湿機戻り" controlStats={stats.beforeHandling.dehumidifier_out} />
              <StatRow label="保温1" controlStats={stats.beforeHandling.heater1} />
              <StatRow label="保温2" controlStats={stats.beforeHandling.heater2} />
              <StatRow label="風量" controlStats={stats.beforeHandling.airflow} />
            </tbody>
          </table>
        </div>
      )}

      {showAfterHandling && (
        <div className="stats-section">
          <h3>手入れ後（⑤制御3→4）</h3>
          <table>
            <thead>
              <tr>
                <th>項目</th>
                <th>件数</th>
                <th>頻出値(回数)</th>
                <th>範囲（最小〜最大）</th>
                <th>平均値</th>
                <th>中央値</th>
              </tr>
            </thead>
            <tbody>
              <StatRow label="換気" controlStats={stats.afterHandling.ventilation} />
              <StatRow label="排気" controlStats={stats.afterHandling.exhaust} />
              <StatRow label="除湿機入り" controlStats={stats.afterHandling.dehumidifier_in} />
              <StatRow label="除湿機戻り" controlStats={stats.afterHandling.dehumidifier_out} />
              <StatRow label="風量" controlStats={stats.afterHandling.airflow} />
            </tbody>
          </table>
        </div>
      )}

      <style>{`
        .summary-stats {
          background: white;
          border: 1px solid #ddd;
          border-radius: 8px;
          padding: 1.5rem;
          margin-bottom: 2rem;
        }

        h2 {
          margin: 0 0 1rem 0;
          color: #333;
          font-size: 1.25rem;
        }

        .toggle-controls {
          display: flex;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        .toggle-controls label {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          cursor: pointer;
        }

        .stats-section {
          margin-bottom: 2rem;
        }

        h3 {
          color: #555;
          margin-bottom: 1rem;
          font-size: 1.1rem;
        }

        table {
          width: 100%;
          border-collapse: collapse;
          font-size: 14px;
        }

        th, td {
          padding: 0.75rem;
          text-align: left;
          border-bottom: 1px solid #eee;
        }

        th {
          background-color: #f8f9fa;
          font-weight: bold;
          color: #555;
        }

        tr:hover {
          background-color: #f8f9fa;
        }

        td:nth-child(2), 
        td:nth-child(4), 
        td:nth-child(5), 
        td:nth-child(6) {
          text-align: right;
          font-family: monospace;
        }

        .frequent-values {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .frequent-item {
          background: #e9ecef;
          padding: 2px 6px;
          border-radius: 3px;
          font-size: 11px;
          font-family: monospace;
          color: #495057;
        }
      `}</style>
    </div>
  );
};