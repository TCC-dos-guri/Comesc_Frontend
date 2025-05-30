<script setup>
    defineProps({
        placeholder: {
            type: String,
            default: ''
        }, 
        label: {
            type: String,
            default: ''
        },
        class_input: {
            type: String,
            default: ''
        }
    })

    const model = defineModel('value')
</script>
<template>
    <div class="flex flex-col ga-2">
        <label for="input" v-if="label">{{ label }}</label>
        <input type="text" :placeholder="placeholder" :class="class_input" v-model="model">
    </div>
</template>