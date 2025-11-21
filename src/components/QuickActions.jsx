// components/QuickActions.jsx
import { useState } from 'react';
import Modal from './Modal';
import './QuickActions.css';

const QuickActions = ({ technologies, onMarkAllCompleted, onResetAllStatuses }) => {
  const [showExportModal, setShowExportModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);

  const handleExport = () => {
    const data = {
      exportedAt: new Date().toISOString(),
      technologies: technologies
    };
    const dataStr = JSON.stringify(data, null, 2);
    
    // Создаем Blob и ссылку для скачивания
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tech-tracker-export-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    setShowExportModal(true);
  };

  const handleConfirmAction = (action) => {
    setConfirmAction(action);
    setShowConfirmModal(true);
  };

  const executeAction = () => {
    if (confirmAction === 'complete') {
      onMarkAllCompleted();
    } else if (confirmAction === 'reset') {
      onResetAllStatuses();
    }
    setShowConfirmModal(false);
    setConfirmAction(null);
  };

  const getStats = () => {
    const total = technologies.length;
    const completed = technologies.filter(tech => tech.status === 'completed').length;
    const inProgress = technologies.filter(tech => tech.status === 'in-progress').length;
    const notStarted = technologies.filter(tech => tech.status === 'not-started').length;
    
    return { total, completed, inProgress, notStarted };
  };

  const stats = getStats();

  return (
    <div className="quick-actions">
      <h3 className="quick-actions__title">Быстрые действия</h3>
      
      <div className="quick-actions__stats">
        <div className="quick-actions__stat">
          <span className="quick-actions__stat-value">{stats.total}</span>
          <span className="quick-actions__stat-label">Всего</span>
        </div>
        <div className="quick-actions__stat">
          <span className="quick-actions__stat-value" style={{color: '#10b981'}}>
            {stats.completed}
          </span>
          <span className="quick-actions__stat-label">Выполнено</span>
        </div>
        <div className="quick-actions__stat">
          <span className="quick-actions__stat-value" style={{color: '#f59e0b'}}>
            {stats.inProgress}
          </span>
          <span className="quick-actions__stat-label">В процессе</span>
        </div>
        <div className="quick-actions__stat">
          <span className="quick-actions__stat-value" style={{color: '#6b7280'}}>
            {stats.notStarted}
          </span>
          <span className="quick-actions__stat-label">Не начато</span>
        </div>
      </div>

      <div className="quick-actions__buttons">
        <button 
          onClick={() => handleConfirmAction('complete')}
          className="quick-actions__button quick-actions__button--success"
          disabled={stats.completed === stats.total}
        >
          ✅ Отметить все как выполненные
        </button>
        
        <button 
          onClick={() => handleConfirmAction('reset')}
          className="quick-actions__button quick-actions__button--warning"
          disabled={stats.notStarted === stats.total}
        >
          🔄 Сбросить все статусы
        </button>
        
        <button 
          onClick={handleExport}
          className="quick-actions__button quick-actions__button--info"
        >
          📤 Экспорт данных
        </button>
      </div>

      {/* Модальное окно экспорта */}
      <Modal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        title="Экспорт данных"
        size="small"
      >
        <div className="export-success">
          <div className="export-success__icon">✅</div>
          <h3>Данные успешно экспортированы!</h3>
          <p>Файл с вашими данными был скачан автоматически.</p>
          <button 
            className="quick-actions__button quick-actions__button--success"
            onClick={() => setShowExportModal(false)}
          >
            Закрыть
          </button>
        </div>
      </Modal>

      {/* Модальное окно подтверждения */}
      <Modal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        title="Подтверждение действия"
        size="small"
      >
        <div className="confirm-dialog">
          <p>
            {confirmAction === 'complete' 
              ? 'Вы уверены, что хотите отметить все технологии как выполненные?'
              : 'Вы уверены, что хотите сбросить статусы всех технологий?'
            }
          </p>
          <div className="confirm-dialog__actions">
            <button 
              className="quick-actions__button quick-actions__button--warning"
              onClick={executeAction}
            >
              Да, подтверждаю
            </button>
            <button 
              className="quick-actions__button quick-actions__button--secondary"
              onClick={() => setShowConfirmModal(false)}
            >
              Отмена
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default QuickActions;