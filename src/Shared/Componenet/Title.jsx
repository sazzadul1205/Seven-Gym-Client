// eslint-disable-next-line react/prop-types
const Title = ({ titleContent }) => {
  return (
    <>
      {/* Section Title */}
      <h2 className="text-3xl lg:text-4xl font-bold text-white mb-2">
        {titleContent || "Our Services"}
      </h2>
      <div className="bg-white p-[1px] md:w-1/3 mx-auto"></div>
    </>
  );
};

export default Title;
