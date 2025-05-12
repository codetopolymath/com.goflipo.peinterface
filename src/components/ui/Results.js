import React from 'react';
import { 
  Box, Paper, Typography, Card, CardHeader, CardContent, 
  Chip, Button, Grid, Alert, Dialog, DialogTitle, 
  DialogContent, DialogActions, Grow, useTheme, alpha
} from '@mui/material';
import { 
  Phone as PhoneIcon,
  CheckCircle as SuccessIcon,
  Error as ErrorIcon,
  HourglassEmpty as PendingIcon,
  Refresh as ProcessingIcon,
} from '@mui/icons-material';
import { useSMS } from '../../contexts/SMSContext';

const ResultCard = ({ contact, index }) => {
  const { showDetails } = useSMS();
  const theme = useTheme();
  
  // Determine the status icon and color
  const getStatusConfig = () => {
    switch (contact.status) {
      case 'success':
        return { 
          icon: <SuccessIcon fontSize="small" />,
          label: 'Sent',
          color: 'success',
          bgColor: alpha(theme.palette.success.main, 0.08)
        };
      case 'error':
        return { 
          icon: <ErrorIcon fontSize="small" />,
          label: 'Failed',
          color: 'error',
          bgColor: alpha(theme.palette.error.main, 0.08)
        };
      case 'processing':
        return { 
          icon: <ProcessingIcon fontSize="small" className="rotating-icon" />,
          label: 'Processing',
          color: 'warning',
          bgColor: alpha(theme.palette.warning.main, 0.08)
        };
      default:
        return { 
          icon: <PendingIcon fontSize="small" />,
          label: 'Pending',
          color: 'info',
          bgColor: alpha(theme.palette.info.main, 0.08)
        };
    }
  };
  
  const statusConfig = getStatusConfig();
  
  return (
    <Grid item xs={12} sm={6} md={4} key={index}>
      <Grow 
        in={true} 
        style={{ transformOrigin: '0 0 0' }}
        timeout={(index + 1) * 200}
      >
        <Card 
          variant="outlined" 
          sx={{ 
            borderRadius: 2,
            border: '1px solid',
            borderColor: 'divider',
            boxShadow: theme.shadows[0],
            transition: 'all 0.2s ease-in-out',
            overflow: 'hidden',
            '&:hover': {
              boxShadow: theme.shadows[2]
            }
          }}
        >
          <Box sx={{ 
            p: 1,
            px: 2,
            borderBottom: '1px solid',
            borderColor: 'divider',
            bgcolor: statusConfig.bgColor,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {statusConfig.icon}
              <Typography variant="body2" fontWeight={500} color={`${statusConfig.color}.dark`}>
                {statusConfig.label}
              </Typography>
            </Box>
            <Chip 
              label={
                contact.number.length > 15 
                  ? contact.number.slice(0, 13) + '...' 
                  : contact.number
              }
              icon={<PhoneIcon fontSize="small" />}
              size="small"
              sx={{ 
                borderRadius: 1, 
                fontWeight: 400, 
                fontSize: '0.75rem'
              }}
            />
          </Box>
          <CardHeader
            sx={{ 
              pb: 1, 
              pt: 2
            }}
            title={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="body1" fontWeight={500}>
                  {contact.number}
                </Typography>
              </Box>
            }
          />
        <CardContent>
          {contact.status === 'success' && contact.result && (
            <>
              {contact.result.scrubbing?.data?.authcode && (
                <Typography variant="body2" color="text.secondary">
                  AuthCode: {contact.result.scrubbing.data.authcode}
                </Typography>
              )}
              {contact.result.init_response?.data?.authcode && (
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  AuthCode: {contact.result.init_response.data.authcode}
                </Typography>
              )}
              {contact.result.sms?.rawResponse && (
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  SMS Response: {contact.result.sms.rawResponse}
                </Typography>
              )}
              <Button size="small" onClick={() => showDetails(contact.result)} sx={{ mt: 1 }}>
                View Details
              </Button>
            </>
          )}
          
          {contact.status === 'error' && (
            <Typography variant="body2" color="error">
              {contact.error}
            </Typography>
          )}
        </CardContent>
      </Card>
      </Grow>
    </Grid>
  );
};

const ResultsDisplay = () => {
  const { response, contacts } = useSMS();
  
  if (!response.message) return null;
  
  return (
    <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
      <Alert 
        severity={response.error ? "error" : response.success ? "success" : "info"}
        sx={{ mb: 2 }}
      >
        {response.message}
      </Alert>
      
      {contacts.some(contact => contact.status === 'success' || contact.status === 'error') && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6" gutterBottom>Results</Typography>
          
          <Grid container spacing={2}>
            {contacts.map((contact, index) => (
              <ResultCard key={index} contact={contact} index={index} />
            ))}
          </Grid>
        </Box>
      )}
    </Paper>
  );
};

const DetailsDialog = () => {
  const { detailsOpen, detailsContent, closeDetails } = useSMS();
  
  return (
    <Dialog
      open={detailsOpen} onClose={closeDetails} maxWidth="md" fullWidth
    >
      <DialogTitle>API Response Details</DialogTitle>
      <DialogContent>
        {detailsContent && (
          <>
            {detailsContent.scrubbing && (
              <>
                <Typography variant="subtitle1" gutterBottom>
                  Scrubbing API Response:
                </Typography>
                <Box component="pre" sx={{ bgcolor: 'background.paper', p: 2, borderRadius: 1, 
                                         overflow: 'auto', fontSize: '0.875rem', mb: 2 }}>
                  {JSON.stringify(detailsContent.scrubbing, null, 2)}
                </Box>
              </>
            )}
            
            {detailsContent.sms && (
              <>
                <Typography variant="subtitle1" gutterBottom>
                  SMS API Response:
                </Typography>
                <Box component="pre" sx={{ bgcolor: 'background.paper', p: 2, borderRadius: 1, 
                                         overflow: 'auto', fontSize: '0.875rem' }}>
                  {typeof detailsContent.sms === 'string' 
                    ? detailsContent.sms 
                    : JSON.stringify(detailsContent.sms, null, 2)}
                </Box>
              </>
            )}
            
            {detailsContent.init_response && (
              <>
                <Typography variant="subtitle1" gutterBottom>
                  Backup API Response:
                </Typography>
                <Box component="pre" sx={{ bgcolor: 'background.paper', p: 2, borderRadius: 1, 
                                         overflow: 'auto', fontSize: '0.875rem' }}>
                  {JSON.stringify(detailsContent.init_response, null, 2)}
                </Box>
              </>
            )}
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={closeDetails}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export { ResultsDisplay, DetailsDialog };
