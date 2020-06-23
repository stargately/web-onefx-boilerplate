import { Query, Resolver } from "type-graphql";

@Resolver()
export class MetaResolver {
  @Query(() => String, { description: "is the server healthy?" })
  public async health(): Promise<string> {
    return "OK";
  }
}
