import { API, graphqlOperation } from '@aws-amplify/api';
import { GraphQLOptions, GRAPHQL_AUTH_MODE } from '@aws-amplify/api-graphql';

// https://github.com/aws-amplify/amplify-js/issues/6369#issuecomment-751412384

export class CustomAPI {
  public static async query<R extends any | any[], V = GraphQLOptions['variables'], A = GraphQLOptions['authMode']>(query: string, variables?: V, authMode?: A) {
    try {
      return await this.makeRequest<R extends any[] ? { items: R; nextToken: string | null } : R>(query, variables, authMode);
    } catch (err) {
      console.error(err);
      throw new Error('Api query error');
    }
  }

  public static async mutate<V extends GraphQLOptions['variables'], R = any, A = GraphQLOptions['authMode']>(query: string, variables: V, authMode?: A) {
    try {
      return await this.makeRequest<R>(query, variables, authMode);
    } catch (err) {
      console.error(err);
      throw new Error('Api mutate error');
    }
  }

  private static async makeRequest<R>(query: string, variables?: any, authMode?: any): Promise<R> {
        const { data } = await API.graphql({ query, variables, authMode }) as any;
        return data[Object.keys(data)[0]];
  }
}