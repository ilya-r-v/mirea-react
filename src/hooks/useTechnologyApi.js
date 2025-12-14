import { useState, useCallback } from 'react';

const mockTechnologies = [
  {
    id: 1,
    title: 'React',
    description: 'Библиотека для создания пользовательских интерфейсов',
    category: 'frontend',
    status: 'not-started',
    difficulty: 'beginner',
    resources: ['https://react.dev', 'https://ru.reactjs.org'],
    notes: '',
    createdAt: new Date().toISOString()
  },
  {
    id: 2,
    title: 'Node.js',
    description: 'Среда выполнения JavaScript на сервере',
    category: 'backend',
    status: 'not-started',
    difficulty: 'intermediate',
    resources: ['https://nodejs.org', 'https://nodejs.org/ru/docs/'],
    notes: '',
    createdAt: new Date().toISOString()
  },
  {
    id: 3,
    title: 'TypeScript',
    description: 'Типизированное надмножество JavaScript',
    category: 'frontend',
    status: 'not-started',
    difficulty: 'intermediate',
    resources: ['https://www.typescriptlang.org'],
    notes: '',
    createdAt: new Date().toISOString()
  },
  {
    id: 4,
    title: 'MongoDB',
    description: 'Документоориентированная система управления базами данных',
    category: 'backend',
    status: 'not-started',
    difficulty: 'intermediate',
    resources: ['https://www.mongodb.com'],
    notes: '',
    createdAt: new Date().toISOString()
  }
];

// Имитация API вызовов с задержкой
const simulateApiCall = (data, delay = 1000) => 
  new Promise((resolve, reject) => {
    setTimeout(() => {
      // Случайная ошибка для имитации (10% chance)
      if (Math.random() < 0.1) {
        reject(new Error('Ошибка сервера'));
      } else {
        resolve(data);
      }
    }, delay);
  });

function useTechnologyApi() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Загрузка технологий из API
  const fetchTechnologies = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const technologies = await simulateApiCall(mockTechnologies);
      return technologies;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Поиск технологий
  const searchTechnologies = useCallback(async (query) => {
    setLoading(true);
    setError(null);
    try {
      await simulateApiCall(null, 300);
      
      if (!query.trim()) {
        return mockTechnologies;
      }

      const filtered = mockTechnologies.filter(tech =>
        tech.title.toLowerCase().includes(query.toLowerCase()) ||
        tech.description.toLowerCase().includes(query.toLowerCase()) ||
        tech.category.toLowerCase().includes(query.toLowerCase())
      );
      
      return filtered;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchTechnologyResources = useCallback(async (techId) => {
    setLoading(true);
    setError(null);
    try {
      const tech = mockTechnologies.find(t => t.id === techId);
      if (tech) {
        const resources = await simulateApiCall(tech.resources, 500);
        return resources;
      } else {
        throw new Error('Технология не найдена');
      }
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
}, []);

  // Загрузка дорожной карты
  const fetchRoadmap = useCallback(async (roadmapType = 'frontend') => {
    setLoading(true);
    setError(null);
    try {
      const roadmapData = {
        frontend: mockTechnologies.filter(tech => tech.category === 'frontend'),
        backend: mockTechnologies.filter(tech => tech.category === 'backend'),
        fullstack: mockTechnologies
      };

      const roadmap = await simulateApiCall(roadmapData[roadmapType] || roadmapData.fullstack);
      return roadmap;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Рекомендации технологий на основе истории пользователя
  const getRecommendations = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // В реальном API здесь был бы анализ истории пользователя
      // Пока возвращаем случайные технологии
      const shuffled = [...mockTechnologies].sort(() => 0.5 - Math.random());
      const recommendations = shuffled.slice(0, 3);
      await simulateApiCall(null, 800);
      return recommendations;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Получение популярных технологий
  const getPopularTechnologies = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // В реальном API здесь была бы статистика популярности
      const popular = [...mockTechnologies]
        .sort((a, b) => b.id - a.id)
        .slice(0, 5);
      await simulateApiCall(null, 600);
      return popular;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    fetchTechnologies,
    searchTechnologies,
    fetchTechnologyResources,
    fetchRoadmap,
    getRecommendations,
    getPopularTechnologies
  };
}

export default useTechnologyApi;