import './App.css';
import React, { useEffect, useState } from 'react';
import Amplify, { API, graphqlOperation } from 'aws-amplify'; 
import { createInstance, updateInstance } from './graphql/mutations'
import { listInstances } from './graphql/queries'
import { withAuthenticator } from '@aws-amplify/ui-react';

import awsExports from './aws-exports';
Amplify.configure(awsExports);

const initialState = { 
  instanceType: 'g4dn.xlarge'
}

function App() {

  const [formState, setFormState] = useState(initialState)
  const [instances, setInstances] = useState([])

  useEffect(() => {
    fetchInstances()
  }, [])

  function setInput(key, value) {
    setFormState({ ...formState, [key]: value })
  }

  async function fetchInstances() {
    try {
      const instanceData = await API.graphql(graphqlOperation(listInstances))
      const instance = instanceData.data.listInstances.items
      setInstances(instance)
    } catch (err) { console.log('error fetching instances') }
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
    <div style={styles.container}>
      <h2>Amplify Todos</h2>
      <input
        onChange={event => setInput('instanceType', event.target.value)}
        style={styles.input}
        value={formState.instanceType}
        placeholder="Instance Type"
      />
      <input
        onChange={event => setInput('description', event.target.value)}
        style={styles.input}
        value={formState.description}
        placeholder="Description"
      />
      <button style={styles.button} onClick={addInstances}>Create Instance</button>
      {
        instances.map((instance, index) => (
          <div key={instance.id ? instance.id : index} style={styles.instance}>
            <p style={styles.instanceType}>{instance.instanceType}</p>
            <p style={styles.instanceDescription}>{instance.description}</p>
          </div>
        ))
      }
    </div>
  );
}

const styles = {
  container: { width: 400, margin: '0 auto', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: 20 },
  instance: {  marginBottom: 15 },
  input: { border: 'none', backgroundColor: '#ddd', marginBottom: 10, padding: 8, fontSize: 18 },
  instanceType: { fontSize: 20, fontWeight: 'bold' },
  instanceDescription: { marginBottom: 0 },
  button: { backgroundColor: 'black', color: 'white', outline: 'none', fontSize: 18, padding: '12px 0px' }
}

//export default App;
export default withAuthenticator(App);
