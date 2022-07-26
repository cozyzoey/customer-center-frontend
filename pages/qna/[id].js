import { useContext, useState } from "react";
import { useRouter } from "next/router";
import qs from "qs";
import moment from "moment";
import dynamic from "next/dynamic";
import parse from "html-react-parser";
import { toast } from "react-toastify";
import { GrTrash, GrEdit } from "react-icons/gr";
import Avatar from "boring-avatars";
import Layout from "@/components/Layout";
import Button from "@/components/Button";
const EditorSimple = dynamic(() => import("@/components/EditorSimple"), {
  ssr: false,
});
import { API_URL } from "@/static/config";
import { parseCookies } from "@/helpers/index";
import AuthContext from "@/context/AuthContext";

import styles from "@/styles/shared/ContentsDetail.module.scss";

// TODO 댓글 작성 누르면 에디터가 안나타남
export default function QnADetail({ item, id, token }) {
  const router = useRouter();
  const { user } = useContext(AuthContext);
  const [isAnswerEditorOpen, setisAnswerEditorOpen] = useState(false);
  const [answerContents, setAnswerContents] = useState("");
  const [loading, setLoading] = useState({});

  const handleEditQuestion = async () => {};

  const handleDeleteQuestion = async () => {
    const result = confirm("글을 삭제하시겠습니까?");
    if (!result) return;

    try {
      const res = await fetch(`${API_URL}/api/questions/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
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

  const handleAddAnsewr = async () => {
    //TODO 글을 등록후 자동으로 업데이트가 안됨

    try {
      const res = await fetch(`${API_URL}/api/answers`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
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

      const { data, error } = await res.json();

      if (error) throw error;

      toast.success("댓글을 성공적으로 등록했습니다");

      //성공후
      setisAnswerEditorOpen(false);
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <Layout title="QnA">
      <h1 className={styles.title}>{item.title}</h1>
      <div className={styles.info}>
        <span>{item.user.data.attributes.username}</span>
        <time>{moment(item.createdAt).format("YYYY. MM. DD")}</time>
      </div>
      <div className={styles.divider}>
        {item.user.data.id === user?.id && (
          <div className={styles.controls}>
            <GrEdit size="4ch" onClick={handleEditQuestion} title="수정하기" />
            <GrTrash
              size="4ch"
              onClick={handleDeleteQuestion}
              title="삭제하기"
            />
          </div>
        )}
        <hr />
      </div>
      <div className={styles.contents}>{parse(item.contents)}</div>
      {!isAnswerEditorOpen && (
        <Button
          onClick={() => {
            if (!user || !token) {
              return alert("로그인 이후 이용할 수 있어요");
            }
            setisAnswerEditorOpen(true);
          }}
          align="left"
        >
          댓글쓰기
        </Button>
      )}
      {isAnswerEditorOpen && (
        <div className={styles.answerEditorWrapper}>
          <EditorSimple
            value={answerContents}
            onChange={(newValue) => setAnswerContents(newValue)}
          />
          <div className={styles.answerControlBtns}>
            <Button
              onClick={() => {
                const result = confirm("댓글 작성을 취소할까요?");
                if (result) {
                  setisAnswerEditorOpen(false);
                  setAnswerContents("");
                }
              }}
              variant="light"
            >
              취소
            </Button>
            <Button
              onClick={() => {
                const result = confirm("댓글을 등록하시겠습니까?");
                result && handleAddAnsewr();
              }}
              disabled={answerContents.length < 10}
            >
              등록
            </Button>
          </div>
        </div>
      )}
      {item.answers.data.length > 0 &&
        item.answers.data
          .sort((a, b) => a.id - b.id)
          .map((el) => (
            <div className={styles.answerItem} key={el.id}>
              <div className={styles.answerItemIdenticion}>
                <Avatar name={el.attributes.usernmae} size={30} square={true} />
              </div>
              <div className={styles.answerItemHeader}>
                <div>
                  <span>{el.attributes.username}</span>
                  <time>{moment(item.createdAt).format("YYYY. MM. DD")}</time>
                </div>
                {el.attributes.userId === user?.id && (
                  <div>
                    <GrEdit size="20px" />
                    <GrTrash size="20px" />
                  </div>
                )}
              </div>
              <div className={styles.answerItemContents}>
                {parse(el.attributes.contents)}
              </div>
            </div>
          ))}
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
    populate: "*",
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
