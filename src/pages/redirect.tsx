import useFetch from '@/shared/hooks/use-fetch'
import { getLongUrl } from '@/features/links/api'
import { storeClicks } from '@/features/analytics/api'
import { useEffect, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { BarLoader } from 'react-spinners'

const Redirect = () => {
  const { id } = useParams<{ id: string }>()
  const tracked = useRef(false)
  const { loading, data, func } = useFetch(getLongUrl)

  useEffect(() => {
    if (id) func(id)
  }, [id])

  useEffect(() => {
    if (!loading && data && !tracked.current) {
      tracked.current = true
      storeClicks({ id: data.id, originalUrl: data.original_url })
    }
  }, [loading, data])

  return (
    <>
      <BarLoader width="100%" color="#36d7b7" />
      <br />
      Redirecting...
    </>
  )
}

export default Redirect
