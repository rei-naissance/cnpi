import { Outlet } from "react-router-dom"
import Header from "../components/header"

const AppLayout = () => {
  return (
    <div>
        <main className="min-h-screen @container px-6">
            <Header />
            <Outlet />
        </main>

        <div className="p-10 text-center bg-gray-950 mt-10">
          Test Footer
        </div>
    </div>
  )
}

export default AppLayout