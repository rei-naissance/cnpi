import { useState, useRef } from 'react'

interface UseFetchResult<T, A extends unknown[]> {
  data: T | null
  loading: boolean
  error: Error | null
  func: (...args: A) => Promise<void>
}

function useFetch<T, A extends unknown[]>(
  cb: (...args: A) => Promise<T>
): UseFetchResult<T, A> {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<Error | null>(null)
  const abortRef = useRef<AbortController | null>(null)

  const func = async (...args: A): Promise<void> => {
    abortRef.current?.abort()
    abortRef.current = new AbortController()

    setLoading(true)
    setError(null)
    try {
      const response = await cb(...args)
      setData(response)
    } catch (err) {
      if (err instanceof Error && err.name !== 'AbortError') {
        setError(err)
      } else if (!(err instanceof Error)) {
        setError(new Error('An error occurred'))
      }
    } finally {
      setLoading(false)
    }
  }

  return { data, loading, error, func }
}

export default useFetch
