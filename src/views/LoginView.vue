<template>
  <div class="container-custom">
    <div class="card-custom">
      <div class="header-section text-center">
        <h1 class="logo-text">COMESC</h1>
        <h2 class="title-text">Conecte-se</h2>
      </div>

      <form @submit.prevent="handleLogin" class="form-section">
        <div>
          <label class="form-label">Email</label>
          <input type="email" v-model="email" placeholder="seu email aqui" required class="form-input" />
        </div>

        <div>
          <label class="form-label">Senha</label>
          <input type="password" v-model="password" placeholder="Sua senha aqui" required class="form-input" />
        </div>

        <button type="submit" class="login-button">Entrar</button>

        <p v-if="errorMessage" class="error-message">
          {{ errorMessage }}
        </p>

        <p class="register-text">
          Não possui uma conta?
          <a href="#" class="register-link">Crie uma</a>
        </p>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const email = ref('')
const password = ref('')
const errorMessage = ref('')

const handleLogin = () => {
  if (email.value === 'admin@com' && password.value === 'admin') {
    alert('Login bem-sucedido!')
    errorMessage.value = ''
  } else {
    errorMessage.value = 'Email ou senha inválidos.'
  }
}
</script>

<style scoped>
.container-custom {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-color: #f3f4f6;
}

.card-custom {
  width: 100%;
  max-width: 24rem;
  background-color: #ffffff;
  border-bottom-left-radius: 1.5rem;
  border-bottom-right-radius: 1.5rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
    0 4px 6px -4px rgba(0, 0, 0, 0.1);
}

.header-section {
  background-color: #2C2149;
  color: white;
  border-bottom-left-radius: 1.5rem;
  border-bottom-right-radius: 1.5rem;
  padding: 2.5rem 1.5rem;
}

.logo-text {
  font-size: 1.125rem;
  font-weight: bold;
  letter-spacing: 0.05em;
  margin-bottom: 0.5rem;
}

.title-text {
  font-size: 1.75rem;
  font-weight: 600;
}

.form-section {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.form-label {
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: #000000;
  margin-bottom: 0.25rem;
}

.form-input {
  width: 100%;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  padding: 0.5rem 1rem;
  outline: none;
  transition: 0.2s;
}

.form-input:focus {
  border-color: #2C2149;
  box-shadow: 0 0 0 2px #a78bfa55;
}

.login-button {
  width: 100%;
  background-color: #2C2149;
  color: white;
  padding: 0.5rem;
  border-radius: 9999px;
  font-weight: 500;
  transition: background 0.3s;
}

.login-button:hover {
  background-color: #1f1835;
}

.error-message {
  color: #ef4444;
  text-align: center;
  font-size: 12pt;
  transition: 0.2s;
}

.register-text {
  text-align: center;
  font-size: 0.875rem;
  color: #6b7280;
}

.register-link {
  color: #2C2149;
  font-weight: 600;
  margin-left: 0.25rem;
  text-decoration: none;
}

.register-link:hover {
  text-decoration: underline;
}
</style>
