"use client";
import { motion } from "motion/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useInView } from "react-intersection-observer";
import Lock from "./lock-solid-full";
import Heart from "./heart-solid-full";
import Plus from "./plus-solid-full";
import User from "./user-solid-full";
function Nav() {
  return (
    <nav className="fixed w-screen flex items-cemter justify-between p-4 bg-transparent">
      <Link href={"#home"} className="text-[1.5rem] font-bold">
        Bacgram
      </Link>
      <div className="flex items-center justify-center gap-4">
        <div className="group relative">
          <Link href={"#home"}>Home</Link>
          <span className="absolute w-0 h-0.5 left-0 bottom-0 group-hover:w-full group-active:w-full bg-[#d9d9d9] transition-all duration-200"></span>
        </div>
        <div className="group relative">
          <Link href={"#about"}>About</Link>
          <span className="absolute w-0 h-0.5 left-0 bottom-0 group-hover:w-full group-active:w-full bg-[#d9d9d9] transition-all duration-200"></span>
        </div>
        <div className="group relative">
          <Link href={"#features"}>Features</Link>
          <span className="absolute w-0 h-0.5 left-0 bottom-0 group-hover:w-full group-active:w-full bg-[#d9d9d9] transition-all duration-200"></span>
        </div>
      </div>
    </nav>
  );
}
function Home() {
  const [ref, inView] = useInView({
    triggerOnce: false,
    threshold: 0.8,
  });
  const router = useRouter();
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 100 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      exit={inView ? { opacity: 0, y: -100 } : {}}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="flex landing-md:flex-row flex-col-reverse landing-md:gap-0 gap-[2vh] items-center landing-md:justify-between justify-center h-screen p-4"
    >
      <div
        className="landing-md:w-1/2 w-screen flex flex-col gap-[1em]"
        id="home"
      >
        <h1 className="fluid-4xl font-bold landing-md:text-left text-center w-full">
          Welcome To Bacnotes
        </h1>
        <p className="text-[var(--secondary-text)] fluid-sm landing-md:text-left text-center">
          Share, discover, and collaborate on notes with your classmates. This
          app is BAC students’ private space to upload notes, access helpful
          resources, and support each other throughout the school year.
        </p>
        <div className="flex gap-4 items-center landing-md:justify-start justify-center">
          <button
            className="fluid-lg font-bold bg-[var(--brand)] px-4 py-1 rounded-md border-[var(--brand)] border hover:bg-transparent active:bg-transparent transition-all duration-200"
            onClick={() => router.push("/signup")}
          >
            Get Started Now
          </button>
          <div className="landing-md:flex hidden gap-4">
            <h1 className="text-[1.5rem] font-bold">OR</h1>
            <button
              className="fluid-lg font-bold bg-[#121212] border-[#121212] border hover:bg-transparent active:bg-transparent transition-all duration-200 px-4 py-1 rounded-md"
              onClick={() => router.push("/login")}
            >
              LogIn
            </button>
          </div>
        </div>
      </div>
      <div className="landing-md:w-1/2 flex justify-end">
        <img
          src="/bac.png"
          alt="Picture of bac"
          className="w-[30rem] rounded-md"
        />
      </div>
    </motion.div>
  );
}
function About() {
  const [ref, inView] = useInView({
    threshold: 0.8,
    triggerOnce: false,
  });
  return (
    <motion.div
      id="about"
      ref={ref}
      initial={{ opacity: 0, y: 100 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      exit={inView ? { opacity: 0, y: -100 } : {}}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="mb-[20vh]"
    >
      <h1 className="text-[3rem] font-bold text-center">What Is Bacnotes?</h1>
      <div className="flex justify-center">
        <p className="text-[var(--secondary-text)] text-center landing-md:w-3/4 w-screen">
          <span className="font-bold text-[var(--brand)]">Bacnotes</span> is a
          platform designed exclusively for BAC students, allowing you to 
          <span className="font-bold text-[var(--brand)]">
            share notes
          </span>{" "}
          and 
          <span className="font-bold text-[var(--brand)]">
            stay connected
          </span>{" "}
          through a familiar, secure space. Whether you’re contributing your own
          notes or finding notes from classmates,{" "}
          <span className="font-bold text-[var(--brand)]">Bacnotes</span> helps
          bring the student community closer together throughout the school
          year.
        </p>
      </div>
    </motion.div>
  );
}
function Card({
  title,
  description,
  Svg,
}: {
  title: string;
  description: string;
  Svg: any;
}) {
  const [ref, inView] = useInView({
    triggerOnce: false,
    threshold: 0.5,
  });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 100 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      exit={inView ? { opacity: 0, y: -100 } : {}}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="bg-[#121212] border border-[#141414] landing-md:max-w-1/2 w-screen h-fit p-[2rem] flex flex-col items-center justify-center rounded-md"
    >
      <Svg />
      <div>
        <h1 className="text-[2.3rem] font-bold">{title}</h1>
        <p className="text-[var(--secondary-text)]">{description}</p>
      </div>
    </motion.div>
  );
}

function Features() {
  return (
    <div className="mb-[20vh]" id="features">
      <h1 className="text-[3rem] font-bold text-center">Features</h1>
      <div className="grid landing-md:grid-cols-2 grid-cols-1 place-items-center gap-[2rem]">
        <Card
          title="Security"
          description="Highest security to ensure that your web experience remains secure at all times"
          Svg={Lock}
        />
        <Card
          title="Likes"
          description="Users can like posts to engage wuth the creator"
          Svg={Heart}
        />
        <Card
          title="Post Creation"
          description="Users can create posts, with an image option being available"
          Svg={Plus}
        />
        <Card
          title="Profile"
          description="User profiles are available with username, grade and followers"
          Svg={User}
        />
      </div>
    </div>
  );
}
export default function Page() {
  return (
    <>
      <Nav />
      <Home />
      <About />
      <Features />
    </>
  );
}
