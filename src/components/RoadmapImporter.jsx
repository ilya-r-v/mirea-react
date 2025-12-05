import { useState } from 'react';
import useTechnologiesApi from '../hooks/useTechnologyApi';
import useTechnologies from '../hooks/useTechnologies';
import './RoadmapImporter.css';

function RoadmapImporter() {
  const { fetchRoadmap, loading, error } = useTechnologiesApi();
  const { technologies, addTechnology } = useTechnologies();
  const [importedCount, setImportedCount] = useState(0);
  const [selectedRoadmap, setSelectedRoadmap] = useState('frontend');

  const handleImportRoadmap = async () => {
    try {
      const roadmapTechnologies = await fetchRoadmap(selectedRoadmap);
      
      let count = 0;
      for (const tech of roadmapTechnologies) {
        const exists = technologies.some(existingTech => 
          existingTech.title === tech.title
        );
        
        if (!exists) {
          await addTechnology(tech);
          count++;
        }
      }
      
      setImportedCount(count);
      
      if (count > 0) {
        alert(`Успешно импортировано ${count} технологий из дорожной карты!`);
      } else {
        alert('Все технологии из этой дорожной карты уже есть в вашем списке.');
      }
    } catch (err) {
      alert(`Ошибка импорта: ${err.message}`);
    }
  };

  return (
    <div className="feature-card roadmap-container">
      <div className="feature-header">
        <h3>Импорт дорожной карты</h3>
        <p className="feature-subtitle">Загрузите готовый набор технологий для изучения</p>
      </div>

      <div className="roadmap-controls">
        <div className="select-group">
          <label htmlFor="roadmap-type" className="select-label">
            Выберите дорожную карту:
          </label>
          <div className="custom-select">
            <select
              id="roadmap-type"
              value={selectedRoadmap}
              onChange={(e) => setSelectedRoadmap(e.target.value)}
              disabled={loading}
              className="roadmap-select"
            >
              <option value="frontend">Фронтенд разработка</option>
              <option value="backend">Бэкенд разработка</option>
              <option value="fullstack">Fullstack разработка</option>
            </select>
            <svg className="select-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </div>
        </div>

        <button 
          onClick={handleImportRoadmap} 
          disabled={loading}
          className="feature-button import-button"
        >
          {loading ? (
            <>
              <div className="button-spinner"></div>
              <span>Импорт...</span>
            </>
          ) : (
            <>
              <svg className="button-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7 10 12 15 17 10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
              </svg>
              <span>Импортировать дорожную карту</span>
            </>
          )}
        </button>
      </div>

      {error && (
        <div className="feature-error">
          <svg className="error-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
          <span>{error}</span>
        </div>
      )}

      {importedCount > 0 && (
        <div className="feature-success">
          <svg className="success-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
          <span>Успешно импортировано технологий: <strong>{importedCount}</strong></span>
        </div>
      )}

      <div className="roadmap-info">
        <h4>Что включено в дорожные карты:</h4>
        <div className="roadmap-list">
          <div className="roadmap-item">
            <div className="roadmap-badge frontend">FE</div>
            <div className="roadmap-content">
              <strong>Фронтенд:</strong> React, TypeScript, Vue.js и современные frontend технологии
            </div>
          </div>
          <div className="roadmap-item">
            <div className="roadmap-badge backend">BE</div>
            <div className="roadmap-content">
              <strong>Бэкенд:</strong> Node.js, MongoDB, PostgreSQL и server-side технологии
            </div>
          </div>
          <div className="roadmap-item">
            <div className="roadmap-badge fullstack">FS</div>
            <div className="roadmap-content">
              <strong>Fullstack:</strong> Все технологии из обеих дорожных карт
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RoadmapImporter;