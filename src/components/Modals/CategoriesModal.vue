<script setup>
import Dialog from 'primevue/dialog'
import { Form } from '@primevue/forms'
import Button from 'primevue/button'
import Skeleton from 'primevue/skeleton'
import { ref, watch } from 'vue'
import InputText from 'primevue/inputtext'
import { useToastNotifications } from '@/composables/useToastNotifications.js'
import { supabase } from '@/supabase.js'

const modelValue = defineModel()
const { showToast } = useToastNotifications()

const isLoading = ref(false)
const isSubmitting = ref(false)
const isDeleting = ref(false)
const categoryName = ref('')

const listCategories = ref([])

const saveCategory = async () => {
  isSubmitting.value = true

  try {
    const { data, error } = await supabase
      .from('categories')
      .insert({ name: categoryName.value })
      .select('name')
    listCategories.value.push(...data)
    if (error) throw error
    showToast('success', 'Успех', 'Категория добавлена')
    categoryName.value = ''
  } catch {
    showToast('error', 'Ошибка', 'Не удалось добавить категорию')
  } finally {
    isSubmitting.value = false
  }
}

const getCategories = async () => {
  isLoading.value = true
  try {
    const { data, error } = await supabase.from('categories').select()
    if (error) throw error

    listCategories.value = data
  } catch {
    showToast('error', 'Ошибка', 'Не удалось получить список категорий')
  } finally {
    isLoading.value = false
  }
}

const deleteCategory = async (id) => {
  isDeleting.value = true
  try {
    const { error } = await supabase.from('categories').delete().eq('id', id)
    if (error) throw error
    listCategories.value = listCategories.value.filter((category) => {
      category.id !== id
    })
    showToast('success', 'Успех', 'Категория удалена')
  } catch {
    showToast('error', 'Ошибка', 'Не удалось удалить категорию, попробуйте позже')
  } finally {
    isDeleting.value = false
  }
}

watch(modelValue, async (newValue) => {
  if (newValue) await getCategories()
})
</script>

<template>
  <Dialog modal header="Категории" v-model:visible="modelValue" :style="{ width: '25rem' }">
    <template v-if="isLoading">
      <div class="grid mt-3 grid-cols-[1fr_32px] mb-1 items-center gap-5">
        <Skeleton width="100%" />
        <Skeleton shape="circle" size="2rem" />
      </div>
    </template>
    <template v-else>
      <Form @submit="saveCategory">
        <div class="gap-2 mb-2">
          <InputText
            v-model="categoryName"
            class="flex-auto w-full"
            autocomplete="off"
            placeholder="Название новой категории"
          />
        </div>
        <div class="flex justify-end gap-2 mt-4">
          <Button
            type="button"
            label="Добавить"
            @click="saveCategory"
            :loading="isSubmitting"
            :disabled="!categoryName.trim()"
          />
        </div>
        <div
          class="grid mt-3 grid-cols-[1fr_32px] mb-1 gap-5"
          v-for="category in listCategories"
          :key="category.id"
        >
          {{ category.name }}
          <Button
            type="button"
            rounded
            size="small"
            variant="text"
            icon="pi pi-times"
            :disabled="isDeleting"
            @click="deleteCategory(category.id)"
          />
        </div>
      </Form>
    </template>
  </Dialog>
</template>
