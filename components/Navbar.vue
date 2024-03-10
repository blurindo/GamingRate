<template>
    <header>
        <nav class="container bg-stone-800 flex items-center min-w-full min-h-24 border-sky-200 py-4">
            <div class="flex items-center justify-between w-full">
                <NuxtLink to="/"><LogoPage class="w-20 h-20"/></NuxtLink>
                <UIInput class="flex-grow sm:mx-2 md:mx-64 lg:mx-96" placeholder="Search for your favourite game!" @keyup.enter="submit" v-model="gameToSearch"/>
            </div>   
        </nav>
    </header>
</template>

<script setup>
const gameToSearch = ref('')
async function submit() {
    await navigateTo({
        path: '/searchGames',
        query: {
            games: gameToSearch.value
        }
    })
    location.reload();
}

async function backToHome() {
    await navigateTo('/')
}


</script>