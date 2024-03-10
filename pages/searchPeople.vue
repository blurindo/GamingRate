<template>
    <div>
      <v-text-field
        v-model="phrase"
        @click:append-inner="findPeople"
        append-inner-icon="mdi-magnify"
        label="Search for people"
        variant="solo"
        single-line
        :loading="loading"
        @keyup.enter="findPeople"
      ></v-text-field>
      <div v-if="showInfoAboutNoResult">
        Unfortunately, we couldn't find anyone who match your search
      </div>
      <div class="flex flex-col gap-5">
        <v-card v-for="person in foundPeople"
        height="90"
        >
            <div class="flex flex-row my-2">
            <v-avatar class="cursor-pointer ml-2 mt-2" @click="redirectToProfile(person?.id)" :image="`${person.profileImage}`" size="50"></v-avatar>
            <div class="flex flex-col pl-2 pt-4">
                <div>
                    <strong class="cursor-pointer" @click="redirectToProfile(person?.id)">{{ person.username }}</strong>
                </div>
                <div class="text-medium-emphasis text-xs">
                    Friends: {{ person.friendsCount }}
                </div>
                <div class="text-medium-emphasis text-xs">
                    Rated games: {{ person.gameRateCount }}
                </div>
            </div>
            </div>
        </v-card>
      </div>
    </div>
</template>

<script setup>
const loading = ref(false);
const foundPeople = ref(null);
const phrase = ref('');
const showInfoAboutNoResult = ref(false);

async function findPeople() {
    showInfoAboutNoResult.value = false;
    if(phrase.value.length == 0) {
        return;
    }

    loading.value = true;
    foundPeople.value = await $fetch('/api/user/find_users_by_phrase', {
        method: 'POST',
        body: {
            phrase: phrase.value,
        }
    })

    if (foundPeople.value.length === 0)
        showInfoAboutNoResult.value = true;

    loading.value = false;
}

async function redirectToProfile(userId) {
    await navigateTo(`/profile/${userId}`);
}

</script>