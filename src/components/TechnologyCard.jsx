// components/TechnologyCard.jsx (обновленная версия)
import './TechnologyCard.css';
import TechnologyNotes from './TechnologyNotes';

const TechnologyCard = ({ technology, onStatusChange, onNotesChange }) => {
  const { id, title, description, status, notes, category } = technology;

  const getStatusIcon = () => {
    switch (status) {
      case 'completed':
        return '✅';
      case 'in-progress':
        return '🔄';
      case 'not-started':
        return '⏳';
      default:
        return '📝';
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'completed':
        return 'Изучено';
      case 'in-progress':
        return 'В процессе';
      case 'not-started':
        return 'Не начато';
      default:
        return 'Не определено';
    }
  };

  const handleCardClick = () => {
    const statusOrder = ['not-started', 'in-progress', 'completed'];
    const currentIndex = statusOrder.indexOf(status);
    const nextIndex = (currentIndex + 1) % statusOrder.length;
    onStatusChange(id, statusOrder[nextIndex]);
  };

  const handleNotesChange = (newNotes) => {
    onNotesChange(id, newNotes);
  };

  const getCategoryColor = () => {
    const colors = {
      frontend: '#3b82f6',
      backend: '#ef4444',
      tools: '#8b5cf6',
      database: '#f59e0b'
    };
    return colors[category] || '#6b7280';
  };

  return (
    <div 
      className={`technology-card technology-card--${status}`}
      onClick={handleCardClick}
    >
      <div className="technology-card__header">
        <div className="technology-card__title-section">
          <h3 className="technology-card__title">{title}</h3>
          <span 
            className="technology-card__category"
            style={{ backgroundColor: getCategoryColor() }}
          >
            {category}
          </span>
        </div>
        <span className="technology-card__status">
          {getStatusIcon()} {getStatusText()}
        </span>
      </div>
      
      <p className="technology-card__description">{description}</p>
      
      <TechnologyNotes 
        notes={notes}
        onNotesChange={handleNotesChange}
        techId={id}
      />
      
      <div className="technology-card__progress">
        <div className={`technology-card__progress-bar technology-card__progress-bar--${status}`}></div>
      </div>
    </div>
  );
};

export default TechnologyCard;