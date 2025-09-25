<script setup>
import { onMounted } from 'vue'
import Button from 'primevue/button'
import { useLinksStore } from '@/stores/linksStore.js'
import AppLoader from '@/components/AppLoader.vue'
import CardLink from '@/components/CardLink.vue'
import LinksFilters from '@/components/LinksFilters.vue'

const linksStore = useLinksStore()

onMounted(async () => {
  if (window.location.hash) {
    const hashParams = new URLSearchParams(window.location.hash.substring(1))
    const accessToken = hashParams.get('access_token')

    if (accessToken) {
      window.history.replaceState(null, null, window.location.pathname)
    }
  }

  await linksStore.fetchLinks()
})
</script>

<template>
  <AppLoader v-if="linksStore.isLoading && linksStore.offset === 0" />
  <div v-else>
    <h2 v-if="!linksStore.links.length" class="font-bold text-center">
      Вы пока еще не добавили ссылок
    </h2>
    <template v-else>
      <LinksFilters />
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <CardLink v-for="link in linksStore.links" :link="link" :key="link.id" />
      </div>
      <div class="flex justify-center mt-3">
        <Button label="Показать еще" v-if="linksStore.hasMore" @click="linksStore.fetchLinks()" :loading='linksStore.isLoading && linksStore.offset > 0'/>
      </div>
    </template>
  </div>
</template>
