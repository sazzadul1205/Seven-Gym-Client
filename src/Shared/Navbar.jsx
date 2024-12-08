import { useState, useEffect } from "react";
import { NavLink } from "react-router";
import icon from "../assets/Icon.png";
import { IoMenu } from "react-icons/io5";

const Navbar = () => {
  const menuItems = [
    { name: "Home", path: "/" },
    { name: "Gallery", path: "/Gallery" },
    {
      name: "Trainers",
      path: "/Trainers",
      submenu: [
        { name: "Personal Trainers", path: "/Trainers/Personal" },
        { name: "Group Trainers", path: "/Trainers/Group" },
        { name: "Trainer Profiles", path: "/Trainers/Profiles" },
      ],
    },
    {
      name: "Classes",
      path: "/Classes",
      submenu: [
        { name: "Yoga", path: "/Classes/Yoga" },
        { name: "Pilates", path: "/Classes/Pilates" },
        { name: "Strength Training", path: "/Classes/Strength" },
        { name: "Cardio", path: "/Classes/Cardio" },
        { name: "Special Classes", path: "/Classes/Special" },
      ],
    },
    { name: "Forums", path: "/Forums" },
    { name: "Blogs", path: "/Blogs" },
    {
      name: "About Us",
      path: "/About",
      submenu: [
        { name: "Our Mission", path: "/About/Mission" },
        { name: "Testimonials", path: "/About/Testimonials" },
        { name: "Careers", path: "/About/Careers" },
      ],
    },
  ];

  // Track scroll position
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const renderNavLink = (item) => {
    if (item.submenu) {
      return (
        <div className="dropdown" key={item.name}>
          <div
            tabIndex={0}
            role="button"
            className=" text-white hover:text-[#FFC107]"
          >
            {item.name}
          </div>
          <ul
            tabIndex={0}
            className="dropdown-content menu bg-[#f35f81] text-white z-[1] w-52 p-2 shadow-2xl mt-2"
          >
            {item.submenu.map((subItem, subIndex) => (
              <li key={subIndex}>
                <NavLink
                  to={subItem.path}
                  className={({ isActive }) =>
                    isActive
                      ? "text-[#FFC107] hover:text-[#FFC107] font-bold"
                      : "hover:text-[#FFC107]"
                  }
                >
                  {subItem.name}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      );
    }
    return (
      <NavLink
        to={item.path}
        className={({ isActive }) =>
          isActive
            ? "text-[#FFC107] hover:text-[#FFC107] font-bold"
            : "hover:text-[#FFC107]"
        }
      >
        {item.name}
      </NavLink>
    );
  };

  return (
    <div
      className={`navbar fixed w-full top-0 z-10 transition-all duration-300 ${
        isScrolled ? "bg-[#F72C5B]" : "bg-transparent"
      }`}
    >
      <div className="navbar flex-none w-full justify-between lg:px-24">
        {/* Start */}
        <div className="navbar-start flex items-center">
          <label
            htmlFor="my-drawer-4"
            className="btn btn-ghost lg:hidden drawer-button"
          >
            <IoMenu className="text-2xl" />
          </label>
          <NavLink to="/" className="ml-2">
            <img src={icon} alt="icon" className="w-28" />
          </NavLink>
        </div>

        {/* Middle */}
        <div className="navbar-center hidden lg:flex">
          <ul className="flex space-x-4 px-1 text-white font-semibold text-lg">
            {menuItems.map((item) => (
              <li key={item.name}>{renderNavLink(item)}</li>
            ))}
          </ul>
        </div>

        {/* End */}
        <div className="navbar-end flex items-center">
          <button className="bg-blue-400 hover:bg-gradient-to-l from-blue-700 to-blue-400 w-28 rounded-full text-center py-2 text-white font-semibold">
            Login
          </button>
        </div>
      </div>

      {/* Drawer Component for Mobile */}
      <div className="drawer drawer-end lg:hidden">
        <input id="my-drawer-4" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content"></div>
        <div className="drawer-side">
          <label
            htmlFor="my-drawer-4"
            aria-label="close sidebar"
            className="drawer-overlay"
          ></label>
          <ul
            className="menu text-white h-full w-2/3 max-w-sm p-4 bg-[#F72C5B]"
            style={{ maxWidth: "70%" }}
          >
            <li className="mx-auto">
              <img src={icon} alt="icon" className="w-28" />
            </li>
            {menuItems.map((item) =>
              item.submenu ? (
                <li key={item.name} className="border-slate-700">
                  <details
                    onToggle={(e) => {
                      if (e.target.open) {
                        document
                          .querySelectorAll(".drawer-side details[open]")
                          .forEach((el) => {
                            if (el !== e.target) el.removeAttribute("open");
                          });
                      }
                    }}
                  >
                    <summary className="cursor-pointer">{item.name}</summary>
                    <ul className="pl-4">
                      {item.submenu.map((subItem) => (
                        <li key={subItem.name}>
                          <NavLink
                            to={subItem.path}
                            className={({ isActive }) =>
                              isActive
                                ? "text-[#FFC107] hover:text-[#FFC107] font-bold"
                                : "hover:text-[#FFC107]"
                            }
                          >
                            {subItem.name}
                          </NavLink>
                        </li>
                      ))}
                    </ul>
                  </details>
                </li>
              ) : (
                <li key={item.name} className="border-slate-400">
                  <NavLink
                    to={item.path}
                    className={({ isActive }) =>
                      isActive
                        ? "text-[#FFC107] hover:text-[#FFC107] font-bold"
                        : "hover:text-[#FFC107]"
                    }
                  >
                    {item.name}
                  </NavLink>
                </li>
              )
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
