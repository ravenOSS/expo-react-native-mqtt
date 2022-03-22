module.exports = {
	resolver: {
		extraNodeModules: {
			// Polyfills for node libraries
			net: require.resolve('react-native-tcp-socket'),
		},
	},
}
