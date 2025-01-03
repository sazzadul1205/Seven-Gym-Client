/* eslint-disable react/prop-types */
import { NavLink } from "react-router";

const NavDrawer = ({ icon, menuItems }) => {
  return (
    <div className="drawer-side">
      <label
        htmlFor="my-drawer-4"
        aria-label="close sidebar"
        className="drawer-overlay"
      ></label>
      <ul className="menu text-white h-full w-full p-4 bg-[#F72C5B] overflow-hidden max-w-[80%] md:max-w-[40%]">
        <li className="mx-auto">
          <img src={icon} alt="icon" className="w-28" />
        </li>
        {menuItems?.map((item) =>
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
  );
};

export default NavDrawer;
