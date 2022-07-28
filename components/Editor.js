import { useEffect, useState, useRef } from "react";
import classNames from "classnames";
import styles from "@/styles/editor.module.scss";

export default function Editor({ value, onChange, size = "lg" }) {
  const editorRef = useRef();
  const { CKEditor, ClassicEditor } = editorRef.current || {};
  const [editorLoaded, setEditorLoaded] = useState(false);

  const editorClass = classNames(styles[size]);

  useEffect(() => {
    require("@ckeditor/ckeditor5-build-classic/build/translations/ko");
    editorRef.current = {
      CKEditor: require("@ckeditor/ckeditor5-react").CKEditor, // v3+
      ClassicEditor: require("@ckeditor/ckeditor5-build-classic"),
    };
    setEditorLoaded(true);
  }, []);

  return (
    <div className={editorClass}>
      {editorLoaded && (
        <CKEditor
          editor={ClassicEditor}
          data={value}
          onChange={(event, editor) => {
            onChange && onChange(editor.getData());
          }}
          config={{
            language: "ko",
            placeholder: "내용을 작성하세요",
          }}
        />
      )}
    </div>
  );
}
