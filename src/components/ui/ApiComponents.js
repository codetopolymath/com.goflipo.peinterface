import React from 'react';
import {
  Box, Typography, Chip, Alert, ToggleButtonGroup, ToggleButton,
  Paper, Fade, Card, CardContent, Tooltip
} from '@mui/material';
import {
  Science as DemoIcon,
  Rocket as ProductionIcon,
  Warning as WarningIcon,
  InfoOutlined as InfoIcon,
  CheckCircle as CheckIcon
} from '@mui/icons-material';
import { useSMS } from '../../contexts/SMSContext';

const EnvironmentSelector = () => {
  const { environment, handleEnvironmentChange } = useSMS();

  const isProduction = environment === 'production';

  return (
    <Fade in={true} timeout={800}>
      <Card
        variant="outlined"
        sx={{
          mb: 4,
          borderRadius: 2,
          backgroundColor: 'background.paper',
          borderColor: isProduction ? 'success.light' : 'warning.light',
          boxShadow: isProduction
            ? 'rgba(16, 185, 129, 0.08) 0px 1px 3px 0px, rgba(16, 185, 129, 0.2) 0px 0px 0px 1px'
            : 'rgba(245, 158, 11, 0.08) 0px 1px 3px 0px, rgba(245, 158, 11, 0.2) 0px 0px 0px 1px'
        }}
      >
        <CardContent sx={{ p: 2.5 }}>
          <Box sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: 'center',
            justifyContent: 'space-between',
            mb: 1
          }}>
            <Typography
              variant="body1"
              fontWeight={500}
              sx={{
                display: 'flex',
                alignItems: 'center',
                mb: { xs: 1, sm: 0 },
                color: 'text.primary'
              }}
            >
              Environment
              <Tooltip title="Select which Goflipo backend to route requests through">
                <InfoIcon
                  fontSize="small"
                  sx={{ ml: 1, opacity: 0.6, cursor: 'help' }}
                />
              </Tooltip>
            </Typography>

            <Paper
              elevation={0}
              sx={{
                p: 0.5,
                borderRadius: 2,
                bgcolor: 'background.default'
              }}
            >
              <ToggleButtonGroup
                value={environment}
                exclusive
                onChange={handleEnvironmentChange}
                aria-label="Environment"
                sx={{
                  '& .MuiToggleButtonGroup-grouped': {
                    borderRadius: 1.5,
                    mx: 0.5,
                    border: 0,
                    px: 2,
                    '&.Mui-selected': {
                      boxShadow: 'rgba(0, 0, 0, 0.05) 0px 1px 2px'
                    }
                  }
                }}
              >
                <ToggleButton
                  value="demo"
                  aria-label="demo environment"
                  sx={{
                    '&.Mui-selected': {
                      backgroundColor: 'warning.light',
                      color: 'warning.contrastText',
                      '&:hover': { backgroundColor: 'warning.main' }
                    }
                  }}
                >
                  <DemoIcon sx={{ mr: 1 }} fontSize="small" />
                  Demo
                </ToggleButton>
                <ToggleButton
                  value="production"
                  aria-label="production environment"
                  sx={{
                    '&.Mui-selected': {
                      backgroundColor: 'success.light',
                      color: 'success.contrastText',
                      '&:hover': { backgroundColor: 'success.main' }
                    }
                  }}
                >
                  <ProductionIcon sx={{ mr: 1 }} fontSize="small" />
                  Production
                </ToggleButton>
              </ToggleButtonGroup>
            </Paper>
          </Box>

          {/* Active environment status */}
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mt: 2,
            bgcolor: isProduction ? 'success.50' : 'warning.50',
            borderRadius: 1.5,
            py: 0.8,
            gap: 1
          }}>
            <Chip
              icon={isProduction ? <CheckIcon fontSize="small" /> : <DemoIcon fontSize="small" />}
              label={
                isProduction
                  ? 'Production — central-be.goflipo.com'
                  : 'Demo — stage-smartping-backend.goflipo.com'
              }
              color={isProduction ? 'success' : 'warning'}
              variant="filled"
              sx={{
                fontWeight: 500,
                borderRadius: 1.5,
                border: 'none',
                fontSize: '0.8rem'
              }}
            />
          </Box>
        </CardContent>
      </Card>
    </Fade>
  );
};

const CorsWarning = () => {
  const { corsError } = useSMS();

  if (!corsError) return null;

  return (
    <Fade in={true}>
      <Alert
        severity="warning"
        variant="filled"
        icon={<WarningIcon />}
        sx={{
          mb: 4,
          borderRadius: 2,
          boxShadow: 'rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px'
        }}
      >
        <Typography variant="subtitle1" component="div" fontWeight={600} sx={{ mb: 0.5 }}>
          CORS Error Detected
        </Typography>
        <Typography variant="body2" component="div" sx={{ mb: 1 }}>
          The application is making direct API calls that may be blocked by browser security policies.
        </Typography>
        <Box
          component="ul"
          sx={{
            pl: 2,
            mt: 1,
            '& li': { mb: 0.5, fontSize: '0.9rem' }
          }}
        >
          <li>Install a CORS browser extension (for development only)</li>
          <li>Run the server proxy included in the server folder</li>
          <li>Configure the target APIs to allow your origin in CORS headers</li>
        </Box>
      </Alert>
    </Fade>
  );
};

export { EnvironmentSelector, CorsWarning };
