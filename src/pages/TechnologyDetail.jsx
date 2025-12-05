import { useParams, Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './TechnologyDetail.css';

function TechnologyDetail() {
    const { techId } = useParams();
    const navigate = useNavigate();
    const [technology, setTechnology] = useState(null);
    const [notes, setNotes] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadTechnology = () => {
            const saved = localStorage.getItem('technologies');
            if (saved) {
                const technologies = JSON.parse(saved);
                const tech = technologies.find(t => t.id === parseInt(techId));
                
                setTechnology(tech);
                setNotes(tech?.notes || '');
                setIsLoading(false);
            } else {
                setIsLoading(false);
            }
        };

        loadTechnology();
    }, [techId]);

    const updateStatus = (newStatus) => {
        const saved = localStorage.getItem('technologies');
        if (saved && technology) {
            const technologies = JSON.parse(saved);
            const updated = technologies.map(tech =>
                tech.id === parseInt(techId) ? { ...tech, status: newStatus } : tech
            );
            localStorage.setItem('technologies', JSON.stringify(updated));
            setTechnology(prev => prev ? { ...prev, status: newStatus } : null);
        }
    };

    const updateNotes = () => {
        const saved = localStorage.getItem('technologies');
        if (saved && technology) {
            const technologies = JSON.parse(saved);
            const updated = technologies.map(tech =>
                tech.id === parseInt(techId) ? { ...tech, notes: notes } : tech
            );
            localStorage.setItem('technologies', JSON.stringify(updated));
            setTechnology(prev => prev ? { ...prev, notes: notes } : null);
            alert('Заметки сохранены!');
        }
    };

    const deleteTechnology = () => {
        if (window.confirm('Вы уверены, что хотите удалить эту технологию?')) {
            const saved = localStorage.getItem('technologies');
            if (saved) {
                const technologies = JSON.parse(saved);
                const updated = technologies.filter(tech => tech.id !== parseInt(techId));
                localStorage.setItem('technologies', JSON.stringify(updated));
                navigate('/');
            }
        }
    };

    if (isLoading) {
        return (
            <div className="technology-detail-page">
                <div className="page-header">
                    <h1>Загрузка...</h1>
                </div>
            </div>
        );
    }

    if (!technology) {
        return (
            <div className="technology-detail-page">
                <div className="page-header">
                    <h1>Технология не найдена</h1>
                    <p>Технология с ID {techId} не существует.</p>
                    <Link to="/" className="btn btn-primary">
                        ← Назад к списку
                    </Link>
                </div>
            </div>
        );
    }

    const getStatusText = (status) => {
        switch (status) {
            case 'completed': return 'Изучено';
            case 'in-progress': return 'В процессе';
            case 'not-started': return 'Не начато';
            default: return status;
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'completed': return '#4CAF50';
            case 'in-progress': return '#FF9800';
            case 'not-started': return '#f44336';
            default: return '#666';
        }
    };

    return (
        <div className="technology-detail-page">
            <div className="page-header">
                <Link to="/" className="back-link">
                    Назад к списку
                </Link>
                <h1>{technology.title}</h1>
                <div className="header-actions">
                    <Link 
                        to={`/technology/${techId}/edit`}
                        className="btn btn-primary"
                    >
                        Редактировать
                    </Link>
                    <button 
                        onClick={deleteTechnology}
                        className="btn btn-danger"
                    >
                        Удалить
                    </button>
                </div>
            </div>

            <div className="technology-detail">
                <div className="detail-main">
                    <div className="detail-section">
                        <h3>Описание</h3>
                        <p>{technology.description}</p>
                    </div>

                    <div className="detail-section">
                        <h3>Категория</h3>
                        <span className={`category-badge ${technology.category}`}>
                            {technology.category === 'frontend' ? 'Фронтенд' : 'Бэкенд'}
                        </span>
                    </div>

                    <div className="detail-section">
                        <h3>Статус изучения</h3>
                        <div className="status-info">
                            <span 
                                className="status-indicator"
                                style={{ backgroundColor: getStatusColor(technology.status) }}
                            >
                                {getStatusText(technology.status)}
                            </span>
                        </div>
                        <div className="status-buttons">
                            <button
                                onClick={() => updateStatus('not-started')}
                                className={`status-btn ${technology.status === 'not-started' ? 'active' : ''}`}
                            >
                                Не начато
                            </button>
                            <button
                                onClick={() => updateStatus('in-progress')}
                                className={`status-btn ${technology.status === 'in-progress' ? 'active' : ''}`}
                            >
                                В процессе
                            </button>
                            <button
                                onClick={() => updateStatus('completed')}
                                className={`status-btn ${technology.status === 'completed' ? 'active' : ''}`}
                            >
                                Завершено
                            </button>
                        </div>
                    </div>
                </div>

                <div className="detail-sidebar">
                    <div className="detail-section">
                        <h3>Мои заметки</h3>
                        <textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="Записывайте сюда важные моменты..."
                            rows="8"
                            className="notes-textarea"
                        />
                        <button 
                            onClick={updateNotes}
                            className="btn btn-primary"
                        >
                            Сохранить заметки
                        </button>
                        <div className="notes-hint">
                            {notes.length > 0 ? `Символов: ${notes.length}` : 'Добавьте заметки по изучению'}
                        </div>
                    </div>

                    <div className="detail-section">
                        <h3>Информация</h3>
                        <div className="tech-meta">
                            <p><strong>ID:</strong> {technology.id}</p>
                            <p><strong>Создано:</strong> {new Date(technology.createdAt).toLocaleDateString()}</p>
                            <p><strong>Обновлено:</strong> {new Date().toLocaleDateString()}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TechnologyDetail;