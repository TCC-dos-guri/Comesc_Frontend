<script setup>
  import {GlobalButton } from '@/components/index'
  import router from '@/router';
</script>
<template>  
<div class="flex justify-center items-center">
    <div class="w-full">
      <div class="flex bg-[#2C2149] p-5 rounded-b-4xl text-white h-80 justify-center items-center flex-col gap-2">
        <h1 class="text-5xl" >COMESC</h1>
        <h2 class="text-2xl">MALHAS</h2>
      </div>

      <div class="flex flex-col jusitfy-center items-center gap-24 mt-16">
        <div class="flex flex-col gap-3">
        <h2 class="text-2xl font-semibold pt-3.5">Bem vindo a Comesc!</h2>
          <p class="text-center">
            Gestão têxtil com eficiência e <br />
            controle total.
          </p>
        </div>
        <GlobalButton title="Explore o sistema" btn-style="bg-[#2C2149] flex justify-center items-center p-1 w-52 rounded-4xl" @click="router.push('/login')"/>
      </div>
    </div>
  </div>
</template>
