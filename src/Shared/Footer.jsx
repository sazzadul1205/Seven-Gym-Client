import { FcGoogle } from "react-icons/fc";
import { FaFacebookF, FaGithub, FaLinkedinIn } from "react-icons/fa";

import My_Social_Links from "../JSON/My_Social_Links.json";

const Footer = () => {
  return (
    <footer className="bg-[#F72C5B] text-white py-10">
      <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="flex justify-between items-center px-2">
          {/* Services Section */}
          <nav>
            <h6 className="footer-title text-lg font-semibold mb-4">
              Services
            </h6>
            <ul className="space-y-2">
              <li>
                <a className="link link-hover">Branding</a>
              </li>
              <li>
                <a className="link link-hover">Design</a>
              </li>
              <li>
                <a className="link link-hover">Marketing</a>
              </li>
              <li>
                <a className="link link-hover">Advertisement</a>
              </li>
            </ul>
          </nav>
          {/* Company Section */}
          <nav>
            <h6 className="footer-title text-lg font-semibold mb-4">Company</h6>
            <ul className="space-y-2">
              <li>
                <a className="link link-hover">About us</a>
              </li>
              <li>
                <a className="link link-hover">Contact</a>
              </li>
              <li>
                <a className="link link-hover">Jobs</a>
              </li>
              <li>
                <a className="link link-hover">Press kit</a>
              </li>
            </ul>
          </nav>
        </div>

        {/* Social Section */}
        <nav className="mx-auto">
          <h6 className="footer-title text-lg font-semibold text-center md:text-left">
            Social
          </h6>
          <div className="grid grid-cols-4 lg:grid-cols-5 gap-6 mt-4 justify-center">
            {/* Google */}
            <a
              href={My_Social_Links.google}
              className="text-2xl hover:scale-125 transition-all transform duration-300 bg-white p-4 rounded-full text-gray-800 hover:text-[#F72C5B] shadow-lg"
              aria-label="Google"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FcGoogle />
            </a>

            {/* Facebook */}
            <a
              href={My_Social_Links.facebook}
              className="text-2xl text-blue-600 hover:scale-125 transition-all transform duration-300 bg-white p-4 rounded-full hover:text-[#F72C5B] shadow-lg"
              aria-label="Facebook"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaFacebookF />
            </a>

            {/* Twitter */}
            <a
              href={My_Social_Links.twitter}
              className="text-2xl text-blue-400 hover:scale-125 transition-all transform duration-300 bg-white p-4 rounded-full hover:text-[#F72C5B] shadow-lg"
              aria-label="Twitter"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img src={"twitter.png"} alt="Twitter Icon" className="w-5 h-5" />
            </a>

            {/* GitHub */}
            <a
              href={My_Social_Links.github}
              className="text-2xl text-gray-800 hover:scale-125 transition-all transform duration-300 bg-white p-4 rounded-full hover:text-[#F72C5B] shadow-lg"
              aria-label="GitHub"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaGithub />
            </a>

            {/* LinkedIn */}
            <a
              href={My_Social_Links.linkedin}
              className="text-2xl text-blue-700 hover:scale-125 transition-all transform duration-300 bg-white p-4 rounded-full hover:text-[#F72C5B] shadow-lg"
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
