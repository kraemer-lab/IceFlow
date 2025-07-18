import React, { useEffect, useState } from 'react';
import {
  Button,
  Container,
  Paper,
  Stack,
  TextField,
  Typography,
  Box,
  Grid,
  Snackbar,
  Alert
} from '@mui/material';
import { API } from '../services/api.js';

export default function LibraryPage({
  repoUrl,
  setRepoUrl,
  targetDir,
  drawerOpen,
  setTargetDir,
  setFolderPath,
  addToLauncherQueue,
  logMessage
}) {
  const [repos, setRepos] = useState([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    (async () => {
      const list = await API.getCollections();
      console.log('Fetched collections:', list);
      setRepos(list);
    })();
  }, []);

  return (
    <Container sx={{ pb: 12 }}>
      {' '}
      {/* extra space for fixed log */}
      <Stack spacing={3}>
        <Typography variant="h6">Local Repositories</Typography>
        <Grid container spacing={2}>
          {repos.map((repo) => (
            /* @ts-ignore */
            <Grid item xs={12} sm={6} md={4} key={repo.path}>
              <Paper variant="outlined" sx={{ p: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                  {repo.name}
                </Typography>
                <Stack direction="row" spacing={1}>
                  <Button
                    id={`collections-run-${repo.name}`}
                    size="small"
                    variant="contained"
                    onClick={() => addToLauncherQueue(repo)}
                  >
                    Run
                  </Button>
                  <Button
                    id={`collections-sync-${repo.name}`}
                    size="small"
                    variant="outlined"
                    onClick={async () => {
                      try {
                        const result = await API.syncRepo(repo.path);
                        if (result?.status === 'ok') {
                          logMessage('Repo synced', 'success');
                        } else {
                          throw new Error(result?.message || 'Unknown sync failure');
                        }
                      } catch (err) {
                        console.error(err);
                        logMessage('Sync failed', 'error');
                      }
                    }}
                  >
                    Sync
                  </Button>
                </Stack>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Stack>
    </Container>
  );
}
