import { Link } from "react-router";

import { FcGoogle } from "react-icons/fc";
import { FaFacebookF, FaGithub, FaLinkedinIn } from "react-icons/fa";

import My_Social_Links from "../JSON/My_Social_Links.json";

const socialIcons = [
  { id: "google", icon: <FcGoogle />, color: "text-gray-800" },
  { id: "facebook", icon: <FaFacebookF />, color: "text-blue-600" },
  {
    id: "twitter",
    icon: <img src="twitter.png" alt="Twitter" className="w-5 h-5" />,
    color: "text-blue-400",
  },
  { id: "github", icon: <FaGithub />, color: "text-gray-800" },
  { id: "linkedin", icon: <FaLinkedinIn />, color: "text-blue-700" },
];

const Footer = () => {
  return (
    <footer className="bg-[#F72C5B] text-white py-10">
      <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="flex justify-between items-center px-2">
          {/* Services Section */}
          <nav>
            <h6 className="text-lg font-semibold mb-4">Services</h6>
            <ul className="space-y-2">
              {["Branding", "Design", "Marketing", "Advertisement"].map(
                (service) => (
                  <li key={service}>
                    <a href="#" className="link link-hover">
                      {service}
                    </a>
                  </li>
                )
              )}
            </ul>
          </nav>

          {/* Company Section */}
          <nav>
            <h6 className="text-lg font-semibold mb-4">Company</h6>
            <ul className="space-y-2">
              {["About us", "Contact", "Jobs", "Press kit"].map((item) => (
                <li key={item}>
                  <a href="#" className="link link-hover">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Social Section */}
        <nav className="mx-auto">
          <h6 className="text-lg font-semibold text-center md:text-left">
            Social
          </h6>
          <div className="grid grid-cols-4 lg:grid-cols-5 gap-6 mt-4 justify-center">
            {socialIcons.map(({ id, icon, color }) => (
              <Link
                key={id}
                to={My_Social_Links[id]}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <button
                  className={`text-2xl ${color} hover:scale-125 transition-all transform duration-300 bg-white p-5 rounded-full hover:text-[#F72C5B] shadow-lg`}
                  aria-label={id.charAt(0).toUpperCase() + id.slice(1)}
                >
                  {icon}
                </button>
              </Link>
            ))}
          </div>
        </nav>
      </div>
    </footer>
  );
};

export default Footer;
