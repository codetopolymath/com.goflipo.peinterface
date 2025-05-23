import React, { useState } from 'react';
import {
  Button, ButtonGroup, Grow, Paper, Popper, MenuList, MenuItem,
  ClickAwayListener, Box, Typography, Chip, Divider, CircularProgress
} from '@mui/material';
import {
  Send as SendIcon,
  ArrowDropDown as ArrowDropDownIcon,
  Category as CategoryIcon
} from '@mui/icons-material';
import { useSMS } from '../../contexts/SMSContext';

const AdvancedSendButton = () => {
  const { 
    handleSubmit, 
    response, 
    apiMode, 
    messageType, 
    handleMessageTypeChange, 
    MESSAGE_TEMPLATES 
  } = useSMS();
  
  const [open, setOpen] = useState(false);
  const anchorRef = React.useRef(null);

  const handleMenuItemClick = (type) => {
    const event = {
      target: {
        value: type
      }
    };
    handleMessageTypeChange(event);
    setOpen(false);
  };

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setOpen(false);
  };

  // For primary mode, just show regular send button
  if (apiMode !== 'backup') {
    return (
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
          boxShadow: 2
        }}
      >
        {response.loading ? 'Processing...' : 'Send SMS'}
      </Button>
    );
  }

  // For backup mode, show advanced button with template selector
  return (
    <>
      <ButtonGroup 
        variant="contained" 
        ref={anchorRef} 
        aria-label="split button"
        sx={{ boxShadow: 2 }}
      >
        <Button
          type="submit"
          color="primary"
          startIcon={response.loading ? 
            <CircularProgress size={20} color="inherit" /> : 
            <SendIcon />
          }
          disabled={response.loading}
          sx={{ px: 3 }}
        >
          {response.loading ? 'Processing...' : `Send SMS (${messageType})`}
        </Button>
        <Button
          color="primary"
          size="small"
          aria-controls={open ? 'split-button-menu' : undefined}
          aria-expanded={open ? 'true' : undefined}
          aria-label="change message template"
          aria-haspopup="menu"
          onClick={handleToggle}
          disabled={response.loading}
          sx={{ px: 1 }}
        >
          <ArrowDropDownIcon />
        </Button>
      </ButtonGroup>
      <Popper
        sx={{
          zIndex: 1300,
        }}
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
        placement="top-end"
      >
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin:
                placement === 'bottom' ? 'center top' : 'center bottom',
            }}
          >
            <Paper
              elevation={8}
              sx={{
                mt: 1,
                minWidth: 300,
                maxHeight: 400,
                overflow: 'auto'
              }}
            >
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList id="split-button-menu" autoFocusItem>
                  <Box sx={{ px: 2, py: 1 }}>
                    <Typography 
                      variant="subtitle2" 
                      color="primary" 
                      sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: 1, 
                        fontWeight: 600 
                      }}
                    >
                      <CategoryIcon fontSize="small" />
                      Quick Template Change
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Select a template and send immediately
                    </Typography>
                  </Box>
                  <Divider />
                  {Object.keys(MESSAGE_TEMPLATES).map((type) => (
                    <MenuItem
                      key={type}
                      selected={type === messageType}
                      onClick={() => handleMenuItemClick(type)}
                      sx={{
                        py: 1.5,
                        px: 2,
                        '&.Mui-selected': {
                          backgroundColor: 'primary.50',
                          '&:hover': {
                            backgroundColor: 'primary.100'
                          }
                        }
                      }}
                    >
                      <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'space-between', 
                        width: '100%' 
                      }}>
                        <Box>
                          <Typography variant="body2" fontWeight={type === messageType ? 600 : 400}>
                            {type}
                          </Typography>
                          <Typography 
                            variant="caption" 
                            color="text.secondary"
                            sx={{ 
                              display: 'block',
                              maxWidth: 200,
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap'
                            }}
                          >
                            {MESSAGE_TEMPLATES[type]}
                          </Typography>
                        </Box>
                        <Box sx={{ ml: 1 }}>
                          {type === messageType && (
                            <Chip
                              label="Active"
                              color="primary"
                              size="small"
                              variant="filled"
                              sx={{ height: 20, fontSize: '0.65rem' }}
                            />
                          )}
                        </Box>
                      </Box>
                    </MenuItem>
                  ))}
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </>
  );
};

export default AdvancedSendButton;
