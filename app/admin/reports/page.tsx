"use client";
import { Error } from "@/app/Error";
import Loading from "@/app/Loading";
import { Nav } from "@/app/Nav";
import { TReport, TUser } from "@/app/types";
import axios from "axios";
import { getCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";

export default function Reports() {
  const [error, setError] = useState("");
  const [reports, setReports] = useState<TReport[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const router = useRouter();
  const fetchUsers = () => {
    axios
      .get(`/api/user/reports?page=${page}`, {
        headers: {
          Authorization: `Bearer ${getCookie("token")}`,
        },
      })
      .then((res) => {
        setReports((prev) => {
          const posts = [...prev, ...res.data];
          const newPosts = posts.filter(
            (post, index, self) =>
              index == self.findIndex((t) => t.userId === post.userId)
          );
          return newPosts;
        });
        setPage((prev) => prev + 1);
      })
      .catch((err) => {
        setError(err.response.data);
        setHasMore(false);
        console.log(err.response.data);
      });
  };

  useEffect(() => {
    fetchUsers();
  }, []);
  return (
    <>
      <Nav />
      <h1 className="text-center text-[2rem] font-bold mt-[20vh]">Reports</h1>
      <InfiniteScroll
        hasMore={hasMore}
        next={fetchUsers}
        loader={
          <Loading className="flex items-center justify-center mt-[20vh]" />
        }
        dataLength={reports.length}
        className="flex items-center justify-center flex-col mt-[10vh] gap-4"
      >
        {reports.map((report) => (
          <div
            className="bg-[#141414] w-fit h-fit p-[2rem] rounded-md"
            key={report.id as string}
            onClick={() => {
              router.push(`/user/${report.userId}`);
            }}
          >
            <h1 className="text-[1.3rem]">{report.user.username}</h1>
          </div>
        ))}
      </InfiniteScroll>
      {error !== "" && (
        <Error error={error} className="text-center text-[1.5rem]" />
      )}
    </>
  );
}
