// App.jsx (обновленная версия)
import { useState } from 'react';
import './App.css';
import useTechnologies from './hooks/useTechnologies';
import ProgressBar from './components/ProgressBar';
import TechnologyCard from './components/TechnologyCard';
import QuickActions from './components/QuickActions';
import FilterTabs from './components/FilterTabs';
import SearchBox from './components/SearchBox';

function App() {
  const { 
    technologies, 
    updateStatus, 
    updateNotes, 
    markAllCompleted, 
    resetAllStatuses, 
    exportData,
    progress,
    categoryStats 
  } = useTechnologies();

  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Фильтрация и поиск технологий
  const filteredTechnologies = technologies.filter(tech => {
    // Применяем фильтр по статусу
    const statusMatch = activeFilter === 'all' || tech.status === activeFilter;
    
    // Применяем поисковый запрос
    const searchMatch = searchQuery === '' || 
      tech.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tech.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tech.notes.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tech.category.toLowerCase().includes(searchQuery.toLowerCase());
    
    return statusMatch && searchMatch;
  });

  return (
    <div className="app">
      <header className="app-header">
        <div className="app-header__content">
          <h1 className="app-header__title">Трекер изучения технологий</h1>
          <ProgressBar
            progress={progress}
            label="Общий прогресс изучения"
            color="#10b981"
            animated={true}
            height={24}
            showPercentage={true}
          />
        </div>
      </header>

      <main className="app-main">
        <SearchBox 
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          resultsCount={filteredTechnologies.length}
          totalCount={technologies.length}
        />
        
        <QuickActions 
          technologies={technologies}
          onMarkAllCompleted={markAllCompleted}
          onResetAllStatuses={resetAllStatuses}
          exportData={exportData}
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
              onStatusChange={updateStatus}
              onNotesChange={updateNotes}
            />
          ))}
          
          {filteredTechnologies.length === 0 && (
            <div className="no-results">
              <h3>Ничего не найдено</h3>
              <p>Попробуйте изменить поисковый запрос или фильтр</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;