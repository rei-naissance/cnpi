import useFetch from "@/hooks/use-fetch"
import { getLongUrl, storeClicks } from "@/utils/apiUrls"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { BarLoader } from "react-spinners"

const Redirect = () => {

  const {id} = useParams()
  const [isLoading, setIsLoading] = useState(false)
  const {loading, data, func} = useFetch(
   async (_, id: string) => getLongUrl(id)
  )

  // const {
  //   loading: loadingStats,
  //   func: fnStats
  // } = useFetch(
  //   async (options: any) => storeClicks(options)
  // )

  useEffect(() => {
    func(id)
  }, [id])

  useEffect(() => {
    if (!loading && data && !isLoading) {
      // fnStats()
      setIsLoading(true)
      storeClicks({id: data.id, originalUrl: data.original_url})
    }
  }, [loading, data, isLoading])
  
  // if(loading || loadingStats)
  if(loading || isLoading)
  return (
    <>
      <BarLoader width={"100%"} color="#36d7b7" />
      <br />
      Redirecting
    </>
  )

  return null
}

export default Redirect