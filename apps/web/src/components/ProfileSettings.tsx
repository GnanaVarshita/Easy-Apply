import * as React from 'react';
import {
  Typography,
  Paper,
  TextField,
  Grid
} from '@mui/material';
import { Settings as SettingsIcon } from '@mui/icons-material';
import { UserProfile } from '@velmurugan/shared';
import { MasterPdfUploadCard } from './MasterPdfUploadCard';

interface ProfileSettingsProps {
  profile: UserProfile;
  selectedFile: File | null;
  isParsingPdf: boolean;
  pdfUploadStatus: string | null;
  onProfileChange: (updated: UserProfile) => void;
  onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onProcessExtraction: () => void;
}

export const ProfileSettings: React.FC<ProfileSettingsProps> = ({
  profile,
  selectedFile,
  isParsingPdf,
  pdfUploadStatus,
  onProfileChange,
  onFileSelect,
  onProcessExtraction
}) => {
  return (
    <Paper sx={{ p: 4, display: 'flex', flexDirection: 'column', gap: 4 }}>
      <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#0F172A' }}>
        <SettingsIcon color="primary" /> Candidate Profile & Master Resume Upload
      </Typography>

      {/* Master PDF Upload Zone */}
      <MasterPdfUploadCard
        selectedFile={selectedFile}
        masterPdfBase64={profile.masterPdfBase64}
        isParsingPdf={isParsingPdf}
        pdfUploadStatus={pdfUploadStatus}
        onFileSelect={onFileSelect}
        onProcessExtraction={onProcessExtraction}
      />

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Full Name"
            value={profile.name}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => onProfileChange({ ...profile, name: e.target.value })}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Years of Experience (YOE)"
            type="number"
            value={profile.yoe}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => onProfileChange({ ...profile, yoe: parseInt(e.target.value) || 0 })}
            fullWidth
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Target Job Titles"
            value={profile.targetJobTitles.join(', ')}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              onProfileChange({ ...profile, targetJobTitles: e.target.value.split(',').map((s: string) => s.trim()) })
            }
            fullWidth
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Core Skills"
            value={profile.skills.join(', ')}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              onProfileChange({ ...profile, skills: e.target.value.split(',').map((s: string) => s.trim()) })
            }
            fullWidth
          />
        </Grid>
      </Grid>
    </Paper>
  );
};
