export type Token =
  | { type: 'plain' | 'phrase' | 'or' | 'exclude' | 'leftParen' | 'rightParen'; value: string }
  | { type: 'field'; field: string; value: string };