import React, { useState, useEffect } from 'react';
import { Grid, Box, Card, CardActions, CardContent, Button, Typography } from '@mui/material';
import { API, graphqlOperation } from 'aws-amplify'; 
import { listInstances } from '../graphql/queries';

export default function BasicCard() {

    const [instances, setInstances] = useState([])

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
        <Box sx={{ flexGrow: 1 }}>
            <Grid container spacing={3}>
                { 
                    instances.map((instance, index) => (
                        <Grid item xs={4}>
                            <Card sx={{ minWidth: 275 }}>
                                <CardContent>
                                    <Typography variant="h5" component="div">
                                        {instance.name}
                                    </Typography>
                                    <Typography variant="body2">
                                        {instance.instanceType}
                                        {instance.instanceId}
                                    </Typography>
                                </CardContent>
                                <CardActions>
                                    <Button size="small">DCV access URL</Button>
                                </CardActions>
                            </Card>
                        </Grid>
                    ))
                }
            </Grid>
        </Box>
    );
}