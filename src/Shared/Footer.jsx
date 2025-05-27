import { Link } from "react-router";
import My_Social_Links from "../JSON/My_Social_Links.json";

// Import icons from react-icons
import {
  FaGoogle,
  FaFacebookF,
  FaTwitter,
  FaGithub,
  FaLinkedinIn,
} from "react-icons/fa";
import { Tooltip } from "react-tooltip";

const socialIcons = {
  google: FaGoogle,
  facebook: FaFacebookF,
  twitter: FaTwitter,
  github: FaGithub,
  linkedin: FaLinkedinIn,
};

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
                    <Link to="#" className="link link-hover">
                      {service}
                    </Link>
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
                  <Link to="#" className="link link-hover">
                    {item}
                  </Link>
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
            {Object.entries(My_Social_Links).map(([platform, url]) => {
              const IconComponent = socialIcons[platform];
              if (!IconComponent) return null; // skip unknown platforms`

              return (
                <a
                  key={platform}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-tooltip-id={`tooltip-${platform}`}
                  data-tooltip-content={platform.toUpperCase()}
                  className="hover:scale-110 transition-transform text-white text-2xl flex justify-center items-center"
                  aria-label={platform}
                >
                  <IconComponent />
                  <Tooltip id={`tooltip-${platform}`} place="top" />
                </a>
              );
            })}
          </div>
        </nav>
      </div>
    </footer>
  );
};

export default Footer;


