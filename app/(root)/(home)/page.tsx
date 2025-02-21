import MeetingTypeList from "@/components/MeetingTypeList";

const Home = () => {
  const now = new Date();
  const time = now.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
  const date = new Intl.DateTimeFormat("en-US", { dateStyle: "full" }).format(
    now
  );

  return (
    <section className="flex size-full flex-col gap-5 text-black dark:text-white ">
      <div className="h-[303px] w-full rounded-[20px] bg-hero-light dark:bg-hero bg-cover shadow-md dark:shadow-slate-800">
        <div className="flex h-full flex-col justify-between max-md:px-5 max-md:py-8 lg:p-11">
          <h2 className="backdrop-blur-md bg-white/30 dark:bg-black/30 max-w-[273px] rounded-lg py-2 text-center text-base font-normal border border-gray-200/20 dark:border-gray-700/20">
            Upcoming Meeting at: 12:30 PM
          </h2>
          <div className="flex flex-col gap-2 backdrop-blur-sm bg-white/10 dark:bg-black/10 p-4 rounded-lg">
            <h1 className="text-4xl font-extrabold lg:text-7xl text-gray-900 dark:text-white">
              {time}
            </h1>
            <p className="text-lg font-medium text-gray-700 dark:text-sky-1 lg:text-2xl">
              {date}
            </p>
          </div>
        </div>
      </div>

      <MeetingTypeList />
    </section>
  );
};

export default Home;
