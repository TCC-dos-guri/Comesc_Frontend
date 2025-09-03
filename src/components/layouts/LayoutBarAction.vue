<script setup>
    import GlobalButton from '../global/buttons/GlobalButton.vue';
    import { InfoBtn } from '@/utils/info_buttons';
</script>
<template>
<div class="absolute bottom-0 w-full p-5 shadow-[20px_20px_20px_0_black]">
    <div class="flex justify-center align-center gap-7 ">
        <GlobalButton v-for="btn, i in InfoBtn" :key="i" :extraDiv="btn.extra_div" :title="btn.title" :icon="btn.icon" :btnStyle="btn.btn_style" :color_text="btn.text_color"/>
    </div>
</div>
</template>