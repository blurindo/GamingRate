<template>
    <div class="w-full">
        <div class="flex justify-center">
            <div class="w-20 h-20">
                <LogoPage class="w-20 h-20"/>
            </div>
        </div>
        <div class="pt-5 space-y-6">
            <UIInput value="" label="Email" placeholder="email" v-model="data.email"/>
            <UIInput value="" label="Username" placeholder="username" v-model="data.username"/>
            <UIInput value="" label="Password" placeholder="******" type="password" v-model="data.password"/>
            <UIInput value="" label="Repeat Password" placeholder="******" type="password" v-model="data.repeatPassword"/>
            <UIButton @click="handleRegister" liquid :disabled="isButtonDisabled">
                Register
            </UIButton>
        </div>
        <p @click="showLoginForm" class="flex justify-center mt-1 text-sm cursor-pointer hover:underline underline-offset-8">Already have an account?</p>
    </div>
</template>

<script setup>
const emits = defineEmits(['showLogin']);

const data = reactive({
    email: '',
    username: '',
    password: '',
    repeatPassword: '',
    loading: false
})

async function handleRegister() {
    const { register } = useAuth()
    
    data.loading = true
    try {
        await register({
            username: data.username,
            email: data.email,
            password: data.password,
            repeatPassword: data.repeatPassword
        })
    } catch (error) {
        console.log(error)
    } finally {
        data.loading = false
        emits('showLogin')
    }
}

const isButtonDisabled = computed(() => {
    return (!data.username || !data.password) || !data.email || !data.repeatPassword || data.loading
})
function showLoginForm() {
    emits('showLogin')
}
</script>