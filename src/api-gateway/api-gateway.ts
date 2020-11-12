import { ApolloServer } from "apollo-server-koa";
import path from "path";
import "reflect-metadata";
import { buildSchema } from "type-graphql";
import { AddNumResolver } from "@/api-gateway/resolvers/add-num-resolver";
import { MyServer } from "@/server/start-server";
import { MetaResolver } from "./resolvers/meta-resolver";

export async function setApiGateway(server: MyServer): Promise<void> {
  const resolvers = [MetaResolver, AddNumResolver];
  server.resolvers = resolvers;

  const sdlPath = path.resolve(__dirname, "api-gateway.graphql");
  const schema = await buildSchema({
    resolvers,
    emitSchemaFile: {
      path: sdlPath,
      commentDescriptions: true,
    },
    validate: false,
  });

  const apollo = new ApolloServer({
    schema,
    introspection: true,
    playground: true,
    context: async () => ({}),
  });
  const gPath = `${server.config.server.routePrefix || ""}/api-gateway/`;
  apollo.applyMiddleware({ app: server.app, path: gPath });
}
