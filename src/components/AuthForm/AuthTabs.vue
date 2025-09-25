<script setup>
import { ref } from 'vue'
import Tabs from 'primevue/tabs'
import TabList from 'primevue/tablist'
import Tab from 'primevue/tab'
import TabsPanels from 'primevue/tabpanels'
import TabPanel from 'primevue/tabpanel'
import LoginForm from '@/components/AuthForm/LoginForm.vue'
import RegistrationForm from '@/components/AuthForm/RegistrationForm.vue'
import ResetPasswordForm from '@/components/AuthForm/ResetPasswordForm.vue'

const activeTab = ref('signin')
</script>

<template>
  <Tabs v-model:value="activeTab">
    <TabList>
      <Tab value="signin"> Вход </Tab>
      <Tab value="signup"> Регистрация </Tab>
    </TabList>
    <TabsPanels>
      <TabPanel value="signin">
        <LoginForm @reset-password="activeTab = 'reset'" />
      </TabPanel>
      <TabPanel value="signup">
        <RegistrationForm />
      </TabPanel>
      <TabPanel value="reset">
        <ResetPasswordForm />
      </TabPanel>
    </TabsPanels>
  </Tabs>
</template>
