import { useContext, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import Link from "next/link";
import * as Yup from "yup";
import Layout from "@/components/layout";
import Button from "@/components/button";
import MyInput from "@/components/my-input";
import AuthContext from "@/context/AuthContext";
import { toast } from "react-toastify";
import styles from "@/styles/shared/auth.module.scss";

export default function register() {
  const { register, error, resetError, loading } = useContext(AuthContext);

  useEffect(() => {
    error && toast.error(error, { onOpen: resetError });
  }, [error]);

  const initialValues = {
    email: "",
    password: "",
    passwordConfirm: "",
    username: "",
    agreement: false,
  };

  const validationSchema = Yup.object({
    email: Yup.string()
      .email("이메일 형식을 확인해주세요")
      .required("필수 입력 항목입니다"),
    password: Yup.string()
      .min(6, "6자 이상 입력해주세요")
      .max(30, "30자 미만으로 입력해주세요")
      .required("필수 입력 항목입니다"),
    passwordConfirm: Yup.string()
      .required("필수 입력 항목입니다")
      .oneOf([Yup.ref("password"), null], "비밀번호가 다릅니다"),
    username: Yup.string()
      .min(3, "3자 이상 입력해주세요")
      .max(15, "15자 미만으로 입력해주세요")
      .required("필수 입력 항목입니다"),
    agreement: Yup.boolean()
      .required("동의에 체크해 주세요")
      .oneOf([true], "동의에 체크해 주세요"),
  });

  const handleSubmit = (values) => {
    const { email, password, username } = values;
    register({ email, password, username });
  };

  return (
    <Layout title="로그인/회원가입">
      <div className={styles.container}>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          <Form className={styles.form} autoComplete="new-password">
            <h1>회원가입하기</h1>
            <Field
              name="email"
              type="email"
              placeholder="이메일을 입력하세요"
              component={MyInput}
            />
            <ErrorMessage component="label" name="email" />
            <Field
              name="password"
              type="password"
              placeholder="비밀번호를 입력하세요"
              component={MyInput}
            />
            <ErrorMessage component="label" name="password" />
            <Field
              name="passwordConfirm"
              type="password"
              placeholder="비밀번호를 확인해주세요"
              component={MyInput}
            />
            <ErrorMessage component="label" name="passwordConfirm" />
            <Field
              name="username"
              type="text"
              placeholder="이름을 입력하세요"
              component={MyInput}
            />
            <ErrorMessage component="label" name="username" />
            <p className={styles.agreement}>
              <Field name="agreement" type="checkbox" /> 웹사이트{" "}
              <Link href="/policy/terms">
                <a target="_blank">이용약관</a>
              </Link>
              과{" "}
              <Link href="/policy/privacy">
                <a target="_blank">개인정보처리방침</a>
              </Link>
              을 확인했으며 이에 동의합니다.
            </p>
            <ErrorMessage component="label" name="agreement" />
            <Button
              type="submit"
              fullWidth={true}
              variant="outlined"
              loading={loading}
            >
              가입하기
            </Button>
          </Form>
        </Formik>
      </div>
    </Layout>
  );
}
