<template>
    <div>
        {{ friendGameRates }}
    </div>
</template>

<script setup>
const { useAuthUser } = useAuth();
const user = useAuthUser();
const friendGameRates = ref(null);

watch(() => useRoute().fullPath, () => getFriendGameRates())

async function getFriendGameRates () {
    friendGameRates.value = await $fetch('/api/rating/get_your_friends_rates', {
        method: 'POST',
        body: { userId: user.value.id }
    })
}


onBeforeMount(async () => {
    await getFriendGameRates()
})
</script>