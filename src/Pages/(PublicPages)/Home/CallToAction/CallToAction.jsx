const CallToAction = () => {
  // CTA buttons data for scalability
  const ctaButtons = [
    {
      label: "Sign Up for Membership",
      color: "text-purple-600",
      hover: "hover:bg-purple-100",
      link: "/SignUp",
    },
    {
      label: "Download Our App",
      color: "text-blue-600",
      hover: "hover:bg-blue-100",
    },
    {
      label: "Visit the Gym",
      color: "text-green-600",
      hover: "hover:bg-green-100",
    },
  ];

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-purple-600 to-blue-500 text-white text-center">
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
          {ctaButtons.map(({ label, color, hover, link }, index) => (
            <a
              key={index}
              className={`bg-white ${color} font-bold py-3 w-[280px] sm:w-[300px] rounded-lg shadow-lg transition duration-300 ${hover}`}
              href={`${link}`}
              aria-label={label}
            >
              {label}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
