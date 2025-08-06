"use client";

import Link from "next/link";

export function AuthPage({ isSignIn }: { isSignIn: boolean }) {
    return (
        <div className="flex flex-col items-center justify-center h-full bg-gray-100">
            <h1 className="text-4xl font-bold mb-12 text-black">{isSignIn ? "Sign In" : "Sign Up"}</h1>
            <form className="w-full max-w-sm">
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Email</label>
                    <input type="email" required className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
                </div>
                <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Password</label>
                    <input type="password" required className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
                </div>
                <button type="submit" className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline cursor-pointer transition-colors">
                    {isSignIn ? "Sign In" : "Sign Up"}
                </button>
                <p className="mt-4 text-center text-gray-600 text-sm">
                    {isSignIn ? "Don't have an account?" : "Already have an account?"} 
                    <Link href={isSignIn ? "/signup" : "/signin"} className="text-blue-500 hover:text-blue-700 font-semibold">
                        {isSignIn ? " Sign Up" : " Sign In"}
                    </Link>
                </p>
            </form>
        </div>
    );
}