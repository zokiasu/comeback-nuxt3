<template>
    <div class="p-5">
        <input
            id="search-input"
            v-model="search"
            type="text"
            placeholder="Search"
            class="w-full rounded border-none bg-quinary px-5 py-2 placeholder-tertiary drop-shadow-xl transition-all duration-300 ease-in-out focus:bg-tertiary focus:text-quinary focus:placeholder-quinary focus:outline-none"
        />
    </div>
</template>

<script setup>
    const search = ref('');
</script>