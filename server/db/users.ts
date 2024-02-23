import { prisma } from "."
import bcrypt from "bcrypt"
import {User} from "@prisma/client" 

export const createUser =  (userData: Omit<User, "id" | "createdAt">) => {
    const finalUserData = {
        ...userData,
        password: bcrypt.hashSync(userData.password, 10)
    }

    return prisma.user.create({
        data: finalUserData
    })
}

export const getUserByUsername = (username: string) => {
    return prisma.user.findUnique({
        where: {
            username
        }
    })
}

export const getUserById = (userId: number) => {
    return prisma.user.findUnique({
        where: {
            id: userId
        }
    })
}