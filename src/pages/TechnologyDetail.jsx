import { useParams, Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './TechnologyDetail.css';
import useTechnologies from '../hooks/useTechnologies';
import { 
    Typography, 
    Box, 
    Button, 
    TextField, 
    Paper, 
    CircularProgress, 
    Alert,
    Chip,
    Tooltip
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import InfoIcon from '@mui/icons-material/Info';

function TechnologyDetail() {
    const { techId } = useParams();
    const navigate = useNavigate();
    const { 
        technologies, 
        loading, 
        updateStatus, 
        updateNotes, 
        deleteTechnology 
    } = useTechnologies();
    
    const [technology, setTechnology] = useState(null);
    const [notes, setNotes] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!loading) {
            const tech = technologies.find(t => t.id === parseInt(techId));
            if (tech) {
                setTechnology(tech);
                setNotes(tech.notes || '');
            }
            setIsLoading(false);
        }
    }, [techId, technologies, loading]);

    const handleUpdateStatus = (newStatus) => {
        if (technology) {
            updateStatus(technology.id, newStatus);
            setTechnology(prev => prev ? { ...prev, status: newStatus } : null);
        }
    };

    const handleUpdateNotes = () => {
        if (technology) {
            updateNotes(technology.id, notes);
            alert('Заметки сохранены!');
        }
    };

    const handleDelete = () => {
        if (window.confirm('Вы уверены, что хотите удалить эту технологию?')) {
            deleteTechnology(parseInt(techId));
            navigate('/');
        }
    };

    if (loading || isLoading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    if (!technology) {
        return (
            <Box sx={{ p: 3 }}>
                <Alert severity="error" sx={{ mb: 2 }}>
                    Технология не найдена
                </Alert>
                <Button component={Link} to="/" variant="contained">
                    ← Назад к списку
                </Button>
            </Box>
        );
    }

    const getStatusText = (status) => {
        switch (status) {
            case 'completed': return 'Изучено';
            case 'in-progress': return 'В процессе';
            case 'not-started': return 'Не начато';
            default: return status;
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'completed': return 'success';
            case 'in-progress': return 'warning';
            case 'not-started': return 'error';
            default: return 'default';
        }
    };

    const isCustomTechnology = technology.customData?.isCustom || technology.source === 'custom';

    return (
        <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3, gap: 2 }}>
                <Button 
                    component={Link} 
                    to="/" 
                    variant="outlined"
                    sx={{ alignSelf: 'flex-start' }}
                >
                    ← Назад к списку
                </Button>
                
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 2, flex: 1 }}>
                    {isCustomTechnology && (
                        <Chip 
                            icon={<EditIcon />}
                            label="Моя технология"
                            color="primary"
                            variant="outlined"
                            size="small"
                        />
                    )}
                    
                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                        {!isCustomTechnology && (
                            <Alert 
                                severity="info" 
                                icon={<InfoIcon />}
                                sx={{ 
                                    mb: 0,
                                    '& .MuiAlert-message': {
                                        fontSize: '0.875rem'
                                    }
                                }}
                            >
                                <Typography variant="caption" sx={{ fontWeight: 600 }}>
                                    Редактирование ограничено
                                </Typography>
                                <Typography variant="caption" component="div" sx={{ display: 'block' }}>
                                    Изменить и удалить можно только технологии, добавленные вручную
                                </Typography>
                            </Alert>
                        )}
                        
                        <Tooltip title={isCustomTechnology ? "Редактировать технологию" : "Доступно только для добавленных технологий"}>
                            <span>
                                <Button 
                                    component={Link}
                                    to={`/technology/${techId}/edit`}
                                    variant="contained"
                                    color="primary"
                                    startIcon={<EditIcon />}
                                    disabled={!isCustomTechnology}
                                    sx={{ minWidth: '140px' }}
                                >
                                    Редактировать
                                </Button>
                            </span>
                        </Tooltip>
                        
                        <Tooltip title={isCustomTechnology ? "Удалить технологию" : "Доступно только для добавленных технологий"}>
                            <span>
                                <Button 
                                    onClick={handleDelete}
                                    variant="outlined"
                                    color="error"
                                    startIcon={<DeleteIcon />}
                                    disabled={!isCustomTechnology}
                                    sx={{ minWidth: '140px' }}
                                >
                                    Удалить
                                </Button>
                            </span>
                        </Tooltip>
                    </Box>
                </Box>
            </Box>

            <Typography variant="h4" component="h1" gutterBottom>
                {technology.title}
                {!isCustomTechnology && (
                    <Chip 
                        label="Из API"
                        size="small"
                        color="default"
                        variant="outlined"
                        sx={{ ml: 2, fontSize: '0.75rem' }}
                    />
                )}
            </Typography>

            <Paper sx={{ p: 3, mb: 3, position: 'relative' }}>
                {!isCustomTechnology && (
                    <Box
                        sx={{
                            position: 'absolute',
                            top: 16,
                            right: 16,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                            bgcolor: 'info.light',
                            color: 'info.dark',
                            px: 2,
                            py: 0.5,
                            borderRadius: 1,
                            fontSize: '0.75rem'
                        }}
                    >
                        <InfoIcon fontSize="small" />
                        Только для просмотра
                    </Box>
                )}

                <Typography variant="h6" gutterBottom>
                    Описание
                </Typography>
                <Typography variant="body1" paragraph>
                    {technology.description}
                </Typography>

                <Box sx={{ display: 'flex', gap: 3, mb: 3, flexWrap: 'wrap' }}>
                    <Box>
                        <Typography variant="subtitle2" color="textSecondary">
                            Категория
                        </Typography>
                        <Typography variant="body1">
                            {technology.category === 'frontend' ? 'Фронтенд' : 
                             technology.category === 'backend' ? 'Бэкенд' :
                             technology.category === 'database' ? 'Базы данных' :
                             technology.category === 'infrastructure' ? 'Инфраструктура' : 'Другое'}
                        </Typography>
                    </Box>
                    
                    <Box>
                        <Typography variant="subtitle2" color="textSecondary">
                            Сложность
                        </Typography>
                        <Typography variant="body1">
                            {technology.difficulty === 'beginner' ? 'Начинающий' : 
                             technology.difficulty === 'intermediate' ? 'Средний' : 
                             'Продвинутый'}
                        </Typography>
                    </Box>
                    
                    <Box>
                        <Typography variant="subtitle2" color="textSecondary">
                            Статус
                        </Typography>
                        <Chip 
                            label={getStatusText(technology.status)}
                            color={getStatusColor(technology.status)}
                            size="small"
                        />
                    </Box>
                </Box>

                <Box sx={{ mb: 3 }}>
                    <Typography variant="h6" gutterBottom>
                        Изменить статус изучения
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        <Button
                            variant={technology.status === 'not-started' ? 'contained' : 'outlined'}
                            color="error"
                            onClick={() => handleUpdateStatus('not-started')}
                            size="small"
                        >
                            Не начато
                        </Button>
                        <Button
                            variant={technology.status === 'in-progress' ? 'contained' : 'outlined'}
                            color="warning"
                            onClick={() => handleUpdateStatus('in-progress')}
                            size="small"
                        >
                            В процессе
                        </Button>
                        <Button
                            variant={technology.status === 'completed' ? 'contained' : 'outlined'}
                            color="success"
                            onClick={() => handleUpdateStatus('completed')}
                            size="small"
                        >
                            Завершено
                        </Button>
                    </Box>
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                        Статус можно изменять для любой технологии
                    </Typography>
                </Box>

                <Box>
                    <Typography variant="h6" gutterBottom>
                        Ресурсы
                    </Typography>
                    {technology.resources && technology.resources.length > 0 ? (
                        <Box component="ul" sx={{ pl: 2, m: 0 }}>
                            {technology.resources.map((resource, index) => (
                                <Box component="li" key={index} sx={{ mb: 1 }}>
                                    <a 
                                        href={resource.url} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        style={{ textDecoration: 'none', color: 'primary.main' }}
                                    >
                                        {resource.title || resource.url}
                                    </a>
                                    {resource.type && (
                                        <Chip 
                                            label={resource.type}
                                            size="small"
                                            sx={{ ml: 1, fontSize: '0.75rem' }}
                                        />
                                    )}
                                </Box>
                            ))}
                        </Box>
                    ) : (
                        <Typography variant="body2" color="textSecondary">
                            Ресурсы не добавлены
                        </Typography>
                    )}
                </Box>
            </Paper>

            <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                    Мои заметки
                </Typography>
                <TextField
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Записывайте сюда важные моменты по изучению технологии..."
                    multiline
                    rows={6}
                    fullWidth
                    variant="outlined"
                    sx={{ mb: 2 }}
                    InputProps={{
                        readOnly: !isCustomTechnology
                    }}
                />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Button 
                        onClick={handleUpdateNotes}
                        variant="contained"
                        color="primary"
                        disabled={!isCustomTechnology}
                    >
                        Сохранить заметки
                    </Button>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        {notes.length > 0 ? `Символов: ${notes.length}` : 'Добавьте заметки по изучению'}
                    </Typography>
                </Box>
                {!isCustomTechnology && (
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                        Заметки можно добавлять только к своим технологиям
                    </Typography>
                )}
            </Paper>

            <Paper sx={{ p: 3, mt: 3 }}>
                <Typography variant="h6" gutterBottom>
                    Информация о технологии
                </Typography>
                <Box sx={{ 
                    display: 'grid', 
                    gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(auto-fit, minmax(200px, 1fr))' }, 
                    gap: 3 
                }}>
                    <Box>
                        <Typography variant="subtitle2" color="textSecondary">
                            ID
                        </Typography>
                        <Typography variant="body1" fontFamily="monospace">
                            {technology.id}
                        </Typography>
                    </Box>
                    <Box>
                        <Typography variant="subtitle2" color="textSecondary">
                            Создано
                        </Typography>
                        <Typography variant="body1">
                            {new Date(technology.createdAt).toLocaleDateString('ru-RU', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })}
                        </Typography>
                    </Box>
                    {technology.updatedAt && (
                        <Box>
                            <Typography variant="subtitle2" color="textSecondary">
                                Обновлено
                            </Typography>
                            <Typography variant="body1">
                                {new Date(technology.updatedAt).toLocaleDateString('ru-RU', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </Typography>
                        </Box>
                    )}
                    <Box>
                        <Typography variant="subtitle2" color="textSecondary">
                            Тип
                        </Typography>
                        {isCustomTechnology ? (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Chip 
                                    label="Пользовательская"
                                    color="primary"
                                    size="small"
                                    variant="outlined"
                                />
                                <Typography variant="body2" color="primary">
                                    Доступно для редактирования
                                </Typography>
                            </Box>
                        ) : (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Chip 
                                    label="Из внешнего источника"
                                    color="default"
                                    size="small"
                                    variant="outlined"
                                />
                                <Typography variant="body2" color="text.secondary">
                                    Только для просмотра
                                </Typography>
                            </Box>
                        )}
                    </Box>
                </Box>
                
                {!isCustomTechnology && (
                    <Alert 
                        severity="info" 
                        sx={{ mt: 3 }}
                        icon={<InfoIcon />}
                    >
                        <Typography variant="subtitle2" gutterBottom>
                            Ограничения редактирования
                        </Typography>
                        <Typography variant="body2">
                            Эта технология загружена из внешнего источника. Вы можете:
                        </Typography>
                        <ul style={{ marginTop: 8, marginBottom: 8, paddingLeft: 20 }}>
                            <li>Изменять статус изучения</li>
                            <li>Просматривать информацию</li>
                            <li>Использовать ресурсы для изучения</li>
                        </ul>
                        <Typography variant="body2">
                            Для полноценного редактирования добавьте свою технологию через форму добавления.
                        </Typography>
                    </Alert>
                )}
            </Paper>
        </Box>
    );
}

export default TechnologyDetail;