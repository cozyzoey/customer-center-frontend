import { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import qs from "qs";
import { toast } from "react-toastify";
import Layout from "@/components/layout";
import Button from "@/components/button";
import { API_URL } from "@/constants/config";
import styles from "@/styles/shared/auth.module.scss";

export default function ForgotPassword() {
  const [loading, setLoading] = useState(false);

  const initialValues = {
    email: "",
  };

  const validationSchema = Yup.object({
    email: Yup.string()
      .email("이메일 형식을 확인해주세요")
      .required("필수 입력 항목입니다"),
  });

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      const { email } = values;

      const query = qs.stringify({
        filters: {
          email: {
            $eq: email,
          },
        },
      });

      const res = await fetch(`${API_URL}/api/users?${query}`);
      const data = await res.json();

      // 입력한 이메일로 가입된 계정이 없음
      if (data && data.length === 0) {
        toast.error("해당 메일로 가입된 계정이 없어요.");
        return;
      }

      const res2 = await fetch(`${API_URL}/api/auth/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (!res2.ok) {
        throw new Error("내부 문제가 생겼어요 :(");
      }

      const data2 = await res2.json();

      if (data2.ok) {
        toast.success("메일을 성공적으로 보냈어요. 메일을 확인해주세요.");
      }
    } catch (error) {
      toast.error(error?.message || "내부 문제가 생겼어요 :(");
    } finally {
      setLoading(false);
    }
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
    <Layout title="비밀번호 찾기">
      <div className={styles.container}>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          <Form className={styles.form}>
            <p className={styles.guideMessage}>
              가입하신 이메일을 입력해주세요.
              <br /> 비밀번호 재설정을 위한 메일을 보내드릴게요.
            </p>
            <Field
              name="email"
              type="email"
              placeholder="이메일을 입력하세요"
              component={MyInput}
            />
            <ErrorMessage component="label" name="email" />

            <Button type="submit" fullWidth={true} loading={loading}>
              비밀번호 찾기
            </Button>
          </Form>
        </Formik>
      </div>
    </Layout>
  );
}
