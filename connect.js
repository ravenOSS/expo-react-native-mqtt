import React, { useEffect, useState } from 'react'
import mqtt from 'mqtt'

export default function RealtimeMarker() {
	const [data, setData] = useState([])

	console.log('data: ', data.length, data)

	// Use useEffect to create client and event listener.
	// No need to recreate usingMqtt function on every render.
	useEffect(() => {
		const url = 'ws://blahblahblah/ws'
		const client = mqtt.connect(url)
		const topicsToSubscribe = 'message/devices/+' // '+' is a wildcard

		client.on('connect', () => {
			console.log('connected')
			client.subscribe(topicsToSubscribe)
		})

		client.on('message', (topic, message) => {
			const itemMessage = JSON.parse(message.toString())
			console.log('itemMessage: ', itemMessage)

			// make use of alternate syntax of setState to ensure you are always using
			// newest state values.
			setData((currentData) => {
				// Create an array with a new reference.
				// Without a new reference react assumes there is no change to the array.
				let array = [...currentData]

				if (currentData.length === 0) {
					array.push(itemMessage)
				} else {
					let found = 0
					for (let i = 0; i < currentData.length; i++) {
						console.log(
							currentData[i]['device.id'],
							itemMessage['device.id'],
							itemMessage['ble.beacons']
						)
						if (currentData[i]['device.id'] === itemMessage['device.id']) {
							found++
							currentData[i] = itemMessage
						}
					}

					if (found === 0) {
						array.push(itemMessage)
					}
				}

				return array
			})
		})

		//Ensure client is closed on unmount of component.
		return () => {
			client.end()
		}
	}, [])

	return <div></div>
}
