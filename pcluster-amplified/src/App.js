import './App.css';
import React, { useEffect, useState } from 'react';
import Amplify, { Auth } from 'aws-amplify';
import { withAuthenticator } from '@aws-amplify/ui-react';
import { Grid, Paper, Box, Typography, Link, CssBaseline, Container } from '@mui/material';
import { createTheme, ThemeProvider, styled } from '@mui/material/styles';
import AppBarDrawer from './Components/AppBar';
import Cards from './Components/InstanceCards';
import CreateInstances from './Components/CreateForm';

const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  textAlign: 'center',
  color: theme.palette.text.secondary,
  height: 60,
  lineHeight: '60px',
}));

const lightTheme = createTheme({ palette: { mode: 'light' }});
const darkTheme = createTheme({ palette: { mode: 'dark' }});

function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="https://aws.amazon.com">
        Amazon Web Services
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

function App() {

  useEffect(() => {
  }, [])

  return (
    <>
    <ThemeProvider theme={darkTheme}>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <AppBarDrawer />
        <Box 
          component="main"
          sx={{
            backgroundColor: (theme) => 
              theme.palette.mode === 'light'
                ? theme.palette.grey[100]
                : theme.palette.grey[900],
            flexGrow: 1,
            height: '100vh',
            overflow: 'auto',
          }}
        >
          <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Grid container spacing={3}>
              <Grid item xs={6} md={4} lg={6}>
                <Paper 
                  sx={{
                    p: 2,
                    mt: 4,
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'relative'
                  }}
                >
                  <CreateInstances />
                </Paper>
              </Grid>
              <Grid item xs={6} md={4} lg={6}>
                <Paper 
                  sx={{
                    p: 2,
                    mt: 4,
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <p>placeholder</p>
                </Paper>
              </Grid>
              <Grid item xs={12}>
                <Paper
                  sx={{
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <Cards />
                </Paper>
              </Grid>
            </Grid>
            <Copyright sx={{ pt: 4 }} />
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
    </>
  );
}

//export default App;
export default withAuthenticator(App);
