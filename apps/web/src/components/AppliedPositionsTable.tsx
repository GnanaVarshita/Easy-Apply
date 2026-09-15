import * as React from 'react';
import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  Tab
} from '@mui/material';
import {
  Launch as LaunchIcon,
  Send as SendIcon,
  CheckCircle as CheckCircleIcon,
  Work as WorkIcon
} from '@mui/icons-material';
import { ApplicationRecord } from '@velmurugan/shared';

interface AppliedPositionsTableProps {
  applications: ApplicationRecord[];
  initialFilter?: 'ALL' | 'EASY_APPLY' | 'TELEGRAM_REDIRECT';
}

export const AppliedPositionsTable: React.FC<AppliedPositionsTableProps> = ({
  applications,
  initialFilter = 'ALL'
}) => {
  const [filter, setFilter] = useState<'ALL' | 'EASY_APPLY' | 'TELEGRAM_REDIRECT'>(initialFilter);

  useEffect(() => {
    if (initialFilter) {
      setFilter(initialFilter);
    }
  }, [initialFilter]);

  const filteredApps = applications.filter(app => {
    if (filter === 'EASY_APPLY') return app.isEasyApply || app.status === 'APPLIED';
    if (filter === 'TELEGRAM_REDIRECT') return !app.isEasyApply || app.status === 'REDIRECTED';
    return true;
  });

  const easyApplyCount = applications.filter(a => a.isEasyApply || a.status === 'APPLIED').length;
  const telegramRedirectCount = applications.filter(a => !a.isEasyApply || a.status === 'REDIRECTED').length;

  return (
    <Paper sx={{ p: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Typography variant="h6" sx={{ color: '#0F172A', fontWeight: 700 }}>
          Tracked Job Applications & Telegram Alerts
        </Typography>

        <Tabs
          value={filter}
          onChange={(_: any, val: 'ALL' | 'EASY_APPLY' | 'TELEGRAM_REDIRECT') => setFilter(val)}
          indicatorColor="primary"
          textColor="primary"
        >
          <Tab value="ALL" icon={<WorkIcon sx={{ fontSize: 18 }} />} iconPosition="start" label={`All (${applications.length})`} />
          <Tab value="EASY_APPLY" icon={<CheckCircleIcon sx={{ fontSize: 18 }} />} iconPosition="start" label={`Easy Apply (${easyApplyCount})`} />
          <Tab value="TELEGRAM_REDIRECT" icon={<SendIcon sx={{ fontSize: 18 }} />} iconPosition="start" label={`Telegram Alerts (${telegramRedirectCount})`} />
        </Tabs>
      </Box>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 700, color: '#0F172A' }}>Role Title & Company</TableCell>
              <TableCell sx={{ fontWeight: 700, color: '#0F172A' }}>Application Type</TableCell>
              <TableCell sx={{ fontWeight: 700, color: '#0F172A' }}>ATS Match Score</TableCell>
              <TableCell sx={{ fontWeight: 700, color: '#0F172A' }}>Applied / Alerted At</TableCell>
              <TableCell sx={{ fontWeight: 700, color: '#0F172A' }} align="right">Action Link</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredApps.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 6 }}>
                  <Typography variant="body1" sx={{ fontWeight: 600, color: '#0F172A' }}>
                    {filter === 'TELEGRAM_REDIRECT'
                      ? 'No Telegram Redirect Alerts recorded yet.'
                      : filter === 'EASY_APPLY'
                      ? 'No Easy Apply Submissions completed yet.'
                      : 'No applications tracked in database yet.'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                    {filter === 'TELEGRAM_REDIRECT'
                      ? 'When external career site jobs are evaluated by Gemini AI, redirect alerts will be pushed to Telegram and displayed here.'
                      : 'Run an automated job scan to discover and apply to matching software engineering roles.'}
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              filteredApps.map(app => (
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
                      icon={app.isEasyApply ? <CheckCircleIcon sx={{ fontSize: '14px !important' }} /> : <SendIcon sx={{ fontSize: '14px !important' }} />}
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
                  <TableCell>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                      {app.appliedAt ? new Date(app.appliedAt).toLocaleString() : 'Just now'}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Button
                      href={app.redirectUrl || `https://www.linkedin.com/jobs/view/${app.linkedinJobId}`}
                      target="_blank"
                      variant="outlined"
                      size="small"
                      endIcon={<LaunchIcon />}
                    >
                      {app.redirectUrl ? 'Open Career Link' : 'View Job'}
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};
