import { AuthPage } from "@/components/AuthPage";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

export default function SignUpPage() {
    return (
        <div className="min-h-screen bg-white">
            <Navbar />
            <div className="h-[75vh]">
                <AuthPage isSignIn={ false } />    
            </div>
            <Footer />
        </div>
    );
}