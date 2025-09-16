function Home() {
  return (
    <div
      id="home"
      className="flex landing-md:flex-row flex-col-reverse items-center justify-between landing-md:px-[2rem] w-screen mt-[15vh]"
    >
      <div className="flex flex-col items-start justify-center landing-md:min-h-screen py-4 landing-md:w-1/2 w-screen">
        <h1 className="text-[3rem] font-bold text-left">Welcome To Bacnotes</h1>
        <p className="text-[#d9d9d9cc]">
          Share, discover, and collaborate on notes with your classmates. This
          app is BAC students’ private space to upload notes, access helpful
          resources, and support each other throughout the school year.
        </p>
        <div className="flex gap-4 items-center justify-center mt-4">
          <button className="text-[1.5rem] rounded-xl bg-[#1C6CA0] font-bold px-4 py-2 hover:bg-[#145a86] whitespace-nowrap">
            Get Started Now
          </button>
          <div className="hidden landing-md:block">
            <h1 className="font-bold text-[2rem]">OR</h1>
            <button className="text-[1.5rem] rounded-xl bg-[#141414] font-bold px-6 py-2">
              LogIn
            </button>
          </div>
        </div>
      </div>
      <div className="landing-md:w-1/2 flex justify-end">
        <img src="/bac.png" className="w-[30rem] rounded-xl" />
      </div>
    </div>
  );
}
function About() {
  return (
    <div
      id="about"
      className="flex flex-col items-center justify-center landing-md:px-[2rem] w-screen mt-[20vh]"
    >
      <h1 className="text-[3rem] font-bold">What Is Bacnotes?</h1>
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
    </div>
  );
}
export default function Page() {
  return (
    <>
      <Home />
      <About />
    </>
  );
}
