import React, { useState, useMemo } from 'react';
import type { SummaryStats as SummaryStatsType, ControlStats, KojiRecord } from '../types/KojiRecord';
import { calculateSummaryStats, calculateStats } from '../utils/statsCalculator';

interface SummaryStatsProps {
  stats: SummaryStatsType;
  data: KojiRecord[];
}

export const SummaryStatsComponent: React.FC<SummaryStatsProps> = ({ stats, data }) => {
  const [showBeforeHandling, setShowBeforeHandling] = useState(false);
  const [showAfterHandling, setShowAfterHandling] = useState(true);
  const [showMorningDehumid, setShowMorningDehumid] = useState(false);
  const [dehumidifierUnusedOnly, setDehumidifierUnusedOnly] = useState(false);

  // 除湿機フィルタリング後の統計を計算
  const filteredStats = useMemo(() => {
    if (!dehumidifierUnusedOnly) return stats;
    
    const filteredData = data.filter(record => {
      // 手入れ後の除湿機入り・戻りをチェック（除湿機不使用のみ）
      const isDehumidifierUnused = (
        record.dehumidifier_in_stage4 === '全閉' && 
        record.dehumidifier_out_stage4 === '全閉'
      );
      return isDehumidifierUnused;
    });
    
    return calculateSummaryStats(filteredData);
  }, [stats, data, dehumidifierUnusedOnly]);

  // 朝から除湿の統計を計算
  const morningStats = useMemo(() => {
    const currentData = dehumidifierUnusedOnly 
      ? data.filter(record => {
          const isDehumidifierUnused = (
            record.dehumidifier_in_stage4 === '全閉' && 
            record.dehumidifier_out_stage4 === '全閉'
          );
          return isDehumidifierUnused;
        })
      : data;

    return {
      ventilation: calculateStats(currentData.map(r => r.ventilation_morning_dehumid)),
      exhaust: calculateStats(currentData.map(r => r.exhaust_morning_dehumid)),
      dehumidifier_in: calculateStats(currentData.map(r => r.dehumidifier_in_morning)),
      dehumidifier_out: calculateStats(currentData.map(r => r.dehumidifier_out_morning)),
      airflow: calculateStats(currentData.map(r => r.airflow_morning_dehumid))
    };
  }, [data, dehumidifierUnusedOnly]);

  const formatValue = (value: number): string => {
    if (value === 0) return '-';
    return value.toFixed(2);
  };

  const renderFrequentValues = (controlStats: ControlStats) => (
    <div className="frequent-values-horizontal">
      {controlStats.frequentValues?.map((fv, index) => (
        <span key={`num-${index}`} className="frequent-item">
          {formatValue(fv.value)}({fv.count}回)
        </span>
      ))}
      {controlStats.frequentStringValues?.map((fv, index) => (
        <span 
          key={`str-${index}`} 
          className="frequent-item string-value" 
          style={{
            backgroundColor: fv.value === '全開' ? '#ffebee' : fv.value === '全閉' ? '#e3f2fd' : '#ffeaa7',
            color: fv.value === '全開' ? '#d32f2f' : fv.value === '全閉' ? '#1976d2' : '#d63031',
            fontWeight: 'bold'
          }}
        >
          {fv.value}({fv.count}回)
        </span>
      ))}
    </div>
  );

  return (
    <div className="summary-stats">
      <div className="stats-header">
        <h2>要約データ</h2>
        <div className="stats-controls">
          <label className="dehumidifier-filter">
            <input
              type="checkbox"
              checked={dehumidifierUnusedOnly}
              onChange={(e) => setDehumidifierUnusedOnly(e.target.checked)}
            />
            <span>除湿機不使用時を表示</span>
          </label>
        </div>
      </div>
      
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
        <label>
          <input 
            type="checkbox"
            checked={showMorningDehumid}
            onChange={(e) => setShowMorningDehumid(e.target.checked)}
          />
          朝から除湿を表示
        </label>
      </div>

      {showBeforeHandling && (
        <div className="stats-section">
          <h3>手入れ前（③制御2→3）</h3>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>統計項目</th>
                  <th>換気</th>
                  <th>排気</th>
                  <th>除湿機入り</th>
                  <th>除湿機戻り</th>
                  <th>保温1</th>
                  <th>保温2</th>
                  <th>風量</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="stat-label">件数</td>
                  <td>{filteredStats.beforeHandling.ventilation.count}</td>
                  <td>{filteredStats.beforeHandling.exhaust.count}</td>
                  <td>{filteredStats.beforeHandling.dehumidifier_in.count}</td>
                  <td>{filteredStats.beforeHandling.dehumidifier_out.count}</td>
                  <td>{filteredStats.beforeHandling.heater1.count}</td>
                  <td>{filteredStats.beforeHandling.heater2.count}</td>
                  <td>{filteredStats.beforeHandling.airflow.count}</td>
                </tr>
                <tr>
                  <td className="stat-label">頻出値</td>
                  <td>{renderFrequentValues(filteredStats.beforeHandling.ventilation)}</td>
                  <td>{renderFrequentValues(filteredStats.beforeHandling.exhaust)}</td>
                  <td>{renderFrequentValues(filteredStats.beforeHandling.dehumidifier_in)}</td>
                  <td>{renderFrequentValues(filteredStats.beforeHandling.dehumidifier_out)}</td>
                  <td>{renderFrequentValues(filteredStats.beforeHandling.heater1)}</td>
                  <td>{renderFrequentValues(filteredStats.beforeHandling.heater2)}</td>
                  <td>{renderFrequentValues(filteredStats.beforeHandling.airflow)}</td>
                </tr>
                <tr>
                  <td className="stat-label">範囲</td>
                  <td>{formatValue(filteredStats.beforeHandling.ventilation.min)} 〜 {formatValue(filteredStats.beforeHandling.ventilation.max)}</td>
                  <td>{formatValue(filteredStats.beforeHandling.exhaust.min)} 〜 {formatValue(filteredStats.beforeHandling.exhaust.max)}</td>
                  <td>{formatValue(filteredStats.beforeHandling.dehumidifier_in.min)} 〜 {formatValue(filteredStats.beforeHandling.dehumidifier_in.max)}</td>
                  <td>{formatValue(filteredStats.beforeHandling.dehumidifier_out.min)} 〜 {formatValue(filteredStats.beforeHandling.dehumidifier_out.max)}</td>
                  <td>{formatValue(filteredStats.beforeHandling.heater1.min)} 〜 {formatValue(filteredStats.beforeHandling.heater1.max)}</td>
                  <td>{formatValue(filteredStats.beforeHandling.heater2.min)} 〜 {formatValue(filteredStats.beforeHandling.heater2.max)}</td>
                  <td>{formatValue(filteredStats.beforeHandling.airflow.min)} 〜 {formatValue(filteredStats.beforeHandling.airflow.max)}</td>
                </tr>
                <tr>
                  <td className="stat-label">平均値</td>
                  <td>{formatValue(filteredStats.beforeHandling.ventilation.average)}</td>
                  <td>{formatValue(filteredStats.beforeHandling.exhaust.average)}</td>
                  <td>{formatValue(filteredStats.beforeHandling.dehumidifier_in.average)}</td>
                  <td>{formatValue(filteredStats.beforeHandling.dehumidifier_out.average)}</td>
                  <td>{formatValue(filteredStats.beforeHandling.heater1.average)}</td>
                  <td>{formatValue(filteredStats.beforeHandling.heater2.average)}</td>
                  <td>{formatValue(filteredStats.beforeHandling.airflow.average)}</td>
                </tr>
                <tr>
                  <td className="stat-label">中央値</td>
                  <td>{formatValue(filteredStats.beforeHandling.ventilation.median)}</td>
                  <td>{formatValue(filteredStats.beforeHandling.exhaust.median)}</td>
                  <td>{formatValue(filteredStats.beforeHandling.dehumidifier_in.median)}</td>
                  <td>{formatValue(filteredStats.beforeHandling.dehumidifier_out.median)}</td>
                  <td>{formatValue(filteredStats.beforeHandling.heater1.median)}</td>
                  <td>{formatValue(filteredStats.beforeHandling.heater2.median)}</td>
                  <td>{formatValue(filteredStats.beforeHandling.airflow.median)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showAfterHandling && (
        <div className="stats-section">
          <h3>手入れ後（⑤制御3→4）</h3>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>統計項目</th>
                  <th>換気</th>
                  <th>排気</th>
                  <th>除湿機入り</th>
                  <th>除湿機戻り</th>
                  <th>風量</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="stat-label">件数</td>
                  <td>{filteredStats.afterHandling.ventilation.count}</td>
                  <td>{filteredStats.afterHandling.exhaust.count}</td>
                  <td>{filteredStats.afterHandling.dehumidifier_in.count}</td>
                  <td>{filteredStats.afterHandling.dehumidifier_out.count}</td>
                  <td>{filteredStats.afterHandling.airflow.count}</td>
                </tr>
                <tr>
                  <td className="stat-label">頻出値</td>
                  <td>{renderFrequentValues(filteredStats.afterHandling.ventilation)}</td>
                  <td>{renderFrequentValues(filteredStats.afterHandling.exhaust)}</td>
                  <td>{renderFrequentValues(filteredStats.afterHandling.dehumidifier_in)}</td>
                  <td>{renderFrequentValues(filteredStats.afterHandling.dehumidifier_out)}</td>
                  <td>{renderFrequentValues(filteredStats.afterHandling.airflow)}</td>
                </tr>
                <tr>
                  <td className="stat-label">範囲</td>
                  <td>{formatValue(filteredStats.afterHandling.ventilation.min)} 〜 {formatValue(filteredStats.afterHandling.ventilation.max)}</td>
                  <td>{formatValue(filteredStats.afterHandling.exhaust.min)} 〜 {formatValue(filteredStats.afterHandling.exhaust.max)}</td>
                  <td>{formatValue(filteredStats.afterHandling.dehumidifier_in.min)} 〜 {formatValue(filteredStats.afterHandling.dehumidifier_in.max)}</td>
                  <td>{formatValue(filteredStats.afterHandling.dehumidifier_out.min)} 〜 {formatValue(filteredStats.afterHandling.dehumidifier_out.max)}</td>
                  <td>{formatValue(filteredStats.afterHandling.airflow.min)} 〜 {formatValue(filteredStats.afterHandling.airflow.max)}</td>
                </tr>
                <tr>
                  <td className="stat-label">平均値</td>
                  <td>{formatValue(filteredStats.afterHandling.ventilation.average)}</td>
                  <td>{formatValue(filteredStats.afterHandling.exhaust.average)}</td>
                  <td>{formatValue(filteredStats.afterHandling.dehumidifier_in.average)}</td>
                  <td>{formatValue(filteredStats.afterHandling.dehumidifier_out.average)}</td>
                  <td>{formatValue(filteredStats.afterHandling.airflow.average)}</td>
                </tr>
                <tr>
                  <td className="stat-label">中央値</td>
                  <td>{formatValue(filteredStats.afterHandling.ventilation.median)}</td>
                  <td>{formatValue(filteredStats.afterHandling.exhaust.median)}</td>
                  <td>{formatValue(filteredStats.afterHandling.dehumidifier_in.median)}</td>
                  <td>{formatValue(filteredStats.afterHandling.dehumidifier_out.median)}</td>
                  <td>{formatValue(filteredStats.afterHandling.airflow.median)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showMorningDehumid && (
        <div className="stats-section">
          <h3>朝から除湿（⑦朝から除湿）</h3>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>統計項目</th>
                  <th>換気</th>
                  <th>排気</th>
                  <th>除湿機入り</th>
                  <th>除湿機戻り</th>
                  <th>風量</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="stat-label">件数</td>
                  <td>{morningStats.ventilation.count}</td>
                  <td>{morningStats.exhaust.count}</td>
                  <td>{morningStats.dehumidifier_in.count}</td>
                  <td>{morningStats.dehumidifier_out.count}</td>
                  <td>{morningStats.airflow.count}</td>
                </tr>
                <tr>
                  <td className="stat-label">頻出値</td>
                  <td>{renderFrequentValues(morningStats.ventilation)}</td>
                  <td>{renderFrequentValues(morningStats.exhaust)}</td>
                  <td>{renderFrequentValues(morningStats.dehumidifier_in)}</td>
                  <td>{renderFrequentValues(morningStats.dehumidifier_out)}</td>
                  <td>{renderFrequentValues(morningStats.airflow)}</td>
                </tr>
                <tr>
                  <td className="stat-label">範囲</td>
                  <td>{formatValue(morningStats.ventilation.min)} 〜 {formatValue(morningStats.ventilation.max)}</td>
                  <td>{formatValue(morningStats.exhaust.min)} 〜 {formatValue(morningStats.exhaust.max)}</td>
                  <td>{formatValue(morningStats.dehumidifier_in.min)} 〜 {formatValue(morningStats.dehumidifier_in.max)}</td>
                  <td>{formatValue(morningStats.dehumidifier_out.min)} 〜 {formatValue(morningStats.dehumidifier_out.max)}</td>
                  <td>{formatValue(morningStats.airflow.min)} 〜 {formatValue(morningStats.airflow.max)}</td>
                </tr>
                <tr>
                  <td className="stat-label">平均値</td>
                  <td>{formatValue(morningStats.ventilation.average)}</td>
                  <td>{formatValue(morningStats.exhaust.average)}</td>
                  <td>{formatValue(morningStats.dehumidifier_in.average)}</td>
                  <td>{formatValue(morningStats.dehumidifier_out.average)}</td>
                  <td>{formatValue(morningStats.airflow.average)}</td>
                </tr>
                <tr>
                  <td className="stat-label">中央値</td>
                  <td>{formatValue(morningStats.ventilation.median)}</td>
                  <td>{formatValue(morningStats.exhaust.median)}</td>
                  <td>{formatValue(morningStats.dehumidifier_in.median)}</td>
                  <td>{formatValue(morningStats.dehumidifier_out.median)}</td>
                  <td>{formatValue(morningStats.airflow.median)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      <style>{`
        .summary-stats {
          background: white;
          border: 1px solid #ddd;
          border-radius: 8px;
          padding: 16px;
          margin-bottom: 16px;
        }

        .stats-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
          flex-wrap: wrap;
          gap: 12px;
        }

        .stats-header h2 {
          margin: 0;
          color: #333;
          font-size: 18px;
          font-weight: 600;
        }

        .stats-controls {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .dehumidifier-filter {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          background: #f8fafc;
          border-radius: 6px;
          cursor: pointer;
          border: 1px solid #e2e8f0;
          transition: all 0.2s ease;
        }

        .dehumidifier-filter:hover {
          background: #f1f5f9;
        }

        .dehumidifier-filter input {
          margin: 0;
          cursor: pointer;
          transform: scale(0.9);
        }

        .dehumidifier-filter span {
          font-size: 12px;
          font-weight: 500;
          color: #475569;
        }

        .toggle-controls {
          display: flex;
          gap: 8px;
          align-items: center;
          margin-bottom: 8px;
        }

        .toggle-controls label {
          display: flex;
          align-items: center;
          gap: 3px;
          font-size: 12px;
          color: var(--text-secondary);
          cursor: pointer;
          white-space: nowrap;
        }

        .toggle-controls input[type="checkbox"] {
          margin: 0;
          transform: scale(0.8);
        }

        .toggle-controls input {
          transform: scale(0.9);
        }

        .stats-section {
          margin-bottom: 20px;
        }

        h3 {
          color: #555;
          margin-bottom: 8px;
          font-size: 14px;
          font-weight: 600;
        }

        .table-wrapper {
          overflow-x: auto;
          border: 1px solid #ddd;
          border-radius: 6px;
        }

        table {
          width: 100%;
          min-width: 1000px;
          border-collapse: collapse;
          background: white;
          font-size: 14px;
        }

        th, td {
          padding: 8px 6px;
          text-align: left;
          border-right: 1px solid #eee;
          border-bottom: 1px solid #eee;
        }

        th:last-child, td:last-child {
          border-right: none;
        }

        tbody tr:last-child td {
          border-bottom: none;
        }

        th {
          background-color: #f8f9fa;
          font-weight: 600;
          color: #555;
          font-size: 11px;
          text-align: center;
        }

        .stat-label {
          background-color: #f1f5f9;
          font-weight: 600;
          color: #333;
        }

        td:not(.stat-label) {
          text-align: center;
          font-family: monospace;
        }

        tr:hover {
          background-color: #f8f9fa;
        }

        .frequent-values-horizontal {
          display: flex;
          flex-wrap: wrap;
          gap: 1px;
          justify-content: center;
        }

        .frequent-item {
          background: #e9ecef;
          padding: 0px 2px;
          border-radius: 2px;
          font-size: 9px;
          font-family: monospace;
          color: #495057;
          white-space: nowrap;
          line-height: 1.2;
        }

        .frequent-item.string-value {
          font-weight: bold;
        }

        @media (max-width: 1024px) {
          .summary-stats {
            padding: 12px;
          }

          .stats-header {
            flex-direction: column;
            align-items: stretch;
            gap: 8px;
          }

          .stats-controls {
            justify-content: center;
          }

          .toggle-controls {
            justify-content: center;
            gap: 12px;
          }

          table {
            font-size: 11px;
          }

          th, td {
            padding: 6px 4px;
          }
        }

        @media (max-width: 768px) {
          .stats-header h2 {
            font-size: 16px;
          }

          .toggle-controls {
            flex-direction: column;
            align-items: center;
            gap: 8px;
          }

          .dehumidifier-filter span {
            font-size: 11px;
          }

          table {
            font-size: 10px;
          }

          .frequent-item {
            font-size: 9px;
          }
        }
      `}</style>
    </div>
  );
};