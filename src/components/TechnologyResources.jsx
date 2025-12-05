import { useState, useEffect } from 'react';
import useTechnologiesApi from '../hooks/useTechnologyApi';
import './TechnologyResources.css';

function TechnologyResources({ technology, onResourcesUpdate }) {
    const { fetchTechnologyResources, loading, error } = useTechnologiesApi();
    const [resources, setResources] = useState([]);
    const [showResources, setShowResources] = useState(false);
    const [hasLoaded, setHasLoaded] = useState(false);

    const [initialized, setInitialized] = useState(false);
    useEffect(() => {
        if (!initialized && technology.resources && technology.resources.length > 0) {
            const timer = setTimeout(() => {
                setResources(technology.resources);
                setShowResources(true);
                setHasLoaded(true);
                setInitialized(true);
            }, 0);

            return () => clearTimeout(timer);
        }
    }, [technology.resources, initialized]);

    const handleLoadResources = async () => {
        try {
            const newResources = await fetchTechnologyResources(technology.id);
            
            // Асинхронное обновление состояния
            setTimeout(() => {
                setResources(newResources);
                setShowResources(true);
                setHasLoaded(true);
            }, 0);
            
            // Обновляем ресурсы в родительском компоненте
            if (onResourcesUpdate) {
                onResourcesUpdate(technology.id, newResources);
            }
        } catch (err) {
            console.error('Ошибка загрузки ресурсов:', err);
        }
    };

    const handleToggleResources = () => {
        // Асинхронное обновление состояния
        setTimeout(() => {
            setShowResources(!showResources);
        }, 0);
    };

    return (
        <div className="technology-resources">
            <div className="resources-header">
                <h4> Ресурсы для изучения</h4>
                <div className="resource-actions">
                    {!hasLoaded && (
                        <button 
                            onClick={handleLoadResources}
                            disabled={loading}
                            className="btn-load-resources"
                        >
                            {loading ? ' Загрузка...' : ' Загрузить ресурсы'}
                        </button>
                    )}
                    {resources.length > 0 && (
                        <button 
                            onClick={handleToggleResources}
                            className="btn-toggle-resources"
                        >
                            {showResources ? '▲ Скрыть' : '▼ Показать'}
                        </button>
                    )}
                </div>
            </div>

            {error && (
                <div className="resources-error">
                    ! {error}
                </div>
            )}

            {showResources && resources.length > 0 && (
                <div className="resources-list">
                    {resources.map((resource, index) => (
                        <div key={index} className="resource-item">
                            <a 
                                href={resource} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="resource-link"
                            >
                                 {resource}
                            </a>
                        </div>
                    ))}
                </div>
            )}

            {hasLoaded && resources.length === 0 && (
                <div className="no-resources">
                    Ресурсы для этой технологии пока не добавлены в базу знаний
                </div>
            )}

            {!hasLoaded && !loading && (
                <div className="resources-hint">
                    Нажмите "Загрузить ресурсы" чтобы получить полезные ссылки для изучения
                </div>
            )}
        </div>
    );
}

export default TechnologyResources;