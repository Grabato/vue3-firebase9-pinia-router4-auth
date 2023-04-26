<template>
  <div>
    <h1>Login</h1>
    <form @submit.prevent="handleSubmit">
      <input type="email" placeholder="Ingrse email" v-model.trim="email">
      <input type="password" placeholder="Ingrse contraseña" v-model.trim="password">
      <button type="submit">Iniciar sesión</button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useUserStore } from '../stores/user';
//import { useRouter } from 'vue-router';

const userStore = useUserStore()
//const router = useRouter()

const email = ref('')
const password = ref('')

const handleSubmit = async () => {

  if (!email.value || !password.value.length > 6) {
    return alert("Llena los campos")
  }
  await userStore.loginUser(email.value, password.value)
  //router.push('/')
}
</script>