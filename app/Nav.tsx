import { deleteCookie } from "cookies-next";
import Link from "next/link";
import { useRouter } from "next/navigation";

export function Nav() {
  const router = useRouter();
  return (
    <nav className="fixed top-0 w-screen flex items-center justify-between px-[2vw]">
      <h1 className="text-[1.5rem] font-bold cursor-pointer">Bacgram</h1>
      <div className="flex items-center justify-center gap-[2vw] text-[1.2rem]">
        <div className="relative group">
          <Link href={"/home"}>Home</Link>
          <span className="bg-[var(--foreground)] w-0 h-0.5 bottom-0 left-0 absolute group-hover:w-full group-focus:w-full group-active:w-full transition-all duration-200"></span>
        </div>
        <div className="group relative">
          <Link href={"/add"}>Add</Link>
          <span className="bg-[var(--foreground)] w-0 h-0.5 bottom-0 left-0 absolute group-hover:w-full group-focus:w-full group-active:w-full transition-all duration-200"></span>
        </div>
        <div className="group relative">
          <Link href={"/profile"}>Profile</Link>
          <span className="bg-[var(--foreground)] w-0 h-0.5 bottom-0 left-0 absolute group-hover:w-full group-focus:w-full group-active:w-full transition-all duration-200"></span>
        </div>
        <div className="group relative cursor-pointer">
          <h1
            onClick={() => {
              deleteCookie("token");
              router.push("/");
            }}
            className="text-[var(--foreground)]"
          >
            LogOut
          </h1>
          <span className="bg-[var(--foreground)] w-0 h-0.5 bottom-0 left-0 absolute group-hover:w-full group-focus:w-full group-active:w-full transition-all duration-200"></span>
        </div>
      </div>
    </nav>
  );
}
