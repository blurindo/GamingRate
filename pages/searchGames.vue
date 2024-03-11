<template>
    <div>
    <LoadingPage v-if="loading"/>
    <!-- <div v-else v-for="game in gamesList">
       <SearchGameResult :game="game" @click.native="redirect(game)"/>
    </div> -->
        <div v-else>
            <v-card v-for="game in gamesList"
            @click="redirect(game)"
            class="mb-5">
                <div class="flex flex-row">
                    <v-img
                    class="cursor-pointer ml-2 my-4"
                    :width="200"
                    aspect-ratio="1/1"
                    :max-width="200"
                    :src="`https://images.igdb.com/igdb/image/upload/t_cover_big/${game.cover.imageId}.png`"
                    >
                    </v-img>
                    <div class="text-2xl cursor-pointer pl-3 pt-4">
                        {{ game.name }}
                    </div>
                </div>
            </v-card>
        </div>
    </div>
</template>

<script setup>
const { mapGameDto } = useGameDtoMapper()
definePageMeta({
  layout: 'default'
})
const loading = ref(true);
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
    gamesList.value.forEach(element => {
        listOfObjects.push(mapGameDto(element))
    });
    gamesList.value = listOfObjects


    loading.value = false;
}

async function redirect(game) {
    await navigateTo(`/game/${game.id}`)
}

onBeforeMount(() => {
    getGamesList()
})
</script>