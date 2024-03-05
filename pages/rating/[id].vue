<template>

</template>

<script setup>
const ratingId = parseInt(useRoute().params.id);
const ratingDetails= ref(null);

watch(() => useRoute().fullPath, async() => {await getRatingDetails();})

async function getRatingDetails() {
    ratingDetails.value = await $fetch('/api/rating/get_rate_for_page', {
        method: 'POST',
        body: { ratingId: ratingId }
    })
}


onBeforeMount( async () => {
    await getRatingDetails();
})

</script>