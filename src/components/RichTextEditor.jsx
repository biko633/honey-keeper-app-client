import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import { Color } from "@tiptap/extension-color";
import ListItem from "@tiptap/extension-list-item";
import TextStyle from "@tiptap/extension-text-style";
import TextAlign from "@tiptap/extension-text-align";
import Placeholder from "@tiptap/extension-placeholder";
import CharacterCount from "@tiptap/extension-character-count";
import FormatTextdirectionRToLIcon from "@mui/icons-material/FormatTextdirectionRToL";
import FormatTextdirectionLToRIcon from "@mui/icons-material/FormatTextdirectionLToR";
import FormatBoldIcon from "@mui/icons-material/FormatBold";
import FormatItalicIcon from "@mui/icons-material/FormatItalic";
import StrikethroughSIcon from "@mui/icons-material/StrikethroughS";
import FormatUnderlinedIcon from "@mui/icons-material/FormatUnderlined";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import FormatListNumberedIcon from "@mui/icons-material/FormatListNumbered";
import UndoIcon from "@mui/icons-material/Undo";
import RedoIcon from "@mui/icons-material/Redo";
import React from "react";

const limit = 200;

/**
 * Generates the menu bar component for the rich text editor.
 *
 * @param {object} editor - The editor object containing rich text editing functions.
 * @return {JSX.Element} The JSX element representing the menu bar.
 */
const MenuBar = ({ editor }) => {
  if (!editor) {
    return null;
  }

  return (
    <div>
      <input
        type="color"
        onInput={(event) =>
          editor.chain().focus().setColor(event.target.value).run()
        }
        value={editor.getAttributes("textStyle").color || "#ffffff"}
        data-testid="setColor"
        className="rich-text-editor-button rich-text-editor-color-button"
      />
      <button
        onClick={() => editor.chain().focus().setTextAlign("left").run()}
        className={
          editor.isActive({ textAlign: "left" })
            ? "is-active rich-text-editor-button"
            : "rich-text-editor-button"
        }
      >
        <FormatTextdirectionRToLIcon />
      </button>
      <button
        onClick={() => editor.chain().focus().setTextAlign("right").run()}
        className={
          editor.isActive({ textAlign: "right" })
            ? "is-active rich-text-editor-button"
            : "rich-text-editor-button"
        }
      >
        <FormatTextdirectionLToRIcon />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        disabled={!editor.can().chain().focus().toggleBold().run()}
        className={
          editor.isActive("bold")
            ? "is-active rich-text-editor-button"
            : "rich-text-editor-button"
        }
      >
        <FormatBoldIcon />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
        className={
          editor.isActive("italic")
            ? "is-active rich-text-editor-button"
            : "rich-text-editor-button"
        }
      >
        <FormatItalicIcon />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleStrike().run()}
        disabled={!editor.can().chain().focus().toggleStrike().run()}
        className={
          editor.isActive("strike")
            ? "is-active rich-text-editor-button"
            : "rich-text-editor-button"
        }
      >
        <StrikethroughSIcon />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className={
          editor.isActive("underline")
            ? "is-active rich-text-editor-button"
            : "rich-text-editor-button"
        }
      >
        <FormatUnderlinedIcon />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={
          editor.isActive("bulletList")
            ? "is-active rich-text-editor-button"
            : "rich-text-editor-button"
        }
      >
        <FormatListBulletedIcon />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={
          editor.isActive("orderedList")
            ? "is-active rich-text-editor-button"
            : "rich-text-editor-button"
        }
      >
        <FormatListNumberedIcon />
      </button>
      <button
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().chain().focus().undo().run()}
        className="rich-text-editor-button"
      >
        <UndoIcon />
      </button>
      <button
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().chain().focus().redo().run()}
        className="rich-text-editor-button"
      >
        <RedoIcon />
      </button>
    </div>
  );
};

/**
 * WordCount component that displays the character count of the editor.
 *
 * @param {Object} editor - the editor object
 * @return {JSX} the character count display component
 */
const WordCount = ({ editor }) => {
  if (!editor) {
    return null;
  }
  return (
    <div className="rich-text-editor-character-count">
      {editor.storage.characterCount.characters()}/{limit} characters
    </div>
  );
};

const extensions = [
  Color.configure({ types: [TextStyle.name, ListItem.name] }),
  TextStyle.configure({ types: [ListItem.name] }),
  Underline,
  CharacterCount.configure({
    limit,
    mode: "nodeSize",
  }),
  TextAlign.configure({
    types: ["heading", "paragraph"],
  }),
  Placeholder.configure({
    placeholder: "Content",
  }),
  StarterKit.configure({
    bulletList: {
      keepMarks: true,
      keepAttributes: false,
    },
    orderedList: {
      keepMarks: true,
      keepAttributes: false,
    },
    blockquote: false,
    codeBlock: false,
    hardBreak: false,
    horizontalRule: false,
    code: false,
    dropcursor: false,
    gapcursor: false,
  }),
];

const content = "";

/**
 * RichTextEditor component for handling rich text editing.
 *
 * @param {function} getData - callback function to retrieve the HTML data from the editor
 * @return {JSX.Element} The rendered RichTextEditor component
 */
export const RichTextEditor = ({ getData }) => {
  const editor = useEditor({
    extensions: extensions,
    content: content,

    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      getData(html);
      // (html);
    },
  });

  return (
    <div>
      <MenuBar editor={editor} />
      <EditorContent editor={editor} />
      <WordCount editor={editor} />
    </div>
  );
};
