import { API, graphqlOperation } from '@aws-amplify/api';
import { GraphQLOptions } from '@aws-amplify/api-graphql';

// https://github.com/aws-amplify/amplify-js/issues/6369#issuecomment-751412384

export class CustomAPI {
  public async query<R extends any | any[], V = GraphQLOptions['variables']>(query: string, variables?: V) {
    try {
      return await this.makeRequest<R extends any[] ? { items: R; nextToken: string | null } : R>(query, variables);
    } catch (err) {
      console.error(err);
      throw new Error('Api query error');
    }
  }

  public async mutate<V extends GraphQLOptions['variables'], R = any>(query: string, variables: V) {
    try {
      return await this.makeRequest<R>(query, variables);
    } catch (err) {
      console.error(err);
      throw new Error('Api mutate error');
    }
  }

  private async makeRequest<R>(query: string, variables?: any): Promise<R> {
    const { data } = await API.graphql(graphqlOperation(query, variables)) as any;

    return data[Object.keys(data)[0]];
  }
}