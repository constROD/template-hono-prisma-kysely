const CORE_STAGES = {
  Dev: 'dev',
  Staging: 'staging',
  Prod: 'prod',
} as const;

const API_TEST_STAGES = {
  DevApiTest: 'dev-api-test',
  StagingApiTest: 'staging-api-test',
  ProdApiTest: 'prod-api-test',
} as const;

const LOCAL_STAGES = {
  BossRod: 'bossrod',
} as const;

export const STAGES = {
  ...CORE_STAGES,
  ...API_TEST_STAGES,
  ...LOCAL_STAGES,
} as const;

export type StageKey = keyof typeof STAGES;
export type Stage = (typeof STAGES)[StageKey];

export type CoreStage = (typeof CORE_STAGES)[keyof typeof CORE_STAGES];
export type LocalStage = (typeof LOCAL_STAGES)[keyof typeof LOCAL_STAGES];
export type ApiTestStage = (typeof API_TEST_STAGES)[keyof typeof API_TEST_STAGES];
export type InfraStage = `${CoreStage}-infra` | `${LocalStage}-infra`;

export function isCoreStage(stage: string): boolean {
  return Object.values(CORE_STAGES).includes(stage as CoreStage);
}

export function isLocalStage(stage: string): boolean {
  return Object.values(LOCAL_STAGES).includes(stage as LocalStage);
}

export function isApiTestStage(stage: string): boolean {
  return Object.values(API_TEST_STAGES).includes(stage as ApiTestStage);
}

export function isInfraStage(stage: string): boolean {
  const coreStages = Object.values(CORE_STAGES).map(stage => `${stage}-infra`);
  const localStages = Object.values(LOCAL_STAGES).map(stage => `${stage}-infra`);
  const infraStages = [...coreStages, ...localStages];
  return infraStages.includes(stage);
}
