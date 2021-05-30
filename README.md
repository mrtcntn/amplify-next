[![Open Source Love svg1](https://badges.frapsoft.com/os/v1/open-source.svg?v=103)](https://github.com/ellerbrock/open-source-badges/)

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app),
following the steps from [Nader Dabit's Next.js Amplify Workshop](https://nextjs.org/). You can check it out to create your Amplify stack and run the project.

You can see the live preview at https://main.d6sa4tyuglhx9.amplifyapp.com/.

## Features
- Written entirely in TypeScript. AWS Amplify features are used.
- Since GraphQL query and result types are not comfortable to use ([stated in AWS Amplify API documentation](https://docs.amplify.aws/lib/graphqlapi/query-data/q/platform/js#simple-query)),
I have been inspired from [this solution](https://github.com/aws-amplify/amplify-js/issues/6369#issuecomment-751412384) from [hukpavlo](https://github.com/hukpavlo) and wrapped AWS Amplify API GraphQL functionality under a class with static methods. 
- I have experienced a memory leak while dealing with [this part](https://github.com/dabit3/next.js-amplify-workshop#updating-the-nav) -where we attach a listener to Hub to listen auth events-, then I searched the web an found [this solution](https://dev.to/uclusionhq/stopping-memory-leaks-in-aws-amplify-hub-3f9c) from [Uclusion](https://www.uclusion.com/) to keep track of the listeners we currently use.
- The project was deployed using [Next.js Plugin for Serverless Framework](https://www.serverless.com/plugins/serverless-nextjs-plugin), however CI/CD is not straightforward in that path (there is a [solution](https://github.com/bhall2001/serverless-nextjs-github-ci-cd) by [bhall2001](https://github.com/bhall2001/)) I have prefered using AWS Amplify for deployment too.
- ESLint and Prettier configuration added.

## Issues and future work
- There is still a memory leak that sometimes crashes the app on the development mode (OS: Windows 10, Node v14 LTS). That is most probably OS dependent and is stated as issues in multiple places ([here](https://github.com/dabit3/next.js-amplify-workshop/issues/5) and [here](https://github.com/aws-amplify/amplify-console/issues/1180)).
- There is no restriction to use [Image Optimization](https://nextjs.org/docs/basic-features/image-optimization) (a feature of Next.js). Further work may include it.
- An admin UI can be developed in the future, to practice features about user groups and user roles of AWS DynamoDB. 

