import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useTechnologies from '../hooks/useTechnologies';
import './AddTechnology.css';

function AddTechnology() {
  const navigate = useNavigate();
  const { technologies, addTechnology } = useTechnologies();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'frontend',
    difficulty: 'beginner'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    const newTech = {
      ...formData,
      id: Math.max(...technologies.map(t => t.id), 0) + 1,
      status: 'not-started',
      notes: '',
      deadline: null,
      resources: [],
      createdAt: new Date().toISOString()
    };

    addTechnology(newTech);
    navigate('/');
  };

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="page add-technology">
      <div className="page-header">
        <h1>Добавить технологию</h1>
        <p className="page-subtitle">Добавьте новую технологию для изучения</p>
      </div>

      <form onSubmit={handleSubmit} className="tech-form">
        <div className="form-group">
          <label htmlFor="title">Название технологии *</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            placeholder="Например: React, Node.js, TypeScript..."
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Описание</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="3"
            placeholder="Краткое описание технологии..."
            className="form-control"
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="category">Категория *</label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="form-control"
            >
              <option value="frontend">Frontend</option>
              <option value="backend">Backend</option>
              <option value="database">Базы данных</option>
              <option value="infrastructure">Инфраструктура</option>
              <option value="tools">Инструменты</option>
              <option value="mobile">Мобильная разработка</option>
              <option value="ai">AI/ML</option>
              <option value="other">Другое</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="difficulty">Сложность *</label>
            <select
              id="difficulty"
              name="difficulty"
              value={formData.difficulty}
              onChange={handleChange}
              required
              className="form-control"
            >
              <option value="beginner">Начальный</option>
              <option value="intermediate">Средний</option>
              <option value="advanced">Продвинутый</option>
              <option value="expert">Эксперт</option>
            </select>
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary">
            Добавить технологию
          </button>
          <Link to="/" className="btn btn-secondary">
            Отмена
          </Link>
        </div>
      </form>
    </div>
  );
}

export default AddTechnology;