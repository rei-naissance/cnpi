import supabase from "./supabase"
import supabaseUrl from "./supabase"

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

export async function createUrl({
    title,
    longUrl,
    customUrl,
    user_id
    }: {
    title: string,
    longUrl: string,
    customUrl: string,
    user_id: string
}, qrCode: File) {
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
                long_url: longUrl,
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