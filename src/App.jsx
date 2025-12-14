import './App.css';
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useLocation } from 'react-router-dom'; 
import { useState, useEffect } from 'react';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
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
import Login from './pages/Login';
import { Box, Container, useMediaQuery, Typography, CircularProgress, Button, Alert } from '@mui/material';
import { useTheme } from './hooks/useTheme';
import './components/Navigation.css';

function HomePage() {
    const {
        technologies,
        loading,
        updateStatus,
        updateNotes,
        markAllAsCompleted,
        resetAllStatuses,
        addTechnology,
        addApiTechnology,
        updateTechnologyResources,
        bulkUpdateStatus,
        updateDeadline,
        calculateDeadlineStatus
    } = useTechnologies();

    const { showSuccess, showError, showInfo, notification, hideNotification } = useNotification();
    const { theme } = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const isTablet = useMediaQuery(theme.breakpoints.down('md'));
    const location = useLocation();

    const [filter, setFilter] = useState('all');
    const [apiSearchResults, setApiSearchResults] = useState(null);
    const [searchState, setSearchState] = useState({ loading: false, error: null });
    const username = localStorage.getItem('username') || '';
    const isDemoMode = localStorage.getItem('isDemoMode') === 'true';

    useEffect(() => {
        console.log('Technologies loaded:', technologies.map(t => ({ 
            id: t.id, 
            title: t.title, 
            deadline: t.deadline 
        })));
    }, [technologies]);

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

    const handleDeadlineChange = (techId, newDeadline) => {
        console.log('App: Saving deadline for', techId, 'value:', newDeadline);
        if (updateDeadline) {
            updateDeadline(techId, newDeadline);
            showSuccess('Дедлайн обновлен!');
        } else {
            console.error('updateDeadline function is not available');
        }
    };

    const handleSearchResults = (results) => {
        setApiSearchResults(results);
        if (results && results.length > 0) {
            showSuccess(`Найдено ${results.length} технологий`);
        } else if (results && results.length === 0) {
            showInfo('Технологии по вашему запросу не найдены');
        }
    };

    const handleSearchStateChange = (state) => {
        setSearchState(state);
        if (state.error) {
            showError(state.error);
        }
    };

    const handleAddFromSearch = (tech) => {
        addApiTechnology(tech);
        showSuccess(`Технология "${tech.title}" добавлена в ваш трекер!`);
    };

    const handleResourcesUpdate = (techId, resources) => {
        updateTechnologyResources(techId, resources);
        showSuccess('Ресурсы технологии обновлены!');
    };

    const technologiesToShow = apiSearchResults || technologies;

    const filteredTechnologies = technologiesToShow.filter(tech => {
        const matchesFilter = filter === 'all' || tech.status === filter;
        return matchesFilter;
    });

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
            {username && (
                <Box sx={{ 
                    textAlign: 'center', 
                    mb: 2, 
                    p: 2, 
                    bgcolor: isDemoMode ? 'warning.main' : 'primary.main',
                    color: 'white',
                    borderRadius: 1
                }}>
                    <Typography variant="h6">
                        {isDemoMode ? 'Демо-режим' : 'Добро пожаловать,'} {username}!
                    </Typography>
                    {isDemoMode && (
                        <Typography variant="body2" sx={{ mt: 1 }}>
                            Все изменения сохраняются локально. Для сохранения данных экспортируйте их в JSON.
                        </Typography>
                    )}
                </Box>
            )}
            
            {!isDemoMode && technologies.length > 0 && <ProgressHeader technologies={technologies} />}
            
            {!isDemoMode && (
                <QuickActions 
                    markAllAsCompleted={handleMarkAllCompleted}
                    resetAllStatuses={handleResetAllStatuses}
                    randomizeNextTechnology={randomizeNextTechnology}
                    technologies={technologies}
                    onBulkUpdate={bulkUpdateStatus}
                />
            )}

            {loading && (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                    <CircularProgress sx={{ mb: 2 }} />
                    <Typography>Загрузка технологий...</Typography>
                </Box>
            )}

            {!loading && (
                <Container maxWidth="xl" sx={{ mt: 2 }}>
                    {isDemoMode && (
                        <Alert severity="info" sx={{ mb: 3 }}>
                            <Typography variant="body2">
                                Вы находитесь в демо-режиме. Для использования всех функций приложения войдите в систему.
                            </Typography>
                        </Alert>
                    )}

                    {!isDemoMode && <DataImportExport />}

                    {!isDemoMode && (
                        <>
                            <TechnologySearch 
                                onSearchResults={handleSearchResults}
                                onSearchStateChange={handleSearchStateChange}
                                userTechnologies={technologies} 
                            />

                            <RoadmapImporter />
                        </>
                    )}
                    
                    {!isDemoMode && apiSearchResults && (
                        <Box className="search-results-info" sx={{ mb: 2 }}>
                            <Box className="api-results-header" sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                                <Typography variant="h6">
                                    Результаты поиска в базе знаний
                                </Typography>
                                <button 
                                    onClick={() => setApiSearchResults(null)}
                                    className="btn btn-secondary"
                                >
                                    ← Вернуться к моим технологиям
                                </button>
                            </Box>
                        </Box>
                    )}
                    
                    {!isDemoMode && searchState.loading && (
                        <Box className="search-loading" sx={{ textAlign: 'center', py: 2 }}>
                            <CircularProgress size={20} sx={{ mr: 2 }} />
                            <Typography>Поиск технологий...</Typography>
                        </Box>
                    )}

                    {!isDemoMode && technologies.length > 0 && (
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
                    )}

                    <main className="technologies-container">
                        <Typography variant="h5" component="h2" sx={{ mb: 2 }}>
                            {isDemoMode ? 'Демо-режим' : apiSearchResults ? 'Найденные технологии' : 'Мои технологии'} 
                            {!isDemoMode && ` (${filteredTechnologies.length})`}
                        </Typography>
                        
                        {isDemoMode ? (
                            <Box sx={{ textAlign: 'center', py: 4 }}>
                                <Typography variant="h6" gutterBottom>
                                    Демо-режим активен
                                </Typography>
                                <Typography variant="body1" sx={{ mb: 3 }}>
                                    В демо-режиме отображается интерфейс главной страницы без карточек технологий.
                                </Typography>
                                
                                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mt: 2, flexWrap: 'wrap' }}>
                                    <Button
                                        variant="contained"
                                        onClick={() => {
                                            localStorage.removeItem('isLoggedIn');
                                            localStorage.removeItem('username');
                                            localStorage.removeItem('isDemoMode');
                                            window.location.href = '/mirea-react/login';
                                        }}
                                    >
                                        Войти в систему
                                    </Button>
                                    
                                    <Button
                                        variant="outlined"
                                        onClick={() => {
                                            const demoTechnologies = [
                                                {
                                                    id: 1,
                                                    title: 'React',
                                                    description: 'Библиотека для создания пользовательских интерфейсов',
                                                    category: 'frontend',
                                                    difficulty: 'beginner',
                                                    status: 'in-progress',
                                                    resources: [],
                                                    notes: '',
                                                    createdAt: new Date().toISOString()
                                                }
                                            ];
                                            
                                            const data = {
                                                technologies: demoTechnologies,
                                                meta: {
                                                    exportedAt: new Date().toISOString(),
                                                    isDemoData: true
                                                }
                                            };
                                            
                                            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
                                            const url = URL.createObjectURL(blob);
                                            const a = document.createElement('a');
                                            a.href = url;
                                            a.download = `tech-tracker-demo-data.json`;
                                            document.body.appendChild(a);
                                            a.click();
                                            document.body.removeChild(a);
                                            URL.revokeObjectURL(url);
                                            
                                            showSuccess('Пример данных скачан!');
                                        }}
                                    >
                                        Скачать пример данных
                                    </Button>
                                </Box>
                            </Box>
                        ) : filteredTechnologies.length > 0 ? (
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
                                            onDeadlineChange={handleDeadlineChange}
                                            calculateDeadlineStatus={calculateDeadlineStatus}
                                        />
                                    </Box>
                                ))}
                            </Box>
                        ) : (
                            <Box className="empty-state" sx={{ textAlign: 'center', py: 4 }}>
                                {!searchState.loading && (
                                    <>
                                        <Typography variant="h6" gutterBottom>
                                            {technologies.length === 0 ? 'Технологии не найдены' : 'Технологии не найдены по текущему фильтру'}
                                        </Typography>
                                        {apiSearchResults ? (
                                            <Typography variant="body1">
                                                Попробуйте изменить поисковый запрос
                                            </Typography>
                                        ) : technologies.length === 0 ? (
                                            <>
                                                <Typography variant="body1" gutterBottom>
                                                    Добавьте технологии вручную или выберите из базы знаний
                                                </Typography>
                                                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mt: 2 }}>
                                                    <Link to="/add-technology" className="btn btn-primary">
                                                        Добавить технологию
                                                    </Link>
                                                    <button 
                                                        onClick={() => {
                                                            handleSearchResults([]);
                                                        }}
                                                        className="btn btn-secondary"
                                                    >
                                                        Найти в базе знаний
                                                    </button>
                                                </Box>
                                            </>
                                        ) : (
                                            <Typography variant="body1">
                                                Попробуйте выбрать другой фильтр
                                            </Typography>
                                        )}
                                    </>
                                )}
                            </Box>
                        )}
                    </main>
                </Container>
            )}

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
    const [isLoggedIn, setIsLoggedIn] = useState(() => {
        return localStorage.getItem('isLoggedIn') === 'true';
    });
    const [username, setUsername] = useState(() => {
        return localStorage.getItem('username') || '';
    });

    const isDemoMode = localStorage.getItem('isDemoMode') === 'true';

    const handleLogin = (user) => {
        setIsLoggedIn(true);
        setUsername(user);
    };

    const handleLogout = () => {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('username');
        localStorage.removeItem('isDemoMode');
        setIsLoggedIn(false);
        setUsername('');
    };

    const ProtectedRoute = ({ children }) => {
        if (!isLoggedIn) {
            return <Navigate to="/login" replace />;
        }
        return children;
    };

    return (
        <MuiThemeProvider theme={theme}>
            <CssBaseline />
            <Router basename="/mirea-react/">
                <div className="App" data-theme={mode}>
                    <Navigation 
                        themeMode={mode}
                        onToggleTheme={toggleTheme}
                        onSetTheme={setTheme}
                        isLoggedIn={isLoggedIn}
                        username={username}
                        onLogout={handleLogout}
                        isDemoMode={isDemoMode}
                    />
                    
                    <header className="App-header">
                        <Typography variant="h3" component="h1" gutterBottom>
                            Трекер изучения технологий
                        </Typography>
                        <Typography variant="h6" component="p" color="textSecondary">
                            Прогресс в изучении React и связанных технологий
                        </Typography>
                    </header>

                    <Routes>
                        <Route path="/login" element={<Login onLogin={handleLogin} />} />
                        
                        <Route path="/" element={
                            <ProtectedRoute>
                                <HomePage />
                            </ProtectedRoute>
                        } />
                        
                        {!isDemoMode && (
                            <>
                                <Route path="/technology/:techId" element={
                                    <ProtectedRoute>
                                        <TechnologyDetail />
                                    </ProtectedRoute>
                                } />
                                <Route path="/technology/:techId/edit" element={
                                    <ProtectedRoute>
                                        <EditTechnology />
                                    </ProtectedRoute>
                                } />
                                <Route path="/add-technology" element={
                                    <ProtectedRoute>
                                        <AddTechnology />
                                    </ProtectedRoute>
                                } />
                                <Route path="/statistics" element={
                                    <ProtectedRoute>
                                        <Statistics />
                                    </ProtectedRoute>
                                } />
                                <Route path="/settings" element={
                                    <ProtectedRoute>
                                        <Settings />
                                    </ProtectedRoute>
                                } />
                            </>
                        )}
                        
                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </div>
            </Router>
        </MuiThemeProvider>
    );
}

export default App;