import {User} from "@prisma/client" 
export const userTransformer = (user: User) => {
    return {
        id: user.id,
        name: user.username,
        email: user.email,
        username: user.username,
        profileImage: user.profileImage,
    }
}