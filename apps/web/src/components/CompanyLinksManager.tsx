import * as React from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  TextField,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton
} from '@mui/material';
import {
  Launch as LaunchIcon,
  Language as GlobeIcon,
  Add as AddIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import { CompanyCareerLink } from '@velmurugan/shared';

interface CompanyLinksManagerProps {
  companyLinks: CompanyCareerLink[];
  newCompanyName: string;
  newCareerUrl: string;
  onCompanyNameChange: (val: string) => void;
  onCareerUrlChange: (val: string) => void;
  onAddCompanyLink: (e: React.FormEvent) => void;
  onDeleteCompanyLink: (id: string) => void;
}

export const CompanyLinksManager: React.FC<CompanyLinksManagerProps> = ({
  companyLinks,
  newCompanyName,
  newCareerUrl,
  onCompanyNameChange,
  onCareerUrlChange,
  onAddCompanyLink,
  onDeleteCompanyLink
}) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1, color: '#0F172A' }}>
          <GlobeIcon color="primary" /> Add Target Company Career Pages (Stored in Neon DB)
        </Typography>

        <Box component="form" onSubmit={onAddCompanyLink} sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <TextField
            label="Company Name"
            placeholder="e.g. Trane Technologies, Stripe, Vercel"
            value={newCompanyName}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => onCompanyNameChange(e.target.value)}
            sx={{ flex: 1, minWidth: 220 }}
            required
          />
          <TextField
            label="Career / Job Board URL"
            placeholder="e.g. https://tranetechnologies.com/careers"
            value={newCareerUrl}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => onCareerUrlChange(e.target.value)}
            sx={{ flex: 2, minWidth: 300 }}
            type="url"
            required
          />
          <Button type="submit" variant="contained" color="primary" startIcon={<AddIcon />} sx={{ height: 56, px: 3 }}>
            Save Career Link
          </Button>
        </Box>
      </Paper>

      <Paper sx={{ p: 3 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2, color: '#0F172A' }}>
          Active Company Links Monitored by Cloudflare Bot
        </Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 700, color: '#0F172A' }}>Company Name</TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#0F172A' }}>Career Page URL</TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#0F172A' }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#0F172A' }} align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {companyLinks.map(link => (
                <TableRow key={link.id}>
                  <TableCell sx={{ fontWeight: 700, color: '#0F172A' }}>{link.companyName}</TableCell>
                  <TableCell>
                    <Button
                      href={link.careerUrl}
                      target="_blank"
                      endIcon={<LaunchIcon sx={{ fontSize: 14 }} />}
                      sx={{ p: 0, textTransform: 'none', color: 'primary.main' }}
                    >
                      {link.careerUrl}
                    </Button>
                  </TableCell>
                  <TableCell>
                    <Chip label="Active Monitoring" size="small" color="secondary" sx={{ fontWeight: 600 }} />
                  </TableCell>
                  <TableCell align="right">
                    <IconButton onClick={() => onDeleteCompanyLink(link.id)} color="error" size="small">
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};
