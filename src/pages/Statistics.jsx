import { useState, useEffect, useRef } from 'react';
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

    // Статистика по категориям - исправленные категории
    const byCategory = {};
    techData.forEach(tech => {
        // Используем категорию из данных или 'other' по умолчанию
        const category = tech.category || 'other';
        
        if (!byCategory[category]) {
            byCategory[category] = { total: 0, completed: 0, inProgress: 0, notStarted: 0 };
        }
        byCategory[category].total++;
        
        // Увеличиваем счетчик для соответствующего статуса
        if (tech.status === 'completed') {
            byCategory[category].completed++;
        } else if (tech.status === 'in-progress') {
            byCategory[category].inProgress++;
        } else if (tech.status === 'not-started') {
            byCategory[category].notStarted++;
        }
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
    const [stats, setStats] = useState({
        total: 0,
        completed: 0,
        inProgress: 0,
        notStarted: 0,
        completionRate: 0,
        byCategory: {}
    });

    // Используем useRef для хранения предыдущих данных
    const prevDataRef = useRef(null);

    const loadStatistics = () => {
        const username = localStorage.getItem('username') || 'demo_user';
        const isDemoMode = localStorage.getItem('isDemoMode') === 'true';
        
        let storageKey;
        
        if (isDemoMode) {
            storageKey = 'techTracker_technologies_demo_user';
        } else {
            storageKey = `techTracker_technologies_${username}`;
        }
        
        const saved = localStorage.getItem(storageKey);
        
        if (saved) {
            try {
                const techData = JSON.parse(saved);
                console.log('Загружены данные:', techData);
                
                // Проверяем, изменились ли данные
                if (JSON.stringify(techData) !== JSON.stringify(prevDataRef.current)) {
                    prevDataRef.current = techData;
                    const calculatedStats = calculateStats(techData);
                    console.log('Рассчитанная статистика:', calculatedStats);
                    console.log('Категории в статистике:', calculatedStats.byCategory);
                    setStats(calculatedStats);
                }
            } catch (error) {
                console.error('Ошибка при парсинге данных:', error);
            }
        } else {
            console.log('Данные не найдены по ключу:', storageKey);
            // Если данных нет, сбрасываем статистику
            if (prevDataRef.current !== null) {
                prevDataRef.current = null;
                setStats({
                    total: 0,
                    completed: 0,
                    inProgress: 0,
                    notStarted: 0,
                    completionRate: 0,
                    byCategory: {}
                });
            }
        }
    };

    useEffect(() => {
        // Первоначальная загрузка
        loadStatistics();

        // Функция для проверки изменений в localStorage
        const checkForChanges = () => {
            loadStatistics();
        };

        // Слушаем кастомное событие, которое будет отправляться при изменениях
        const handleTechDataUpdated = () => {
            console.log('Событие techDataUpdated получено');
            loadStatistics();
        };

        // Слушаем изменения в localStorage из других вкладок
        const handleStorageChange = (e) => {
            if (e.key && (e.key.includes('technologies') || e.key.includes('techTracker'))) {
                console.log('Изменения из другой вкладки:', e.key);
                loadStatistics();
            }
        };

        // Подписываемся на события
        window.addEventListener('techDataUpdated', handleTechDataUpdated);
        window.addEventListener('storage', handleStorageChange);

        // Также устанавливаем интервал для периодической проверки
        const intervalId = setInterval(checkForChanges, 1000);

        // Очистка при размонтировании
        return () => {
            window.removeEventListener('techDataUpdated', handleTechDataUpdated);
            window.removeEventListener('storage', handleStorageChange);
            clearInterval(intervalId);
        };
    }, []);

    const getCategoryProgress = (category) => {
        if (!stats.byCategory[category] || stats.byCategory[category].total === 0) return 0;
        return Math.round((stats.byCategory[category].completed / stats.byCategory[category].total) * 100);
    };

    // Функция для получения русского названия категории - исправленная
    const getCategoryName = (category) => {
        const categoryNames = {
            'frontend': 'Фронтенд',
            'backend': 'Бэкенд',
            'devops': 'DevOps',
            'database': 'Базы данных',
            'mobile': 'Мобильная разработка',
            'other': 'Другое'
        };
        return categoryNames[category] || category;
    };

    // Функция для получения иконки категории
    const getCategoryIcon = (category) => {
        const iconClasses = {
            'frontend': 'frontend-icon',
            'backend': 'backend-icon', 
            'devops': 'devops-icon',
            'database': 'database-icon',
            'mobile': 'mobile-icon',
            'other': 'other-icon'
        };
        return iconClasses[category] || 'other-icon';
    };

    // Сортируем категории по прогрессу (сначала с большим прогрессом)
    const sortedCategories = Object.keys(stats.byCategory).sort((a, b) => {
        const progressA = getCategoryProgress(a);
        const progressB = getCategoryProgress(b);
        return progressB - progressA;
    });

    console.log('Текущая статистика:', stats);
    console.log('Отсортированные категории:', sortedCategories);

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
                            {sortedCategories.length > 0 ? (
                                sortedCategories.map(category => {
                                    const categoryData = stats.byCategory[category];
                                    const progress = getCategoryProgress(category);
                                    
                                    return (
                                        <div key={category} className="category-progress-item">
                                            <div className="category-header">
                                                <div className="category-info">
                                                    <span className={`category-icon ${getCategoryIcon(category)}`}></span>
                                                    <div>
                                                        <div className="category-name">
                                                            {getCategoryName(category)}
                                                        </div>
                                                        <div className="category-subtitle">
                                                            {categoryData.completed} из {categoryData.total} изучено
                                                            {categoryData.inProgress > 0 && `, ${categoryData.inProgress} в процессе`}
                                                            {categoryData.notStarted > 0 && `, ${categoryData.notStarted} не начато`}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="category-percentage">
                                                    {progress}%
                                                </div>
                                            </div>
                                            <ProgressBar
                                                progress={progress}
                                                height={12}
                                                color="#2196F3"
                                                showPercentage={false}
                                            />
                                        </div>
                                    );
                                })
                            ) : (
                                <div className="no-categories">
                                    <p>Нет данных по категориям</p>
                                    <p className="hint">Добавьте технологии, чтобы увидеть статистику</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Statistics;