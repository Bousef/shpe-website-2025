export default function JoinBanner() {
  return (
    <div className="relative">
      <section className="z-10 bg-[#2A3342] text-white rounded-md flex justify-around items-center
                           w-[90%] lg:w-[80%] h-[18rem] lg:h-[22rem] mx-auto">
        <article className="w-[12rem] lg:w-[26rem] 2xl:w-[30rem]">
          <h3 className="font-bold text-2xl lg:text-4xl 2xl:text-6xl pb-4">
            Join our Familia!
          </h3>
          <p className="font-medium text-sm lg:text-xl 2xl:text-2xl text-slate-400">
            You don&rsquo;t need to be Hispanic to be part of this change.
          </p>
        </article>

        <article className="flex justify-between w-[30%] 2xl:w-[40%]">
          <a
            href="https://form.jotform.com/70387424224151"
            target="_blank"
            className="inline-flex items-center justify-center bg-yellow-400 hover:bg-yellow-500 rounded-md shadow text-black font-medium
                       w-24 h-10 lg:w-40 lg:h-14 2xl:w-60 2xl:h-20 text-sm lg:text-lg 2xl:text-2xl"
          >
            Get Started
          </a>
          <a
            href="#events"
            className="inline-flex items-center justify-center bg-white hover:bg-gray-200 border border-gray-300 rounded-md shadow text-slate-700 font-medium
                       w-40 h-14 2xl:w-60 2xl:h-20 text-lg 2xl:text-2xl"
          >
            Learn More
          </a>
        </article>
      </section>
    </div>
  );
}
