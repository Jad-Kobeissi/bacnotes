"use client";
import { Error } from "@/app/Error";
import Loading from "@/app/Loading";
import { Nav } from "@/app/Nav";
import { TRequest } from "@/app/types";
import axios from "axios";
import { getCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function Request({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [request, setRequest] = useState<TRequest>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { id } = React.use(params);
  const router = useRouter();
  const fetchRequest = () => {
    setLoading(true);
    axios
      .get(`/api/requests/${id}`, {
        headers: {
          Authorization: `Bearer ${getCookie("token")}`,
        },
      })
      .then((res) => {
        setRequest(res.data);
      })
      .catch((err) => {
        setError(err.response.data);
      })
      .finally(() => setLoading(false));
  };
  useEffect(() => {
    fetchRequest();
  }, []);
  return loading ? (
    <Loading className="flex items-center justify-center mt-[30vh]" />
  ) : (
    <>
      <Nav />
      <div className="flex flex-col justify-center px-10 mt-[30vh]">
        <h1 className="text-[1.3rem] font-semibold text-left">
          {request?.author.username}
        </h1>
        <h1 className="text-[1.5rem] font-bold">{request?.title}</h1>
        <p className="text-[1.2rem]">{request?.description}</p>
        <button
          className="button w-fit "
          onClick={() => {
            router.push(`/reply/${request?.id}`);
          }}
        >
          Reply
        </button>
        <div className="flex flex-col gap-4 items-center mt-[20vh]">
          {request?.responses.map((response) => (
            <div
              className="bg-[var(--card-color)] w-fit h-fit p-[2rem] rounded-md"
              onClick={() => {
                router.push(`/response/${response.id}`);
              }}
            >
              <h1>{response.author.username}</h1>
              <h1 className="text-[1.3rem] font-bold">{response.title}</h1>
              <p>{response.description}</p>
              <div className="flex overflow-x-scroll snap-x snap-mandatory w-[20rem]">
                {response.imageUrls.map((url) => (
                  <img
                    src={url as string}
                    alt="Post Image"
                    className="w-[15rem] snap-center"
                  />
                ))}
              </div>
            </div>
          ))}
          {request?.responses.length == 0 && (
            <Error
              error="This request has no responses"
              className="text-[1.5rem]"
            />
          )}
        </div>
      </div>
      {error && <Error error={error} />}
    </>
  );
}
