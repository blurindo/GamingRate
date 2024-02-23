interface FetchOptions {
    headers?: Record<string, string>;
  }

export default (url: string, options:FetchOptions = {}) => {
    const{ useAuthToken } = useAuth();

    return $fetch(url, {
        ...options,
        headers: {
            ...options.headers,
            Authorization: `Bearer ${useAuthToken().value}`
        }
    })
}