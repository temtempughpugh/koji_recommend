import React from 'react';
import { X } from 'lucide-react';
import type { KojiRecord } from '../types/KojiRecord';

interface DetailPanelProps {
  record: KojiRecord | null;
  onClose: () => void;
}

export const DetailPanel: React.FC<DetailPanelProps> = ({ record, onClose }) => {
  if (!record) return null;

  const formatValue = (value: string | number): string => {
    if (value === null || value === undefined || value === '' || value === 0) {
      return '-';
    }
    if (typeof value === 'number') {
      return value.toFixed(2);
    }
    return value;
  };

  const DetailSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="detail-section">
      <h3>{title}</h3>
      <div className="detail-content">
        {children}
      </div>
    </div>
  );

  const DetailRow = ({ label, value, unit = '' }: { label: string; value: string | number; unit?: string }) => (
    <div className="detail-row">
      <span className="label">{label}</span>
      <span className="value">{formatValue(value)}{unit}</span>
    </div>
  );

  return (
    <div className="detail-overlay" onClick={onClose}>
      <div className="detail-panel" onClick={(e) => e.stopPropagation()}>
        <div className="panel-header">
          <h2>詳細データ - {record.date}</h2>
          <button className="close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="panel-content">
          <DetailSection title="基本情報">
            <DetailRow label="製麴機" value={record.machine} />
            <DetailRow label="日付" value={record.date} />
            <DetailRow label="産地" value={record.origin} />
            <DetailRow label="新古" value={record.rice_age} />
            <DetailRow label="品種" value={record.variety} />
            <DetailRow label="精米歩合" value={record.polishing_ratio} unit="%" />
            <DetailRow label="枚数" value={record.sheets} unit="枚" />
            <DetailRow label="重量" value={record.weight} unit="kg" />
          </DetailSection>

          <DetailSection title="温度データ">
            <DetailRow label="①盛り後品温" value={record.temp_after_steaming} unit="℃" />
            <DetailRow label="②2-3h後点検品温" value={record.temp_2_3h_check} unit="℃" />
            <DetailRow label="④手入れ前品温" value={record.temp_before_handling} unit="℃" />
          </DetailSection>

          <DetailSection title="③制御2→3（手入れ前）">
            <DetailRow label="換気" value={record.ventilation_stage3} />
            <DetailRow label="排気" value={record.exhaust_stage3} />
            <DetailRow label="除湿機入り" value={record.dehumidifier_in_stage3} />
            <DetailRow label="除湿機戻り" value={record.dehumidifier_out_stage3} />
            <DetailRow label="保温1" value={record.heater1_stage3} unit="℃" />
            <DetailRow label="保温2" value={record.heater2_stage3} unit="℃" />
            <DetailRow label="風量" value={record.airflow_stage3} />
          </DetailSection>

          <DetailSection title="⑤制御3→4（手入れ後）">
            <DetailRow label="変更有無" value={record.change_flag_stage4 === 1 ? '変更無' : '変更有'} />
            <DetailRow label="換気" value={record.ventilation_stage4} />
            <DetailRow label="排気" value={record.exhaust_stage4} />
            <DetailRow label="除湿機入り" value={record.dehumidifier_in_stage4} />
            <DetailRow label="除湿機戻り" value={record.dehumidifier_out_stage4} />
            <DetailRow label="風量" value={record.airflow_stage4} />
          </DetailSection>

          <DetailSection title="⑥制御4">
            <DetailRow label="変更有無" value={record.change_flag_stage5 === 1 ? '変更無' : '変更有'} />
            <DetailRow label="換気" value={record.ventilation_stage5} />
            <DetailRow label="排気" value={record.exhaust_stage5} />
          </DetailSection>

          <DetailSection title="⑦朝から除湿">
            <DetailRow label="換気" value={record.ventilation_morning_dehumid} />
            <DetailRow label="排気" value={record.exhaust_morning_dehumid} />
            <DetailRow label="除湿機入り" value={record.dehumidifier_in_morning} />
            <DetailRow label="除湿機戻り" value={record.dehumidifier_out_morning} />
            <DetailRow label="風量" value={record.airflow_morning_dehumid} />
          </DetailSection>

          <DetailSection title="計算値">
            <DetailRow label="盛り後→2-3h後の品温上昇率" value={record.temp_rise_rate_1} unit="℃/h" />
            <DetailRow label="2-3h後→手入れ前の品温上昇率" value={record.temp_rise_rate_2} unit="℃/h" />
            <DetailRow label="41.0℃到達時間" value={record.time_to_41c} unit="時間" />
          </DetailSection>
        </div>
      </div>

      <style>{`
        .detail-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }

        .detail-panel {
          background: white;
          width: 95%;
          max-width: 1000px;
          max-height: 85%;
          border-radius: var(--radius-lg);
          display: flex;
          flex-direction: column;
          overflow: hidden;
          box-shadow: var(--shadow-xl);
        }

        .panel-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px 24px;
          border-bottom: 1px solid var(--border);
          background: var(--bg-secondary);
          flex-shrink: 0;
        }

        .panel-header h2 {
          margin: 0;
          color: var(--text-primary);
          font-size: 20px;
          font-weight: 700;
        }

        .close-btn {
          background: none;
          border: none;
          cursor: pointer;
          padding: 8px;
          border-radius: var(--radius-sm);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.2s;
        }

        .close-btn:hover {
          background: var(--bg-tertiary);
        }

        .panel-content {
          padding: 24px;
          overflow-y: auto;
          flex: 1;
          font-size: 15px;
        }

        .detail-section {
          margin-bottom: 28px;
        }

        .detail-section h3 {
          color: var(--text-secondary);
          margin: 0 0 16px 0;
          font-size: 18px;
          font-weight: 600;
          padding-bottom: 8px;
          border-bottom: 2px solid var(--bg-tertiary);
        }

        .detail-content {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 12px;
        }

        .detail-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 10px 0;
          border-bottom: 1px solid var(--bg-secondary);
        }

        .label {
          font-weight: 500;
          color: var(--text-muted);
          font-size: 14px;
        }

        .value {
          font-family: 'SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', monospace;
          font-weight: 600;
          color: var(--text-primary);
          font-size: 14px;
        }

        /* iPad専用メディアクエリ（768px〜1024px） */
        @media (max-width: 1024px) and (min-width: 769px) {
          .detail-panel {
            width: 90%;
            max-width: 700px;
            max-height: 80%;
          }

          .panel-header {
            padding: 16px 20px;
          }

          .panel-header h2 {
            font-size: 18px;
          }

          .panel-content {
            padding: 20px;
            font-size: 14px;
          }

          .detail-section h3 {
            font-size: 16px;
          }

          .detail-content {
            grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
            gap: 10px;
          }

          .label {
            font-size: 13px;
          }

          .value {
            font-size: 13px;
          }
        }

        @media (max-width: 768px) {
          .detail-panel {
            width: 95%;
            max-height: 95%;
          }

          .panel-header,
          .panel-content {
            padding: 1rem;
          }

          .detail-content {
            grid-template-columns: 1fr;
          }

          .panel-header h2 {
            font-size: 1.1rem;
          }
        }
      `}</style>
    </div>
  );
};