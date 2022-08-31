import useSWR from "swr";
import parse from "html-react-parser";
import Layout from "@/components/layout";
import PageTitle from "@/components/page-title";
import { API_URL } from "@/constants/config";

export default function Privacy() {
  const { data, error } = useSWR(`${API_URL}/api/business`, {
    revalidateIfStale: false,
  });
  return (
    <Layout title="개인정보 처리방침">
      <div>
        <PageTitle title="개인정보 처리방침" />
        {error ||
          (data?.error && <h1>데이터를 불러오는 데 문제가 생겼어요</h1>)}
        {parse(data?.data?.attributes?.privacy || "")}
      </div>
    </Layout>
  );
}
