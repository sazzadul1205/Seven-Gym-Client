/* eslint-disable react/prop-types */
import { useState } from "react";
import { NavLink } from "react-router";

const NavDrawer = ({ icon, menuItems = [] }) => {
  const [openSubmenu, setOpenSubmenu] = useState(null);

  // Toggle submenu visibility
  const handleToggle = (itemName) => {
    setOpenSubmenu((prev) => (prev === itemName ? null : itemName));
  };

  return (
    <div className="drawer-side">
      {/* Sidebar Overlay for Closing Drawer */}
      <label
        htmlFor="my-drawer-4"
        aria-label="close sidebar"
        className="drawer-overlay"
      ></label>

      {/* Sidebar Container */}
      <ul className="menu text-white h-full w-full p-4 bg-[#F72C5B]/90 overflow-hidden max-w-[80%] md:max-w-[40%]">
        {/* Logo */}
        <li className="mx-auto ">
          <img src={icon} alt="icon" className="w-28" />
        </li>

        {/* Navigation Links */}
        <div>
          {menuItems.map((item) => (
            <li key={item.name} className="border-slate-400">
              {item.submenu ? (
                // Dropdown Menu
                <details
                  open={openSubmenu === item.name}
                  onToggle={() => handleToggle(item.name)}
                >
                  <summary className="cursor-pointer">{item.name}</summary>
                  <ul className="pl-4">
                    {item.submenu.map((subItem) => (
                      <li key={subItem.name}>
                        <NavLink
                          to={subItem.path}
                          className={({ isActive }) =>
                            isActive
                              ? "text-[#FFC107] font-bold"
                              : "hover:text-[#FFC107]"
                          }
                        >
                          {subItem.name}
                        </NavLink>
                      </li>
                    ))}
                  </ul>
                </details>
              ) : (
                // Regular Link
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    isActive
                      ? "text-[#FFC107] font-bold"
                      : "hover:text-[#FFC107]"
                  }
                >
                  {item.name}
                </NavLink>
              )}
            </li>
          ))}
        </div>
      </ul>
    </div>
  );
};

export default NavDrawer;
