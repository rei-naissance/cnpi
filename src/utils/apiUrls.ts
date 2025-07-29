import supabase from "./supabase"
import { UAParser } from "ua-parser-js"

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL

const parser = new UAParser()

export async function getUrls(user_id: string) {
    const {data, error} = await supabase
        .from("urls")
        .select("*")
        .eq("user_id", user_id)

    if (error) {
        console.error(error)
        throw new Error("Unable to load URLs")
    }

    return data || []
}

export async function getLongUrl(id: string) {
    const {data, error} = await supabase
        .from("urls")
        .select("id, original_url")
        .or(`short_url.eq.${id},custom_url.eq.${id}`)
        .single()

    if (error) {
        console.error(error.message)
        throw new Error("Error fetching short link")
    }

    return data || null
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

export async function createUrl(options: any, qrCode: File) {
        const { title, longUrl, customUrl, user_id } = options
        const short_url = Math.random().toString(36).substring(2, 6)
        const fileName = `qr-${short_url}`

        const { error: storageError } = await supabase.storage
            .from("qrs")
            .upload(fileName, qrCode)

        if (storageError) throw new Error(storageError.message)

        const qr = `${supabaseUrl}/storage/v1/object/public/qrs/${fileName}`

        const { data, error } = await supabase.from("urls").insert(
            {
                title,
                original_url: longUrl,
                custom_url: customUrl || null,
                user_id,
                short_url,
                qr
            }
        ).select()

        if (error) {
            console.error(error)
            throw new Error("Unable to create URL")
        }

        return data || null
}

export async function deleteUrl(id: number) {
    const {data, error} = await supabase  
        .from("urls")
        .delete()
        .eq("id", id)

    if (error) {
        console.error(error)
        throw new Error("Unable to delete URL")
    }

    return data || null
}