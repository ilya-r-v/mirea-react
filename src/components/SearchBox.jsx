// components/SearchBox.jsx
import './SearchBox.css';

const SearchBox = ({ searchQuery, onSearchChange, resultsCount, totalCount }) => {
  return (
    <div className="search-box">
      <div className="search-box__container">
        <div className="search-box__input-wrapper">
          <input
            type="text"
            placeholder="Поиск по названию, описанию или заметкам..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="search-box__input"
          />
          {searchQuery && (
            <button 
              className="search-box__clear"
              onClick={() => onSearchChange('')}
            >
              ✕
            </button>
          )}
        </div>
        <div className="search-box__info">
          Найдено: <strong>{resultsCount}</strong> из {totalCount}
        </div>
      </div>
    </div>
  );
};

export default SearchBox;