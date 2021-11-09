import React, { useState, useEffect } from 'react';
import { Grid, Paper, IconButton, Typography, Snackbar, Button, Alert } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import AirplayIcon from '@mui/icons-material/Airplay';
import { API, graphqlOperation } from 'aws-amplify'; 
import { listInstances } from '../graphql/queries';
import { deleteInstance } from '../graphql/mutations';
import { onCreateInstance, onDeleteInstance, onUpdateInstance } from '../graphql/subscriptions';

export default function BasicCard() {

    const [instances, setInstances] = useState([])
    
    useEffect(() => {
        fetchInstances();
        //const interval = setInterval(() => {
        //    fetchInstances()
        //  }, 5000);
        //return () => clearInterval(interval);
    }, [])
    
    const onCreateInstanceSubscription = API.graphql(graphqlOperation(onCreateInstance))
    .subscribe({
        next: (instanceData) => {
            console.log(instanceData.value.data)
            const newInstance = instanceData.value.data.onCreateInstance
            setInstances([...instances, newInstance])
        },
        error: err => console.warn('error subscribing to onCreateInstance: ', err)
    });
    
    const onDeleteInstanceSubscription = API.graphql(graphqlOperation(onDeleteInstance))
    .subscribe({
        next: (instanceData) => {
            console.log('onDeleteInstance value: ', instanceData.value.data)
            //const fewerInstances = instances.delete()
            //const newInstance = instanceData.value.data.onCreateInstance
            //setInstances([...instances, newInstance])
        },
        error: err => console.warn('error subscribing to onDeleteInstance: ', err)
    });

    const onUpdateInstanceSubscription = API.graphql(graphqlOperation(onUpdateInstance))
    .subscribe({
        next: (instanceData) => {
            console.log('onUpdateInstance value: ', instanceData.value.data)
            //const newInstance = instanceData.value.data.onCreateInstance
            //setInstances([...instances, newInstance])
        },
        error: err => console.warn(err)
    });

    async function fetchInstances() {
        try {
          const instanceData = await API.graphql(graphqlOperation(listInstances))
            .then((response) => {
                const instance = response.data.listInstances.items
                setInstances(instance)
            });
        } catch (err) { console.warn('error fetching instances: ', err) }
    }

    function createLink(e) {
        console.log(e)
        if (e.publicip != null) {
            const publicip = e.publicip
            const itemId = e.id
            return(
            <>
                <Button 
                    variant="contained" 
                    href={'https://' + publicip + ':8443'}
                    target="_blank" 
                    rel="noopener noreferrer"
                    size="small"
                >
                        Connect to DCV
                </Button>
                <Button
                    variant="outlined"
                    size="small"
                    onClick={() => delInstance(itemId)}
                >
                    Delete instance
                </Button>
            </>
            )
        } 
    }

    async function delInstance(id) {
        try {
            const deleteResponse = await API.graphql(graphqlOperation(deleteInstance, {input: { id } }))
            console.log('instance deleted from DynamoDB successfully');
          } catch (err) { 
            console.warn('error deleting instance: ', err)
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
                                Type: {instance.instanceType}
                            </Typography>
                            <Typography variant="body2">
                                ID: {instance.instanceId}
                            </Typography>
                            {createLink(instance)} 
                        </Paper>

                    </Grid>
                ))
            }
        </Grid>
    );
}