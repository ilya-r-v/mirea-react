import { useState, useCallback } from 'react';

const useNotification = () => {
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    type: 'info',
    duration: 6000,
    action: null
  });

  const showNotification = useCallback((message, type = 'info', duration = 6000, action = null) => {
    setNotification({
      open: true,
      message,
      type,
      duration,
      action
    });
  }, []);

  const hideNotification = useCallback(() => {
    setNotification(prev => ({ ...prev, open: false }));
  }, []);

  const showSuccess = useCallback((message, duration = 4000) => {
    showNotification(message, 'success', duration);
  }, [showNotification]);

  const showError = useCallback((message, duration = 8000) => {
    showNotification(message, 'error', duration);
  }, [showNotification]);

  const showWarning = useCallback((message, duration = 6000) => {
    showNotification(message, 'warning', duration);
  }, [showNotification]);

  const showInfo = useCallback((message, duration = 4000) => {
    showNotification(message, 'info', duration);
  }, [showNotification]);

  return {
    notification,
    showNotification,
    hideNotification,
    showSuccess,
    showError,
    showWarning,
    showInfo
  };
};

export default useNotification;