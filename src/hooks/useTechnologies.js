import { useState, useEffect, useCallback } from 'react';

function useTechnologies() {
    const [technologies, setTechnologies] = useState([]);
    const [apiTechnologies, setApiTechnologies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [apiLoading, setApiLoading] = useState(true);

    const isDemoMode = localStorage.getItem('isDemoMode') === 'true';

    const getUsername = useCallback(() => {
        if (isDemoMode) {
            return 'demo_user';
        }
        return localStorage.getItem('username') || 'guest';
    }, [isDemoMode]);

    const getStorageKey = useCallback(() => {
        const username = getUsername();
        return `techTracker_technologies_${username}`;
    }, [getUsername]);

    useEffect(() => {
        if (isDemoMode) {
            setApiLoading(false);
            return;
        }

        const loadApiTechnologies = async () => {
            try {
                setApiLoading(true);
                const response = await fetch('/mirea-react/api/technologies.json');
                if (!response.ok) {
                    throw new Error('Ошибка загрузки данных из API');
                }
                const data = await response.json();
                setApiTechnologies(data.technologies || []);
            } catch (error) {
                console.error('Ошибка при загрузке технологий из API:', error);
                setApiTechnologies([
                    {
                        id: 1,
                        title: 'React',
                        description: 'Библиотека для создания пользовательских интерфейсов',
                        category: 'frontend',
                        difficulty: 'beginner',
                        status: 'not-started',
                        resources: [],
                        notes: '',
                        createdAt: new Date().toISOString()
                    },
                    {
                        id: 2,
                        title: 'Node.js',
                        description: 'Среда выполнения JavaScript на сервере',
                        category: 'backend',
                        difficulty: 'intermediate',
                        status: 'not-started',
                        resources: [],
                        notes: '',
                        createdAt: new Date().toISOString()
                    }
                ]);
            } finally {
                setApiLoading(false);
            }
        };

        loadApiTechnologies();
    }, [isDemoMode]);

    useEffect(() => {
        if (apiLoading) return;
        
        if (isDemoMode) {
            setTechnologies([]);
            setLoading(false);
            return;
        }

        const storageKey = getStorageKey();
        const saved = localStorage.getItem(storageKey);
        
        let userTechnologies = [];
        if (saved) {
            try {
                userTechnologies = JSON.parse(saved);
            } catch (error) {
                console.error('Ошибка при загрузке технологий из localStorage:', error);
            }
        }

        const mergedTechnologies = mergeTechnologies(apiTechnologies, userTechnologies);
        setTechnologies(mergedTechnologies);
        setLoading(false);
    }, [getStorageKey, apiTechnologies, apiLoading, isDemoMode]);

    const mergeTechnologies = (apiTechs, userTechs) => {
        const userTechMap = new Map();
        
        userTechs.forEach(tech => {
            userTechMap.set(tech.id, tech);
        });

        const merged = apiTechs.map(apiTech => {
            const userTech = userTechMap.get(apiTech.id);
            if (userTech) {
                return {
                    ...apiTech,
                    status: userTech.status || apiTech.status,
                    notes: userTech.notes || apiTech.notes,
                    resources: userTech.resources || apiTech.resources,
                    deadline: userTech.deadline || null,
                    updatedAt: userTech.updatedAt || apiTech.updatedAt,
                    ...(userTech.customData || {})
                };
            }
            return { ...apiTech, deadline: null };
        });

        const customTechs = userTechs.filter(tech => 
            !apiTechs.some(apiTech => apiTech.id === tech.id)
        );

        return [...merged, ...customTechs];
    };

    const saveTechnologies = useCallback((techArray) => {
        if (isDemoMode) return;
        
        const storageKey = getStorageKey();
        localStorage.setItem(storageKey, JSON.stringify(techArray));
        window.dispatchEvent(new Event('technologiesUpdated'));
    }, [getStorageKey, isDemoMode]);

    const updateTechnologies = useCallback((updater) => {
        if (isDemoMode) return;
        
        setTechnologies(prev => {
            const updated = typeof updater === 'function' ? updater(prev) : updater;
            
            const userTechs = updated.map(tech => {
                const apiTech = apiTechnologies.find(api => api.id === tech.id);
                if (apiTech) {
                    return {
                        id: tech.id,
                        status: tech.status,
                        notes: tech.notes,
                        resources: tech.resources,
                        deadline: tech.deadline || null,
                        updatedAt: tech.updatedAt || new Date().toISOString(),
                        ...(tech.customData || {})
                    };
                }
                return tech;
            }).filter(tech => {
                if (apiTechnologies.find(api => api.id === tech.id)) {
                    return tech.status !== 'not-started' || 
                        tech.notes || 
                        (tech.resources && tech.resources.length > 0) ||
                        tech.deadline ||
                        tech.customData;
                }
                return true;
            });

            saveTechnologies(userTechs);
            console.log('Saved technologies:', userTechs);
            return updated;
        });
    }, [apiTechnologies, saveTechnologies, isDemoMode]);

    useEffect(() => {
        if (isDemoMode) return;
        
        const handleStorageChange = (event) => {
            const storageKey = getStorageKey();
            if (event.key === storageKey) {
                const saved = localStorage.getItem(storageKey);
                if (saved) {
                    try {
                        const userTechs = JSON.parse(saved);
                        const merged = mergeTechnologies(apiTechnologies, userTechs);
                        setTechnologies(merged);
                    } catch (error) {
                        console.error('Ошибка при обработке storage события:', error);
                    }
                }
            }
        };

        const handleCustomEvent = () => {
            const storageKey = getStorageKey();
            const saved = localStorage.getItem(storageKey);
            if (saved) {
                try {
                    const userTechs = JSON.parse(saved);
                    const merged = mergeTechnologies(apiTechnologies, userTechs);
                    setTechnologies(merged);
                } catch (error) {
                    console.error('Ошибка при обработке кастомного события:', error);
                }
            }
        };

        window.addEventListener('storage', handleStorageChange);
        window.addEventListener('technologiesUpdated', handleCustomEvent);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
            window.removeEventListener('technologiesUpdated', handleCustomEvent);
        };
    }, [getStorageKey, apiTechnologies, isDemoMode]);

    // Все функции возвращаем заглушки в демо-режиме
    const demoStub = useCallback((name) => {
        console.log(`${name} called in demo mode`);
        return null;
    }, []);

    if (isDemoMode) {
        return {
            technologies: [],
            loading: false,
            updateStatus: () => demoStub('updateStatus'),
            updateNotes: () => demoStub('updateNotes'),
            updateTechnologyResources: () => demoStub('updateTechnologyResources'),
            addTechnology: () => demoStub('addTechnology'),
            addApiTechnology: () => demoStub('addApiTechnology'),
            updateTechnology: () => demoStub('updateTechnology'),
            deleteTechnology: () => demoStub('deleteTechnology'),
            bulkUpdateStatus: () => demoStub('bulkUpdateStatus'),
            markAllAsCompleted: () => demoStub('markAllAsCompleted'),
            resetAllStatuses: () => demoStub('resetAllStatuses'),
            exportData: () => demoStub('exportData'),
            importData: () => demoStub('importData'),
            clearUserData: () => demoStub('clearUserData'),
            getStatistics: () => ({ total: 0, completed: 0, inProgress: 0, notStarted: 0, completionRate: 0 }),
            updateDeadline: () => demoStub('updateDeadline'),
            calculateDeadlineStatus: () => null,
            apiTechnologies: []
        };
    }

    // Режим обычного пользователя - полный функционал
    const updateStatus = useCallback((id, newStatus) => {
        updateTechnologies(prev => prev.map(tech =>
            tech.id === id ? { 
                ...tech, 
                status: newStatus,
                updatedAt: new Date().toISOString()
            } : tech
        ));
    }, [updateTechnologies]);

    const updateDeadline = useCallback((id, deadline) => {
        console.log('Updating deadline for tech:', id, deadline);
        
        updateTechnologies(prev => prev.map(tech =>
            tech.id === id ? { 
                ...tech, 
                deadline: deadline || null,
                updatedAt: new Date().toISOString(),
                customData: {
                    ...tech.customData,
                    hasDeadline: !!deadline,
                    deadlineSetAt: deadline ? new Date().toISOString() : null
                }
            } : tech
        ));
        
        return deadline;
    }, [updateTechnologies]);

    const calculateDeadlineStatus = (deadline) => {
        if (!deadline) return null;
        
        try {
            const today = new Date();
            const deadlineDate = new Date(deadline);
            
            if (isNaN(deadlineDate.getTime())) {
                return null;
            }
            
            const diffTime = deadlineDate - today;
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            
            if (diffDays < 0) return 'overdue';
            if (diffDays <= 3) return 'urgent';
            if (diffDays <= 7) return 'approaching';
            return 'normal';
        } catch (e) {
            console.error('Ошибка расчета статуса дедлайна:', e);
            return null;
        }
    };

    const updateNotes = useCallback((id, newNotes) => {
        updateTechnologies(prev => prev.map(tech =>
            tech.id === id ? { 
                ...tech, 
                notes: newNotes,
                updatedAt: new Date().toISOString()
            } : tech
        ));
    }, [updateTechnologies]);

    const updateTechnologyResources = useCallback((id, newResources) => {
        updateTechnologies(prev => prev.map(tech =>
            tech.id === id ? { 
                ...tech, 
                resources: newResources,
                updatedAt: new Date().toISOString()
            } : tech
        ));
    }, [updateTechnologies]);

    const addTechnology = useCallback((techData) => {
        const newTechnology = {
            ...techData,
            id: Date.now(),
            status: techData.status || 'not-started',
            notes: techData.notes || '',
            resources: techData.resources || [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            customData: {
                isCustom: true,
                addedBy: getUsername()
            }
        };

        updateTechnologies(prev => [...prev, newTechnology]);
        return newTechnology;
    }, [updateTechnologies, getUsername]);

    const addApiTechnology = useCallback((techData) => {
        const existingTech = technologies.find(t => t.id === techData.id);
        if (existingTech) {
            return existingTech;
        }

        const newTechnology = {
            ...techData,
            status: 'not-started',
            notes: '',
            updatedAt: new Date().toISOString(),
            customData: {
                addedFromApi: true,
                addedAt: new Date().toISOString(),
                addedBy: getUsername()
            }
        };

        updateTechnologies(prev => [...prev, newTechnology]);
        return newTechnology;
    }, [updateTechnologies, technologies, getUsername]);

    const updateTechnology = useCallback((id, updatedTech) => {
        updateTechnologies(prev => prev.map(tech =>
            tech.id === id ? { 
                ...tech, 
                ...updatedTech, 
                updatedAt: new Date().toISOString(),
                customData: {
                    ...tech.customData,
                    ...updatedTech.customData,
                    lastModified: new Date().toISOString()
                }
            } : tech
        ));
    }, [updateTechnologies]);

    const deleteTechnology = useCallback((id) => {
        updateTechnologies(prev => prev.filter(tech => tech.id !== id));
    }, [updateTechnologies]);

    const bulkUpdateStatus = useCallback((ids, newStatus) => {
        updateTechnologies(prev => prev.map(tech =>
            ids.includes(tech.id) ? { 
                ...tech, 
                status: newStatus,
                updatedAt: new Date().toISOString()
            } : tech
        ));
    }, [updateTechnologies]);

    const markAllAsCompleted = useCallback(() => {
        updateTechnologies(prev => prev.map(tech => ({ 
            ...tech, 
            status: 'completed',
            updatedAt: new Date().toISOString()
        })));
    }, [updateTechnologies]);

    const resetAllStatuses = useCallback(() => {
        updateTechnologies(prev => prev.map(tech => ({ 
            ...tech, 
            status: 'not-started',
            updatedAt: new Date().toISOString()
        })));
    }, [updateTechnologies]);

    const exportData = useCallback(() => {
        const username = getUsername();
        const data = {
            technologies,
            meta: {
                exportedAt: new Date().toISOString(),
                username: username,
                count: technologies.length
            }
        };
        return JSON.stringify(data, null, 2);
    }, [technologies, getUsername]);

    const importData = useCallback((importedData) => {
        try {
            const parsed = typeof importedData === 'string' ? 
                JSON.parse(importedData) : importedData;
            
            if (parsed.technologies && Array.isArray(parsed.technologies)) {
                const newTechnologies = parsed.technologies.map(tech => ({
                    ...tech,
                    id: tech.id || Date.now() + Math.random(),
                    updatedAt: new Date().toISOString(),
                    customData: {
                        ...tech.customData,
                        imported: true,
                        importedAt: new Date().toISOString(),
                        importedBy: getUsername()
                    }
                }));
                
                updateTechnologies(prev => [...prev, ...newTechnologies]);
                return { success: true, count: newTechnologies.length };
            }
            return { success: false, message: 'Неверный формат данных' };
        } catch (error) {
            console.error('Ошибка при импорте данных:', error);
            return { success: false, message: 'Ошибка при импорте данных' };
        }
    }, [updateTechnologies, getUsername]);

    const clearUserData = useCallback(() => {
        saveTechnologies([]);
        const merged = mergeTechnologies(apiTechnologies, []);
        setTechnologies(merged);
    }, [apiTechnologies, saveTechnologies]);

    const getStatistics = useCallback(() => {
        const total = technologies.length;
        const completed = technologies.filter(t => t.status === 'completed').length;
        const inProgress = technologies.filter(t => t.status === 'in-progress').length;
        const notStarted = technologies.filter(t => t.status === 'not-started').length;
        
        return {
            total,
            completed,
            inProgress,
            notStarted,
            completionRate: total > 0 ? Math.round((completed / total) * 100) : 0
        };
    }, [technologies]);

    return {
        technologies,
        loading: loading || apiLoading,
        updateStatus,
        updateNotes,
        updateTechnologyResources,
        addTechnology,
        addApiTechnology,
        updateTechnology,
        deleteTechnology,
        bulkUpdateStatus,
        markAllAsCompleted,
        resetAllStatuses,
        exportData,
        importData,
        clearUserData,
        getStatistics,
        updateDeadline,
        calculateDeadlineStatus,
        apiTechnologies
    };
}

export default useTechnologies;