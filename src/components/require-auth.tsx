import { useNavigate } from "react-router-dom"
import { urlState } from "@/context"
import { useEffect } from "react"
import { BarLoader } from "react-spinners"
import type { ReactNode } from "react"

function RequireAuth({children}: {children: ReactNode}) {
    const navigate = useNavigate()

    const {loading, isAuthenticated } = urlState()

    useEffect(() => {
        if (!isAuthenticated && loading === false) navigate("/auth")
    }, [isAuthenticated, loading])

    if (loading) return <BarLoader width={"100%"} color={"#36d7b7"} />
    if (isAuthenticated) return children;
}

export default RequireAuth