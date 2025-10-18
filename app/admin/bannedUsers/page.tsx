"use client";
import { Nav } from "@/app/Nav";
import { TUser } from "@/app/types";
import axios from "axios";
import { getCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Error } from "@/app/Error";
export default function Banned() {
  const [users, setUsers] = useState<TUser[]>([]);
  const [error, setError] = useState<string>("");
  const router = useRouter();
  const fetchUsers = () => {
    axios
      .get(`/api/user/banned`, {
        headers: {
          Authorization: `Bearer ${getCookie("token")}`,
        },
      })
      .then((res) => {
        setUsers(res.data);
      })
      .catch((err) => {
        setError(err.response.data);
      });
  };
  useEffect(() => {
    fetchUsers();
  }, []);
  return (
    <div className="pt-[20vh]">
      <Nav />
      <h1 className="text-[2rem] font-bold text-center">Banned Users</h1>
      <div className="flex justify-center mt-[10vh] gap-5">
        {users.map((user) => (
          <motion.div
            onClick={() => router.push(`/admin/bannedUsers/user/${user.id}`)}
            className={`bg-[var(--card-color)] w-fit h-fit rounded-xl p-[2rem] flex flex-col items-center`}
            key={user.id as string}
          >
            <h1 className="text-[1.3rem]">{user.username}</h1>
          </motion.div>
        ))}
      </div>
      {error && <Error error={error} className="text-center text-[1.5rem]" />}
    </div>
  );
}
