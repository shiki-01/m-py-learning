import type { PageServerLoad } from "./$types";
import { getContentList } from "$lib/utils/services/microcms";

export const load: PageServerLoad = async () => {
  const res = await getContentList("words", { limit: 100 });

  return {
    words: res,
  };
};