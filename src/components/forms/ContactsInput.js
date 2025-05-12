import React from 'react';
import { 
  Box, TextField, Typography, Button, IconButton, Chip, InputAdornment,
  CircularProgress, Tabs, Tab
} from '@mui/material';
import { 
  Phone as PhoneIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Check as CheckIcon,
  Error as ErrorIcon,
  FormatListNumbered as ListIcon,
  FileCopy as CopyIcon,
  FileUpload as UploadIcon
} from '@mui/icons-material';
import { useSMS } from '../../contexts/SMSContext';

const SingleContactEntry = () => {
  const { contacts, handleContactChange, addContact, removeContact } = useSMS();
  
  // Improved text field style
  const textFieldSx = {
    flex: 1, 
    minWidth: '200px',
    '& .MuiOutlinedInput-root': {
      borderRadius: 2,
      '&:hover fieldset': {
        borderColor: 'primary.light',
      },
      '&.Mui-focused fieldset': {
        borderColor: 'primary.main',
        borderWidth: '1px',
      }
    }
  };

  return (
    <>
      {contacts.map((contact, index) => (
        <Box 
          key={index} 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            mb: 2.5, 
            flexWrap: 'wrap', 
            gap: 1,
            position: 'relative',
            transition: 'all 0.2s ease'
          }}
        >
          <TextField
            sx={textFieldSx}
            label={`Phone Number ${index + 1}`}
            value={contact.number}
            onChange={(e) => handleContactChange(index, e.target.value)}
            required 
            variant="outlined" 
            placeholder="Enter phone number with country code"
            helperText={index === 0 ? "Include country code (e.g., +1 for US)" : ""}
            InputProps={{ 
              startAdornment: (
                <InputAdornment position="start">
                  <PhoneIcon color="primary" fontSize="small" />
                </InputAdornment>
              ) 
            }}
          />
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <IconButton 
              color="error" 
              onClick={() => removeContact(index)}
              disabled={contacts.length === 1} 
              size="small"
              sx={{ 
                border: '1px solid',
                borderColor: contacts.length === 1 ? 'transparent' : 'error.light',
                '&:hover': {
                  backgroundColor: 'error.lighter',
                }
              }}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
            
            {contact.status === 'processing' && (
              <CircularProgress 
                size={24} 
                thickness={5}
                sx={{ ml: 1 }} 
              />
            )}
            
            {contact.status === 'success' && (
              <Chip 
                icon={<CheckIcon fontSize="small" />} 
                label="Sent" 
                color="success" 
                size="small" 
                variant="outlined"
                sx={{ 
                  borderRadius: 1.5,
                  '& .MuiChip-label': { px: 1 } 
                }}
              />
            )}
            
            {contact.status === 'error' && (
              <Chip 
                icon={<ErrorIcon fontSize="small" />} 
                label="Failed" 
                color="error" 
                size="small" 
                variant="outlined"
                sx={{ 
                  borderRadius: 1.5,
                  '& .MuiChip-label': { px: 1 } 
                }}
              />
            )}
          </Box>
        </Box>
      ))}
      
      <Button
        startIcon={<AddIcon />} onClick={addContact}
        variant="outlined" color="primary" sx={{ mt: 1 }}
      >
        Add Another Contact
      </Button>
    </>
  );
};

const BulkContactEntry = () => {
  const { bulkNumbers, handleBulkNumbersChange, generateSampleNumbers } = useSMS();
  
  return (
    <Box sx={{ mb: 2 }}>
      <Box sx={{ 
        mb: 2, 
        display: 'flex', 
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap'
      }}>
        <Typography 
          variant="body2" 
          color="text.secondary" 
          sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
        >
          <ListIcon fontSize="small" color="primary" />
          Enter multiple phone numbers (one per line)
        </Typography>
        
        <Button 
          size="small" 
          startIcon={<CopyIcon />}
          onClick={generateSampleNumbers} 
          variant="outlined"
          sx={{ 
            borderRadius: 2,
            textTransform: 'none',
            mt: { xs: 1, sm: 0 },
            ml: { xs: 0, sm: 'auto' }
          }}
        >
          Generate Sample Data
        </Button>
      </Box>
      
      <TextField
        fullWidth 
        multiline 
        rows={6} 
        placeholder="e.g.,
+1234567890
+1987654321
+449876543210"
        variant="outlined" 
        margin="normal"
        value={bulkNumbers}
        onChange={handleBulkNumbersChange}
        sx={{
          '& .MuiOutlinedInput-root': {
            borderRadius: 2,
            fontFamily: 'monospace',
            fontSize: '0.9rem',
            '&:hover fieldset': {
              borderColor: 'primary.light',
            },
            '&.Mui-focused fieldset': {
              borderColor: 'primary.main',
              borderWidth: '1px',
            }
          }
        }}
        InputProps={{ 
          startAdornment: (
            <InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 1.5 }}>
              <UploadIcon color="primary" />
            </InputAdornment>
          ) 
        }}
      />
      
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'flex-end',
        alignItems: 'center',
        mt: 1
      }}>
        <Chip 
          label={`${bulkNumbers.split('\n').filter(line => line.trim().length > 0).length} numbers`} 
          size="small" 
          color="primary"
          variant="outlined"
          sx={{ borderRadius: 1.5 }}
        />
      </Box>
    </Box>
  );
};

const ContactsInput = () => {
  const { inputMode, handleTabChange } = useSMS();
  
  return (
    <Box sx={{ mb: 3 }}>
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        mb: 2, 
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        borderBottom: '1px solid',
        borderColor: 'divider',
        pb: 1
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <PhoneIcon sx={{ mr: 1.5, color: 'primary.main' }} />
          <Typography variant="h6" fontWeight={500} color="text.primary">
            Recipients
          </Typography>
        </Box>
        
        <Typography 
          variant="body2" 
          color="text.secondary" 
          sx={{ 
            mt: { xs: 1, sm: 0 },
            fontStyle: 'italic'
          }}
        >
          Choose a method to enter your recipient numbers
        </Typography>
      </Box>
      
      {/* Tabs for switching between input modes */}
      <Tabs 
        value={inputMode} 
        onChange={handleTabChange} 
        sx={{ 
          mb: 3,
          '& .MuiTab-root': {
            minHeight: 48,
            borderRadius: '8px 8px 0 0',
          },
          '& .Mui-selected': {
            backgroundColor: 'rgba(25, 118, 210, 0.05)',
            fontWeight: 500
          },
          '& .MuiTabs-indicator': {
            height: 3,
            borderRadius: '3px 3px 0 0'
          }
        }}
        indicatorColor="primary" 
        textColor="primary"
      >
        <Tab 
          icon={<PhoneIcon fontSize="small" />} 
          iconPosition="start" 
          label="Single Entry" 
        />
        <Tab 
          icon={<ListIcon fontSize="small" />} 
          iconPosition="start" 
          label="Bulk Entry" 
        />
      </Tabs>
      
      {/* Input mode content */}
      <Box sx={{ 
        p: 2, 
        bgcolor: 'background.default',
        borderRadius: 2,
        border: '1px solid',
        borderColor: 'divider'
      }}>
        {inputMode === 0 ? <SingleContactEntry /> : <BulkContactEntry />}
      </Box>
    </Box>
  );
};

export default ContactsInput;
