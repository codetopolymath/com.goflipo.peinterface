import React, { useState, useCallback } from 'react';
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
  FileUpload as UploadIcon,
  Refresh as SampleIcon
} from '@mui/icons-material';
import { useSMS } from '../../contexts/SMSContext';

const validatePhone = (num) => {
  const digits = num.replace(/\D/g, '');
  if (!num.trim()) return 'Phone number is required';
  if (digits.length < 7) return 'Too short';
  if (digits.length > 15) return 'Too long (max 15 digits)';
  return null;
};

const SingleContactEntry = () => {
  const { contacts, handleContactChange, addContact, removeContact } = useSMS();
  const [touched, setTouched] = useState({});

  const handleBlur = useCallback((index) => {
    setTouched(prev => ({ ...prev, [index]: true }));
  }, []);

  const textFieldSx = {
    flex: 1,
    minWidth: '200px',
    '& .MuiOutlinedInput-root': {
      borderRadius: 2,
      '&:hover fieldset': { borderColor: 'primary.light' },
      '&.Mui-focused fieldset': { borderColor: 'primary.main', borderWidth: '1px' }
    }
  };

  return (
    <>
      {contacts.map((contact, index) => {
        const validationError = touched[index] ? validatePhone(contact.number) : null;
        return (
        <Box
          key={index}
          sx={{
            display: 'flex',
            alignItems: 'center',
            mb: 2,
            flexWrap: 'wrap',
            gap: 1
          }}
        >
          <TextField
            sx={textFieldSx}
            label={`Phone Number ${index + 1}`}
            value={contact.number}
            onChange={(e) => handleContactChange(index, e.target.value)}
            onBlur={() => handleBlur(index)}
            error={!!validationError}
            required
            variant="outlined"
            placeholder="e.g. 9876543210"
            helperText={validationError || (index === 0 ? 'Enter number without country code prefix' : '')}
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
              }}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>

            {contact.status === 'processing' && (
              <CircularProgress size={20} thickness={5} sx={{ ml: 0.5 }} />
            )}

            {contact.status === 'success' && (
              <Chip
                icon={<CheckIcon fontSize="small" />}
                label="Verified"
                color="success"
                size="small"
                variant="outlined"
                sx={{ borderRadius: 1.5, '& .MuiChip-label': { px: 1 } }}
              />
            )}

            {contact.status === 'error' && (
              <Chip
                icon={<ErrorIcon fontSize="small" />}
                label="Failed"
                color="error"
                size="small"
                variant="outlined"
                sx={{ borderRadius: 1.5, '& .MuiChip-label': { px: 1 } }}
              />
            )}
          </Box>
        </Box>
        );
      })}

      <Button
        startIcon={<AddIcon />}
        onClick={addContact}
        variant="outlined"
        color="primary"
        sx={{ mt: 1 }}
      >
        Add Another Number
      </Button>
    </>
  );
};

const BulkContactEntry = () => {
  const { bulkNumbers, handleBulkNumbersChange, generateSampleNumbers } = useSMS();

  const lines = bulkNumbers.split('\n').map(l => l.trim()).filter(l => l.length > 0);
  const lineCount = lines.length;
  const invalidCount = lines.filter(l => validatePhone(l) !== null).length;

  return (
    <Box>
      <Box sx={{
        mb: 1.5,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 1
      }}>
        <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
          <ListIcon fontSize="small" color="primary" />
          One number per line
        </Typography>

        <Button
          size="small"
          startIcon={<SampleIcon />}
          onClick={generateSampleNumbers}
          variant="outlined"
          sx={{ borderRadius: 2 }}
        >
          Load Sample Data
        </Button>
      </Box>

      <TextField
        fullWidth
        multiline
        rows={6}
        placeholder={'9876543210\n8765432109\n7654321098'}
        variant="outlined"
        value={bulkNumbers}
        onChange={handleBulkNumbersChange}
        sx={{
          '& .MuiOutlinedInput-root': {
            borderRadius: 2,
            fontFamily: 'monospace',
            fontSize: '0.9rem',
            '&:hover fieldset': { borderColor: 'primary.light' },
            '&.Mui-focused fieldset': { borderColor: 'primary.main', borderWidth: '1px' }
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

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', mt: 1, gap: 1 }}>
        {invalidCount > 0 && (
          <Chip
            label={`${invalidCount} invalid`}
            size="small"
            color="error"
            variant="outlined"
            sx={{ borderRadius: 1.5 }}
          />
        )}
        <Chip
          label={`${lineCount} number${lineCount !== 1 ? 's' : ''}`}
          size="small"
          color={lineCount > 0 ? 'primary' : 'default'}
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
    <Box>
      <Tabs
        value={inputMode}
        onChange={handleTabChange}
        sx={{
          mb: 2.5,
          '& .MuiTab-root': {
            minHeight: 44,
            borderRadius: '8px 8px 0 0',
            fontSize: '0.85rem'
          },
          '& .Mui-selected': {
            backgroundColor: 'rgba(58, 134, 255, 0.06)',
            fontWeight: 600
          },
          '& .MuiTabs-indicator': {
            height: 3,
            borderRadius: '3px 3px 0 0'
          }
        }}
        indicatorColor="primary"
        textColor="primary"
      >
        <Tab icon={<PhoneIcon fontSize="small" />} iconPosition="start" label="Single" />
        <Tab icon={<ListIcon fontSize="small" />} iconPosition="start" label="Bulk" />
      </Tabs>

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
