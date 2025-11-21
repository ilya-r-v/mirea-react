import './ProgressHeader.css';

const ProgressHeader = ({ technologies }) => {
  const totalTechnologies = technologies.length;
  const completedTechnologies = technologies.filter(tech => tech.status === 'completed').length;
  const progressPercentage = totalTechnologies > 0 
    ? Math.round((completedTechnologies / totalTechnologies) * 100) 
    : 0;

  const getProgressColor = () => {
    if (progressPercentage >= 70) return '#10b981';
    if (progressPercentage >= 40) return '#f59e0b';
    return '#ef4444';
  };

  return (
    <div className="progress-header">
      <div className="progress-header__stats">
        <div className="progress-stat">
          <span className="progress-stat__value">{totalTechnologies}</span>
          <span className="progress-stat__label">Всего технологий</span>
        </div>
        <div className="progress-stat">
          <span className="progress-stat__value">{completedTechnologies}</span>
          <span className="progress-stat__label">Изучено</span>
        </div>
        <div className="progress-stat">
          <span className="progress-stat__value">{progressPercentage}%</span>
          <span className="progress-stat__label">Прогресс</span>
        </div>
      </div>
      
      <div className="progress-bar-container">
        <div className="progress-bar">
          <div 
            className="progress-bar__fill"
            style={{
              width: `${progressPercentage}%`,
              backgroundColor: getProgressColor()
            }}
          ></div>
        </div>
        <div className="progress-bar__labels">
          <span>0%</span>
          <span>50%</span>
          <span>100%</span>
        </div>
      </div>
    </div>
  );
};

export default ProgressHeader;