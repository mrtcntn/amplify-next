import { API } from '@aws-amplify/api'
import { GraphQLOptions, GraphQLResult } from '@aws-amplify/api-graphql'

// https://github.com/aws-amplify/amplify-js/issues/6369#issuecomment-751412384

export class CustomAPI {
  public static async query<R extends Record<string, unknown> | Record<string, unknown>[]>(
    query: string,
    variables?: GraphQLOptions['variables'],
    authMode?: GraphQLOptions['authMode']
  ): Promise<GraphQLResult<R>> {
    try {
      return await this.makeRequest<GraphQLResult<R>>(query, variables, authMode)
    } catch (err) {
      console.error(err)
      throw new Error('Api query error')
    }
  }

  public static async mutate<V extends GraphQLOptions['variables'], R = Record<string, unknown>>(
    query: string,
    variables: V,
    authMode?: GraphQLOptions['authMode']
  ): Promise<GraphQLResult> {
    try {
      return await this.makeRequest<R>(query, variables, authMode)
    } catch (err) {
      console.error(err)
      throw new Error('Api mutate error')
    }
  }

  private static async makeRequest<R>(
    query: string,
    variables?: GraphQLOptions['variables'],
    authMode?: GraphQLOptions['authMode']
  ): Promise<R> {
    const { data } = (await API.graphql({ query, variables, authMode })) as GraphQLResult<R>
    return data[Object.keys(data)[0]]
  }
}
