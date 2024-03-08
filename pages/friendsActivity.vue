<template>
    <div>
    <LoadingPage v-if="loading"/>
    <div v-else class="flex flex-col">
        <div class="self-center font-bold text-5xl pb-2">
            Ratings of your friends
        </div>
        <div v-if="friendGameRates == null || friendGameRates?.length === 0" class="self-center pt-5 text-xl">Unfortunately there is no activity from your friends</div>
        <v-card v-for="gameRate in friendGameRates"
        class="mt-2">
            <div class="flex flex-row">
            <v-avatar class="cursor-pointer ml-2 mt-2" @click="redirectToProfile(gameRate?.userId)" :image="`${gameRate?.user.profileImage}`" size="50"></v-avatar>
            <div class="flex flex-col pl-2 pt-4">
                <div>
                    <strong class="cursor-pointer" @click="redirectToProfile(gameRate?.userId)">{{ gameRate?.user.username }}</strong> <span>rated this game</span>
                </div>
                <div class="text-sm">
                    {{ moment(gameRate?.createdAt).fromNow() }}
                </div>
            </div>
            </div>
            <v-divider class="pb-2 m-4"></v-divider>
        <div class="flex flex-row">
            <div class="flex flex-col pb-1">
            <v-img
            class="cursor-pointer ml-2 mb-2"
            @click="redirectToGame(gameRate?.game?.id)"
            :width="200"
            aspect-ratio="1/1"
            :max-width="200"
            :src="`https://images.igdb.com/igdb/image/upload/t_cover_big/${gameRate?.game?.cover.image_id}.png`"
            >
            </v-img>
            <v-btn @click="showGameRatePage(gameRate.userId, gameRate.gameId)" class="flex-shrink-0" prepend-icon="mdi-comment-outline">
                Comment
            </v-btn>
            </div>
            <div class="flex flex-col pl-4">
                <div class="text-xs pb-1">
                    Rated game:
                </div>
                <div class="text-xl cursor-pointer" @click="redirectToGame(gameRate?.game?.id)">
                    {{ gameRate?.game?.name }}
                </div>
                <div class="text-xs pt-2">
                    Given rate:
                </div>
                <v-rating
            v-model="gameRate.rate"
            readonly
            ></v-rating>
            </div>
        </div>
        </v-card>
    </div>
    </div>
</template>

<script setup>
import moment from 'moment';
const loading = ref(true);
const { useAuthUser } = useAuth();
const user = useAuthUser();
const friendGameRates = ref(null);
const testRate = ref(1);
watch(() => useRoute().fullPath, () => getFriendGameRates())

async function getFriendGameRates () {
    friendGameRates.value = await $fetch('/api/rating/get_your_friends_rates', {
        method: 'POST',
        body: { userId: user.value.id }
    })
    loading.value = false;
}

async function redirectToProfile(userId) {
    await navigateTo(`/profile/${userId}`);
}

async function redirectToGame(gameId) {
    await navigateTo(`/game/${gameId}`);
}

onBeforeMount(async () => {
    await getFriendGameRates()
})

async function showGameRatePage(userId, gameId) {
    const res = await $fetch('/api/rating/get_rate', {
        method: 'POST',
        body: {
            userId: userId,
            gameId: gameId
        }
    });

    await navigateTo(`/rating/${res.id}`);
}

</script>