import React from 'react';
import { 
  Grid, TextField, InputAdornment, MenuItem, 
  Box, Chip, Typography
} from '@mui/material';
import { 
  Language as LanguageIcon,
  Route as RouteIcon,
  AccountCircle as UserIcon,
  Badge as BadgeIcon,
  Email as EmailIcon,
  Message as MessageIcon,
  Category as CategoryIcon
} from '@mui/icons-material';
import { useSMS } from '../../contexts/SMSContext';

const MessageTypeSelector = () => {
  const { messageType, handleMessageTypeChange, MESSAGE_TEMPLATES } = useSMS();
  
  return (
    <Grid item xs={12}>
      <TextField
        select
        fullWidth
        label="Message Type"
        value={messageType}
        onChange={handleMessageTypeChange}
        variant="outlined"
        margin="normal"
        InputProps={{ 
          startAdornment: <InputAdornment position="start"><CategoryIcon /></InputAdornment> 
        }}
        sx={{
          '& .MuiOutlinedInput-root': {
            '&.Mui-focused fieldset': {
              borderColor: 'primary.main',
              borderWidth: '1px',
            },
          }
        }}
      >
        {Object.keys(MESSAGE_TEMPLATES).map((type) => (
          <MenuItem key={type} value={type}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography variant="body1">{type}</Typography>
              <Chip
                label="Template"
                color="primary"
                size="small"
                variant="outlined"
                sx={{ ml: 1, height: 20, fontSize: '0.7rem' }}
              />
            </Box>
          </MenuItem>
        ))}
      </TextField>
    </Grid>
  );
};

const SMSForm = () => {
  const { apiMode, formData, handleChange } = useSMS();
  
  // Enhanced text field style
  const textFieldSx = {
    '& .MuiOutlinedInput-root': {
      '&:hover fieldset': {
        borderColor: 'primary.light',
      },
      '&.Mui-focused fieldset': {
        borderColor: 'primary.main',
        borderWidth: '1px',
      }
    },
    '& .MuiInputLabel-root': {
      '&.Mui-focused': {
        color: 'primary.main',
      }
    }
  };
  
  return (
    <Grid container spacing={3}>
      {/* Message type selector for backup mode */}
      {apiMode === 'backup' && <MessageTypeSelector />}
      
      {/* First row */}
      <Grid item xs={12} sm={4}>
        <TextField
          fullWidth 
          label="Coverage Code" 
          name="coverage" 
          value={formData.coverage}
          onChange={handleChange} 
          required 
          variant="outlined" 
          margin="normal"
          disabled={apiMode === 'backup'}
          InputProps={{ 
            startAdornment: (
              <InputAdornment position="start">
                <LanguageIcon color={apiMode === 'backup' ? 'disabled' : 'primary'} />
              </InputAdornment>
            ) 
          }}
          sx={textFieldSx}
        />
      </Grid>
      <Grid item xs={12} sm={4}>
        <TextField
          fullWidth 
          label="Route ID" 
          name="routes" 
          value={formData.routes}
          onChange={handleChange} 
          required 
          variant="outlined" 
          margin="normal"
          disabled={apiMode === 'backup'}
          InputProps={{ 
            startAdornment: (
              <InputAdornment position="start">
                <RouteIcon color={apiMode === 'backup' ? 'disabled' : 'primary'} />
              </InputAdornment>
            ) 
          }}
          sx={textFieldSx}
        />
      </Grid>
      <Grid item xs={12} sm={4}>
        <TextField
          fullWidth 
          label="Sender ID" 
          name="senderid" 
          value={formData.senderid}
          onChange={handleChange} 
          required 
          variant="outlined" 
          margin="normal"
          InputProps={{ 
            startAdornment: (
              <InputAdornment position="start">
                <UserIcon color="primary" />
              </InputAdornment>
            ) 
          }}
          sx={textFieldSx}
        />
      </Grid>
      
      {/* Second row */}
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth 
          label="Principal Entity ID" 
          name="pe_id" 
          value={formData.pe_id}
          onChange={handleChange} 
          required 
          variant="outlined" 
          margin="normal"
          helperText={
            <Typography 
              variant="caption" 
              color="text.secondary"
              sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
            >
              Default: 1501550540000010698
            </Typography>
          }
          InputProps={{ 
            startAdornment: (
              <InputAdornment position="start">
                <BadgeIcon color="primary" />
              </InputAdornment>
            ) 
          }}
          sx={textFieldSx}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth 
          label="Content ID" 
          name="content_id" 
          value={formData.content_id}
          onChange={handleChange} 
          required 
          variant="outlined" 
          margin="normal"
          helperText={
            <Typography 
              variant="caption" 
              color="text.secondary"
              sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
            >
              Default: 1507167577648640421
            </Typography>
          }
          InputProps={{ 
            startAdornment: (
              <InputAdornment position="start">
                <EmailIcon color="primary" />
              </InputAdornment>
            ) 
          }}
          sx={textFieldSx}
        />
      </Grid>
      
      {/* Message field */}
      <Grid item xs={12}>
        <TextField
          fullWidth 
          label="Message Content" 
          name="message" 
          value={formData.message}
          onChange={handleChange} 
          required 
          variant="outlined" 
          margin="normal"
          multiline 
          rows={4} 
          helperText={
            <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
              <Typography variant="caption" color="text.secondary">
                {formData.message.length} characters
              </Typography>
              <Chip 
                label={formData.message.length > 160 ? "Multi-part SMS" : "Single SMS"} 
                size="small" 
                color={formData.message.length > 160 ? "secondary" : "success"}
                variant="outlined"
                sx={{ height: 20, fontSize: '0.7rem' }}
              />
            </Box>
          }
          InputProps={{ 
            startAdornment: (
              <InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 1.5 }}>
                <MessageIcon color="primary" />
              </InputAdornment>
            ) 
          }}
          sx={textFieldSx}
        />
      </Grid>
    </Grid>
  );
};

export default SMSForm;
