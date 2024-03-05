<template>
    <div class="flex flex-col">
        <h1 class="self-center font-bold text-5xl pb-5">Friend requests</h1>
        <div v-if="friendRequests.length == 0">
            Unfortunately, you have no friend invites
        </div>
        <div v-else class="flex flex-row gap-5">
            <v-sheet v-for="request in friendRequests"
            border
            rounded>
                <div class="flex flex-row">
                    <v-img
                    class="cursor-pointer"
                    @click="goToProfile(request)"
                    :width="100"
                    aspect-ratio="1/1"
                    cover
                    :src="request.senderProfileImage"
                    ></v-img>
                    <div class="flex flex-col">
                        <div @click="goToProfile(request)" class="self-center underline hover:underline-offset-2 cursor-pointer">
                            {{ request.senderUsername }}
                        </div>
                        <div class="ml-2">
                            Sent in {{ request.createdAt }}
                        </div>
                        <div>
                            <v-btn
                            @click="acceptRequest(request)"
                            class="mx-2"
                            color="green-darken-3">
                                Accept
                            </v-btn>
                            <v-btn
                            @click="declineRequest(request)"
                            class="mx-2"
                            color="red-darken-3">
                                Reject
                            </v-btn>
                        </div>
                    </div>
                </div>
            </v-sheet>
        </div>
    </div>
</template>

<script setup>
const { useAuthUser } = useAuth();
watch(() => useRoute().fullPath, () => getFriendRequests())
const user = useAuthUser();
const friendRequests = ref([])

async function getFriendRequests () {
    friendRequests.value = await $fetch('/api/user/friendRequest/get_friend_requests', {
        method: 'POST',
        body: { receiverId: user.value.id }
    })

    console.log(friendRequests.value)
}

onBeforeMount(async () => {
    await getFriendRequests()
})

function goToProfile(request) {
    navigateTo(`/profile/${request.senderId}`)
}

async function acceptRequest(request) {
    const res = await $fetch('/api/user/friendRequest/accept_friend_request', {
        method: 'POST',
        body: {
            receiverId: user.value.id,
            requestId: request.id
        }
    })
    const index = friendRequests.value.findIndex(invite => invite.id === request.id);
    friendRequests.value.splice(index,1)
}

async function declineRequest(request) {
    const res = await $fetch('/api/user/friendRequest/reject_friend_request', {
        method: 'POST',
        body: {
            receiverId: user.value.id,
            requestId: request.id
        }
    })
    const index = friendRequests.value.findIndex(invite => invite.id === request.id);
    friendRequests.value.splice(index,1)
}

</script>