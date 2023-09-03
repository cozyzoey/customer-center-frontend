<a name="readme-top"></a>

<!-- PROJECT LOGO -->
<div align="center">
  <img src="https://res.cloudinary.com/dftuawd1d/image/upload/v1662030739/github/nia_homepage_logo_uxzapg.png" alt="logo" width="200" height="auto">
  
  <h1 align="center">교과용감성AI튜터 고객센터</h1>

  <p>
    '인공지능 학습용 데이터 구축사업' 참여자를 위한 고객센터
  </p>
</div>

<!-- ABOUT THE PROJECT -->

## About The Project

[![스크린샷](https://res.cloudinary.com/dftuawd1d/image/upload/v1662030740/github/nia_homepage_screenshot_pummlr.png)](https://www.nia-help.com)

과학기술정보통신부, NIA(AI-허브)가 추진하는 '인공지능 학습용 데이터 구축사업'에 참여하는 1,200명의 데이터 수집 참가자를 위한 고객센터입니다. 고객 응대를 위한 공지사항, FAQ, Q&A 서비스와 사업 참여동의서 제출을 위한 기능을 제공합니다.
관리자를 위한 CMS 페이지는 백엔드에서 제공하고 있습니다. ([백엔드 repo 보기](https://github.com/cozyzoey/customer-center-backend))

### 데이터 페칭

데이터 페칭은 클라이언트 사이드에서 `SWR`을 사용하며, 서버 사이드에서는 `getStaticProps`를 통해 정적 페이지를 렌더링합니다.
페이지별로 렌더링 전략을 구분하면 아래와 같습니다.
| 구분 | 리스트 페이지 | 상세 페이지 |
| --- | :---: | :---: |
| 공지사항 | CSR | ISR |
| FAQ | CSR | - |
| Q&A | CSR | CSR |

- CSR: Client-side rendering
- ISR: Incremental Static Regeneration

### 인증

사용자 계정 관련 API(회원가입, 로그인, 로그아웃, 사용자 데이터 페치)는 Next.js API가 클라이언트와 서버 중간에서 쿠키 헤더를 설정합니다.

![사용자 인증 플로우](https://res.cloudinary.com/dftuawd1d/image/upload/v1661167049/github/nia_homepage_diagram_ildvem.png)

```js
// 서버에 로그인 요청후 응답이 ok인 경우 응답 헤더에 쿠키 설정
// pages/api/login.js
if (strapiRes.ok) {
      res.setHeader(
        "Set-Cookie",
        cookie.serialize("token", jwt, {
          httpOnly: true,
          secure: process.env.NODE_ENV !== "development",
          maxAge: 60 * 60 * 24 * 30, // 30 days
          sameSite: "strict",
          path: "/",
        })
      );
```

### 텍스트 에디터

이 프로젝트는 텍스트 에디터로 `CKEditor 5`를 사용합니다. 커스텀 빌드한 모듈과 서버에 이미지를 업로드하기 위해서 커스텀 이미지 어댑터를 적용했습니다. `components/editor.js` 에디터 컴포넌트에서 참고할 수 있습니다.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Tech Stack

<!-- https://github.com/Ileriayo/markdown-badges -->

- [![Next](https://img.shields.io/badge/Next-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
- [![SASS](https://img.shields.io/badge/SASS-hotpink.svg?style=for-the-badge&logo=SASS&logoColor=white)](https://sass-lang.com/)
- [![Vercel](https://img.shields.io/badge/vercel-%23000000.svg?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- FEATIRES -->

## Features

- 공지사항, FAQ, Q&A
- 사업 참여동의서 신청
- 이메일 계정 및 httpOnly 쿠키 인증

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- GETTING STARTED -->

## Getting Started

이 프로젝트를 로컬에서 실행하려면 아래를 참고하세요.

### Prerequisites

이 프로젝트는 패키지 매니저로 npm을 사용합니다.

```sh
npm install npm@latest -g
```

### Installation

1. 로컬 디렉토리에 repo를 복제합니다.
   ```sh
   git clone https://github.com/cozyzoey/customer-center-frontend.git
   cd customer-center-frontend
   ```
2. NPM 패키지를 설치합니다.
   ```sh
   npm install
   ```
3. 코드를 실행한 후 브라우저에서 http://localhost:3000에 접속합니다.
   ```sh
   npm run dev
   ```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- CONTACT -->

## Contact

김반석 - devzoeykim@gmail.com

Project Link: [https://github.com/cozyzoey/customer-center-frontend](https://github.com/cozyzoey/customer-center-frontend)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- ACKNOWLEDGMENTS -->

## Acknowledgments

- [Incremental Static Regeneration](https://nextjs.org/docs/basic-features/data-fetching/incremental-static-regeneration)
- [SWR - Next.js SSG and SSR](https://swr.vercel.app/docs/with-nextjs)
- [CKEditor - Custom image upload adapter](https://ckeditor.com/docs/ckeditor5/latest/framework/guides/deep-dive/upload-adapt)
- [Enabling CORS in a Next.js APP](https://vercel.com/guides/how-to-enable-cors#enabling-cors-in-a-next.js-app)

<p align="right">(<a href="#readme-top">back to top</a>)</p>
