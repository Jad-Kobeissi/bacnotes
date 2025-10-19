"use client";
import { motion } from "motion/react";
import { useInView } from "react-intersection-observer";
import Lock from "./lock-solid-full";
import Heart from "./heart-solid-full";
import Plus from "./plus-solid-full";
import User from "./user-solid-full";
import Link from "next/link";
function Nav() {
  return (
    <nav className="fixed flex items-center justify-between w-screen px-10">
      <Link
        href={"#home"}
        className="text-[var(--foreground)] text-[1.5rem] font-bold"
      >
        Bacnotes
      </Link>
      <div className="flex items-center justify-center gap-4">
        <div className="relative group">
          <Link href={"#home"}>Home</Link>
          <span className="bg-[var(--foreground)] w-0 h-0.5 absolute left-0 bottom-0 group-hover:w-full transition-all duration-200"></span>
        </div>
        <div className="relative group">
          <Link href={"#about"}>About</Link>
          <span className="bg-[var(--foreground)] w-0 h-0.5 absolute left-0 bottom-0 group-hover:w-full transition-all duration-200"></span>
        </div>
        <div className="relative group">
          <Link href={"#features"}>Features</Link>
          <span className="bg-[var(--foreground)] w-0 h-0.5 absolute left-0 bottom-0 group-hover:w-full transition-all duration-200"></span>
        </div>
      </div>
    </nav>
  );
}
function Home() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.5,
  });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: inView ? 1 : 0, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex landing-md:flex-row flex-col-reverse pt-[30vh] landing-md:justify-between px-10 gap-9 items-center"
      id="home"
    >
      <div className="landing-md:w-1/2 flex items-start justify-center flex-col gap-4">
        <h1 className="text-[2rem] font-bold landing-md:text-[2.5rem]">
          Stop Stressing. Start thriving
        </h1>
        <p className="text-[var(--secondary-text)]">
          Share, discover, and collaborate on notes with your classmates. This
          app is BAC students’ private space to upload notes, access helpful
          resources, and support each other throughout the school year.
        </p>
        <div className="flex gap-4 items-center justify-center">
          <Link
            href={"/signup"}
            className="bg-[var(--brand)] text-[var(--button-text)] px-5 py-1 rounded-md font-bold text-[1.2rem] border border-[var(--brand)] hover:bg-transparent hover:emphasized-text active:bg-transparent active:emphasized-text transition duration-200"
          >
            Get Started
          </Link>
          <h1 className="text-[1.2rem] font-bold">OR</h1>
          <Link
            href={"/login"}
            className="bg-[var(--secondary-button)] text-[var(--button-text)] px-5 py-1 rounded-md font-bold text-[1.3rem] border border-[var(--secondary-button)] hover:bg-transparent hover:text-[var(--secondary-text)] active:bg-transparent active:text-[var(--secondary-text)] transition duration-200"
          >
            LogIn
          </Link>
        </div>
      </div>
      <img
        src="/notes.png"
        alt="Bacnotes picture"
        className="w-[30rem] aspect-square"
      />
    </motion.div>
  );
}
function About() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.5,
  });
  const [ref2, inView2] = useInView({
    triggerOnce: true,
    threshold: 0.5,
  });
  return (
    <div
      className="flex flex-col items-center justify-center my-[40vh]"
      id="about"
    >
      <motion.h1
        initial={{ opacity: 0, y: 100 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.4 }}
        ref={ref}
        className="text-[3rem] font-bold text-center"
      >
        What Is Bacnotes?
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 100 }}
        animate={inView2 ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.4, delay: 0.2 }}
        ref={ref2}
        className="landing-md:w-1/2 w-screen text-center text-[var(--secondary-text)] text-[1.2rem]"
      >
        <span className="emphasized-text">Bacnotes</span> is a platform designed
        exclusively for BAC students, allowing you to{" "}
        <span className="emphasized-text">share notes</span> and{" "}
        <span className="emphasized-text">stay connected</span> through a
        familiar, secure space. Whether you’re contributing your own notes or
        finding notes from classmates, 
        <span className="emphasized-text">Bacnotes</span> helps bring the
        student community closer together throughout the school year.
      </motion.p>
    </div>
  );
}
function Card({
  title,
  description,
  Svg,
  delay,
}: {
  title: string;
  description: string;
  Svg: any;
  delay: number;
}) {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.5,
  });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 100 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.4, delay: delay }}
      className="bg-[var(--card-color)] w-[20rem] h-fit rounded-md py-[2rem] px-4"
    >
      <Svg />
      <h1 className="capitalize text-[1.4rem] font-bold">{title}</h1>
      <p className="text-[var(--secondary-text)] w-3/4">{description}</p>
    </motion.div>
  );
}
function Features() {
  return (
    <div className="my-[20vh]" id="features">
      <h1 className="text-[3rem] font-bold text-center">Features</h1>
      <div className="grid landing-md:grid-cols-2 grid-cols-1 place-items-center gap-4">
        <Card
          title="Security"
          description="Highest security to ensure that your web experience remains secure at all times"
          Svg={Lock}
          delay={0}
        />
        <Card
          title="Likes"
          description="Users can like posts to engage with the creator"
          Svg={Heart}
          delay={0.2}
        />
        <Card
          title="Post Creation"
          description="Users can create posts, with an image option being available"
          Svg={Plus}
          delay={0.4}
        />
        <Card
          title="Profile"
          description="User profiles are available with username, grade and followers"
          Svg={User}
          delay={0.6}
        />
      </div>
    </div>
  );
}
export default function Page() {
  return (
    <div>
      <Nav />
      <Home />
      <About />
      <Features />
    </div>
  );
}
