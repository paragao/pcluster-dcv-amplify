import React, { useEffect, useState } from 'react';
import Amplify, { Auth, API, graphqlOperation } from 'aws-amplify'; 
import { createInstance } from '../graphql/mutations'
import { useTheme } from '@mui/material/styles';
import { TextField, Button, MenuItem, Snackbar, IconButton, Alert } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import Title from './Title';

const dcvInstances = [
    { label: 'g4dn.xlarge',  value: 'g4dn.xlarge', description: '4 vCPU, 16GB RAM, 1x T4 16GB' },
    { label: 'g4dn.2xlarge', value: 'g4dn.2xlarge', description: '8 vCPU, 32GB RAM, 1x T4 16GB' },
    { label: 'g4dn.4xlarge', value: 'g4dn.4xlarge', description: '16 vCPU, 64GB RAM, 1x T4 16GB' },
    { label: 'g4dn.8xlarge', value: 'g4dn.8xlarge', description: '32 vCPU, 128GB RAM, 1x T4 16GB' },
    { label: 'g4dn.12xlarge', value: 'g4dn.12xlarge', description: '48 vCPU, 192GB RAM, 4x T4 16GB' },
    { label: 'g4dn.16xlarge', value: 'g4dn.16xlarge', description: '64 vCPU, 256GB RAM, 1x T4 16GB' },
    { label: 'g4ad.xlarge' , value: 'g4ad.xlarge' , description: '4 vCPU, 16GB RAM, 1x V520 8GB'},
    { label: 'g4ad.2xlarge', value: 'g4ad.2xlarge', description: '8 vCPU, 32GB RAM, 1x V520 8GB' },
    { label: 'g4ad.4xlarge', value: 'g4ad.4xlarge', description: '16 vCPU, 64GB RAM, 1x V520 8GB'},
    { label: 'g4ad.8xlarge', value: 'g4ad.8xlarge', description: '32 vCPU, 128GB RAM, 2x V520 8GB' },
    { label: 'g4ad.16xlarge', value: 'g4ad.16xlarge', description: '64 vCPU, 256GB RAM, 4x V520 8GB' },
    { label: 'g3s.xlarge' ,  value: 'g3s.xlarge' , description: '4 vCPU, 30.5GB RAM, 1x M60 8GB'},
    { label: 'g3.4xlarge' ,  value: 'g3.4xlarge' , description: '16 vCPU, 122GB RAM, 1x M60 8GB'},
    { label: 'g3.8xlarge' ,  value: 'g3.8xlarge' , description: '32 vCPU, 244GB RAM, 2x M60 8GB'},
    { label: 'g3.16xlarge',  value: 'g3.16xlarge', description: '64 vCPU, 488GB RAM, 4x M60 8GB' }
];

const templates = [{ 
  label: 'default template',
  id: 'lt-03b94cfa63f21e082'
}];

const initialState = { 
    instanceType: 'g4dn.xlarge', 
    name: '',
    launchTemplate: ''
}

const initialSeverity = {
  message: '',
  severity: ''
}

export default function CreateForm() {
  
  const theme = useTheme();

  const [formState, setFormState] = useState(initialState)
  const [instances, setInstances] = useState([])
  const [snackOpen, setSnackOpen] = useState(false);
  const [snackSeverity, setSnackSeverity] = useState(initialSeverity);

  useEffect(() => {
      currentUser()
  }, [])

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setSnackOpen(false);
  };

  const open = () => {
    setSnackOpen(true)
    setSnackSeverity(initialSeverity)
  }

  const action = (
    <>
      <IconButton 
        size="small"
        aria-label="close"
        color="inherit"
        onClick={handleClose}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </>
  );

  function setSeverity(key, value) {
    setSnackSeverity({ ...snackSeverity, [key]: value })
  }

  function setInput(key, value) {
    setFormState({ ...formState, [key]: value })
  }

  async function currentUser() {
    const user = await Auth.currentAuthenticatedUser()
      .then(data => setInput('userID', data.attributes.sub))
      .catch(err => console.log(err));
  }

  async function addInstances() { 
    try {
      if (!formState.instanceType || !formState.launchTemplate) {
        setSeverity('message', 'must fill out required parameters')
        setSeverity('severity', 'warning')
        setSnackOpen(true)
        console.warn('either instanceType or launchTemplate were not defined')
        return ('Fill out the required parameters before clicking the create instance button')
      }
      const instance = { ...formState }
      setInstances([...instances, instance])
      setFormState(initialState)
      currentUser()
      await API.graphql(graphqlOperation(createInstance, {input: instance}))
      setSeverity('message', 'instance created successfully');
      setSeverity('severity', 'success');
      setSnackOpen(true)
    } catch (err) { 
      console.error('error creating instance:', err)
      setSeverity('message', 'error creating instance')
      setSeverity('severity', 'error')
      setSnackOpen(true)
    }
  }

  return (
    <>
      <Title>Create new instances by filling out this form: </Title>
      <TextField
        sx={{
          m: 1,
        }}
        id="instanceType"
        label="Instance Type"
        variant="outlined"
        select
        value={formState.instanceType}
        onChange={event => setInput('instanceType', event.target.value)}
        >
        {dcvInstances.map((dcvInstance, index) => (
            <MenuItem value={dcvInstance.value} key={index}>{dcvInstance.label}&nbsp;<i>({dcvInstance.description})</i></MenuItem>
        ))}
      </TextField>
      <TextField 
        sx={{
          m: 1,
        }}
        id="instanceName" 
        label="Name" 
        variant="outlined" 
        onChange={event => setInput('name', event.target.value)}
        value={formState.name}
      />
      <TextField 
        sx={{
          m: 1,
        }}
        id="launchTemplate" 
        label="Launch Template" 
        variant="outlined" 
        select
        required
        onChange={event => setInput('launchTemplate', event.target.value)}
        value={formState.launchTemplate}
      >
        {templates.map((template, index) => (
            <MenuItem value={template.id} key={index}>{template.label}</MenuItem>
        ))}
      </TextField>
      <input
        hidden
        value={formState.userID}
        placeholder="userID" 
      />
      <Button variant="contained" onClick={addInstances}>Create Instance</Button>
      <Snackbar 
        open={snackOpen}
        autoHideDuration={10000}
        onClose={handleClose}
        message={snackSeverity.message}
        action={action}
        sx={{ position: 'relative', top: 0}}
      >
        <Alert onClose={handleClose} severity={snackSeverity.severity} sx={{ width: '100%' }}>
          {snackSeverity.message}
        </Alert>
      </Snackbar>
    </>
  );
}