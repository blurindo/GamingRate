<template >
  <v-app>
    <LoadingPage v-if="isAuthLoading"/>

<div v-else-if="user" class="min-h-full ">
    <v-app-bar>
    <div class="flex-grow">
      <Navbar/>
    </div>
    <div
    class="px-1">
    <NuxtLink :to="`/profile/${user.id}`">
      <v-avatar
      size="50"
      :image="user.profileImage">
      </v-avatar>
    </NuxtLink>
    </div>
    </v-app-bar>

    <v-navigation-drawer
    scroll-behavior="hide" :rail="mdAndDown" :expand-on-hover="mdAndDown" permanent color="#292524"> 
      <v-list color="#292524" nav>
        <NuxtLink to="/"><v-list-item prepend-icon="mdi-home-outline" base-color="grey-darken-1" link>Home</v-list-item></NuxtLink>
        <NuxtLink :to="`/profile/${user.id}`"><v-list-item prepend-icon="mdi-account-outline" base-color="grey-darken-1" link >Profile</v-list-item></NuxtLink>
        <NuxtLink to="/friendsActivity"><v-list-item prepend-icon="mdi-account-multiple-outline" base-color="grey-darken-1" link >Friends Activity</v-list-item></NuxtLink>
        <NuxtLink to="/friendsInvitations"><v-list-item prepend-icon="mdi-email-outline" base-color="grey-darken-1" link >Requests</v-list-item></NuxtLink>
        <NuxtLink to="/searchPeople"><v-list-item prepend-icon="mdi-magnify" base-color="grey-darken-1" link >Find people</v-list-item></NuxtLink>
        <v-list-item @click="handleLogout" style="bottom: 0;position: fixed;" prepend-icon="mdi-logout" base-color="grey-darken-1" link >Logout</v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-main>
      <v-container>
        <slot/>
      </v-container>
    </v-main>
</div>

  <AuthPage v-else/>
</v-app>
</template>

<script setup>
import { useDisplay } from 'vuetify';

useHead({
  bodyAttrs: {
    class: 'bg-stone-700'
  }
})

const darkMode = ref(false);
const { mdAndDown } = useDisplay()
const {useAuthUser, initAuth, useAuthLoading, logout} = useAuth();
const isAuthLoading = useAuthLoading();
const user = useAuthUser();

async function handleLogout() {
  logout()
  await navigateTo('/')
}


onBeforeMount(() => {
  initAuth();
})
</script>