import './rootlayout.css'
import { ClerkProvider, SignedIn, UserButton } from "@clerk/clerk-react";
import { Link, Outlet } from "react-router-dom";
import{QueryClient,QueryClientProvider} from '@tanstack/react-query'
import App from "../App";




// Import your Publishable Key
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  throw new Error('Missing Publishable Key')
}

const queryClient = new QueryClient()


const Rootlayout = () => {
  return (
   <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/" >
        <QueryClientProvider client={queryClient}>
    <div className='rootlayout'>
        <header className="header">
            <Link to="/" className='logo'>
            <img src="/amclogo2.JPG" alt="logo" />
            <span>AMC Asssitant</span>
            </Link>
            <div className="user">
               
                    <SignedIn>
                        <UserButton />
                        </SignedIn></div>
        </header>
        <main>
            <Outlet />
        </main>
    </div>  
    </QueryClientProvider>
</ClerkProvider>
)
}

export default Rootlayout
