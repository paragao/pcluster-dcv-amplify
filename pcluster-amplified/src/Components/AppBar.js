import React, { useState } from 'react';
import { Auth } from 'aws-amplify';
import { styled } from '@mui/material/styles';
import { Box, Toolbar, Typography, Button, IconButton, Divider, List } from '@mui/material';
import MuiAppBar from '@mui/material/AppBar';
import MenuIcon from '@mui/icons-material/Menu';
import MuiDrawer from '@mui/material/Drawer';
import { mainListItems, secondaryListItems } from './listItems';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';

const drawerWidth = 240;

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme, open }) => ({
      '& .MuiDrawer-paper': {
        position: 'relative',
        whiteSpace: 'nowrap',
        width: drawerWidth,
        transition: theme.transitions.create('width', {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.enteringScreen,
        }),
        boxSizing: 'border-box',
        ...(!open && {
          overflowX: 'hidden',
          transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
          width: theme.spacing(7),
          [theme.breakpoints.up('sm')]: {
            width: theme.spacing(9),
          },
        }),
      },
    }),
  );

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
  })(({ theme, open }) => ({
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
      marginLeft: drawerWidth,
      width: `calc(100% - ${drawerWidth}px)`,
      transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    }),
  }));

export default function BasicAppBar() {

    const [open, setOpen] = useState(true);
    const toggleDrawer = () => {
        setOpen(!open);
      };

    async function signOut() {
        try { 
          if (!Auth.currentAuthenticatedUser()) return
          await Auth.signOut();
        } catch (error) { 
          console.log('error signing out: ', error);
        }
    }

    return (
        <>
        <AppBar sx={{ position: 'absolute' }} open={open}>
            <Toolbar sx={{ pr: '24px' }}>
                <IconButton
                  edge="start"
                  color="inherit"
                  aria-label="open drawer"
                  onClick={toggleDrawer}
                  sx={{
                    marginRight: '36px',
                    ...(open && { display: 'none' }),
                }}
                >
                    <MenuIcon />
                </IconButton>
                <Typography 
                    variant="h6" 
                    component="h1" 
                    color="inherit"
                    noWrap
                    sx={{ flexGrow: 1}}
                >
                    Managed DCV Instances
                </Typography>
                <Button color="inherit" onClick={signOut}>{(!Auth.currentAuthenticatedUser()) ? 'Login' : 'Logout'}</Button>
            </Toolbar>
        </AppBar>
        <Drawer variant="permanent" open={open}>
          <Toolbar
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              px: [1],
            }}
          >
            <IconButton onClick={toggleDrawer}>
              <ChevronLeftIcon />
            </IconButton>
          </Toolbar>
        <Divider />
          <List>{mainListItems}</List>
        <Divider />
          <List>{secondaryListItems}</List>
      </Drawer>
      </>
    );
}