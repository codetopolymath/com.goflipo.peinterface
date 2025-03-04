// App.js - Material UI Implementation
import React, { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Box,
  AppBar,
  Toolbar,
  IconButton,
  Divider,
  Card,
  CardContent,
  CardHeader,
  Alert,
  Chip,
  InputAdornment,
  List,
  ListItem,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  useTheme,
  ThemeProvider,
  createTheme
} from '@mui/material';
import {
  Send as SendIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  Check as CheckIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
  Phone as PhoneIcon,
  Message as MessageIcon,
  Language as LanguageIcon,
  AccountCircle as UserIcon,
  Route as RouteIcon,
  Badge as BadgeIcon,
  Email as EmailIcon
} from '@mui/icons-material';

// Configure API base URL
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5002/api';

// Custom theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#3f51b5',
    },
    secondary: {
      main: '#f50057',
    },
    success: {
      main: '#4caf50',
    },
    error: {
      main: '#f44336'
    },
    background: {
      default: '#f5f5f5',
    }
  },
  typography: {
    fontFamily: [
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif'
    ].join(','),
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          textTransform: 'none',
        },
      },
    },
  },
});

function App() {
  // State for form inputs with default values
  const [formData, setFormData] = useState({
    coverage: '91',
    routes: '116',
    senderid: 'SANJUP',
    pe_id: '1501550540000010698',
    content_id: '1507167577648640421',
    message: 'Thank you for showing interest, for more information please click on below link {#var#} Sanjay'
  });

  // State for contacts
  const [contacts, setContacts] = useState([{ number: '8459188977', status: 'pending', result: null }]);
  
  // State for response messages
  const [response, setResponse] = useState({
    loading: false,
    success: false,
    error: null,
    message: '',
  });

  // State for details dialog
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [detailsContent, setDetailsContent] = useState(null);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Handle contact number changes
  const handleContactChange = (index, value) => {
    const updatedContacts = [...contacts];
    updatedContacts[index].number = value;
    setContacts(updatedContacts);
  };

  // Add new contact field
  const addContact = () => {
    setContacts([...contacts, { number: '', status: 'pending', result: null }]);
  };

  // Remove contact field
  const removeContact = (index) => {
    if (contacts.length > 1) {
      const updatedContacts = contacts.filter((_, i) => i !== index);
      setContacts(updatedContacts);
    }
  };

  // Process a single contact
  const processContact = async (contact, index) => {
    try {
      // Update contact status
      const updatedContacts = [...contacts];
      updatedContacts[index].status = 'processing';
      setContacts(updatedContacts);
      
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
        const successUpdatedContacts = [...contacts];
        successUpdatedContacts[index].status = 'success';
        successUpdatedContacts[index].result = {
          scrubbing: scrubbingResponse,
          sms: smsResponse
        };
        setContacts(successUpdatedContacts);
        
        return true;
      } else {
        throw new Error('Failed to get valid authcode from scrubbing API');
      }
    } catch (error) {
      // Update contact with error
      const errorUpdatedContacts = [...contacts];
      errorUpdatedContacts[index].status = 'error';
      errorUpdatedContacts[index].error = error.message;
      setContacts(errorUpdatedContacts);
      
      return false;
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
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
    const resetContacts = contacts.map(contact => ({
      ...contact,
      status: 'pending',
      result: null,
      error: null
    }));
    setContacts(resetContacts);
    
    // Process each contact
    let successCount = 0;
    let errorCount = 0;
    
    for (let i = 0; i < contacts.length; i++) {
      const success = await processContact(contacts[i], i);
      if (success) {
        successCount++;
      } else {
        errorCount++;
      }
    }
    
    // Set final response
    setResponse({
      loading: false,
      success: successCount > 0,
      error: errorCount > 0 ? `Failed to send SMS to ${errorCount} contact(s)` : null,
      message: `Successfully sent SMS to ${successCount} out of ${contacts.length} contact(s)`
    });
  };

  // Fetch from scrubbing logs API through proxy
  const fetchScrubbingLogs = async (data) => {
    const params = new URLSearchParams();
    
    // Add query parameters
    params.append('coverage', data.coverage);
    params.append('routes', data.routes);
    params.append('senderid', data.senderid);
    params.append('pe_id', data.pe_id);
    params.append('number', data.number);
    params.append('content_id', data.content_id);
    params.append('message', data.message);

    const response = await fetch(`${API_BASE_URL}/scrubbing-logs?${params.toString()}`);

    if (!response.ok) {
      throw new Error(`Scrubbing API error: ${response.status}`);
    }

    return await response.json();
  };

  // Send SMS using the second API through proxy
  const sendSMS = async (data, authcode) => {
    const params = new URLSearchParams();
    
    // Add query parameters
    params.append('key', '566321AF6EB69D');
    params.append('campaign', '245');
    params.append('routeid', data.routes);
    params.append('type', 'text');
    params.append('contacts', data.number);
    params.append('peid', data.pe_id);
    params.append('cid', data.content_id);
    params.append('contentid', data.content_id);
    params.append('senderid', data.senderid);
    params.append('authcode', authcode);
    params.append('msg', data.message);

    const response = await fetch(`${API_BASE_URL}/send-sms?${params.toString()}`);

    if (!response.ok) {
      throw new Error(`SMS API error: ${response.status}`);
    }

    return await response.json();
  };

  // Reset the form and contacts
  const resetForm = () => {
    setFormData({
      coverage: '91',
      routes: '116',
      senderid: 'SANJUP',
      pe_id: '1501550540000010698',
      content_id: '1507167577648640421',
      message: ''
    });
    setContacts([{ number: '8459188977', status: 'pending', result: null }]);
    setResponse({
      loading: false,
      success: false,
      error: null,
      message: '',
    });
  };

  // Show details dialog
  const showDetails = (data) => {
    setDetailsContent(data);
    setDetailsOpen(true);
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ flexGrow: 1, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <AppBar position="static" color="primary">
          <Toolbar>
            <SendIcon sx={{ mr: 2 }} />
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              SMS Sender Application
            </Typography>
          </Toolbar>
        </AppBar>
        
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4, flexGrow: 1 }}>
          <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
            <Typography variant="h5" component="h2" gutterBottom>
              Send SMS Message
            </Typography>
            
            <Box component="form" onSubmit={handleSubmit} noValidate>
              <Grid container spacing={3}>
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
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LanguageIcon />
                        </InputAdornment>
                      ),
                    }}
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
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <RouteIcon />
                        </InputAdornment>
                      ),
                    }}
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
                          <UserIcon />
                        </InputAdornment>
                      ),
                    }}
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
                    helperText="Default: 1501550540000010698"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <BadgeIcon />
                        </InputAdornment>
                      ),
                    }}
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
                    helperText="Default: 1507167577648640421"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <EmailIcon />
                        </InputAdornment>
                      ),
                    }}
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
                    helperText={`${formData.message.length} characters`}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <MessageIcon />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
              </Grid>
              
              <Divider sx={{ my: 3 }} />
              
              {/* Contact numbers section */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                  <PhoneIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Contact Numbers
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Enter one or multiple phone numbers to send the SMS
                </Typography>
                
                {contacts.map((contact, index) => (
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
                      sx={{ flex: 1, minWidth: '200px' }}
                      label={`Phone Number ${index + 1}`}
                      value={contact.number}
                      onChange={(e) => handleContactChange(index, e.target.value)}
                      required
                      variant="outlined"
                      placeholder="Enter phone number"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <PhoneIcon />
                          </InputAdornment>
                        ),
                      }}
                    />
                    
                    <IconButton 
                      color="error" 
                      onClick={() => removeContact(index)}
                      disabled={contacts.length === 1}
                      size="small"
                    >
                      <DeleteIcon />
                    </IconButton>
                    
                    {contact.status === 'processing' && (
                      <CircularProgress size={24} />
                    )}
                    
                    {contact.status === 'success' && (
                      <Chip 
                        icon={<CheckIcon />} 
                        label="Sent" 
                        color="success" 
                        size="small" 
                        variant="outlined"
                      />
                    )}
                    
                    {contact.status === 'error' && (
                      <Chip 
                        icon={<ErrorIcon />} 
                        label="Failed" 
                        color="error" 
                        size="small" 
                        variant="outlined" 
                      />
                    )}
                  </Box>
                ))}
                
                <Button
                  startIcon={<AddIcon />}
                  onClick={addContact}
                  variant="outlined"
                  color="primary"
                  sx={{ mt: 1 }}
                >
                  Add Another Contact
                </Button>
              </Box>
              
              <Divider sx={{ my: 3 }} />
              
              {/* Action buttons */}
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                <Button
                  variant="outlined"
                  onClick={resetForm}
                  disabled={response.loading}
                >
                  Reset Form
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
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
              
              {contacts.some(contact => contact.status === 'success' || contact.status === 'error') && (
                <Box sx={{ mt: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    Results
                  </Typography>
                  
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
                                <Button 
                                  size="small" 
                                  onClick={() => showDetails(contact.result)}
                                  sx={{ mt: 1 }}
                                >
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
              )}
            </Paper>
          )}
        </Container>
        
        {/* Footer */}
        <Box 
          component="footer" 
          sx={{ 
            py: 3, 
            px: 2, 
            mt: 'auto',
            backgroundColor: (theme) => theme.palette.primary.main,
            color: 'white'
          }}
        >
          <Container maxWidth="lg">
            <Typography variant="body2" align="center">
              SMS Sender Application &copy; {new Date().getFullYear()}
            </Typography>
          </Container>
        </Box>
        
        {/* Details Dialog */}
        <Dialog
          open={detailsOpen}
          onClose={() => setDetailsOpen(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>API Response Details</DialogTitle>
          <DialogContent>
            {detailsContent && (
              <>
                <Typography variant="subtitle1" gutterBottom>
                  Scrubbing API Response:
                </Typography>
                <Box 
                  component="pre"
                  sx={{ 
                    bgcolor: 'background.paper',
                    p: 2,
                    borderRadius: 1,
                    overflow: 'auto',
                    fontSize: '0.875rem',
                    mb: 2
                  }}
                >
                  {JSON.stringify(detailsContent.scrubbing, null, 2)}
                </Box>
                
                <Typography variant="subtitle1" gutterBottom>
                  SMS API Response:
                </Typography>
                <Box 
                  component="pre"
                  sx={{ 
                    bgcolor: 'background.paper',
                    p: 2,
                    borderRadius: 1,
                    overflow: 'auto',
                    fontSize: '0.875rem'
                  }}
                >
                  {JSON.stringify(detailsContent.sms, null, 2)}
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