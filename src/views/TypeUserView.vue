<script setup>
    import router from '@/router';
    import { typeUser } from '@/utils';
</script>
<template>
     <div class="flex bg-[#2C2149] p-5 rounded-b-4xl  text-white h-screen justify-center items-center flex-col gap-20">
          <h1 class="text-3xl">Você é?</h1>
          <div class="flex flex-col gap-5">
              <div v-for="user, i in typeUser" :key="i" class="flex gap-5 items-center cursor-pointer p-3 rounded-xl  hover:bg-[#93939317]" @click="router.push(`/auth/${user.title}/`)">
                    <img :src="user.img" alt="" width="75">
                    <p class="text-2xl">{{ user.title }}</p>
              </div>  
          </div>
      </div>
</template>