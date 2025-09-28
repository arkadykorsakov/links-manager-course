import { supabase } from '@/supabase.js'
import { useRequest } from '@/composables/useRequest.js'
import { useLinksStore } from '@/stores/linksStore.js'

export function useAuth() {
  const { loading, errorMessage, handleRequest } = useRequest()
  const { clearLinks } = useLinksStore()
  const signUp = async ({ email, password, firstname }) => {
    return await handleRequest(async () => {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      })
      if (error) throw error

      if (data.user) {
        await supabase.from('users').insert([{ id: data.user.id, firstname, email }])
      }

      return data
    })
  }

  const signIn = async ({ email, password }) => {
    return await handleRequest(async () => {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (error) throw error
      return data
    })
  }

  const resetPassword = async (email) => {
    return await handleRequest(async () => {
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: 'https://links-manager-course-vue.netlify.app/reset-password',
      })
      if (error) throw error
      return data
    })
  }

  const updatePassword = async (password) => {
    return await handleRequest(async () => {
      const { data, error } = await supabase.auth.updateUser({ password })
      if (error) throw error
      return data
    })
  }

  const signInWithGithub = async () => {
    await handleRequest(async () => {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
      })
      if (error) throw error
      return data
    })
  }

  const signOut = async () => {
    return await handleRequest(async () => {
      const { data, error } = await supabase.auth.signOut()
      if (error) throw error
      clearLinks()
      return data
    })
  }

  return {
    signUp,
    signIn,
    resetPassword,
    updatePassword,
    signInWithGithub,
    signOut,
    loading,
    errorMessage,
  }
}
