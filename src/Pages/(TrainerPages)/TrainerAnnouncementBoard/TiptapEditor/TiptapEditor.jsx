import PropTypes from "prop-types"; // Import PropTypes for prop validation
import { EditorContent, useEditor, Extension } from "@tiptap/react"; // Import necessary functions from TipTap
import StarterKit from "@tiptap/starter-kit"; // Default starter kit for TipTap editor
import Underline from "@tiptap/extension-underline"; // Underline extension
import TextAlign from "@tiptap/extension-text-align"; // Text alignment extension
import Color from "@tiptap/extension-color"; // Color extension
import Placeholder from "@tiptap/extension-placeholder"; // Placeholder extension for default text
import TextStyle from "@tiptap/extension-text-style"; // Text style extension (for things like bold, italic)
import Link from "@tiptap/extension-link"; // Link extension
import * as lucideReact from "lucide-react"; // Import icons from lucide-react
import ToolbarButton from "./ToolbarButton"; // Custom toolbar button component
import "./tiptap.css"; // Custom CSS for TipTap editor

// Custom FontSize Extension
const FontSize = Extension.create({
  name: "fontSize", // Define extension name
  addOptions() {
    return { types: ["textStyle"] }; // Specify which types this extension affects
  },
  addGlobalAttributes() {
    return [
      {
        types: this.options.types, // Attribute will apply to textStyle type
        attributes: {
          fontSize: {
            default: null,
            parseHTML: (el) =>
              // Parse font size from inline styles
              el.style.fontSize?.replace(/\['"]+/g, "") || null,
            renderHTML: (attrs) =>
              attrs.fontSize ? { style: `font-size: ${attrs.fontSize}` } : {}, // Apply font-size in inline styles
          },
        },
      },
    ];
  },
  addCommands() {
    return {
      setFontSize:
        (fontSize) =>
        ({ chain }) => {
          const size =
            typeof fontSize === "number" ? `${fontSize}px` : fontSize; // Handle font size (numeric or string)
          return chain().setMark("textStyle", { fontSize: size }).run(); // Apply font size mark
        },
    };
  },
});

// LineHeight Extension
const LineHeight = Extension.create({
  name: "lineHeight", // Define extension name
  addGlobalAttributes() {
    return [
      {
        types: ["paragraph"], // Line height applies to paragraphs
        attributes: {
          lineHeight: {
            default: null,
            parseHTML: (el) => el.style.lineHeight || null, // Parse line height from inline styles
            renderHTML: (attrs) =>
              attrs.lineHeight
                ? { style: `line-height: ${attrs.lineHeight}` }
                : {}, // Apply line-height in inline styles
          },
        },
      },
    ];
  },
  addCommands() {
    return {
      setLineHeight:
        (lineHeight) =>
        ({ chain }) => {
          return chain().updateAttributes("paragraph", { lineHeight }).run(); // Apply line height to paragraph
        },
    };
  },
});

const TiptapEditor = ({ content, setContent }) => {
  // Prop validation for TiptapEditor component
  TiptapEditor.propTypes = {
    content: PropTypes.string, // Content should be a string
    setContent: PropTypes.func.isRequired, // setContent should be a function
  };

  // Initialize the TipTap editor with necessary extensions
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        // Disable bullet lists
        bulletList: false,

        // Disable ordered lists
        orderedList: false,

        // Disable list items
        listItem: false,
      }),

      // Add Underline extension
      Underline,

      // Add TextStyle extension
      TextStyle,

      // Add Color extension for text color
      Color,

      // Add Link extension
      Link,

      // Configure text alignment for heading and paragraph
      TextAlign.configure({ types: ["heading", "paragraph"] }),

      // Add placeholder text
      Placeholder.configure({ placeholder: "Write your announcement here..." }),

      // Add custom FontSize extension
      FontSize,

      // Add custom LineHeight extension
      LineHeight,
    ],
    // Initialize content with the provided content or default to empty paragraph
    content: content || "<p></p>",

    // Update content on editor changes
    onUpdate: ({ editor }) => setContent(editor.getHTML()),
  });

  // Show loading if editor is not initialized
  if (!editor) return <div>Loading...</div>;

  return (
    <div>
      <div className="flex flex-wrap gap-2 sm:gap-3 md:gap-4 mb-3 border-b pb-2">
        {/* Bold Button */}
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          isActive={editor.isActive("bold")}
          title="Bold"
          icon={lucideReact.Bold}
        />

        {/* Italic Button */}
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          isActive={editor.isActive("italic")}
          title="Italic"
          icon={lucideReact.Italic}
        />

        {/* Underline Button */}
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          isActive={editor.isActive("underline")}
          title="Underline"
          icon={lucideReact.Underline}
        />

        {/* Strike-through Button */}
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleStrike().run()}
          isActive={editor.isActive("strike")}
          title="Strike-through"
          icon={lucideReact.Strikethrough}
        />

        {/* Paragraph Button */}
        <ToolbarButton
          onClick={() => editor.chain().focus().setParagraph().run()}
          isActive={editor.isActive("paragraph")}
          title="Paragraph"
          icon={lucideReact.Pilcrow}
        />

        {/* Heading 1 Button */}
        <ToolbarButton
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          isActive={editor.isActive("heading", { level: 1 })}
          title="Heading 1"
          icon={lucideReact.Heading1}
        />

        {/* Heading 2 Button */}
        <ToolbarButton
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          isActive={editor.isActive("heading", { level: 2 })}
          title="Heading 2"
          icon={lucideReact.Heading2}
        />

        {/* Text Align Left Button */}
        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
          isActive={editor.isActive({ textAlign: "left" })}
          title="Align Left"
          icon={lucideReact.AlignLeft}
        />

        {/* Text Align Center Button */}
        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
          isActive={editor.isActive({ textAlign: "center" })}
          title="Align Center"
          icon={lucideReact.AlignCenter}
        />

        {/* Text Align Right Button */}
        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
          isActive={editor.isActive({ textAlign: "right" })}
          title="Align Right"
          icon={lucideReact.AlignRight}
        />

        <div className="flex flex-row gap-2" >
          {/* Font Size Dropdown */}
          <div className="min-w-[120px]">
            <label className="sr-only" htmlFor="font-size">
              Font Size
            </label>
            <select
              id="font-size"
              className="w-full p-1 sm:p-2 rounded border text-sm"
              onChange={(e) =>
                editor.chain().focus().setFontSize(e.target.value).run()
              }
              title="Font Size"
              defaultValue=""
            >
              <option value="" disabled>
                Font Size
              </option>
              <option value="12px">12px</option>
              <option value="14px">14px</option>
              <option value="16px">16px</option>
              <option value="18px">18px</option>
              <option value="20px">20px</option>
            </select>
          </div>

          {/* Line Height Dropdown */}
          <div className="min-w-[120px]">
            <label className="sr-only" htmlFor="line-height">
              Line Height
            </label>
            <select
              id="line-height"
              className="w-full p-1 sm:p-2 rounded border text-sm"
              onChange={(e) =>
                editor.chain().focus().setLineHeight(e.target.value).run()
              }
              title="Line Height"
              defaultValue=""
            >
              <option value="" disabled>
                Line Height
              </option>
              <option value="1">1</option>
              <option value="1.5">1.5</option>
              <option value="2">2</option>
              <option value="2.5">2.5</option>
              <option value="3">3</option>
            </select>
          </div>
        </div>

        {/* Text Color Picker */}
        <div className="min-w-[120px]">
          <label className="sr-only" htmlFor="text-color">
            Text Color
          </label>
          <input
            type="color"
            id="text-color"
            className="w-full h-[36px] rounded border"
            onChange={(e) =>
              editor.chain().focus().setColor(e.target.value).run()
            }
            title="Text Color"
          />
        </div>

        {/* Link Button */}
        <ToolbarButton
          onClick={() => {
            const url = prompt("Enter the URL");
            if (url) {
              editor.chain().focus().setLink({ href: url }).run();
            }
          }}
          isActive={editor.isActive("link")}
          title="Insert Link"
          icon={lucideReact.Link}
        />
      </div>

      {/* Editor Content Area */}
      <EditorContent
        editor={editor}
        className="bg-white rounded-lg shadow-sm min-h-[200px] p-2"
      />
    </div>
  );
};

// ToolbarButton prop validation
ToolbarButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  isActive: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
  icon: PropTypes.elementType.isRequired,
};

export default TiptapEditor;
