<template>
    <div>
    <v-card class="mt-5">
    <div class="flex flex-col m-3">
        <div class="flex flex-row">
            <v-avatar class="cursor-pointer" @click="redirectToProfile(ratingDetails?.userId)" :image="`${ratingDetails?.user.profileImage}`" size="80"></v-avatar>
            <div class="flex flex-col pl-2 pt-4">
                <div>
                    <strong class="cursor-pointer" @click="redirectToProfile(ratingDetails?.userId)">{{ ratingDetails?.user.username }}</strong> <span>rated this game</span>
                </div>
                <div class="text-sm">
                    {{ moment(ratingDetails?.createdAt).fromNow() }}
                </div>
            </div>
        </div>
        <div>
        </div>
        <v-divider class="pb-2 m-4"></v-divider>
        <div class="flex flex-row">
            <v-img
            class="cursor-pointer"
            @click="redirectToGame(ratingDetails?.game?.id)"
            :width="200"
            aspect-ratio="1/1"
            :max-width="200"
            :src="`https://images.igdb.com/igdb/image/upload/t_cover_big/${ratingDetails?.game?.cover.image_id}.png`"
            >
            </v-img>
            <div class="flex flex-col pl-4">
                <div class="text-xs pb-1">
                    Rated game:
                </div>
                <div class="text-xl cursor-pointer" @click="redirectToGame(ratingDetails?.game?.id)">
                    {{ ratingDetails?.game?.name }}
                </div>
                <div class="text-xs pt-2">
                    Given rate:
                </div>
                <v-rating
            v-model="ratingOfUser"
            readonly
            ></v-rating>
            </div>
            <div class="ml-auto">
            <v-card
            class=""
            elevation="10"
            height="200"
            width="360"
            >
            <div class="flex flew-row gap-5 justify-center py-4">
                <div class="font-bold d-flex justify-center mt-auto text-h5">
                    Your rating
                </div>
            </div>
            <v-rating
            class="d-flex justify-center"
                readonly
                v-model="yourRating"
                color="yellow-darken-3"
                active-color="blue"
                length="5"
            ></v-rating>
        </v-card>
        </div>
        </div>
    </div>
    </v-card>
    <v-card v-for="comment in commentsList"
    class="mx-40">
    <v-divider></v-divider>
        <div>
            <div class="flex flex-row">
                <v-avatar class="cursor-pointer ml-1 mt-1" @click="redirectToProfile(comment?.userId)" :image="`${comment.profileImage}`" size="50"></v-avatar>
                <div class="flex flex-col pl-2 pt-4">
                    <div>
                        <strong class="cursor-pointer" @click="redirectToProfile(comment?.userId)">{{ comment?.username }}</strong>
                    </div>
                </div>
                <div class="text-xs ml-auto pr-2 pt-2">
                        {{ moment(comment?.createdAt).fromNow() }}
                </div>
            </div>
        </div>
        <v-card-text>
            {{ comment?.text }}
        </v-card-text>
    </v-card>
    <v-textarea
        v-model="commentText"
        @keyup.enter="postComment"
          class="mx-40"
          label="Share your comment"
          prepend-inner-icon="mdi-comment"
          rows="3"
        ></v-textarea>
    </div>
</template>

<script setup>
import moment from 'moment';
const { useAuthUser } = useAuth();
const user = useAuthUser();
const ratingId = parseInt(useRoute().params.id);
const ratingDetails= ref(null);
const commentsList = ref(null);
const yourRatingDetails = ref(null);
const ratingOfUser = ref(0);
const yourRating = ref(0);
const commentText = ref('');

watch(() => useRoute().fullPath, async() => {await getRatingDetails();})
watch(ratingDetails, async (newValue) => {ratingOfUser.value = newValue.rate})
watch(yourRatingDetails, async (newValue) => {newValue? yourRating.value = newValue.rate : 0})

async function getRatingDetails() {
    ratingDetails.value = await $fetch('/api/rating/get_rate_for_page', {
        method: 'POST',
        body: { rateId: ratingId }
    })

    commentsList.value = await $fetch('/api/rating/get_comments', {
        method: 'POST',
        body: { rateId: ratingId }
    })

    if(ratingDetails.value && ratingDetails.value.game && ratingDetails.value.game.id) {
        console.log('test')
    yourRatingDetails.value = await $fetch('/api/rating/get_rate', {
        method: 'POST',
        body: {
            userId: user.value.id,
            gameId: ratingDetails.value.game?.id
         }
        })
    }
}

async function postComment() {

    if (commentText.value.length == 0) {
        commentText.value = '';
        return;
    }

    const res = await $fetch('/api/rating/create_comment', {
        method: 'POST',
        body: {
            gameRateId: ratingId,
            userId: user.value.id,
            text: commentText.value
        }
    })
    commentText.value = '';
        if(res) {
        commentsList.value = await $fetch('/api/rating/get_comments', {
            method: 'POST',
            body: { rateId: ratingId }
        })
        console.log(commentsList.value)
    }
}

async function redirectToProfile(userId) {
    await navigateTo(`/profile/${userId}`);
}

async function redirectToGame(gameId) {
    await navigateTo(`/game/${gameId}`);
}

onBeforeMount( async () => {
    await getRatingDetails();
})

</script>