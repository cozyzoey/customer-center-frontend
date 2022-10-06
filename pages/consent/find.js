import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import qs from "qs";
import { GrCircleInformation } from "react-icons/gr";
import { useRouter } from "next/router";
import { toast } from "react-toastify";

import Button from "@/components/button";
import Layout from "@/components/layout";
import MyInput from "@/components/my-input";

import { API_URL } from "@/constants/config";

import styles from "@/styles/consent.module.scss";

export default function ConesntFind() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const initialValues = {
    name: "",
    phoneNumber: "",
  };

  const validationSchema = Yup.object({
    name: Yup.string()
      .matches(/^[가-힣]{2,4}$/, "2~4자의 실명을 입력해주세요")
      .required("필수 입력 항목입니다"),

    phoneNumber: Yup.string()
      .matches(
        /^01([0|1|6|7|8|9])-?([0-9]{3,4})-?([0-9]{4})$/,
        "예시 010-0000-0000"
      )
      .required("필수 입력 항목입니다"),
  });

  const handleSubmit = async (values, { resetForm }) => {
    try {
      setLoading(true);

      const query = qs.stringify(
        {
          filters: {
            name: { $eq: values.name },
            $or: [
              { phoneNumber: { $eq: values.phoneNumber } },
              { phoneNumber: { $eq: values.phoneNumber.replaceAll("-", "") } },
              {
                phoneNumber: {
                  $eq:
                    values.phoneNumber.replaceAll("-", "").slice(0, 7) +
                    "-" +
                    values.phoneNumber.replaceAll("-", "").slice(7),
                },
              },
            ],
            deletedAt: {
              $null: true,
            },
          },
          populate: "*",
        },
        {
          encodeValuesOnly: true, // prettify URL
        }
      );

      const res = await fetch(`${API_URL}/api/students?${query}`, {
        method: "GET",
      });
      const { data, error } = await res.json();

      if (error) {
        throw new Error(error.message);
      }

      if (data.length === 0) {
        throw new Error("일치하는 신청 정보가 없습니다");
      }

      // 데이터 여러개인 경우 가장 마지막 데이터만 저장
      sessionStorage.setItem(
        "consentFoundItem",
        JSON.stringify(data.slice(-1)[0])
      );
      resetForm();
      router.replace("/consent?step=2");
    } catch (error) {
      toast.error(error?.message || "내부 문제가 생겼어요 :(");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout title="신청 내역 조회">
      <div className={styles.container} data-step={2}>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          enableReinitialize={true}
        >
          <Form className={styles.form}>
            <div className={styles.stepGuide}>
              <GrCircleInformation size="2.2ch" />
              신청 내역 조회를 위해 제출한 정보를 입력해주세요.
            </div>
            <fieldset>
              <legend>학생 정보</legend>
              {/* 이름 */}
              <Field
                name="name"
                type="text"
                placeholder="이름(실명)"
                component={MyInput}
              />
              <ErrorMessage component="label" name="name" />
              {/* 핸드폰 번호 */}
              <Field
                name="phoneNumber"
                type="tel"
                placeholder="핸드폰 번호"
                component={MyInput}
              />
              <ErrorMessage component="label" name="phoneNumber" />
            </fieldset>

            <Button type="submit" fullWidth={true} loading={loading}>
              조회하기
            </Button>
          </Form>
        </Formik>
      </div>
    </Layout>
  );
}
