import { useContext, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useRouter } from "next/router";
import { GrFormSearch } from "react-icons/gr";

import * as Yup from "yup";
import Link from "next/link";
import Layout from "@/components/layout";
import Button from "@/components/button";
import MyInput from "@/components/my-input";
import Logo from "@/components/responsive-logo-img";
import AuthContext from "@/context/AuthContext";
import { toast } from "react-toastify";
import styles from "@/styles/shared/auth.module.scss";

export default function login() {
  const router = useRouter();
  const { login, error, resetError, loading } = useContext(AuthContext);

  const initialValues = {
    email: "",
    password: "",
  };

  const validationSchema = Yup.object({
    email: Yup.string()
      .email("이메일 형식을 확인해주세요")
      .required("필수 입력 항목입니다"),
    password: Yup.string()
      .min(6, "6자 이상 입력해주세요")
      .max(15, "15자 미만으로 입력해주세요")
      .required("필수 입력 항목입니다"),
  });

  useEffect(() => {
    error && toast.error(error, { onOpen: resetError });
  }, [error]);

  const handleSubmit = async (values) => {
    const { email, password } = values;
    login({ email, password });
  };

  return (
    <Layout title="로그인/회원가입">
      <div className={styles.login}>
        <div className={styles.loginBackground}>
          <div className={styles.logo}>
            <Logo />
          </div>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            <Form className={styles.form}>
              <label htmlFor="email">이메일</label>
              <div className={styles.field}>
                <Field
                  name="email"
                  type="email"
                  placeholder="이메일을 입력하세요"
                  component={MyInput}
                />
                <ErrorMessage component="label" name="email" />
              </div>
              <label htmlFor="password">비밀번호</label>
              <div className={styles.field}>
                <Field
                  name="password"
                  type="password"
                  placeholder="비밀번호를 입력하세요"
                  component={MyInput}
                />
                <ErrorMessage component="label" name="password" />
              </div>
              <div className={styles.button}>
                <Button type="submit" loading={loading}>
                  로그인
                </Button>
              </div>
            </Form>
          </Formik>
          <Button
            onClick={() => router.replace("/auth/forgot-password")}
            size="lg"
            variant="gray"
            type="button"
          >
            <GrFormSearch size="3ch" />
            비밀번호 찾기
          </Button>
        </div>
      </div>
    </Layout>
  );
}
