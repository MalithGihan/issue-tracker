type TopTitleProps = {
  title: string;
  subTitle: string;
  description: string;
};

export default function TopTitle({
  title,
  subTitle,
  description,
}: TopTitleProps) {
  return (
    <div className={`text-left transition-all duration-1000`}>
      <h1 className="text-xl sm:text-xl lg:text-2xl font-bold mb-6 ml-5">
        <span className="bg-linear-to-r from-black via-cyan-500 to-emerald-400 bg-clip-text text-transparent">
          {title}
        </span>
      </h1>
      <p className="text-md sm:text-sm text-gray-600 mx-auto mb-4 ">
        {subTitle}
      </p>
      <p className="text-xs text-gray-500 mx-auto ml-15">{description}</p>
    </div>
  );
}
