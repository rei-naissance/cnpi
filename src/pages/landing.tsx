import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { useState } from "react"
import { useNavigate } from "react-router-dom"


const LandingPage = () => {
  const [url, setUrl] = useState("")
  const navigate = useNavigate()
  
  const handleShorten = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if(url) {
      navigate(`/auth?createNew=${url}`)
    }
  }

  return (
    <div className="flex flex-col items-center">
      <h2 className="my-10 @sm:my-16 text-3xl sm:text-6xl lg:text-8xl text-white text-center font-extrabold">
        A simple and efficient URL shortener✨
      </h2>
      <form onSubmit={handleShorten} className="flex flex-col @sm:flex-row justify-center items-center w-full @sm:h-14 @md:w-2/4 gap-2">
        <Input type="url" placeholder="URL goes here!"
          onChange={(e) => setUrl(e.target.value)}
          value={url}
          className="h-full flex-1 p-4"
        />
        <Button className="h-full" type="submit" variant="secondary">
          Shorten URL
        </Button>
      </form> 
      <img src="./banner.svg" alt="Banner" className="w-full my-11 md:px-11" />

      <Accordion type="multiple" className="w-full @md:px-11">
        <AccordionItem value="item-1">
          <AccordionTrigger className="text-xl font-bold">
            How does it work?
          </AccordionTrigger>
          <AccordionContent>
            It simply takes a long URL and generates a short one that redirects to the original URL.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger className="text-xl font-bold">
            Is it free?
          </AccordionTrigger>
          <AccordionContent>
            Yes! It is completely free to use. No hidden fees or subscriptions.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3">
          <AccordionTrigger className="text-xl font-bold">
            What is the maximum URL length?
          </AccordionTrigger>
          <AccordionContent>
            The maximum URL length is 2048 characters.
          </AccordionContent>
        </AccordionItem>
      </Accordion>

    </div>
  )
}

export default LandingPage
