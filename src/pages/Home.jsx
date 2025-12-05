import { useState } from 'react';
import ProgressBar from '../components/ProgressBar';
import TechnologyCard from '../components/TechnologyCard';
import QuickActions from '../components/QuickActions';
import FilterTabs from '../components/FilterTabs';
import DebouncedSearch from '../components/DebouncedSearch';
import RoadmapImporter from '../components/RoadmapImporter';
import './Home.css';

function Home({ 
  technologies, 
  loading, 
  onStatusChange, 
  onNotesChange, 
  searchQuery, 
  onSearchChange,
  onImportRoadmap,
  onMarkAllCompleted,
  onResetAllStatuses
}) {
  const [activeFilter, setActiveFilter] = useState('all');

  // Расчет прогресса
  const progress = technologies.length > 0 
    ? Math.round((technologies.filter(tech => tech.status === 'completed').length / technologies.length) * 100)
    : 0;

  // Фильтрация и поиск технологий
  const filteredTechnologies = technologies.filter(tech => {
    const statusMatch = activeFilter === 'all' || tech.status === activeFilter;
    
    const searchMatch = searchQuery === '' || 
      tech.title.toLowerCase().includes(searchQuery) ||
      tech.description.toLowerCase().includes(searchQuery) ||
      tech.notes.toLowerCase().includes(searchQuery) ||
      tech.category.toLowerCase().includes(searchQuery);
    
    return statusMatch && searchMatch;
  });

  return (
    <div className="home-page">
      <header className="app-header">
        <div className="app-header__content">
          <ProgressBar
            progress={progress}
            label="Общий прогресс изучения"
            color="#8840d0ff"
            animated={true}
            height={24}
            showPercentage={true}
          />
        </div>
      </header>

      <div className="home-actions">
        <RoadmapImporter 
          onImport={onImportRoadmap}
          loading={loading}
        />
        
        <DebouncedSearch 
          onSearch={onSearchChange}
          placeholder="Поиск по названию, описанию или заметкам..."
          delay={500}
        />
      </div>

      <QuickActions 
        technologies={technologies}
        onMarkAllCompleted={onMarkAllCompleted}
        onResetAllStatuses={onResetAllStatuses}
      />

      <FilterTabs 
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
        technologies={technologies}
      />

      <div className="technologies-grid">
        {filteredTechnologies.map(tech => (
          <TechnologyCard
            key={tech.id}
            technology={tech}
            onStatusChange={onStatusChange}
            onNotesChange={onNotesChange}
          />
        ))}
        
        {filteredTechnologies.length === 0 && (
          <div className="no-results">
            <h3>Ничего не найдено</h3>
            <p>Попробуйте изменить поисковый запрос или фильтр</p>
          </div>
        )}
      </div>

      {loading && technologies.length > 0 && (
        <div className="loading-overlay">
          <div className="loading-spinner"></div>
        </div>
      )}
    </div>
  );
}

export default Home;