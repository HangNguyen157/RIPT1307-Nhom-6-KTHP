export type TagCategory =
  | 'language'
  | 'framework'
  | 'subject'
  | 'database'
  | 'field'
  | 'tool'
  | 'concept';

export interface Tag {
  name: string;
  count: number;
  color: string;
  category: TagCategory;
  desc: string;
}
