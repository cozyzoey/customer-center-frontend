import { useState, useRef, useEffect, useContext } from "react";
import qs from "qs";
import dynamic from "next/dynamic";
import Head from "next/head";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import Layout from "@/components/layout";
import Button from "@/components/button";
const Editor = dynamic(() => import("@/components/editor"), {
  ssr: false,
});
import { API_URL } from "@/static/config";
import { parseCookies } from "@/helpers/index";
import styles from "@/styles/shared/qna-editor.module.scss";

export default function EditQuestion({ item, id, token }) {
  const router = useRouter();
  const titleInputRef = useRef(null);
  const [title, setTitle] = useState(item.title);
  const [contents, setContents] = useState(item.contents);

  useEffect(() => {
    titleInputRef.current.focus();
  }, []);

  const handleSubmit = async () => {
    const result = confirm("수정한 내용을 등록할까요?");
    if (!result) return;

    try {
      const res = await fetch(`${API_URL}/api/questions/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ data: { title, contents } }),
      });

      const { error } = await res.json();

      if (error) throw error;

      toast.success("수정에 성공했습니다");
      router.replace(`/qna/${id}`);
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <Layout>
      <Head>
        <title>질문 수정</title>
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

export async function getServerSideProps({ params: { id }, req }) {
  const { token } = parseCookies(req);

  const query = qs.stringify({
    filters: {
      id: {
        $eq: id,
      },
    },
  });
  const res = await fetch(`${API_URL}/api/questions?${query}`);
  const { data } = await res.json();

  return {
    props: {
      item: data[0].attributes,
      id: data[0].id,
      ...(token && { token }),
    },
  };
}
