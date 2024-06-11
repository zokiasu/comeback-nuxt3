<template>
    <div :id="id" :ref="'ref_' + id" class="space-y-1 max-w-[80%] lg:max-w-[50%]" :class="isActualUser ? 'self-end':'self-start'">
        <div v-if="isAdmin" class="flex gap-1" :class="isActualUser ? 'justify-end':'justify-start'">
            <button>
                <IconDelete class="w-4 h-4 text-gray-500 hover:text-primary" />
            </button>
            <button>
                <IconMessageBlock class="w-4 h-4 text-gray-500 hover:text-primary" />
            </button>
        </div>
        <div class="rounded p-2" :class="isActualUser ? 'bg-primary':'bg-quaternary'">
            <p>{{ message }}</p>
        </div>
    </div>
</template>

<script setup lang="ts">
const { id, message, isActualUser, isAdmin } = defineProps<{
  id: string;
  message: string;
  isActualUser: boolean;
  isAdmin: boolean;
}>();
</script>