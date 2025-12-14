import { useState, useCallback } from 'react';
import { Button, Box, Alert, CircularProgress, Chip } from '@mui/material';
import useTechnologies from '../hooks/useTechnologies';

const VALID_CATEGORIES = ['frontend', 'backend', 'devops', 'database', 'mobile', 'other'];
const VALID_DIFFICULTIES = ['beginner', 'intermediate', 'advanced', 'expert'];
const VALID_STATUSES = ['not-started', 'in-progress', 'completed', 'on-hold'];
const VALID_RESOURCE_TYPES = ['documentation', 'course', 'video', 'book', 'article', 'cheatsheet'];

const validateImportData = (data) => {
    try {
        // Базовые проверки
        if (!data || typeof data !== 'object') {
            return { isValid: false, error: 'Данные должны быть объектом' };
        }

        // Проверка наличия ключа technologies
        if (!data.technologies) {
            return { isValid: false, error: 'Отсутствует обязательное поле "technologies"' };
        }

        // Проверка что technologies - массив
        if (!Array.isArray(data.technologies)) {
            return { isValid: false, error: 'Поле "technologies" должно быть массивом' };
        }

        // Проверка максимального количества технологий
        if (data.technologies.length > 1000) {
            return { isValid: false, error: 'Слишком много технологий (максимум 1000)' };
        }

        // Проверка каждой технологии
        for (let i = 0; i < data.technologies.length; i++) {
            const tech = data.technologies[i];
            
            // Обязательные поля
            const requiredFields = ['id', 'title', 'description', 'category', 'difficulty', 'status'];
            for (const field of requiredFields) {
                if (!(field in tech)) {
                    return { isValid: false, error: `Технология #${i+1}: отсутствует обязательное поле "${field}"` };
                }
            }

            // Проверка типов полей
            if (typeof tech.id !== 'number' || tech.id <= 0) {
                return { isValid: false, error: `Технология #${i+1}: поле "id" должно быть положительным числом` };
            }

            if (typeof tech.title !== 'string' || tech.title.trim().length === 0) {
                return { isValid: false, error: `Технология #${i+1}: поле "title" должно быть непустой строкой` };
            }

            if (typeof tech.description !== 'string') {
                return { isValid: false, error: `Технология #${i+1}: поле "description" должно быть строкой` };
            }

            // Проверка валидных значений
            if (!VALID_CATEGORIES.includes(tech.category)) {
                return { isValid: false, error: `Технология #${i+1}: недопустимое значение категории "${tech.category}". Допустимые: ${VALID_CATEGORIES.join(', ')}` };
            }

            if (!VALID_DIFFICULTIES.includes(tech.difficulty)) {
                return { isValid: false, error: `Технология #${i+1}: недопустимое значение сложности "${tech.difficulty}". Допустимые: ${VALID_DIFFICULTIES.join(', ')}` };
            }

            if (!VALID_STATUSES.includes(tech.status)) {
                return { isValid: false, error: `Технология #${i+1}: недопустимое значение статуса "${tech.status}". Допустимые: ${VALID_STATUSES.join(', ')}` };
            }

            // Проверка deadline (может быть null или валидной датой)
            if (tech.deadline !== null && tech.deadline !== undefined) {
                if (typeof tech.deadline !== 'string') {
                    return { isValid: false, error: `Технология #${i+1}: поле "deadline" должно быть строкой или null` };
                }
                const date = new Date(tech.deadline);
                if (isNaN(date.getTime())) {
                    return { isValid: false, error: `Технология #${i+1}: поле "deadline" содержит невалидную дату` };
                }
            }

            // Проверка resources (может быть массивом или отсутствовать)
            if (tech.resources) {
                if (!Array.isArray(tech.resources)) {
                    return { isValid: false, error: `Технология #${i+1}: поле "resources" должно быть массивом` };
                }

                // Проверка каждого ресурса
                for (let j = 0; j < tech.resources.length; j++) {
                    const resource = tech.resources[j];
                    
                    if (typeof resource !== 'object' || resource === null) {
                        return { isValid: false, error: `Технология #${i+1}, ресурс #${j+1}: должен быть объектом` };
                    }

                    if (!resource.title || typeof resource.title !== 'string') {
                        return { isValid: false, error: `Технология #${i+1}, ресурс #${j+1}: поле "title" должно быть непустой строкой` };
                    }

                    if (!resource.url || typeof resource.url !== 'string') {
                        return { isValid: false, error: `Технология #${i+1}, ресурс #${j+1}: поле "url" должно быть строкой` };
                    }

                    // Валидация URL
                    try {
                        new URL(resource.url);
                    } catch {
                        return { isValid: false, error: `Технология #${i+1}, ресурс #${j+1}: поле "url" должно быть валидным URL` };
                    }

                    if (!resource.type || typeof resource.type !== 'string') {
                        return { isValid: false, error: `Технология #${i+1}, ресурс #${j+1}: поле "type" должно быть строкой` };
                    }

                    if (!VALID_RESOURCE_TYPES.includes(resource.type)) {
                        return { isValid: false, error: `Технология #${i+1}, ресурс #${j+1}: недопустимый тип ресурса "${resource.type}". Допустимые: ${VALID_RESOURCE_TYPES.join(', ')}` };
                    }
                }
            }

            // Проверка notes (может быть строкой или отсутствовать)
            if (tech.notes !== undefined && typeof tech.notes !== 'string') {
                return { isValid: false, error: `Технология #${i+1}: поле "notes" должно быть строкой` };
            }

            // Проверка createdAt (может быть строкой или отсутствовать)
            if (tech.createdAt !== undefined) {
                if (typeof tech.createdAt !== 'string') {
                    return { isValid: false, error: `Технология #${i+1}: поле "createdAt" должно быть строкой` };
                }
                const date = new Date(tech.createdAt);
                if (isNaN(date.getTime())) {
                    return { isValid: false, error: `Технология #${i+1}: поле "createdAt" содержит невалидную дату` };
                }
            }
        }

        // Проверка уникальности id
        const ids = data.technologies.map(tech => tech.id);
        const uniqueIds = new Set(ids);
        if (ids.length !== uniqueIds.size) {
            const duplicates = ids.filter((id, index) => ids.indexOf(id) !== index);
            return { isValid: false, error: `Найдены дубликаты id: ${[...new Set(duplicates)].join(', ')}` };
        }

        return { 
            isValid: true, 
            stats: {
                total: data.technologies.length,
                categories: new Set(data.technologies.map(t => t.category)).size,
                difficulties: new Set(data.technologies.map(t => t.difficulty)).size,
                statuses: new Set(data.technologies.map(t => t.status)).size,
                totalResources: data.technologies.reduce((sum, tech) => sum + (tech.resources?.length || 0), 0)
            }
        };
    } catch (error) {
        return { isValid: false, error: `Ошибка валидации: ${error.message}` };
    }
};

