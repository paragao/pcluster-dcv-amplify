import React, { useState, useEffect } from 'react';
import { Grid, Paper, Button, Typography } from '@mui/material';
import { API, graphqlOperation } from 'aws-amplify'; 
import { listInstances } from '../graphql/queries';
import { onCreateInstance } from '../graphql/subscriptions';

export default function BasicCard() {

    const [instances, setInstances] = useState([])

    const subscription = API.graphql(graphqlOperation(onCreateInstance))
    .subscribe({
        next: (instanceData) => {
            console.log(instanceData.value.data)
            const newInstance = instanceData.value.data.onCreateInstance
            setInstances([...instances, newInstance])
        },
        error: err => console.warn(err)
    });
    
    useEffect(() => {
        const interval = setInterval(() => {
            fetchInstances()
          }, 5000);
        return () => clearInterval(interval);
    }, [])

    async function fetchInstances() {
        try {
          const instanceData = await API.graphql(graphqlOperation(listInstances))
          const instance = instanceData.data.listInstances.items
          setInstances(instance)
        } catch (err) { console.warn('error fetching instances: ', err) }
    }

    function createLink(e) {
        if (e != null) {
            return(
            <>
                <Button 
                    variant="contained" 
                    href={'https://' + e + ':8443'}
                    target="_blank" 
                    rel="noopener noreferrer"
                    size="small"
                >
                        Connect to DCV
                </Button>
                <Button
                    variant="outlined"
                    size="small"
                    onClick={deleteInstance}
                >
                    Delete instance
                </Button>
            </>
            )
        }
    }

    async function deleteInstance() {
        try {
            const instanceId = instanceId
            await API.graphql(graphqlOperation(deleteInstance, {input: instanceId}))

          } catch (err) { 

        }
    }

    return (
        <Grid container spacing={3}>
            { 
                instances.map((instance, index) => (
                    <Grid item key={index} xs={4}>
                        <Paper 
                            sx={{
                                p: 2,
                                display: 'flex',
                                flexDirection: 'column',
                            }}
                        >
                            <Typography variant="body1" component="div">
                                {instance.name}
                            </Typography>
                            <Typography variant="body2">
                                {instance.instanceType}
                            </Typography>
                            <Typography variant="body2">
                                {instance.instanceId}
                            </Typography>
                            {createLink(instance.publicip)} 
                        </Paper>
                    </Grid>
                ))
            }
        </Grid>
    );
}