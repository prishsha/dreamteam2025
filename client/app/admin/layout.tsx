'use client'

import Spinner from "@/components/Spinner";
import { IsAuthenticatedResponse } from "@/types/auth";
import Head from "next/head";
import { useEffect, useState } from "react";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [loading, setLoading] = useState(true);
  const [allow, setAllow] = useState<boolean>();

  const checkAuthorization = () => {
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/is-authenticated`, {
      credentials: 'include'
    })
      .then(res => res.json())
      .then((data: IsAuthenticatedResponse) => {
        if (data.is_admin) {
          setAllow(true);
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

  if (loading) {
    return (
      <div className="flex-col items-center flex justify-center h-[calc(100vh-60px)]">
        <Head>
          <title>DreamTeam - Admin</title>
        </Head>
        <Spinner />
      </div>
    );
  }

  if (!allow) {
    return (
      <div className="flex-col items-center flex justify-center h-[calc(100vh-60px)]">
        <Head>
          <title>DreamTeam - Admin</title>
        </Head>
        <h1 className="text-2xl font-semibold text-center">
          You are not authorized to go beyond this point.
        </h1>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>DreamTeam - Admin</title>
      </Head>
      {children}
    </>
  );
}
