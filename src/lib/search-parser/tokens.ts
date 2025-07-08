export type Token =
  | { type: 'plain' | 'phrase' | 'or' | 'exclude' | 'leftParen' | 'rightParen' | 'colon'; value: string }