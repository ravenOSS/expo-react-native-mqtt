import './shim.js'
const net = require('react-native-tcp-socket')
import { StatusBar } from 'expo-status-bar'
import { useEffect, useState } from 'react'

import { StyleSheet, Text, View } from 'react-native'
const mqtt = require('mqtt')

const wshost = 'ws://192.168.0.120:8880'
const mqtthost = 'mqtt://192.168.0.120:1883'
const clientId = 'mqtt-rn'

export default function App() {
	const [message, setMessage] = useState([])

	useEffect(() => createClient(), [])

	function createClient() {
		const mqttClient = mqtt.connect(mqtthost, clientId)

		mqttClient.on('connect', () => {
			mqttClient.subscribe('raven')
		})

		mqttClient.on('message', function (topic, message) {
			console.log(`${topic}: ${message.toString()} `)
			setMessage(message.toString())
		})
	}

	return (
		<View style={styles.container}>
			<Text style={styles.heading}>Timestamp - Dev Client</Text>
			<Text style={styles.message}>{message}</Text>
			<StatusBar style='auto' />
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
		fontSize: 20,
		fontWeight: 'bold',
		color: 'black',
		marginBottom: 10,
	},
	message: {
		fontSize: 24,
		fontWeight: 'bold',
		color: 'black',
	},
})
