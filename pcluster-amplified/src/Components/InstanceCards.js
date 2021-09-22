import React, { useState, useEffect } from 'react';
import { Grid, Paper, Link, Typography } from '@mui/material';
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
        fetchInstances()
    }, [])

    async function fetchInstances() {
        try {
          const instanceData = await API.graphql(graphqlOperation(listInstances))
          const instance = instanceData.data.listInstances.items
          setInstances(instance)
        } catch (err) { console.log('error fetching instances: ', err) }
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
                            <Typography variant="h5" component="div">
                                {instance.name}
                            </Typography>
                            <Typography variant="body2">
                                {instance.instanceType}
                                {instance.instanceId}
                            </Typography>
                            <Link >Click to connect</Link>
                        </Paper>
                    </Grid>
                ))
            }
        </Grid>
    );
}