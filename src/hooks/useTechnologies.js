// hooks/useTechnologies.js
import { useMemo } from 'react';
import useLocalStorage from './useLocalStorage';

// Начальные данные для технологий
const initialTechnologies = [
  {
    id: 1,
    title: 'React Components',
    description: 'Изучение функциональных и классовых компонентов, их жизненного цикла и методов',
    status: 'completed',
    notes: '✅ Изучил основы компонентов. Нужно практиковаться с HOC.',
    category: 'frontend'
  },
  {
    id: 2,
    title: 'JSX Syntax',
    description: 'Освоение синтаксиса JSX, работа с выражениями и условным рендерингом',
    status: 'in-progress',
    notes: '🔄 Разбираюсь с условным рендерингом. Интересная тема!',
    category: 'frontend'
  },
  {
    id: 3,
    title: 'State Management',
    description: 'Работа с состоянием компонентов, использование useState и useEffect хуков',
    status: 'not-started',
    notes: '',
    category: 'frontend'
  },
  {
    id: 4,
    title: 'Node.js Basics',
    description: 'Основы серверного JavaScript, работа с модулями и файловой системой',
    status: 'not-started',
    notes: '',
    category: 'backend'
  },
  {
    id: 5,
    title: 'Express.js Framework',
    description: 'Создание REST API с помощью Express.js, middleware и роутинг',
    status: 'not-started',
    notes: '',
    category: 'backend'
  },
  {
    id: 6,
    title: 'Database Integration',
    description: 'Работа с базами данных, подключение MongoDB или PostgreSQL',
    status: 'not-started',
    notes: '',
    category: 'backend'
  }
];

function useTechnologies() {
  const [technologies, setTechnologies] = useLocalStorage('technologies', initialTechnologies);

  // Функция для обновления статуса технологии
  const updateStatus = (techId, newStatus) => {
    setTechnologies(prev =>
      prev.map(tech =>
        tech.id === techId ? { ...tech, status: newStatus } : tech
      )
    );
  };

  // Функция для обновления заметок
  const updateNotes = (techId, newNotes) => {
    setTechnologies(prev =>
      prev.map(tech =>
        tech.id === techId ? { ...tech, notes: newNotes } : tech
      )
    );
  };

  // Функция для расчета общего прогресса
  const calculateProgress = () => {
    if (technologies.length === 0) return 0;
    const completed = technologies.filter(tech => tech.status === 'completed').length;
    return Math.round((completed / technologies.length) * 100);
  };

  // Функция для отметки всех как выполненных
  const markAllCompleted = () => {
    setTechnologies(prev =>
      prev.map(tech => ({ ...tech, status: 'completed' }))
    );
  };

  // Функция для сброса всех статусов
  const resetAllStatuses = () => {
    setTechnologies(prev =>
      prev.map(tech => ({ ...tech, status: 'not-started' }))
    );
  };

  // Функция для экспорта данных
  const exportData = () => {
    const data = {
      exportedAt: new Date().toISOString(),
      version: '1.0',
      technologies: technologies
    };
    return JSON.stringify(data, null, 2);
  };

  // Функция для получения статистики по категориям
  const getCategoryStats = () => {
    const categories = {};
    technologies.forEach(tech => {
      if (!categories[tech.category]) {
        categories[tech.category] = { total: 0, completed: 0 };
      }
      categories[tech.category].total++;
      if (tech.status === 'completed') {
        categories[tech.category].completed++;
      }
    });
    return categories;
  };

  // Мемоизированные значения для оптимизации
  const progress = useMemo(() => calculateProgress(), [technologies]);
  const categoryStats = useMemo(() => getCategoryStats(), [technologies]);

  return {
    technologies,
    setTechnologies,
    updateStatus,
    updateNotes,
    markAllCompleted,
    resetAllStatuses,
    exportData,
    progress,
    categoryStats
  };
}

export default useTechnologies;