import { describe, it, expect, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import useFetch from '@/shared/hooks/use-fetch'

describe('useFetch', () => {
  it('initializes with null data, no loading, no error', () => {
    const cb = vi.fn().mockResolvedValue('result')
    const { result } = renderHook(() => useFetch(cb))
    expect(result.current.data).toBeNull()
    expect(result.current.loading).toBe(false)
    expect(result.current.error).toBeNull()
  })

  it('resolves data and clears loading on success', async () => {
    const cb = vi.fn().mockResolvedValue('hello')
    const { result } = renderHook(() => useFetch(cb))
    await act(async () => { await result.current.func() })
    expect(result.current.data).toBe('hello')
    expect(result.current.loading).toBe(false)
    expect(result.current.error).toBeNull()
  })

  it('sets error on rejection', async () => {
    const cb = vi.fn().mockRejectedValue(new Error('boom'))
    const { result } = renderHook(() => useFetch(cb))
    await act(async () => { await result.current.func() })
    expect(result.current.error?.message).toBe('boom')
    expect(result.current.data).toBeNull()
    expect(result.current.loading).toBe(false)
  })

  it('wraps non-Error rejections', async () => {
    const cb = vi.fn().mockRejectedValue('string error')
    const { result } = renderHook(() => useFetch(cb))
    await act(async () => { await result.current.func() })
    expect(result.current.error).toBeInstanceOf(Error)
    expect(result.current.error?.message).toBe('An error occurred')
  })

  it('passes all args to callback', async () => {
    const cb = vi.fn().mockResolvedValue('ok')
    const { result } = renderHook(() => useFetch(cb))
    await act(async () => { await result.current.func('a', 42, true) })
    expect(cb).toHaveBeenCalledWith('a', 42, true)
  })

  it('clears previous error on new call', async () => {
    const cb = vi.fn()
      .mockRejectedValueOnce(new Error('first'))
      .mockResolvedValueOnce('ok')
    const { result } = renderHook(() => useFetch(cb))
    await act(async () => { await result.current.func() })
    expect(result.current.error?.message).toBe('first')
    await act(async () => { await result.current.func() })
    expect(result.current.error).toBeNull()
    expect(result.current.data).toBe('ok')
  })
})
