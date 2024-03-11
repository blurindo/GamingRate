<template>
    <div>
        <LoadingPage v-if="loading"/>
        
        <div v-else>
            <div class="self-center font-bold text-5xl pb-2">YOUR GAMES</div>
            <div class="flex flex-row gap-5">
            <v-card v-for="lastGame in gamesList"
                max-width="150"
                class="d-flex flex-column text-break cursor-pointer"
                density="comfortable"
                >               
                    <v-img
                    class="flex-shrink-0"
                    :src="`https://images.igdb.com/igdb/image/upload/t_cover_big/${lastGame.game.cover.image_id}.png`"
                    :width="200"
                    cover
                    @click="redirect(lastGame.game)">
                    <v-chip variant="flat" color="grey-darken-4">
                        {{ lastGame.rate }}
                    </v-chip>
                    </v-img>
                    <div class="p-1 flex-grow-1 min-h-0" @click="redirect(lastGame.game)">
                        {{lastGame.game.name}}
                    </div>
                    <v-divider></v-divider>
                    <v-btn @click="showGameRatePage(lastGame.id)" class="flex-shrink-0" prepend-icon="mdi-comment-outline">
                        Comment
                    </v-btn>
                </v-card>
            </div>
        </div>
    </div>
</template>

<script setup>
const loading = ref(true);
const userIdFromProfile = parseInt(useRoute().params.id);
const gamesList = ref(null);

async function getGamesList() {
    gamesList.value = await $fetch('/api/rating/get_all_user_rates', {
        method: 'POST',
        body: {
            userId: userIdFromProfile
        }
    })

    loading.value = false;
}

async function redirect(game) {
    await navigateTo(`/game/${game.id}`)
}

async function showGameRatePage(ratingId) {
    await navigateTo(`/rating/${ratingId}`);
}

onBeforeMount( async () => {
    await getGamesList();
})
</script>