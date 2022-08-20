import { useRouter } from "next/router";
import { GrCheckmark } from "react-icons/gr";
import Layout from "@/components/layout";
import styles from "@/styles/shared/auth.module.scss";

export default function registerResult() {
  const router = useRouter();

  return (
    <Layout title="회원가입">
      <div className={styles.checkMarkIcon}>
        <GrCheckmark size="14ch" />
      </div>
      <h1 className={styles.successTitle}>
        <span>{router.query?.email}</span>로 메일을 보냈어요.
        <br /> 메일을 확인하여 회원가입을 완료해주세요.
      </h1>
    </Layout>
  );
}
