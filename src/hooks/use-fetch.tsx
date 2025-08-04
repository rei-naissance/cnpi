// import { useState } from "react"

// interface UseFetchResult<T, A extends any[]> {
//     data: T | null;
//     loading: boolean;
//     error: Error | null;
//     func: (...args: A) => Promise<void>;
// }

// function useFetch<T, A extends any[]>(
//     cb: (...args: A) => Promise<T>
// ): UseFetchResult<T, A> {
//     const [data, setData] = useState<T | null>(null)
//     const [loading, setLoading] = useState<boolean>(false)
//     const [error, setError] = useState<Error | null>(null)

//     const func = async (...args: A) => {
//         setLoading(true)
//         setError(null)
//         try {
//             const response = await cb(...args)
//             setData(response)
//         } catch (err) {
//             setError(err instanceof Error ? err : new Error('An error occurred'))
//         } finally {
//             setLoading(false)
//         }
//     }

//     return { data, loading, error, func }
// }

// export default useFetch

import { useState } from "react"

interface FetchOptions {
    [key: string]: any;
}

type CallbackFunction<T, A extends any[]> = (options: FetchOptions, ...args: A) => Promise<T>;

interface UseFetchResult<T, A extends any[]> {
    data: T | null;
    loading: boolean;
    error: Error | null;
    func: (...args: A) => Promise<void>;
}

function useFetch<T, A extends any[] = any[]>(
    cb: CallbackFunction<T, A>,
    options: FetchOptions = {}
): UseFetchResult<T, A> {
    const [data, setData] = useState<T | null>(null)
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<Error | null>(null)

    const func = async (...args: A) => {
        setLoading(true)
        setError(null)
        try {
            const response = await cb(options, ...args)
            setData(response)
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'))
        } finally {
            setLoading(false)
        }
    }

    return { data, loading, error, func }
}

export default useFetch