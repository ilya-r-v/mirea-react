import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import TechnologyResources from './TechnologyResources';
import EditDeadlineDialog from './EditDeadlineDialog';
import './TechnologyCard.css';

function TechnologyCard({ 
  technology, 
  onStatusChange, 
  onNotesChange, 
  onResourcesUpdate,
  onDeadlineChange,
  calculateDeadlineStatus
}) {
    const { id, title, description, status, notes, category, deadline, difficulty } = technology;
    const [openDeadlineDialog, setOpenDeadlineDialog] = useState(false);

    const handleCardClick = () => {
        const statusOrder = ['not-started', 'in-progress', 'completed'];
        const currentIndex = statusOrder.indexOf(status);
        const nextIndex = (currentIndex + 1) % statusOrder.length;
        onStatusChange(id, statusOrder[nextIndex]);
    };

    const handleNotesChange = (e) => {
        onNotesChange(id, e.target.value);
    };

    const handleDeadlineSave = (techId, newDeadline) => {
        if (onDeadlineChange) {
            onDeadlineChange(techId, newDeadline);
        }
        setOpenDeadlineDialog(false);
    };

    // Цвета для статусов
    const statusColors = {
        'completed': '#10b981', // Зеленый
        'in-progress': '#f59e0b', // Оранжевый
        'not-started': '#6b7280'  // Серый
    };

    const statusText = {
        'completed': 'Изучено',
        'in-progress': 'В процессе',
        'not-started': 'Не начато'
    };

    // Иконки для статусов
    const getStatusIcon = () => {
        switch(status) {
            case 'completed':
                return (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="3">
                        <path d="M20 6L9 17l-5-5" />
                    </svg>
                );
            case 'in-progress':
                return (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2">
                        <circle cx="12" cy="12" r="10"></circle>
                        <path d="M12 6v6l4 2" />
                    </svg>
                );
            case 'not-started':
                return (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2">
                        <circle cx="12" cy="12" r="10" />
                    </svg>
                );
            default:
                return null;
        }
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

    // Функция для расчета дней до дедлайна
    const getDaysRemaining = (deadlineDate) => {
        if (!deadlineDate) return null;
        
        try {
            const today = new Date();
            const deadline = new Date(deadlineDate);
            const diffTime = deadline - today;
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            return diffDays;
        } catch (e) {
            return null;
        }
    };

    // Функция для получения статуса дедлайна
    const getDeadlineStatus = () => {
        if (!deadline) return null;
        return calculateDeadlineStatus ? calculateDeadlineStatus(deadline) : null;
    };

    const deadlineStatus = getDeadlineStatus();
    const daysRemaining = getDaysRemaining(deadline);

    const getDeadlineColor = () => {
        switch (deadlineStatus) {
            case 'overdue': return '#ef4444';
            case 'urgent': return '#f59e0b';
            case 'approaching': return '#3b82f6';
            case 'normal': return '#10b981';
            default: return '#6b7280';
        }
    };

    const getDeadlineText = () => {
        if (!deadline) return 'Дедлайн не установлен';
        
        try {
            const deadlineDate = new Date(deadline);
            const today = new Date();
            
            const formattedDate = deadlineDate.toLocaleDateString('ru-RU', {
                day: 'numeric',
                month: 'short'
            });

            if (daysRemaining < 0) {
                return `Просрочено ${Math.abs(daysRemaining)} д. назад`;
            } else if (daysRemaining === 0) {
                return 'Сегодня последний день!';
            } else if (daysRemaining === 1) {
                return 'Завтра последний день';
            } else if (daysRemaining <= 7) {
                return `Осталось ${daysRemaining} д. (${formattedDate})`;
            } else {
                return `Осталось ${daysRemaining} д. (${formattedDate})`;
            }
        } catch (e) {
            return 'Некорректная дата';
        }
    };

    // Иконка для дедлайна
    const getDeadlineIcon = () => {
        switch (deadlineStatus) {
            case 'overdue': return '⏰';
            case 'urgent': return '⚠️';
            case 'approaching': return '📅';
            case 'normal': return '✅';
            default: return '📅';
        }
    };

    return (
        <>
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
                            <div className="status-icon">
                                {getStatusIcon()}
                            </div>
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

                {/* Блок с дедлайном */}
                <div 
                    className="deadline-section" 
                    onClick={() => setOpenDeadlineDialog(true)}
                    style={{ 
                        cursor: 'pointer',
                        borderLeft: `4px solid ${getDeadlineColor()}`,
                        backgroundColor: deadline ? `${getDeadlineColor()}10` : '#f5f5f5',
                        transition: 'all 0.2s ease',
                        margin: '0 15px 15px 15px',
                        padding: '12px',
                        borderRadius: '8px'
                    }}
                >
                    <div className="deadline-content" style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'space-between'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <span style={{ fontSize: '18px' }}>{getDeadlineIcon()}</span>
                            <span className="deadline-text" style={{ 
                                color: deadline ? getDeadlineColor() : '#6b7280',
                                fontWeight: '500',
                                fontSize: '14px'
                            }}>
                                {getDeadlineText()}
                            </span>
                        </div>
                        <span className="deadline-edit-hint" style={{
                            fontSize: '12px',
                            color: '#6b7280',
                            opacity: 0.7
                        }}>
                            {deadline ? 'Нажмите для изменения' : 'Нажмите для установки'}
                        </span>
                    </div>
                    {deadline && deadlineStatus && (
                        <div style={{ 
                            marginTop: '8px', 
                            fontSize: '12px',
                            color: getDeadlineColor(),
                            fontWeight: '500'
                        }}>
                            {deadlineStatus === 'overdue' && 'Просрочено'}
                            {deadlineStatus === 'urgent' && 'Срочно!'}
                            {deadlineStatus === 'approaching' && 'Приближается срок'}
                            {deadlineStatus === 'normal' && 'По плану'}
                        </div>
                    )}
                </div>

                {/* Основное содержимое */}
                <div className="card-content" style={{ padding: '0 15px 15px 15px' }}>
                    <div className="main-content">
                        <p className="card-description" style={{ 
                            marginBottom: '15px',
                            color: '#4b5563',
                            fontSize: '14px'
                        }}>
                            {description}
                        </p>
                        
                        {/* Блок с заметками */}
                        <div className="notes-section" style={{ 
                            marginBottom: '20px',
                            backgroundColor: '#f9fafb',
                            padding: '15px',
                            borderRadius: '8px'
                        }}>
                            <div className="section-header" style={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                gap: '8px',
                                marginBottom: '12px'
                            }}>
                                <svg className="section-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                </svg>
                                <h4 style={{ margin: 0, fontSize: '16px', fontWeight: '600' }}>Заметки</h4>
                            </div>
                            <textarea
                                value={notes}
                                onChange={handleNotesChange}
                                onClick={(e) => e.stopPropagation()}
                                placeholder="Записывайте сюда важные моменты..."
                                rows="3"
                                className="notes-textarea"
                                style={{
                                    width: '100%',
                                    padding: '10px',
                                    border: '1px solid #e5e7eb',
                                    borderRadius: '6px',
                                    fontSize: '14px',
                                    resize: 'vertical',
                                    backgroundColor: 'white'
                                }}
                            />
                            <div className="notes-footer" style={{ 
                                display: 'flex', 
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                marginTop: '8px'
                            }}>
                                <div className="notes-hint" style={{ 
                                    fontSize: '12px', 
                                    color: '#6b7280'
                                }}>
                                    {notes.length > 0 ? `${notes.length} символов` : 'Добавьте заметку'}
                                </div>
                                {notes.length > 0 && (
                                    <div className="notes-saved" style={{ 
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '4px',
                                        fontSize: '12px',
                                        color: '#10b981'
                                    }}>
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
                    <div className="resources-section" style={{ 
                        backgroundColor: '#f9fafb',
                        padding: '15px',
                        borderRadius: '8px'
                    }}>
                        <div className="section-header" style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '8px',
                            marginBottom: '12px'
                        }}>
                            <svg className="section-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                            </svg>
                            <h4 style={{ margin: 0, fontSize: '16px', fontWeight: '600' }}>Ресурсы</h4>
                        </div>
                        <TechnologyResources 
                            technology={technology}
                            onResourcesUpdate={onResourcesUpdate}
                        />
                    </div>
                </div>
            </div>

            {/* Диалог редактирования дедлайна */}
            <EditDeadlineDialog
                open={openDeadlineDialog}
                onClose={() => setOpenDeadlineDialog(false)}
                technology={technology}
                onSave={handleDeadlineSave}
                calculateDeadlineStatus={calculateDeadlineStatus}
            />
        </>
    );
}

export default TechnologyCard;