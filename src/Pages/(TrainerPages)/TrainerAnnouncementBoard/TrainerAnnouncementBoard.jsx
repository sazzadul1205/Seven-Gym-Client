    import { useState, useEffect } from "react";

    // Import Quill

    import ReactQuill, { Quill } from "react-quill";
    import "react-quill/dist/quill.snow.css";

    import ImageResize from "quill-image-resize-module-react"; // <- safer
    Quill.register("modules/imageResize", ImageResize);

    // import Button
    import CommonButton from "../../../Shared/Buttons/CommonButton";

    const STORAGE_KEY = "trainer_announcements";

    // Announcement form for Add/Edit
    function AnnouncementForm({ initialData = {}, onCancel, onSave }) {
    const [title, setTitle] = useState(initialData.title || "");
    const [content, setContent] = useState(initialData.content || "");
    const isEdit = Boolean(initialData.id);

    const handleSubmit = (e) => {
        e.preventDefault();
        const payload = { id: initialData.id || Date.now(), title, content };
        onSave(payload);
        onCancel();
    };

    console.log(Quill.imports); // if undefined => version mismatch

    const modules = {
        toolbar: [
        // Text styling
        ["bold", "italic", "underline", "strike"],

        // Font size options
        [{ size: ["small", false, "large", "huge"] }], // default is false

        // Headers
        [{ header: [1, 2, 3, false] }],

        // Text color & background color
        [{ color: [] }, { background: [] }],

        // Alignment
        [{ align: [] }],

        // Links & media
        ["link", "image"],

        // Clear formatting
        ["clean"],
        ],
        imageResize: {
        // Basic settings for resizing
        modules: ["Resize", "DisplaySize", "Toolbar"],
        },
    };

    return (
        <div className="bg-white border-4 border-gray-600 rounded-2xl shadow-md min-h-[500px] p-5 text-black">
        <form onSubmit={handleSubmit}>
            <div className="flex items-center gap-4 border border-gray-400 rounded-t-lg px-4 py-3 shadow-sm bg-white">
            {/* Label */}
            <label className="font-semibold text-gray-700 whitespace-nowrap">
                Announcement:
            </label>

            {/* Input field */}
            <input
                type="text"
                className="flex-1 border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Enter announcement title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
            />
            </div>

            <ReactQuill
            theme="snow"
            value={content}
            onChange={setContent}
            modules={modules}
            placeholder="Write your announcement here..."
            className="bg-white rounded-lg shadow-sm"
            />

            <div className="mt-4 flex justify-end space-x-2">
            <button
                type="button"
                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                onClick={onCancel}
            >
                Cancel
            </button>
            <button
                type="submit"
                className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
            >
                {isEdit ? "Update" : "Add"}
            </button>
            </div>
        </form>
        </div>
    );
    }

    // Single announcement card
    function AnnouncementCard({ announcement, onEdit, onDelete }) {
    return (
        <div className="bg-white rounded-lg shadow-md p-4 mb-4">
        <h4 className="text-xl font-semibold mb-2">{announcement.title}</h4>
        <div
            className="prose max-w-full mb-4"
            dangerouslySetInnerHTML={{ __html: announcement.content }}
        />
        <div className="flex justify-end space-x-2">
            <button
            onClick={() => onEdit(announcement)}
            className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
            >
            Edit
            </button>
            <button
            onClick={() => onDelete(announcement.id)}
            className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
            >
            Delete
            </button>
        </div>
        </div>
    );
    }

    // Main board component
    export default function TrainerAnnouncementBoard() {
    const [announcements, setAnnouncements] = useState([]);
    const [editing, setEditing] = useState(null);
    const [showForm, setShowForm] = useState(false);

    // Load from localStorage
    useEffect(() => {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) setAnnouncements(JSON.parse(stored));
    }, []);

    // Persist to localStorage
    const saveAnnouncements = (list) => {
        setAnnouncements(list);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    };

    const handleSave = (item) => {
        const exists = announcements.find((a) => a.id === item.id);
        if (exists) {
        saveAnnouncements(
            announcements.map((a) => (a.id === item.id ? item : a))
        );
        } else {
        saveAnnouncements([item, ...announcements]);
        }
    };

    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to delete this announcement?")) {
        saveAnnouncements(announcements.filter((a) => a.id !== id));
        }
    };

    return (
        <div className="bg-gradient-to-t from-gray-200 to-gray-400 min-h-screen">
        <div className="text-center py-3">
            <h3 className="text-2xl sm:text-3xl font-bold text-gray-800">
            Trainer Announcement Board
            </h3>
            <p className="text-gray-600 text-sm sm:text-base mt-1">
            Create and manage public announcements for trainers
            </p>
        </div>

        <div className="mx-auto bg-white w-1/3 h-[1px] mb-3" />

        <div className="mx-auto px-2">
            {showForm && (
            <AnnouncementForm
                onCancel={() => setShowForm(false)}
                onSave={handleSave}
            />
            )}

            {editing && (
            <AnnouncementForm
                initialData={editing}
                onCancel={() => setEditing(null)}
                onSave={handleSave}
            />
            )}

            {announcements.length === 0 && !showForm && !editing ? (
            <div className="bg-white border-4 border-gray-600 rounded-2xl shadow-md min-h-[500px] flex flex-col justify-center items-center px-4 space-y-6">
                {/* Announcement message */}
                <p className="text-center text-gray-600 text-lg font-medium">
                No announcements yet. Click
                <span className="font-semibold">
                    {" "}
                    &quot; Add Announcement &quot;{" "}
                </span>
                to create one.
                </p>

                {/* Add Announcement Button */}
                <CommonButton
                clickEvent={() => setShowForm(true)}
                text="Add Announcement"
                bgColor="green"
                px="px-6"
                py="py-2.5"
                borderRadius="rounded-lg"
                textColor="text-white"
                width="auto"
                />
            </div>
            ) : (
            announcements.map((ann) => (
                <AnnouncementCard
                key={ann.id}
                announcement={ann}
                onEdit={(a) => {
                    setEditing(a);
                    setShowForm(false);
                }}
                onDelete={handleDelete}
                />
            ))
            )}
        </div>
        </div>
    );
    }
