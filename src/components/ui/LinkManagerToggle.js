import React, { useState, useEffect } from 'react';
import {
  Box, Button, Typography, Chip, CircularProgress,
  Snackbar, Alert, Paper
} from '@mui/material';
import LinkIcon from '@mui/icons-material/Link';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';

// Only renders when REACT_APP_LINK_MANAGER_ENABLED=true (set in .env.production)
const IS_LINK_MANAGER_ENABLED = process.env.REACT_APP_LINK_MANAGER_ENABLED === 'true';

const LinkManagerToggle = () => {
  const [active, setActive]     = useState(false);
  const [loading, setLoading]   = useState(true);
  const [toggling, setToggling] = useState(false);
  const [snack, setSnack]       = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    fetch('/link-manager/status')
      .then(r => r.json())
      .then(data => setActive(data.active))
      .catch(() => setSnack({ open: true, message: 'Failed to fetch link manager status', severity: 'error' }))
      .finally(() => setLoading(false));
  }, []);

  const handleToggle = async () => {
    setToggling(true);
    try {
      const r    = await fetch('/link-manager/toggle', { method: 'POST' });
      const data = await r.json();
      if (!r.ok) throw new Error(data.error || 'Toggle failed');
      setActive(data.active);
      setSnack({
        open: true,
        message: data.active ? 'Extra links added to index.html' : 'Extra links removed from index.html',
        severity: 'success'
      });
    } catch (err) {
      setSnack({ open: true, message: err.message, severity: 'error' });
    } finally {
      setToggling(false);
    }
  };

  if (!IS_LINK_MANAGER_ENABLED) return null;

  return (
    <>
      <Paper
        elevation={0}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 2,
          px: 3,
          py: 2,
          mb: 3,
          border: '1px solid',
          borderColor: active ? 'success.main' : 'divider',
          borderRadius: 2,
          flexWrap: 'wrap'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <LinkIcon color={active ? 'success' : 'disabled'} />
          <Box>
            <Typography variant="subtitle2" fontWeight={600}>
              Link Manager — Extra Cards
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Personal Capital &amp; Vanguard cards in /var/www/linkManager/index.html
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {loading ? (
            <CircularProgress size={20} />
          ) : (
            <Chip
              label={active ? 'Active' : 'Inactive'}
              color={active ? 'success' : 'default'}
              size="small"
              variant="outlined"
            />
          )}

          <Button
            variant="contained"
            size="small"
            disabled={loading || toggling}
            color={active ? 'error' : 'success'}
            startIcon={
              toggling
                ? <CircularProgress size={16} color="inherit" />
                : active
                  ? <RemoveCircleOutlineIcon />
                  : <AddCircleOutlineIcon />
            }
            onClick={handleToggle}
            sx={{ minWidth: 110, whiteSpace: 'nowrap' }}
          >
            {toggling ? 'Working…' : active ? 'Remove' : 'Add'}
          </Button>
        </Box>
      </Paper>

      <Snackbar
        open={snack.open}
        autoHideDuration={4000}
        onClose={() => setSnack(s => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnack(s => ({ ...s, open: false }))}
          severity={snack.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snack.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default LinkManagerToggle;
