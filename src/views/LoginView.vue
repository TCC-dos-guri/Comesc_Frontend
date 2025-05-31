<script setup>
    import { LoginInput } from '@/utils';
    import { GlobalInput, GlobalButton } from '@/components';
</script>
<template>
    <div class="w-full">
      <div class="flex bg-[#2C2149] p-5 rounded-b-4xl text-white h-56 justify-between items-center flex-col gap-2">
          <div class="w-full">
            <h1 class="text-start">COMESC</h1>
          </div>
          <h2 class="text-4xl font-bold mb-7">Conecte-se</h2>
      </div>
      <div class="flex flex-col jusitfy-center items-center p-10 gap-2 mt-2">
        <GlobalInput v-for="info, i in LoginInput" :key="i" :label="info.label" :placeholder="info.placeholder" v-model:value="info.value" class_input="outline-0 border border-neutral-400 rounded-xl p-3 w-full" class="w-full"/>
        <div class="flex justify-center items-center mt-10 flex-col">
          <GlobalButton title="Entrar" :extra-div="false" btn-style="bg-[#2C2149] flex justify-center items-center p-3 w-52 rounded-4xl" />  
          <p class="text-neutral-400">não possui uma conta? <span class="text-[#2C2149] font-semibold">crie uma</span></p>
        </div>          
      </div>
    </div>
</template>
<script setup>

</script>