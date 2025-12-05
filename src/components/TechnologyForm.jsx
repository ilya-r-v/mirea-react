import { useState, useEffect, useCallback } from 'react';
import './TechnologyForm.css';

const isValidUrl = (string) => {
  try {
    new URL(string);
    return true;
  } catch (_) {
    console.log(_);
    return false;
  }
};

function TechnologyForm({ onSave, onCancel, initialData = {} }) {
    const [formData, setFormData] = useState({
        title: initialData.title || '',
        description: initialData.description || '',
        category: initialData.category || 'frontend',
        difficulty: initialData.difficulty || 'beginner',
        deadline: initialData.deadline || '',
        resources: initialData.resources || [''],
        status: initialData.status || 'not-started'
    });

    const [errors, setErrors] = useState({});
    const [isFormValid, setIsFormValid] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);

    const validateForm = useCallback(() => {
        const newErrors = {};

        // Валидация названия
        if (!formData.title.trim()) {
            newErrors.title = 'Название технологии обязательно';
        } else if (formData.title.trim().length < 2) {
            newErrors.title = 'Название должно содержать минимум 2 символа';
        } else if (formData.title.trim().length > 50) {
            newErrors.title = 'Название не должно превышать 50 символов';
        }

        // Валидация описания
        if (!formData.description.trim()) {
            newErrors.description = 'Описание технологии обязательно';
        } else if (formData.description.trim().length < 10) {
            newErrors.description = 'Описание должно содержать минимум 10 символов';
        }

        // Валидация дедлайна
        if (formData.deadline) {
            const deadlineDate = new Date(formData.deadline);
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            if (deadlineDate < today) {
                newErrors.deadline = 'Дедлайн не может быть в прошлом';
            }
        }

        // Валидация URL ресурсов
        formData.resources.forEach((resource, index) => {
            if (resource && resource.trim() !== '' && !isValidUrl(resource)) {
                newErrors[`resource_${index}`] = 'Введите корректный URL';
            }
        });

        setErrors(newErrors);
        setIsFormValid(Object.keys(newErrors).length === 0);
    }, [formData]);

    // Используем useEffect с правильными зависимостями
    useEffect(() => {
        validateForm();
    }, [validateForm]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleResourceChange = (index, value) => {
        const newResources = [...formData.resources];
        newResources[index] = value;
        setFormData(prev => ({
            ...prev,
            resources: newResources
        }));
    };

    const addResourceField = () => {
        setFormData(prev => ({
            ...prev,
            resources: [...prev.resources, '']
        }));
    };

    const removeResourceField = (index) => {
        if (formData.resources.length > 1) {
            const newResources = formData.resources.filter((_, i) => i !== index);
            setFormData(prev => ({
                ...prev,
                resources: newResources
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!isFormValid) return;

        setIsSubmitting(true);

        try {
            // Очищаем пустые ресурсы перед сохранением
            const cleanedData = {
                ...formData,
                resources: formData.resources.filter(resource => resource.trim() !== '')
            };

            await onSave(cleanedData);
            setSubmitSuccess(true);
            
            setTimeout(() => {
                setSubmitSuccess(false);
            }, 3000);
        } catch (error) {
            console.error('Ошибка сохранения:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="technology-form" noValidate>
            {/* Область для скринридера */}
            <div
                role="status"
                aria-live="polite"
                aria-atomic="true"
                className="sr-only"
            >
                {isSubmitting && 'Отправка формы...'}
                {submitSuccess && 'Технология успешно сохранена!'}
            </div>

            <h2>{initialData.title ? 'Редактирование технологии' : 'Добавление новой технологии'}</h2>

            {/* Визуальное сообщение об успехе */}
            {submitSuccess && (
                <div className="success-message" role="alert">
                    Технология успешно сохранена!
                </div>
            )}

            {/* Поле названия */}
            <div className="form-group">
                <label htmlFor="title" className="required">
                    Название технологии
                </label>
                <input
                    id="title"
                    name="title"
                    type="text"
                    value={formData.title}
                    onChange={handleChange}
                    className={errors.title ? 'error' : ''}
                    placeholder="Например: React, Node.js, TypeScript"
                    aria-required="true"
                    aria-invalid={!!errors.title}
                    aria-describedby={errors.title ? 'title-error' : undefined}
                    required
                />
                {errors.title && (
                    <span id="title-error" className="error-message" role="alert">
                        {errors.title}
                    </span>
                )}
            </div>

            {/* Поле описания */}
            <div className="form-group">
                <label htmlFor="description" className="required">
                    Описание
                </label>
                <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="4"
                    className={errors.description ? 'error' : ''}
                    placeholder="Опишите, что это за технология и зачем её изучать..."
                    aria-required="true"
                    aria-invalid={!!errors.description}
                    aria-describedby={errors.description ? 'description-error' : undefined}
                    required
                />
                {errors.description && (
                    <span id="description-error" className="error-message" role="alert">
                        {errors.description}
                    </span>
                )}
            </div>

            <div className="form-row">
                {/* Выбор категории */}
                <div className="form-group">
                    <label htmlFor="category">Категория</label>
                    <select
                        id="category"
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                    >
                        <option value="frontend">Frontend</option>
                        <option value="backend">Backend</option>
                        <option value="database">База данных</option>
                        <option value="devops">DevOps</option>
                        <option value="other">Другое</option>
                    </select>
                </div>

                {/* Выбор сложности */}
                <div className="form-group">
                    <label htmlFor="difficulty">Сложность</label>
                    <select
                        id="difficulty"
                        name="difficulty"
                        value={formData.difficulty}
                        onChange={handleChange}
                    >
                        <option value="beginner">Начальный</option>
                        <option value="intermediate">Средний</option>
                        <option value="advanced">Продвинутый</option>
                    </select>
                </div>

                {/* Выбор статуса */}
                <div className="form-group">
                    <label htmlFor="status">Статус изучения</label>
                    <select
                        id="status"
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                    >
                        <option value="not-started">Не начато</option>
                        <option value="in-progress">В процессе</option>
                        <option value="completed">Завершено</option>
                    </select>
                </div>
            </div>

            {/* Дедлайн */}
            <div className="form-group">
                <label htmlFor="deadline">Дедлайн (необязательно)</label>
                <input
                    id="deadline"
                    name="deadline"
                    type="date"
                    value={formData.deadline}
                    onChange={handleChange}
                    className={errors.deadline ? 'error' : ''}
                    aria-invalid={!!errors.deadline}
                    aria-describedby={errors.deadline ? 'deadline-error' : undefined}
                />
                {errors.deadline && (
                    <span id="deadline-error" className="error-message" role="alert">
                        {errors.deadline}
                    </span>
                )}
            </div>

            {/* Список ресурсов для изучения */}
            <div className="form-group">
                <label>Ресурсы для изучения</label>
                {formData.resources.map((resource, index) => (
                    <div key={index} className="resource-field">
                        <input
                            type="url"
                            value={resource}
                            onChange={(e) => handleResourceChange(index, e.target.value)}
                            placeholder="https://example.com"
                            className={errors[`resource_${index}`] ? 'error' : ''}
                            aria-invalid={!!errors[`resource_${index}`]}
                            aria-describedby={errors[`resource_${index}`] ? `resource-${index}-error` : undefined}
                        />
                        {formData.resources.length > 1 && (
                            <button
                                type="button"
                                onClick={() => removeResourceField(index)}
                                className="btn-remove"
                                aria-label={`Удалить ресурс ${index + 1}`}
                            >
                                ✕
                            </button>
                        )}
                        {errors[`resource_${index}`] && (
                            <span id={`resource-${index}-error`} className="error-message" role="alert">
                                {errors[`resource_${index}`]}
                            </span>
                        )}
                    </div>
                ))}
                <button
                    type="button"
                    onClick={addResourceField}
                    className="btn-add-resource"
                >
                    + Добавить ресурс
                </button>
            </div>

            {/* Кнопки действий */}
            <div className="form-actions">
                <button
                    type="submit"
                    className="btn-primary"
                    disabled={!isFormValid || isSubmitting}
                    aria-busy={isSubmitting}
                >
                    {isSubmitting ? 'Сохранение...' : 'Сохранить'}
                </button>
                <button
                    type="button"
                    onClick={onCancel}
                    className="btn-secondary"
                >
                    Отмена
                </button>
            </div>
        </form>
    );
}

export default TechnologyForm;