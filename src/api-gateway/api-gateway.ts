import { ApolloServer } from "apollo-server-koa";
import path from "path";
import "reflect-metadata";
import { buildSchema } from "type-graphql";
import { AddNumResolver } from "@/api-gateway/resolvers/add-num-resolver";
import { MyServer } from "@/server/start-server";
import { NonEmptyArray } from "type-graphql/dist/interfaces/NonEmptyArray";
import { MetaResolver } from "./resolvers/meta-resolver";

export async function setApiGateway(server: MyServer): Promise<void> {
  const resolvers: NonEmptyArray<Function> = [MetaResolver, AddNumResolver];
  server.resolvers = resolvers;

  const sdlPath = path.resolve(__dirname, "api-gateway.graphql");
  const schema = await buildSchema({
    resolvers,
    emitSchemaFile: {
      path: sdlPath,
      commentDescriptions: true,
    },
    validate: false,
    nullableByDefault: true,
  });

  const apollo = new ApolloServer({
    schema,
    introspection: true,
    playground: {
      settings: {
        "request.credentials": "include",
      },
    },
    context: async () => ({}),
  });
  const gPath = `${server.config.server.routePrefix || ""}/api-gateway/`;
  apollo.applyMiddleware({ app: server.app, path: gPath });
}
