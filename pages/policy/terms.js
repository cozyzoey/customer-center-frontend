import parse from "html-react-parser";
import Layout from "@/components/layout";
import { API_URL } from "@/static/config";

export default function Terms({ contents }) {
  return <Layout title="이용약관">{parse(contents)}</Layout>;
}

export async function getStaticProps() {
  const res = await fetch(`${API_URL}/api/business`);
  const { data } = await res.json();

  return {
    props: {
      contents: data?.attributes?.terms,
    },
  };
}
