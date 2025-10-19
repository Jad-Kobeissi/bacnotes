"use client";
import { Nav } from "@/app/Nav";
import { TResponse } from "@/app/types";
import axios from "axios";
import { getCookie } from "cookies-next";
import React, { useEffect, useState } from "react";

export default function Response({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [response, setResponse] = useState<TResponse>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { id } = React.use(params);

  const fetchResponse = () => {
    setLoading(true);
    axios
      .get(`/api/response/${id}`, {
        headers: {
          Authorization: `Bearer ${getCookie("token")}`,
        },
      })
      .then((res) => {
        setResponse(res.data);
      })
      .catch((err) => {
        setError(err.response.data);
      })
      .finally(() => setLoading(false));
  };
  useEffect(() => {
    fetchResponse();
  }, []);

  return (
    <>
      <Nav />
      <div className="flex flex-col items-center justify-center mt-[30vh]">
        <h1 className="text-[1.1rem]">{response?.author.username}</h1>
        <h1 className="text-[1.6rem] font-bold capitalize">
          {response?.title}
        </h1>
        <p>{response?.description}</p>
        <div className="flex overflow-x-scroll snap-mandatory snap-x w-[20rem]">
          {response?.imageUrls.map((url) => (
            <img
              src={url as string}
              alt="Post Image"
              className="snap-center w-[15rem]"
              onClick={() => {
                window.open(url as string, "_blank");
              }}
            />
          ))}
        </div>
      </div>
    </>
  );
}
