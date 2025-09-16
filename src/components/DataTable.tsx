import React, { useState, useEffect, useMemo } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import type { KojiRecord } from '../types/KojiRecord';

interface YearGroup {
  year: string;
  label: string;
  period: string;
  records: KojiRecord[];
  isOpen: boolean;
}

const getBrewingYear = (dateStr: string): string => {
  const date = new Date(dateStr);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  
  if (month >= 6) {
    return `R${year - 2018}BY`;
  } else {
    return `R${year - 2019}BY`;
  }
};

const getYearPeriod = (yearLabel: string): string => {
  const match = yearLabel.match(/R(\d+)BY/);
  if (!match) return '';
  
  const reiwaYear = parseInt(match[1]);
  const startYear = 2018 + reiwaYear;
  const endYear = startYear + 1;
  
  return `${startYear}/6/1〜${endYear}/5/31`;
};

const groupByYear = (records: KojiRecord[]): YearGroup[] => {
  const groups = new Map<string, KojiRecord[]>();
  
  records.forEach(record => {
    const year = getBrewingYear(record.date);
    if (!groups.has(year)) {
      groups.set(year, []);
    }
    groups.get(year)!.push(record);
  });
  
  const sortedEntries = Array.from(groups.entries()).sort(([a], [b]) => {
    const aNum = parseInt(a.match(/R(\d+)BY/)?.[1] || '0');
    const bNum = parseInt(b.match(/R(\d+)BY/)?.[1] || '0');
    return bNum - aNum;
  });
  
  return sortedEntries.map(([year, records]) => ({
    year,
    label: year,
    period: getYearPeriod(year),
    records,
    isOpen: true
  }));
};

interface DataTableProps {
  data: KojiRecord[];
  onRowClick: (record: KojiRecord) => void;
}

