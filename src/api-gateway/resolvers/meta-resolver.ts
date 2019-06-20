import { Query, Resolver, ResolverInterface } from "type-graphql";

@Resolver(_ => String)
export class MetaResolver implements ResolverInterface<() => String> {
  @Query(_ => String, { description: "is the server healthy?" })
  public async health(): Promise<string> {
    return "OK";
  }
}
