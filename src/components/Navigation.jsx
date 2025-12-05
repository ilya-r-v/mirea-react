import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
    AppBar, 
    Toolbar, 
    Typography, 
    Box, 
    IconButton,
    useMediaQuery,
    Switch,
    FormControlLabel,
    Drawer,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Divider,
    Stack
} from '@mui/material';
import {
    Brightness4 as DarkIcon,
    Brightness7 as LightIcon,
    Menu as MenuIcon,
    Close as CloseIcon,
    Home as HomeIcon,
    Add as AddIcon,
    Analytics as AnalyticsIcon,
    Settings as SettingsIcon
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { useState } from 'react';
import './Navigation.css';

function Navigation({ themeMode, onToggleTheme, onSetTheme }) {
    const location = useLocation();
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [drawerOpen, setDrawerOpen] = useState(false);

    const navItems = [
        { path: '/', label: 'Главная', icon: <HomeIcon /> },
        { path: '/add-technology', label: 'Добавить', icon: <AddIcon /> },
        { path: '/statistics', label: 'Статистика', icon: <AnalyticsIcon /> },
        { path: '/settings', label: 'Настройки', icon: <SettingsIcon /> }
    ];

    const toggleDrawer = (open) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }
        setDrawerOpen(open);
    };

    const isActive = (path) => {
        return location.pathname === path;
    };

    const handleNavigation = (path) => {
        navigate(path);
        setDrawerOpen(false);
    };

    return (
        <>
            <AppBar 
                position="static" 
                sx={{ 
                    backgroundColor: '#000000',
                    boxShadow: 'none',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                    mb: 4
                }}
            >
                <Toolbar sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    minHeight: '72px',
                    px: { xs: 2, md: 4 }
                }}>
                    {/* Логотип */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Typography 
                            variant="h6" 
                            component={Link}
                            to="/"
                            sx={{ 
                                textDecoration: 'none',
                                color: '#ffffff',
                                fontWeight: '700',
                                fontSize: '1.5rem',
                                letterSpacing: '-0.5px',
                                '&:hover': {
                                    color: '#f0f0f0'
                                }
                            }}
                        >
                            TechTracker
                        </Typography>
                        
                        {/* Десктопная навигация */}
                        <Stack 
                            direction="row" 
                            spacing={1}
                            sx={{ 
                                display: { xs: 'none', md: 'flex' },
                                ml: 4
                            }}
                        >
                            {navItems.map((item) => (
                                <IconButton
                                    key={item.path}
                                    component={Link}
                                    to={item.path}
                                    sx={{
                                        color: isActive(item.path) ? '#ffffff' : 'rgba(255, 255, 255, 0.7)',
                                        backgroundColor: isActive(item.path) ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                                        borderRadius: '12px',
                                        padding: '10px 16px',
                                        minWidth: 'auto',
                                        '&:hover': {
                                            backgroundColor: 'rgba(255, 255, 255, 0.15)',
                                            color: '#ffffff'
                                        },
                                        transition: 'all 0.2s ease',
                                        position: 'relative',
                                        overflow: 'hidden'
                                    }}
                                >
                                    <Box sx={{ 
                                        display: 'flex', 
                                        flexDirection: 'column', 
                                        alignItems: 'center',
                                        gap: 0.5
                                    }}>
                                        <Box sx={{ fontSize: '1.2rem' }}>
                                            {item.icon}
                                        </Box>
                                        <Typography variant="caption" sx={{ 
                                            fontSize: '0.75rem',
                                            fontWeight: isActive(item.path) ? '600' : '400',
                                            lineHeight: 1
                                        }}>
                                            {item.label}
                                        </Typography>
                                    </Box>
                                    
                                    {isActive(item.path) && (
                                        <Box
                                            sx={{
                                                position: 'absolute',
                                                bottom: 0,
                                                left: '50%',
                                                transform: 'translateX(-50%)',
                                                width: '20px',
                                                height: '3px',
                                                backgroundColor: '#ffffff',
                                                borderRadius: '3px 3px 0 0'
                                            }}
                                        />
                                    )}
                                </IconButton>
                            ))}
                        </Stack>
                    </Box>

                    {/* Правая часть: тема и мобильное меню */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        {/* Переключатель темы */}
                        <Box sx={{ 
                            display: 'flex', 
                            alignItems: 'center',
                            gap: 1,
                            backgroundColor: 'rgba(255, 255, 255, 0.05)',
                            padding: '4px 12px',
                            borderRadius: '20px',
                            border: '1px solid rgba(255, 255, 255, 0.1)'
                        }}>
                            <LightIcon sx={{ 
                                color: themeMode === 'light' ? '#ffffff' : 'rgba(255, 255, 255, 0.5)',
                                fontSize: '1.2rem'
                            }} />
                            <Switch
                                size="small"
                                checked={themeMode === 'dark'}
                                onChange={onToggleTheme}
                                sx={{
                                    '& .MuiSwitch-track': {
                                        backgroundColor: 'rgba(255, 255, 255, 0.2)'
                                    },
                                    '& .MuiSwitch-thumb': {
                                        backgroundColor: '#ffffff'
                                    }
                                }}
                            />
                            <DarkIcon sx={{ 
                                color: themeMode === 'dark' ? '#ffffff' : 'rgba(255, 255, 255, 0.5)',
                                fontSize: '1.2rem'
                            }} />
                        </Box>

                        {/* Кнопка меню для мобильных */}
                        {isMobile && (
                            <IconButton
                                color="inherit"
                                onClick={toggleDrawer(true)}
                                sx={{
                                    color: '#ffffff',
                                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                    '&:hover': {
                                        backgroundColor: 'rgba(255, 255, 255, 0.2)'
                                    }
                                }}
                            >
                                <MenuIcon />
                            </IconButton>
                        )}
                    </Box>
                </Toolbar>
            </AppBar>

            {/* Мобильное меню в виде Drawer */}
            <Drawer
                anchor="right"
                open={drawerOpen}
                onClose={toggleDrawer(false)}
                PaperProps={{
                    sx: {
                        backgroundColor: '#000000',
                        color: '#ffffff',
                        width: 280,
                        borderLeft: '1px solid rgba(255, 255, 255, 0.1)'
                    }
                }}
            >
                <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    p: 3,
                    borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
                }}>
                    <Typography variant="h6" sx={{ fontWeight: '700' }}>
                        Меню
                    </Typography>
                    <IconButton 
                        onClick={toggleDrawer(false)}
                        sx={{ color: '#ffffff' }}
                    >
                        <CloseIcon />
                    </IconButton>
                </Box>

                <List sx={{ px: 2 }}>
                    {navItems.map((item) => (
                        <ListItem
                            key={item.path}
                            onClick={() => handleNavigation(item.path)}
                            sx={{
                                borderRadius: '12px',
                                mb: 1,
                                backgroundColor: isActive(item.path) ? 'rgba(255, 255, 255, 0.15)' : 'transparent',
                                '&:hover': {
                                    backgroundColor: 'rgba(255, 255, 255, 0.1)'
                                },
                                transition: 'all 0.2s ease'
                            }}
                        >
                            <ListItemIcon sx={{ 
                                color: isActive(item.path) ? '#ffffff' : 'rgba(255, 255, 255, 0.7)',
                                minWidth: 40
                            }}>
                                {item.icon}
                            </ListItemIcon>
                            <ListItemText 
                                primary={item.label}
                                primaryTypographyProps={{
                                    color: isActive(item.path) ? '#ffffff' : 'rgba(255, 255, 255, 0.9)',
                                    fontWeight: isActive(item.path) ? '600' : '400'
                                }}
                            />
                        </ListItem>
                    ))}
                </List>

                <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)', my: 2 }} />

                <Box sx={{ px: 3, py: 2 }}>
                    <Typography variant="body2" sx={{ 
                        color: 'rgba(255, 255, 255, 0.7)',
                        mb: 2
                    }}>
                        Тема интерфейса
                    </Typography>
                    <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                        padding: '12px 16px',
                        borderRadius: '12px'
                    }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            {themeMode === 'light' ? <LightIcon /> : <DarkIcon />}
                            <Typography sx={{ color: '#ffffff' }}>
                                {themeMode === 'dark' ? 'Тёмная тема' : 'Светлая тема'}
                            </Typography>
                        </Box>
                        <Switch
                            checked={themeMode === 'dark'}
                            onChange={onToggleTheme}
                            sx={{
                                '& .MuiSwitch-track': {
                                    backgroundColor: 'rgba(255, 255, 255, 0.2)'
                                },
                                '& .MuiSwitch-thumb': {
                                    backgroundColor: '#ffffff'
                                }
                            }}
                        />
                    </Box>
                </Box>
            </Drawer>
        </>
    );
}

export default Navigation;