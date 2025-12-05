import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  useMediaQuery,
  useTheme
} from '@mui/material';

const ResponsiveDialog = ({
  open,
  onClose,
  title,
  children,
  actions,
  maxWidth = 'sm',
  fullScreen = false
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={maxWidth}
      fullWidth
      fullScreen={fullScreen || isMobile}
      aria-labelledby="responsive-dialog-title"
    >
      <DialogTitle id="responsive-dialog-title">
        {title}
      </DialogTitle>
      <DialogContent>
        {children}
      </DialogContent>
      <DialogActions>
        {actions || (
          <Button onClick={onClose} autoFocus>
            Закрыть
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default ResponsiveDialog;