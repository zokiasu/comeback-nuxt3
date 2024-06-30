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
        <div v-if="isAdmin" class="flex gap-1 items-end" :class="isActualUser ? 'justify-end':'justify-start'">
            <button>
                <IconDelete class="w-4 h-4 text-gray-500 hover:text-primary" />
            </button>
            <button>
                <IconMessageBlock class="w-4 h-4 text-gray-500 hover:text-primary" />
            </button>
            <p class="text-[10px] uppercase">{{ userName  }}</p>
        </div>
        <div class="rounded p-1 px-2 w-fit text-sm break-words" :class="isActualUser ? 'bg-quaternary':'bg-primary'">
            <p>{{ message }}</p>
        </div>
    </div>
</template>