import supabase from "./supabase"
import { UAParser } from "ua-parser-js"

const parser = new UAParser()

export async function getClicks(urlIds: number[]) {
    const {data, error} = await supabase
        .from("clicks")
        .select("*")
        .in("url_id", urlIds)

    if (error) {
        console.error(error)
        throw new Error("Unable to load clicks")
    }

    return data || []
}

export async function getClicksForUrl (url_id: string) { 
    const { data, error } = await supabase
        .from("clicks")
        .select("*")
        .eq("url_id", url_id)
        .single()

    if (error) {
        console.error(error.message);
        throw new Error("Unable to load clicks")
    }

    return data
}

export const storeClicks = async ({id, originalUrl }: {id: string, originalUrl: string}) => {
    try {
        const res = parser.getResult()
        const device = res.device.type || "desktop"

        const response = await fetch("https://ipapi.co/json")
        const {city, country_name: country} = await response.json()

        await supabase.from("clicks").insert({
            url_id: id,
            city: city,
            country: country,
            device: device, 
        })

        window.location.href = originalUrl;
    } catch (error) {
        console.error("Error recording click:", error)
    }
}