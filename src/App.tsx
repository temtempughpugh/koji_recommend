import { useState } from 'react';
import type { KojiRecord } from './types/KojiRecord';
import { useCsvData } from './hooks/useCsvData';
import { useFilters } from './hooks/useFilters';
import { useStats } from './hooks/useStats';
import { LoadingSpinner } from './components/LoadingSpinner';
import { MetadataFilters } from './components/MetadataFilters';
import { SummaryStatsComponent } from './components/SummaryStats';
import { DataTable } from './components/DataTable';

function App() {
  // データ読み込み
  const { data, filterOptions, loading, error } = useCsvData();
  
  // フィルタリング
  const { filters, filteredData, updateFilter, resetFilters } = useFilters(data);
  
  // 統計計算
  const stats = useStats(filteredData);

  if (loading) {
    return <LoadingSpinner message="麹記録データを読み込んでいます..." />;
  }

  if (error) {
    return (
      <div className="error-container">
        <h2>エラーが発生しました</h2>
        <p>{error}</p>
        <p>CSVファイルが正しく配置されているか確認してください。</p>
        <style>{`
          .error-container {
            text-align: center;
            padding: 2rem;
            color: #d32f2f;
            background: #ffebee;
            border: 1px solid #ffcdd2;
            border-radius: 8px;
            margin: 2rem;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>🍶 麹製造参考データ検索</h1>
        <p>メタデータを選択して、過去のデータから参考となる制御設定を確認できます</p>
      </header>

      <main className="app-main">
        <MetadataFilters
          filters={filters}
          filterOptions={filterOptions}
          updateFilter={updateFilter}
          resetFilters={resetFilters}
        />

        <SummaryStatsComponent stats={stats} />

        <DataTable 
          data={filteredData}
          onRowClick={() => {}} 
        />
      </main>

      <style>{`
        .app {
          min-height: 100vh;
          background: #f5f5f5;
        }

        .app-header {
          background: white;
          padding: 2rem;
          border-bottom: 1px solid #ddd;
          text-align: center;
        }

        .app-header h1 {
          margin: 0 0 0.5rem 0;
          color: #333;
          font-size: 2rem;
        }

        .app-header p {
          margin: 0;
          color: #666;
          font-size: 1.1rem;
        }

        .app-main {
          width: 1200px;
          margin: 0 auto;
          padding: 2rem;
        }

        @media (max-width: 768px) {
          .app-header {
            padding: 1.5rem 1rem;
          }

          .app-header h1 {
            font-size: 1.5rem;
          }

          .app-header p {
            font-size: 1rem;
          }

          .app-main {
            padding: 1rem;
          }
        }
      `}</style>
    </div>
  );
}

export default App;