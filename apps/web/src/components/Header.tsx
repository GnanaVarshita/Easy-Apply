import * as React from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Button,
  CircularProgress
} from '@mui/material';
import { PlayArrow as PlayIcon } from '@mui/icons-material';

interface HeaderProps {
  candidateName: string;
  isScanning: boolean;
  onTriggerScan: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  candidateName,
  isScanning,
  onTriggerScan
}) => {
  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: 0,
        borderBottom: '1px solid #E2E8F0',
        bgcolor: '#FFFFFF',
        py: 2,
        px: 3,
        position: 'sticky',
        top: 0,
        zIndex: 1100
      }}
    >
      <Container maxWidth="lg" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {/* <Box
            component="img"
            src="/VelMurugan.jpg"
            alt="VelMurugan Logo"
            sx={{
              width: 44,
              height: 44,
              borderRadius: 2.5,
              objectFit: 'cover',
              border: '2px solid #D4AF37',
              boxShadow: '0 4px 12px rgba(184, 134, 11, 0.25)'
            }}
          /> */}
          <Box>
            <Typography variant="h6" sx={{ color: '#0F172A', fontSize: '1.15rem' }}>
              VelMurugan • Job & Resume Automation
            </Typography>
            <Typography
              variant="caption"
              sx={{ color: 'primary.main', display: 'flex', alignItems: 'center', gap: 0.8, fontWeight: 600 }}
            >
              <Box
                component="span"
                sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#10B981', display: 'inline-block' }}
              />
              Candidate: {candidateName} (VIT Vellore) • Cloudflare Cron Active
            </Typography>
          </Box>
        </Box>

        <Button
          variant="contained"
          color="primary"
          onClick={onTriggerScan}
          disabled={isScanning}
          startIcon={isScanning ? <CircularProgress size={18} color="inherit" /> : <PlayIcon />}
        >
          {isScanning ? 'Scanning Jobs...' : 'Run Hourly Scan Now'}
        </Button>
      </Container>
    </Paper>
  );
};
