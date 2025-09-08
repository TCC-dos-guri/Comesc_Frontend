<script setup>
    import LayoutBarAction from '@/components/layouts/LayoutBarAction.vue';
    import DefaultCardContainer from '@/components/employee-system/layouts/containers/DefaultCardContainer.vue';
    import DefaultCard from '@/components/global/cards/DefaultCard.vue';
    import { HeaderDefault } from '@/components';
    import { useBatchStore, useRollStore } from '@/stores';
    import { useRoute } from 'vue-router';
    import { onMounted, ref } from 'vue';
    const batchStore = useBatchStore()
    const rollStore = useRollStore()
    const route = useRoute()
    const {id} = route.params
    const infoArr = ref([])

    onMounted(async() => {
        await batchStore.GetBatchById(id)
        await rollStore.GetRolls()
        const objValues = Object.values(batchStore.batchById[0])  
        const valuesUncount = [0, 1, 5, 6, 9]  
        const filterItems = objValues.filter((el, i) => !valuesUncount.includes(i))
        const newObjects = ['Quantidade de peças', 'Peso', 'Preço', 'Composição', "Status"]
        newObjects.forEach((el, i) => {
            infoArr.value.push({[el]: filterItems[i]})
        })
    })
</script>
<template>
    <HeaderDefault/>
    <div class="p-5 flex flex-col gap-5">
        <h1 class="text-center text-3xl font-semibold">Lote</h1>
        <h1 class="text-center text-4xl font-semibold">Nº {{ batchStore.batchById[0].invoice }}</h1>
    </div>
    <div class="relative w-full h-96">
            <img :src="batchStore.batchById[0].cover.url" alt="" class="w-full h-96 absolute" >
            <div class="w-100 flex flex-col relative text-white p-5 gap-5">
                <h1 class="text-center text-2xl">{{ batchStore.batchById[0].material }}</h1>
                <h2 class="text-center text-xl">informações</h2>
                <div class="flex justify-between" v-for="info, i in infoArr" :key="i">
                    <h1 >{{ Object.keys(info)[0] }}:</h1>
                    <h1 class="me-10">{{ Object.values(info)[0] }}</h1>
                </div>
            </div>
        </div>
        <div class="flex items-center justify-between p-5">
            <div class="flex gap-2 items-center justify-center">
                <div class="bg-[#2C2149] text-white size-8 rounded-full flex justify-center items-center">
                    <i class="mdi mdi-plus text-xl font-bold"></i>
                </div>
                <h1>Informações</h1>
            </div>  
            <h1>Rolos Revisados: 0/{{ rollStore.roll.length }}</h1>
        </div>
        <DefaultCardContainer>
            <DefaultCard v-for="roll in rollStore.roll.filter((el) => el.batch.id === id * 1)" :key="roll.production_order" :invoice="roll.production_order"  :material_name="`${roll.kg}kg`" :image="batchStore.batchById[0].cover.url"/>
        </DefaultCardContainer>
        <LayoutBarAction />
</template>