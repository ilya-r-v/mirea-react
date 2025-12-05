import { useState, useEffect, useRef } from 'react';
import useTechnologiesApi from '../hooks/useTechnologyApi';
import './TechnologySearch.css';

function TechnologySearch({ onSearchResults, onSearchStateChange }) {
  const [searchTerm, setSearchTerm] = useState('');
  const { searchTechnologies, loading, error } = useTechnologiesApi();
  const searchTimeoutRef = useRef(null);

  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  const handleSearch = async (query) => {
    if (onSearchStateChange) {
      onSearchStateChange({ loading: true, error: null });
    }

    try {
      const results = await searchTechnologies(query);
      if (onSearchResults) {
        onSearchResults(results);
      }
    } catch (err) {
      if (onSearchStateChange) {
        onSearchStateChange({ loading: false, error: err.message });
      }
    } finally {
      if (onSearchStateChange) {
        onSearchStateChange({ loading: false, error: null });
      }
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      handleSearch(value);
    }, 500);
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    if (onSearchResults) {
      onSearchResults(null);
    }
    if (onSearchStateChange) {
      onSearchStateChange({ loading: false, error: null });
    }
  };

  return (
    <div className="feature-card search-container">
      <div className="feature-header">
        <h3>Поиск технологий</h3>
        <p className="feature-subtitle">Ищите технологии по названию, описанию или категории</p>
      </div>

      <div className="search-input-wrapper">
        <div className="search-input-group">
          <svg className="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"></circle>
            <path d="M21 21l-4.35-4.35"></path>
          </svg>
          <input
            type="text"
            placeholder="Введите название технологии..."
            value={searchTerm}
            onChange={handleInputChange}
            className="search-input"
          />
          {loading && (
            <div className="search-loading">
              <div className="spinner"></div>
            </div>
          )}
          {searchTerm && !loading && (
            <button 
              onClick={handleClearSearch}
              className="search-clear-btn"
              title="Очистить поиск"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          )}
        </div>

        {searchTerm && !loading && (
          <div className="search-term-display">
            <span>Поиск: </span>
            <span className="search-term-value">"{searchTerm}"</span>
          </div>
        )}
      </div>

      {error && (
        <div className="feature-error">
          <svg className="error-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
          <span>Ошибка: {error}</span>
        </div>
      )}

      <div className="feature-tips">
        <h4>Советы по поиску</h4>
        <ul>
          <li>Используйте ключевые слова: "React", "JavaScript", "Базы данных"</li>
          <li>Ищите по категориям: "frontend", "backend", "devops"</li>
          <li>Попробуйте частичные совпадения: "Node" найдет "Node.js"</li>
        </ul>
      </div>
    </div>
  );
}

export default TechnologySearch;