import { useRouter } from "next/router";

export function useParameterCache() {
  const router = useRouter();

  const setCacheValue = (key: string, value: string) => {
    router.push({
      pathname: router.pathname,
      query: { ...router.query, [key]: value },
    });
  };

  const deleteCacheValue = (key: string) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { [key]: _, ...query } = router.query;

    router.push({
      pathname: router.pathname,
      query,
    });
  };

  const getCacheValue = (key: string) => {
    return router.query[key] as string;
  };

  return {
    setCacheValue,
    deleteCacheValue,
    getCacheValue,
  };
}