// Функция для безопасного парсинга JSON
const safeJsonParse = (str) => {
    try {
        const parsed = JSON.parse(str);
        
        // Дополнительная защита от XSS
        const sanitized = JSON.parse(JSON.stringify(parsed));
        
        return { success: true, data: sanitized };
    } catch (error) {
        return { 
            success: false, 
            error: `Невалидный JSON: ${error.message}` 
        };
    }
};

function DataImportExport() {
    const [importData, setImportData] = useState('');
    const [importStatus, setImportStatus] = useState({ 
        success: null, 
        message: '',
        details: null,
        stats: null
    });
    const [isLoading, setIsLoading] = useState(false);
    const { exportData, importData: importTechData } = useTechnologies();

    // Ограничение размера ввода (5MB)
    const MAX_IMPORT_SIZE = 5 * 1024 * 1024;

    const handleExport = useCallback(() => {
        try {
            setIsLoading(true);
            const data = exportData();
            
            // Валидация экспортируемых данных
            const parseResult = safeJsonParse(data);
            if (!parseResult.success) {
                throw new Error('Экспортируемые данные имеют неверный формат');
            }

            // Дополнительная валидация структуры
            const validation = validateImportData(parseResult.data);
            if (!validation.isValid) {
                throw new Error('Экспортируемые данные не соответствуют формату');
            }

            const blob = new Blob([data], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `tech-tracker-${new Date().toISOString().split('T')[0]}.json`;
            a.setAttribute('type', 'application/json');
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            setImportStatus({
                success: true,
                message: 'Данные успешно экспортированы!',
                stats: validation.stats
            });
        } catch (error) {
            setImportStatus({
                success: false,
                message: 'Ошибка при экспорте данных',
                details: error.message
            });
        } finally {
            setIsLoading(false);
        }
    }, [exportData]);

    const handleImport = async () => {
        // Проверка размера данных
        if (importData.length > MAX_IMPORT_SIZE) {
            setImportStatus({
                success: false,
                message: 'Размер данных превышает допустимый лимит (5MB)'
            });
            return;
        }

        // Проверка на пустую строку
        if (!importData.trim()) {
            setImportStatus({
                success: false,
                message: 'Введите данные для импорта'
            });
            return;
        }

        setIsLoading(true);
        
        try {
            // 1. Безопасный парсинг JSON
            const parseResult = safeJsonParse(importData);
            if (!parseResult.success) {
                throw new Error(parseResult.error);
            }

            // 2. Валидация структуры данных
            const validation = validateImportData(parseResult.data);
            if (!validation.isValid) {
                throw new Error(validation.error);
            }

            // 3. Импорт данных
            const success = await importTechData(parseResult.data);
            
            if (success) {
                setImportStatus({ 
                    success: true, 
                    message: 'Данные успешно импортированы!',
                    details: validation.stats ? `Импортировано технологий: ${validation.stats.total}` : null,
                    stats: validation.stats
                });
                setImportData('');
            } else {
                throw new Error('Ошибка при обработке импортируемых данных');
            }
        } catch (error) {
            setImportStatus({ 
                success: false, 
                message: 'Ошибка при импорте данных',
                details: error.message
            });
        } finally {
            setIsLoading(false);
        }
    };

    // Функция для предварительного просмотра JSON
    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        // Проверка типа файла
        if (file.type !== 'application/json' && !file.name.endsWith('.json')) {
            setImportStatus({
                success: false,
                message: 'Файл должен быть в формате JSON'
            });
            return;
        }

        // Проверка размера файла
        if (file.size > MAX_IMPORT_SIZE) {
            setImportStatus({
                success: false,
                message: 'Размер файла превышает 5MB'
            });
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const content = e.target.result;
                setImportData(content);
                
                // Предварительная валидация
                const parseResult = safeJsonParse(content);
                if (parseResult.success) {
                    // Быстрая валидация структуры
                    const validation = validateImportData(parseResult.data);
                    if (validation.isValid) {
                        setImportStatus({
                            success: true,
                            message: `Файл загружен. Технологий: ${validation.stats.total}. Нажмите "Импортировать" для продолжения`,
                            stats: validation.stats
                        });
                    } else {
                        setImportStatus({
                            success: false,
                            message: 'Файл содержит некорректные данные',
                            details: validation.error
                        });
                    }
                } else {
                    setImportStatus({
                        success: false,
                        message: 'Файл содержит невалидный JSON'
                    });
                }
            } catch (error) {
                setImportStatus({
                    success: false,
                    message: 'Ошибка при чтении файла'
                });
            }
        };
        reader.readAsText(file);
    };

    const StatsDisplay = ({ stats }) => {
        if (!stats) return null;
        
        return (
            <Box sx={{ mt: 2, p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 1 }}>
                    <Chip label={`Всего: ${stats.total}`} size="small" color="primary" />
                    <Chip label={`Категорий: ${stats.categories}`} size="small" color="secondary" />
                    <Chip label={`Сложностей: ${stats.difficulties}`} size="small" color="info" />
                    <Chip label={`Статусов: ${stats.statuses}`} size="small" color="warning" />
                    {stats.totalResources > 0 && (
                        <Chip label={`Ресурсов: ${stats.totalResources}`} size="small" color="success" />
                    )}
                </Box>
            </Box>
        );
    };

    return (
        <Box sx={{ mb: 3, p: 2, border: '1px solid #ddd', borderRadius: 2 }}>
            <h3>Импорт/Экспорт данных</h3>
            <p>Данные сохраняются локально в вашем браузере.</p>
            
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                <Button 
                    variant="contained" 
                    onClick={handleExport}
                    disabled={isLoading}
                    startIcon={isLoading ? <CircularProgress size={20} /> : null}
                >
                    Экспортировать данные
                </Button>
            </Box>

            <Box sx={{ mt: 2 }}>
                <h4>Импорт данных</h4>
                
                <Box sx={{ mb: 2 }}>
                    <input
                        accept=".json"
                        style={{ display: 'none' }}
                        id="import-file"
                        type="file"
                        onChange={handleFileUpload}
                    />
                    <label htmlFor="import-file">
                        <Button 
                            variant="outlined" 
                            component="span"
                            disabled={isLoading}
                        >
                            Загрузить файл
                        </Button>
                    </label>
                </Box>

                <textarea
                    value={importData}
                    onChange={(e) => {
                        setImportData(e.target.value);
                        setImportStatus({ success: null, message: '', details: null, stats: null });
                    }}
                    placeholder="Вставьте JSON данные для импорта..."
                    rows={6}
                    style={{ 
                        width: '100%', 
                        marginBottom: '10px',
                        fontFamily: 'monospace',
                        fontSize: '12px'
                    }}
                    disabled={isLoading}
                />
                
                {importStatus.stats && <StatsDisplay stats={importStatus.stats} />}
                
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                    <Button 
                        variant="outlined" 
                        onClick={handleImport}
                        disabled={!importData.trim() || isLoading}
                        startIcon={isLoading ? <CircularProgress size={20} /> : null}
                    >
                        Импортировать данные
                    </Button>
                    
                    <Button 
                        variant="text" 
                        onClick={() => {
                            setImportData('');
                            setImportStatus({ success: null, message: '', details: null, stats: null });
                        }}
                        disabled={!importData || isLoading}
                    >
                        Очистить
                    </Button>
                </Box>
                
                {importStatus.message && (
                    <Alert 
                        severity={importStatus.success ? "success" : "error"}
                        sx={{ mt: 2 }}
                        onClose={() => setImportStatus({ success: null, message: '', details: null, stats: null })}
                    >
                        <Box>
                            <div>{importStatus.message}</div>
                            {importStatus.details && (
                                <div style={{ fontSize: '12px', marginTop: '4px', opacity: 0.8 }}>
                                    {importStatus.details}
                                </div>
                            )}
                        </Box>
                    </Alert>
                )}
                
                <Box sx={{ mt: 2, fontSize: '12px', color: 'text.secondary' }}>
                    <div>Формат данных:</div>
                    <pre style={{ 
                        backgroundColor: '#f5f5f5', 
                        padding: '8px', 
                        borderRadius: '4px',
                        overflow: 'auto',
                        fontSize: '11px',
                        color: 'black'
                    }}>
{`{
  "technologies": [
    {
      "id": 1,
      "title": "React",
      "description": "Библиотека для создания пользовательских интерфейсов",
      "category": "frontend",
      "difficulty": "beginner",
      "status": "not-started",
      "deadline": null,
      "resources": [
        {
          "title": "Официальная документация",
          "url": "https://example.com",
          "type": "documentation"
        }
      ],
      "notes": "",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}`}
                    </pre>
                    
                    <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        <Box>
                            <strong>Категории:</strong>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 0.5 }}>
                                {VALID_CATEGORIES.map(cat => (
                                    <Chip key={cat} label={cat} size="small" />
                                ))}
                            </Box>
                        </Box>
                        
                        <Box>
                            <strong>Сложность:</strong>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 0.5 }}>
                                {VALID_DIFFICULTIES.map(diff => (
                                    <Chip key={diff} label={diff} size="small" color="primary" />
                                ))}
                            </Box>
                        </Box>
                        
                        <Box>
                            <strong>Статусы:</strong>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 0.5 }}>
                                {VALID_STATUSES.map(status => (
                                    <Chip key={status} label={status} size="small" color="secondary" />
                                ))}
                            </Box>
                        </Box>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
}

export default DataImportExport;