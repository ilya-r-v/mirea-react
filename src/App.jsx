
import './App.css';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'; 
import { useState } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Navigation from './components/Navigation';
import ProgressHeader from './components/ProgressHeader';
import TechnologyCard from './components/TechnologyCard';
import QuickActions from './components/QuickActions';
import TechnologySearch from './components/TechnologySearch';
import useTechnologies from './hooks/useTechnologies';
import Statistics from './pages/Statistics';
import Settings from './pages/Settings';
import TechnologyDetail from './pages/TechnologyDetail';
import AddTechnology from './pages/AddTechnology';
import NotFound from './pages/NotFound';
import RoadmapImporter from './components/RoadmapImporter';
import EditTechnology from './pages/EditTechnology';
import DataImportExport from './components/DataImportExport';

import Notification from './components/Notification';
import useNotification from './hooks/useNotification';
import useTheme from './hooks/useTheme';
import { Box, Container, useMediaQuery } from '@mui/material';

function HomePage() {
    const {
        technologies,
        updateStatus,
        updateNotes,
        markAllAsCompleted,
        resetAllStatuses,
        addTechnology,
        updateTechnologyResources,
        bulkUpdateStatus 
    } = useTechnologies();

    const { showSuccess, showError, showInfo, notification, hideNotification } = useNotification();
    const { theme } = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const isTablet = useMediaQuery(theme.breakpoints.down('md'));

    const [filter, setFilter] = useState('all');
    const [apiSearchResults, setApiSearchResults] = useState(null);
    const [searchState, setSearchState] = useState({ loading: false, error: null });
    const [showBulkEdit, setShowBulkEdit] = useState(false);

    const randomizeNextTechnology = () => {
        const notStarted = technologies.filter(tech => tech.status === 'not-started');
        if (notStarted.length > 0) {
            const randomTech = notStarted[Math.floor(Math.random() * notStarted.length)];
            updateStatus(randomTech.id, 'in-progress');
            showSuccess(`Технология "${randomTech.title}" начата!`);
        } else {
            showInfo('Все технологии уже начаты или завершены!');
        }
    };

    // Функция для обработки результатов поиска из API
    const handleSearchResults = (results) => {
        setApiSearchResults(results);
        if (results && results.length > 0) {
            showSuccess(`Найдено ${results.length} технологий`);
        } else if (results && results.length === 0) {
            showInfo('Технологии по вашему запросу не найдены');
        }
    };

    // Функция для обработки состояния поиска
    const handleSearchStateChange = (state) => {
        setSearchState(state);
        if (state.error) {
            showError(state.error);
        }
    };

    // Функция для добавления технологии из поиска
    const handleAddFromSearch = (tech) => {
        addTechnology(tech);
        showSuccess(`Технология "${tech.title}" добавлена в ваш трекер!`);
    };

    // Функция для обновления ресурсов технологии
    const handleResourcesUpdate = (techId, resources) => {
        updateTechnologyResources(techId, resources);
        showSuccess('Ресурсы технологии обновлены!');
    };

    // Определяем какие технологии показывать
    const technologiesToShow = apiSearchResults || technologies;

    const filteredTechnologies = technologiesToShow.filter(tech => {
        const matchesFilter = filter === 'all' || tech.status === filter;
        return matchesFilter;
    });

    // Функции для быстрых действий с уведомлениями
    const handleMarkAllCompleted = () => {
        markAllAsCompleted();
        showSuccess('Все технологии отмечены как завершенные!');
    };

    const handleResetAllStatuses = () => {
        resetAllStatuses();
        showInfo('Статусы всех технологий сброшены!');
    };

    return (
        <Box sx={{ pb: 2 }}>
            <ProgressHeader technologies={technologies} />
            
            <QuickActions 
                markAllAsCompleted={handleMarkAllCompleted}
                resetAllStatuses={handleResetAllStatuses}
                randomizeNextTechnology={randomizeNextTechnology}
                technologies={technologies}
                onShowBulkEdit={() => setShowBulkEdit(!showBulkEdit)}
                showBulkEdit={showBulkEdit}
                bulkUpdateStatus={bulkUpdateStatus}
            />

            <Container maxWidth="xl" sx={{ mt: 2 }}>
                {/* Компонент импорта/экспорта */}
                <DataImportExport />

                <TechnologySearch 
                    onSearchResults={handleSearchResults}
                    onSearchStateChange={handleSearchStateChange}
                />

                <RoadmapImporter />
                
                {/* Показываем результаты поиска или локальные технологии */}
                <Box className="search-results-info" sx={{ mb: 2 }}>
                    {apiSearchResults && (
                        <Box className="api-results-header" sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                            <h3>Результаты поиска в базе знаний</h3>
                            <button 
                                onClick={() => setApiSearchResults(null)}
                                className="btn btn-secondary"
                            >
                                ← Вернуться к моим технологиям
                            </button>
                        </Box>
                    )}
                    
                    {searchState.loading && (
                        <Box className="search-loading" sx={{ textAlign: 'center', py: 2 }}>
                            Поиск технологий...
                        </Box>
                    )}
                </Box>

                {/* Фильтры с адаптивным дизайном */}
                <Box className="filters" sx={{ 
                    display: 'flex', 
                    gap: 1, 
                    mb: 3,
                    flexWrap: isMobile ? 'wrap' : 'nowrap',
                    justifyContent: isMobile ? 'center' : 'flex-start'
                }}>
                    {['all', 'not-started', 'in-progress', 'completed'].map(filterType => (
                        <button 
                            key={filterType}
                            className={filter === filterType ? 'active' : ''} 
                            onClick={() => setFilter(filterType)}
                            style={{
                                flex: isMobile ? '1 1 calc(50% - 8px)' : 'none',
                                minWidth: isMobile ? '120px' : 'auto'
                            }}
                        >
                            {filterType === 'all' && 'Все'}
                            {filterType === 'not-started' && 'Не начатые'}
                            {filterType === 'in-progress' && 'В процессе'}
                            {filterType === 'completed' && 'Завершенные'}
                        </button>
                    ))}
                </Box>

                <main className="technologies-container">
                    <h2>
                        {apiSearchResults ? 'Найденные технологии' : 'Мои технологии'} 
                        ({filteredTechnologies.length})
                    </h2>
                    
                    <Box className="technologies-grid" sx={{
                        display: 'grid',
                        gridTemplateColumns: isMobile ? '1fr' : isTablet ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)',
                        gap: 2
                    }}>
                        {filteredTechnologies.map(tech => (
                            <Box key={tech.id} className="technology-card-wrapper">
                                <TechnologyCard
                                    technology={tech}
                                    onStatusChange={updateStatus}
                                    onNotesChange={updateNotes}
                                    onResourcesUpdate={handleResourcesUpdate}
                                />
                                {apiSearchResults && (
                                    <button 
                                        onClick={() => handleAddFromSearch(tech)}
                                        className="btn-add-from-search"
                                    >
                                        Добавить в трекер
                                    </button>
                                )}
                            </Box>
                        ))}
                    </Box>

                    {filteredTechnologies.length === 0 && !searchState.loading && (
                        <Box className="empty-state" sx={{ textAlign: 'center', py: 4 }}>
                            <p>Технологии не найдены</p>
                            {apiSearchResults ? (
                                <p>Попробуйте изменить поисковый запрос</p>
                            ) : (
                                <>
                                    <p>Добавьте технологии вручную через страницу "Добавить технологию"</p>
                                    <Link to="/add-technology" className="btn btn-primary">
                                        Добавить технологию
                                    </Link>
                                </>
                            )}
                        </Box>
                    )}
                </main>
            </Container>

            {/* Компонент уведомлений */}
            <Notification
                open={notification.open}
                message={notification.message}
                type={notification.type}
                duration={notification.duration}
                onClose={hideNotification}
                action={notification.action}
            />
        </Box>
    );
}

function App() {
    const { theme, mode, toggleTheme, setTheme } = useTheme();

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Router basename="/mirea-react">
                <div className="App">
                    <Navigation 
                        themeMode={mode}
                        onToggleTheme={toggleTheme}
                        onSetTheme={setTheme}
                    />
                    
                    <header className="App-header">
                        <h1>Трекер изучения технологий</h1>
                        <p>Прогресс в изучении React и связанных технологий</p>
                    </header>

                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/technology/:techId" element={<TechnologyDetail />} />
                        <Route path="/technology/:techId/edit" element={<EditTechnology />} />
                        <Route path="/add-technology" element={<AddTechnology />} />
                        <Route path="/statistics" element={<Statistics />} />
                        <Route path="/settings" element={<Settings />} />
                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </div>
            </Router>
        </ThemeProvider>
    );
}

export default App;
