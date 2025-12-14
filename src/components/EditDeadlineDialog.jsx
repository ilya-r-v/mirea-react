import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  IconButton,
  FormControl,
  FormHelperText
} from '@mui/material';
import {
  CalendarToday as CalendarTodayIcon,
  Close as CloseIcon
} from '@mui/icons-material';

const EditDeadlineDialog = ({
  open,
  onClose,
  technology,
  onSave,
  calculateDeadlineStatus
}) => {
  const [deadline, setDeadline] = useState('');
  const [deadlineStatus, setDeadlineStatus] = useState(null);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState(false);

  // Инициализируем при открытии диалога
  useEffect(() => {
    if (open) {
      if (technology?.deadline) {
        const date = new Date(technology.deadline);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        setDeadline(`${year}-${month}-${day}`);
      } else {
        setDeadline('');
      }
      setErrors({});
      setTouched(false);
    }
  }, [open, technology]);

  useEffect(() => {
    if (deadline && calculateDeadlineStatus) {
      setDeadlineStatus(calculateDeadlineStatus(deadline));
    }
  }, [deadline, calculateDeadlineStatus]);

  // Валидация в реальном времени
  const validateField = (value) => {
    const newErrors = {};
    
    if (value) {
      const selectedDate = new Date(value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      // Проверка на прошедшую дату
      if (selectedDate < today) {
        newErrors.date = 'Дата не может быть в прошлом';
      }
      
      // Проверка на слишком далекое будущее (2 года максимум)
      const maxDate = new Date();
      maxDate.setFullYear(maxDate.getFullYear() + 2);
      if (selectedDate > maxDate) {
        newErrors.date = 'Слишком далекая дата (максимум 2 года)';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleDateChange = (e) => {
    const value = e.target.value;
    setDeadline(value);
    setTouched(true);
    validateField(value);
  };

  const handleSave = () => {
    setTouched(true);
    
    if (!deadline) {
      setErrors({ date: 'Пожалуйста, выберите дату дедлайна' });
      return;
    }
    
    if (!validateField(deadline)) {
      return;
    }
    
    console.log('Dialog: Saving deadline:', deadline, 'for tech:', technology?.id);
    
    const deadlineToSave = deadline ? deadline : null;
    
    if (onSave && technology?.id) {
      onSave(technology.id, deadlineToSave);
    }
    onClose();
  };

  const handleClear = () => {
    setDeadline('');
    setErrors({});
    setTouched(true);
  };

  // ARIA: Обработка нажатий клавиш
  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      onClose();
    }
    if (e.key === 'Enter' && e.ctrlKey) {
      handleSave();
    }
  };

  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const getNextWeekDate = () => {
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    const year = nextWeek.getFullYear();
    const month = String(nextWeek.getMonth() + 1).padStart(2, '0');
    const day = String(nextWeek.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const getNextMonthDate = () => {
    const nextMonth = new Date();
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    const year = nextMonth.getFullYear();
    const month = String(nextMonth.getMonth() + 1).padStart(2, '0');
    const day = String(nextMonth.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const formatDateForDisplay = (dateString) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    } catch (e) {
      return dateString;
    }
  };

  const isFormValid = deadline && Object.keys(errors).length === 0;

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="sm" 
      fullWidth
      onKeyDown={handleKeyDown}
      aria-labelledby="deadline-dialog-title"
      aria-describedby="deadline-dialog-description"
    >
      <DialogTitle 
        id="deadline-dialog-title"
        sx={{ pb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <CalendarTodayIcon color="primary" />
          <Typography variant="h6">
            Дедлайн для {technology?.title}
          </Typography>
        </Box>
        <IconButton 
          onClick={onClose} 
          size="small"
          aria-label="Закрыть диалог"
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      
      <DialogContent>
        <Box sx={{ mt: 1, mb: 3 }}>
          <FormControl 
            fullWidth 
            error={touched && !!errors.date}
            aria-invalid={touched && !!errors.date}
          >
            <TextField
              label="Дата дедлайна"
              type="date"
              value={deadline}
              onChange={handleDateChange}
              fullWidth
              sx={{ mb: 2 }}
              helperText={touched && errors.date ? errors.date : "Выберите дату, к которой нужно завершить изучение"}
              InputLabelProps={{
                shrink: true,
                'aria-required': 'true'
              }}
              inputProps={{
                min: getTodayDate(),
                'aria-label': 'Выберите дату дедлайна',
                'aria-required': 'true',
                'aria-invalid': touched && !!errors.date,
                'aria-describedby': errors.date ? 'date-error' : 'date-helper'
              }}
              InputProps={{
                startAdornment: <CalendarTodayIcon sx={{ mr: 1, color: 'action.active' }} />
              }}
              error={touched && !!errors.date}
              required
            />
            {touched && errors.date && (
              <FormHelperText id="date-error">
                {errors.date}
              </FormHelperText>
            )}
          </FormControl>

          <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
            <Button
              variant="outlined"
              onClick={handleClear}
              size="small"
              aria-label="Очистить дату"
            >
              Очистить
            </Button>
            
            <Button
              variant="outlined"
              onClick={() => {
                setDeadline(getNextWeekDate());
                setTouched(true);
                validateField(getNextWeekDate());
              }}
              size="small"
              aria-label="Установить дедлайн на следующую неделю"
            >
              +1 неделя
            </Button>
            
            <Button
              variant="outlined"
              onClick={() => {
                setDeadline(getNextMonthDate());
                setTouched(true);
                validateField(getNextMonthDate());
              }}
              size="small"
              aria-label="Установить дедлайн на следующий месяц"
            >
              +1 месяц
            </Button>
          </Box>

          {deadline && (
            <Box 
              sx={{ 
                p: 2, 
                borderRadius: 1, 
                backgroundColor: '#f0f9ff',
                border: '1px solid #bae6fd'
              }}
              role="status"
              aria-live="polite"
            >
              {/* <Typography variant="body2" fontWeight="medium" >
                Дедлайн установлен на: {formatDateForDisplay(deadline)}
              </Typography> */}
              {deadlineStatus && (
                <Typography variant="body2" sx={{ mt: 1, color: 
                  deadlineStatus === 'overdue' ? '#ef4444' :
                  deadlineStatus === 'urgent' ? '#f59e0b' :
                  deadlineStatus === 'approaching' ? '#3b82f6' : '#10b981'
                }}>
                  {deadlineStatus === 'overdue' && 'Просрочено'}
                  {deadlineStatus === 'urgent' && 'Срочно'}
                  {deadlineStatus === 'approaching' && 'Приближается'}
                  {deadlineStatus === 'normal' && 'По плану'}
                </Typography>
              )}
            </Box>
          )}
        </Box>
      </DialogContent>
      
      <DialogActions sx={{ p: 2, pt: 0 }}>
        <Button 
          onClick={onClose} 
          color="inherit"
          aria-label="Отменить установку дедлайна"
        >
          Отмена
        </Button>
        <Button 
          onClick={handleSave} 
          variant="contained" 
          color="primary"
          startIcon={<CalendarTodayIcon />}
          disabled={!isFormValid}
          aria-label="Сохранить дедлайн"
        >
          Сохранить
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditDeadlineDialog;