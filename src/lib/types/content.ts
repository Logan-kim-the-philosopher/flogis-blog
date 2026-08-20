import type { Person } from './common';

export type BaseEntry = {
  _id: string;
  _type: 'study' | 'work' | 'meeting';
  title: string;
  slug: string;
  coverImage: string;
  publishedAt: string;
  tags?: string[];
  body: string;
};

export type Study = BaseEntry & {
  _type: 'study';
  authors: Person[];
};

export type Work = BaseEntry & {
  _type: 'work';
  authors: Person[];
};

export type Meeting = BaseEntry & {
  _type: 'meeting';
  participants: Person[];
};

export type ContentEntry = Study | Work | Meeting;

export type Episode = Study;
export type Article = Work;
export type Interview = Meeting;
