import { useContext, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Layout from "@/components/layout";
import AuthContext from "@/context/AuthContext";
import { toast } from "react-toastify";
import Button from "@/components/button";
import MyInput from "@/components/my-input";
import { API_URL } from "@/constants/config";
import styles from "@/styles/shared/auth.module.scss";

export default function consent() {
  const { user, token } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);

  const initialValues = {
    name: "",
    schoolName: "",
    gender: "",
    phoneNumber: "",
    email: user?.email || "",
    parentName: "",
    parentEmail: "",
  };

  const validationSchema = Yup.object({
    name: Yup.string()
      .matches(/^[가-힣]{2,4}$/, "2~4자로 실명을 입력해주세요")
      .required("필수 입력 항목입니다"),
    schoolName: Yup.string().required("필수 입력 항목입니다"),
    gender: Yup.mixed()
      .oneOf(["male", "female"])
      .required("필수 입력 항목입니다"),
    phoneNumber: Yup.string()
      .matches(
        /^01([0|1|6|7|8|9])-?([0-9]{3,4})-?([0-9]{4})$/,
        "예시 010-0000-0000"
      )
      .required("필수 입력 항목입니다"),
    email: Yup.string()
      .email("이메일 형식을 확인해주세요")
      .required("필수 입력 항목입니다"),
    parentName: Yup.string()
      .matches(/^[가-힣]{2,4}$/, "2~4자로 실명을 입력해주세요")
      .required("필수 입력 항목입니다"),
    parentEmail: Yup.string()
      .email("이메일 형식을 확인해주세요")
      .required("필수 입력 항목입니다"),
  });

  const handleSubmit = async (values) => {
    if (!user || !token) return;

    try {
      const res = await fetch(`${API_URL}/api/privacy-consent-forms`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ data: { ...values, user: user.id } }),
      });

      const { data, error } = await res.json();

      if (error) throw error;

      toast.success("등록에 성공했습니다");
      // router.replace("/qna");
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <Layout title="동의서 신청하기">
      <div className={styles.container}>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          <Form className={styles.form}>
            <h1>동의서 작성하기</h1>
            <Field
              name="name"
              type="text"
              placeholder="이름을 입력하세요(실명)"
              component={MyInput}
            />
            <ErrorMessage component="label" name="name" />

            <Field
              name="schoolName"
              type="text"
              placeholder="소속 학교를 입력하세요"
              component={MyInput}
            />
            <ErrorMessage component="label" name="schoolName" />

            <Field
              name="phoneNumber"
              type="tel"
              placeholder="핸드폰 번호를 입력하세요"
              component={MyInput}
            />
            <ErrorMessage component="label" name="phoneNumber" />

            <Field
              name="email"
              type="email"
              placeholder="이메일을 입력하세요"
              component={MyInput}
            />
            <ErrorMessage component="label" name="email" />

            <section>
              <label>
                <Field type="radio" name="gender" value="male" />
                남자
              </label>
              <label>
                <Field type="radio" name="gender" value="female" />
                여자
              </label>
            </section>
            <ErrorMessage component="label" name="gender" />

            <Field
              name="parentName"
              type="text"
              placeholder="학부모님 성함을 입력하세요(실명)"
              component={MyInput}
            />
            <ErrorMessage component="label" name="parentName" />

            <Field
              name="parentEmail"
              type="email"
              placeholder="학부모님 이메일을 입력하세요"
              component={MyInput}
            />
            <ErrorMessage component="label" name="parentEmail" />

            <Button
              type="submit"
              fullWidth={true}
              variant="outlined"
              loading={loading}
            >
              동의서 신청하기
            </Button>
          </Form>
        </Formik>
      </div>
    </Layout>
  );
}
