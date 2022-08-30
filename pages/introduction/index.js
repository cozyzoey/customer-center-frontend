import React from "react";
import Image from "next/image";
import Layout from "@/components/layout";
import PageTitle from "@/components/page-title";
import Logo from "@/components/responsive-logo-img";
import styles from "@/styles/introduction.module.scss";

export default function BusinessIntroduction() {
  return (
    <Layout title="사업소개">
      <div className={styles.introduction}>
        <article>
          <PageTitle title="사업소개" />
          <section>
            <div className={styles.button}>컨소시엄 소개</div>
            <div className={styles.detail}>
              서울대학교 AI 연구원, 서울특별시 교육청, 서울대학교 병원 및
              유탑소프트, 오픈링크시스템으로 구성된 본 컨소시엄은 글로벌
              에듀테크 산업의 성장을 견인하고 일자리 창출과 AI 전문 인력 양성을
              위한 최고의 전문기관입니다.
            </div>
          </section>
          <section>
            <div className={styles.logo}>
              <Logo />
            </div>
            <div className={styles.detail}>
              본 사업은 한국지능정보사회진흥원의 지원을 받아 과제2-100.(서울
              지역 중학생들의 국어, 수학 교과용 감성 AI 튜터 데이터) 를 수행하여
              청소년의 감성적/인지적 반응을 실시간으로 예측하는 모델을 개발하고,
              감성 공감을 통한 학습동기 유발 및 개인 맞춤형 학습 커리큘럼을
              제공하는 청소년 감성 AI 튜터를 개발하기 위하여 청소년들의 학습
              감성 데이터를 수집합니다.
            </div>
          </section>
          <Image
            src="https://nia-homepage-media.s3.ap-northeast-2.amazonaws.com/assets/introduction_diagram.png"
            layout="responsive"
            width={1589}
            height={955}
          />
        </article>
      </div>
    </Layout>
  );
}