export const DataTable: React.FC<DataTableProps> = ({ data }) => {
  const [yearGroups, setYearGroups] = useState<YearGroup[]>([]);
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

  useEffect(() => {
    setYearGroups(groupByYear(filteredData));
  }, [filteredData]);

  const toggleYear = (year: string) => {
    setYearGroups(prev => 
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

  const formatTime = (timeStr: string): string => {
    if (!timeStr || timeStr === '' || timeStr === '-') return '-';
    // 12:30:00 → 12:30 (秒を除去)
    return timeStr.replace(/:\d{2}$/, '');
  };

  const RecordFormDetail = ({ record }: { record: KojiRecord }) => (
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
                   <td className="time-cell">{formatTime(record.time_2_3h_check)}</td>
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
                  <td className="time-cell">{formatTime(record.time_before_handling)}</td>
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
                  <td className="data-cell">41.5</td>
                  <td className="data-cell">42.0</td>
                  <td className="data-cell">{formatValue(record.airflow_morning_dehumid)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </td>
    </tr>
  );

  if (filteredData.length === 0) {
    return (
      <div className="no-data">
        <p>条件に合うデータがありません</p>
        <style>{`
          .no-data {
            text-align: center;
            padding: 4rem;
            color: var(--text-muted);
            background: var(--bg-primary);
            border: 1px solid var(--border);
            border-radius: var(--radius-lg);
            width: 100%;
            min-height: 300px;
            display: flex;
            align-items: center;
            justify-content: center;
          }
        `}</style>
      </div>
    );
  }

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
      
      <div className="year-groups">
        {yearGroups.map(group => (
          <div key={group.year} className="year-group">
            <div 
              className="year-header" 
              onClick={() => toggleYear(group.year)}
            >
              <div className="year-info">
                {group.isOpen ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                <span className="year-label">{group.label}</span>
                <span className="year-period">({group.period})</span>
              </div>
              <div className="year-count">{group.records.length}件</div>
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
                      <th>手入れ後-換気</th>
                      <th>手入れ後-排気</th>
                      <th>手入れ後-除湿機入り</th>
                      <th>手入れ後-除湿機戻り</th>
                      <th>手入れ後-風量</th>
                    </tr>
                  </thead>
                  <tbody>
                    {group.records.map((record, index) => {
                      const recordId = `${record.date}-${index}`;
                      return (
                        <React.Fragment key={recordId}>
                          <tr 
                            onClick={() => toggleRowDetail(recordId)}
                            className="data-row"
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
                          {expandedRow === recordId && <RecordFormDetail record={record} />}
                        </React.Fragment>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ))}
      </div>

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
          --radius-lg: 12px;
          --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        }

        .data-table-container {
          background: var(--bg-primary);
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          padding: 32px;
          margin-bottom: 32px;
          box-shadow: var(--shadow-md);
          width: 100%;
          min-height: 400px;
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

        .year-groups {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .year-group {
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
          transition: all 0.2s ease;
        }

        .year-header:hover {
          background: var(--bg-tertiary);
        }

        .year-info {
          display: flex;
          align-items: center;
          gap: 12px;
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
          font-size: 14px;
        }

        .data-table th, 
        .data-table td {
          padding: 12px 8px;
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
          letter-spacing: 0.3px;
          white-space: normal;
          line-height: 1.2;
          padding: 8px 4px;
        }

        /* 各列の幅を実際の値に合わせて最適化 */
        .data-table th:nth-child(1), .data-table td:nth-child(1) { width: 85px; }  /* 日付: 2024/10/14 */
        .data-table th:nth-child(2), .data-table td:nth-child(2) { width: 50px; }  /* 品種: 八反錦 */
        .data-table th:nth-child(3), .data-table td:nth-child(3) { width: 40px; }  /* 精米歩合: 60% */
        .data-table th:nth-child(4), .data-table td:nth-child(4) { width: 30px; }  /* 枚数: 6枚 */
        .data-table th:nth-child(5), .data-table td:nth-child(5) { width: 50px; }  /* 重量: 135kg */
        .data-table th:nth-child(6), .data-table td:nth-child(6) { width: 60px; }  /* 品温: 32.02℃ */
        .data-table th:nth-child(7), .data-table td:nth-child(7) { width: 45px; }  /* 換気: 0.90 */
        .data-table th:nth-child(8), .data-table td:nth-child(8) { width: 45px; }  /* 排気: 1.70 */
        .data-table th:nth-child(9), .data-table td:nth-child(9) { width: 45px; }  /* 除湿機入り: 2.50 */
        .data-table th:nth-child(10), .data-table td:nth-child(10) { width: 45px; } /* 除湿機戻り: 全開 */
        .data-table th:nth-child(11), .data-table td:nth-child(11) { width: 45px; } /* 風量: 6.20 */

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
  display: flex;
  flex-direction: column;
  align-items: flex-start;  /* 左寄せ */
}

.record-table-container {
  width: fit-content !important;  /* 内容に合わせる */
  overflow-x: visible !important;
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
  table-layout: auto !important;  /* 固定レイアウトを解除 */
}
       .record-table th {
  font-size: 9px !important;     /* ヘッダー文字を小さく */
  padding: 2px 1px !important;   /* ヘッダー余白を最小に */
  line-height: 1.1 !important;   /* 行間を詰める */
}

.time-col { width: 25px; }
.operation-col { width: 75px; }
.temp-col { width: 45px; }
.control-col { width: 35px; }

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
          .data-table-container {
            padding: 16px;
            margin-bottom: 16px;
          }

          .table-header {
            flex-direction: column;
            align-items: stretch;
            gap: 12px;
          }

          .table-header h2 {
            font-size: 20px;
            text-align: center;
          }

          .table-controls {
            flex-direction: column;
            align-items: stretch;
            gap: 8px;
          }

          .dehumidifier-filter {
            justify-content: center;
          }

          .year-header {
            padding: 12px 16px;
          }

          .year-info {
            flex-wrap: wrap;
            gap: 8px;
          }

          .year-label {
            font-size: 16px;
          }

          .year-period {
            font-size: 12px;
          }

          .table-wrapper {
            overflow-x: auto;
            -webkit-overflow-scrolling: touch;
          }

          .data-table {
            min-width: 600px;
            font-size: 12px;
          }

          .data-table th,
          .data-table td {
            padding: 8px 4px;
            font-size: 10px;
          }

          /* モバイル用セル幅調整 */
          .data-table th:nth-child(1), .data-table td:nth-child(1) { width: 80px; }
          .data-table th:nth-child(2), .data-table td:nth-child(2) { width: 45px; }
          .data-table th:nth-child(3), .data-table td:nth-child(3) { width: 35px; }
          .data-table th:nth-child(4), .data-table td:nth-child(4) { width: 25px; }
          .data-table th:nth-child(5), .data-table td:nth-child(5) { width: 45px; }
          .data-table th:nth-child(6), .data-table td:nth-child(6) { width: 55px; }
          .data-table th:nth-child(7), .data-table td:nth-child(7) { width: 40px; }
          .data-table th:nth-child(8), .data-table td:nth-child(8) { width: 40px; }
          .data-table th:nth-child(9), .data-table td:nth-child(9) { width: 40px; }
          .data-table th:nth-child(10), .data-table td:nth-child(10) { width: 40px; }
          .data-table th:nth-child(11), .data-table td:nth-child(11) { width: 40px; }

          .record-form-container {
            padding: 16px;
            margin: 4px;
          }

          .info-item {
            flex-direction: column;
            align-items: flex-start;
            gap: 8px;
          }

          .info-label {
            min-width: auto;
            width: 100%;
          }

          .record-table-container {
            margin-top: 16px;
          }

          .record-table {
            font-size: 11px;
          }

          .record-table th,
          .record-table td {
            padding: 6px 4px;
            font-size: 10px;
          }
        }

        @media (max-width: 480px) {
          .data-table-container {
            padding: 12px;
          }

          .table-header h2 {
            font-size: 18px;
          }

          .year-header {
            padding: 10px 12px;
          }

          .year-label {
            font-size: 14px;
          }

          .year-count {
            font-size: 10px;
            padding: 2px 8px;
          }

          .data-table {
            min-width: 550px;
            font-size: 11px;
          }

          .data-table th,
          .data-table td {
            padding: 6px 2px;
            font-size: 9px;
          }

          /* 極小画面用セル幅調整 */
          .data-table th:nth-child(1), .data-table td:nth-child(1) { width: 75px; }
          .data-table th:nth-child(2), .data-table td:nth-child(2) { width: 40px; }
          .data-table th:nth-child(3), .data-table td:nth-child(3) { width: 30px; }
          .data-table th:nth-child(4), .data-table td:nth-child(4) { width: 20px; }
          .data-table th:nth-child(5), .data-table td:nth-child(5) { width: 40px; }
          .data-table th:nth-child(6), .data-table td:nth-child(6) { width: 50px; }
          .data-table th:nth-child(7), .data-table td:nth-child(7) { width: 35px; }
          .data-table th:nth-child(8), .data-table td:nth-child(8) { width: 35px; }
          .data-table th:nth-child(9), .data-table td:nth-child(9) { width: 35px; }
          .data-table th:nth-child(10), .data-table td:nth-child(10) { width: 35px; }
          .data-table th:nth-child(11), .data-table td:nth-child(11) { width: 35px; }

          .record-form-container {
            padding: 12px;
            margin: 2px;
          }

          .record-table {
            font-size: 10px;
          }

          .record-table th,
          .record-table td {
            padding: 4px 2px;
            font-size: 9px;
          }

          .time-col { width: 20px; }
          .operation-col { width: 60px; }
          .temp-col { width: 35px; }
          .control-col { width: 25px; }
        }
          .record-table td {
  text-align: center !important;
}

.record-table .operation-cell {
  text-align: center !important;  /* 操作列も中央揃え */
  padding-left: 2px !important;   /* 左padding削除 */
}

css/* テーブル全体を流動的に調整 */
.data-table {
  width: 100%;
  table-layout: auto;
  font-size: clamp(9px, 2vw, 14px); /* 画面幅に応じて自動調整 */
}

.data-table th,
.data-table td {
  padding: clamp(1px, 0.5vw, 8px) clamp(1px, 0.3vw, 6px);
  font-size: inherit;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 0; /* flexibleな幅調整 */
}

/* コンテナも流動的に */
.table-wrapper {
  width: 100%;
  overflow-x: auto;
  overflow-y: visible;
}

/* record-tableも同様に */
.record-table {
  width: 100%;
  table-layout: auto;
  font-size: clamp(8px, 1.5vw, 13px);
}

.record-table th,
.record-table td {
  padding: clamp(1px, 0.3vw, 4px) clamp(1px, 0.2vw, 2px);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
  /* 既存の固定幅設定をすべて削除 */
.data-table {
  min-width: auto !important;  /* 固定最小幅を削除 */
  width: 100% !important;
}

/* nth-childの固定幅も削除 */
.data-table th, .data-table td {
  width: auto !important;
  min-width: 0 !important;
}
  .data-table th {
  white-space: normal !important;  /* 折り返し許可 */
  line-height: 1.2 !important;
  height: auto !important;
  vertical-align: top !important;
  padding: 4px 2px !important;
}
  .record-table {
  min-width: auto !important;     /* 固定最小幅を削除 */
  width: 100% !important;
  table-layout: auto !important;
}

.record-table th,
.record-table td {
  width: auto !important;
  min-width: 0 !important;
  padding: 2px 1px !important;
  font-size: 9px !important;
}

.record-table-container {
  width: 100% !important;         /* fit-contentを削除 */
  overflow-x: auto !important;
  -webkit-overflow-scrolling: touch !important;
}
      `}</style>
    </div>
  );
};