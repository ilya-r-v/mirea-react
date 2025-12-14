import { useState, useEffect, useCallback } from 'react';

function useLocalStorage(key, initialValue, useUserPrefix = false) {
    const [storedValue, setStoredValue] = useState(initialValue);
    const [isInitialized, setIsInitialized] = useState(false);

    // Получаем имя пользователя из localStorage
    const getUsername = useCallback(() => {
        return localStorage.getItem('username') || 'guest';
    }, []);

    // Генерация полного ключа
    const getFullKey = useCallback(() => {
        if (useUserPrefix) {
            const username = getUsername();
            return `techTracker_${username}_${key}`;
        }
        return key;
    }, [key, useUserPrefix, getUsername]);

    // Загрузка значения
    const loadValue = useCallback(() => {
        try {
            const fullKey = getFullKey();
            const item = localStorage.getItem(fullKey);
            
            if (item) {
                try {
                    const parsed = JSON.parse(item);
                    setStoredValue(parsed);
                } catch (parseError) {
                    // Если не JSON, возвращаем как строку
                    setStoredValue(item);
                }
            } else {
                setStoredValue(initialValue);
            }
        } catch (error) {
            console.error(`Ошибка загрузки из localStorage: ${key}`, error);
            setStoredValue(initialValue);
        }
    }, [getFullKey, initialValue, key]);

    // Загрузка при инициализации
    useEffect(() => {
        if (!isInitialized) {
            loadValue();
            setIsInitialized(true);
        }
    }, [isInitialized, loadValue]);

    // Обновление при изменении пользователя
    useEffect(() => {
        if (isInitialized) {
            loadValue();
        }
    }, [isInitialized, loadValue]);

    // Мониторинг изменений localStorage для других вкладок
    useEffect(() => {
        const handleStorageChange = (event) => {
            if (event.key === getFullKey()) {
                loadValue();
            }
        };

        window.addEventListener('storage', handleStorageChange);
        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, [getFullKey, loadValue]);

    // Сохранение значения
    const setValue = useCallback((value) => {
        try {
            const fullKey = getFullKey();
            const valueToStore = value instanceof Function ? value(storedValue) : value;
            
            setStoredValue(valueToStore);
            
            if (valueToStore === undefined || valueToStore === null) {
                localStorage.removeItem(fullKey);
            } else if (typeof valueToStore === 'string') {
                localStorage.setItem(fullKey, valueToStore);
            } else {
                localStorage.setItem(fullKey, JSON.stringify(valueToStore));
            }
            
            // Триггерим событие для других компонентов в той же вкладке
            window.dispatchEvent(new StorageEvent('storage', {
                key: fullKey,
                newValue: typeof valueToStore === 'string' ? valueToStore : JSON.stringify(valueToStore)
            }));
        } catch (error) {
            console.error(`Ошибка записи в localStorage: ${key}`, error);
        }
    }, [getFullKey, storedValue, key]);

    // Удаление значения
    const removeValue = useCallback(() => {
        try {
            const fullKey = getFullKey();
            localStorage.removeItem(fullKey);
            setStoredValue(initialValue);
            
            // Триггерим событие для других компонентов
            window.dispatchEvent(new StorageEvent('storage', {
                key: fullKey,
                newValue: null
            }));
        } catch (error) {
            console.error(`Ошибка удаления из localStorage: ${key}`, error);
        }
    }, [getFullKey, initialValue, key]);

    // Очистка всех данных текущего пользователя
    const clearUserData = useCallback(() => {
        try {
            const username = getUsername();
            const prefix = `techTracker_${username}_`;
            
            // Удаляем все ключи с префиксом пользователя
            for (let i = 0; i < localStorage.length; i++) {
                const storageKey = localStorage.key(i);
                if (storageKey.startsWith(prefix)) {
                    localStorage.removeItem(storageKey);
                }
            }
            
            setStoredValue(initialValue);
        } catch (error) {
            console.error('Ошибка очистки данных пользователя:', error);
        }
    }, [getUsername, initialValue]);

    // Возвращаем массив как useState
    return [storedValue, setValue, { removeValue, clearUserData, isInitialized }];
}

export default useLocalStorage;