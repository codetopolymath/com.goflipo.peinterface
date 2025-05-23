import React, { memo } from 'react';
import {
  Box, Button, FormControl, Select, MenuItem, Typography, Chip, CircularProgress
} from '@mui/material';
import {
  Send as SendIcon,
  Category as CategoryIcon
} from '@mui/icons-material';
import { useSMS } from '../../contexts/SMSContext';

// Memoized send button component for primary mode
const PrimarySendButton = memo(({ loading, handleSubmit }) => (
  <Button
    type="submit" 
    variant="contained" 
    color="primary" 
    startIcon={loading ? 
      <CircularProgress size={20} color="inherit" /> : 
      <SendIcon />
    }
    disabled={loading}
    sx={{ 
      px: 3,
      boxShadow: 2
    }}
  >
    {loading ? 'Processing...' : 'Send SMS'}
  </Button>
));

// Main component optimized with memoization
const CompactSendWithTemplate = () => {
  const { 
    handleSubmit, 
    response, 
    apiMode, 
    messageType, 
    handleMessageTypeChange, 
    MESSAGE_TEMPLATES 
  } = useSMS();

  // For primary mode, use memoized send button
  if (apiMode !== 'backup') {
    return <PrimarySendButton loading={response.loading} handleSubmit={handleSubmit} />;
  }

  // For backup mode, show optimized template selector with send button
  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: { xs: 'column', sm: 'row' },
      alignItems: { xs: 'stretch', sm: 'center' },
      gap: 2,
      p: 2,
      bgcolor: 'background.default',
      borderRadius: 2,
      border: '1px solid',
      borderColor: 'divider'
    }}>
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: 1,
        flex: 1
      }}>
        <CategoryIcon color="primary" sx={{ fontSize: 20 }} />
        <Typography variant="body2" color="text.secondary" sx={{ minWidth: 'fit-content' }}>
          Template:
        </Typography>
        <FormControl size="small" sx={{ minWidth: 150, flex: 1 }}>
          <Select
            value={messageType}
            onChange={handleMessageTypeChange}
            variant="outlined"
            displayEmpty
            sx={{
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: 'primary.light',
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: 'primary.main',
              },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: 'primary.main',
              }
            }}
          >
            {Object.keys(MESSAGE_TEMPLATES).map((type) => (
              <MenuItem key={type} value={type}>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between', 
                  width: '100%' 
                }}>
                  <Typography variant="body2">{type}</Typography>
                  <Chip
                    label="T"
                    color="primary"
                    size="small"
                    variant="outlined"
                    sx={{ ml: 1, height: 16, fontSize: '0.6rem', minWidth: 16, '& .MuiChip-label': { px: 0.5 } }}
                  />
                </Box>
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      
      <Button
        type="submit" 
        variant="contained" 
        color="primary" 
        startIcon={response.loading ? 
          <CircularProgress size={20} color="inherit" /> : 
          <SendIcon />
        }
        disabled={response.loading}
        sx={{ 
          px: 3,
          boxShadow: 2,
          minWidth: { xs: '100%', sm: 'auto' }
        }}
      >
        {response.loading ? 'Processing...' : 'Send SMS'}
      </Button>
    </Box>
  );
};

export default memo(CompactSendWithTemplate);
