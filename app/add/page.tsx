"use client";
import { useRef, useState } from "react";
import { Nav } from "../Nav";
import axios from "axios";
import Loading from "../Loading";
import { Error } from "../Error";
import { getCookie } from "cookies-next";
import { UseUser } from "../contexts/UserContext";

export default function Add() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const title = useRef<HTMLInputElement>(null);
  const description = useRef<HTMLInputElement>(null);
  const files = useRef<HTMLInputElement>(null);
  const [selected, setSelected] = useState("");
  const { setUser } = UseUser();
  return (
    <>
      <Nav />
      {loading ? (
        <Loading className="flex items-center justify-center h-screen" />
      ) : (
        <form
          className="flex flex-col items-center justify-center h-screen"
          onSubmit={(e) => {
            e.preventDefault();
            setLoading(true);
            setError("");
            const formData = new FormData();
            formData.append("title", title.current!.value);
            formData.append("description", description.current!.value);
            formData.append("subject", selected);
            const filesArray = Array.from(files.current!.files || []);
            filesArray.forEach((file) => formData.append("files", file));
            axios
              .post("/api/posts", formData, {
                headers: {
                  Authorization: `Bearer ${getCookie("token")}`,
                },
              })
              .then((res) => {
                setUser(res.data);
                alert("User Posted");
              })
              .catch((err) => {
                setError(err.response.data);
              })
              .finally(() => {
                setLoading(false);
              });
          }}
        >
          <h1 className="text-[2rem] font-bold">Add</h1>
          {error && <Error error={error} />}
          <div className="flex flex-col">
            <label htmlFor="title" className="text-[#6d6d66d]">
              Title
            </label>
            <input
              type="text"
              placeholder="John Doe"
              ref={title}
              id="Title"
              className="px-4 py-2 rounded text-[1.3rem] bg-[#121212]"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="description" className="text-[#6d6d66d]">
              Description
            </label>
            <input
              type="text"
              placeholder="Description"
              ref={description}
              id="description"
              className="px-4 py-2 rounded text-[1.3rem] bg-[#121212]"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="subject" className="text-[#6d6d66d]">
              Subject
            </label>
            <select
              className="bg-[#121212] px-4 py-2 rounded-lg"
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
          <div className="flex flex-col">
            <label htmlFor="files" className="text-[#6d6d66d]">
              Images
            </label>
            <input
              type="file"
              placeholder="Images"
              accept="images/*"
              multiple
              ref={files}
              id="files"
              className="py-2 px-4 rounded bg-[#121212]"
            />
          </div>
          <button className="px-3 py-1 bg-[#1C6CA0] text-[1.2rem] font-bold rounded-lg">
            Add
          </button>
        </form>
      )}
    </>
  );
}
