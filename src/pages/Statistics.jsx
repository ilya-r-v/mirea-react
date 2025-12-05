import { useState } from 'react';
import { Link } from 'react-router-dom';
import ProgressBar from '../components/ProgressBar';
import './Statistics.css';

const calculateStats = (techData) => {
    if (!techData || techData.length === 0) {
        return {
            total: 0,
            completed: 0,
            inProgress: 0,
            notStarted: 0,
            completionRate: 0,
            byCategory: {}
        };
    }

    const total = techData.length;
    const completed = techData.filter(tech => tech.status === 'completed').length;
    const inProgress = techData.filter(tech => tech.status === 'in-progress').length;
    const notStarted = techData.filter(tech => tech.status === 'not-started').length;
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    // Статистика по категориям
    const byCategory = {};
    techData.forEach(tech => {
        if (!byCategory[tech.category]) {
            byCategory[tech.category] = { total: 0, completed: 0, inProgress: 0, notStarted: 0 };
        }
        byCategory[tech.category].total++;
        byCategory[tech.category][tech.status]++;
    });

    return {
        total,
        completed,
        inProgress,
        notStarted,
        completionRate,
        byCategory
    };
};

function Statistics() {
    const [stats] = useState(() => {
        const saved = localStorage.getItem('technologies');
        if (saved) {
            const techData = JSON.parse(saved);
            return calculateStats(techData);
        }
        return {
            total: 0,
            completed: 0,
            inProgress: 0,
            notStarted: 0,
            completionRate: 0,
            byCategory: {}
        };
    });

    console.log('Статистика:', stats);
    console.log('Прогресс для Изучено:', stats.total ? (stats.completed / stats.total) * 100 : 0);
    console.log('Прогресс для В процессе:', stats.total ? (stats.inProgress / stats.total) * 100 : 0);
    console.log('Прогресс для Не начато:', stats.total ? (stats.notStarted / stats.total) * 100 : 0);

    const getCategoryProgress = (category) => {
        if (!stats.byCategory[category] || stats.byCategory[category].total === 0) return 0;
        return Math.round((stats.byCategory[category].completed / stats.byCategory[category].total) * 100);
    };

    return (
        <div className="statistics-container">
            {/* Заголовок и кнопка назад в одном ряду */}
            <div className="statistics-header">
                <div className="header-content">
                    <h1>Статистика обучения</h1>
                    <p>Отслеживайте ваш прогресс в изучении технологий</p>
                </div>
                <Link to="/" className="back-button">
                    ← Назад к трекеру
                </Link>
            </div>

            {/* Основная сетка с двумя колонками */}
            <div className="statistics-grid">
                {/* Левая колонка */}
                <div className="left-column">
                    {/* Круговая диаграмма прогресса */}
                    <div className="progress-circle-card">
                        <div className="circle-progress">
                            <div className="circle-progress-value">
                                <span className="percentage">{stats.completionRate}%</span>
                                <span className="label">Завершено</span>
                            </div>
                            <svg className="progress-ring" width="160" height="160">
                                <circle
                                    className="progress-ring-circle"
                                    stroke="#4CAF50"
                                    strokeWidth="12"
                                    fill="transparent"
                                    r="70"
                                    cx="80"
                                    cy="80"
                                    style={{
                                        strokeDasharray: `${2 * Math.PI * 70}`,
                                        strokeDashoffset: `${2 * Math.PI * 70 * (1 - stats.completionRate / 100)}`
                                    }}
                                />
                            </svg>
                        </div>
                        <div className="progress-details">
                            <h3>Общий прогресс</h3>
                            <ProgressBar
                                progress={stats.completionRate}
                                label=""
                                color="#4CAF50"
                                animated={true}
                                height={12}
                            />
                            <div className="detail-item">
                                <span className="detail-label">Изучено:</span>
                                <span className="detail-value">{stats.completed} из {stats.total}</span>
                            </div>
                        </div>
                    </div>

                    {/* Распределение по статусам */}
                    <div className="status-card">
                        <h2>Распределение по статусам</h2>
                        <div className="status-bars">
                            <div className="status-bar">
                                <div className="status-info">
                                    <span className="status-dot completed"></span>
                                    <span>Изучено</span>
                                </div>
                                <div className="status-count">{stats.completed}</div>
                                <ProgressBar
                                    progress={stats.total ? (stats.completed / stats.total) * 100 : 0}
                                    height={12}
                                    color="#4CAF50"
                                    showPercentage={false}
                                />
                            </div>
                            <div className="status-bar">
                                <div className="status-info">
                                    <span className="status-dot in-progress"></span>
                                    <span>В процессе</span>
                                </div>
                                <div className="status-count">{stats.inProgress}</div>
                                <ProgressBar
                                    progress={stats.total ? (stats.inProgress / stats.total) * 100 : 0}
                                    height={12}
                                    color="#FF9800"
                                    showPercentage={false}
                                />
                            </div>
                            <div className="status-bar">
                                <div className="status-info">
                                    <span className="status-dot not-started"></span>
                                    <span>Не начато</span>
                                </div>
                                <div className="status-count">{stats.notStarted}</div>
                                <ProgressBar
                                    progress={stats.total ? (stats.notStarted / stats.total) * 100 : 0}
                                    height={12}
                                    color="#F44336"
                                    showPercentage={false}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Правая колонка */}
                <div className="right-column">
                    {/* Карточки статистики */}
                    <div className="stats-cards-grid">
                        <div className="stat-card blue">
                            <div className="stat-icon total-icon"></div>
                            <div className="stat-content">
                                <div className="stat-number">{stats.total}</div>
                                <div className="stat-label">Всего технологий</div>
                            </div>
                        </div>
                        <div className="stat-card green">
                            <div className="stat-icon completed-icon"></div>
                            <div className="stat-content">
                                <div className="stat-number">{stats.completed}</div>
                                <div className="stat-label">Изучено</div>
                            </div>
                        </div>
                        <div className="stat-card orange">
                            <div className="stat-icon progress-icon"></div>
                            <div className="stat-content">
                                <div className="stat-number">{stats.inProgress}</div>
                                <div className="stat-label">В процессе</div>
                            </div>
                        </div>
                        <div className="stat-card red">
                            <div className="stat-icon pending-icon"></div>
                            <div className="stat-content">
                                <div className="stat-number">{stats.notStarted}</div>
                                <div className="stat-label">Не начато</div>
                            </div>
                        </div>
                    </div>

                    {/* Прогресс по категориям */}
                    <div className="category-card">
                        <h2>Прогресс по категориям</h2>
                        <div className="category-progress-list">
                            {Object.keys(stats.byCategory).map(category => (
                                <div key={category} className="category-progress-item">
                                    <div className="category-header">
                                        <div className="category-info">
                                            <span className={`category-icon ${category}`}></span>
                                            <div>
                                                <div className="category-name">
                                                    {category === 'frontend' ? 'Фронтенд' : 'Бэкенд'}
                                                </div>
                                                <div className="category-subtitle">
                                                    {stats.byCategory[category].completed} из {stats.byCategory[category].total}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="category-percentage">
                                            {getCategoryProgress(category)}%
                                        </div>
                                    </div>
                                    <ProgressBar
                                        progress={getCategoryProgress(category)}
                                        height={12}
                                        color={category === 'frontend' ? '#2196F3' : '#FF9800'}
                                        showPercentage={false}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Statistics;