export const STAGES = {
  Dev: 'dev',
  Prod: 'prod',
  Test: 'test',
} as const;

export type Stage = (typeof STAGES)[keyof typeof STAGES];
export type StageKey = keyof typeof STAGES;
