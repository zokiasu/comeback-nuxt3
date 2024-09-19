<script setup lang="ts">
const { id, message, userName, isActualUser, isAdmin } = defineProps<{
  id: string;
  message: string;
  userName: string;
  isActualUser: boolean;
  isAdmin: boolean;
}>();
</script>

<template>
    <div :id="id" :ref="'ref_' + id" class="flex flex-col space-y-1 max-w-[80%]" :class="isActualUser ? 'self-end items-end justify-end':'self-start items-start justify-start'">
        <div class="flex gap-1 items-end" :class="isActualUser ? 'justify-end':'justify-start'">
            <button v-if="isAdmin">
                <IconDelete class="w-4 h-4 text-gray-500 hover:text-primary" />
            </button>
            <button v-if="isAdmin">
                <IconMessageBlock class="w-4 h-4 text-gray-500 hover:text-primary" />
            </button>
            <p class="text-[10px] uppercase">{{ userName  }}</p>
        </div>
        <div class="w-fit max-w-full text-sm break-words">
            <p class="rounded p-1 px-2 text-breaks w-fit max-w-full" :class="isActualUser ? 'bg-quaternary':'bg-primary'">{{ message }}</p>
        </div>
    </div>
</template>