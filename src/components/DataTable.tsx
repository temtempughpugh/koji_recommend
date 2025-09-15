import React, { useState, useMemo } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import type { KojiRecord } from '../types/KojiRecord';

interface DataTableProps {
  data: KojiRecord[];
  onRowClick: (record: KojiRecord) => void;
}

interface YearGroup {
  year: string;
  records: KojiRecord[];
  isOpen: boolean;
}

export const DataTable: React.FC<DataTableProps> = ({ data, onRowClick }) => {
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [dehumidifierUnusedOnly, setDehumidifierUnusedOnly] = useState(false);

  // 除湿機フィルタリング
  const filteredData = useMemo(() => {
    if (!dehumidifierUnusedOnly) return data;
    
    return data.filter(record => {
      // 手入れ後の除湿機入り・戻りをチェック（除湿機不使用のみ）
      const isDehumidifierUnused = (
        record.dehumidifier_in_stage4 === '全閉' && 
        record.dehumidifier_out_stage4 === '全閉'
      );
      return isDehumidifierUnused;
    });
  }, [data, dehumidifierUnusedOnly]);

  // 年別グループ化
  const yearGroups = useMemo(() => {
    const groups = new Map<string, KojiRecord[]>();
    
    filteredData.forEach(record => {
      const year = record.date.split('/')[0];
      if (!groups.has(year)) {
        groups.set(year, []);
      }
      groups.get(year)!.push(record);
    });

    return Array.from(groups.entries())
      .map(([year, records]) => ({
        year,
        records: records.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()),
        isOpen: true
      }))
      .sort((a, b) => parseInt(b.year) - parseInt(a.year));
  }, [filteredData]);

  const [groupStates, setGroupStates] = useState<YearGroup[]>(yearGroups);

  React.useEffect(() => {
    setGroupStates(yearGroups);
  }, [yearGroups]);

  const toggleGroup = (year: string) => {
    setGroupStates(prev => 
      prev.map(group => 
        group.year === year 
          ? { ...group, isOpen: !group.isOpen }
          : group
      )
    );
  };

  const toggleRowDetail = (recordId: string) => {
    setExpandedRow(prev => prev === recordId ? null : recordId);
  };

  const formatValue = (value: string | number): string => {
    if (value === null || value === undefined || value === '' || value === 0) {
      return '-';
    }
    if (typeof value === 'number') {
      return value.toFixed(2);
    }
    return value;
  };

  const RecordFormDetail = ({ record }: { record: KojiRecord }) => {
    return (
    <tr className="detail-row">
      <td colSpan={11}>
        <div className="record-form-container">
          {/* 基本情報セクション */}
          <div className="basic-info-section">
            <div className="info-grid">
              <div className="info-item">
                <span className="info-label">製麹機</span>
                <span className="info-value">{record.machine}</span>
              </div>
              <div className="info-item">
                <span className="info-label">月日</span>
                <span className="info-value">{record.date}</span>
              </div>
              <div className="info-item">
                <span className="info-label">白米品種</span>
                <span className="info-value">{record.variety}</span>
                <span className="info-label">枚数</span>
                <span className="info-value">{record.sheets}枚</span>
              </div>
              <div className="info-item">
                <span className="info-label">盛り込み数量(kg)</span>
                <span className="info-value">{record.weight}kg</span>
                <span className="info-label">1枚当たり(kg)</span>
                <span className="info-value">{record.sheets > 0 ? (record.weight / record.sheets).toFixed(1) : '-'}kg</span>
              </div>
            </div>
          </div>

          {/* 記録表 */}
          <div className="record-table-container">
            <table className="record-table">
              <thead>
                <tr>
                  <th rowSpan={2} className="time-col">時刻</th>
                  <th rowSpan={2} className="operation-col">操作</th>
                  <th rowSpan={2} className="temp-col">品温</th>
                  <th className="control-col">換気</th>
                  <th className="control-col">排気</th>
                  <th className="control-col">除湿機入り口</th>
                  <th className="control-col">除湿機戻り</th>
                  <th className="control-col">保温1</th>
                  <th className="control-col">保温2</th>
                  <th className="control-col">風量</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="time-cell">-</td>
                  <td className="operation-cell">盛り後</td>
                  <td className="data-cell">{formatValue(record.temp_after_steaming)}</td>
                  <td className="data-cell">-</td>
                  <td className="data-cell">-</td>
                  <td className="data-cell">-</td>
                  <td className="data-cell">-</td>
                  <td className="data-cell">-</td>
                  <td className="data-cell">-</td>
                  <td className="data-cell">-</td>
                </tr>
                <tr>
                  <td className="time-cell">{record.time_2_3h_check || '-'}</td>
                  <td className="operation-cell">2~3h後点検</td>
                  <td className="data-cell">{formatValue(record.temp_2_3h_check)}</td>
                  <td className="data-cell">-</td>
                  <td className="data-cell">-</td>
                  <td className="data-cell">-</td>
                  <td className="data-cell">-</td>
                  <td className="data-cell">{formatValue(record.heater1_2_3h_check)}</td>
                  <td className="data-cell">{formatValue(record.heater2_2_3h_check)}</td>
                  <td className="data-cell">-</td>
                </tr>
                <tr>
                  <td className="time-cell">-</td>
                  <td className="operation-cell">制御2→3</td>
                  <td className="data-cell">-</td>
                  <td className="data-cell">{formatValue(record.ventilation_stage3)}</td>
                  <td className="data-cell">{formatValue(record.exhaust_stage3)}</td>
                  <td className="data-cell">{formatValue(record.dehumidifier_in_stage3)}</td>
                  <td className="data-cell">{formatValue(record.dehumidifier_out_stage3)}</td>
                  <td className="data-cell">{formatValue(record.heater1_stage3)}</td>
                  <td className="data-cell">{formatValue(record.heater2_stage3)}</td>
                  <td className="data-cell">{formatValue(record.airflow_stage3)}</td>
                </tr>
                <tr>
                  <td className="time-cell">{record.time_before_handling || '-'}</td>
                  <td className="operation-cell">手入れ前</td>
                  <td className="data-cell">{formatValue(record.temp_before_handling)}</td>
                  <td className="data-cell">{formatValue(record.ventilation_before_handling)}</td>
                  <td className="data-cell">{formatValue(record.exhaust_before_handling)}</td>
                  <td className="data-cell">{formatValue(record.dehumidifier_in_before_handling)}</td>
                  <td className="data-cell">{formatValue(record.dehumidifier_out_before_handling)}</td>
                  <td className="data-cell">41.0</td>
                  <td className="data-cell">41.5</td>
                  <td className="data-cell">{formatValue(record.airflow_before_handling)}</td>
                </tr>
                <tr>
                  <td className="time-cell">-</td>
                  <td className="operation-cell">手入れ後</td>
                  <td className="data-cell">-</td>
                  <td className="data-cell">{formatValue(record.ventilation_stage4)}</td>
                  <td className="data-cell">{formatValue(record.exhaust_stage4)}</td>
                  <td className="data-cell">{formatValue(record.dehumidifier_in_stage4)}</td>
                  <td className="data-cell">{formatValue(record.dehumidifier_out_stage4)}</td>
                  <td className="data-cell">41.0</td>
                  <td className="data-cell">41.5</td>
                  <td className="data-cell">{formatValue(record.airflow_stage4)}</td>
                </tr>
                <tr>
                  <td className="time-cell">-</td>
                  <td className="operation-cell">制御4</td>
                  <td className="data-cell">-</td>
                  <td className="data-cell">{formatValue(record.ventilation_stage5)}</td>
                  <td className="data-cell">{formatValue(record.exhaust_stage5)}</td>
                  <td className="data-cell">-</td>
                  <td className="data-cell">-</td>
                  <td className="data-cell">41.5</td>
                  <td className="data-cell">42.0</td>
                  <td className="data-cell">-</td>
                </tr>
                <tr>
                  <td className="time-cell">-</td>
                  <td className="operation-cell">朝から除湿</td>
                  <td className="data-cell">-</td>
                  <td className="data-cell">{formatValue(record.ventilation_morning_dehumid)}</td>
                  <td className="data-cell">{formatValue(record.exhaust_morning_dehumid)}</td>
                  <td className="data-cell">{formatValue(record.dehumidifier_in_morning)}</td>
                  <td className="data-cell">{formatValue(record.dehumidifier_out_morning)}</td>
                  <td className="data-cell">-</td>
                  <td className="data-cell">-</td>
                  <td className="data-cell">{formatValue(record.airflow_morning_dehumid)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </td>
    </tr>
    );
  };

  return (
    <div className="data-table-container">
      <div className="table-header">
        <h2>個別データ一覧</h2>
        <div className="table-controls">
          <label className="dehumidifier-filter">
            <input
              type="checkbox"
              checked={dehumidifierUnusedOnly}
              onChange={(e) => setDehumidifierUnusedOnly(e.target.checked)}
            />
            <span>除湿機不使用時を表示</span>
          </label>
          <div className="data-count">
            {filteredData.length}件のデータ
          </div>
        </div>
      </div>

      {groupStates.map(group => (
        <div key={group.year} className="year-group">
          <div 
            className="year-header"
            onClick={() => toggleGroup(group.year)}
          >
            <div className="year-info">
              <span className="year-label">{group.year}年</span>
              <span className="year-period">({group.year}/01 〜 {group.year}/12)</span>
              <span className="year-count">{group.records.length}件</span>
            </div>
            {group.isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </div>

          {group.isOpen && (
            <div className="table-wrapper">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>日付</th>
                    <th>品種</th>
                    <th>精米歩合</th>
                    <th>枚数</th>
                    <th>重量</th>
                    <th>盛り後品温</th>
                    <th>換気</th>
                    <th>排気</th>
                    <th>除湿機入り</th>
                    <th>除湿機戻り</th>
                    <th>風量</th>
                  </tr>
                </thead>
                <tbody>
                  {group.records.map((record) => {
                    const recordId = `${record.machine}-${record.date}`;
                    return (
                      <React.Fragment key={recordId}>
                        <tr 
                          className="data-row"
                          onClick={() => toggleRowDetail(recordId)}
                        >
                          <td>{record.date}</td>
                          <td>{record.variety}</td>
                          <td>{record.polishing_ratio}%</td>
                          <td>{record.sheets}枚</td>
                          <td>{record.weight}kg</td>
                          <td>{formatValue(record.temp_after_steaming)}℃</td>
                          <td>{formatValue(record.ventilation_stage4)}</td>
                          <td>{formatValue(record.exhaust_stage4)}</td>
                          <td>{formatValue(record.dehumidifier_in_stage4)}</td>
                          <td>{formatValue(record.dehumidifier_out_stage4)}</td>
                          <td>{formatValue(record.airflow_stage4)}</td>
                        </tr>
                        {expandedRow === recordId && (
                          <RecordFormDetail record={record} />
                        )}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ))}

      <style>{`
        :root {
          --bg-primary: #ffffff;
          --bg-secondary: #f8fafc;
          --bg-tertiary: #f1f5f9;
          --text-primary: #1e293b;
          --text-secondary: #475569;
          --text-muted: #64748b;
          --border: #e2e8f0;
          --primary: #3b82f6;
          --accent: #10b981;
          --radius-md: 8px;
          --radius-xl: 16px;
          --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
        }

        .data-table-container {
          background: white;
          border-radius: var(--radius-xl);
          padding: 24px;
          box-shadow: var(--shadow-lg);
          border: 1px solid var(--border);
        }

        .table-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
          flex-wrap: wrap;
          gap: 16px;
        }

        .table-header h2 {
          margin: 0;
          color: var(--text-primary);
          font-size: 24px;
          font-weight: 700;
        }

        .table-controls {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .dehumidifier-filter {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          background: var(--bg-secondary);
          border-radius: var(--radius-md);
          cursor: pointer;
          border: 1px solid var(--border);
          transition: all 0.2s ease;
        }

        .dehumidifier-filter:hover {
          background: var(--bg-tertiary);
        }

        .dehumidifier-filter input {
          margin: 0;
          cursor: pointer;
        }

        .dehumidifier-filter span {
          font-size: 14px;
          font-weight: 500;
          color: var(--text-secondary);
        }

        .data-count {
          font-size: 14px;
          color: var(--text-muted);
          font-weight: 500;
        }

        .year-group {
          margin-bottom: 24px;
          border: 1px solid var(--border);
          border-radius: var(--radius-md);
          overflow: hidden;
        }

        .year-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px 20px;
          background: var(--bg-secondary);
          cursor: pointer;
          transition: background-color 0.2s ease;
        }

        .year-header:hover {
          background: var(--bg-tertiary);
        }

        .year-info {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .year-label {
          font-weight: 700;
          font-size: 18px;
          color: var(--text-primary);
        }

        .year-period {
          color: var(--text-muted);
          font-size: 14px;
        }

        .year-count {
          background: var(--accent);
          color: white;
          padding: 4px 12px;
          border-radius: var(--radius-xl);
          font-size: 12px;
          font-weight: 600;
        }

        .table-wrapper {
          overflow-x: auto;
          border-top: 1px solid var(--border);
        }

        .data-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 12px;
        }

        .data-table th, 
        .data-table td {
          padding: 4px 3px;
          text-align: left;
          border-bottom: 1px solid var(--border);
          white-space: nowrap;
        }

        .data-table th {
          background: var(--bg-tertiary);
          font-weight: 600;
          color: var(--text-secondary);
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .data-row {
          cursor: pointer;
          transition: background-color 0.2s ease;
        }

        .data-row:hover {
          background: var(--bg-secondary);
        }

        .detail-row {
          background: var(--bg-secondary) !important;
        }

        .record-form-container {
          padding: 24px;
          background: white;
          margin: 8px;
          border-radius: var(--radius-md);
          border: 1px solid var(--border);
        }

        .basic-info-section {
          margin-bottom: 24px;
        }

        .info-grid {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .info-item {
          display: flex;
          align-items: center;
          gap: 16px;
          font-size: 14px;
        }

        .info-label {
          font-weight: 600;
          color: var(--text-secondary);
          min-width: 120px;
          background: var(--bg-secondary);
          padding: 6px 12px;
          border: 1px solid var(--border);
          border-radius: 4px;
        }

        .info-value {
          font-weight: 500;
          color: var(--text-primary);
          background: white;
          padding: 6px 12px;
          border: 1px solid var(--border);
          border-radius: 4px;
        }

        .record-table-container {
          overflow-x: auto;
        }

        .record-table {
          width: 100%;
          border-collapse: collapse;
          border: 2px solid var(--text-primary);
          font-size: 13px;
        }

        .record-table th,
        .record-table td {
          border: 1px solid var(--text-primary);
          padding: 8px 6px;
          text-align: center;
        }

        .record-table th {
          background: var(--bg-tertiary);
          font-weight: 600;
          font-size: 11px;
        }

        .time-col { width: 50px; }
        .operation-col { width: 100px; }
        .temp-col { width: 60px; }
        .control-col { width: 80px; }

        .time-cell {
          background: var(--bg-secondary);
          font-weight: 500;
        }

        .operation-cell {
          background: var(--bg-secondary);
          font-weight: 600;
          text-align: left;
          padding-left: 8px;
        }

        .data-cell {
          font-family: 'SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', monospace;
          font-size: 12px;
        }

        .data-table td:nth-child(3),
        .data-table td:nth-child(4),
        .data-table td:nth-child(5),
        .data-table td:nth-child(6),
        .data-table td:nth-child(7),
        .data-table td:nth-child(8),
        .data-table td:nth-child(9),
        .data-table td:nth-child(10),
        .data-table td:nth-child(11) {
          text-align: right;
          font-family: 'SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', monospace;
        }

        @media (max-width: 768px) {
          .table-header {
            flex-direction: column;
            align-items: stretch;
            gap: 12px;
          }

          .table-controls {
            flex-direction: column;
            align-items: stretch;
            gap: 8px;
          }

          .year-info {
            flex-wrap: wrap;
            gap: 8px;
          }
        }
      `}</style>
    </div>
  );
};