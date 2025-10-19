"use client";
import { Nav } from "@/app/Nav";
import axios from "axios";
import { getCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import React, { useRef, useState } from "react";

export default function Reply({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const [loading, setLoading] = useState(false);
  const title = useRef<HTMLInputElement>(null);
  const description = useRef<HTMLInputElement>(null);
  const files = useRef<HTMLInputElement>(null);
  const router = useRouter();
  return (
    <>
      <Nav />
      <form
        className="flex flex-col items-center justify-center h-screen"
        onSubmit={(e) => {
          e.preventDefault();
          setLoading(true);
          const formData = new FormData();
          formData.append("title", title.current?.value as string);
          formData.append("description", description.current?.value as string);
          const filesArray = Array.from(files.current?.files as any);
          filesArray.forEach((file: any) => {
            formData.append("images", file);
          });
          axios
            .post(`/api/respond/${id}`, formData, {
              headers: {
                Authorization: `Bearer ${getCookie("token")}`,
              },
            })
            .then((res) => {
              alert("Awaiting Admin Approval");
              router.back();
            })
            .catch((err) => {
              alert(err.response.data);
              setLoading(false);
            });
        }}
      >
        <h1 className="text-[1.6rem] font-bold">Reply To Request</h1>
        <div className="flex flex-col">
          <label
            htmlFor="title"
            className="text-[1.1rem] text-[var(--secondary-text)]"
          >
            Title
          </label>
          <input
            type="text"
            placeholder="Title"
            id="title"
            className="px-4 py-2 rounded text-[1.3rem] bg-[var(--card-color)]"
            ref={title}
          />
        </div>
        <div className="flex flex-col">
          <label
            htmlFor="title"
            className="text-[1.1rem] text-[var(--secondary-text)]"
          >
            Descriptions
          </label>
          <input
            type="text"
            placeholder="Descriptions"
            id="descriptions"
            className="px-4 py-2 rounded text-[1.3rem] bg-[var(--card-color)]"
            ref={description}
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="files" className="text-[#6d6d66d]">
            Images
          </label>
          <input
            type="file"
            placeholder="Images"
            accept="image/*"
            multiple
            ref={files}
            id="files"
            className="py-2 px-4 rounded bg-[var(--card-color)]"
          />
        </div>
        <button className="button">Reply</button>
      </form>
    </>
  );
}
