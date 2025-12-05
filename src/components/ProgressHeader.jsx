import ProgressBar from './ProgressBar';
import './ProgressHeader.css';

function ProgressHeader({ technologies }) {
    const total = technologies.length;
    const completed = technologies.filter(tech => tech.status === 'completed').length;
    const inProgress = technologies.filter(tech => tech.status === 'in-progress').length;
    const notStarted = technologies.filter(tech => tech.status === 'not-started').length;
    
    // Расчет процентов для графика распределения
    const completedPercent = total > 0 ? (completed / total) * 100 : 0;
    const inProgressPercent = total > 0 ? (inProgress / total) * 100 : 0;
    const notStartedPercent = total > 0 ? (notStarted / total) * 100 : 0;
    
    // Расчет высоты столбцов графика (максимальная высота 120px)
    const maxBarHeight = 120;
    const completedHeight = maxBarHeight * (completedPercent / 100);
    const inProgressHeight = maxBarHeight * (inProgressPercent / 100);
    const notStartedHeight = maxBarHeight * (notStartedPercent / 100);

    return (
        <div className="progress-header">
            <h2>Детальная статистика прогресса</h2>
            
            <div className="progress-content">
                <div className="progress-grid">
                    {/* Левая колонка - Статистика */}
                    <div className="progress-stats-wrapper">
                        <div className="progress-stats">
                            <div className="stat-item">
                                <span className="stat-number">{total}</span>
                                <span className="stat-label">Всего технологий</span>
                            </div>
                            <div className="stat-item">
                                <span className="stat-number">{completed}</span>
                                <span className="stat-label">Изучено</span>
                            </div>
                            <div className="stat-item">
                                <span className="stat-number">{inProgress}</span>
                                <span className="stat-label">В процессе</span>
                            </div>
                            <div className="stat-item">
                                <span className="stat-number">{notStarted}</span>
                                <span className="stat-label">Не начато</span>
                            </div>
                        </div>
                        
                        {/* Дополнительный график распределения */}
                        <div className="distribution-chart">
                            <h4>Распределение по статусам</h4>
                            <div className="chart-bars">
                                <div className="chart-bar" style={{ height: `${completedHeight}px`, background: 'linear-gradient(180deg, #10b981, #34d399)' }}>
                                    <div className="chart-bar-label">Изучено</div>
                                </div>
                                <div className="chart-bar" style={{ height: `${inProgressHeight}px`, background: 'linear-gradient(180deg, #f59e0b, #fbbf24)' }}>
                                    <div className="chart-bar-label">В процессе</div>
                                </div>
                                <div className="chart-bar" style={{ height: `${notStartedHeight}px`, background: 'linear-gradient(180deg, #6b7280, #9ca3af)' }}>
                                    <div className="chart-bar-label">Не начато</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    {/* Правая колонка - Прогресс-бары */}
                    <div className="progress-bars-section">
                        <h3>Прогресс по категориям</h3>
                        
                        <div className="category-progress">
                            <ProgressBar
                                progress={calculateCategoryProgress(technologies, 'frontend')}
                                label="Фронтенд разработка"
                                color="#4CAF50"
                                showPercentage={true}
                                height={18}
                            />
                        </div>
                        
                        <div className="category-progress">
                            <ProgressBar
                                progress={calculateCategoryProgress(technologies, 'backend')}
                                label="Бэкенд разработка"
                                color="#FF9800"
                                showPercentage={true}
                                height={18}
                            />
                        </div>
                        
                        {/* Добавьте дополнительные категории по необходимости */}
                        <div className="category-progress">
                            <ProgressBar
                                progress={calculateCategoryProgress(technologies, 'database')}
                                label="Базы данных"
                                color="#3B82F6"
                                showPercentage={true}
                                height={18}
                            />
                        </div>
                        
                        <div className="category-progress">
                            <ProgressBar
                                progress={calculateCategoryProgress(technologies, 'infrastructure')}
                                label="Инфраструктура"
                                color="#8B5CF6"
                                showPercentage={true}
                                height={18}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function calculateCategoryProgress(technologies, category) {
    const categoryTechs = technologies.filter(tech => tech.category === category);
    if (categoryTechs.length === 0) return 0;
    const completed = categoryTechs.filter(tech => tech.status === 'completed').length;
    return Math.round((completed / categoryTechs.length) * 100);
}

export default ProgressHeader;