<script setup>
	import { useUserStore } from '@/stores/user'
	const { firebaseUserStore, userDataStore } = useUserStore()
</script>

<template>
	<div
		ref="scrollContainer"
		class="scrollBarLight relative h-full space-y-3 overflow-hidden overflow-y-scroll pr-2"
	>
		<pre>{{ firebaseUserStore }}</pre>
		<pre>{{ userDataStore }}</pre>
	</div>
</template>
