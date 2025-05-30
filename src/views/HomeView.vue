<script setup>
  import {GlobalButton, GlobalInput} from '@/components/index'
</script>

<template>  
<div class="container">
    <div class="card">
      <div class="header">
        <h1 class="logo">COMESC</h1>
        <h2 class="subtitle">MALHAS</h2>
      </div>

      <div class="content">
        <h2 class="welcome-title">Bem vindo a Comesc!</h2>
        <p class="welcome-text">
          Gestão têxtil com eficiência e <br />
          controle total.
        </p>

        <button class="button group">
          Explore o sistema
          <span class="arrow group-hover">➜</span>
        </button>
      </div>
    </div>
  </div>
    <GlobalButton/>
    <GlobalInput class_input="border ps-2 border-neutral-400 rounded-xl w-96 outline-0 p-2" placeholder="teste" label="teste"/>
</template>

<style scoped>

.arrow group-hover {
    border-radius: 10px;
    background-color: #ffff;
}

.container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-color: #f3f4f6;
}

.card {
  width: 100%;
  max-width: 24rem;
  background-color: #fff;
  border-bottom-left-radius: 1.5rem;
  border-bottom-right-radius: 1.5rem;
  box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
}

.header {
  background-color: #2C2149;
  color: white;
  padding: 5rem 1.5rem;
  border-bottom-left-radius: 1.5rem;
  border-bottom-right-radius: 1.5rem;
  text-align: center;
}

.logo {
  font-size: 1.5rem;
  font-weight: bold;
  letter-spacing: 0.1em;
}

.subtitle {
  font-size: 0.875rem;
  font-weight: 600;
  letter-spacing: 0.25em;
}

.content {
  height: 400px;
  padding: 1rem;
  text-align: center;
}

.welcome-title {
  padding-top: 2rem;
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.5rem;
}

.welcome-text {
  font-size: 0.875rem;
  color: #6b7280;
  margin-bottom: 1.5rem;
}

.button {
  display: inline-flex;
  align-items: center;
  margin-top: 5rem;
  gap: 0.5rem;
  padding: 0.5rem 1.25rem;
  background-color: #2C2149;
  color: white;
  border-radius: 9999px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.button:hover {
  background-color: #1f1835;
}

.arrow {
  display: inline-block;
  padding: 0.4rem 0.8rem;
  transition: transform 0.3s ease;
  border-radius: 2rem;
  background-color: #ffff;
  color: #1f1835;
}

.group:hover .arrow {
  transform: translateX(10px);
}

.explore-button {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1.25rem;
  background-color: #2C2149;
  color: white;
  border-radius: 9999px;
  transition: background-color 0.3s ease;
}

.explore-button:hover {
  background-color: #1f1835;
}

.arrow {
  display: inline-block;
  transition: transform 0.3s ease;
}

/* Animação extra opcional */
@keyframes slide-right {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(5px);
  }
}

.group-hover\:animate-slide-right:hover .arrow {
  animation: slide-right 0.3s forwards;
}
</style>
