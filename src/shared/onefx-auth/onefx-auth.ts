import { Server } from "onefx";
import { logger } from "onefx/lib/integrated-gateways/logger";
import { Context, Dict } from "onefx/lib/types";
import koa from "koa";
import { MyServer } from "@/server/start-server";
import {
  AuthConfig,
  allowedLoginNext,
  allowedLogoutNext,
  authConfig,
} from "./auth-config";
import { Mailgun } from "./mailgun";
import { EmailTokenModel } from "./model/email-token-model";
import { JwtModel } from "./model/jwt-model";
import { UserModel } from "./model/user-model";
import { getExpireEpochDays } from "./utils/expire-epoch";

export class OnefxAuth {
  public config: AuthConfig;

  public server: Server;

  public user: UserModel;

  public jwt: JwtModel;

  public emailToken: EmailTokenModel;

  public mailgun: Mailgun;

  constructor(server: MyServer, config: AuthConfig) {
    this.config = config || authConfig;
    this.server = server;
    const { mongoose } = server.gateways;
    this.user = new UserModel({ mongoose });
    this.jwt = new JwtModel({
      mongoose,
      secret: this.config.secret,
      expDays: this.config.ttl,
    });
    this.emailToken = new EmailTokenModel({
      mongoose,
      expMins: config.emailTokenTtl,
    });
    this.mailgun = new Mailgun(config.mailgun);
    this.config.cookieOpts = {
      ...this.config.cookieOpts,
      expires: new Date(getExpireEpochDays(this.config.ttl)),
    };
  }

  public async sendResetPasswordLink(
    userId: string,
    email: string,
    t: (msgKey: string, data?: Dict) => string
  ): Promise<void> {
    const { token } = await this.emailToken.newAndSave(userId);
    const link = `${this.config.emailTokenLink}${token}`;
    logger.debug(`sending out password reset email ${link}`);

    const emailContent = t("auth/forgot_password.email_content", { link });
    await this.mailgun.sendMail({
      from: `"${t("meta.title")}" <noreply@${this.config.mailgun.domain}>`,
      to: email,
      subject: t("auth/forgot_password.email_title"),
      html: emailContent,
    });
  }

  public authRequired = async (ctx: Context, next: koa.Next): Promise<void> => {
    await this.authOptionalContinue(ctx, async () => undefined);
    const { userId } = ctx.state;
    if (!userId) {
      logger.debug("user is not authenticated but auth is required");
      ctx.redirect(
        `${this.config.loginUrl}?next=${encodeURIComponent(ctx.url)}`
      );
      return;
    }

    logger.debug(`user is authenticated ${userId}`);
    await next();
  };

  public authOptionalContinue = async (
    ctx: Context,
    next: koa.Next
  ): Promise<void> => {
    const token = this.tokenFromCtx(ctx);
    if (token) {
      ctx.state.userId = await this.jwt.verify(token);
      ctx.state.jwt = token;
    }
    await next();
  };

  public logout = async (ctx: Context): Promise<void> => {
    ctx.cookies.set(this.config.cookieName, "", this.config.cookieOpts);
    const token = this.tokenFromCtx(ctx);
    if (token) {
      setTimeout(async () => {
        await this.jwt.revoke(token);
      }, 0);
    }
    ctx.redirect(allowedLogoutNext(ctx.query.next));
  };

  public postAuthentication = async (ctx: Context): Promise<void> => {
    if (!ctx.state.userId) {
      return;
    }

    logger.debug(`user ${ctx.state.userId} is in post authentication status`);

    const token = await this.jwt.create(ctx.state.userId);
    ctx.cookies.set(this.config.cookieName, token, this.config.cookieOpts);
    ctx.state.jwt = token;
    const nextUrl = allowedLoginNext(
      ctx.query.next || (ctx.request.body && ctx.request.body.next)
    );
    if (ctx.is("json")) {
      ctx.body = { shouldRedirect: true, ok: true, next: nextUrl };
      return;
    }
    ctx.redirect(nextUrl);
  };

  public recordUserLocale = async (
    ctx: Context,
    next: koa.Next
  ): Promise<void> => {
    if (!ctx.state.userId) {
      return;
    }
    // https://github.com/jeresig/i18n-node-2#getlocale defaultLocale='en'
    const locale = ctx.i18n.getLocale();
    logger.debug(`user ${ctx.state.userId} locale: ${locale}`);
    this.user.updateLocale(ctx.state.userId, locale);
    await next();
  };

  public tokenFromCtx = (ctx: Context): string => {
    let token = ctx.cookies.get(this.config.cookieName, this.config.cookieOpts);
    if (!token && ctx.headers.authorization) {
      token = String(ctx.headers.authorization).replace("Bearer ", "");
    }
    return token || "";
  };
}
