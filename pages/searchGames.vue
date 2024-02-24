<template>
    <div>
        {{ games }}
    </div>
</template>

<script setup>
definePageMeta({
  layout: 'default'
})
const games = ref(null)
watch(() => useRoute().fullPath, () => getGamesList())

async function getGamesList() {
    console.log(useRoute())
    games.value = useRoute().params.games;
}


onBeforeMount(() => {
    getGamesList()
})
</script>