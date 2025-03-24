import { isInfraStage, STAGES } from '@/constants/env';
import { envConfig } from '@/env';
import { RemovalPolicy } from 'aws-cdk-lib';
import { ApiStack } from 'aws/stacks/api/api';
import { ApiDocumentationRoutesStack } from 'aws/stacks/api/api-documentation';
import { FeatureFlagsStack } from 'aws/stacks/api/feature-flags';
import { DefaultLambdaRoleStack } from 'aws/stacks/api/iam-roles/default-lambda-role';
import { MeRoutesStack } from 'aws/stacks/api/me';
import { ProductsRoutesStack } from 'aws/stacks/api/products';
import { ServerRoutesStack } from 'aws/stacks/api/server';
import { UsersRoutesStack } from 'aws/stacks/api/users';
import { SSTConfig } from 'sst';
import { FunctionProps, NodeJSProps } from 'sst/constructs';

export default {
  config(_input) {
    return {
      name: 'bossrod',
      region: 'us-east-1',
    };
  },
  stacks(app) {
    /* Default Settings */
    // const isCore = isCoreStage(app.stage);
    // const isApiTest = isApiTestStage(app.stage);
    const isInfra = isInfraStage(app.stage);

    /* Default Settings */
    if (app.stage !== STAGES.Prod) {
      app.setDefaultRemovalPolicy(RemovalPolicy.DESTROY);
    }

    const esbuild: NodeJSProps['esbuild'] = {
      target: 'node20',
      bundle: true,
      minify: false,
      sourcemap: true,
      external: ['prisma'],
    };
    const defaultFunctionProps: FunctionProps = {
      runtime: 'nodejs20.x',
      nodejs: { esbuild },
      environment: envConfig as unknown as Record<string, string>,
    };
    app.setDefaultFunctionProps(defaultFunctionProps);

    if (isInfra) {
      /* Stateful Stacks */
      // app.stack(RDSStack);
      // app.stack(CognitoStack);
    } else {
      /* Stateless Stacks */
      app.stack(DefaultLambdaRoleStack);
      app.stack(ApiStack);
      app.stack(ApiDocumentationRoutesStack);
      app.stack(ServerRoutesStack);
      app.stack(FeatureFlagsStack);
      app.stack(MeRoutesStack);
      app.stack(UsersRoutesStack);
      app.stack(ProductsRoutesStack);
    }
  },
} satisfies SSTConfig;
