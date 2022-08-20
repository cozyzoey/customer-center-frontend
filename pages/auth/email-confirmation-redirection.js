import { useRouter } from "next/router";
import { GrCheckmark } from "react-icons/gr";
import Layout from "@/components/layout";
import Button from "@/components/button";
import styles from "@/styles/shared/auth.module.scss";

export default function EmailConfirmationRedirection() {
  const router = useRouter();

  return (
    <Layout title="회원가입 성공">
      <div className={styles.checkMarkIcon}>
        <GrCheckmark size="14ch" />
      </div>
      <h1 className={styles.successTitle}>
        이메일이 확인되었습니다.
        <br />
        회원가입을 성공적으로 마쳤어요!
      </h1>
      <Button onClick={() => router.replace("/auth/login")}>
        로그인하러 가기
      </Button>
    </Layout>
  );
}
