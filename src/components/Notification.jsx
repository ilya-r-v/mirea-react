import React from 'react';
import {
  Snackbar,
  Alert,
  IconButton,
  Box
} from '@mui/material';
import {
  Close as CloseIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Warning as WarningIcon,
  Info as InfoIcon
} from '@mui/icons-material';

const Notification = ({ 
  open, 
  message, 
  type = 'info', 
  duration = 6000,
  onClose,
  action 
}) => {
  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircleIcon />;
      case 'error':
        return <ErrorIcon />;
      case 'warning':
        return <WarningIcon />;
      case 'info':
      default:
        return <InfoIcon />;
    }
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    onClose();
  };

  return (
    <Snackbar
      open={open}
      autoHideDuration={duration}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      sx={{
        '& .MuiSnackbarContent-root': {
          flexWrap: 'nowrap'
        }
      }}
    >
      <Alert
        icon={getIcon()}
        severity={type}
        variant="filled"
        action={
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {action}
            <IconButton
              size="small"
              aria-label="close"
              color="inherit"
              onClick={handleClose}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>
        }
        sx={{
          width: '100%',
          alignItems: 'center',
          '& .MuiAlert-message': {
            padding: '4px 0'
          }
        }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
};

export default Notification;