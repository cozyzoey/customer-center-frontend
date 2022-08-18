import { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useRouter } from "next/router";
import * as Yup from "yup";
import { toast } from "react-toastify";
import Layout from "@/components/layout";
import Button from "@/components/button";
import MyInput from "@/components/my-input";
import { API_URL } from "@/constants/config";
import styles from "@/styles/shared/auth.module.scss";

export default function ResetPassword() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const initialValues = {
    password: "",
    passwordConfirmation: "",
  };

  const validationSchema = Yup.object({
    password: Yup.string()
      .min(6, "6자 이상 입력해주세요")
      .max(15, "15자 미만으로 입력해주세요")
      .required("필수 입력 항목입니다"),
    passwordConfirmation: Yup.string()
      .required("필수 입력 항목입니다")
      .oneOf([Yup.ref("password"), null], "비밀번호가 다릅니다"),
  });

  const handleSubmit = async (values) => {
    setLoading(true);
    const { password, passwordConfirmation } = values;

    const res = await fetch(`${API_URL}/api/auth/reset-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        code: router.query?.code || "",
        password,
        passwordConfirmation,
      }),
    });

    const { error } = await res.json();

    setLoading(false);

    if (error) {
      toast.error(
        error.message === "Incorrect code provided"
          ? "접속하신 링크가 잘못되었거나 사용 기한이 지났습니다."
          : error.message
      );
      return;
    }

    router.replace("/auth/login");
    toast.success("비밀번호 재설정을 마쳤습니다. 다시 로그인해주세요.");
  };

  return (
    <Layout title="비밀번호 재설정">
      <div className={styles.container}>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          <Form className={styles.form}>
            <p className={styles.guideMessage}>
              새로운 비밀번호를 입력해주세요.
              <br />
              비밀번호를 재설정 할게요.
            </p>
            <Field
              name="password"
              type="password"
              placeholder="새로운 비밀번호를 입력하세요"
              component={MyInput}
            />
            <ErrorMessage component="label" name="password" />
            <Field
              name="passwordConfirmation"
              type="password"
              placeholder="비밀번호를 확인해주세요"
              component={MyInput}
            />
            <ErrorMessage component="label" name="passwordConfirmation" />

            <Button type="submit" fullWidth={true} loading={loading}>
              비밀번호 재설정
            </Button>
          </Form>
        </Formik>
      </div>
    </Layout>
  );
}
