import { useState, useEffect } from 'react';

function useTechnologies() {
    const [technologies, setTechnologies] = useState(() => {
        const saved = localStorage.getItem('technologies');
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        const handleStorageChange = (event) => {
            if (event.key === 'technologies') {
                const saved = localStorage.getItem('technologies');
                if (saved) {
                    requestAnimationFrame(() => {
                        setTechnologies(JSON.parse(saved));
                    });
                }
            }
        };

        const handleCustomEvent = () => {
            const saved = localStorage.getItem('technologies');
            if (saved) {
                requestAnimationFrame(() => {
                    setTechnologies(JSON.parse(saved));
                });
            }
        };

        window.addEventListener('storage', handleStorageChange);
        window.addEventListener('technologiesUpdated', handleCustomEvent);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
            window.removeEventListener('technologiesUpdated', handleCustomEvent);
        };
    }, []);

    const updateStatus = (id, newStatus) => {
        const updated = technologies.map(tech =>
            tech.id === id ? { ...tech, status: newStatus } : tech
        );
        setTechnologies(updated);
        localStorage.setItem('technologies', JSON.stringify(updated));
        window.dispatchEvent(new Event('technologiesUpdated'));
    };

    const updateNotes = (id, newNotes) => {
        const updated = technologies.map(tech =>
            tech.id === id ? { ...tech, notes: newNotes } : tech
        );
        setTechnologies(updated);
        localStorage.setItem('technologies', JSON.stringify(updated));
        window.dispatchEvent(new Event('technologiesUpdated'));
    };

    const updateTechnologyResources = (id, newResources) => {
        const updated = technologies.map(tech =>
            tech.id === id ? { ...tech, resources: newResources } : tech
        );
        setTechnologies(updated);
        localStorage.setItem('technologies', JSON.stringify(updated));
        window.dispatchEvent(new Event('technologiesUpdated'));
    };

    const addTechnology = (techData) => {
        const newTechnology = {
            ...techData,
            id: Date.now(),
            status: techData.status || 'not-started',
            notes: techData.notes || '',
            resources: techData.resources || [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        const updated = [...technologies, newTechnology];
        setTechnologies(updated);
        localStorage.setItem('technologies', JSON.stringify(updated));
        window.dispatchEvent(new Event('technologiesUpdated'));
        
        return newTechnology;
    };

    const updateTechnology = (id, updatedTech) => {
        const updated = technologies.map(tech =>
            tech.id === id ? { ...tech, ...updatedTech, updatedAt: new Date().toISOString() } : tech
        );
        setTechnologies(updated);
        localStorage.setItem('technologies', JSON.stringify(updated));
        window.dispatchEvent(new Event('technologiesUpdated'));
    };

    const deleteTechnology = (id) => {
        const updated = technologies.filter(tech => tech.id !== id);
        setTechnologies(updated);
        localStorage.setItem('technologies', JSON.stringify(updated));
        window.dispatchEvent(new Event('technologiesUpdated'));
    };

    const bulkUpdateStatus = (ids, newStatus) => {
        const updated = technologies.map(tech =>
            ids.includes(tech.id) ? { ...tech, status: newStatus } : tech
        );
        setTechnologies(updated);
        localStorage.setItem('technologies', JSON.stringify(updated));
        window.dispatchEvent(new Event('technologiesUpdated'));
    };

    const markAllAsCompleted = () => {
        const updated = technologies.map(tech => ({ ...tech, status: 'completed' }));
        setTechnologies(updated);
        localStorage.setItem('technologies', JSON.stringify(updated));
        window.dispatchEvent(new Event('technologiesUpdated'));
    };

    const resetAllStatuses = () => {
        const updated = technologies.map(tech => ({ ...tech, status: 'not-started' }));
        setTechnologies(updated);
        localStorage.setItem('technologies', JSON.stringify(updated));
        window.dispatchEvent(new Event('technologiesUpdated'));
    };

    return {
        technologies,
        updateStatus,
        updateNotes,
        updateTechnologyResources,
        addTechnology,
        updateTechnology,
        deleteTechnology,
        bulkUpdateStatus,
        markAllAsCompleted,
        resetAllStatuses
    };
}

export default useTechnologies;