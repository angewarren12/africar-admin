import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  Button,
  Grid,
  styled,
  alpha,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
} from '@mui/material';
import {
  CloudUpload as UploadIcon,
  Delete as DeleteIcon,
  Download as DownloadIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const StyledCard = styled(Card)(({ theme }) => ({
  background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.9)} 0%, ${alpha(
    theme.palette.background.paper,
    0.95
  )} 100%)`,
  backdropFilter: 'blur(10px)',
  borderRadius: theme.spacing(2),
  padding: theme.spacing(3),
  boxShadow: `0 8px 32px 0 ${alpha(theme.palette.primary.main, 0.1)}`,
  border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
}));

interface Document {
  id: number;
  type: string;
  file_name: string;
  file_path: string;
  status: 'valid' | 'expired' | 'pending';
  created_at: string;
}

interface LegalDocumentsProps {
  documents: Document[];
  companyId: number;
}

const documentTypes = [
  { value: 'registration', label: "Registre du Commerce" },
  { value: 'tax', label: "Carte Contribuable" },
  { value: 'license', label: "Licence de Transport" },
  { value: 'insurance', label: "Assurance" },
  { value: 'other', label: "Autre" },
];

const LegalDocuments: React.FC<LegalDocumentsProps> = ({ documents, companyId }) => {
  const [openUpload, setOpenUpload] = useState(false);
  const [selectedType, setSelectedType] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleUpload = () => {
    // TODO: Implémenter l'upload de fichier
    setOpenUpload(false);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleDownload = (document: Document) => {
    // TODO: Implémenter le téléchargement
    console.log('Téléchargement du document:', document.file_name);
  };

  const handleDelete = (document: Document) => {
    // TODO: Implémenter la suppression
    console.log('Suppression du document:', document.id);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'valid':
        return 'success';
      case 'expired':
        return 'error';
      case 'pending':
        return 'warning';
      default:
        return 'default';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'valid':
        return 'Valide';
      case 'expired':
        return 'Expiré';
      case 'pending':
        return 'En attente';
      default:
        return status;
    }
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5">Documents Légaux</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenUpload(true)}
        >
          Ajouter un document
        </Button>
      </Box>

      <Grid container spacing={3}>
        {documents.length === 0 ? (
          <Grid item xs={12}>
            <StyledCard>
              <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
                <Typography variant="h6" color="text.secondary">
                  Aucun document
                </Typography>
                <Button
                  variant="outlined"
                  startIcon={<UploadIcon />}
                  onClick={() => setOpenUpload(true)}
                >
                  Ajouter votre premier document
                </Button>
              </Box>
            </StyledCard>
          </Grid>
        ) : (
          documents.map((document) => (
            <Grid item xs={12} md={6} key={document.id}>
              <StyledCard>
                <Box display="flex" justifyContent="space-between" alignItems="start">
                  <Box>
                    <Typography variant="h6" gutterBottom>
                      {documentTypes.find(t => t.value === document.type)?.label || document.type}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      {document.file_name}
                    </Typography>
                    <Box display="flex" gap={1} mt={1}>
                      <Chip
                        label={getStatusLabel(document.status)}
                        size="small"
                        color={getStatusColor(document.status) as any}
                      />
                      <Chip
                        label={format(new Date(document.created_at), 'dd MMM yyyy', { locale: fr })}
                        size="small"
                        variant="outlined"
                      />
                    </Box>
                  </Box>
                  <Box display="flex" gap={1}>
                    <IconButton
                      size="small"
                      onClick={() => handleDownload(document)}
                      color="primary"
                    >
                      <DownloadIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleDelete(document)}
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Box>
              </StyledCard>
            </Grid>
          ))
        )}
      </Grid>

      {/* Dialog d'upload */}
      <Dialog open={openUpload} onClose={() => setOpenUpload(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Ajouter un document</DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2} mt={2}>
            <TextField
              select
              label="Type de document"
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              fullWidth
            >
              {documentTypes.map((type) => (
                <MenuItem key={type.value} value={type.value}>
                  {type.label}
                </MenuItem>
              ))}
            </TextField>
            <Button
              variant="outlined"
              component="label"
              startIcon={<UploadIcon />}
              fullWidth
            >
              {selectedFile ? selectedFile.name : 'Choisir un fichier'}
              <input
                type="file"
                hidden
                onChange={handleFileChange}
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              />
            </Button>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenUpload(false)}>Annuler</Button>
          <Button
            onClick={handleUpload}
            variant="contained"
            disabled={!selectedType || !selectedFile}
          >
            Téléverser
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default LegalDocuments;
