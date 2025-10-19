"use client";
import { useRef, useState } from "react";
import { Nav } from "../Nav";
import axios from "axios";
import Loading from "../Loading";
import { Error } from "../Error";
import { getCookie } from "cookies-next";
import { UseUser } from "../contexts/UserContext";
import Link from "next/link";

export default function Add() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const title = useRef<HTMLInputElement>(null);
  const description = useRef<HTMLTextAreaElement>(null);
  const files = useRef<HTMLInputElement>(null);
  const [selected, setSelected] = useState("");
  return (
    <>
      <Nav />
      {loading ? (
        <Loading className="flex items-center justify-center h-screen" />
      ) : (
        <>
          <div className="flex items-center justify-center mt-[20vh] gap-4 flex-col">
            <h1 className="text-[2rem] font-bold">Make Request</h1>
            <div className="text-[1.5rem] flex gap-7 font-bold">
              <Link href={"/add"} className="text-[var(--secondary-text)]">
                Add Post
              </Link>
              <Link href={"/addRequest"}>Make Request</Link>
            </div>
          </div>
          <form
            className="flex flex-col items-center justify-center gap-4 mt-[5vh]"
            onSubmit={(e) => {
              e.preventDefault();
              setLoading(true);
              setError("");
              axios
                .post(
                  "/api/requests",
                  {
                    title: title.current!.value,
                    description: description.current!.value,
                    subject: selected,
                  },
                  {
                    headers: {
                      Authorization: `Bearer ${getCookie("token")}`,
                    },
                  }
                )
                .then((res) => {
                  alert("Awaiting Admin Approval");
                })
                .catch((err) => {
                  setError(err.response.data);
                })
                .finally(() => {
                  setLoading(false);
                });
            }}
          >
            {error && <Error error={error} />}
            <div className="flex flex-col">
              <label htmlFor="title" className="text-[#6d6d66d]">
                Title
              </label>
              <input
                type="text"
                placeholder="Title"
                ref={title}
                id="Title"
                className="px-4 py-2 rounded text-[1.3rem] bg-[var(--card-color)]"
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="description" className="text-[#6d6d66d]">
                Description
              </label>
              <textarea
                placeholder="Description"
                ref={description}
                id="description"
                className="px-4 py-2 rounded text-[1.3rem] bg-[var(--card-color)]"
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="subject" className="text-[#6d6d66d]">
                Subject
              </label>
              <select
                className="bg-[var(--card-color)] px-4 py-2 rounded-lg"
                id="subject"
                value={selected}
                onChange={(e) => {
                  setSelected(e.target.value);
                }}
              >
                <option value="">Select Value</option>
                <option value="english">English</option>
                <option value="arabic">Arabic</option>
                <option value="french">French</option>
                <option value="physics">Physics</option>
                <option value="chemistry">Chemistry</option>
                <option value="biology">Biology</option>
                <option value="Math">Math</option>
                <option value="geography">Geography</option>
                <option value="civics">Civics</option>
                <option value="history">History</option>
              </select>
            </div>
            <button className="button">Make Request</button>
          </form>
        </>
      )}
    </>
  );
}
