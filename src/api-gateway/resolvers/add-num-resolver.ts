import {
  Args,
  ArgsType,
  Field,
  Int,
  Mutation,
  Query,
  Resolver,
} from "type-graphql";

let num = 0;

@ArgsType()
class AddNumRequest {
  @Field(() => Int)
  inc: number;
}

@Resolver()
export class AddNumResolver {
  @Query(() => Int)
  async currentNum(): Promise<number> {
    return num;
  }

  @Mutation(() => Int)
  async addNum(@Args() val: AddNumRequest): Promise<number> {
    num += val.inc;
    return num;
  }
}
