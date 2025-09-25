<script setup>
import { RouterView } from 'vue-router'
import Toast from 'primevue/toast'
import TheHeader from '@/components/TheHeader.vue'
import { onMounted } from 'vue'
import { useUserStore } from '@/stores/userStore.js'

const authStore = useUserStore()

onMounted(async () => {
  await authStore.getUser()
})
</script>

<template>
  <Toast />
  <TheHeader v-if="authStore.user" />
  <RouterView />
</template>
