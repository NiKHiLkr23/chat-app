"use client";

import { signOut } from "next-auth/react";

export default function Home() {
  return (
    <div className="bg-red-100 text-green-600 flex max-w-7xl mx-auto min-h-screen">
      Home Page
      <div className="mt-5 p-10">
        <button
          onClick={() => signOut()}
          className="bg-gray-200 rounded-xl shadow-md py-1 px-4"
        >
          Sign out
        </button>
      </div>
    </div>
  );
}
