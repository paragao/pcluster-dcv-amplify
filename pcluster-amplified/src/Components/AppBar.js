import React from 'react';
import { Auth } from 'aws-amplify';

// Material-UI imports
import { styled } from '@mui/material/styles';
import { AppBar, Box, Toolbar, Typography, Button, IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
//////////////////////

export default function BasicAppBar() {

    async function signOut() {
        try { 
          if (!Auth.currentAuthenticatedUser()) return
          await Auth.signOut();
        } catch (error) { 
          console.log('error signing out: ', error);
        }
    }

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
                <Toolbar>
                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        sx={{ mr: 2 }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1}}>
                        Managed DCV Instances
                    </Typography>
                    <Button color="inherit" onClick={signOut}>{(!Auth.currentAuthenticatedUser()) ? 'Login' : 'Logout'}</Button>
                </Toolbar>
            </AppBar>
        </Box>
    );
}