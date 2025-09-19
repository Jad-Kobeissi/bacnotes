import { useEffect, useState } from "react";
import { TPost, TUser } from "./types";
import { UseUser } from "./contexts/UserContext";
import axios from "axios";
import { getCookie } from "cookies-next";

export default function Post({ post, User }: { post: TPost; User: TUser }) {
  const [liked, setLiked] = useState<boolean>(false);
  const { setUser } = UseUser();
  useEffect(() => {
    if (post.likedUsers.some((u) => u.id == User.id)) {
      setLiked(true);
    }
  }, [User.likedPosts]);
  const deletePost = async (id: string) => {
    axios
      .delete(`/api/posts/${id}`, {
        headers: {
          Authorization: `Bearer ${getCookie("token")}`,
        },
      })
      .then((res) => {
        setUser(res.data);
        window.location.reload();
      });
  };
  return (
    <div
      className="bg-[#141414] w-fit h-fit rounded-xl p-[2rem] flex flex-col items-center"
      key={post.id as string}
    >
      <h1>Username: {post.author.username}</h1>
      <h1 className="text-[1.5rem] capitalize font-bold">{post.title}</h1>
      <p>{post.description}</p>
      <p className="text-[#6d6d6d]">{post.subject}</p>
      <div className="overflow-x-scroll snap-x snap-mandatory flex landing-md:w-[30rem] w-[17rem]">
        {post.imageUrls.map((url) => (
          <img
            key={url as string}
            src={url as string}
            alt={post.title as string}
            className="snap-center"
          />
        ))}
      </div>
      {liked ? (
        <button
          onClick={() => {
            setLiked(false);
            axios.post(
              `/api/posts/dislike/${post.id}`,
              {},
              {
                headers: {
                  Authorization: `Bearer ${getCookie("token")}`,
                },
              }
            );
          }}
          className="bg-[#1C6CA0] text-white font-bold px-4 py-2 rounded-xl hover:bg-transparent border-[#1C6CA0] active:bg-transparent border transition-all duration-150"
        >
          Dislike
        </button>
      ) : (
        <button
          onClick={() => {
            axios.post(
              `/api/posts/like/${post.id}`,
              {},
              {
                headers: {
                  Authorization: `Bearer ${getCookie("token")}`,
                },
              }
            );
            setLiked(true);
          }}
          className="bg-[#1C6CA0] text-white font-bold px-4 py-2 rounded-xl hover:bg-transparent border-[#1C6CA0] active:bg-transparent border transition-all duration-150"
        >
          Like
        </button>
      )}
      {User.id == post.authorId && (
        <div className="flex items-center justify-center mt-[3vh]">
          <button
            className="bg-[#ce1a35] text-[1.3rem] font-bold px-4 py-1 rounded-lg"
            onClick={() => {
              deletePost(post.id as string);
            }}
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
}
