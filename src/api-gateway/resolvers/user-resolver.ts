import {
  Args,
  ArgsType,
  Authorized,
  Ctx,
  Field,
  ObjectType,
  Query,
} from "type-graphql";
import { AuthenticationError } from "apollo-server-errors";
import { IContext } from "@/api-gateway/context";

@ArgsType()
class UserProfileRequest {
  @Field((_) => String, { nullable: true })
  userId?: string;
}

@ObjectType()
class UserProfileResponse {
  @Field((_) => String)
  id: string;

  @Field((_) => String)
  email: string;

  @Field((_) => String)
  locale: string;
}

export class UserResolver {
  @Authorized()
  @Query((_) => UserProfileResponse, {
    description: "get the user",
    nullable: true,
  })
  public async userProfile(
    @Args()
    args: UserProfileRequest,
    @Ctx()
    ctx: IContext
  ): Promise<UserProfileResponse | null> {
    const userId = args.userId ?? ctx.userId;
    if (String(userId) !== String(ctx.userId)) {
      throw new AuthenticationError("not authorized user");
    }
    const user = await ctx.auth.user.getById(userId);
    if (!user) {
      return null;
    }
    return {
      id: user.id,
      email: user.email,
      locale: user.locale,
    };
  }
}
