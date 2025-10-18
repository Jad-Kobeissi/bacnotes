"use client";
import { Nav } from "@/app/Nav";
import { TUser } from "@/app/types";
import axios from "axios";
import { getCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Error } from "@/app/Error";
export default function Followers({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = React.use(params);
  const [followers, setFollowers] = useState<TUser[]>([]);
  const [error, setError] = useState<string>("");
  const router = useRouter();
  const fetchFollowers = () => {
    axios
      .get(`/api/followers/${id}`, {
        headers: {
          Authorization: `Bearer ${getCookie("token")}`,
        },
      })
      .then((res) => {
        setFollowers(res.data.followers);
      })
      .catch((err) => {
        setError(err.response.data);
      });
  };
  useEffect(() => {
    fetchFollowers();
  }, []);
  return (
    <div className="pt-[20vh]">
      <Nav />
      <h1 className="text-[2rem] font-bold text-center">Followers</h1>
      <div className="flex justify-center mt-[10vh] gap-5">
        {followers.map((follower) => (
          <motion.div
            onClick={() => router.push(`/user/${follower.id}`)}
            className={`bg-[var(--card-color)] w-fit h-fit rounded-xl p-[2rem] flex flex-col items-center`}
            key={follower.id as string}
          >
            <h1 className="text-[1.3rem]">{follower.username}</h1>
          </motion.div>
        ))}
      </div>
      {error && <Error error={error} className="text-center text-[1.5rem]" />}
    </div>
  );
}
