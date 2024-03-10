<template>
    <div>
        <LoadingPage v-if="loading"/>
        <div v-else>
            <div class=" flex justify-left text-lg">Your friends</div>
            <div class="flex flex-row gap-5">
            <v-sheet v-for="friend in friendsList"
            border
            rounded>
                <div class="flex flex-col">
                    <v-img
                    class="cursor-pointer"
                    @click="redirectToProfile(friend.id)"
                    :width="200"
                    aspect-ratio="1/1"
                    cover
                    :src="friend.profileImage"
                    ></v-img>
                    <div class="flex flex-col">
                        <div @click="redirectToProfile(friend.id)" class="self-center underline hover:underline-offset-2 cursor-pointer">
                            {{ friend.username }}
                        </div>
                    </div>
                </div>
            </v-sheet>
        </div>
        </div> 
    </div>
</template>

<script setup>
const loading = ref(true);
const userIdFromProfile = parseInt(useRoute().params.id);
const friendsList = ref(null);

async function getFriendsList() {
    friendsList.value = await $fetch('/api/user/friend/get_friends', {
        method: 'POST',
        body: {
            userId: userIdFromProfile
        }
    })

    loading.value = false;
}

async function redirectToProfile(userId) {
    await navigateTo(`/profile/${userId}`);
}

onBeforeMount( async () => {
    await getFriendsList();
})
</script>