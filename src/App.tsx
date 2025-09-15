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

        <SummaryStatsComponent 
          stats={stats} 
          data={filteredData}
        />

        <DataTable 
          data={filteredData}
          onRowClick={() => {}} 
        />
      </main>

      <style>{`
        .app {
          min-height: 100vh;
          background: #f5f5f5;
          margin: 0;
          padding: 0;
          width: 100vw;  /* 画面幅100%で全画面表示 */
        }

        .app-header {
          background: white;
          padding: 12px 16px;
          border-bottom: 1px solid #ddd;
          text-align: center;
        }

        .app-header h1 {
          margin: 0 0 4px 0;
          color: #333;
          font-size: 20px;
          font-weight: 600;
        }

        .app-header p {
          margin: 0;
          color: #666;
          font-size: 13px;
        }

        /* 可変幅設定 - 画面サイズに自動適応、縦の変動は防止 */
        .app-main {
          margin: 0 auto;
          padding: 12px;
          min-height: calc(100vh - 100px); /* 高さ固定で縦の変動防止 */
          
          /* 画面幅に応じた可変設定 */
          width: min(95vw, 1400px);  /* 画面幅95%、最大1400px */
          min-width: 320px;          /* 最小幅でデータ表示保証 */
        }

        /* タブレット・スマートフォンでの調整 */
        @media (max-width: 768px) {
          .app-main {
            width: min(98vw, 600px);  /* 小画面では98%使用 */
            padding: 8px;
          }
          
          .app-header {
            padding: 10px 8px;
          }

          .app-header h1 {
            font-size: 18px;
          }

          .app-header p {
            font-size: 12px;
          }
        }

        /* スマートフォン */
        @media (max-width: 480px) {
          .app-main {
            width: min(99vw, 400px);
            padding: 6px;
          }
          
          .app-header {
            padding: 8px 6px;
          }

          .app-header h1 {
            font-size: 16px;
          }

          .app-header p {
            font-size: 11px;
          }
        }
      `}</style>
    </div>
  );
}

export default App;