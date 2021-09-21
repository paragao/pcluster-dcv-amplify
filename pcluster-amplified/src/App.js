import './App.css';
import React, { useEffect, useState } from 'react';
import Amplify, { API, graphqlOperation, Auth } from 'aws-amplify'; 
import { createInstance, updateInstance } from './graphql/mutations'
import { onCreateInstance } from './graphql/subscriptions'
import { withAuthenticator } from '@aws-amplify/ui-react';

import { Grid, Paper, Box, Button, FormControl, MenuItem, TextField } from '@mui/material';
import { createTheme, ThemeProvider, styled } from '@mui/material/styles';
import AppBar from './Components/AppBar.js';
import Cards from './Components/InstanceCards.js';

const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  textAlign: 'center',
  color: theme.palette.text.secondary,
  height: 60,
  lineHeight: '60px',
}));

const lightTheme = createTheme({ palette: { mode: 'light' }});

const initialState = { 
  instanceType: 'g4dn.xlarge'
}

const dcvInstances = [
  { label: 'g4dn.xlarge' },
  { label: 'g4dn.2xlarge' },
  { label: 'g4dn.4xlarge' },
  { label: 'g4dn.8xlarge' },
  { label: 'g4dn.12xlarge' },
  { label: 'g4dn.16xlarge' },
  { label: 'g4ad.xlarge' },
  { label: 'g4ad.2xlarge' },
  { label: 'g4ad.4xlarge'},
  { label: 'g4ad.8xlarge' },
  { label: 'g4ad.16xlarge' },
  { label: 'g3s.xlarge' },
  { label: 'g3.4xlarge' },
  { label: 'g3.8xlarge' },
  { label: 'g3.16xlarge' }
];

function App() {

  const [formState, setFormState] = useState(initialState)
  const [instances, setInstances] = useState([])

  useEffect(() => {
    currentUser()
  }, [])

  function setInput(key, value) {
    setFormState({ ...formState, [key]: value })
  }

  async function addInstances() { 
    try {
      if (!formState.instanceType) return
      const instance = { ...formState }
      setInstances([...instances, instance])
      setFormState(initialState)
      await API.graphql(graphqlOperation(createInstance, {input: instance}))
    } catch (err) { console.log('error creating instance:', err)}
  }

  async function currentUser() {
    const user = await Auth.currentAuthenticatedUser()
      .then(data => setInput('userID', data.attributes.sub))
      .catch(err => console.log(err));
  }

  return (
    <>
    <AppBar />
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <ThemeProvider theme={lightTheme}>
          <Box
            sx={{
              p: 2,
              bgcolor: 'background.default',
              display: 'grid',
              gap: 2,
            }}
          >
            <TextField
              id="instanceType"
              label="Instance Type"
              variant="outlined"
              value={formState.instanceType}
              onChange={event => setInput('instanceType', event.target.value)}
            >
              {dcvInstances.map((dcvInstance, index) => (
                <MenuItem value={dcvInstance.label}>{dcvInstance.label}</MenuItem>
              ))}
            </TextField>
            <TextField 
              id="instanceName" 
              label="Name" 
              variant="outlined" 
              onChange={event => setInput('name', event.target.value)}
              value={formState.name}
            />
            <input
              hidden
              value={formState.userID}
              placeholder="userID" 
            />
          <Button variant="contained" onClick={addInstances}>Create Instance</Button>
        </Box>
        </ThemeProvider>
      </Grid>
    </Grid>
    <hr />
    <Cards />
    </>
  );
}

//const styles = {
//  container: { width: 1024, margin: '0 auto', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: 20 },
//  instance: {  marginBottom: 15 },
//  input: { border: 'none', backgroundColor: '#ddd', marginBottom: 10, padding: 8, fontSize: 18 },
//  instanceType: { fontSize: 20, fontWeight: 'bold' },
//  instanceDescription: { marginBottom: 0 },
//  button: { backgroundColor: 'black', color: 'white', outline: 'none', fontSize: 18, padding: '12px 0px' }
//}

//export default App;
export default withAuthenticator(App);
