<template>
    <div class= "min-h-screen text-3xl">
      <v-sheet
      class="mx-auto my-auto"
      elevation="8"
      max-width="900"   
      border>
      <LoadingPage v-if="loadingGames"/>
      <div v-else-if="recommendedGames">
        <h1 class="d-flex justify-center mt-2">Your recommendations</h1>
        <v-slide-group
        v-model="model"
        center-active
        show-arrows>
          <v-slide-group-item
          v-for="oneGame in recommendedGames"
          :key="oneGame.id"
          :value="`${oneGame.name}`"
          v-slot="{ toggle }">
            <v-card
            :class="['ma-4']"
            width="200"
            class="m-3"
            @click="toggle(); test(oneGame.id)">
              <v-img
                    class="d-flex fill-height align-center justify-center"
                    :src="`https://images.igdb.com/igdb/image/upload/t_cover_big/${oneGame.cover.image_id}.png`"
                    aspect-ratio="1/1"
                    height="100%"
                    cover>
              </v-img>
            </v-card>
          </v-slide-group-item>
        </v-slide-group>
        <v-expand-transition>
      <v-sheet
        v-if="model != null"
        height="200"
      >
        <div class="d-flex fill-height align-center justify-center flex-col">
          <h3 class="text-h6 pb-2">
             {{ model }}
          </h3>
          <v-btn
          rounded
          variant="elevated"
          size="x-large"
          @click="redirect">
            Check it
          </v-btn>
        </div>
      </v-sheet>
    </v-expand-transition>
        
      </div>
      <div v-else>
        <v-img src="../assets/images/revealgames.webp" @click="getRecommendations">
          <div class="flex justify-center my-12">
            Click here to reveal game recommendations for you
          </div>
        </v-img>
      </div>
      </v-sheet>
    </div>
</template>

<script setup>

const { useAuthUser } = useAuth();
const user = useAuthUser();
const recommendedGames = ref(null);
const model = ref(null);
const selectedGame = ref(null);
const loadingGames = ref(false);

definePageMeta({
  layout: 'default'
})

function test(gameId) {
  selectedGame.value = gameId;
}

async function getRecommendations() {
  loadingGames.value = true;
  recommendedGames.value = await $fetch('/api/recommendation/get_recommendations', {
        method: 'POST',
        body: { userId: user.value.id,
        }
    })
  loadingGames.value = false;  
}

async function redirect() {
    await navigateTo(`/game/${selectedGame.value}`)
}
</script>