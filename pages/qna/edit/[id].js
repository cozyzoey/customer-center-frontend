import { useState, useRef, useEffect, useContext } from "react";
import qs from "qs";
import useSWR from "swr";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import Layout from "@/components/layout";
import PageTitle from "@/components/page-title";
import Button from "@/components/button";
const Editor = dynamic(() => import("@/components/editor"), {
  ssr: false,
});
import { API_URL } from "@/constants/config";
import AuthContext from "@/context/AuthContext";
import styles from "@/styles/shared/qna-editor.module.scss";

export default function EditQuestion() {
  const router = useRouter();
  const titleInputRef = useRef(null);
  const [title, setTitle] = useState("");
  const [contents, setContents] = useState("");
  const query = qs.stringify({
    filters: {
      id: {
        $eq: router.query.id,
      },
    },
  });
  const { token } = useContext(AuthContext);
  const { data } = useSWR(`${API_URL}/api/questions?${query}`);

  // 페치한 데이터로 상태 업데이트 (useSWR의 onSuccess 옵션이 동작하지 않아서 useEffect로 처리)
  useEffect(() => {
    if (data) {
      setTitle(data.data[0].attributes.title);
      setContents(data.data[0].attributes.contents);
    }
  }, [data]);

  useEffect(() => {
    titleInputRef.current.focus();
  }, []);

  const handleSubmit = async () => {
    if (!token) {
      router.replace(`/auth/login`);
    }

    const result = confirm("수정한 내용을 등록할까요?");
    if (!result) return;

    try {
      const res = await fetch(`${API_URL}/api/questions/${data.data[0].id}`, {
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
      router.replace(`/qna/${data.data[0].id}`);
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <Layout title="질문 수정">
      <div>
        <PageTitle title="질문 수정하기" />
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
      </div>
    </Layout>
  );
}
