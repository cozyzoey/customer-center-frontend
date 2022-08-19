import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import {
  GrCircleInformation,
  GrCopy,
  GrContactInfo,
  GrEdit,
} from "react-icons/gr";

import Layout from "@/components/layout";
import AuthContext from "@/context/AuthContext";
import { toast } from "react-toastify";
import Button from "@/components/button";
import MyInput from "@/components/my-input";
import { API_URL } from "@/constants/config";
import styles from "@/styles/consent.module.scss";

export default function consent() {
  const { user, token, setUser } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [completed, setCompleted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (
      user &&
      user.name &&
      user.schoolName &&
      user.phoneNumber &&
      user.gender &&
      user.parentName &&
      user.parentEmail
    ) {
      setCompleted(true);
    }
  }, [user]);

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
    name: user?.name || "",
    schoolName: user?.schoolName || "",
    gender: user?.gender || "",
    phoneNumber: user?.phoneNumber || "",
    parentName: user?.parentName || "",
    parentEmail: user?.parentEmail || "",
  };

  const validationSchema = Yup.object({
    name: Yup.string()
      .matches(/^[가-힣]{2,4}$/, "2~4자의 실명을 입력해주세요")
      .required("필수 입력 항목입니다"),
    schoolName: Yup.string()
      .matches(
        /^[가-힣|a-z|A-Z|0-9|\s]+$/,
        "한글/영어/숫자/공백만 입력 가능해요"
      )
      .required("필수 입력 항목입니다"),
    phoneNumber: Yup.string()
      .matches(
        /^01([0|1|6|7|8|9])-?([0-9]{3,4})-?([0-9]{4})$/,
        "예시 010-0000-0000"
      )
      .required("필수 입력 항목입니다"),
    gender: Yup.mixed()
      .oneOf(["male", "female"])
      .required("필수 입력 항목입니다"),
    parentName: Yup.string()
      .matches(/^[가-힣]{2,4}$/, "2~4자의 실명을 입력해주세요")
      .required("필수 입력 항목입니다"),
    parentEmail: Yup.string()
      .email("이메일 형식을 확인해주세요")
      .required("필수 입력 항목입니다"),
  });

  const handleSubmit = async (values) => {
    if (!user || !token) return;

    try {
      setLoading(true);

      // 입력정보로 유저 업데이트하기
      const res = await fetch(`${API_URL}/api/users/${user.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(values),
      });

      const updatedUserRes = await res.json();

      setUser(updatedUserRes);

      // TODO 이메일 전송

      setStep(3);
      setCompleted(true);
    } catch (error) {
      toast.error(error?.message || "내부 문제가 생겼어요 :(");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout title="동의서 제출">
      <div className={styles.container} data-step={step}>
        {/* 단계 표시 */}
        <div className={styles.steps}>
          <div className={styles.activeStep} onClick={() => setStep(1)}>
            <div>
              <GrCopy size="3ch" />
            </div>
            <label>1. 동의서 확인</label>
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

        {/* 1단계: 동의서 */}
        {step === 1 && (
          <div className={styles.documents}>
            <div className={styles.stepGuide}>
              <GrCircleInformation size="2.2ch" />
              사업 참여를 위한 동의서 내용을 확인해주세요. 서명할 때 다시 확인할
              수 있어요.
            </div>
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
          <Form className={styles.form}>
            <div className={styles.stepGuide}>
              <GrCircleInformation size="2.2ch" />
              서명을 하기 전에 몇 가지 정보가 필요해요.
            </div>
            <fieldset>
              <legend>참여 학생 정보</legend>
              <Field
                name="name"
                type="text"
                placeholder="이름(실명)"
                component={MyInput}
              />
              <ErrorMessage component="label" name="name" />
              <Field
                name="schoolName"
                type="text"
                placeholder="소속 학교 이름"
                component={MyInput}
              />
              <ErrorMessage component="label" name="schoolName" />
              <Field
                name="phoneNumber"
                type="tel"
                placeholder="핸드폰 번호"
                component={MyInput}
              />
              <ErrorMessage component="label" name="phoneNumber" />

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
            </fieldset>

            <fieldset>
              <legend>학부모님 정보</legend>
              <Field
                name="parentName"
                type="text"
                placeholder="학부모님 이름(실명)"
                component={MyInput}
              />
              <ErrorMessage component="label" name="parentName" />
              <Field
                name="parentEmail"
                type="email"
                placeholder="학부모님 이메일"
                component={MyInput}
              />
              <ErrorMessage component="label" name="parentEmail" />
            </fieldset>

            <Button type="submit" fullWidth={true} loading={loading}>
               다음
            </Button>
          </Form>
        </Formik>

        {/*  3단계: 서명 안내 */}
        {step === 3 && (
          <div className={styles.completed}>
            <div className={styles.stepGuide}>
              <GrCircleInformation size="2.2ch" />
              입력하신 이메일로 전자계약 링크를 보냈어요. 메일함을 확인하여
              서명을 완료해주세요.
            </div>
            <p>아직 메일을 받지 못하셨나요?</p>
            <Button variant="text">
              <div style={{ width: "3ch" }}>
                <Image
                  alt="카카오 채널 상담"
                  src="/kakao-channel.png"
                  layout="responsive"
                  width={89}
                  height={93}
                />
              </div>
              <div>카카오채널 문의</div>
            </Button>
          </div>
        )}
      </div>
    </Layout>
  );
}
