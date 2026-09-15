import * as React from 'react';
import {
  Typography,
  Paper,
  Button,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import { Launch as LaunchIcon } from '@mui/icons-material';
import { ApplicationRecord } from '@velmurugan/shared';

interface AppliedPositionsTableProps {
  applications: ApplicationRecord[];
}

export const AppliedPositionsTable: React.FC<AppliedPositionsTableProps> = ({ applications }) => {
  return (
    <Paper sx={{ p: 4 }}>
      <Typography variant="h6" sx={{ mb: 3, color: '#0F172A' }}>
        All Tracked Positions
      </Typography>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 700, color: '#0F172A' }}>Role Title & Company</TableCell>
              <TableCell sx={{ fontWeight: 700, color: '#0F172A' }}>Application Type</TableCell>
              <TableCell sx={{ fontWeight: 700, color: '#0F172A' }}>ATS Match Score</TableCell>
              <TableCell sx={{ fontWeight: 700, color: '#0F172A' }} align="right">Action Link</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {applications.map(app => (
              <TableRow key={app.id}>
                <TableCell>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#0F172A' }}>
                    {app.title}
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    {app.company} • {app.location}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip
                    label={app.isEasyApply ? 'LinkedIn Easy Apply' : 'Telegram Alert'}
                    color={app.isEasyApply ? 'secondary' : 'primary'}
                    size="small"
                    sx={{ fontWeight: 700 }}
                  />
                </TableCell>
                <TableCell>
                  <Typography variant="body2" sx={{ fontWeight: 800, color: '#B8860B' }}>
                    {app.matchScore}% Score
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  {app.redirectUrl && (
                    <Button href={app.redirectUrl} target="_blank" variant="outlined" size="small" endIcon={<LaunchIcon />}>
                      Open Link
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};
