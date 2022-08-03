import qs from "qs";
import useSWR from "swr";
import { useRouter } from "next/router";
import { API_URL, PER_PAGE } from "@/constants/config";

export default function useFetchPage({ endpoint = "", populate = false }) {
  const router = useRouter();
  const page = router.query?.page || 1; // 시작페이지 계산
  const start = +page === 1 ? 0 : (+page - 1) * PER_PAGE;
  const query = qs.stringify(
    {
      sort: ["id:desc"],
      pagination: {
        start: start,
        limit: PER_PAGE,
      },
      ...(!!populate && { populate: "*" }),
    },
    {
      encodeValuesOnly: true, // prettify URL
    }
  );
  const { data, error } = useSWR(
    !!endpoint ? `${API_URL}${endpoint}?${query}` : null
  );
  return { data, page, error };
}
