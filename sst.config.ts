import { STAGES } from '@/constants/env';
import { envConfig } from '@/env';
import { RemovalPolicy } from 'aws-cdk-lib';
import { API } from 'aws/stacks/api';
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
    //   app.stack(RDS);
    //   app.stack(Cognito);
    // }

    /* Stateless Stacks */
    app.stack(API);
  },
} satisfies SSTConfig;
