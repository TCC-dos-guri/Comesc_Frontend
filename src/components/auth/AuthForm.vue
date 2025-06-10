<script setup>
    import { GlobalButton, GlobalInput } from '..';
    defineProps({
        inputs_arr: {
            type: Array,
            required: true
        },
        type_user: {
            type: String,
            default: "Cliente"
        },
        formChanged: {
            type: Boolean,
            default: false
        }
    })

    
</script>
<template>
    <div class="flex min-w-2/4 flex-col jusitfy-center items-center p-10 gap-5 mt-2">
        <GlobalInput v-for="info, i in inputs_arr" :key="i" :label="info.label" :placeholder="info.placeholder" v-model:value="info.value" class_input="outline-0 border border-neutral-400 rounded-lg p-4 w-full" class="w-full"/>
        <div class="flex justify-center items-center mt-10 flex-col gap-3">
          <GlobalButton :title="formChanged ? 'Criar' : 'Entrar'" :extra-div="false" btn-style="bg-[#2C2149] flex justify-center items-center p-3 w-52 rounded-4xl" />  
          <p v-if="type_user === 'Cliente'" class="text-neutral-400">{{ formChanged ? 'já possui uma conta?' : 'não possui uma conta?'}} <span class="text-[#2C2149] font-semibold cursor-pointer" @click="$emit('createaccount')">{{ formChanged ? 'se logue' : 'crie uma'}}</span></p>
        </div>          
      </div>
</template>