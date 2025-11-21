// components/FilterTabs.jsx
import './FilterTabs.css';

const FilterTabs = ({ activeFilter, onFilterChange, technologies }) => {
  const counts = {
    all: technologies.length,
    completed: technologies.filter(tech => tech.status === 'completed').length,
    'in-progress': technologies.filter(tech => tech.status === 'in-progress').length,
    'not-started': technologies.filter(tech => tech.status === 'not-started').length,
  };

  const filters = [
    { key: 'all', label: 'Все технологии' },
    { key: 'not-started', label: 'Не начатые' },
    { key: 'in-progress', label: 'В процессе' },
    { key: 'completed', label: 'Выполненные' },
  ];

  return (
    <div className="filter-tabs">
      <div className="filter-tabs__container">
        {filters.map(filter => (
          <button
            key={filter.key}
            className={`filter-tabs__tab ${
              activeFilter === filter.key ? 'filter-tabs__tab--active' : ''
            }`}
            onClick={() => onFilterChange(filter.key)}
          >
            {filter.label}
            <span className="filter-tabs__count">({counts[filter.key]})</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default FilterTabs;