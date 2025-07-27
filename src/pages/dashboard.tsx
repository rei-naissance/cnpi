import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import Error from "@/components/error"
import { Filter } from "lucide-react"
import { useEffect, useState } from "react"
import { BarLoader } from "react-spinners"
import useFetch from "@/hooks/use-fetch"
import { urlState } from "@/context"
import { getUrls } from "@/utils/apiUrls"
import { getClicks } from "@/utils/apiClicks"
import { Url, Click } from "@/utils/interfaces"
import LinkCard from "@/components/link-card"

const Dashboard = () => {

  const [searchQuery, setSearchQuery] = useState("")

  const { user } = urlState()

  const {
    data: urls,
    error, loading,
    func: fnGetUrls
  } = useFetch<Url[], [string]>(
    async (_, user_id) => {
      return await getUrls(user_id)
    },
    {}
  )

  const {
    loading: loadingClicks,
    data: clicks,
    func: fnClicks
  } = useFetch<Click[], [number[]]>(
    async (_, urlIds: number[]) => {
      return await getClicks(urlIds)
    },
    {}
  )

  useEffect(() => {
    const fetchData = async () => {
      if (user?.id) {
        try {
          const result = await fnGetUrls(user.id);
          console.log('URLs loaded:', result);
        } catch (err) {
          console.error('Error loading URLs:', err);
        }
      }
    };
    fetchData();
  }, [user?.id]);

  useEffect(() => {
    const fetchClicks = async () => {
      if (urls?.length) {
        try {
          const result = await fnClicks(urls.map((url) => url.id));
          console.log('Clicks loaded:', result);
        } catch (err) {
          console.error('Error loading clicks:', err);
        }
      }
    };
    fetchClicks();
  }, [urls]);

  const filteredUrls = urls?.filter((url) => 
    url.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="flex flex-col gap-8">
      {(loading || loadingClicks) && <BarLoader color="#36d7b7" width={"100%"} />}
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Links Generated</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{urls?.length || 0}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Clicks</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{clicks?.length || 0}</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-between">
        <h1 className="text-4xl font-extrabold">My Links</h1>
        <Button>Generate New Link</Button>
      </div>

      <div className="relative">
        <Input 
          type="text" 
          placeholder="Filter Links..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Filter className="absolute top-2 right-2 p-1" />
      </div>
      {error && <Error message={error?.message} />}
      {(filteredUrls || []).map((url) => (
        // <Card key={url.id}>
        //   <CardHeader>
        //     <CardTitle>{url.title}</CardTitle>
        //   </CardHeader>
        //   <CardContent>
        //     <p>{url.original_url}</p>
        //   </CardContent>
        // </Card>
        <LinkCard url={url} key={url.id} fetchUrls={
          async () => {
            if (user?.id) await fnGetUrls(user.id)
          }
        } />
      ))}
    </div>
  )
}

export default Dashboard