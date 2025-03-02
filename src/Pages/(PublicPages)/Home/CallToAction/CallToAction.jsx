const CallToAction = () => {
  // CTA buttons data for scalability
  const ctaButtons = [
    {
      label: "Sign Up for Membership",
      hover:
        "bg-linear-to-tl hover:bg-linear-to-br from-red-400/70 to-red-400",
      link: "/SignUp",
    },
    {
      label: "Download Our App",
      hover:
        "bg-linear-to-tl hover:bg-linear-to-br from-green-400/70 to-green-400",
    },
    {
      label: "Visit the Gym",
      hover:
        "bg-linear-to-tl hover:bg-linear-to-br from-purple-400/70 to-purple-400",
    },
  ];

  return (
    <div className="py-16 px-4 sm:px-6 lg:px-8 bg-linear-to-tr from-purple-700 to-blue-500 text-white text-center border-t-2 border-black">
      <div className="max-w-7xl mx-auto">
        {/* Section Title */}
        <h2 className="text-3xl sm:text-4xl font-bold mb-4 leading-tight">
          Ready to Achieve Your Fitness Goals?
        </h2>
        <p className="text-lg mb-8">
          Join us today, stay fit, and live a healthier life. Sign up, download
          our app, or visit our gym to get started!
        </p>

        {/* CTA Buttons Container */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
          {ctaButtons.map(({ label, hover, link }, index) => (
            <a
              key={index}
              className={`${hover} font-bold py-3 w-[280px] sm:w-[300px] rounded-lg shadow-lg hover:shadow-2xl transition duration-300`}
              href={`${link}`}
              aria-label={label}
            >
              {label}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CallToAction;
