import React, { useState } from 'react';
import {
    AppBar,
    Toolbar,
    IconButton,
    Typography,
    Drawer,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Switch,
    Divider,
    Box,
    Button,
    useMediaQuery
} from '@mui/material';
import {
    Menu as MenuIcon,
    Home as HomeIcon,
    Search as SearchIcon,
    Settings as SettingsIcon,
    BarChart as ChartIcon,
    AddCircle as AddIcon,
    DarkMode as DarkModeIcon,
    LightMode as LightModeIcon,
    Login as LoginIcon,
    Logout as LogoutIcon,
    Person as PersonIcon
} from '@mui/icons-material';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';

function Navigation({ themeMode, onToggleTheme, isLoggedIn, username, onLogout, isDemoMode = false }) {
    const [mobileOpen, setMobileOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const handleAuthClick = () => {
        if (isLoggedIn) {
            onLogout();
            navigate('/login');
        } else {
            navigate('/login');
        }
    };

    const handleLogoClick = () => {
        if (isLoggedIn) {
            navigate('/');
        } else {
            navigate('/login');
        }
    };

    const menuItems = [
        { text: 'Главная', icon: <HomeIcon />, path: '/', showWhenLoggedIn: true },
        { text: 'Добавить технологию', icon: <AddIcon />, path: '/add-technology', showWhenLoggedIn: true },
        { text: 'Статистика', icon: <ChartIcon />, path: '/statistics', showWhenLoggedIn: true },
        { text: 'Настройки', icon: <SettingsIcon />, path: '/settings', showWhenLoggedIn: true },
    ];

    const filteredMenuItems = menuItems.filter(item => 
        !isDemoMode || (isDemoMode && item.path === '/')
    );

    const drawer = (
        <div className="mobile-menu">
            <Box className="mobile-menu-header">
                <Typography className="mobile-menu-title">
                    {isDemoMode ? 'TechTracker (Демо)' : 'TechTracker'}
                </Typography>
                <IconButton onClick={handleDrawerToggle} color="inherit">
                    <MenuIcon />
                </IconButton>
            </Box>
            <Divider className="menu-divider" />
            
            {isLoggedIn && username && (
                <ListItem className="menu-item">
                    <ListItemIcon>
                        <PersonIcon />
                    </ListItemIcon>
                    <ListItemText 
                        primary={isDemoMode ? 'Демо-пользователь' : username} 
                        secondary={isDemoMode ? 'Демо-режим' : ''}
                    />
                </ListItem>
            )}
            
            <Divider className="menu-divider" />
            
            <List>
                {isLoggedIn ? (
                    filteredMenuItems.map((item) => (
                        <ListItem
                            button
                            key={item.text}
                            component={RouterLink}
                            to={item.path}
                            onClick={handleDrawerToggle}
                            className={`menu-item ${location.pathname === item.path ? 'menu-item-active' : ''}`}
                        >
                            <ListItemIcon>{item.icon}</ListItemIcon>
                            <ListItemText primary={item.text} />
                        </ListItem>
                    ))
                ) : (
                    <ListItem
                        button
                        component={RouterLink}
                        to="/login"
                        onClick={handleDrawerToggle}
                        className={`menu-item ${location.pathname === '/login' ? 'menu-item-active' : ''}`}
                    >
                        <ListItemIcon><LoginIcon /></ListItemIcon>
                        <ListItemText primary="Войти" />
                    </ListItem>
                )}
            </List>
            
            <Divider className="menu-divider" />
            
            <ListItem className="menu-item">
                <ListItemIcon>
                    {themeMode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
                </ListItemIcon>
                <ListItemText primary="Тема" />
                <Switch
                    checked={themeMode === 'dark'}
                    onChange={onToggleTheme}
                    color="default"
                />
            </ListItem>
            
            {isLoggedIn && (
                <>
                    <Divider className="menu-divider" />
                    <ListItem 
                        button 
                        className="menu-item"
                        onClick={() => {
                            handleDrawerToggle();
                            handleAuthClick();
                        }}
                    >
                        <ListItemIcon><LogoutIcon /></ListItemIcon>
                        <ListItemText primary="Выйти" />
                    </ListItem>
                </>
            )}
        </div>
    );

    return (
        <>
            <AppBar position="fixed" className="MuiAppBar-root">
                <Toolbar className="MuiToolbar-root">
                    {/* Мобильная навигация (скрыта на десктопе) */}
                    {isMobile ? (
                        <div className="mobile-nav">
                            <IconButton
                                color="inherit"
                                aria-label="open drawer"
                                edge="start"
                                onClick={handleDrawerToggle}
                                className="mobile-menu-button"
                            >
                                <MenuIcon />
                            </IconButton>
                            <Typography 
                                variant="h6" 
                                className="logo-text"
                                onClick={handleLogoClick}
                                sx={{ cursor: 'pointer', flexGrow: 1, textAlign: 'center' }}
                            >
                                {isDemoMode ? 'TechTracker (Демо)' : 'TechTracker'}
                            </Typography>
                            <div className="mobile-nav-icons">
                                <IconButton color="inherit" onClick={onToggleTheme}>
                                    {themeMode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
                                </IconButton>
                            </div>
                        </div>
                    ) : (
                        /* Десктопная навигация (скрыта на мобильных) */
                        <div className="desktop-nav">
                            <div className="logo-container">
                                <Typography 
                                    variant="h6" 
                                    className="logo-text"
                                    onClick={handleLogoClick}
                                    sx={{ cursor: 'pointer' }}
                                >
                                    {isDemoMode ? 'TechTracker (Демо)' : 'TechTracker'}
                                </Typography>
                            </div>
                            <div className="desktop-nav-icons">
                                {isLoggedIn ? (
                                    <>
                                        {filteredMenuItems.map((item) => (
                                            <IconButton
                                                color="inherit"
                                                key={item.text}
                                                component={RouterLink}
                                                to={item.path}
                                                className={`nav-icon-wrapper ${location.pathname === item.path ? 'nav-item-active' : ''}`}
                                                title={item.text}
                                            >
                                                {item.icon}
                                            </IconButton>
                                        ))}
                                        {username && (
                                            <Typography variant="body2" sx={{ mr: 1, color: 'white' }}>
                                                {isDemoMode ? 'Демо' : username}
                                            </Typography>
                                        )}
                                        <IconButton 
                                            color="inherit" 
                                            onClick={onToggleTheme}
                                            className="nav-icon-wrapper"
                                            title={themeMode === 'dark' ? 'Светлая тема' : 'Темная тема'}
                                        >
                                            {themeMode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
                                        </IconButton>
                                        <Button
                                            color="inherit"
                                            onClick={handleAuthClick}
                                            startIcon={<LogoutIcon />}
                                            sx={{ ml: 1 }}
                                        >
                                            Выйти
                                        </Button>
                                    </>
                                ) : (
                                    <>
                                        <IconButton 
                                            color="inherit" 
                                            onClick={onToggleTheme}
                                            className="nav-icon-wrapper"
                                            title={themeMode === 'dark' ? 'Светлая тема' : 'Темная тема'}
                                        >
                                            {themeMode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
                                        </IconButton>
                                        <Button
                                            color="inherit"
                                            onClick={handleAuthClick}
                                            startIcon={<LoginIcon />}
                                        >
                                            Войти
                                        </Button>
                                    </>
                                )}
                            </div>
                        </div>
                    )}
                </Toolbar>
            </AppBar>

            {/* Мобильное меню (Drawer) */}
            <Drawer
                variant="temporary"
                anchor="left"
                open={mobileOpen && isMobile}
                onClose={handleDrawerToggle}
                ModalProps={{
                    keepMounted: true, // Better open performance on mobile
                }}
                sx={{
                    display: { xs: 'block', sm: 'none' },
                    '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 280 },
                }}
            >
                {drawer}
            </Drawer>
            
            {/* Отступ для фиксированной навигации */}
            <Toolbar />
        </>
    );
}

export default Navigation;