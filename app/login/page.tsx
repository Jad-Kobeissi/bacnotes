"use client";
import { useRef, useState } from "react";
import { Error } from "../Error";
import Loading from "../Loading";
import axios from "axios";
import { setCookie } from "cookies-next";
import { UseUser } from "../contexts/UserContext";
import { useRouter } from "next/navigation";

export default function LogIn() {
  const username = useRef<HTMLInputElement>(null);
  const password = useRef<HTMLInputElement>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { setUser } = UseUser();
  const router = useRouter();
  return loading ? (
    <div className="flex items-center justify-center h-screen">
      <Loading className="flex items-center justify-center h-screen" />
    </div>
  ) : (
    <div className="flex items-center landing-md:justify-between justify-center h-screen landing-md:px-[2rem]">
      <div className="text-[3rem] font-bold landing-md:block hidden">
        <h1>Welcome Back!</h1>
      </div>
      <form
        className="landing-md:bg-[#131313] flex flex-col items-center justify-center max-w-1/2 min-w-fit py-[7rem] px-[4rem] rounded"
        onSubmit={(e) => {
          e.preventDefault();
          setLoading(true);
          setError("");
          axios
            .post("/api/login", {
              username: username.current?.value,
              password: password.current?.value,
            })
            .then((res) => {
              setCookie("token", res.data.token);
              setUser(res.data.user);
              router.push("/home");
            })
            .catch((err) => {
              setError(err.response.data);
            })
            .finally(() => {
              setLoading(false);
            });
        }}
      >
        <h1 className="text-[2.5rem] font-bold">LogIn</h1>
        {error && <Error error={error} />}
        <div className="flex flex-col">
          <label htmlFor="username" className="text-[#6d6d66d]">
            Username
          </label>
          <input
            type="text"
            placeholder="John Doe"
            ref={username}
            id="username"
            className="px-4 py-2 rounded text-[1.3rem] bg-[#121212]"
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="password" className="text-[#6d6d66d]">
            Password
          </label>
          <input
            type="password"
            placeholder="Password"
            ref={password}
            id="password"
            className="px-4 py-2 rounded text-[1.3rem] bg-[#121212]"
          />
        </div>
        <button className="bg-[#1C6CA0] text-[#d9d9d9] px-5 py-1 rounded mt-4 text-[1.3rem] font-bold">
          LogIn
        </button>
      </form>
    </div>
  );
}
