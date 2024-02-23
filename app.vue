<template>
  <LoadingPage v-if="isAuthLoading"/>

  <div v-else-if="user" class="min-h-full bg-stone-700">
    <div class="sticky top-0">
      <Navbar />
    </div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>

  <AuthPage v-else/>
</template>

<script setup>
const darkMode = ref(false);
const {useAuthUser, initAuth, useAuthLoading, logout} = useAuth();
const isAuthLoading = useAuthLoading();
const user = useAuthUser();

onBeforeMount(() => {
  initAuth();
})
</script>
