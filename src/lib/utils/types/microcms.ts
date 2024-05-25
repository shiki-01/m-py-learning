interface GetsType<T> {
  contents: T[];
  totalCount: number;
  offset: number;
  limit: number;
}
type DateType = {
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  revisedAt: string;
};
type Structure<T, P> = T extends 'get'
  ? { id: string } & DateType & Required<P>
  : T extends 'gets'
  ? GetsType<{ id: string } & DateType & Required<P>>
  : Partial<DateType> & (T extends 'patch' ? Partial<P> : P);

export type Words<T extends 'get'> = Structure<T, {
  title: string;
  tag?: string[];
  descriptionS?: string;
  descriptionL?: string;
}>;

export type Quests<T extends 'get'> = Structure<T, {
  title: string;
  tag?: string[];
  descriptionS?: string;
  descriptionL?: string;
}>;

export type Docs<T extends 'get'> = Structure<T, {
  title: string;
  tag?: string[];
  descriptionS?: string;
  descriptionL?: string;
}>;

export interface EndPoints {
  get: {
    words: Words<'get'>;
    quests: Quests<'get'>;
    docs: Docs<'get'>;
  }
  gets: {
    words: Words<'get'>;
    quests: Quests<'get'>;
    docs: Docs<'get'>;
  }
  post: {
    words: Words<'get'>;
    quests: Quests<'get'>;
    docs: Docs<'get'>;
  }
  put: {
    words: Words<'get'>;
    quests: Quests<'get'>;
    docs: Docs<'get'>;
  }
  patch: {
    words: Words<'get'>;
    quests: Quests<'get'>;
    docs: Docs<'get'>;
  }
}
