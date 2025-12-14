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
                const processedResources = processResources(technology.resources);
                setResources(processedResources);
                setShowResources(true);
                setHasLoaded(true);
                setInitialized(true);
            }, 0);

            return () => clearTimeout(timer);
        }
    }, [technology.resources, initialized]);

    // Функция для обработки ресурсов (строки или объекты)
    const processResources = (resourcesArray) => {
        if (!Array.isArray(resourcesArray)) {
            return [];
        }

        return resourcesArray.map(resource => {
            // Если ресурс - строка
            if (typeof resource === 'string') {
                return {
                    title: resource,
                    url: resource,
                    type: 'link'
                };
            }
            // Если ресурс - объект
            else if (resource && typeof resource === 'object') {
                return {
                    title: resource.title || resource.url || 'Безымянный ресурс',
                    url: resource.url || '#',
                    type: resource.type || 'link'
                };
            }
            // Некорректный формат
            return {
                title: 'Некорректный ресурс',
                url: '#',
                type: 'error'
            };
        });
    };

    const handleLoadResources = async () => {
        try {
            const newResources = await fetchTechnologyResources(technology.id);
            
            // Обрабатываем полученные ресурсы
            const processedResources = processResources(newResources);
            
            setTimeout(() => {
                setResources(processedResources);
                setShowResources(true);
                setHasLoaded(true);
            }, 0);
            
            // Обновляем ресурсы в родительском компоненте
            if (onResourcesUpdate) {
                onResourcesUpdate(technology.id, processedResources);
            }
        } catch (err) {
            console.error('Ошибка загрузки ресурсов:', err);
        }
    };

    const handleToggleResources = () => {
        setShowResources(!showResources);
    };

    // Функция для безопасного отображения URL
    const formatUrl = (url) => {
        if (!url || url === '#') return '#';
        return url.startsWith('http') ? url : `https://${url}`;
    };

    return (
        <div className="technology-resources">
            <div className="resources-header">
                <h4>📚 Ресурсы для изучения</h4>
                <div className="resource-actions">
                    {!hasLoaded && (
                        <button 
                            onClick={handleLoadResources}
                            disabled={loading}
                            className="btn-load-resources"
                            style={{
                                padding: '6px 12px',
                                backgroundColor: '#1976d2',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: loading ? 'not-allowed' : 'pointer',
                                fontSize: '14px',
                                opacity: loading ? 0.7 : 1
                            }}
                        >
                            {loading ? '⏳ Загрузка...' : '📥 Загрузить ресурсы'}
                        </button>
                    )}
                    {resources.length > 0 && (
                        <button 
                            onClick={handleToggleResources}
                            className="btn-toggle-resources"
                            style={{
                                padding: '6px 12px',
                                backgroundColor: '#f5f5f5',
                                color: '#333',
                                border: '1px solid #ddd',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                fontSize: '14px',
                                marginLeft: hasLoaded ? '8px' : '0'
                            }}
                        >
                            {showResources ? '▲ Скрыть' : '▼ Показать'}
                        </button>
                    )}
                </div>
            </div>

            {error && (
                <div className="resources-error" style={{
                    color: '#d32f2f',
                    backgroundColor: '#ffebee',
                    padding: '8px',
                    borderRadius: '4px',
                    margin: '10px 0',
                    fontSize: '14px'
                }}>
                    ⚠️ {error}
                </div>
            )}

            {showResources && resources.length > 0 && (
                <div className="resources-list" style={{
                    marginTop: '10px',
                    padding: '10px',
                    backgroundColor: '#f8f9fa',
                    borderRadius: '4px'
                }}>
                    {resources.map((resource, index) => {
                        const formattedUrl = formatUrl(resource.url);
                        
                        return (
                            <div key={index} className="resource-item" style={{
                                marginBottom: '8px',
                                padding: '8px',
                                backgroundColor: 'white',
                                border: '1px solid #e0e0e0',
                                borderRadius: '4px',
                                display: 'flex',
                                alignItems: 'center'
                            }}>
                                <div style={{ flex: 1 }}>
                                    <a 
                                        href={formattedUrl} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="resource-link"
                                        style={{
                                            color: '#1976d2',
                                            textDecoration: 'none',
                                            fontWeight: '500',
                                            display: 'block',
                                            marginBottom: '4px'
                                        }}
                                        onClick={(e) => {
                                            if (formattedUrl === '#') {
                                                e.preventDefault();
                                            }
                                        }}
                                    >
                                        {resource.title}
                                    </a>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <span style={{
                                            fontSize: '12px',
                                            color: '#666',
                                            backgroundColor: '#e8e8e8',
                                            padding: '2px 6px',
                                            borderRadius: '3px'
                                        }}>
                                            {resource.type}
                                        </span>
                                        <span style={{
                                            fontSize: '12px',
                                            color: '#999',
                                            fontFamily: 'monospace'
                                        }}>
                                            {formattedUrl !== '#' && formattedUrl.length > 40 
                                                ? `${formattedUrl.substring(0, 40)}...` 
                                                : formattedUrl}
                                        </span>
                                    </div>
                                </div>
                                {formattedUrl !== '#' && (
                                    <a 
                                        href={formattedUrl} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        style={{
                                            marginLeft: '10px',
                                            padding: '4px 8px',
                                            backgroundColor: '#4caf50',
                                            color: 'white',
                                            textDecoration: 'none',
                                            borderRadius: '4px',
                                            fontSize: '12px',
                                            fontWeight: 'bold'
                                        }}
                                    >
                                        Перейти
                                    </a>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}

            {hasLoaded && resources.length === 0 && (
                <div className="no-resources" style={{
                    padding: '12px',
                    backgroundColor: '#fff3cd',
                    color: '#856404',
                    borderRadius: '4px',
                    marginTop: '10px',
                    fontSize: '14px'
                }}>
                     Ресурсы для этой технологии пока не добавлены в базу знаний
                </div>
            )}

            {!hasLoaded && !loading && (
                <div className="resources-hint" style={{
                    padding: '10px',
                    backgroundColor: '#e8f4fd',
                    color: '#0c5460',
                    borderRadius: '4px',
                    marginTop: '10px',
                    fontSize: '14px'
                }}>
                     Нажмите "Загрузить ресурсы" чтобы получить полезные ссылки для изучения
                </div>
            )}
        </div>
    );
}

export default TechnologyResources;