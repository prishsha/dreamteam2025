'use client'

import "./globals.css";
import { Toast } from "@/components/Toast";
import { useEffect, useState } from "react";
import { IsAuthenticatedResponse, User } from "@/types/auth";
import Head from "next/head";
import Spinner from "@/components/Spinner";
import { UserProvider } from "@/contexts/UserContext";
import Navbar from "@/components/Navbar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);

  const checkAuthorization = () => {
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/is-authenticated`, {
      credentials: 'include'
    })
      .then(res => res.json())
      .then((data: IsAuthenticatedResponse) => {
        if (data.is_authenticated) {
          setIsAuthenticated(true);
          setUser(data.user || null);
        }
        setLoading(false);
      }).catch(err => {
        console.error(err);
        setLoading(false);
      })
  };

  useEffect(() => {
    checkAuthorization();
  }, []);

  return (
    <html lang="en">
      <Head>
        <title>DreamTeam</title>
      </Head>
      <body className="antialiased">
        {loading ? (
          <div className="flex-col items-center flex justify-center h-[calc(100vh-60px)]">
            <Spinner />
          </div>
        ) : isAuthenticated ? (
          <UserProvider user={user}>
             <Navbar />
            {children}
          </UserProvider>
        ) : (
          <div className="flex-col items-center flex justify-center h-[calc(100vh-60px)]">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              onClick={() => {
                window.location.href = `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/login`;
              }}
            >
              Login
            </button>
          </div>
        )}
        <Toast />
      </body>
    </html>
  );
}
