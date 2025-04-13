import { useState } from "react";
import { NavLink } from "react-router";
import PropTypes from "prop-types";

const NavDrawer = ({ icon, menuItems = [] }) => {
  const [openSubmenu, setOpenSubmenu] = useState(null);

  // Toggle submenu visibility
  const handleToggle = (itemName) => {
    setOpenSubmenu((prev) => (prev === itemName ? null : itemName));
  };

  // Function to close the drawer by simulating a click on the drawer toggle
  const closeDrawer = () => {
    const drawerCheckbox = document.getElementById("my-drawer-4");
    if (drawerCheckbox) {
      drawerCheckbox.click();
    }
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
        <li className="mx-auto">
          <img src={icon} alt="Logo" className="w-28" />
        </li>

        <div className="bg-white p-[1px]" />

        {/* Navigation Links */}
        <div className="hover:bg-red-500">
          {menuItems.map((item) => (
            <li key={item.name} className="border-slate-400">
              {item.submenu ? (
                // Dropdown Menu
                <details
                  open={openSubmenu === item.name}
                  onToggle={() => handleToggle(item.name)}
                >
                  <summary className="cursor-pointer py-3 border-b border-l border-white">{item.name}</summary>
                  <ul className="pl-4">
                    {item.submenu.map((subItem) => (
                      <li key={subItem.name}>
                        <NavLink
                          to={subItem.path}
                          onClick={closeDrawer}
                          className={({ isActive }) =>
                            isActive
                              ? "text-[#FFC107] font-bold py-3 border-b border-l border-white"
                              : "hover:text-[#FFC107] py-3 border-b border-l border-white"
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
                <>
                  <NavLink
                    to={item.path}
                    onClick={closeDrawer}
                    className={({ isActive }) =>
                      isActive
                        ? "text-[#FFC107] font-bold py-3 border-b border-l border-white"
                        : "hover:text-[#FFC107] py-3 bg-[#F72C5B]/50 border-b border-l border-white"
                    }
                  >
                    {item.name}
                  </NavLink>
                </>
              )}
            </li>
          ))}
        </div>
      </ul>
    </div>
  );
};

// PropTypes for type validation
NavDrawer.propTypes = {
  // Expect a string URL for the logo icon
  icon: PropTypes.string.isRequired,
  // menuItems should be an array of objects with required name and optional path and submenu.
  menuItems: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      path: PropTypes.string, // Optional for items with submenu
      submenu: PropTypes.arrayOf(
        PropTypes.shape({
          name: PropTypes.string.isRequired,
          path: PropTypes.string.isRequired,
        })
      ),
    })
  ).isRequired,
};

export default NavDrawer;
