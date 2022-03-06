export interface Route {
  path: string
  query: any
  previousRoute: Route
  state: {
    skipRouterService?: boolean
  }
  initialRoute: Location
}
//# sourceMappingURL=Route.d.ts.map
