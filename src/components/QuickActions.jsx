import { useState } from 'react';
import Modal from './Modal';
import BulkStatusEdit from './BulkStatusEdit';
import DataImportExport from './DataImportExport';
import './QuickActions.css';

function QuickActions({ 
    markAllAsCompleted, 
    resetAllStatuses, 
    randomizeNextTechnology, 
    technologies,
    onBulkUpdate 
}) {
    const [showExportModal, setShowExportModal] = useState(false);
    const [showBulkEditModal, setShowBulkEditModal] = useState(false);
    const [showImportExportModal, setShowImportExportModal] = useState(false);

    const handleExport = () => {
        const data = {
            exportedAt: new Date().toISOString(),
            technologies: technologies
        };
        const dataStr = JSON.stringify(data, null, 2);
        
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `tech-tracker-export-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        setShowExportModal(true);
    };

    const handleBulkUpdate = (ids, newStatus) => {
        if (onBulkUpdate) {
            onBulkUpdate(ids, newStatus);
        }
        setShowBulkEditModal(false);
    };

    return (
        <div className="quick-actions-container">
            <div className="quick-actions-header">
                <h3>Быстрые действия</h3>
                <p className="quick-actions-subtitle">Управление технологиями одним кликом</p>
            </div>
            
            <div className="quick-actions-grid">
                {/* Основные действия */}
                <div className="actions-group">
                    <div className="action-card" onClick={markAllAsCompleted}>
                        <div className="action-content">
                            <h4>Отметить все как изученные</h4>
                            <p>Пометить все технологии как завершенные</p>
                        </div>
                    </div>
                    
                    <div className="action-card" onClick={resetAllStatuses}>
                        <div className="action-content">
                            <h4>Сбросить все статусы</h4>
                            <p>Вернуть все технологии в статус "Не начато"</p>
                        </div>
                    </div>
                    
                    <div className="action-card" onClick={randomizeNextTechnology}>
                        <div className="action-content">
                            <h4>Случайный выбор</h4>
                            <p>Выбрать следующую технологию случайным образом</p>
                        </div>
                    </div>
                </div>
                
                {/* Управление данными */}
                <div className="actions-group">
                    <div className="action-card" onClick={() => setShowBulkEditModal(true)}>
                        <div className="action-content">
                            <h4>Массовое редактирование</h4>
                            <p>Изменить статус нескольких технологий одновременно</p>
                        </div>
                    </div>
                    
                    <div className="action-card" onClick={handleExport}>
                        <div className="action-content">
                            <h4>Экспорт данных</h4>
                            <p>Скачать все данные в JSON формате</p>
                        </div>
                    </div>
                    
                    <div className="action-card" onClick={() => setShowImportExportModal(true)}>
                        <div className="action-content">
                            <h4>Импорт данных</h4>
                            <p>Загрузить данные из файла</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Модальное окно экспорта */}
            <Modal
                isOpen={showExportModal}
                onClose={() => setShowExportModal(false)}
                title="Экспорт данных"
            >
                <div className="modal-content">
                    <div className="modal-icon">✓</div>
                    <h4>Данные успешно экспортированы!</h4>
                    <p>Файл с вашими данными был скачан автоматически.</p>
                    <button 
                        onClick={() => setShowExportModal(false)}
                        className="modal-button"
                    >
                        Закрыть
                    </button>
                </div>
            </Modal>

            {/* Модальное окно массового редактирования */}
            <Modal
                isOpen={showBulkEditModal}
                onClose={() => setShowBulkEditModal(false)}
                title="Массовое редактирование статусов"
                size="large"
            >
                <BulkStatusEdit 
                    technologies={technologies}
                    onBulkUpdate={handleBulkUpdate}
                />
            </Modal>

            {/* Модальное окно импорта/экспорта */}
            <Modal
                isOpen={showImportExportModal}
                onClose={() => setShowImportExportModal(false)}
                title="Импорт / экспорт данных"
                size="large"
            >
                <DataImportExport />
            </Modal>
        </div>
    );
}

export default QuickActions;