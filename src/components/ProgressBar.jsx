// components/ProgressBar.jsx
import './ProgressBar.css';

const ProgressBar = ({ 
  progress, 
  label = "Прогресс", 
  color = "#4CAF50", 
  animated = true, 
  height = 20,
  showPercentage = true 
}) => {
  return (
    <div className="progress-bar-wrapper">
      <div className="progress-bar-header">
        <span className="progress-bar-label">{label}</span>
        {showPercentage && (
          <span className="progress-bar-percentage">{progress}%</span>
        )}
      </div>
      <div 
        className="progress-bar-container"
        style={{ height: `${height}px` }}
      >
        <div 
          className={`progress-bar-fill ${animated ? 'progress-bar-fill--animated' : ''}`}
          style={{ 
            width: `${progress}%`,
            backgroundColor: color
          }}
        ></div>
      </div>
    </div>
  );
};

export default ProgressBar;