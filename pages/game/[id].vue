<template>
    <div>
    <LoadingPage v-if="loading"/>   
    <div v-else class="p-3 flex flex-row gap-5 text-stone-300 font-sans">
        <div class="pt-8">
            <v-sheet :elevation="24">
            <v-img
            :width="200"
            aspect-ratio="1/1"
            cover
            :src="`https://images.igdb.com/igdb/image/upload/t_cover_big/${gameDetails?.cover?.image_id}.png`"
        >
            </v-img>
            </v-sheet>
        </div>
        <div class="flex flex-col gap-5">
            <div class="self-center font-bold text-5xl">
                {{ gameDetails?.name }}
            </div>
            <v-sheet
          class="pa-6 font-weight-bold"
          color="grey-darken-3"
          rounded
          :border="'md'"
        >
          <div class="font-weight-regular">
            {{ storyline }}
            </div>
          <v-row no-gutters
          >
          <v-col>
          <div>Platforms:
            <div v-for="platform in gameDetails.platforms" class="font-weight-regular">
                {{ platform.name }}
            </div>
            </div>
        </v-col>
        <v-col>
            <div>Genres:
            <div v-for="genre in gameDetails.genres" class="font-weight-regular">
                {{ genre.name }}
            </div>
            </div>
        </v-col>
        </v-row>
        <v-row no-gutters class="pt-1"
          >
          <v-col>
          <div>Developer:
            <div v-for="studio in gameDetails.involved_companies" class="font-weight-regular">
                {{ !studio.publisher ? studio.company.name:'' }}
            </div>
            </div>
        </v-col>
        <v-col>
            <div>Publisher:
            <div v-for="studio in gameDetails.involved_companies" class="font-weight-regular">
                {{ studio.publisher ? studio.company.name:'' }}
            </div>
            </div>
        </v-col>
        </v-row>
        <v-row no-gutters class="pt-1">
            <v-col>
            <div>Release date:
                <div class="font-weight-regular">{{ releaseDate }}</div>
            </div>
        </v-col>
        </v-row>
        </v-sheet>
        </div>
        <div class="pt-8 ">
            <v-card
            class=""
            elevation="10"
            height="200"
            width="360"
            >
            <div class="flex flew-row gap-5 justify-center py-4">
                <v-chip variant="flat" color="grey-lighten-4">
                {{ rating }}
                </v-chip>
                <div class="font-bold">
                    {{ ratingDescription }}
                </div>
            </div>
            <v-rating
            class="d-flex justify-center"
                hover
                v-model="rating"
                color="yellow-darken-3"
                active-color="blue"
                length="5"
            ></v-rating>
            <div class="d-flex justify-center mt-auto text-h5 ">
                Share your rating with us!
            </div>
        </v-card>
        </div>
    </div>
    </div>
</template>

<script lang="ts" setup>
import { Game } from '~/server/models/GameForSinglePage';
//vuetify rating
definePageMeta({
  layout: 'default'
})
const { useAuthUser } = useAuth();
const loading = ref(true);
const user = useAuthUser();
const gamesQuery = ref()
const gameDetails: Ref<any> = ref({
    id: 1,
    imageId: "undefined",
    first_release_date: 9999,
    genres: [],
    storyline: "Storyline information is not available for this game.",
    involved_companies: [],
    name: "None",
    platforms: []
})
const storyline = computed(() => {
  return gameDetails.value?.storyline || "Storyline information is not available for this game.";
});

const releaseDate = computed(() => {
    var timestamp = gameDetails.value.first_release_date;
    var date = new Date(timestamp * 1000);
    var formattedDate = (date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear();

    return formattedDate;
})

enum StarRating {
    Poor = "I hate this",
    Fair = "Really bad",
    Good = "Could be better, but it's ok",
    VeryGood = "Really enjoyable",
    Excellent = "Best game ever played!!!"
}

function getRatingDescription(rating: number): string {
    switch(rating) {
        case 1: return StarRating.Poor;
        case 2: return StarRating.Fair;
        case 3: return StarRating.Good;
        case 4: return StarRating.VeryGood;
        case 5: return StarRating.Excellent;
        default: return "Unknown Rating"; // Handle invalid ratings
    }
}

interface gameDets {
    games: any
}

const rating = ref(0);
const ratingDescription = ref()
const canBeUpdated = ref(false)

watch(() => useRoute().fullPath, () => {getGameDetails();})
watch(rating, async (newValue) => {ratingDescription.value = getRatingDescription(newValue)


    const res = await $fetch('/api/rating/rate_game', {
        method: 'POST',
        body: {
            userId: user.value.id,
            rate: rating.value,
            gameId: gameDetails.value?.id,
            canBeUpdated: canBeUpdated.value
         }
    })
})


async function getGameDetails() {
    gamesQuery.value = useRoute().params.id;
    const  data: gameDets  = await $fetch('/api/games/single', {
        method: 'POST',
        body: { searchQuery: gamesQuery.value }
    })
    gameDetails.value = data.games[0]
    
    const res = await $fetch('/api/rating/get_rate', {
        method: 'POST',
        body: {
            userId: user.value.id,
            gameId: gameDetails.value?.id,
         }
    })

    if (res) {
        rating.value = res.rate;
        canBeUpdated.value = true;
    }
    
    loading.value = false
}


onBeforeMount(async () => {
   await getGameDetails()
})

onMounted(async () => {
    
})
</script>