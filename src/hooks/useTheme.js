import { useState, useEffect, useMemo, useCallback } from 'react';
import { lightTheme, darkTheme } from '../theme/theme';

const useTheme = () => {
    const [mode, setModeState] = useState(() => {
        const saved = localStorage.getItem('themeMode');
        if (saved) return saved;
        
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        return prefersDark ? 'dark' : 'light';
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

    const setMode = useCallback((newMode) => {
        if (typeof newMode === 'function') {
            setModeState(prev => {
                const result = newMode(prev);
                localStorage.setItem('themeMode', result);
                return result;
            });
        } else {
            setModeState(newMode);
            localStorage.setItem('themeMode', newMode);
        }
    }, []);

    const theme = useMemo(() => {
        const selectedMode = mode === 'auto' ? systemPreference : mode;
        return selectedMode === 'dark' ? darkTheme : lightTheme;
    }, [mode, systemPreference]);

    useEffect(() => {
        const selectedMode = mode === 'auto' ? systemPreference : mode;
        document.body.setAttribute('data-theme', selectedMode);
        document.documentElement.setAttribute('data-theme', selectedMode);
    }, [mode, systemPreference]);

    const toggleTheme = useCallback(() => {
        setMode(prev => prev === 'light' ? 'dark' : 'light');
    }, [setMode]);

    const setTheme = useCallback((newMode) => {
        setMode(newMode);
    }, [setMode]);

    const setAutoTheme = useCallback(() => {
        setMode('auto');
    }, [setMode]);

    return {
        theme,
        mode,
        toggleTheme,
        setTheme,
        setAutoTheme,
        systemPreference
    };
};

export {useTheme};