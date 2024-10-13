import { STAGES } from '@/constants/env';
import { envConfig } from '@/env';
import { RemovalPolicy } from 'aws-cdk-lib';
import { ApiStack } from 'aws/stacks/api/api';
import { ApiDocumentationRoutesStack } from 'aws/stacks/api/api-documentation';
import { MeRoutesStack } from 'aws/stacks/api/me';
import { ProductsRoutesStack } from 'aws/stacks/api/products';
import { ServerRoutesStack } from 'aws/stacks/api/server';
import { UsersRoutesStack } from 'aws/stacks/api/users';
import { DefaultLambdaRoleStack } from 'aws/stacks/iam-roles/default-lambda-role';
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
    if (app.stage !== STAGES.Prod && app.stage !== STAGES.ProdInfra) {
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

    /* Stateful Stacks */
    // if (app.stage !== STAGES.DevInfra && app.stage !== STAGES.ProdInfra) {
    //   app.stack(RDSStack);
    //   app.stack(CognitoStack);
    // }

    /* Stateless Stacks */
    app.stack(DefaultLambdaRoleStack);
    app.stack(ApiStack);
    app.stack(MeRoutesStack);
    app.stack(ServerRoutesStack);
    app.stack(ApiDocumentationRoutesStack);
    app.stack(ProductsRoutesStack);
    app.stack(UsersRoutesStack);
  },
} satisfies SSTConfig;
