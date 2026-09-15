import * as React from 'react';
import { useState, useMemo } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  CircularProgress,
  Alert,
  Collapse,
  IconButton,
  Divider
} from '@mui/material';
import {
  CloudUpload as CloudUploadIcon,
  FileUpload as FileUploadIcon,
  AutoAwesome as SparklesIcon,
  Visibility as ViewIcon,
  VisibilityOff as HideIcon,
  PictureAsPdf as PdfIcon,
  Launch as LaunchIcon
} from '@mui/icons-material';

interface MasterPdfUploadCardProps {
  selectedFile: File | null;
  masterPdfBase64?: string;
  isParsingPdf: boolean;
  pdfUploadStatus: string | null;
  onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onProcessExtraction: () => void;
}

export const MasterPdfUploadCard: React.FC<MasterPdfUploadCardProps> = ({
  selectedFile,
  masterPdfBase64,
  isParsingPdf,
  pdfUploadStatus,
  onFileSelect,
  onProcessExtraction
}) => {
  const [showPreview, setShowPreview] = useState(false);

  // Compute viewer URL for PDF (Blob URL or Base64 URI)
  const pdfViewerUrl = useMemo(() => {
    if (selectedFile) {
      return URL.createObjectURL(selectedFile);
    }
    if (masterPdfBase64) {
      return masterPdfBase64.startsWith('data:')
        ? masterPdfBase64
        : `data:application/pdf;base64,${masterPdfBase64}`;
    }
    return null;
  }, [selectedFile, masterPdfBase64]);

  return (
    <Paper sx={{ p: 4, display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
        <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#0F172A' }}>
          <CloudUploadIcon color="primary" /> Upload & View Master Resume PDF (GnanaVarshita Kamisetty)
        </Typography>
        {pdfViewerUrl && (
          <Button
            variant={showPreview ? 'contained' : 'outlined'}
            color="primary"
            size="small"
            startIcon={showPreview ? <HideIcon /> : <ViewIcon />}
            onClick={() => setShowPreview(!showPreview)}
          >
            {showPreview ? 'Hide PDF Viewer' : 'View Uploaded Resume'}
          </Button>
        )}
      </Box>

      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
        Upload your updated master resume PDF. Whenever you upload a new resume, old records are automatically cleared from Neon DB & Cloudflare Workers, and your exact resume is used directly for all automated job applications!
      </Typography>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap', mt: 1 }}>
        <Button
          variant="outlined"
          component="label"
          startIcon={<FileUploadIcon />}
          sx={{ borderColor: '#CBD5E1', color: '#0F172A' }}
        >
          Select Master PDF File
          <input type="file" accept="application/pdf" hidden onChange={onFileSelect} />
        </Button>
        {selectedFile && (
          <Typography variant="body2" sx={{ color: 'primary.main', fontWeight: 600 }}>
            {selectedFile.name}
          </Typography>
        )}
        <Button
          variant="contained"
          color="primary"
          disabled={!selectedFile || isParsingPdf}
          onClick={onProcessExtraction}
          startIcon={isParsingPdf ? <CircularProgress size={18} color="inherit" /> : <SparklesIcon />}
        >
          {isParsingPdf ? 'Clearing Old & Syncing New Resume...' : 'Upload & Sync Resume'}
        </Button>

        {pdfViewerUrl && !showPreview && (
          <Button
            variant="text"
            color="primary"
            startIcon={<PdfIcon />}
            onClick={() => setShowPreview(true)}
            sx={{ fontWeight: 700 }}
          >
            Preview Active PDF
          </Button>
        )}
      </Box>

      {pdfUploadStatus && <Alert severity="info" sx={{ mt: 1 }}>{pdfUploadStatus}</Alert>}

      {/* Embedded Web PDF Viewer Container */}
      <Collapse in={showPreview} timeout="auto" unmountOnExit>
        <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid #E2E8F0' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <PdfIcon color="primary" />
              <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#0F172A' }}>
                Master Resume PDF Preview
              </Typography>
            </Box>
            {pdfViewerUrl && (
              <Button
                href={pdfViewerUrl}
                target="_blank"
                rel="noopener noreferrer"
                size="small"
                variant="outlined"
                endIcon={<LaunchIcon />}
              >
                Open PDF in New Window
              </Button>
            )}
          </Box>

          <Paper
            elevation={0}
            sx={{
              width: '100%',
              height: '620px',
              overflow: 'hidden',
              borderRadius: 2,
              border: '1px solid #CBD5E1',
              bgcolor: '#525659'
            }}
          >
            {pdfViewerUrl ? (
              <iframe
                src={pdfViewerUrl}
                title="Candidate Master Resume PDF"
                width="100%"
                height="100%"
                style={{ border: 'none' }}
              />
            ) : (
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#ffffff' }}>
                <Typography variant="body2">No PDF file loaded yet. Select or upload a master PDF above.</Typography>
              </Box>
            )}
          </Paper>
        </Box>
      </Collapse>
    </Paper>
  );
};
