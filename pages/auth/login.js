import { useContext, useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Link from "next/link";
import Layout from "@/components/Layout";
import AuthContext from "@/context/AuthContext";
import { toast } from "react-toastify";
import Button from "@/components/Button";
import styles from "@/styles/shared/Auth.module.scss";

export default function login() {
  const { login, error } = useContext(AuthContext);

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
    error && toast.error(error);
  }, [error]);

  const handleSubmit = async (values) => {
    const { email, password } = values;
    login({ email, password });
  };

  const MyInput = ({ field, form, ...props }) => {
    return (
      <input
        {...field}
        {...props}
        className={
          form.touched?.[field.name] &&
          form.errors?.[field.name] &&
          styles.errorInput
        }
      />
    );
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
            <h1>로그인하기</h1>
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

            <Button type="submit" fullWidth={true} variant="outlined">
              로그인
            </Button>
            <Link href="/auth/register">
              <a>아직 회원이 아니신가요?</a>
            </Link>
            {/* <Link href="">
              <a>비밀번호를 잊어버리셨나요?</a>
            </Link> */}
          </Form>
        </Formik>
      </div>
    </Layout>
  );
}
