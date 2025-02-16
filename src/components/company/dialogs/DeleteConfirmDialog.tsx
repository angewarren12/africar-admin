import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
  styled,
  alpha,
} from '@mui/material';
import { Warning as WarningIcon } from '@mui/icons-material';

const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    borderRadius: theme.spacing(2),
    background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.95)} 0%, ${alpha(
      theme.palette.background.paper,
      0.98
    )} 100%)`,
    backdropFilter: 'blur(10px)',
  },
}));

interface DeleteConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  content: string;
}

const DeleteConfirmDialog: React.FC<DeleteConfirmDialogProps> = ({
  open,
  onClose,
  onConfirm,
  title,
  content,
}) => {
  return (
    <StyledDialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ m: 0, p: 3, background: (theme) => alpha(theme.palette.error.main, 0.05) }}>
        <Typography
          variant="h6"
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            color: 'error.main',
          }}
        >
          <WarningIcon color="error" />
          {title}
        </Typography>
      </DialogTitle>

      <DialogContent dividers sx={{ p: 3 }}>
        <Typography>{content}</Typography>
      </DialogContent>

      <DialogActions sx={{ p: 3 }}>
        <Button
          variant="outlined"
          onClick={onClose}
          sx={{
            borderRadius: 2,
            textTransform: 'none',
          }}
        >
          Annuler
        </Button>
        <Button
          variant="contained"
          onClick={onConfirm}
          color="error"
          sx={{
            borderRadius: 2,
            textTransform: 'none',
          }}
        >
          Supprimer
        </Button>
      </DialogActions>
    </StyledDialog>
  );
};

export default DeleteConfirmDialog;
