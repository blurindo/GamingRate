<template>
    <div class="flex flex-col gap-5 text-stone-300 font-sans">
        <div class="flex justify-center gap-5">
            <div class="flex flex-col">
                <v-sheet :elevation="24">
            <v-img
            :width="300"
            aspect-ratio="1/1"
            cover
            :src="`${userFromProfileDetails?.profileImage}`"
        >
            </v-img>
            </v-sheet>
            <div class="p-2 font-bold text-xl">
                Ratings:
                <div>
                    {{ numberOfGames }}
                </div>
            </div>
            </div>
                <div class="flex flex-col">
                    <div class="font-bold text-5xl">{{ userFromProfileDetails?.username }}</div>
                    <div class="pb-2">Created at: {{ userFromProfileDetails.createdAt }} </div>
<!--  "-->
                    <v-btn v-if="isThisPersonFriend !== null" @click="sendFriendInvitation"  variant="tonal" :disabled="isFriendAdded">
                    {{ friendInviteStatus }}
                    </v-btn>
                </div>
        </div>
        <div class="flex flex-row gap-36 place-content-between">
            <div class="font-bold">
            Recently rated games:
            <div class="flex flex-row gap-4 pt-1">
                <v-card v-for="lastGame in lastRatedGames"
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
                    <v-btn @click="showGameRatePage(lastGame.userId, lastGame.gameId)" class="flex-shrink-0" prepend-icon="mdi-comment-outline">
                        Comment
                    </v-btn>
                </v-card>
            </div>
        </div>
        <div class="font-bold cursor-pointer">
            Friends:
            <div class="flex flex-row gap-4 pt-1">
                <v-card v-for="lastFriend in lastFriends"
                max-width="150"
                class="d-block text-break"
                density="comfortable"
                @click="redirectToProfile(lastFriend)"
                >               
                    <v-img
                    :src="`${lastFriend.user?.profileImage || lastFriend.friend?.profileImage}`"
                    :width="200"
                    cover>
                    </v-img>
                    <div class="p-1">
                        {{lastFriend.user?.username || lastFriend.friend?.username}}
                    </div>
                </v-card>
            </div>
        </div>
        </div>
    </div>
</template>

<script setup>
const { useAuthUser } = useAuth();
const friendInviteStatus = ref('Add friend');
const isFriendAdded = ref(false);
const user = useAuthUser();
const userIdFromProfile = parseInt(useRoute().params.id);
const userFromProfileDetails = ref({
    createdAt: "2024-02-27T22:47:11.957Z"
})
const numberOfGames = ref(0);
const isThisPersonFriend = ref(null);
const lastRatedGames = ref(null)
const lastFriends = ref(null)

watch(() => useRoute().fullPath, async() => {await getUserDetails();})
const releaseDate = (dateToChange) => {
    var timestamp = dateToChange
    var date = new Date(timestamp);
    var formattedDate = (date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear();

    return formattedDate;
}

async function getUserDetails() {
    numberOfGames.value = await $fetch('/api/rating/get_count_user_rates', {
        method: 'POST',
        body: { userId: userIdFromProfile }
    })

    if (user.value.id !== userIdFromProfile) {
        isThisPersonFriend.value = await $fetch('/api/user/friend/check_if_friend', {
            method: 'POST',
            body: {
                userId: user.value.id,
                friendId: userIdFromProfile
                }
        })
    }

    console.log(isThisPersonFriend.value)
    
    lastRatedGames.value = await $fetch('/api/rating/get_last_three_user_rates', {
        method: 'POST',
        body: {
            userId: userIdFromProfile
        }
    })
    console.log(lastRatedGames.value)

    lastFriends.value = await $fetch('/api/user/friend/get_last_three_friends', {
        method: 'POST',
        body: {
            userId: userIdFromProfile
        }
    })

    userFromProfileDetails.value = await $fetch('/api/user/get_user_details', {
        method: 'POST',
        body: {
            userId: userIdFromProfile
        }
    })

    userFromProfileDetails.value.createdAt = releaseDate(userFromProfileDetails.value.createdAt)

    console.log(lastRatedGames.value)
    console.log(lastFriends.value)
    console.log(userFromProfileDetails.value)
}

onBeforeMount( async () => {
    await getUserDetails();
})

async function redirect(game) {
    await navigateTo(`/game/${game.id}`)
}

async function redirectToProfile(friend) {
    await navigateTo(`/profile/${friend.user?.id || friend.friend?.id}`);
}

async function sendFriendInvitation() {
    const res = await $fetch('/api/user/friendRequest/create_friend_invite', {
        method: 'POST',
        body: {
            senderId: user.value.id,
            receiverId: userIdFromProfile
        }
    })

    friendInviteStatus.value = 'Sent'
    isFriendAdded.value = true; 
}

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