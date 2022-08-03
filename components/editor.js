import { useEffect, useState, useRef } from "react";
import classNames from "classnames";
import { API_URL, NEXT_URL } from "@/constants/config";
import styles from "@/styles/editor.module.scss";

export default function Editor({ value, onChange, size = "lg" }) {
  const editorRef = useRef();
  const { CKEditor, Editor } = editorRef.current || {};
  const [editorLoaded, setEditorLoaded] = useState(false);

  const editorClass = classNames(styles[size]);

  useEffect(() => {
    editorRef.current = {
      CKEditor: require("@ckeditor/ckeditor5-react").CKEditor, // v3+
      Editor: require("ckeditor5-custom-build/build/ckeditor"),
    };
    setEditorLoaded(true);
  }, []);

  return (
    <div className={editorClass}>
      {editorLoaded && (
        <CKEditor
          editor={Editor}
          data={value}
          onChange={(event, editor) => {
            onChange && onChange(editor.getData());
          }}
          config={{
            placeholder: "내용을 작성하세요",
            // simpleUpload: {
            //   uploadUrl: `${API_URL}/api/upload`,
            //   headers: {
            //     Authorization: `Bearer ${token}`,
            //   },
            // },
          }}
        />
      )}
    </div>
  );
}
