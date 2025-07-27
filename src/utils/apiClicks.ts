import supabase from "./supabase"

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