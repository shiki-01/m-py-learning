import type { PageServerLoad } from "./$types";
import { getContentList } from "$lib/utils/services/microcms";

export const load: PageServerLoad = async () => {
  const res = await getContentList("words");

  return {
    words: res,
  };
};