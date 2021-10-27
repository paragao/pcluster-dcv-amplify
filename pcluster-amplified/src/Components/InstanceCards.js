import React, { useState, useEffect } from 'react';
import { Grid, Paper, IconButton, Typography, Snackbar, Button, Alert } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import AirplayIcon from '@mui/icons-material/Airplay';
import { API, graphqlOperation } from 'aws-amplify'; 
import { listInstances } from '../graphql/queries';
import { deleteInstance } from '../graphql/mutations';
<<<<<<< HEAD
import { onCreateInstance, onDeleteInstance } from '../graphql/subscriptions';

const initialSeverity = {
    message: '',
    severity: ''
};

export default function BasicCard() {

    const [instances, setInstances] = useState([]);
    const [snackSeverity, setSnackSeverity] = useState(initialSeverity);
    const [snackOpen, setSnackOpen] = useState(false);

    useEffect(() => {
        fetchInstances()
=======
import { onCreateInstance, onDeleteInstance, onUpdateInstance } from '../graphql/subscriptions';

export default function BasicCard() {

    const [instances, setInstances] = useState([])
    
    useEffect(() => {
        fetchInstances();
>>>>>>> refactor_lambda
        //const interval = setInterval(() => {
        //    fetchInstances()
        //  }, 5000);
        //return () => clearInterval(interval);
    }, [])
<<<<<<< HEAD

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setSnackOpen(false);
        };

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

    const subscription = API.graphql(graphqlOperation(onCreateInstance))
=======
    
    const onCreateInstanceSubscription = API.graphql(graphqlOperation(onCreateInstance))
>>>>>>> refactor_lambda
    .subscribe({
        next: (instanceData) => {
            console.log(instanceData.value.data)
            const newInstance = instanceData.value.data.onCreateInstance
            setInstances([...instances, newInstance])

        },
        error: err => console.warn(err)
    });
<<<<<<< HEAD

    const deleteSubs = API.graphql(graphqlOperation(onDeleteInstance))
    .subscribe({
        next: (instanceData) => {
            console.log(instanceData.value.data)
            const deletedInstance = instanceData.value.data.onDeleteInstance
            //setInstances([...instances, deletedInstance])
        }
    })
=======
    
    const onDeleteInstanceSubscription = API.graphql(graphqlOperation(onDeleteInstance))
    .subscribe({
        next: (instanceData) => {
            console.log(instanceData.value.data)
            //const newInstance = instanceData.value.data.onCreateInstance
            //setInstances([...instances, newInstance])

        },
        error: err => console.warn(err)
    });

    const onUpdateInstanceSubscription = API.graphql(graphqlOperation(onUpdateInstance))
    .subscribe({
        next: (instanceData) => {
            console.log(instanceData.value.data)
            //const newInstance = instanceData.value.data.onCreateInstance
            //setInstances([...instances, newInstance])

        },
        error: err => console.warn(err)
    });
>>>>>>> refactor_lambda

    async function fetchInstances() {
        try {
          const instanceData = await API.graphql(graphqlOperation(listInstances))
            .then((response) => {
                const instance = response.data.listInstances.items
                setInstances(instance)
            });
        } catch (err) { console.warn('error fetching instances: ', err) }
    }

<<<<<<< HEAD
    function createLink(ip, pkid) {
        if (ip != null) {
            return(
            <>
                <Grid container>
                    <Grid item xs={4} md={2} lg={4}>
                        <Button 
                            button
                            component="a"
                            href={'https://' + ip + ':8443'}
                            target="_blank" 
                            rel="noopener noreferrer"
                            size="small"
                        >
                            <AirplayIcon />
                        </Button>
                    </Grid>
                    <Grid item xs={4} md={2} lg={4}>
                        <Button
                            button
                            size="small"
                            onClick={() => delInstance(pkid)}
                            defaultValue={pkid}
                            id={pkid}
                        >
                            <DeleteIcon />
                        </Button>
                    </Grid>
                </Grid>
=======
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
>>>>>>> refactor_lambda
            </>
            )
        } 
    }

    async function delInstance(id) {
<<<<<<< HEAD
        console.log(id)
        if (id != null) {
            try {
                await API.graphql(graphqlOperation(deleteInstance, {input: {id} }))
                console.log('success deleting id: ', id)
                setSeverity('severity', 'success')
                setSeverity('message', 'instance deletion submitted')
                setSnackOpen(true)
                fetchInstances();
            } catch (err) { 
                console.warn('error deleting id: ', err)
                setSeverity('severity', 'error')
                setSeverity('severity', 'error deleting instance')
                setSnackOpen(true)
            }
        } else {
            console.warn('pkId is undefined')
=======
        try {
            const deleteResponse = await API.graphql(graphqlOperation(deleteInstance, {input: { id } }))
            console.log('instance deleted from DynamoDB successfully');
          } catch (err) { 
            console.warn('error deleting instance: ', err)
>>>>>>> refactor_lambda
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
<<<<<<< HEAD
                            {createLink(instance.publicip, instance.id)} 
=======
                            {createLink(instance)} 
>>>>>>> refactor_lambda
                        </Paper>
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
                    </Grid>
                ))
            }
        </Grid>
    );
}