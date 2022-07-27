import { useState, useRef, useEffect, useContext } from "react";
import dynamic from "next/dynamic";
import Head from "next/head";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import Button from "@/components/button";
const Editor = dynamic(() => import("@/components/editor"), {
  ssr: false,
});
import { API_URL } from "@/static/config";
import { parseCookies } from "@/helpers/index";
import AuthContext from "@/context/AuthContext";

import styles from "@/styles/shared/qna-editor.module.scss";

export default function add({ token }) {
  const router = useRouter();
  const titleInputRef = useRef(null);
  const toolBarRef = useRef(null);
  const [title, setTitle] = useState("");
  const [contents, setContents] = useState("");
  const { user } = useContext(AuthContext);

  useEffect(() => {
    titleInputRef.current.focus();
  }, []);

  const handleSubmit = async () => {
    try {
      const res = await fetch(`${API_URL}/api/questions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ data: { title, contents, user: user.id } }),
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

export async function getServerSideProps({ req }) {
  const { token } = parseCookies(req);
  return {
    props: {
      token,
    },
  };
}
