import React from 'react';
import {
  IconButton,
  Tooltip,
  Box,
  useTheme,
  useMediaQuery
} from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import SettingsBrightnessIcon from '@mui/icons-material/SettingsBrightness';
import { useNotification } from './NotificationProvider';
import useTheme from '../hooks/useTheme';

const ThemeToggle = () => {
  const { mode, toggleTheme, setTheme, systemPreference } = useTheme();
  const muiTheme = useTheme();
  const { showNotification } = useNotification();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('sm'));

  const handleThemeChange = (newMode) => {
    const previousMode = mode;
    setTheme(newMode);
    
    const themeNames = {
      light: 'Светлая',
      dark: 'Темная',
      auto: 'Автоматическая'
    };
    
    showNotification({
      title: 'Тема изменена',
      message: `Тема изменена на "${themeNames[newMode]}"`,
      severity: 'info',
      duration: 3000,
      position: { vertical: 'bottom', horizontal: 'right' }
    });
  };

  const handleToggle = () => {
    if (mode === 'auto') {
      handleThemeChange(systemPreference === 'dark' ? 'light' : 'dark');
    } else {
      handleThemeChange(mode === 'light' ? 'dark' : 'light');
    }
  };

  const getThemeIcon = () => {
    if (mode === 'auto') {
      return (
        <Tooltip title="Автоматическая тема (системная)">
          <SettingsBrightnessIcon />
        </Tooltip>
      );
    }
    return mode === 'dark' ? (
      <Tooltip title="Темная тема">
        <Brightness7Icon />
      </Tooltip>
    ) : (
      <Tooltip title="Светлая тема">
        <Brightness4Icon />
      </Tooltip>
    );
  };

  if (isMobile) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <IconButton
          onClick={handleToggle}
          color="inherit"
          sx={{
            p: 1,
            borderRadius: 2,
            bgcolor: 'rgba(255,255,255,0.1)',
            '&:hover': {
              bgcolor: 'rgba(255,255,255,0.2)'
            }
          }}
        >
          {getThemeIcon()}
        </IconButton>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <IconButton
        onClick={() => handleThemeChange('light')}
        color={mode === 'light' ? 'primary' : 'default'}
        sx={{
          p: 1,
          borderRadius: 2,
          bgcolor: mode === 'light' ? 'rgba(63, 81, 181, 0.1)' : 'transparent'
        }}
      >
        <Tooltip title="Светлая тема">
          <Brightness4Icon />
        </Tooltip>
      </IconButton>
      
      <IconButton
        onClick={() => handleThemeChange('auto')}
        color={mode === 'auto' ? 'primary' : 'default'}
        sx={{
          p: 1,
          borderRadius: 2,
          bgcolor: mode === 'auto' ? 'rgba(63, 81, 181, 0.1)' : 'transparent'
        }}
      >
        <Tooltip title="Автоматическая тема">
          <SettingsBrightnessIcon />
        </Tooltip>
      </IconButton>
      
      <IconButton
        onClick={() => handleThemeChange('dark')}
        color={mode === 'dark' ? 'primary' : 'default'}
        sx={{
          p: 1,
          borderRadius: 2,
          bgcolor: mode === 'dark' ? 'rgba(63, 81, 181, 0.1)' : 'transparent'
        }}
      >
        <Tooltip title="Темная тема">
          <Brightness7Icon />
        </Tooltip>
      </IconButton>
    </Box>
  );
};

export default ThemeToggle;