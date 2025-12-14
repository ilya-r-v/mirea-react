import React, { useState } from 'react';
import {
    Container,
    Typography,
    Box,
    Paper,
    Button,
    Alert,
    Divider,
    List,
    ListItem,
    ListItemText,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Tooltip
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import DownloadIcon from '@mui/icons-material/Download';
import InfoIcon from '@mui/icons-material/Info';
import { useNavigate } from 'react-router-dom';

function Settings() {
    const navigate = useNavigate();
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [showExportDialog, setShowExportDialog] = useState(false);
    const [message, setMessage] = useState({ text: '', type: '' });

    const isDemoMode = localStorage.getItem('isDemoMode') === 'true';
    const username = localStorage.getItem('username') || '';

    const handleClearData = () => {
        try {
            // Сохраняем только настройки темы и логина
            const themeMode = localStorage.getItem('themeMode');
            const isLoggedIn = localStorage.getItem('isLoggedIn');
            const storedUsername = localStorage.getItem('username');
            const storedIsDemoMode = localStorage.getItem('isDemoMode');
            
            // Очищаем все данные приложения
            const prefix = 'techTracker_';
            const keysToKeep = ['themeMode', 'isLoggedIn', 'username', 'isDemoMode'];
            
            // Создаем копию localStorage для очистки
            const keys = [];
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key && key.startsWith(prefix)) {
                    keys.push(key);
                }
            }
            
            // Удаляем данные с префиксом
            keys.forEach(key => {
                localStorage.removeItem(key);
            });
            
            // Восстанавливаем важные настройки
            if (themeMode) localStorage.setItem('themeMode', themeMode);
            if (isLoggedIn) localStorage.setItem('isLoggedIn', isLoggedIn);
            if (storedUsername) localStorage.setItem('username', storedUsername);
            if (storedIsDemoMode) localStorage.setItem('isDemoMode', storedIsDemoMode);
            
            setMessage({
                text: 'Все данные успешно очищены! Вы будете перенаправлены на главную страницу через 2 секунды.',
                type: 'success'
            });
            
            // Редирект на главную страницу через 2 секунды
            setTimeout(() => {
                navigate('/');
            }, 2000);
        } catch (error) {
            console.error('Error clearing data:', error);
            setMessage({
                text: 'Ошибка при очистке данных',
                type: 'error'
            });
        }
    };

    const handleExportData = () => {
        try {
            const data = {};
            const prefix = 'techTracker_';
            
            // Собираем все данные приложения
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key && key.startsWith(prefix)) {
                    try {
                        const value = localStorage.getItem(key);
                        data[key] = JSON.parse(value);
                    } catch {
                        data[key] = localStorage.getItem(key);
                    }
                }
            }
            
            // Добавляем метаданные
            const exportData = {
                data: data,
                meta: {
                    exportedAt: new Date().toISOString(),
                    app: 'TechTracker',
                    version: '1.0.0',
                    username: username
                }
            };
            
            const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `tech-tracker-backup-${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            setMessage({
                text: 'Данные успешно экспортированы!',
                type: 'success'
            });
            
            setShowExportDialog(false);
        } catch (error) {
            console.error('Error exporting data:', error);
            setMessage({
                text: 'Ошибка при экспорте данных',
                type: 'error'
            });
        }
    };

    const handleClearDemoData = () => {
        try {
            if (isDemoMode) {
                // Удаляем только демо-данные
                localStorage.removeItem('techTracker_technologies_demo_user');
                localStorage.removeItem('techTracker_demo_data_loaded');
                
                setMessage({
                    text: 'Демо-данные успешно очищены! Вы будете перенаправлены на главную страницу через 2 секунды.',
                    type: 'success'
                });
                
                // Редирект на главную страницу через 2 секунды
                setTimeout(() => {
                    navigate('/');
                }, 2000);
            }
        } catch (error) {
            console.error('Error clearing demo data:', error);
            setMessage({
                text: 'Ошибка при очистке демо-данных',
                type: 'error'
            });
        }
    };

    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            <Typography variant="h3" component="h1" gutterBottom>
                Настройки
            </Typography>

            {isDemoMode && (
                <Alert 
                    severity="warning" 
                    sx={{ mb: 3 }}
                    icon={<InfoIcon />}
                >
                    <Typography variant="body2">
                        Вы находитесь в демо-режиме. Все изменения сохраняются локально.
                    </Typography>
                </Alert>
            )}

            {message.text && (
                <Alert 
                    severity={message.type} 
                    sx={{ mb: 3 }}
                    onClose={() => setMessage({ text: '', type: '' })}
                >
                    {message.text}
                </Alert>
            )}

            {isDemoMode && (
                <Paper sx={{ p: 3, mb: 3 }}>
                    <Typography variant="h5" gutterBottom>
                        Управление демо-данными
                    </Typography>
                    <Box sx={{ mt: 2 }}>
                        <Button
                            variant="contained"
                            color="warning"
                            startIcon={<DeleteIcon />}
                            onClick={handleClearDemoData}
                            sx={{ mr: 2 }}
                        >
                            Очистить демо-данные
                        </Button>
                        <Typography variant="body2" sx={{ mt: 2, color: 'text.secondary' }}>
                            Удаляет все технологии и изменения, сделанные в демо-режиме.
                        </Typography>
                    </Box>
                </Paper>
            )}

            <Paper sx={{ p: 3, mb: 3 }}>
                <Typography variant="h5" gutterBottom>
                    Информация о пользователе
                </Typography>
                
                <Box sx={{ mb: 3 }}>
                    <Typography variant="body1" gutterBottom>
                        <strong>Имя пользователя:</strong> {username}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        Для изменения имени пользователя войдите под другим аккаунтом.
                    </Typography>
                </Box>
            </Paper>

            <Paper sx={{ p: 3, mb: 3 }}>
                <Typography variant="h5" gutterBottom>
                    Управление данными
                </Typography>
                
                <List>
                    <ListItem
                        secondaryAction={
                            <Tooltip title="Экспортировать все данные">
                                <IconButton
                                    edge="end"
                                    onClick={() => setShowExportDialog(true)}
                                    sx={{ color: 'primary.main' }}
                                >
                                    <DownloadIcon />
                                </IconButton>
                            </Tooltip>
                        }
                    >
                        <ListItemText
                            primary="Экспорт всех данных"
                            secondary="Сохраните все ваши технологии и настройки в файл"
                        />
                    </ListItem>
                    
                    <Divider component="li" />
                    
                    <ListItem
                        secondaryAction={
                            <Tooltip title="Осторожно! Это действие нельзя отменить">
                                <IconButton
                                    edge="end"
                                    color="error"
                                    onClick={() => setShowConfirmDialog(true)}
                                >
                                    <DeleteIcon />
                                </IconButton>
                            </Tooltip>
                        }
                    >
                        <ListItemText
                            primary="Очистить все данные"
                            secondary="Удаляет все технологии, настройки и историю"
                        />
                    </ListItem>
                </List>
            </Paper>

            <Paper sx={{ p: 3 }}>
                <Typography variant="h5" gutterBottom>
                    Информация о приложении
                </Typography>
                
                <Box sx={{ mb: 2 }}>
                    <Typography variant="body1" gutterBottom>
                        <strong>Версия:</strong> 1.0.0
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                        <strong>Разработчик:</strong> TechTracker Team
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                        <strong>Лицензия:</strong> MIT
                    </Typography>
                </Box>
                
                {isDemoMode && (
                    <Alert severity="info" sx={{ mt: 2 }}>
                        <Typography variant="body2">
                            <strong>Демо-режим активен</strong> — все данные сохраняются локально в браузере.
                            Для переноса данных используйте функцию экспорта.
                        </Typography>
                    </Alert>
                )}
            </Paper>

            {/* Диалог подтверждения очистки данных */}
            <Dialog
                open={showConfirmDialog}
                onClose={() => setShowConfirmDialog(false)}
            >
                <DialogTitle>Подтверждение очистки данных</DialogTitle>
                <DialogContent>
                    <Typography sx={{ mb: 2 }}>
                        Вы уверены, что хотите очистить все данные приложения?
                        Это действие нельзя отменить. Будут удалены:
                    </Typography>
                    <ul style={{ paddingLeft: '20px', margin: 0 }}>
                        <li>Все технологии</li>
                        <li>Все заметки и ресурсы</li>
                        <li>Вся история изменений</li>
                    </ul>
                    <Alert severity="warning" sx={{ mt: 2 }}>
                        Ваши настройки темы и информация о входе сохранятся.
                    </Alert>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setShowConfirmDialog(false)}>
                        Отмена
                    </Button>
                    <Button 
                        onClick={handleClearData} 
                        color="error"
                        variant="contained"
                    >
                        Очистить все данные
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Диалог экспорта */}
            <Dialog
                open={showExportDialog}
                onClose={() => setShowExportDialog(false)}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>Экспорт данных</DialogTitle>
                <DialogContent>
                    <Typography sx={{ mb: 2 }}>
                        Выберите формат для экспорта всех данных приложения:
                    </Typography>
                    
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                        <Typography variant="body1">
                            <strong>JSON формат</strong> (рекомендуется)
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Сохраняет все данные в структурированном формате JSON для последующего импорта.
                        </Typography>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setShowExportDialog(false)}>
                        Отмена
                    </Button>
                    <Button 
                        onClick={handleExportData} 
                        variant="contained"
                        startIcon={<DownloadIcon />}
                    >
                        Экспортировать
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
}

export default Settings;