import parse from "html-react-parser";
import moment from "moment";
import { useEffect, useState, Suspense } from "react";
import useSWR from "swr";
import { useRouter } from "next/router";
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
import Loader from "@/components/loader";
import { API_URL } from "@/constants/config";
import keyConverter from "utils/keyConverter";
import styles from "@/styles/consent.module.scss";

export default function consent() {
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [serverResponse, setServerResponse] = useState(null);
  const router = useRouter();
  const { data: businessData } = useSWR(`${API_URL}/api/business`, {
    revalidateIfStale: false,
  });
  const { data: sessionsData } = useSWR(
    `${API_URL}/api/data-collection-sessions`,
    {
      revalidateIfStale: true,
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
    }
  );

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
        document.querySelector(`select[name=${errorFieldNames[0]}]`) ||
        document.querySelector(`p[name=${errorFieldNames[0]}]`);
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

  const initialValues = serverResponse
    ? {
        name: serverResponse?.attributes?.name,
        schoolName: serverResponse.attributes.schoolName,
        gender: serverResponse?.attributes?.gender,
        schoolYear: 1,
        schoolClass: serverResponse?.attributes?.schoolClass,
        studentNumber: serverResponse?.attributes?.studentNumber,
        phoneNumber: serverResponse?.attributes?.phoneNumber,
        email: serverResponse?.attributes?.email,
        dataCollectionSession:
          serverResponse?.attributes?.dataCollectionSession?.data?.id,
        parentName: serverResponse?.attributes?.parentName,
        parentPhoneNumber: serverResponse?.attributes?.parentPhoneNumber,
        parentEmail: serverResponse?.attributes?.parentEmail,
      }
    : {
        name: "",
        schoolName: "",
        gender: "",
        schoolYear: 1,
        schoolClass: "",
        studentNumber: "",
        phoneNumber: "",
        email: "",
        dataCollectionSession: "",
        parentName: "",
        parentPhoneNumber: "",
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
  //   email: "",
  //   dataCollectionSession: 1,
  //   parentName: "학부모",
  //   parentPhoneNumber: "01050259204",
  //   parentEmail: ""
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
    dataCollectionSession:
      Yup.number().required("데이터 수집 기간을 선택해주세요"),
    parentName: Yup.string()
      .matches(/^[가-힣]{2,4}$/, "2~4자의 실명을 입력해주세요")
      .required("필수 입력 항목입니다"),
    parentPhoneNumber: Yup.string()
      .matches(
        /^01([0|1|6|7|8|9])-?([0-9]{3,4})-?([0-9]{4})$/,
        "예시 010-0000-0000"
      )
      .required("필수 입력 항목입니다"),
    parentEmail: Yup.string()
      .email("이메일 형식을 확인해주세요")
      .required("필수 입력 항목입니다"),
  });

  const handleSubmit = async (values, { resetForm }) => {
    try {
      setLoading(true);

      const res = await fetch(`${API_URL}/api/students?populate=*`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        // 학교 이름은 양측의 공백 제거
        body: JSON.stringify({
          data: { ...values, schoolName: values.schoolName.trim() },
        }),
      });
      const { data, error } = await res.json();

      if (error) {
        throw new Error(error.message);
      }

      setServerResponse(data); // id, attributes: {}
      setStep(3);
      resetForm();
    } catch (error) {
      toast.error(error?.message || "내부 문제가 생겼어요 :(");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (values, { resetForm }) => {
    try {
      const result = window.confirm("신청 정보를 수정하시겠습니까?");

      if (!result) return;

      setLoading(true);

      const res = await fetch(
        `${API_URL}/api/students/${serverResponse.id}?populate=*`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          // 학교 이름은 양측의 공백 제거
          body: JSON.stringify({
            data: { ...values, schoolName: values.schoolName.trim() },
          }),
        }
      );
      const { data, error } = await res.json();

      if (error) {
        throw new Error(error.message);
      }

      setServerResponse(data); // id, attributes: {}
      setStep(3);
      resetForm();
    } catch (error) {
      toast.error(error?.message || "내부 문제가 생겼어요 :(");
    } finally {
      setLoading(false);
    }
  };

  const convertDataCollectionSession = (id) => {
    const session = sessionsData?.data.filter((el) => el.id === id)[0];

    if (!session) return null;

    return (
      <>
        {session.attributes.group},&nbsp;
        {moment(session.attributes.date).format("YY년 M월 D일")}
      </>
    );
  };

  return (
    <Layout title="학습 데이터 제공 참여 신청">
      <div className={styles.container} data-step={step}>
        {/* 멀티스텝 헤더 */}
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
            onClick={() => serverResponse && setStep(3)}
          >
            <div>
              <GrEdit size="3ch" />
            </div>
            <label>3. 신청 완료</label>
          </div>
        </div>
        {/* 1단계: 안내문 */}
        {step === 1 && (
          <div className={styles.stepDocuments}>
            <div className={styles.stepGuide}>
              <GrCircleInformation size="2.2ch" />
              학습 데이터 제공 참여를 위한 안내입니다.
            </div>
            <Suspense default={<Loader />}>
              <div className={styles.dataCollectionNotice}>
                {parse(businessData.data.attributes.dataCollectionNotice || "")}
              </div>
            </Suspense>
            <Button fullWidth={true} onClick={() => setStep(2)} type="button">
              다음
            </Button>
          </div>
        )}
        {/* 2단계: 정보 입력 */}
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={serverResponse ? handleUpdate : handleSubmit}
          enableReinitialize={true}
        >
          {({ errors, touched, setFieldValue, values }) => (
            <Form className={styles.form}>
              <ScrollToErrorInput />
              <div className={styles.stepGuide}>
                <GrCircleInformation size="2.2ch" />
                학습 데이터 제공 참여를 위해 아래 정보를 입력해주세요.
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
                    {keyConverter.gender("male")}
                  </label>
                  <label>
                    <Field type="radio" name="gender" value="female" />
                    {keyConverter.gender("female")}
                  </label>
                </section>
                <ErrorMessage component="label" name="gender" />
                {/* 학년, 반, 번호 */}
                <section className={styles.withLabel}>
                  <label>
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
                      <option value={1}>중학교 1학년</option>
                      <option value={2}>중학교 2학년</option>
                      <option value={3}>중학교 3학년</option>
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

                {/* 핸드폰 번호 */}
                <Field
                  name="email"
                  type="email"
                  placeholder="이메일(정확히 입력)"
                  component={MyInput}
                />
                <ErrorMessage component="label" name="email" />

                {/* 데이터 수집 기간 */}
                <p
                  className={styles.dataCollectionSessionTitle}
                  name="dataCollectionSession"
                >
                  데이터 수집 기간
                  <br />
                  원하는 데이터 수집기간 세션 선택
                </p>
                <ErrorMessage component="label" name="dataCollectionSession" />

                <div className={styles.dataCollectionSessionTable}>
                  <div className={styles.tableHeader}>
                    토요일 A반(오전)
                    <br />
                    10:00~13:00
                  </div>
                  <div className={styles.tableHeader}>
                    토요일 B반(오후)
                    <br />
                    14:00~17:00
                  </div>
                  <div className={styles.tableHeader}>
                    일요일
                    <br />
                    14:00~17:00
                  </div>
                  {sessionsData?.data &&
                    sessionsData.data.map((session) => {
                      return (
                        <div
                          key={session.id}
                          onClick={() => {
                            session.attributes.remainingApplicants > 0 &&
                              setFieldValue(
                                "dataCollectionSession",
                                session.id
                              );
                          }}
                          data-active={
                            session.id === values.dataCollectionSession
                          }
                          data-disabled={
                            session.attributes.remainingApplicants === 0
                          }
                        >
                          <span>{session.attributes.sessionId}</span>
                          {moment(session.attributes.date).format(
                            "YY년 M월 D일"
                          )}
                          <br />
                          신청 잔여: {session.attributes.remainingApplicants}
                        </div>
                      );
                    })}
                </div>
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
                  name="parentPhoneNumber"
                  type="tel"
                  placeholder="핸드폰 번호"
                  component={MyInput}
                />
                <ErrorMessage component="label" name="parentPhoneNumber" />
                <Field
                  name="parentEmail"
                  type="email"
                  placeholder="이메일(정확히 입력)"
                  component={MyInput}
                />
                <ErrorMessage component="label" name="parentEmail" />
              </fieldset>

              {!serverResponse && (
                <fieldset>
                  <legend>서명하기</legend>
                  <iframe
                    width="100%"
                    height="800"
                    src="https://app.modusign.co.kr/link/f7628320-34ca-11ed-b019-d973344d21d0/authentication"
                    allowFullScreen
                  ></iframe>
                </fieldset>
              )}

              <div className={styles.stepGuide} style={{ marginTop: "3ch" }}>
                <GrCircleInformation size="2.2ch" />
                제출하기 전에 꼭 위의 "서명하기"를 완료해주세요.
              </div>
              <Button type="submit" fullWidth={true} loading={loading}>
                {serverResponse ? "수정하기" : "제출하기"}
              </Button>
            </Form>
          )}
        </Formik>

        {/*  3단계: 신청 완료 */}
        {step === 3 && (
          <div className={styles.stepCompleted}>
            <div className={styles.stepGuide}>
              <GrCircleInformation size="2.2ch" />
              참여 신청이 완료되었습니다.
              <br /> 우리 소중한 자녀의 올바른 교육을 위한 노력에 함께 해주셔서
              감사합니다.
            </div>

            {/* 신청정보 */}
            {serverResponse && (
              <div className={styles.card}>
                <div className={styles.cardTitle}>신청 정보</div>
                <div className={styles.cardSubtitle}>학생 정보</div>

                <div className={styles.cardContent}>
                  <div>이름</div>
                  <div>{serverResponse.attributes.name}</div>
                  <div>소속 학교 이름</div>
                  <div>{serverResponse.attributes.schoolName}</div>
                  <div>성별</div>
                  <div>
                    {keyConverter.gender(serverResponse.attributes.gender)}
                  </div>
                  <div>학년/반/번호</div>
                  <div>
                    중학교 {serverResponse.attributes.schoolYear}학년/
                    {serverResponse.attributes.schoolClass}반/
                    {serverResponse.attributes.studentNumber}번
                  </div>
                  <div>핸드폰 번호</div>
                  <div>{serverResponse.attributes.phoneNumber}</div>
                  <div>데이터 수집 기간</div>
                  <div>
                    {convertDataCollectionSession(
                      serverResponse.attributes.dataCollectionSession.data.id
                    )}
                  </div>
                </div>

                <div className={styles.cardSubtitle}>학부모님 정보</div>
                <div className={styles.cardContent}>
                  <div>이름</div>
                  <div>{serverResponse.attributes.parentName}</div>
                  <div>핸드폰 번호</div>
                  <div>{serverResponse.attributes.parentPhoneNumber}</div>
                </div>

                <Button onClick={() => setStep(2)}>수정하기</Button>
              </div>
            )}

            {/* 카카오 채널 상담 */}
            <div className={styles.card}>
              <div className={styles.cardTitle}>문의하기</div>
              <div className={styles.cardSubtitle}>
                {businessData?.data?.attributes?.contactUs}
              </div>
              <Button>
                <a href="http://pf.kakao.com/_xgWxdExj/chat" target="_blank">
                  카카오채널 문의하기
                </a>
              </Button>
            </div>
            <Button
              onClick={() => router.replace("/")}
              variant="blue"
              size="lg"
            >
              처음으로
            </Button>
          </div>
        )}
      </div>
    </Layout>
  );
}
