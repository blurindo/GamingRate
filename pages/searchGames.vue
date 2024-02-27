<template>
    <div v-for="game in gamesList">
       <SearchGameResult :game="game" @click.native="redirect(game)"/>
    </div>
</template>

<script setup>
const { mapGameDto } = useGameDtoMapper()
definePageMeta({
  layout: 'default'
})
const gamesQuery = ref(null)
const gamesList = ref(null)
watch(() => useRoute().fullPath, () => getGamesList())

async function getGamesList() {
    gamesQuery.value = useRoute().query.games;
    const  data  = await $fetch('/api/games/search', {
        method: 'POST',
        body: { searchQuery: gamesQuery.value }
    })
    gamesList.value = data.games

    let listOfObjects = []
    console.log(gamesList.value)
    gamesList.value.forEach(element => {
        listOfObjects.push(mapGameDto(element))
    });
    gamesList.value = listOfObjects
}

function redirect(game) {
    navigateTo(`/game/${game.id}`)
}

onBeforeMount(() => {
    getGamesList()
})
</script>