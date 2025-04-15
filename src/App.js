// App.js - SMS Sender with Direct API Integration (No Server)
import React, { useState } from 'react';
import {
  Container, Paper, Typography, TextField, Button, Grid, Box, AppBar,
  Toolbar, IconButton, Divider, Card, CardContent, CardHeader, Alert,
  Chip, InputAdornment, Dialog, DialogTitle, DialogContent, DialogActions,
  CircularProgress, ThemeProvider, createTheme, Tabs, Tab, Snackbar
} from '@mui/material';
import {
  Send as SendIcon, Add as AddIcon, Delete as DeleteIcon, Check as CheckIcon,
  Error as ErrorIcon, Phone as PhoneIcon, Message as MessageIcon,
  Language as LanguageIcon, AccountCircle as UserIcon, Route as RouteIcon,
  Badge as BadgeIcon, Email as EmailIcon, FormatListNumbered as ListIcon,
  FileCopy as CopyIcon, Warning as WarningIcon
} from '@mui/icons-material';

// API URLs - Direct implementation without proxy
const SCRUBBING_API_URL = 'https://smartping-backend.goflipo.com/api/main/scrubbing-logs';
const SMS_API_URL = 'https://relit.in/app/smsapisr/index.php';

// Default form values
const DEFAULT_FORM_DATA = {
  coverage: '91',
  routes: '116',
  senderid: 'SANJUP',
  pe_id: '1501550540000010698',
  content_id: '1507167577648640421',
  message: 'Thank you for showing interest, for more information please click on below link {#var#} Sanjay'
};

// Default contact
const DEFAULT_CONTACT = { number: '8459188977', status: 'pending', result: null };

// Theme configuration
const theme = createTheme({
  palette: {
    primary: { main: '#3f51b5' },
    secondary: { main: '#f50057' },
    success: { main: '#4caf50' },
    error: { main: '#f44336' },
    background: { default: '#f5f5f5' }
  },
  typography: {
    fontFamily: 'Roboto, "Helvetica Neue", Arial, sans-serif'
  },
  components: {
    MuiPaper: { styleOverrides: { root: { borderRadius: 8 } } },
    MuiButton: { styleOverrides: { root: { borderRadius: 4, textTransform: 'none' } } }
  }
});

