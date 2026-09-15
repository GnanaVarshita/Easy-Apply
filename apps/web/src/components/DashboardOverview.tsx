import * as React from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  Grid,
  Chip
} from '@mui/material';
import {
  Send as SendIcon,
  AutoAwesome as SparklesIcon,
  AccessTime as ClockIcon,
  CheckCircle as CheckCircleIcon,
  Refresh as RefreshIcon,
  Language as GlobeIcon
} from '@mui/icons-material';
import { DashboardStats } from '@velmurugan/shared';
import { MasterPdfUploadCard } from './MasterPdfUploadCard';

interface DashboardOverviewProps {
  stats: DashboardStats;
  companyLinksCount: number;
  selectedFile: File | null;
  masterPdfBase64?: string;
  isParsingPdf: boolean;
  pdfUploadStatus: string | null;
  onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onProcessExtraction: () => void;
  onTriggerScan: () => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  stats,
  companyLinksCount,
  selectedFile,
  masterPdfBase64,
  isParsingPdf,
  pdfUploadStatus,
  onFileSelect,
  onProcessExtraction,
  onTriggerScan
}) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', color: 'text.secondary' }}>
              <Typography variant="caption" sx={{ textTransform: 'uppercase', fontWeight: 700 }}>
                Easy Apply Submissions
              </Typography>
              <CheckCircleIcon sx={{ color: '#10B981' }} />
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 800, color: '#0F172A' }}>
              {stats.totalApplied}
            </Typography>
            <Typography variant="caption" sx={{ color: '#10B981', fontWeight: 600 }}>
              Direct auto-applications completed
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', color: 'text.secondary' }}>
              <Typography variant="caption" sx={{ textTransform: 'uppercase', fontWeight: 700 }}>
                Telegram Redirect Alerts
              </Typography>
              <SendIcon sx={{ color: 'primary.main' }} />
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 800, color: '#0F172A' }}>
              {stats.totalRedirected}
            </Typography>
            <Typography variant="caption" sx={{ color: 'primary.main', fontWeight: 600 }}>
              External link alerts pushed to Telegram
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', color: 'text.secondary' }}>
              <Typography variant="caption" sx={{ textTransform: 'uppercase', fontWeight: 700 }}>
                Target Company Links
              </Typography>
              <GlobeIcon sx={{ color: '#3B82F6' }} />
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 800, color: '#0F172A' }}>
              {companyLinksCount}
            </Typography>
            <Typography variant="caption" sx={{ color: '#3B82F6', fontWeight: 600 }}>
              Custom career pages in Neon DB
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', color: 'text.secondary' }}>
              <Typography variant="caption" sx={{ textTransform: 'uppercase', fontWeight: 700 }}>
                Average ATS Score
              </Typography>
              <SparklesIcon sx={{ color: '#8B5CF6' }} />
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 800, color: '#0F172A' }}>
              {stats.averageMatchScore}%
            </Typography>
            <Typography variant="caption" sx={{ color: '#8B5CF6', fontWeight: 600 }}>
              Powered by Gemini AI matching
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Master Resume PDF Upload Card */}
      <MasterPdfUploadCard
        selectedFile={selectedFile}
        masterPdfBase64={masterPdfBase64}
        isParsingPdf={isParsingPdf}
        pdfUploadStatus={pdfUploadStatus}
        onFileSelect={onFileSelect}
        onProcessExtraction={onProcessExtraction}
      />

      {/* Cron Status Banner */}
      <Paper
        sx={{
          p: 3,
          display: 'flex',
          alignItems: 'center',
          justify: 'space-between',
          bgcolor: '#F8FAFC',
          flexWrap: 'wrap',
          gap: 2
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Paper
            sx={{
              width: 44,
              height: 44,
              bgcolor: '#FEF3C7',
              display: 'flex',
              alignItems: 'center',
              justify: 'center',
              border: '1px solid #FDE68A'
            }}
          >
            <ClockIcon sx={{ color: '#B8860B' }} />
          </Paper>
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#0F172A' }}>
                Cloudflare Hourly Automation Status
              </Typography>
              <Chip label="CRON (0 * * * *)" size="small" color="secondary" sx={{ fontWeight: 700, fontSize: '0.7rem' }} />
            </Box>
            <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
              Scans LinkedIn + {companyLinksCount} target company career links every 60 mins automatically using candidate's uploaded resume.
            </Typography>
          </Box>
        </Box>
        <Button variant="outlined" color="primary" onClick={onTriggerScan} startIcon={<RefreshIcon />}>
          Run Manual Cycle
        </Button>
      </Paper>
    </Box>
  );
};
