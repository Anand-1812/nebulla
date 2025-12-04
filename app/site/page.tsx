import Image from "next/image";

const Home = () => {
  return (
    <section className="relative min-h-screen w-full flex flex-col items-center justify-center px-4 pt-24 overflow-hidden bg-black">

      <div
        className="absolute inset-0
        bg-[linear-gradient(to_right,rgba(88,91,112,0.22)_1px,transparent_1px),linear-gradient(to_bottom,rgba(88,91,112,0.22)_1px,transparent_1px)]
        bg-[size:4rem_4rem]
        [mask-image:radial-gradient(ellipse_70%_50%_at_50%_0%,#000_60%,transparent_120%)]"
      />

      <p className="relative z-10 text-lg md:text-2xl text-center mb-2 tracking-wide text-gray-300">
        Run your agency, in one place
      </p>

      <div className="relative z-10 bg-gradient-to-r from-sky-500 to-blue-500 bg-clip-text text-transparent">
        <h1 className="text-[64px] sm:text-[120px] md:text-[200px] font-extrabold leading-none tracking-tight text-center">
          Nebulla
        </h1>
      </div>

      {/* Image, overlay */}
      <div className="relative z-10 flex justify-center items-center md:mt-[-50px]">
        <Image
          src="/preview.png"
          alt="banner image"
          height={1100}
          width={1100}
          className="rounded-tl-2xl rounded-tr-2xl border-2 border-muted"
        />

        <div className="absolute left-0 right-0 bottom-0 top-1/2 bg-gradient-to-t from-black/90 to-transparent z-20"></div>
      </div>

    </section>
  );
};

export default Home;

