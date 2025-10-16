"use client";
import { useRouter } from "next/navigation";
import { UseUser } from "../contexts/UserContext";
import { useEffect } from "react";

export default function Admin() {
  const router = useRouter();
  const { user } = UseUser();

  useEffect(() => {
    if (!user) return;
    if (!user?.admin) {
      alert("You are not an admin");
      router.push("/home");
    }
  }, [user]);
  return (
    <div className="flex items-center justify-center flex-col gap-4">
      <h1 className="text-[2rem] text-center font-bold mt-[20vh]">
        Admin Actions
      </h1>
      <div className="flex items-center justify-center gap-4">
        <button
          className="bg-[var(--brand)] px-4 py-1 font-bold rounded-md border border-[var(--brand)] hover:bg-transparent transition-all duration-200]"
          onClick={() => router.push("/admin/approvePosts")}
        >
          Approve Posts
        </button>
        <button
          onClick={() => router.push("/admin/bannedUsers")}
          className="bg-[var(--brand)] px-4 py-1 font-bold rounded-md border border-[var(--brand)] hover:bg-transparent transition-all duration-200]"
        >
          Banned Users
        </button>
        <button
          onClick={() => router.push("/admin/reports")}
          className="bg-[var(--brand)] px-4 py-1 font-bold rounded-md border border-[var(--brand)] hover:bg-transparent transition-all duration-200]"
        >
          Reports
        </button>
      </div>
    </div>
  );
}
