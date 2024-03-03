<template>
    <div class="w-full">
        <div class="flex justify-center">
            <div class="w-20 h-20">
                <LogoPage class="w-20 h-20"/>
            </div>
        </div>
        <div class="pt-5 space-y-6">
            <UIInput colorOfText="black" value="" label="Email" placeholder="email" v-model="data.email"/>
            <UIInput colorOfText="black" value="" label="Username" placeholder="username" v-model="data.username"/>
            <UIInput colorOfText="black" value="" label="Password" placeholder="******" type="password" v-model="data.password"/>
            <UIInput colorOfText="black" value="" label="Repeat Password" placeholder="******" type="password" v-model="data.repeatPassword"/>
            <div>
                <input type="file" class="block w-full px-4 border-gray-300 rounded-full shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            accept="image/png, image/gif, image/jpeg" @change="handleImageChange">
            </div>
            
            <UIButton colorOfText="black" @click="handleRegister" liquid :disabled="isButtonDisabled">
                Register
            </UIButton>
        </div>
        <p @click="showLoginForm" class="flex justify-center mt-1 text-sm cursor-pointer hover:underline underline-offset-8">Already have an account?</p>
    </div>
</template>

<script setup>
const emits = defineEmits(['showLogin']);
const selectedFile = ref(null)
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
            repeatPassword: data.repeatPassword,
            mediaFile: [selectedFile.value]
        })
    } catch (error) {
        console.log(error)
    } finally {
        data.loading = false
        emits('showLogin')
    }
}

function handleImageChange(event) {
    const file = event.target.files[0]
    selectedFile.value = file
    // const reader = new FileReader()

    // reader.onload = (event) => {
    //     inputImageUrl.value = event.target.result
    //     console.log(inputImageUrl.value)
    // }
    // reader.readAsDataURL(file)

    // //const uploadtest = uploadImage()
    // console.log(event.target.result)
}

const isButtonDisabled = computed(() => {
    return (!data.username || !data.password) || !data.email || !data.repeatPassword || data.loading
})
function showLoginForm() {
    emits('showLogin')
}
</script>