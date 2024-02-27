<template>
<div class="max-w-sm w-full lg:max-w-full lg:flex lg:flex-row">
  <div class="h-auto lg:h-auto lg:w-48 flex-none rounded-t lg:rounded-t-none lg:rounded-l text-center overflow-hidden">
    <img :src="`https://images.igdb.com/igdb/image/upload/t_screenshot_med/${game.cover.imageId}.png`" alt="GameTitle" class="w-full h-full object-contain">
  </div>
  <div class="flex-grow border-r border-b border-l border-gray-400 lg:border-l-0 lg:border-t lg:border-gray-400 bg-white rounded-b lg:rounded-b-none lg:rounded-r p-4 flex flex-col justify-between leading-normal lg:pb-8">
    <div class="mb-8">
      <div class="text-gray-900 font-bold text-xl mb-2">{{ game.name }}</div>
    </div>
  </div>
</div>
</template>

<script setup>
const props = defineProps({
    game: Object
})
</script>
