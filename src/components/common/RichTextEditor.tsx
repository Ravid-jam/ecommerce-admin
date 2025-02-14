import ReactQuill from "react-quill";
interface IRichTextEditerProps {
  field: any;
}
const modules = {
  toolbar: [
    [{ header: "1" }, { header: "2" }, { font: [] }],
    [{ size: [] }],
    ["bold", "italic", "underline", "strike", "blockquote"],
    [
      {
        color: [
          "red",
          "orange",
          "yellow",
          "green",
          "blue",
          "indigo",
          "violet",
          "black",
          "white",
          "gray",
          "brown",
          "pink",
          "purple",
          "cyan",
          "magenta",
          "olive",
          "lime",
          "teal",
          "navy",
          "maroon",
          "silver",
          "gold",
          "transparent",
        ],
      },
      { background: [] },
    ],
    [
      { list: "ordered" },
      { list: "bullet" },
      { indent: "-1" },
      { indent: "+1" },
    ],
    ["clean"],
  ],
  clipboard: {
    // toggle to add extra line breaks when pasting HTML:
    matchVisual: false,
  },
};

const formats = [
  "header",
  "font",
  "size",
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "list",
  "bullet",
  "indent",
  "color",
  "background",
];

export default function RichTextEditor(props: IRichTextEditerProps) {
  return (
    <div>
      <ReactQuill
        theme="snow"
        value={props.field.value}
        onChange={(content: any) => props.field.onChange(content)}
        style={{
          minHeight: "200px",
        }}
        formats={formats}
        modules={modules}
      />
    </div>
  );
}
