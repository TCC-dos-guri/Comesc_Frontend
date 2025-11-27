<template>
    <div class="fixed inset-0 z-[99999999] bg-[rgba(0,0,0,0.5)] flex flex-col gap-3 overflow-hidden justify-center items-center">
        <div class="bg-white flex flex-col p-5 gap-10 rounded-xl">
          <p class="text-2xl p-2">Tem certeza que deseja excluir esse lote?</p>
          <div class="flex justify-end gap-5 items-center">
              <button class="bg-neutral-700 text-white text-xl w-28 p-2 rounded" @click="$emit('close', 's')">Sim</button>
              <button class="bg-red-700 text-white text-xl w-28 p-2 rounded" @click="$emit('close', 'n')">Não</button>
          </div>
        </div>
    </div>
</template>

