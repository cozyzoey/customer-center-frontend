import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import "@ckeditor/ckeditor5-build-decoupled-document/build/translations/ko";
import styles from "@/styles/EditorSimple.module.scss";

export default function Editor({ value, onChange }) {
  return (
    <div className={styles.container}>
      <CKEditor
        editor={ClassicEditor}
        data={value}
        onError={(error, { willEditorRestart }) => {
          if (willEditorRestart) {
            toolBarRef.current.ui.view.toolbar.element.remove();
          }
        }}
        onChange={(event, editor) => {
          onChange && onChange(editor.getData());
        }}
        config={{
          language: "ko",
        }}
        placeholder="hihi"
      />
    </div>
  );
}
