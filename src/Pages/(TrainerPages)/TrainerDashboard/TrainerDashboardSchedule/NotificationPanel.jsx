import { Bell, CalendarCheck, MessageCircle, AlertCircle } from "lucide-react";

export default function NotificationPanel({ items = [] }) {
  // fallback items if none passed in
  const defaults = [
    { id: 1, icon: <CalendarCheck />, label: "New Booking Request" },
    { id: 2, icon: <Bell />, label: "Cancellation Notice" },
    { id: 3, icon: <MessageCircle />, label: "Client Feedback Alert" },
    { id: 4, icon: <AlertCircle />, label: "System Announcement" },
  ];
  const list = items.length ? items : defaults;

  return (
    <div className="md:w-1/3 w-full">
      <div className="bg-gradient-to-r from-amber-500 to-yellow-400 rounded-2xl shadow-xl overflow-hidden">
        <div className="px-6 py-4 flex items-center gap-2">
          <Bell className="w-6 h-6 text-white" />
          <h3 className="text-white text-lg font-bold">
            Notifications & Messages
          </h3>
        </div>
      </div>
      <div className="bg-white rounded-b-2xl shadow-md border-t-0 border border-gray-200">
        <ul className="divide-y divide-gray-100">
          {list.map(({ id, icon, label }) => (
            <li
              key={id}
              className="flex items-center gap-3 p-4 hover:bg-gray-50 transition-colors cursor-pointer"
            >
              <span className="text-amber-500">{icon}</span>
              <span className="text-gray-700 font-medium">{label}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
