import { useState, useRef, useEffect, useContext } from "react";
import dynamic from "next/dynamic";
import Head from "next/head";
import { useRouter } from "next/router";
import { getCookie, hasCookie } from "cookies-next";
import { toast } from "react-toastify";
import Layout from "@/components/layout";
import Button from "@/components/button";
const Editor = dynamic(() => import("@/components/editor"), {
  ssr: false,
});
import { API_URL } from "@/constants/config";
import AuthContext from "@/context/AuthContext";

import styles from "@/styles/shared/qna-editor.module.scss";

export default function add() {
  const router = useRouter();
  const titleInputRef = useRef(null);
  const [title, setTitle] = useState("");
  const [contents, setContents] = useState("");
  const { user } = useContext(AuthContext);

  useEffect(() => {
    titleInputRef.current.focus();
  }, []);

  const handleSubmit = async () => {
    if (!user || !hasCookie("token")) return;

    const result = confirm("등록하시겠습니까?");
    if (!result) return;

    try {
      const res = await fetch(`${API_URL}/api/questions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getCookie("token")}`,
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
    <Layout>
      <Head>
        <title>질문하기</title>
      </Head>
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
      <Editor
        value={contents}
        onChange={(value) => setContents(value)}
        size="lg"
      />
      <Button
        onClick={handleSubmit}
        align="right"
        disabled={!title || !contents}
      >
        등록하기
      </Button>
    </Layout>
  );
}
