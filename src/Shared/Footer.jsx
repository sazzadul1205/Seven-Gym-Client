import { FcGoogle } from "react-icons/fc";
import { FaFacebookF, FaGithub, FaLinkedinIn } from "react-icons/fa";

// Define social links from JSON
const socialLinks = {
  google: "mailto:Psazzadul@gmail.com",
  facebook: "https://www.facebook.com/sazzadul.islam.pritom/",
  twitter: "https://x.com/sazzadu84352084",
  github: "https://github.com/sazzadul1205",
  linkedin: "https://www.linkedin.com/in/sazzadul-islam-molla-6905b3293/",
};

const Footer = () => {
  return (
    <footer className="bg-[#F72C5B] text-white p-10">
      <div className="footer max-w-[1200px] mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8">
        {/* Services Section */}
        <nav>
          <h6 className="footer-title">Services</h6>
          <a className="link link-hover">Branding</a>
          <a className="link link-hover">Design</a>
          <a className="link link-hover">Marketing</a>
          <a className="link link-hover">Advertisement</a>
        </nav>

        {/* Company Section */}
        <nav>
          <h6 className="footer-title">Company</h6>
          <a className="link link-hover">About us</a>
          <a className="link link-hover">Contact</a>
          <a className="link link-hover">Jobs</a>
          <a className="link link-hover">Press kit</a>
        </nav>

        {/* Social Section */}
        <nav className="mx-auto">
          <h6 className="footer-title text-center md:text-left ">Social</h6>
          <div className="grid grid-cols-4 lg:grid-cols-5  gap-4 mt-4 sm:mt-0 justify-center">
            {/* Google */}
            <a
              href={socialLinks.google}
              className="text-xl hover:scale-125 transition-transform bg-white p-3 rounded-full"
              aria-label="Google"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FcGoogle />
            </a>
            {/* Facebook */}
            <a
              href={socialLinks.facebook}
              className="text-xl text-blue-600 hover:scale-125 transition-transform bg-white p-3 rounded-full"
              aria-label="Facebook"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaFacebookF />
            </a>
            {/* Twitter */}
            <a
              href={socialLinks.twitter}
              className="text-xl text-blue-400 hover:scale-125 transition-transform bg-white p-3 rounded-full"
              aria-label="Twitter"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img src={"twitter.png"} alt="Twitter Icon" className="w-5 h-5" />
            </a>
            {/* GitHub */}
            <a
              href={socialLinks.github}
              className="text-xl text-gray-800 hover:scale-125 transition-transform bg-white p-3 rounded-full"
              aria-label="GitHub"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaGithub />
            </a>
            {/* LinkedIn */}
            <a
              href={socialLinks.linkedin}
              className="text-xl text-blue-700 hover:scale-125 transition-transform bg-white p-3 rounded-full"
              aria-label="LinkedIn"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaLinkedinIn />
            </a>
          </div>
        </nav>
      </div>
    </footer>
  );
};

export default Footer;
