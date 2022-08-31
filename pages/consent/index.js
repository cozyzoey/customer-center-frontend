import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import { Formik, Form, Field, ErrorMessage, useFormikContext } from "formik";
import * as Yup from "yup";
import {
  GrCircleInformation,
  GrCopy,
  GrContactInfo,
  GrEdit,
} from "react-icons/gr";

import Layout from "@/components/layout";
import { toast } from "react-toastify";
import Button from "@/components/button";
import MyInput from "@/components/my-input";
import { API_URL } from "@/constants/config";
import styles from "@/styles/consent.module.scss";

export default function consent() {
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [completed, setCompleted] = useState(false);
  const router = useRouter();

  const ScrollToErrorInput = () => {
    const { isValid, submitCount, errors } = useFormikContext();

    useEffect(() => {
      if (isValid) {
        return;
      }

      const errorFieldNames = Object.keys(errors);
      if (errorFieldNames.length <= 0) return;

      const element =
        document.querySelector(`input[name=${errorFieldNames[0]}]`) ||
        document.querySelector(`select[name=${errorFieldNames[0]}]`);

      if (!element) return;

      element.scrollIntoView({ behavior: "smooth", block: "center" });
    }, [submitCount]);

    return null;
  };

  // 페이지 이동 핸들링
  useEffect(() => {
    router.beforePopState(() => {
      const result = confirm("페이지를 나가시겠습니까?");
      if (!result) {
        router.push(router.asPath);
        return false;
      }
      return true;
    });

    return () => {
      router.beforePopState(() => true);
    };
  }, [router]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [step]);

  const initialValues = {
    name: "",
    schoolName: "",
    gender: "",
    schoolYear: 1,
    schoolClass: "",
    studentNumber: "",
    phoneNumber: "",
    email: "",
    dataCollectionTerm: "",
    parentName: "",
    parentEmail: "",
  };

  //* 테스트용 초기값
  // const initialValues = {
  //   name: "김반석",
  //   schoolName: "신촌 중학교",
  //   gender: "male",
  //   schoolYear: 1,
  //   schoolClass: 2,
  //   studentNumber: 3,
  //   phoneNumber: "01050259204",
  //   email: "devzoeykim@gmail.com",
  //   dataCollectionTerm: 2,
  //   parentName: "학부모",
  //   parentEmail: "sumone0407@gmail.com",
  // };

  const validationSchema = Yup.object({
    name: Yup.string()
      .matches(/^[가-힣]{2,4}$/, "2~4자의 실명을 입력해주세요")
      .required("필수 입력 항목입니다"),

    schoolName: Yup.string()
      .matches(
        /^[가-힣|a-z|A-Z|0-9|\s]+$/,
        "한글/영어/숫자/공백만 입력 가능해요"
      )
      .min(2, "2자 이상 입력해주세요")
      .required("필수 입력 항목입니다"),
    gender: Yup.mixed()
      .oneOf(["male", "female"])
      .required("필수 입력 항목입니다"),

    schoolYear: Yup.number()
      .min(1, "학년은 1~3 사이의 값을 입력해주세요")
      .max(3, "학년은 1~3 사의 값을 입력해주세요")
      .required("학년은 필수 입력 항목입니다"),
    schoolClass: Yup.number()
      .typeError("반은 숫자만 입력 가능해요")
      .min(1, "반은 1 이상의 값을 입력해주세요")
      .max(99, "반은 99 이하의 값을 입력해주세요")
      .required("반은 필수 입력 항목입니다"),
    studentNumber: Yup.number()
      .typeError("번호는 숫자만 입력 가능해요")
      .min(1, "번호는 1 이상의 값을 입력해주세요")
      .max(99, "번호는 99 이하의 값을 입력해주세요")
      .required("번호는 필수 입력 항목입니다"),

    phoneNumber: Yup.string()
      .matches(
        /^01([0|1|6|7|8|9])-?([0-9]{3,4})-?([0-9]{4})$/,
        "예시 010-0000-0000"
      )
      .required("필수 입력 항목입니다"),
    email: Yup.string()
      .email("이메일 형식을 확인해주세요")
      .required("필수 입력 항목입니다"),

    dataCollectionTerm: Yup.number()
      .min(1, "1~3 사이의 값을 입력해주세요")
      .max(3, "1~3 사의 값을 입력해주세요")
      .required("필수 입력 항목입니다"),
    parentName: Yup.string()
      .matches(/^[가-힣]{2,4}$/, "2~4자의 실명을 입력해주세요")
      .required("필수 입력 항목입니다"),
    parentEmail: Yup.string()
      .email("이메일 형식을 확인해주세요")
      .required("필수 입력 항목입니다"),
  });

  const handleSubmit = async (values) => {
    if (completed) {
      setStep(3);
      return;
    }
    try {
      setLoading(true);

      const res = await fetch(`${API_URL}/api/students`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ data: values }),
      });
      const { data, error } = await res.json();

      if (error) {
        throw new Error(error.message);
      }

      setCompleted(true);
      setStep(3);
    } catch (error) {
      toast.error(error?.message || "내부 문제가 생겼어요 :(");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout title="데이터 수집 신청">
      <div className={styles.container} data-step={step}>
        {/* 단계 표시 */}
        <div className={styles.header}>
          <div className={styles.activeStep} onClick={() => setStep(1)}>
            <div>
              <GrCopy size="3ch" />
            </div>
            <label>1. 안내문 확인</label>
          </div>
          <hr></hr>
          <div
            className={step >= 2 ? styles.activeStep : styles.inactiveStep}
            onClick={() => setStep(2)}
          >
            <div>
              <GrContactInfo size="3ch" />
            </div>
            <label>2. 정보 입력</label>
          </div>
          <hr></hr>
          <div
            className={step >= 3 ? styles.activeStep : styles.inactiveStep}
            onClick={() => completed && setStep(3)}
          >
            <div>
              <GrEdit size="3ch" />
            </div>
            <label>3. 서명하기</label>
          </div>
        </div>

        {/* 1단계: 안내문 */}
        {step === 1 && (
          <div className={styles.stepDocuments}>
            <div className={styles.stepGuide}>
              <GrCircleInformation size="2.2ch" />
              데이터 수집 참여를 위한 안내입니다.
            </div>
            <Image
              alt="데이터 수집 참여 안내문"
              src="https://nia-homepage-media.s3.ap-northeast-2.amazonaws.com/assets/data-collection-notice.png"
              layout="responsive"
              priority={true}
              width={992}
              height={1403}
            />
            <Button fullWidth={true} onClick={() => setStep(2)} type="button">
              다음
            </Button>
          </div>
        )}
        {/* 2단계: 정보 입력 */}
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          enableReinitialize={true}
        >
          {({ errors, touched }) => (
            <Form className={styles.form}>
              <ScrollToErrorInput />
              <div className={styles.stepGuide}>
                <GrCircleInformation size="2.2ch" />
                데이터 수집을 위해 몇 가지 정보가 필요해요.
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

                {/* 학교 */}
                <Field
                  name="schoolName"
                  type="text"
                  placeholder="소속 학교 이름"
                  component={MyInput}
                />
                <ErrorMessage component="label" name="schoolName" />

                {/* 성별 */}
                <section>
                  성별:
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

                {/* 학년, 반, 번호 */}
                <section className={styles.withLabel}>
                  <label>
                    학년:
                    <Field
                      as="select"
                      name="schoolYear"
                      className={
                        touched.schoolYear && errors.schoolYear
                          ? styles.errorBorder
                          : ""
                      }
                      disabled
                    >
                      <option value="">선택</option>
                      <option value={1}>1학년</option>
                      <option value={2}>2학년</option>
                      <option value={3}>3학년</option>
                    </Field>
                  </label>
                  <label>
                    반:
                    <Field
                      name="schoolClass"
                      type="tel"
                      component={MyInput}
                      autoComplete="off"
                    />
                  </label>
                  <label>
                    번호:
                    <Field
                      name="studentNumber"
                      type="tel"
                      component={MyInput}
                      autoComplete="off"
                    />
                  </label>
                </section>
                {touched.schoolYear && errors.schoolYear ? (
                  <ErrorMessage component="label" name="schoolYear" />
                ) : touched.schoolClass && errors.schoolClass ? (
                  <ErrorMessage component="label" name="schoolClass" />
                ) : touched.studentNumber && errors.studentNumber ? (
                  <ErrorMessage component="label" name="studentNumber" />
                ) : null}

                {/* 핸드폰 번호 */}
                <Field
                  name="phoneNumber"
                  type="tel"
                  placeholder="핸드폰 번호"
                  component={MyInput}
                />
                <ErrorMessage component="label" name="phoneNumber" />

                {/* 이메일 */}
                <Field
                  name="email"
                  type="email"
                  placeholder="이메일 주소(정확히 입력)"
                  component={MyInput}
                />
                <ErrorMessage component="label" name="email" />

                {/* 데이터 수집 기간 */}
                <section className={styles.withLabel}>
                  <label>
                    데이터 수집 기간:&nbsp;
                    <Field
                      as="select"
                      name="dataCollectionTerm"
                      className={
                        touched.schoolYear && errors.schoolYear
                          ? styles.errorBorder
                          : ""
                      }
                    >
                      <option value="">선택</option>
                      <option value={1}>
                        1차 - 2022년 9월 19일 ~ 2022년 9월 23일
                      </option>
                      <option value={2}>
                        2차 - 2022년 10월 3일 ~ 2022년 10월 7일
                      </option>
                      <option value={3}>
                        3차 - 2022년 10월 17일 ~ 2022년 10월 21일
                      </option>
                    </Field>
                  </label>
                </section>
                <ErrorMessage component="label" name="dataCollectionTerm" />
              </fieldset>
              <fieldset>
                <legend>학부모님 정보</legend>
                <Field
                  name="parentName"
                  type="text"
                  placeholder="이름(실명)"
                  component={MyInput}
                />
                <ErrorMessage component="label" name="parentName" />
                <Field
                  name="parentEmail"
                  type="email"
                  placeholder="이메일 주소(정확히 입력)"
                  component={MyInput}
                />
                <ErrorMessage component="label" name="parentEmail" />
              </fieldset>
              <Button type="submit" fullWidth={true} loading={loading}>
                다음
              </Button>
            </Form>
          )}
        </Formik>
        {/*  3단계: 서명 안내 */}
        {step === 3 && (
          <div className={styles.stepCompleted}>
            <div className={styles.stepGuide}>
              <GrCircleInformation size="2.2ch" />
              이메일로 전자계약 링크를 보내드릴게요.{" "}
              <strong>
                전자계약을 완료하여 데이터 수집 참여에 동의해주세요.
              </strong>
              &nbsp; 하루가 지나도 메일이 안온다면 카카오 채널로 문의해주세요.
              <div style={{ marginTop: "2ch" }}></div>
              <a href="http://pf.kakao.com/_xgWxdExj/chat" target="_blank">
                <Image
                  alt="카카오 채널 상담"
                  src="/kakao-channel.png"
                  width={24}
                  height={26}
                  layout="fixed"
                  objectFit="contain"
                />
                카카오채널 문의
              </a>
            </div>
            <h2>데이터 참여 동의서 내용(아래)</h2>
            <div className={styles.consentDocs}>
              <Image
                alt="개인정보 수집-활용 동의서 페이지1"
                src="https://nia-homepage-media.s3.ap-northeast-2.amazonaws.com/privacy-consent-doc-1.png"
                layout="responsive"
                width={992}
                height={1403}
              />
              <Image
                alt="개인정보 수집-활용 동의서 페이지2"
                src="https://nia-homepage-media.s3.ap-northeast-2.amazonaws.com/privacy-consent-doc-2.png"
                layout="responsive"
                width={992}
                height={1403}
              />
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
