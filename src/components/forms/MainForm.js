import React, { memo } from 'react';
import { 
  Paper, Typography, Box, Button, 
  Card, CardContent, alpha, useTheme, Fade, Zoom
} from '@mui/material';
import { 
  RestartAlt as ResetIcon,
  Send as SendIcon
} from '@mui/icons-material';
import { useSMS } from '../../contexts/SMSContext';
import SMSForm from './SMSForm';
import ContactsInput from './ContactsInput';
import CompactSendWithTemplate from '../ui/CompactSendWithTemplate';

// Memoized Card component to prevent unnecessary re-renders
const FormCard = memo(({ title, children }) => {
  const theme = useTheme();
  
  return (
    <Card
      variant="outlined"
      sx={{ 
        mb: 4,
        background: theme.palette.background.default,
        borderColor: alpha(theme.palette.primary.main, 0.1)
      }}
    >
      <CardContent sx={{ p: { xs: 2, md: 3 } }}>
        <Typography 
          variant="subtitle1" 
          component="h3"
          sx={{ 
            mb: 2, 
            fontWeight: 500,
            color: 'text.primary'
          }}
        >
          {title}
        </Typography>
        {children}
      </CardContent>
    </Card>
  );
});

// Memoized Reset Button to prevent unnecessary re-renders
const ResetButton = memo(({ onClick, disabled }) => (
  <Button
    variant="outlined" 
    onClick={onClick} 
    disabled={disabled}
    startIcon={<ResetIcon />}
    sx={{ px: 3 }}
  >
    Reset
  </Button>
));

// Main Form Component optimized for performance
const MainForm = () => {
  const { resetForm, handleSubmit, response } = useSMS();
  const theme = useTheme();
  
  return (
    <Zoom in={true} style={{ transitionDelay: '100ms' }}>
      <Paper 
        elevation={0}
        sx={{ 
          p: 0, 
          mb: 4,
          overflow: 'hidden',
          border: '1px solid',
          borderColor: 'divider',
        }}
      >
        {/* Header Section */}
        <Box 
          sx={{ 
            p: { xs: 2, md: 3 }, 
            pb: { xs: 2, md: 2 },
            borderBottom: '1px solid',
            borderColor: 'divider',
            background: `linear-gradient(to right, ${alpha(theme.palette.primary.main, 0.05)}, ${alpha(theme.palette.primary.main, 0.01)})`,
          }}
        >
          <Typography 
            variant="h5" 
            component="h2" 
            sx={{ 
              fontWeight: 600,
              color: 'primary.main',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <SendIcon sx={{ mr: 1.5, opacity: 0.7 }} fontSize="medium" />
            Scrubbing Verification
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mt: 0.5, maxWidth: '600px' }}
          >
            Fill in the message details and recipient numbers, then send to trigger the scrubbing and verify flow.
          </Typography>
        </Box>
        
        {/* Form Content */}
        <Box 
          component="form" 
          onSubmit={handleSubmit} 
          noValidate
          sx={{ 
            p: { xs: 2, sm: 3 },
            pt: { xs: 2, md: 3 }
          }}
        >
          {/* Message Details Card */}
          <FormCard title="Message Details">
            <SMSForm />
          </FormCard>
          
          {/* Recipients Card */}
          <FormCard title="Recipients">
            <ContactsInput />
          </FormCard>
          
          {/* Action buttons with enhanced send functionality */}
          <Fade in={true} style={{ transitionDelay: '200ms' }}>
            <Box 
              sx={{ 
                display: 'flex', 
                flexDirection: 'column',
                gap: 2,
                mt: 3 
              }}
            >
              <Box sx={{
                display: 'flex', 
                justifyContent: 'flex-end', 
                gap: 2,
                alignItems: 'center'
              }}>
                <ResetButton onClick={resetForm} disabled={response.loading} />
                <CompactSendWithTemplate />
              </Box>
            </Box>
          </Fade>
        </Box>
      </Paper>
    </Zoom>
  );
};

export default memo(MainForm);
