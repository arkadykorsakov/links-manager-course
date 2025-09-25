<script setup>
import Card from 'primevue/card'
import SpeedDial from 'primevue/speeddial'
import { useLinksStore } from '@/stores/linksStore.js'
import { computed, ref } from 'vue'
import { useToastNotifications } from '@/composables/useToastNotifications.js'
import LinkModal from '@/components/Modals/LinkModal.vue'

const linksStore = useLinksStore()
const { showToast } = useToastNotifications()

const props = defineProps({
  link: {
    type: Object,
    required: true,
  },
})
const linkDialogVisible = ref(false)

const itemsMenuButton = ref([
  {
    label: 'Избранное',
    icon: 'pi pi-star',
    command: async () => {
      try {
        await linksStore.changeIsFavorite(props.link.id)
        showToast('success', 'Успешно', 'Изменения сохранены')
      } catch (error) {
        console.log(error)
        showToast('error', 'Ошибка про удалении')
      }
    },
  },
  {
    label: 'Скопировать',
    icon: 'pi pi-link',
    command: () => {
      copyToClipboard()
    },
  },
  {
    label: 'Редактировать',
    icon: 'pi pi-pencil',
    command: () => {
     linkDialogVisible.value = true
    },
  },
  {
    label: 'Удалить',
    icon: 'pi pi-trash',
    command: async () => {
      try {
        await linksStore.removeLink(props.link.id)
        showToast('success', 'Успешно', 'Изменения сохранены')
      } catch {
        showToast('error', 'Ошибка про удалении')
      }
    },
  },
])

const copyToClipboard = async () => {
  try {
    await navigator.clipboard.writeText(props.link.url)
    showToast('success', 'Успешно', `Скопировано ${props.link.name}`)
  } catch {
    showToast('error', 'Ошибка про копировании')
  }
}

const isFavoriteBackgroundCard = computed(() =>
  props.link.is_favorite ? 'var(--p-button-outlined-warn-hover-background)' : '',
)

const openLink = () => {
  linksStore.addClickCount(props.link.id)
}
</script>

<template>
  <LinkModal is-edit :id='link.id' v-model='linkDialogVisible'/>
  <Card class="relative" :style="{ backgroundColor: isFavoriteBackgroundCard }">
    <template #title>
      <div class="flex items-center gap-2 pr-10">
        <img :src="link.preview_image" :alt="link.name" />
        <a :href="link.url" target="_blank" @click="openLink">
          {{ link.name }}
        </a>
        <SpeedDial
          :model="itemsMenuButton"
          :tooltipOptions="{ position: 'left' }"
          direction="down"
          style="position: absolute; right: 20px; top: 20px"
        />
      </div>
    </template>
    <template #content>
      <div class="flex gap-2 flex-col">
        <div class="font-bold">
          {{ link.categories.name }}
        </div>
        <div class="h-full" v-if="link.description">
          {{ link.description }}
        </div>
      </div>
    </template>
  </Card>
</template>
