import { useState, useRef, useEffect } from "react";
import dynamic from "next/dynamic";
import Head from "next/head";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import Button from "@/components/Button";
const Editor = dynamic(() => import("@/components/Editor"), {
  ssr: false,
});
import { NEXT_URL } from "@/static/config";
import styles from "@/styles/shared/QnAEditor.module.scss";

export default function add() {
  const router = useRouter();
  const titleInputRef = useRef(null);
  const toolBarRef = useRef(null);
  const [title, setTitle] = useState("");
  const [contents, setContents] = useState("");

  useEffect(() => {
    titleInputRef.current.focus();
  }, []);

  const handleSubmit = async () => {
    try {
      const res = await fetch(`${NEXT_URL}/api/question/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ data: { title, contents } }),
      });

      const { data, error } = await res.json();

      if (error) throw error;

      toast.success("등록에 성공했습니다");
      router.replace("/qna");
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>질문하기</title>
      </Head>
      <div ref={toolBarRef} className={styles.editorToolbar} />
      <input
        type="text"
        required
        placeholder="제목을 입력하세요"
        tabIndex={0}
        autoComplete="off"
        autoFocus={true}
        ref={titleInputRef}
        name="title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className={styles.title}
      />
      <div className={styles.contentsAreaWrapper}>
        <Editor
          toolBarRef={toolBarRef}
          value={contents}
          onChange={(value) => setContents(value)}
          className={styles.contentsArea}
        />
      </div>
      <Button
        onClick={handleSubmit}
        align="right"
        disabled={!title || !contents}
      >
        등록하기
      </Button>
    </div>
  );
}
