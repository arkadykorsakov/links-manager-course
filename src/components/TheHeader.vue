<script setup>
import Button from 'primevue/button'
import Avatar from 'primevue/avatar'
import Menubar from 'primevue/menubar'
import { useUserStore } from '@/stores/userStore.js'
import { computed, ref } from 'vue'
import { useAuth } from '@/composables/useAuth.js'
import { useToastNotifications } from '@/composables/useToastNotifications.js'
import { useRouter } from 'vue-router'
import CategoriesModal from '@/components/Modals/CategoriesModal.vue'
import LinkModal from '@/components/Modals/LinkModal.vue'

const authStore = useUserStore()
const { signOut, errorMessage } = useAuth()
const router = useRouter()
const { showToast } = useToastNotifications()

const categoriesDialogVisible = ref(false)
const createLinkDialogVisible = ref(false)

const signOutUser = async () => {
  try {
    await signOut()
    authStore.resetUser()
    await router.replace({ name: 'auth' })
  } catch {
    showToast('error', 'Ошибка выхода', errorMessage.value)
  }
}

const emailFirstLetter = computed(() => {
  return authStore?.user?.email ? authStore.user.email[0].toUpperCase() : ''
})
</script>

<template>
  <CategoriesModal v-model="categoriesDialogVisible" />
  <LinkModal v-model="createLinkDialogVisible" />
  <div class="mb-5">
    <Menubar>
      <template #start>
        <div class="flex items-center gap-2">
          <span class="font-bold">Link Manager</span>
          <div class="flex items-center gap-2">
            <Button icon="pi pi-link" rounded @click='createLinkDialogVisible = true'/>
            <Button icon="pi pi-folder" rounded @click='categoriesDialogVisible = true'/>
          </div>
        </div>
      </template>
      <template #end>
        <div class="flex items-center gap-2">
          <Avatar :label="emailFirstLetter" size="large" shape="circle" />
          <Button icon="pi pi-sign-out" rounded severity="secondary" @click="signOutUser" />
        </div>
      </template>
    </Menubar>
  </div>
</template>
