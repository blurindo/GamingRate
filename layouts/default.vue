<template >
    <LoadingPage v-if="isAuthLoading"/>

<div v-else-if="user" class="min-h-full bg-stone-700">
  <div class="sticky top-0 z-10">
    <Navbar />
  </div>
  <div class="flex lg:flex-row">
    <div class="sm:w-1/5 lg:fixed lg:h-full border-r border-gray-400">
      <div class="pl-2 pt-2 overflow-auto">
        <SidebarLeft/>
      </div>
    </div>
    <div class="flex-1 lg:ml-[20%]">
      <div class="grid grid-cols-12 sm:px-6 lg:max-w-7xl lg:px-8 lg:gap-5">
        <div class="col-span-12 md:col-span-8 lg:col-span-12 min-h-full bg-stone-700">
            <slot/>
        </div>
      </div>
    </div>
  </div>
</div>

  <AuthPage v-else/>
</template>

<script setup>
useHead({
  bodyAttrs: {
    class: 'bg-stone-700'
  }
})

const darkMode = ref(false);
const {useAuthUser, initAuth, useAuthLoading, logout} = useAuth();
const isAuthLoading = useAuthLoading();
const user = useAuthUser();
console.log(user.id)
onBeforeMount(() => {
  initAuth();
})
</script>