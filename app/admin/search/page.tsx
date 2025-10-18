"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Nav } from "../../Nav";

export default function Search() {
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");

  const router = useRouter();

  return (
    <div>
      <Nav />
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-center text-[2.5rem] font-bold">
          Search Banned Users
        </h1>
        <form
          className="flex flex-col"
          onSubmit={(e) => {
            e.preventDefault();
            router.push(`/admin/search/${username}`);
          }}
        >
          <label
            htmlFor="username"
            className="font-bold text-[var(--secondary-text)]"
          >
            Username
          </label>
          <input
            type="text"
            placeholder="Username"
            onChange={(e) => setUsername(e.target.value)}
            className="bg-[var(--card-color)] px-4 py-2 font-bold rounded-md"
          />
          <button className="button">Search</button>
        </form>
      </div>
    </div>
  );
}
