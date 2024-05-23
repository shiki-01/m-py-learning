type GetsType<T> = {
    contents: T[];
    totalCount: number;
    offset: number;
    limit: number;
  };
  type DateType = {
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
    revisedAt: string;
  };
  type Structure<T, P> = T extends "get"
    ? { id: string } & DateType & Required<P>
    : T extends "gets"
      ? GetsType<{ id: string } & DateType & Required<P>>
      : Partial<DateType> & (T extends "patch" ? Partial<P> : P);
  
  export type Words<T = "get"> = Structure<
    T,
    {
      /**
       * タイトル
       */
      title: string;
      /**
       * 説明
       */
      descriptionS?: string;
      descriptionL?: string;
      /**
       * タグ
       */
      tag?: (
        | "section1"
        | "section2"
      )[];
      /**
       * 本文
       */
      example?: any;
    }
  >;

  export type Docs<T = "get"> = Structure<
    T,
    {
      /**
       * タイトル
       */
      title: string;
      /**
       * 説明
       */
      descriptionS?: string;
      descriptionL?: string;
      /**
       * タグ
       */
      tag?: (
        | "section1"
        | "section2"
      )[];
      /**
       * 本文
       */
      example?: any;
    }>;

    export type Quests<T = "get"> = Structure<
      T,
      {
        /**
         * タイトル
         */
        title: string;
        premiss?: string;
        debug?: string;
        /**
         * タグ
         */
        tag?: [];
      }>;
  
  export type EndPoints = {
    get: {
      words: Words<"get">;
      docs: Docs<"get">;
      quests: Quests<"get">;
    };
    gets: {
      words: Words<"gets">;
      docs: Docs<"gets">;
      quests: Quests<"gets">;
    };
    post: {
      words: Words<"post">;
    };
    put: {
      words: Words<"put">;
    };
    patch: {
      words: Words<"patch">;
    };
  };
  