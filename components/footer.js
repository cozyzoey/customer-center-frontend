import Link from "next/link";
import Image from "next/image";
import styles from "@/styles/footer.module.scss";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.logos}>
        <Image
          alt="NIA"
          src="/icons/footer_logo_1.png"
          layout="fixed"
          width={245}
          height={29}
          objectFit="contain"
        />
        <Image
          alt="NIA"
          src="/icons/footer_logo_2.png"
          layout="fixed"
          width={242}
          height={48}
          objectFit="contain"
        />
        <Image
          alt="NIA"
          src="/icons/footer_logo_3.png"
          layout="fixed"
          width={267}
          height={28}
          objectFit="contain"
        />
        <Image
          alt="NIA"
          src="/icons/footer_logo_4.png"
          layout="fixed"
          width={162}
          height={48}
          objectFit="contain"
        />
        <Image
          alt="NIA"
          src="/icons/footer_logo_5.png"
          layout="fixed"
          width={64}
          height={57}
          objectFit="contain"
        />
        <Image
          alt="NIA"
          src="/icons/footer_logo_6.png"
          layout="fixed"
          width={67}
          height={61}
          objectFit="contain"
        />
        <Image
          alt="NIA"
          src="/icons/footer_logo_7.png"
          layout="fixed"
          width={131}
          height={60}
          objectFit="contain"
        />
      </div>
      <div className={styles.policies}>
        <div>
          Copyright&nbsp;&copy;&nbsp;{new Date().getFullYear()}
          &nbsp;청소년 감성 공감 AI 튜터. All Rights Reserved.<span>|</span>
        </div>
        <Link href="/policy/terms">
          <a>
            이용약관<span>|</span>
          </a>
        </Link>
        <Link href="/policy/privacy">
          <a>개인정보 처리방침</a>
        </Link>
      </div>
    </footer>
  );
}
