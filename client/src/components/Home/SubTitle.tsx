type SubTitleProps = {
  title1: string;
  title2: string;
  description: string;
};

export default function SubTitle({
  title1,
  title2,
  description,
}: SubTitleProps) {
  return (
    <div className="text-start mb-10">
      <h2 className="text-xl sm:text-3xl font-bold mb-4">
        {title1}{" "}
        <span className="bg-linear-to-r from-cyan-400 to-green-300 bg-clip-text text-transparent">
          {title2}
        </span>
      </h2>
      <p className="text-zinc-400 text-sm">{description}</p>
      <div className="hidden md:block h-px w-full my-4 bg-linear-to-b from-transparent via-black/20 to-transparent" />
    </div>
  );
}
