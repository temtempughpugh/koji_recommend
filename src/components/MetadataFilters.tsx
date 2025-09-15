import React from 'react';
import { Search, RotateCcw } from 'lucide-react';
import type { FilterState, FilterOptions } from '../types/FilterTypes';

interface MetadataFiltersProps {
  filters: FilterState;
  filterOptions: FilterOptions;
  updateFilter: (key: keyof FilterState, value: string | number) => void;
  resetFilters: () => void;
}

export const MetadataFilters: React.FC<MetadataFiltersProps> = ({
  filters,
  filterOptions,
  updateFilter,
  resetFilters
}) => {
  return (
    <div className="filters-container">
      <div className="filters-header">
        <div className="header-content">
          <Search size={24} />
          <h2>メタデータ選択</h2>
        </div>
        <button className="reset-btn" onClick={resetFilters}>
          <RotateCcw size={16} />
          リセット
        </button>
      </div>
      
      <div className="filters-grid">
        {/* 品種選択 */}
        <div className="filter-group">
          <label htmlFor="variety">品種</label>
          <select 
            id="variety"
            value={filters.variety} 
            onChange={(e) => updateFilter('variety', e.target.value)}
          >
            <option value="">すべての品種</option>
            {filterOptions.varieties.map(variety => (
              <option key={variety} value={variety}>{variety}</option>
            ))}
          </select>
        </div>

        {/* 産地選択 */}
        <div className="filter-group">
          <label htmlFor="origin">産地</label>
          <select 
            id="origin"
            value={filters.origin} 
            onChange={(e) => updateFilter('origin', e.target.value)}
          >
            <option value="">すべての産地</option>
            {filterOptions.origins.map(origin => (
              <option key={origin} value={origin}>{origin}</option>
            ))}
          </select>
        </div>

        {/* 精米歩合 */}
        <div className="filter-group">
          <label>精米歩合</label>
          <div className="polishing-controls">
            <input 
              type="number" 
              value={filters.polishing_ratio || ''} 
              onChange={(e) => updateFilter('polishing_ratio', Number(e.target.value))}
              placeholder="70"
              min="0"
              max="100"
            />
            <div className="range-indicator">
              <span>±</span>
              <select 
                value={filters.polishing_range}
                onChange={(e) => updateFilter('polishing_range', Number(e.target.value))}
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={15}>15</option>
                <option value={20}>20</option>
              </select>
            </div>
          </div>
          {filters.polishing_ratio > 0 && (
            <div className="range-preview">
              {filters.polishing_ratio - filters.polishing_range}% 〜 {filters.polishing_ratio + filters.polishing_range}%
            </div>
          )}
        </div>

        {/* 重量範囲 */}
        <div className="filter-group">
          <label>重量 (kg)</label>
          <div className="range-controls">
            <input 
              type="number" 
              value={filters.weight_min || ''} 
              onChange={(e) => updateFilter('weight_min', Number(e.target.value))}
              placeholder="最小"
              min="0"
            />
            <span className="separator">〜</span>
            <input 
              type="number" 
              value={filters.weight_max || ''} 
              onChange={(e) => updateFilter('weight_max', Number(e.target.value))}
              placeholder="最大"
              min="0"
            />
          </div>
        </div>

        {/* 枚数 */}
        <div className="filter-group">
          <label htmlFor="sheets">枚数以下</label>
          <select 
            id="sheets"
            value={filters.sheets || 6} 
            onChange={(e) => updateFilter('sheets', Number(e.target.value))}
          >
            {filterOptions.sheets.map(sheets => (
              <option key={sheets} value={sheets}>{sheets}枚以下</option>
            ))}
          </select>
        </div>
      </div>

      <style>{`
        .filters-container {
          background: var(--bg-primary);
          border-radius: var(--radius-xl);
          padding: 32px;
          margin-bottom: 32px;
          box-shadow: var(--shadow-lg);
          border: 1px solid var(--border);
        }

        .filters-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 28px;
        }

        .header-content {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .header-content svg {
          color: var(--primary);
        }

        .filters-header h2 {
          margin: 0;
          color: var(--text-primary);
          font-size: 24px;
          font-weight: 700;
        }

        .filters-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 24px;
        }

        .filter-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .filter-group label {
          font-weight: 600;
          color: var(--text-secondary);
          font-size: 14px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .polishing-controls {
          display: flex;
          gap: 12px;
          align-items: center;
        }

        .polishing-controls input {
          flex: 2;
        }

        .range-indicator {
          display: flex;
          align-items: center;
          gap: 8px;
          background: var(--bg-secondary);
          padding: 8px 12px;
          border-radius: var(--radius-md);
          border: 2px solid var(--border);
        }

        .range-indicator span {
          color: var(--text-muted);
          font-weight: 600;
          font-size: 16px;
        }

        .range-indicator select {
          border: none;
          background: transparent;
          padding: 4px 8px;
          font-weight: 600;
          color: var(--primary);
        }

        .range-preview {
          font-size: 12px;
          color: var(--text-muted);
          background: var(--bg-tertiary);
          padding: 6px 12px;
          border-radius: var(--radius-sm);
          text-align: center;
          font-weight: 500;
        }

        .range-controls {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .range-controls input {
          flex: 1;
        }

        .separator {
          color: var(--text-muted);
          font-weight: 600;
          font-size: 16px;
          padding: 0 4px;
        }

        .reset-btn {
          background: var(--secondary);
          color: white;
          padding: 12px 20px;
          font-size: 14px;
          font-weight: 600;
        }

        .reset-btn:hover {
          background: #5a6268;
        }

        @media (max-width: 768px) {
          .filters-container {
            padding: 20px;
          }

          .filters-grid {
            grid-template-columns: 1fr;
            gap: 20px;
          }

          .filters-header {
            flex-direction: column;
            gap: 16px;
            align-items: stretch;
          }

          .filters-header h2 {
            font-size: 20px;
          }
        }
      `}</style>
    </div>
  );
};