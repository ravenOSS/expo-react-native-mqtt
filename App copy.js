import './shim.js'
import { StatusBar } from 'expo-status-bar'
import { useEffect, useState } from 'react'

import { StyleSheet, Text, View } from 'react-native'

import * as mqtt from 'mqtt'

export default function App() {
  // const [client, setClient] = useState(null)
  const [connectStatus, setConnectStatus] = useState(false)
  const [messages, setMessages] = useState([])

  const wshost = 'ws://192.168.0.120:8880'
  const mqtthost = 'mqtt://192.168.0.120:1883'
  const clientId = 'mqtt-rn'

  const options = {
    keepalive: 60,
    clientId: clientId,
    protocolId: 'MQTT',
    protocolVersion: 4,
    reconnectPeriod: 1000 * 3,
    connectTimeout: 1000 * 30,
    clean: false,
    retain: false,
    resubscribe: true,
    qos: 1,
    will: {
      topic: 'WilllMsg',
      payload: 'Subscriber Connection Closed abnormally..!',
      qos: 1,
      retain: false,
    },
  }

  //! HandleConnect - calls defined function
  //! HandleSubscribe
  //! HandlePublish
  //! HandleDisconnect

  console.log(`messagesLength: ${messages.length} `)
  console.log(`messages: ${messages} `)

  useEffect(() => {
    const client = mqtt.connect(wshost, options) //! Connect to MQTT Broker

    client.on('connect', () => {
      setConnectStatus('Connected')
      console.log('Connected')
      client.subscribe('raven')
    })

    client.on('error', (err) => {
      console.error('Connection error: ', err)
      client.end()
    })

    client.on('reconnect', () => {
      setConnectStatus('Reconnecting')
    })

    client.on('message', (topic, message) => {
      console.log(`Received: ${topic}: ${message}`)
      // setMessages((messages) => messages.concat(message.toString()))
      setMessages(message.toString())
      // setMessages((messages) => [...messages, message.toString()])
    })

    // return () => {
    // 	client.end()
    // }
  }, [])

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>MQTT Dev Client</Text>
      <Text style={styles.message}>{messages}</Text>
      <Text style={styles.message}>{connectStatus}</Text>
      {/* {messages.map((message, index) => (
        <Text style={styles.message} key={index}>
          {message}
        </Text>
      ))} */}
      <StatusBar style="auto" />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'darkorange',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 10,
  },
  message: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
  },
})
