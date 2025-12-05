// useTheme.js
import { useState, useEffect, useMemo } from 'react';
import { lightTheme, darkTheme } from '../theme/theme';

const useTheme = () => {
  const [mode, setMode] = useState(() => {
    const saved = localStorage.getItem('themeMode');
    return saved || 'light';
  });

  const [systemPreference, setSystemPreference] = useState(() => {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e) => {
      setSystemPreference(e.matches ? 'dark' : 'light');
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const theme = useMemo(() => {
    const selectedMode = mode === 'auto' ? systemPreference : mode;
    return selectedMode === 'dark' ? darkTheme : lightTheme;
  }, [mode, systemPreference]);

  const toggleTheme = () => {
    setMode(prev => {
      const newMode = prev === 'light' ? 'dark' : 'light';
      localStorage.setItem('themeMode', newMode);
      return newMode;
    });
  };

  const setTheme = (newMode) => {
    setMode(newMode);
    localStorage.setItem('themeMode', newMode);
  };

  useEffect(() => {
    localStorage.setItem('themeMode', mode);
  }, [mode]);

  // Добавляем возможность использовать авто-режим
  const setAutoTheme = () => {
    setMode('auto');
    localStorage.setItem('themeMode', 'auto');
  };

  return {
    theme,
    mode,
    toggleTheme,
    setTheme,
    setAutoTheme,
    systemPreference
  };
};

export default useTheme;