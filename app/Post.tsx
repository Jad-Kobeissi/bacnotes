import { useEffect, useState } from "react";
import { TPost, TUser } from "./types";
import { UseUser } from "./contexts/UserContext";
import axios from "axios";
import { getCookie } from "cookies-next";
import { useRouter } from "next/navigation";

export default function Post({
  post,
  User,
  profilePage,
  className,
}: {
  post: TPost;
  User: TUser;
  profilePage: boolean;
  className?: string;
}) {
  const [liked, setLiked] = useState<boolean>(false);
  const [likes, setLikes] = useState<number>(post.likes as number);
  const [followed, setFollowed] = useState<boolean>(false);
  const { setUser } = UseUser();
  const router = useRouter();
  useEffect(() => {
    if (!User || !post?.author?.followers) return;

    if (post.likedUsers.some((u) => u.id == User.id)) {
      setLiked(true);
    }
    if (post.author.followers.some((u) => u.id == User.id)) {
      setFollowed(true);
    }
    console.log(User);
  }, [User]);
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
      className={`bg-[#141414] w-fit h-fit rounded-xl p-[2rem] flex flex-col items-center ${className}`}
      key={post.id as string}
      onClick={() => router.push(`/post/${post.id}`)}
    >
      <div className="flex gap-[1rem]">
        <h1 className="text-[1.5rem] font-bold">{post.author.username}</h1>
        {!profilePage &&
          (followed ? (
            <button
              onClick={() => {
                setFollowed(false);
                axios
                  .post(
                    `/api/user/unfollow/${post.authorId}`,
                    {},
                    {
                      headers: {
                        Authorization: `Bearer ${getCookie("token")}`,
                      },
                    }
                  )
                  .then((res) => {
                    setUser(res.data);
                  });
              }}
              className="bg-[#1C6CA0] text-white font-bold px-4 py-2 rounded-xl hover:bg-transparent border-[#1C6CA0] active:bg-transparent border transition-all duration-150"
            >
              Unfollow
            </button>
          ) : (
            <button
              onClick={() => {
                axios
                  .post(
                    `/api/user/follow/${post.authorId}`,
                    {},
                    {
                      headers: {
                        Authorization: `Bearer ${getCookie("token")}`,
                      },
                    }
                  )
                  .then((res) => {
                    console.log(res.data);
                    setUser(res.data as TUser);
                  })
                  .catch((err) => console.log(err));
                setFollowed(true);
              }}
              className="bg-[#1C6CA0] text-white font-bold px-4 py-2 rounded-xl hover:bg-transparent border-[#1C6CA0] active:bg-transparent border transition-all duration-150"
            >
              Follow
            </button>
          ))}
      </div>
      <h1 className="text-[1.5rem] capitalize font-bold">{post.title}</h1>
      <p>{post.description}</p>
      <p className="text-[#6d6d6d]">{post.subject}</p>
      <div className="overflow-x-scroll snap-x snap-mandatory flex landing-md:w-[30rem] w-[17rem]">
        {post.imageUrls.map((url) => (
          <img
            key={url as string}
            src={url as string}
            alt={post.title as string}
            onClick={(e) => {
              e.stopPropagation();
              window.open(url as string, "_blank");
            }}
            className="snap-center"
          />
        ))}
      </div>
      <div className="flex items-center justify-center gap-[1rem]">
        <h1 className="text-[1.2rem] font-bold">{String(likes)}</h1>
        {liked ? (
          <button
            onClick={() => {
              setLiked(false);
              setLikes((prev) => prev - 1);
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
              setLikes((prev) => prev + 1);
            }}
            className="bg-[#1C6CA0] text-white font-bold px-4 py-2 rounded-xl hover:bg-transparent border-[#1C6CA0] active:bg-transparent border transition-all duration-150"
          >
            Like
          </button>
        )}
      </div>
      {profilePage && (
        <div className="flex items-center justify-center mt-[3vh]">
          <button
            className="bg-[#ce1a35] text-[1.3rem] font-bold px-4 py-1 rounded-lg"
            onClick={(e) => {
              e.stopPropagation();
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
