"use client";
import { useInView } from "react-intersection-observer";
import Heart from "./heart-solid-full";
import Lock from "./lock-solid-full";
import Plus from "./plus-solid-full";
import User from "./user-solid-full";
import { motion } from "motion/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
function Nav() {
  return (
    <nav className="fixed w-screen flex items-center justify-between px-[2vw] bg-[#121212]">
      <button className="text-[1.5rem] font-bold">Bacgram</button>
      <div className="flex items-center justify-center gap-[2vw] text-[1.2rem]">
        <div className="relative group">
          <Link href={"#home"}>Home</Link>
          <span className="bg-[#d9d9d9] w-0 h-0.5 bottom-0 left-0 absolute group-hover:w-full group-focus:w-full group-active:w-full transition-all duration-200"></span>
        </div>
        <div>
          <Link href={"#about"}>About</Link>
          <span className="bg-[#d9d9d9] w-0 h-0.5 bottom-0 left-0 absolute group-hover:w-full group-focus:w-full group-active:w-full transition-all duration-200"></span>
        </div>
        <div className="group relative">
          <Link href={"#features"}>Features</Link>
          <span className="bg-[#d9d9d9] w-0 h-0.5 bottom-0 left-0 absolute group-hover:w-full group-focus:w-full group-active:w-full transition-all duration-200"></span>
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
      className="flex landing-md:flex-row flex-col-reverse items-center justify-between landing-md:px-[2rem] w-screen landing-md:mt-0 mt-[15vh] mb-[15vh]"
      id="home"
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.3 }}
      ref={ref}
    >
      <div className="flex flex-col landing-md:items-start items-center justify-center landing-md:min-h-screen py-4 landing-md:w-1/2 w-screen">
        <h1 className="text-[3rem] font-bold text-center landing-md:text-left">
          Welcome To Bacnotes
        </h1>
        <p className="text-[#d9d9d9cc] text-center landing-md:text-left">
          Share, discover, and collaborate on notes with your classmates. This
          app is BAC students’ private space to upload notes, access helpful
          resources, and support each other throughout the school year.
        </p>
        <div className="flex gap-4 items-center justify-center mt-4 landing-md:w-fit w-screen">
          <button
            className="text-[1.5rem] rounded-xl bg-[#1C6CA0] font-bold px-4 py-2 hover:bg-[#145a86] whitespace-nowrap"
            onClick={() => router.push("/signup")}
          >
            Get Started Now
          </button>
        </div>
      </div>
      <div className="landing-md:w-1/2 flex justify-end">
        <img src="/bac.png" className="w-[30rem] rounded-xl" />
      </div>
    </motion.div>
  );
}
function About() {
  const [ref, inView] = useInView({
    triggerOnce: false,
    threshold: 0.8,
  });
  return (
    <motion.div
      id="about"
      className="flex flex-col items-center justify-center landing-md:px-[2rem] w-screen mt-[20vh] gap-4"
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.3 }}
      ref={ref}
    >
      <h1 className="md:text-[3rem] text-[2.5rem] font-bold text-center">
        What Is Bacnotes?
      </h1>
      <p className="text-[#d9d9d9] text-center">
        <span className="text-[#1C6CA0] font-bold">Bacnotes</span> is a platform
        designed exclusively for BAC students, allowing you to{" "}
        <span className="text-[#1C6CA0] font-bold">share</span> notes and{" "}
        <span className="text-[#1C6CA0] font-bold">stay connected</span> through
        a familiar, secure space. Whether you’re contributing your own notes or
        finding notes from classmates,{" "}
        <span className="text-[#1C6CA0] font-bold">Bacnotes</span> helps bring
        the student community closer together throughout the school year.
      </p>
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
    threshold: 0.8,
  });
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.3 }}
      ref={ref}
      className="bg-[#141414] w-[250px] h-fit rounded-md flex flex-col items-center justify-center"
    >
      <Svg />
      <div className="ml-[1vw]">
        <h1 className="capitalize text-[1.3rem] font-bold">{title}</h1>
        <p className="text-[#d9d9d9cc]">{description}</p>
      </div>
    </motion.div>
  );
}
function Features() {
  return (
    <div className="my-[15vh]" id="features">
      <h1 className="text-[3rem] text-center font-bold">Features</h1>
      <div className="grid grid-cols-1 landing-md:grid-cols-2 place-items-center gap-[5vh]">
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
    <div className="overflow-x-hidden">
      <Nav />
      <Home />
      <About />
      <Features />
    </div>
  );
}
