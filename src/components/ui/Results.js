import React, { memo } from 'react';
import {
  Box, Paper, Typography, Card, CardContent,
  Chip, Button, Grid, Alert, Dialog, DialogTitle,
  DialogContent, DialogActions, Grow, useTheme, alpha, Divider
} from '@mui/material';
import {
  Phone as PhoneIcon,
  CheckCircle as SuccessIcon,
  Error as ErrorIcon,
  HourglassEmpty as PendingIcon,
  Refresh as ProcessingIcon,
  VpnKey as AuthcodeIcon,
  Verified as VerifiedIcon
} from '@mui/icons-material';
import { useSMS } from '../../contexts/SMSContext';

const getStatusConfig = (status, theme) => {
  switch (status) {
    case 'success':
      return {
        icon: <SuccessIcon fontSize="small" />,
        label: 'Verified',
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

const ResultCard = memo(({ contact, index }) => {
  const { showDetails } = useSMS();
  const theme = useTheme();
  const statusConfig = getStatusConfig(contact.status, theme);
  const authcode = contact.result?.init_response?.data?.authcode;
  const verifyStatus = contact.result?.verify_response?.status;

  return (
    <Grid item xs={12} sm={6} md={4}>
      <Grow in={true} style={{ transformOrigin: '0 0 0' }} timeout={Math.min((index + 1) * 150, 600)}>
        <Card
          variant="outlined"
          className="result-card-hover"
          sx={{
            borderRadius: 2,
            borderColor: `${statusConfig.color}.light`,
            overflow: 'hidden',
          }}
        >
          {/* Card header strip */}
          <Box sx={{
            px: 2,
            py: 1,
            bgcolor: statusConfig.bgColor,
            borderBottom: '1px solid',
            borderColor: 'divider',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
              {statusConfig.icon}
              <Typography variant="body2" fontWeight={600} color={`${statusConfig.color}.dark`}>
                {statusConfig.label}
              </Typography>
            </Box>
            <Chip
              icon={<PhoneIcon sx={{ fontSize: '14px !important' }} />}
              label={contact.number}
              size="small"
              variant="outlined"
              sx={{ borderRadius: 1, fontSize: '0.72rem', maxWidth: 150 }}
            />
          </Box>

          {/* Card body */}
          <CardContent sx={{ pt: 1.5, pb: '12px !important' }}>
            {contact.status === 'success' && contact.result && (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {authcode && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                    <AuthcodeIcon fontSize="small" color="primary" sx={{ opacity: 0.7 }} />
                    <Typography variant="caption" color="text.secondary" fontWeight={500}>
                      Authcode:
                    </Typography>
                    <Typography variant="caption" sx={{ fontFamily: 'monospace', wordBreak: 'break-all' }}>
                      {authcode}
                    </Typography>
                  </Box>
                )}
                {verifyStatus !== undefined && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                    <VerifiedIcon fontSize="small" color={verifyStatus ? 'success' : 'error'} sx={{ opacity: 0.8 }} />
                    <Typography variant="caption" color="text.secondary" fontWeight={500}>
                      Verify:
                    </Typography>
                    <Chip
                      label={verifyStatus ? 'Passed' : 'Rejected'}
                      size="small"
                      color={verifyStatus ? 'success' : 'error'}
                      variant="outlined"
                      sx={{ height: 18, fontSize: '0.65rem', '& .MuiChip-label': { px: 0.75 } }}
                    />
                  </Box>
                )}
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => showDetails(contact.result)}
                  sx={{ mt: 0.5, alignSelf: 'flex-start', py: 0.25, fontSize: '0.75rem' }}
                >
                  View Full Response
                </Button>
              </Box>
            )}

            {contact.status === 'error' && (
              <Typography variant="caption" color="error.main" sx={{ wordBreak: 'break-word' }}>
                {contact.error}
              </Typography>
            )}

            {(contact.status === 'pending' || contact.status === 'processing') && (
              <Typography variant="caption" color="text.disabled">
                {contact.status === 'processing' ? 'Calling API...' : 'Waiting...'}
              </Typography>
            )}
          </CardContent>
        </Card>
      </Grow>
    </Grid>
  );
});

const ResultsDisplay = () => {
  const { response, contacts } = useSMS();

  const hasActivity = contacts.some(c => c.status !== 'pending') || response.loading;

  if (!response.message && !hasActivity) return null;

  return (
    <Paper elevation={0} variant="outlined" sx={{ p: 3, mb: 4, borderRadius: 2 }}>
      {response.message && (
        <Alert
          severity={response.error ? 'error' : response.success ? 'success' : 'info'}
          sx={{ mb: hasActivity ? 2 : 0, borderRadius: 1.5 }}
        >
          {response.message}
        </Alert>
      )}

      {hasActivity && (
        <Box sx={{ mt: response.message ? 2 : 0 }}>
          <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2, fontWeight: 500 }}>
            Results ({contacts.filter(c => c.status === 'success').length}/{contacts.length} verified)
          </Typography>
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

const ResponseSection = ({ title, data }) => {
  if (!data) return null;
  return (
    <Box sx={{ mb: 2 }}>
      <Typography variant="subtitle2" fontWeight={600} gutterBottom>
        {title}
      </Typography>
      <Box
        component="pre"
        sx={{
          bgcolor: 'background.default',
          border: '1px solid',
          borderColor: 'divider',
          p: 2,
          borderRadius: 1.5,
          overflow: 'auto',
          fontSize: '0.8rem',
          fontFamily: '"Fira Code", "Consolas", monospace',
          lineHeight: 1.6,
          maxHeight: 280,
          m: 0
        }}
      >
        {JSON.stringify(data, null, 2)}
      </Box>
    </Box>
  );
};

const DetailsDialog = () => {
  const { detailsOpen, detailsContent, closeDetails } = useSMS();

  return (
    <Dialog open={detailsOpen} onClose={closeDetails} maxWidth="md" fullWidth>
      <DialogTitle sx={{ fontWeight: 600, pb: 1 }}>
        API Response Details
      </DialogTitle>
      <Divider />
      <DialogContent sx={{ pt: 2 }}>
        {detailsContent && (
          <>
            <ResponseSection title="Scrubbing Response (Init)" data={detailsContent.init_response} />
            <ResponseSection title="Verify Response" data={detailsContent.verify_response} />
          </>
        )}
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={closeDetails} variant="outlined">Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export { ResultsDisplay, DetailsDialog };