function App() {
  // State hooks
  const [formData, setFormData] = useState(DEFAULT_FORM_DATA);
  const [contacts, setContacts] = useState([DEFAULT_CONTACT]);
  const [response, setResponse] = useState({ loading: false, success: false, error: null, message: '' });
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [detailsContent, setDetailsContent] = useState(null);
  const [inputMode, setInputMode] = useState(0);
  const [bulkNumbers, setBulkNumbers] = useState('');
  const [corsError, setCorsError] = useState(false);

  // Event handlers
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleContactChange = (index, value) => {
    const updatedContacts = [...contacts];
    updatedContacts[index].number = value;
    setContacts(updatedContacts);
  };

  const handleBulkNumbersChange = (e) => setBulkNumbers(e.target.value);

  const handleTabChange = (event, newValue) => {
    setInputMode(newValue);
    
    // If switching to single mode, keep the first number if available
    if (newValue === 0 && contacts.length > 0) {
      setContacts([contacts[0]]);
    }
    
    // If switching to bulk mode, populate the text area with existing numbers
    if (newValue === 1) {
      const numbersText = contacts.map(contact => contact.number).join('\n');
      setBulkNumbers(numbersText);
    }
  };

  // Actions
  const addContact = () => setContacts(prev => [...prev, { number: '', status: 'pending', result: null }]);

  const removeContact = (index) => {
    if (contacts.length > 1) {
      setContacts(prev => prev.filter((_, i) => i !== index));
    }
  };

  const generateSampleNumbers = () => {
    setBulkNumbers("9876543210\n8765432109\n7654321098\n6543210987\n5432109876");
  };

  const showDetails = (data) => {
    setDetailsContent(data);
    setDetailsOpen(true);
  };

  const resetForm = () => {
    setFormData(DEFAULT_FORM_DATA);
    setContacts([DEFAULT_CONTACT]);
    setBulkNumbers('');
    setResponse({ loading: false, success: false, error: null, message: '' });
  };

  // Process bulk numbers from textarea
  const processBulkNumbers = () => {
    // Split by newline and filter out empty lines
    const numbers = bulkNumbers
      .split('\n')
      .map(num => num.trim())
      .filter(num => num.length > 0);
    
    if (numbers.length === 0) {
      setResponse({
        loading: false,
        success: false,
        error: "Please enter at least one phone number",
        message: "Please enter at least one phone number"
      });
      return false;
    }
    
    // Convert to contact objects
    const newContacts = numbers.map(number => ({
      number,
      status: 'pending',
      result: null
    }));
    
    setContacts(newContacts);
    return true;
  };

  // Direct API Calls without server proxy
  const fetchScrubbingLogs = async (data) => {
    try {
      const params = new URLSearchParams();
      
      // Add query parameters
      Object.entries(data).forEach(([key, value]) => {
        params.append(key, value);
      });

      const response = await fetch(`${SCRUBBING_API_URL}?${params.toString()}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        // Add CORS mode to handle cross-origin requests
        mode: 'cors',
        // Use credentials if the API requires cookies/auth
        // credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`Scrubbing API error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      // Check if this is a CORS error
      if (error.message.includes('Failed to fetch') || 
          error.message.includes('NetworkError') || 
          error.message.includes('CORS')) {
        setCorsError(true);
        throw new Error('CORS Error: Unable to access the API directly from the browser. Consider using a CORS browser extension or proxy.');
      }
      throw error;
    }
  };

  const sendSMS = async (data, authcode) => {
    try {
      const params = new URLSearchParams({
        key: '566321AF6EB69D',
        campaign: '245',
        routeid: data.routes,
        type: 'text',
        contacts: data.number,
        peid: data.pe_id,
        cid: data.content_id,
        contentid: data.content_id,
        senderid: data.senderid,
        authcode: authcode,
        msg: data.message
      });

      const response = await fetch(`${SMS_API_URL}?${params.toString()}`, {
        method: 'GET',
        headers: {
          'Accept': '*/*', // Accept any content type
          'Content-Type': 'application/json'
        },
        mode: 'cors',
        // credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`SMS API error: ${response.status}`);
      }

      // Get text response instead of json
      const textResponse = await response.text();
      
      // Check if the response starts with SMS-SHOOT-ID pattern
      if (textResponse.startsWith('SMS-SHOOT-ID')) {
        return {
          success: true,
          smsShootId: textResponse,
          // Return the raw text for display
          rawResponse: textResponse
        };
      } else {
        // If not in expected format, try to parse as JSON
        // or return as is if that fails
        try {
          return JSON.parse(textResponse);
        } catch (e) {
          // If it can't be parsed as JSON, return as text
          return {
            success: true,
            rawResponse: textResponse
          };
        }
      }
    } catch (error) {
      // Check if this is a CORS error
      if (error.message.includes('Failed to fetch') || 
          error.message.includes('NetworkError') || 
          error.message.includes('CORS')) {
        setCorsError(true);
        throw new Error('CORS Error: Unable to access the API directly from the browser. Consider using a CORS browser extension or proxy.');
      }
      throw error;
    }
  };

  // Process a single contact
  const processContact = async (contact, index) => {
    try {
      // Update contact status
      setContacts(prevContacts => {
        const updated = [...prevContacts];
        updated[index].status = 'processing';
        return updated;
      });
      
      // Step 1: Call the scrubbing logs API
      const scrubbingResponse = await fetchScrubbingLogs({
        ...formData,
        number: contact.number
      });
      
      // Step 2: Extract authcode and call SMS API
      if (scrubbingResponse.status && scrubbingResponse.data && scrubbingResponse.data.authcode) {
        const authcode = scrubbingResponse.data.authcode;
        const smsResponse = await sendSMS({
          ...formData,
          number: contact.number
        }, authcode);
        
        // Update contact with success
        setContacts(prevContacts => {
          const updated = [...prevContacts];
          updated[index].status = 'success';
          updated[index].result = { scrubbing: scrubbingResponse, sms: smsResponse };
          return updated;
        });
        
        return true;
      } else {
        throw new Error('Failed to get valid authcode from scrubbing API');
      }
    } catch (error) {
      // Update contact with error
      setContacts(prevContacts => {
        const updated = [...prevContacts];
        updated[index].status = 'error';
        updated[index].error = error.message;
        return updated;
      });
      
      return false;
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Reset CORS error state
    setCorsError(false);
    
    // If in bulk mode, process the bulk numbers first
    if (inputMode === 1) {
      const success = processBulkNumbers();
      if (!success) return;
    }
    
    // Validate phone numbers
    const emptyContacts = contacts.filter(contact => !contact.number.trim());
    if (emptyContacts.length > 0) {
      setResponse({
        loading: false,
        success: false,
        error: "Please enter all contact numbers",
        message: "Please enter all contact numbers"
      });
      return;
    }
    
    setResponse({
      loading: true,
      success: false, 
      error: null,
      message: `Processing ${contacts.length} contact(s)...`
    });
    
    // Reset all contacts status
    setContacts(prevContacts => prevContacts.map(contact => ({
      ...contact,
      status: 'pending',
      result: null,
      error: null
    })));
    
    // Process each contact sequentially
    let successCount = 0;
    let errorCount = 0;
    
    for (let i = 0; i < contacts.length; i++) {
      // Check if we've already hit a CORS error and abort further processing
      if (corsError) break;
      
      const success = await processContact(contacts[i], i);
      if (success) {
        successCount++;
      } else {
        errorCount++;
        // If we encountered a CORS error, no need to continue with more contacts
        if (corsError) break;
      }
    }
    
    // Set final response
    setResponse({
      loading: false,
      success: successCount > 0,
      error: corsError 
        ? 'CORS Error: Unable to access the API directly. You may need to use the server proxy.' 
        : errorCount > 0 
          ? `Failed to send SMS to ${errorCount} contact(s)` 
          : null,
      message: corsError 
        ? 'CORS Error: Unable to access the API directly. You may need to use the server proxy.'
        : `Successfully sent SMS to ${successCount} out of ${contacts.length} contact(s)`
    });
  };

  // UI Components
  const renderFormFields = () => (
    <Grid container spacing={3}>
      {/* First row */}
      <Grid item xs={12} sm={4}>
        <TextField
          fullWidth label="Coverage Code" name="coverage" value={formData.coverage}
          onChange={handleChange} required variant="outlined" margin="normal"
          InputProps={{ startAdornment: <InputAdornment position="start"><LanguageIcon /></InputAdornment> }}
        />
      </Grid>
      <Grid item xs={12} sm={4}>
        <TextField
          fullWidth label="Route ID" name="routes" value={formData.routes}
          onChange={handleChange} required variant="outlined" margin="normal"
          InputProps={{ startAdornment: <InputAdornment position="start"><RouteIcon /></InputAdornment> }}
        />
      </Grid>
      <Grid item xs={12} sm={4}>
        <TextField
          fullWidth label="Sender ID" name="senderid" value={formData.senderid}
          onChange={handleChange} required variant="outlined" margin="normal"
          InputProps={{ startAdornment: <InputAdornment position="start"><UserIcon /></InputAdornment> }}
        />
      </Grid>
      
      {/* Second row */}
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth label="Principal Entity ID" name="pe_id" value={formData.pe_id}
          onChange={handleChange} required variant="outlined" margin="normal"
          helperText="Default: 1501550540000010698"
          InputProps={{ startAdornment: <InputAdornment position="start"><BadgeIcon /></InputAdornment> }}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth label="Content ID" name="content_id" value={formData.content_id}
          onChange={handleChange} required variant="outlined" margin="normal"
          helperText="Default: 1507167577648640421"
          InputProps={{ startAdornment: <InputAdornment position="start"><EmailIcon /></InputAdornment> }}
        />
      </Grid>
      
      {/* Message field */}
      <Grid item xs={12}>
        <TextField
          fullWidth label="Message Content" name="message" value={formData.message}
          onChange={handleChange} required variant="outlined" margin="normal"
          multiline rows={4} helperText={`${formData.message.length} characters`}
          InputProps={{ startAdornment: <InputAdornment position="start"><MessageIcon /></InputAdornment> }}
        />
      </Grid>
    </Grid>
  );

  const renderSingleEntry = () => (
    <>
      {contacts.map((contact, index) => (
        <Box 
          key={index} 
          sx={{ display: 'flex', alignItems: 'center', mb: 2, flexWrap: 'wrap', gap: 1 }}
        >
          <TextField
            sx={{ flex: 1, minWidth: '200px' }}
            label={`Phone Number ${index + 1}`}
            value={contact.number}
            onChange={(e) => handleContactChange(index, e.target.value)}
            required variant="outlined" placeholder="Enter phone number"
            InputProps={{ startAdornment: <InputAdornment position="start"><PhoneIcon /></InputAdornment> }}
          />
          
          <IconButton 
            color="error" onClick={() => removeContact(index)}
            disabled={contacts.length === 1} size="small"
          >
            <DeleteIcon />
          </IconButton>
          
          {contact.status === 'processing' && <CircularProgress size={24} />}
          
          {contact.status === 'success' && (
            <Chip icon={<CheckIcon />} label="Sent" color="success" size="small" variant="outlined" />
          )}
          
          {contact.status === 'error' && (
            <Chip icon={<ErrorIcon />} label="Failed" color="error" size="small" variant="outlined" />
          )}
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

  const renderBulkEntry = () => (
    <Box sx={{ mb: 2 }}>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        Enter one phone number per line
      </Typography>
      
      <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
        <Button
          startIcon={<CopyIcon />} variant="outlined" size="small"
          onClick={generateSampleNumbers}
        >
          Show Example
        </Button>
      </Box>
      
      <TextField
        fullWidth multiline rows={8} variant="outlined"
        placeholder="Enter phone numbers (one per line)"
        value={bulkNumbers} onChange={handleBulkNumbersChange}
        InputProps={{ startAdornment: <InputAdornment position="start"><ListIcon /></InputAdornment> }}
      />
      
      <Typography 
        variant="caption" color="text.secondary" align="right" display="block" sx={{ mt: 1 }}
      >
        {bulkNumbers.split('\n').filter(line => line.trim().length > 0).length} numbers entered
      </Typography>
    </Box>
  );

  const renderResults = () => (
    <Box sx={{ mt: 3 }}>
      <Typography variant="h6" gutterBottom>Results</Typography>
      
      <Grid container spacing={2}>
        {contacts.map((contact, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card 
              variant="outlined" 
              sx={{ 
                borderLeft: 5,
                borderColor: contact.status === 'success' 
                  ? 'success.main' 
                  : contact.status === 'error' 
                  ? 'error.main' 
                  : 'primary.main'
              }}
            >
              <CardHeader
                title={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <PhoneIcon fontSize="small" />
                    <Typography variant="body1" fontWeight="medium">
                      {contact.number}
                    </Typography>
                  </Box>
                }
                action={
                  <Chip 
                    label={
                      contact.status === 'success' ? 'Sent' : 
                      contact.status === 'error' ? 'Failed' :
                      contact.status === 'processing' ? 'Processing' : 'Pending'
                    }
                    color={
                      contact.status === 'success' ? 'success' : 
                      contact.status === 'error' ? 'error' : 'default'
                    }
                    size="small"
                  />
                }
              />
              <CardContent>
                {contact.status === 'success' && contact.result && (
                  <>
                    <Typography variant="body2" color="text.secondary">
                      AuthCode: {contact.result.scrubbing?.data?.authcode}
                    </Typography>
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
          </Grid>
        ))}
      </Grid>
    </Box>
  );

  // Render CORS information
  const renderCorsInfo = () => (
    <Alert 
      severity="warning" 
      icon={<WarningIcon />}
      sx={{ mb: 3 }}
    >
      <Typography variant="subtitle1" component="div">
        CORS Error Detected
      </Typography>
      <Typography variant="body2" component="div">
        This application is making direct API calls which may be blocked by browser security policies.
        Options to fix this:
      </Typography>
      <Box component="ul" sx={{ pl: 2, mt: 1 }}>
        <li>Install a CORS browser extension (development only)</li>
        <li>Run the server proxy from the server folder</li>
        <li>Configure the target APIs to allow your origin</li>
      </Box>
    </Alert>
  );

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ flexGrow: 1, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <AppBar position="static" color="primary">
          <Toolbar>
            <SendIcon sx={{ mr: 2 }} />
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              SMS Sender Application
            </Typography>
          </Toolbar>
        </AppBar>
        
        {/* Main Content */}
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4, flexGrow: 1 }}>
          {/* CORS Warning if needed */}
          {corsError && renderCorsInfo()}
          
          {/* Form */}
          <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
            <Typography variant="h5" component="h2" gutterBottom>
              Send SMS Message
            </Typography>
            
            <Box component="form" onSubmit={handleSubmit} noValidate>
              {renderFormFields()}
              
              <Divider sx={{ my: 3 }} />
              
              {/* Contact numbers section */}
              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <PhoneIcon sx={{ mr: 1 }} />
                  <Typography variant="h6">Contact Numbers</Typography>
                </Box>
                
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Enter one or multiple phone numbers to send the SMS
                </Typography>
                
                {/* Tabs for switching between input modes */}
                <Tabs 
                  value={inputMode} onChange={handleTabChange} sx={{ mb: 2 }}
                  indicatorColor="primary" textColor="primary"
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
                {inputMode === 0 ? renderSingleEntry() : renderBulkEntry()}
              </Box>
              
              <Divider sx={{ my: 3 }} />
              
              {/* Action buttons */}
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                <Button
                  variant="outlined" onClick={resetForm} disabled={response.loading}
                >
                  Reset Form
                </Button>
                <Button
                  type="submit" variant="contained" color="primary" 
                  startIcon={response.loading ? <CircularProgress size={20} color="inherit" /> : <SendIcon />}
                  disabled={response.loading}
                >
                  {response.loading ? 'Processing...' : 'Send SMS'}
                </Button>
              </Box>
            </Box>
          </Paper>
          
          {/* Response container */}
          {response.message && (
            <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
              <Alert 
                severity={response.error ? "error" : response.success ? "success" : "info"}
                sx={{ mb: 2 }}
              >
                {response.message}
              </Alert>
              
              {contacts.some(contact => contact.status === 'success' || contact.status === 'error') && 
                renderResults()
              }
            </Paper>
          )}
        </Container>
        
        {/* Footer */}
        <Box 
          component="footer" 
          sx={{ py: 3, px: 2, mt: 'auto', backgroundColor: 'primary.main', color: 'white' }}
        >
          <Container maxWidth="lg">
            <Typography variant="body2" align="center">
              SMS Sender Application &copy; {new Date().getFullYear()}
            </Typography>
          </Container>
        </Box>
        
        {/* Details Dialog */}
        <Dialog
          open={detailsOpen} onClose={() => setDetailsOpen(false)} maxWidth="md" fullWidth
        >
          <DialogTitle>API Response Details</DialogTitle>
          <DialogContent>
            {detailsContent && (
              <>
                <Typography variant="subtitle1" gutterBottom>
                  Scrubbing API Response:
                </Typography>
                <Box component="pre" sx={{ bgcolor: 'background.paper', p: 2, borderRadius: 1, 
                                         overflow: 'auto', fontSize: '0.875rem', mb: 2 }}>
                  {JSON.stringify(detailsContent.scrubbing, null, 2)}
                </Box>
                
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
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDetailsOpen(false)}>Close</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </ThemeProvider>
  );
}

export default App;