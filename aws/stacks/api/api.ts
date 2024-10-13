import { Api, use, type StackContext } from 'sst/constructs';
import { DefaultLambdaRoleStack } from './iam-roles/default-lambda-role';

export function ApiStack(context: StackContext) {
  const { defaultLambdaRole } = use(DefaultLambdaRoleStack);

  const apiStack = new Api(context.stack, 'Api', {
    defaults: { function: { role: defaultLambdaRole } },
  });

  context.stack.addOutputs({ ApiEndpoint: apiStack.url });

  return { apiStack };
}
