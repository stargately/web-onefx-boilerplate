/* tslint:disable:no-any */
import { OnefxAuth } from "onefx-auth";
import { Model } from "@/model/model";
import { Gateways } from "@/server/gateway/gateway";

export interface IContext {
  userId: string;
  session: any;
  model: Model;
  gateways: Gateways;
  auth: OnefxAuth;
  reqHeaders: Record<string, string>;
}
