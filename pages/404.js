import Button from "@/components/button";
import { useRouter } from "next/router";
import styles from "@/styles/shared/error-page.module.scss";

export default function Custom404() {
  const router = useRouter();
  return (
    <div className={styles.container}>
      <h2>존재하지 않는 페이지입니다.</h2>
      <Button onClick={() => router.replace("/")} variant="gray">
        홈으로
      </Button>
    </div>
  );
}
