<template>
    <div class="flex h-screen">
        <div class="relative flex-1 hidden w-0 lg:block">
            <img class="absolute inset-0 object-cover w-full h-full"
             src="../../assets/images/login_img.webp" alt="">
        </div>
        <div class="flex flex-col justify-center flex-1 px-4 py-12
         sm:px-6 lg:flex-none lg:px-20 xl:px-24">
            <div class="flex items-center w-full h-full max-w-sm mx-auto
            lg:w-96">
                <AuthFormLogin @show-register="handleRegister" v-if="showLoginPage"/>
                <AuthFormRegister @show-login="handleLogin" v-if="showRegisterPage"/>
            </div>
        </div>
    </div>
</template>

<script setup>
const showLoginPage = ref(true)
const showRegisterPage = ref(false)
function handleRegister() {
  showLoginPage.value = !showLoginPage.value;
  showRegisterPage.value = !showRegisterPage.value
}

function handleLogin() {
  showLoginPage.value = !showLoginPage.value;
  showRegisterPage.value = !showRegisterPage.value
}
</script>