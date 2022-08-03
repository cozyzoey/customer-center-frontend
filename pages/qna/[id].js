import { useContext, useState } from "react";
import { useRouter } from "next/router";
import qs from "qs";
import { getCookie } from "cookies-next";
import useSWR, { useSWRConfig } from "swr";

import moment from "moment";
import dynamic from "next/dynamic";
import parse from "html-react-parser";
import { toast } from "react-toastify";
import { GrTrash, GrEdit, GrUser } from "react-icons/gr";

import Layout from "@/components/layout";
import Button from "@/components/button";
import Loader from "@/components/loader";
const Editor = dynamic(() => import("@/components/editor"), {
  ssr: false,
  suspense: true,
});
import { API_URL } from "@/static/config";
import AuthContext from "@/context/AuthContext";

import styles from "@/styles/shared/contents-detail.module.scss";

export default function QnADetail({ item, id }) {
  const router = useRouter();
  const { user } = useContext(AuthContext);
  const [isAddingAnswer, setIsAddingAnswer] = useState(false); // 댓글 신규 작성 여부
  const [editingAnswerId, setEditingAnswerId] = useState(null); // 수정중인 댓글 id
  const [answerContents, setAnswerContents] = useState(""); // 신규 작성 or 수정중인 댓글 컨텐츠

  /*
   * 질문 수정
   */
  const handleEditQuestion = async () => {
    router.push(`/qna/edit/${id}`);
  };

  /*
   * 질문 삭제
   */
  const handleDeleteQuestion = async () => {
    const result = confirm("글을 삭제하시겠습니까?");
    if (!result) return;

    try {
      const res = await fetch(`${API_URL}/api/questions/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getCookie("token")}`,
        },
      });

      const { error } = await res.json();

      if (error) throw error;

      toast.success("글을 삭제했습니다.");
      router.replace("/qna");
    } catch (error) {
      toast.error(error.message);
    }
  };

  /*
   * 댓글 작성/수정/삭제후 현재 페이지 업데이트
   */
  const refreshData = () => {
    router.replace(router.asPath);
  };

  /*
   * 댓글 작성
   */
  const handleAddAnsewr = async () => {
    const result = confirm("댓글을 등록할까요?");
    if (!result) return;

    try {
      const res = await fetch(`${API_URL}/api/answers`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getCookie("token")}`,
        },
        body: JSON.stringify({
          data: {
            contents: answerContents,
            question: id,
            user: user.id,
            userId: user.id,
            username: user.username,
          },
        }),
      });

      const { error } = await res.json();

      if (error) throw error;

      refreshData();

      toast.success("댓글을 성공적으로 등록했습니다");

      // 클린업
      setIsAddingAnswer(false);
      setAnswerContents("");
    } catch (error) {
      toast.error(error.message);
    }
  };

  /*
   * 댓글 수정
   */
  const handleEditAnswer = async (answerId) => {
    const result = confirm("댓글을 수정하시겠습니까?");
    if (!result) return;

    try {
      const res = await fetch(`${API_URL}/api/answers/${answerId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getCookie("token")}`,
        },
        body: JSON.stringify({ data: { contents: answerContents } }),
      });

      const { error } = await res.json();

      if (error) throw error;

      refreshData();

      toast.success("댓글을 수정했습니다.");

      // 클린업
      setEditingAnswerId(null);
      setAnswerContents("");
    } catch (error) {
      toast.error(error.message);
    }
  };

  /*
   * 댓글 삭제
   */
  const handleDeleteAnswer = async (answerId) => {
    const result = confirm("댓글을 삭제하시겠습니까?");
    if (!result) return;

    try {
      const res = await fetch(`${API_URL}/api/answers/${answerId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getCookie("token")}`,
        },
      });

      const { error } = await res.json();

      if (error) throw error;

      refreshData();

      toast.success("댓글을 삭제했습니다.");
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <Layout title="QnA">
      {router.isFallback ? (
        <Loader />
      ) : (
        <>
          <h1 className={styles.title}>{item.title}</h1>
          <div className={styles.info}>
            <span>{item.user.data?.attributes.username}</span>
            <time>{moment(item.createdAt).format("YYYY. MM. DD")}</time>
          </div>
          <div className={styles.divider}>
            {user && item.user.data?.id === user?.id && (
              <div className={styles.controls}>
                <GrEdit
                  size="3ch"
                  onClick={handleEditQuestion}
                  title="수정하기"
                />
                <GrTrash
                  size="3ch"
                  onClick={handleDeleteQuestion}
                  title="삭제하기"
                />
              </div>
            )}
            <hr />
          </div>
          <div className={styles.contents}>{parse(item.contents)}</div>
          {/* 액션 버튼 */}
          {!isAddingAnswer && (
            <Button
              onClick={() => {
                if (!user || !hasCookie("token")) {
                  return alert("로그인 후 이용할 수 있어요");
                }
                setAnswerContents("");
                setEditingAnswerId(null);
                setIsAddingAnswer(true);
              }}
              align="right"
            >
              댓글쓰기
            </Button>
          )}
          {/* 신규 댓글 작성 */}
          {isAddingAnswer && (
            <div className={styles.answerEditorWrapper}>
              <Editor
                value={answerContents}
                onChange={(newValue) => setAnswerContents(newValue)}
                size="sm"
              />
              <div className={styles.answerControlBtns}>
                <Button
                  onClick={() => {
                    const result = confirm("댓글 작성을 취소할까요?");
                    if (result) {
                      setIsAddingAnswer(false);
                      setAnswerContents("");
                    }
                  }}
                  variant="light"
                >
                  취소
                </Button>
                <Button
                  onClick={handleAddAnsewr}
                  disabled={answerContents.length < 10}
                >
                  등록
                </Button>
              </div>
            </div>
          )}
          {/* 댓글 리스트 렌더링 */}
          <div className={styles.anserItems}>
            {item.answers.data.length > 0 &&
              item.answers.data
                .sort((a, b) => a.id - b.id)
                .map((el) => (
                  <div className={styles.answerItem} key={el.id}>
                    <div className={styles.answerItemHeader}>
                      <div>
                        <GrUser />
                        <span>{el.attributes.username}</span>
                      </div>
                      <time>
                        {moment(item.createdAt).format("YYYY. MM. DD")}
                      </time>
                      {user && el.attributes.userId === user?.id && (
                        <div className={styles.anserItemControls}>
                          <GrEdit
                            onClick={() => {
                              // 댓글 수정 에디터 활성화
                              setIsAddingAnswer(false);
                              setAnswerContents(el.attributes.contents);
                              setEditingAnswerId(el.id);
                            }}
                            size="20px"
                          />
                          <GrTrash
                            onClick={() => handleDeleteAnswer(el.id)}
                            size="20px"
                          />
                        </div>
                      )}
                    </div>
                    {editingAnswerId === el.id ? (
                      <div className={styles.answerEditorWrapper}>
                        <Editor
                          value={answerContents}
                          onChange={(newValue) => setAnswerContents(newValue)}
                          size="sm"
                        />
                        <div className={styles.answerControlBtns}>
                          <Button
                            onClick={() => {
                              const result = confirm("댓글 수정을 취소할까요?");
                              if (result) {
                                setEditingAnswerId(null);
                                setAnswerContents("");
                              }
                            }}
                            variant="light"
                          >
                            취소
                          </Button>
                          <Button
                            onClick={() => handleEditAnswer(el.id)}
                            disabled={answerContents.length < 10}
                          >
                            수정
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className={styles.answerItemContents}>
                        {parse(el.attributes.contents)}
                      </div>
                    )}
                  </div>
                ))}
          </div>
        </>
      )}
    </Layout>
  );
}

export async function getStaticPaths() {
  const res = await fetch(`${API_URL}/api/questions`);
  const { data } = await res.json();

  const paths = data.map((el) => ({ params: { id: String(el.id) } }));

  return {
    paths,
    fallback: true,
  };
}

export async function getStaticProps({ params: { id } }) {
  const query = qs.stringify({
    filters: {
      id: {
        $eq: id,
      },
    },
    populate: "*",
  });
  const res = await fetch(`${API_URL}/api/questions?${query}`);
  const { data } = await res.json();
  return {
    props: { item: data[0].attributes, id },
    revalidate: 60,
  };
}
