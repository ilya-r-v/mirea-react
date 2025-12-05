import { useState } from 'react';
import useTechnologies from '../hooks/useTechnologies';
import './DataImportExport.css';

function DataImportExport() {
    const { technologies, setTechnologies } = useTechnologies();
    const [status, setStatus] = useState('');
    const [isDragging, setIsDragging] = useState(false);

    const exportToJSON = () => {
        try {
            const dataStr = JSON.stringify(technologies, null, 2);
            const dataBlob = new Blob([dataStr], { type: 'application/json' });
            const url = URL.createObjectURL(dataBlob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `technologies_${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);

            setStatus('Данные экспортированы в JSON');
            setTimeout(() => setStatus(''), 3000);
        } catch (error) {
            setStatus('Ошибка экспорта данных');
            console.error('Ошибка экспорта:', error);
        }
    };

    const importFromJSON = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();

        reader.onload = (e) => {
            try {
                const imported = JSON.parse(e.target.result);

                if (!Array.isArray(imported)) {
                    throw new Error('Неверный формат данных');
                }

                // Валидация импортированных данных
                const isValid = imported.every(item => 
                    item && 
                    typeof item.title === 'string' && 
                    typeof item.status === 'string'
                );

                if (!isValid) {
                    throw new Error('Неверная структура данных');
                }

                setTechnologies(imported);
                setStatus(`Импортировано ${imported.length} технологий`);
                setTimeout(() => setStatus(''), 3000);
            } catch (error) {
                setStatus('Ошибка импорта: неверный формат файла');
                console.error('Ошибка импорта:', error);
            }
        };

        reader.readAsText(file);
        event.target.value = '';
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);

        const file = e.dataTransfer.files[0];
        if (file && file.type === 'application/json') {
            const reader = new FileReader();
            reader.onload = (event) => {
                try {
                    const imported = JSON.parse(event.target.result);
                    if (Array.isArray(imported)) {
                        setTechnologies(imported);
                        setStatus(`Импортировано ${imported.length} технологий`);
                        setTimeout(() => setStatus(''), 3000);
                    }
                } catch (error) {
                    console.log(error);
                    setStatus('Ошибка импорта: неверный формат файла');
                }
            };
            reader.readAsText(file);
        }
    };

    return (
        <div className="data-import-export">
            <h3>Импорт и экспорт данных</h3>

            {status && (
                <div className="status-message">
                    {status}
                </div>
            )}

            <div className="controls">
                <button 
                    onClick={exportToJSON} 
                    disabled={technologies.length === 0}
                    className="btn-export"
                >
                    Экспорт в JSON
                </button>

                <label className="file-input-label">
                    Импорт из JSON
                    <input
                        type="file"
                        accept=".json"
                        onChange={importFromJSON}
                    />
                </label>
            </div>

            <div
                className={`drop-zone ${isDragging ? 'dragging' : ''}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
            >
                Перетащите JSON-файл сюда
            </div>

            {technologies.length > 0 && (
                <div className="technologies-preview">
                    <h4>Текущие технологии ({technologies.length})</h4>
                    <div className="preview-list">
                        {technologies.slice(0, 5).map((tech, index) => (
                            <div key={index} className="preview-item">
                                <strong>{tech.title}</strong> - {tech.category}
                            </div>
                        ))}
                        {technologies.length > 5 && (
                            <div className="preview-more">
                                ... и еще {technologies.length - 5} технологий
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default DataImportExport;