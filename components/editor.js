import { useEffect, useState, useRef, useContext } from "react";
import classNames from "classnames";
import { API_URL } from "@/constants/config";
import Loader from "@/components/loader";
import AuthContext from "@/context/AuthContext";
import styles from "@/styles/editor.module.scss";

export default function Editor({ value, onChange, size = "lg" }) {
  const editorRef = useRef();
  const { CKEditor, Editor } = editorRef.current || {};
  const [editorLoaded, setEditorLoaded] = useState(false);
  const [isEditorReady, setIsEditorReady] = useState(false);
  const { token } = useContext(AuthContext);

  const editorClass = classNames(styles[size], {
    [styles.loading]: !isEditorReady,
  });

  useEffect(() => {
    editorRef.current = {
      CKEditor: require("@ckeditor/ckeditor5-react").CKEditor, // v3+
      Editor: require("ckeditor5-custom-build/build/ckeditor"),
    };
    setEditorLoaded(true);
  }, []);

  class MyUploadAdapter {
    constructor(loader, options) {
      // The file loader instance to use during the upload.
      this.loader = loader;
      this.options = options;
    }

    // Starts the upload process.
    upload() {
      return this.loader.file.then(
        (file) =>
          new Promise((resolve, reject) => {
            this._initRequest();
            this._initListeners(resolve, reject, file);
            this._sendRequest(file);
          })
      );
    }

    // Aborts the upload process.
    abort() {
      if (this.xhr) {
        this.xhr.abort();
      }
    }

    // Initializes the XMLHttpRequest object using the URL passed to the constructor.
    _initRequest() {
      const xhr = (this.xhr = new XMLHttpRequest());

      // Note that your request may look different. It is up to you and your editor
      // integration to choose the right communication channel. This example uses
      // a POST request with JSON as a data structure but your configuration
      // could be different.
      xhr.open("POST", this.options.uploadUrl, true);
      xhr.responseType = "json";
    }

    // Initializes XMLHttpRequest listeners.
    _initListeners(resolve, reject, file) {
      const xhr = this.xhr;
      const loader = this.loader;
      const genericErrorText = `Couldn't upload file: ${file.name}.`;

      xhr.addEventListener("error", () => reject(genericErrorText));
      xhr.addEventListener("abort", () => reject());
      xhr.addEventListener("load", () => {
        const response = xhr.response;

        // This example assumes the XHR server's "response" object will come with
        // an "error" which has its own "message" that can be passed to reject()
        // in the upload promise.
        //
        // Your integration may handle upload errors in a different way so make sure
        // it is done properly. The reject() function must be called when the upload fails.
        if (!response || response.error) {
          return reject(
            response && response.error
              ? response.error.message
              : genericErrorText
          );
        }

        // If the upload is successful, resolve the upload promise with an object containing
        // at least the "default" URL, pointing to the image on the server.
        // This URL will be used to display the image in the content. Learn more in the
        // UploadAdapter#upload documentation.
        resolve({
          default: response?.[0].url,
        });
      });

      // Upload progress when it is supported. The file loader has the #uploadTotal and #uploaded
      // properties which are used e.g. to display the upload progress bar in the editor
      // user interface.
      if (xhr.upload) {
        xhr.upload.addEventListener("progress", (evt) => {
          if (evt.lengthComputable) {
            loader.uploadTotal = evt.total;
            loader.uploaded = evt.loaded;
          }
        });
      }
    }

    // Prepares the data and sends the request.
    _sendRequest(file) {
      // Set headers if specified.
      const headers = this.options.headers || {};

      for (const headerName of Object.keys(headers)) {
        this.xhr.setRequestHeader(headerName, headers[headerName]);
      }

      // Prepare the form data.
      const data = new FormData();

      data.append("files", file);

      // Important note: This is the right place to implement security mechanisms
      // like authentication and CSRF protection. For instance, you can use
      // XMLHttpRequest.setRequestHeader() to set the request headers containing
      // the CSRF token generated earlier by your application.

      // Send the request.
      this.xhr.send(data);
    }
  }

  function MyCustomUploadAdapterPlugin(editor) {
    editor.plugins.get("FileRepository").createUploadAdapter = (loader) => {
      // Configure the URL to the upload script in your back-end here!
      const options = editor.config.get("customUpload");
      return new MyUploadAdapter(loader, options);
    };
  }

  return (
    <div className={editorClass}>
      {!isEditorReady && <Loader />}
      {editorLoaded && (
        <CKEditor
          editor={Editor}
          data={value}
          onChange={(event, editor) => {
            onChange && onChange(editor.getData());
          }}
          onReady={() => setIsEditorReady(true)}
          config={{
            placeholder: "내용을 작성하세요",
            customUpload: {
              uploadUrl: `${API_URL}/api/upload`,
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
            extraPlugins: [MyCustomUploadAdapterPlugin],
          }}
        />
      )}
    </div>
  );
}
