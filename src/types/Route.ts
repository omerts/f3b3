// @ts-ignore
import { ParsedQuery } from 'query-string'

export interface Route {
  path: string
  query: ParsedQuery
  previousRoute: Route
  state: {
    skipRouterService?: boolean
  }
  initialRoute: Location
}
