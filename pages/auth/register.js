import { useContext, useEffect } from "react";
import { useRouter } from "next/router";
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
  const router = useRouter();
  const { register, error, resetError, loading } = useContext(AuthContext);

  useEffect(() => {
    error && toast.error(error, { onOpen: resetError });
  }, [error]);

  const initialValues = {
    username: "",
    email: "",
    password: "",
    passwordConfirm: "",
    agreement: false,
  };

  const validationSchema = Yup.object({
    username: Yup.string()
      .min(2, "2자 이상 입력해주세요")
      .max(15, "15자 미만으로 입력해주세요")
      .required("필수 입력 항목입니다"),
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
    agreement: Yup.boolean()
      .required("동의에 체크해 주세요")
      .oneOf([true], "동의에 체크해 주세요"),
  });

  const handleSubmit = async (values) => {
    const { username, email, password } = values;
    const registerSuccess = await register({
      username: username.trim(),
      email,
      password,
    });

    if (registerSuccess) {
      router.replace(`/auth/after-register?email=${email}`);
    }
  };

  return (
    <Layout title="로그인/회원가입">
      <div className={styles.container}>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          <Form className={styles.form}>
            <h1>회원가입하기</h1>

            <Field
              name="username"
              type="text"
              placeholder="닉네임"
              component={MyInput}
            />
            <ErrorMessage component="label" name="username" />
            <Field
              name="email"
              type="email"
              placeholder="이메일(정확히 입력)"
              component={MyInput}
            />
            <ErrorMessage component="label" name="email" />
            <Field
              name="password"
              type="password"
              placeholder="비밀번호"
              component={MyInput}
              autoComplete="new-password"
            />
            <ErrorMessage component="label" name="password" />
            <Field
              name="passwordConfirm"
              type="password"
              placeholder="비밀번호 확인"
              component={MyInput}
            />
            <ErrorMessage component="label" name="passwordConfirm" />

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
