import { CKEditor } from '@ckeditor/ckeditor5-react'
import DecoupledEditor from '@ckeditor/ckeditor5-build-decoupled-document'
import '@ckeditor/ckeditor5-build-decoupled-document/build/translations/ko'

export default function Editor({ value, onChange, toolBarRef }) {
  const toolbarConfig = {
    items: [
      'heading',
      'fontColor',
      'fontBackgroundColor',
      '|',
      'bold',
      'italic',
      'strikethrough',
      'underline',
      '|',
      'outdent',
      'indent',
      '|',
      'bulletedList',
      'numberedList',
      '|',
      'uploadImage',
      'insertTable',
      'link',
      '|',
      'blockQuote',
    ],
    shouldNotGroupWhenFull: true, // overflow시 줄바꿈 처라됨
  }

  return (
    <div>
      <CKEditor
        editor={DecoupledEditor}
        data={value}
        onReady={(editor) => {
          if (toolBarRef.current) {
            toolBarRef.current.appendChild(editor.ui.view.toolbar.element)
          }
        }}
        onError={(error, { willEditorRestart }) => {
          if (willEditorRestart) {
            toolBarRef.current.ui.view.toolbar.element.remove()
          }
        }}
        onChange={(event, editor) => {
          onChange && onChange(editor.getData())
        }}
        config={{
          toolbar: toolbarConfig,
          language: 'ko',
        }}
      />
    </div>
  )
}
