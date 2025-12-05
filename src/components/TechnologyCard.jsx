import { Link } from 'react-router-dom';
import TechnologyResources from './TechnologyResources';
import './TechnologyCard.css';

function TechnologyCard({ technology, onStatusChange, onNotesChange, onResourcesUpdate }) {
    const { id, title, description, status, notes, category } = technology;

    const handleCardClick = () => {
        const statusOrder = ['not-started', 'in-progress', 'completed'];
        const currentIndex = statusOrder.indexOf(status);
        const nextIndex = (currentIndex + 1) % statusOrder.length;
        onStatusChange(id, statusOrder[nextIndex]);
    };

    const handleNotesChange = (e) => {
        onNotesChange(id, e.target.value);
    };

    const statusColors = {
        'completed': '#10b981',
        'in-progress': '#f59e0b',
        'not-started': '#6b7280'
    };

    const statusText = {
        'completed': 'Изучено',
        'in-progress': 'В процессе',
        'not-started': 'Не начато'
    };

    const categoryColors = {
        'frontend': '#3b82f6',
        'backend': '#10b981',
        'database': '#8b5cf6',
        'infrastructure': '#f59e0b',
        'other': '#6b7280'
    };

    const categoryText = {
        'frontend': 'Frontend',
        'backend': 'Backend',
        'database': 'Базы данных',
        'infrastructure': 'Инфраструктура',
        'other': 'Другое'
    };

    return (
        <div className={`technology-card ${status}`}>
            {/* Верхняя панель с заголовком и статусом */}
            <div className="card-top-bar">
                <div className="card-header">
                    <div className="title-section">
                        <h3 className="card-title">{title}</h3>
                        <span className="card-category" style={{ backgroundColor: categoryColors[category] || categoryColors.other }}>
                            {categoryText[category] || categoryText.other}
                        </span>
                    </div>
                    <Link to={`/technology/${id}`} className="detail-link">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="10"></circle>
                            <polyline points="12 16 16 12 12 8"></polyline>
                            <line x1="8" y1="12" x2="16" y2="12"></line>
                        </svg>
                        Подробнее
                    </Link>
                </div>
                
                <div className="status-section">
                    <div className="status-indicator-wrapper">
                        <div 
                            className="status-indicator" 
                            style={{ backgroundColor: statusColors[status] }}
                        />
                        <span className="status-text">{statusText[status]}</span>
                    </div>
                    <button 
                        className="status-toggle-btn"
                        onClick={handleCardClick}
                        style={{ backgroundColor: statusColors[status] }}
                    >
                        <svg className="toggle-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M17 8l4 4-4 4M7 8l-4 4 4 4"></path>
                        </svg>
                        Сменить статус
                    </button>
                </div>
            </div>

            {/* Основное содержимое */}
            <div className="card-content">
                <div className="main-content">
                    <p className="card-description">{description}</p>
                    
                    {/* Блок с заметками */}
                    <div className="notes-section">
                        <div className="section-header">
                            <svg className="section-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                            </svg>
                            <h4>Заметки</h4>
                        </div>
                        <textarea
                            value={notes}
                            onChange={handleNotesChange}
                            onClick={(e) => e.stopPropagation()}
                            placeholder="Записывайте сюда важные моменты..."
                            rows="3"
                            className="notes-textarea"
                        />
                        <div className="notes-footer">
                            <div className="notes-hint">
                                {notes.length > 0 ? `${notes.length} символов` : 'Добавьте заметку'}
                            </div>
                            {notes.length > 0 && (
                                <div className="notes-saved">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M20 6L9 17l-5-5"></path>
                                    </svg>
                                    Сохранено
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Блок с ресурсами */}
                <div className="resources-section">
                    <div className="section-header">
                        <svg className="section-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                        </svg>
                        <h4>Ресурсы</h4>
                    </div>
                    <TechnologyResources 
                        technology={technology}
                        onResourcesUpdate={onResourcesUpdate}
                    />
                </div>
            </div>
        </div>
    );
}

export default TechnologyCard;