import {
  Effect,
  ManagedPolicy,
  PolicyDocument,
  PolicyStatement,
  Role,
  ServicePrincipal,
} from 'aws-cdk-lib/aws-iam';
import { type StackContext } from 'sst/constructs';

export function DefaultLambdaRoleStack(context: StackContext) {
  const defaultPolicy = new PolicyStatement({
    effect: Effect.ALLOW,
    actions: ['lambda:InvokeFunction'],
    resources: ['*'],
  });

  const networkInterfacePolicy = new PolicyStatement({
    effect: Effect.ALLOW,
    actions: [
      'ec2:CreateNetworkInterface',
      'ec2:DescribeNetworkInterfaces',
      'ec2:DeleteNetworkInterface',
    ],
    resources: ['*'],
  });

  const defaultLambdaRole = new Role(context.stack, 'DefaultLambdaRole', {
    assumedBy: new ServicePrincipal('lambda.amazonaws.com'),
    managedPolicies: [
      ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSLambdaBasicExecutionRole'),
    ],
    inlinePolicies: {
      invokeFunction: new PolicyDocument({ statements: [defaultPolicy, networkInterfacePolicy] }),
    },
  });

  return { defaultLambdaRole };
}
