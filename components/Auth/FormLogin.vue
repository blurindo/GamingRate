<template>
    <div class="w-full">
        <div class="flex justify-center">
            <div class="w-20 h-20">
                <LogoPage />
            </div>
        </div>
        <div class="pt-5 space-y-6">
            <UIInput colorOfText="black" value="" label="Username" placeholder="username" v-model="data.username"/>
            <UIInput colorOfText="black" value="" label="Password" placeholder="******" type="password" v-model="data.password"/>

            <UIButton @click="handleLogin" liquid :disabled="isButtonDisabled">
                Login
            </UIButton>
            <p>Don't have account?</p>
        </div>
        <div @click="showRegisterForm" class="pt-2 cursor-pointer underline underline-offset-8">Click here!</div>
    </div>
</template>

<script setup>
const emits = defineEmits(['showRegister']);
const data = reactive({
    username: '',
    password: '',
    loading: false
})

async function handleLogin() {
    const { login } = useAuth()
    
    data.loading = true
    try {
        await login({
            username: data.username,
            password: data.password
        })
    } catch (error) {
        console.log(error)
    } finally {
        data.loading = false
    }
}

const isButtonDisabled = computed(() => {
    return (!data.username || !data.password) || data.loading
})

function showRegisterForm() {
    emits('showRegister');
}
</script>