import React, { useEffect, useState } from 'react';
import Amplify, { Auth, API, graphqlOperation } from 'aws-amplify'; 
import { createInstance } from '../graphql/mutations'
import { useTheme } from '@mui/material/styles';
import { TextField, Button, MenuItem } from '@mui/material';

const dcvInstances = [
    { value: 'g4dn.xlarge', label: '4 vCPU, 16GB RAM, 1x T4 16GB' },
    { value: 'g4dn.2xlarge', label: '8 vCPU, 32GB RAM, 1x T4 16GB' },
    { value: 'g4dn.4xlarge', label: '16 vCPU, 64GB RAM, 1x T4 16GB' },
    { value: 'g4dn.8xlarge', label: '32 vCPU, 128GB RAM, 1x T4 16GB' },
    { value: 'g4dn.12xlarge', label: '48 vCPU, 192GB RAM, 4x T4 16GB' },
    { value: 'g4dn.16xlarge', label: '64 vCPU, 256GB RAM, 1x T4 16GB' },
    { value: 'g4ad.xlarge' , label: '4 vCPU, 16GB RAM, 1x V520 8GB'},
    { value: 'g4ad.2xlarge', label: '8 vCPU, 32GB RAM, 1x V520 8GB' },
    { value: 'g4ad.4xlarge', label: '16 vCPU, 64GB RAM, 1x V520 8GB'},
    { value: 'g4ad.8xlarge', label: '32 vCPU, 128GB RAM, 2x V520 8GB' },
    { value: 'g4ad.16xlarge', label: '64 vCPU, 256GB RAM, 4x V520 8GB' },
    { value: 'g3s.xlarge' , label: '4 vCPU, 30.5GB RAM, 1x M60 8GB'},
    { value: 'g3.4xlarge' , label: '16 vCPU, 122GB RAM, 1x M60 8GB'},
    { value: 'g3.8xlarge' , label: '32 vCPU, 244GB RAM, 2x M60 8GB'},
    { value: 'g3.16xlarge', label: '64 vCPU, 488GB RAM, 4x M60 8GB' }
];

const initialState = { 
    instanceType: 'g4dn.xlarge'
}

export default function CreateForm() {
  
  const theme = useTheme();

  const [formState, setFormState] = useState(initialState)
  const [instances, setInstances] = useState([])

  useEffect(() => {
      currentUser()
  }, [])

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
      if (!formState.instanceType) return
      const instance = { ...formState }
      setInstances([...instances, instance])
      setFormState(initialState)
      await API.graphql(graphqlOperation(createInstance, {input: instance}))
    } catch (err) { console.log('error creating instance:', err)}
  }

  return (
      
    <>
        <TextField
            id="instanceType"
            label="Instance Type"
            variant="outlined"
            select
            value={formState.instanceType}
            onChange={event => setInput('instanceType', event.target.value)}
            >
            {dcvInstances.map((dcvInstance, index) => (
                <MenuItem value={dcvInstance.value}>{dcvInstance.label}</MenuItem>
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
    </>
  );
}