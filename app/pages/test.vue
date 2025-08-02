<template>
	<div>
		<h1>Test Page</h1>
		<p>Cette page fonctionne si vous voyez ce message.</p>
		<p>Timestamp: {{ timestamp }}</p>
	</div>
</template>

<script setup>
	// Vérifier si on est en mode développement
	const isDevelopment = process.env.NODE_ENV === 'development'

	// Si on n'est pas en développement, throw une erreur 404
	if (!isDevelopment) {
		throw createError({
			statusCode: 404,
			statusMessage: 'Page Not Found',
		})
	}

	const timestamp = new Date().toISOString()
	console.log('Test page loaded at:', timestamp)
</script>
