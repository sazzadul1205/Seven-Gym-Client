const CallToAction = () => {
  return (
    <div className="py-16 bg-gradient-to-r from-purple-600 to-blue-500 text-white">
      <div className="container mx-auto px-6 text-center">
        {/* Title */}
        <h2 className="text-3xl lg:text-4xl font-bold mb-4">
          Ready to Achieve Your Fitness Goals?
        </h2>
        <p className="text-lg mb-8">
          Join us today, stay fit, and live a healthier life. Sign up, download
          our app, or visit our gym to get started!
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col md:flex-row justify-center items-center gap-4">
          <button className="bg-white text-purple-600 font-bold py-3 w-[300px] rounded-lg shadow-lg hover:bg-purple-100 transition duration-300">
            Sign Up for Membership
          </button>
          <button className="bg-white text-blue-600 font-bold py-3 w-[300px] rounded-lg shadow-lg hover:bg-blue-100 transition duration-300">
            Download Our App
          </button>
          <button className="bg-white text-green-600 font-bold py-3 w-[300px] rounded-lg shadow-lg hover:bg-green-100 transition duration-300">
            Visit the Gym
          </button>
        </div>
      </div>
    </div>
  );
};

export default CallToAction;
