import { useState, useEffect } from 'react';
import './BulkStatusEdit.css';

function BulkStatusEdit({ technologies, onBulkUpdate }) {
    const [selectedTechs, setSelectedTechs] = useState([]);
    const [newStatus, setNewStatus] = useState('not-started');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [announcement, setAnnouncement] = useState('');

    // Объявление для скринридеров
    useEffect(() => {
        if (announcement) {
            const timer = setTimeout(() => setAnnouncement(''), 3000);
            return () => clearTimeout(timer);
        }
    }, [announcement]);

    const handleTechSelection = (techId, isSelected) => {
        if (isSelected) {
            setSelectedTechs(prev => [...prev, techId]);
            setAnnouncement(`Технология добавлена к выбранным. Выбрано: ${selectedTechs.length + 1}`);
        } else {
            setSelectedTechs(prev => prev.filter(id => id !== techId));
            setAnnouncement(`Технология удалена из выбранных. Выбрано: ${selectedTechs.length - 1}`);
        }
    };

    const handleSelectAll = () => {
        const allSelected = selectedTechs.length === technologies.length;
        if (allSelected) {
            setSelectedTechs([]);
            setAnnouncement('Все технологии сняты с выбора');
        } else {
            setSelectedTechs(technologies.map(tech => tech.id));
            setAnnouncement(`Выбраны все ${technologies.length} технологий`);
        }
    };

    const handleCheckboxKeyDown = (e, techId, isChecked) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleTechSelection(techId, !isChecked);
        }
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            const nextCheckbox = e.target.parentElement.nextElementSibling?.querySelector('input[type="checkbox"]');
            if (nextCheckbox) nextCheckbox.focus();
        }
        if (e.key === 'ArrowUp') {
            e.preventDefault();
            const prevCheckbox = e.target.parentElement.previousElementSibling?.querySelector('input[type="checkbox"]');
            if (prevCheckbox) prevCheckbox.focus();
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (selectedTechs.length === 0) {
            setAnnouncement('Пожалуйста, выберите хотя бы одну технологию для изменения статуса');
            return;
        }

        setIsSubmitting(true);
        setAnnouncement('Применение изменений...');
        
        try {
            console.log('BulkStatusEdit: Submitting update for', selectedTechs, 'to status', newStatus);
            if (onBulkUpdate) {
                await onBulkUpdate(selectedTechs, newStatus);
                setAnnouncement(`Статус успешно изменен для ${selectedTechs.length} технологий`);
            } else {
                console.error('BulkStatusEdit: onBulkUpdate function is not provided');
                setAnnouncement('Ошибка: функция обновления недоступна');
            }
            setSelectedTechs([]);
            setNewStatus('not-started');
        } catch (error) {
            console.error('Ошибка при массовом обновлении:', error);
            setAnnouncement('Произошла ошибка при обновлении статусов');
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

    const getStatusClass = (status) => {
        return `tech-status ${status}`;
    };

    return (
        <div 
            className="bulk-status-edit" 
            role="form"
            aria-labelledby="bulk-edit-title"
            aria-describedby="bulk-edit-description"
        >
            {/* Объявление для скринридеров */}
            <div 
                className="sr-announcement" 
                aria-live="polite"
                aria-atomic="true"
                style={{
                    position: 'absolute',
                    width: '1px',
                    height: '1px',
                    padding: '0',
                    margin: '-1px',
                    overflow: 'hidden',
                    clip: 'rect(0, 0, 0, 0)',
                    whiteSpace: 'nowrap',
                    border: '0'
                }}
            >
                {announcement}
            </div>

            <h3 id="bulk-edit-title">Массовое редактирование статусов</h3>
            <p id="bulk-edit-description" className="sr-only">
                Выберите технологии и установите для них новый статус изучения
            </p>
            
            <div className="bulk-controls">
                {/* Верхняя часть: информация и кнопка Выбрать все */}
                <div className="selection-top">
                    <div className="selection-info">
                        <span 
                            id="selected-count"
                            aria-live="polite"
                            aria-atomic="true"
                        >
                            Выбрано: {selectedTechs.length} из {technologies.length} технологий
                        </span>
                    </div>
                    
                    {technologies.length > 0 && (
                        <button
                            type="button"
                            onClick={handleSelectAll}
                            className="btn-select-all"
                            aria-label={selectedTechs.length === technologies.length ? 
                                'Снять выделение со всех технологий' : 
                                'Выбрать все технологии'}
                            aria-controls="technologies-list"
                            disabled={isSubmitting}
                        >
                            {selectedTechs.length === technologies.length ? 'Снять все' : 'Выбрать все'}
                        </button>
                    )}
                </div>

                {/* Средняя часть: выбор статуса */}
                <div className="status-selection">
                    <div className="form-group">
                        <label htmlFor="bulk-status">
                            Установить статус:
                        </label>
                        <select
                            id="bulk-status"
                            value={newStatus}
                            onChange={(e) => setNewStatus(e.target.value)}
                            aria-required="true"
                            aria-describedby="status-description"
                            disabled={isSubmitting}
                        >
                            <option value="not-started">Не начато</option>
                            <option value="in-progress">В процессе</option>
                            <option value="completed">Завершено</option>
                        </select>
                        <div id="status-description" className="sr-only">
                            Выберите новый статус изучения для выбранных технологий
                        </div>
                    </div>
                </div>

                {/* Нижняя часть: кнопка Применить */}
                <div className="apply-section">
                    <button
                        type="submit"
                        onClick={handleSubmit}
                        disabled={selectedTechs.length === 0 || isSubmitting}
                        className="btn-apply"
                        aria-busy={isSubmitting}
                        aria-describedby="submit-hint"
                    >
                        {isSubmitting ? (
                            <>
                                <span className="spinner" aria-hidden="true"></span>
                                Применение...
                            </>
                        ) : (
                            `Применить к ${selectedTechs.length} технологиям`
                        )}
                    </button>
                    <div id="submit-hint" className="sr-only">
                        {selectedTechs.length === 0 ? 
                            'Для применения выберите хотя бы одну технологию' : 
                            'Нажмите чтобы применить изменения'}
                    </div>
                </div>
            </div>

            <div 
                className="technologies-list" 
                id="technologies-list"
                role="list"
                aria-label="Список технологий для выбора"
            >
                <h4>Список технологий:</h4>
                <div className="tech-checkboxes" role="presentation">
                    {technologies.map(tech => {
                        const isChecked = selectedTechs.includes(tech.id);
                        return (
                            <div 
                                key={tech.id} 
                                className="tech-checkbox-item"
                                role="listitem"
                            >
                                <input
                                    type="checkbox"
                                    id={`tech-${tech.id}`}
                                    checked={isChecked}
                                    onChange={(e) => handleTechSelection(tech.id, e.target.checked)}
                                    onKeyDown={(e) => handleCheckboxKeyDown(e, tech.id, isChecked)}
                                    className="tech-checkbox"
                                    aria-labelledby={`tech-label-${tech.id}`}
                                    aria-describedby={`tech-status-${tech.id}`}
                                    disabled={isSubmitting}
                                />
                                <label 
                                    htmlFor={`tech-${tech.id}`} 
                                    className="tech-label"
                                    id={`tech-label-${tech.id}`}
                                >
                                    <span className="tech-title">{tech.title}</span>
                                    <span 
                                        className={getStatusClass(tech.status)}
                                        id={`tech-status-${tech.id}`}
                                    >
                                        {getStatusText(tech.status)}
                                    </span>
                                </label>
                            </div>
                        );
                    })}
                </div>
            </div>

            {technologies.length === 0 && (
                <div className="empty-state" role="alert" aria-live="polite">
                    <p>Технологии не найдены</p>
                    <p>Добавьте технологии для массового редактирования</p>
                </div>
            )}
        </div>
    );
}

export default BulkStatusEdit;