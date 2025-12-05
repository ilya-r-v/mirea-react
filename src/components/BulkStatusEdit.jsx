import { useState } from 'react';
import './BulkStatusEdit.css';

function BulkStatusEdit({ technologies, onBulkUpdate }) {
    const [selectedTechs, setSelectedTechs] = useState([]);
    const [newStatus, setNewStatus] = useState('not-started');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleTechSelection = (techId, isSelected) => {
        if (isSelected) {
            setSelectedTechs(prev => [...prev, techId]);
        } else {
            setSelectedTechs(prev => prev.filter(id => id !== techId));
        }
    };

    const handleSelectAll = (isSelected) => {
        if (isSelected) {
            setSelectedTechs(technologies.map(tech => tech.id));
        } else {
            setSelectedTechs([]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (selectedTechs.length === 0) return;

        setIsSubmitting(true);
        
        try {
            await onBulkUpdate(selectedTechs, newStatus);
            setSelectedTechs([]);
        } catch (error) {
            console.error('Ошибка при массовом обновлении:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'completed': return 'Изучено';
            case 'in-progress': return 'В процессе';
            case 'not-started': return 'Не начато';
            default: return status;
        }
    };

    return (
        <div className="bulk-status-edit">
            <h3>Массовое редактирование статусов</h3>
            
            <div className="bulk-controls">
                <div className="selection-info">
                    <span>Выбрано: {selectedTechs.length} технологий</span>
                    {technologies.length > 0 && (
                        <button
                            type="button"
                            onClick={() => handleSelectAll(selectedTechs.length !== technologies.length)}
                            className="btn-select-all"
                        >
                            {selectedTechs.length === technologies.length ? 'Снять все' : 'Выбрать все'}
                        </button>
                    )}
                </div>

                <form onSubmit={handleSubmit} className="bulk-form">
                    <div className="form-group">
                        <label htmlFor="bulk-status">Установить статус:</label>
                        <select
                            id="bulk-status"
                            value={newStatus}
                            onChange={(e) => setNewStatus(e.target.value)}
                            aria-required="true"
                        >
                            <option value="not-started">Не начато</option>
                            <option value="in-progress">В процессе</option>
                            <option value="completed">Завершено</option>
                        </select>
                    </div>

                    <button
                        type="submit"
                        disabled={selectedTechs.length === 0 || isSubmitting}
                        className="btn-apply"
                        aria-busy={isSubmitting}
                    >
                        {isSubmitting ? 'Применение...' : `Применить к ${selectedTechs.length} технологиям`}
                    </button>
                </form>
            </div>

            <div className="technologies-list">
                <h4>Список технологий:</h4>
                <div className="tech-checkboxes">
                    {technologies.map(tech => (
                        <div key={tech.id} className="tech-checkbox-item">
                            <input
                                type="checkbox"
                                id={`tech-${tech.id}`}
                                checked={selectedTechs.includes(tech.id)}
                                onChange={(e) => handleTechSelection(tech.id, e.target.checked)}
                                className="tech-checkbox"
                            />
                            <label htmlFor={`tech-${tech.id}`} className="tech-label">
                                <span className="tech-title">{tech.title}</span>
                                <span className={`tech-status ${tech.status}`}>
                                    {getStatusText(tech.status)}
                                </span>
                            </label>
                        </div>
                    ))}
                </div>
            </div>

            {technologies.length === 0 && (
                <div className="empty-state">
                    <p>Технологии не найдены</p>
                    <p>Добавьте технологии для массового редактирования</p>
                </div>
            )}
        </div>
    );
}

export default BulkStatusEdit;