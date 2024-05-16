import { jwtDecode } from "jwt-decode";
import { type User } from "@prisma/client" 

export default () => {
    interface ILoginParams {
        username: string;
        password: string;
      }

    interface IRegisterParams {
        email: string;
        username: string;
        password: string;
        repeatPassword: string;
        mediaFile: any;
    }

    interface ILoginResponse {
        access_token: string;
        user: Omit<User, "password" | "createdAt">
    }

    interface ITokenResponse {
        access_token: string;
    }

    interface AuthUser {
        email: string;
        id: string;
        name: string;
        profileImage: string;
        username: string;
      }

    const useAuthToken = () => useState('auth_token')
    const useAuthUser = () => useState<AuthUser>('auth_user')
    const useAuthLoading = () => useState('auth_loading', () => true)

    const setToken = (newToken: string | null) => {
        const authToken = useAuthToken();
        authToken.value = newToken;
    }

    const setUser = (newUser: Omit<User, "password" | "createdAt"> | null) => {
        const authUser = useAuthUser();
        authUser.value = newUser;
    }

    const setAuthLoading = (value: boolean) => {
        const authLoading = useAuthLoading();
        authLoading.value = value;
    }

    const login = ({username, password}: ILoginParams) => {
        return new Promise(async (resolve, reject) => {
            try {
                const data = await $fetch<ILoginResponse>('/api/auth/login', {
                    method: 'POST',
                    body: {
                        username,
                        password
                    }
                })
                setToken(data.access_token);
                setUser(data.user);

                resolve(true)
            } catch (error) {
                reject(error)
            }
        })
    }

    const register = ({email, username, password, repeatPassword, mediaFile}: IRegisterParams) => {
        const formData = new FormData();
        formData.append('email', email)
        formData.append('username', username)
        formData.append('password', password)
        formData.append('repeatPassword', repeatPassword)
        mediaFile.forEach((mediaFile: any, index: number) => {
            formData.append('media_file_' + index, mediaFile)
        })

        return new Promise(async (resolve, reject) => {
            try {
                const data = await $fetch<ILoginResponse>('/api/auth/register', {
                    method: 'POST',
                    body: formData
                })
                setToken(data.access_token);
                setUser(data.user);

                resolve(true)
            } catch (error) {
                reject(error)
            }
        })
    }

    const refreshToken = () => {
        return new Promise(async (resolve, reject) => {
            try {
                const data = await $fetch<ITokenResponse>('/api/auth/refresh');
                setToken(data.access_token);
                resolve(true)
            } catch (error) {
                reject(error)
            }
        })
    }

    const getUser = () => {
        return new Promise(async (resolve, reject) => {
            try {
                const data = await useFetchAuth('/api/auth/user') as ILoginResponse;
                setUser(data.user);
                resolve(true)
            } catch (error) {
                reject(error)
            }
        })
    }

    const reRefreshAccessToken = () => {
        const authToken =  useAuthToken()

        if (!authToken.value) {
            return
        }

        const jwt = jwtDecode(authToken.value as string)

        const newRefreshTime = (jwt.exp as number) - 60000

        setTimeout(async () => {
            await refreshToken();
            reRefreshAccessToken();
        }, newRefreshTime);
    }

    const initAuth = () => {
        return new Promise(async (resolve, reject) => {
            setAuthLoading(true)
            try {
                await refreshToken();
                await getUser();

                reRefreshAccessToken();

                resolve(true)
            } catch (error) {
                reject(error)
            } finally {
                setAuthLoading(false)
            }
        })
    }

    const logout = () => {
        return new Promise(async (resolve, reject) => {
            try {
                await useFetch('/api/auth/logout', {
                    method: 'POST'
                })

                setToken(null)
                setUser(null)
                resolve(true)
            } catch (error) {
                reject(error)
            }
        })
    }

    return {
        login,
        useAuthUser,
        initAuth,
        useAuthToken,
        useAuthLoading,
        logout,
        register
    }
}