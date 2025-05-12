import React from 'react';
import { 
  Box, Typography, Chip, Alert, ToggleButtonGroup, ToggleButton,
  Paper, Fade, Card, CardContent, Tooltip
} from '@mui/material';
import { 
  Cloud as PrimaryIcon, 
  CloudOff as BackupIcon, 
  Warning as WarningIcon,
  InfoOutlined as InfoIcon
} from '@mui/icons-material';
import { useSMS } from '../../contexts/SMSContext';

const ApiModeSelector = () => {
  const { apiMode, handleApiModeChange } = useSMS();

  return (
    <Fade in={true} timeout={800}>
      <Card 
        variant="outlined" 
        sx={{ 
          mb: 4,
          borderRadius: 2,
          backgroundColor: 'background.paper',
          boxShadow: 'rgba(0, 0, 0, 0.02) 0px 1px 3px 0px, rgba(27, 31, 35, 0.15) 0px 0px 0px 1px'
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
              API Connection Mode
              <Tooltip title="Select which API endpoint to use for sending SMS">
                <InfoIcon 
                  fontSize="small" 
                  sx={{ 
                    ml: 1, 
                    opacity: 0.6,
                    cursor: 'help' 
                  }} 
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
                color="primary"
                value={apiMode}
                exclusive
                onChange={handleApiModeChange}
                aria-label="API Mode"
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
                  value="primary" 
                  aria-label="primary mode"
                  sx={{
                    '&.Mui-selected': {
                      backgroundColor: 'primary.light',
                      color: 'primary.contrastText',
                      '&:hover': {
                        backgroundColor: 'primary.main'
                      }
                    }
                  }}
                >
                  <PrimaryIcon sx={{ mr: 1 }} fontSize="small" />
                  Primary
                </ToggleButton>
                <ToggleButton 
                  value="backup" 
                  aria-label="backup mode"
                  sx={{
                    '&.Mui-selected': {
                      backgroundColor: 'secondary.light',
                      color: 'secondary.contrastText',
                      '&:hover': {
                        backgroundColor: 'secondary.main'
                      }
                    }
                  }}
                >
                  <BackupIcon sx={{ mr: 1 }} fontSize="small" />
                  Backup
                </ToggleButton>
              </ToggleButtonGroup>
            </Paper>
          </Box>
          
          {/* Status indicator */}
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center',
            justifyContent: 'center', 
            mt: 2,
            bgcolor: apiMode === 'primary' ? 'primary.50' : 'secondary.50',
            borderRadius: 1.5,
            py: 0.8,
          }}>
            <Chip 
              icon={
                apiMode === 'primary' ? 
                <PrimaryIcon fontSize="small" /> : 
                <BackupIcon fontSize="small" />
              }
              label={
                apiMode === 'primary' ? 
                'Using Primary API (Direct Connection)' : 
                'Using Backup API (Template-based)'
              }
              color={apiMode === 'primary' ? 'primary' : 'secondary'}
              variant="filled"
              sx={{
                fontWeight: 500,
                borderRadius: 1.5,
                border: 'none'
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
        <Typography 
          variant="subtitle1" 
          component="div" 
          fontWeight={600}
          sx={{ mb: 0.5 }}
        >
          CORS Error Detected
        </Typography>
        <Typography variant="body2" component="div" sx={{ mb: 1 }}>
          This application is making direct API calls which may be blocked by browser security policies.
          Here are your options to fix this:
        </Typography>
        <Box 
          component="ul" 
          sx={{ 
            pl: 2, 
            mt: 1, 
            '& li': { 
              mb: 0.5,
              fontSize: '0.9rem'
            } 
          }}
        >
          <li>Install a CORS browser extension (for development purposes only)</li>
          <li>Run the server proxy included in the server folder</li>
          <li>Configure the target APIs to allow your origin in the CORS headers</li>
        </Box>
      </Alert>
    </Fade>
  );
};

export { ApiModeSelector, CorsWarning };
