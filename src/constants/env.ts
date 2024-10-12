export const STAGES = {
  Dev: 'dev',
  Prod: 'prod',
  DevInfra: 'dev-infra',
  ProdInfra: 'prod-infra',
} as const;

export type StageKey = keyof typeof STAGES;
export type Stage = (typeof STAGES)[StageKey];
