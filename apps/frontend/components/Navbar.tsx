import Link from "next/link";
import { Pencil } from "lucide-react";

export default function Navbar() {
    return (
        <header className="border-b border-gray-100">
            <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
            <Link href={"/"}>
                <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                    <Pencil className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-semibold text-gray-900">DrawBoard</span>
                </div>
            </Link>
            <nav className="hidden md:flex items-center space-x-8">
                <Link href="#features" className="text-gray-600 hover:text-gray-900 transition-colors">Features</Link>
                <Link href="#about" className="text-gray-600 hover:text-gray-900 transition-colors">About</Link>
                <Link href={"/signup"}>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                    Get Started
                </button>
                </Link>
            </nav>
            </div>
      </header>
    )
}