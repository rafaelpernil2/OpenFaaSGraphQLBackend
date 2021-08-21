import { IResolvers } from "graphql-tools";
import { AuthenticateResponse, MutationRegisterArgs, QueryLoginArgs } from "graphql-root/generated";
import { ResultModel } from "../generated"
import { PubSubSingleton } from "../PubSubSingleton";
export const UserResolvers: IResolvers = {
    Query: {
        async login(_: void, args: QueryLoginArgs, { pubsub }): Promise<AuthenticateResponse> {
            // First test :D
            const output = (await ResultModel.findOne({ id: 1 }).exec()) as any;
            console.log("Result from database", output?.result);
            return { token: output?.result }
        }
    },
    Mutation: {
        async register(_: void, args: MutationRegisterArgs): Promise<AuthenticateResponse> {
            return { token: "Registered :D" }
        }
    },
    Subscription: {
        newUpdate: {
            subscribe: () => PubSubSingleton.getInstance().asyncIterator("TEST")
        }
    }
}