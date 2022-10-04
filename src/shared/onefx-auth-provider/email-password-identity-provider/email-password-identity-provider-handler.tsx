import { MyServer } from "@/server/start-server";
import { ThemeProvider } from "@/shared/common/styles/theme-provider";
import koa from "koa";
import { logger } from "onefx/lib/integrated-gateways/logger";
import { noopReducer } from "onefx/lib/iso-react-render/root/root-reducer";
import { Context } from "onefx/lib/types";
import * as React from "react";
import validator from "validator";
import { IdentityAppContainer } from "./view/identity-app-container";

const PASSWORD_MIN_LENGTH = 8;

type Handler = (ctx: Context, next: koa.Next) => Promise<void>;

export function emailValidator(): Handler {
  return async (ctx: Context, next: koa.Next) => {
    const body = ctx.request.body as Record<string, string>;
    let email = String(body.email || "").toLowerCase();
    email = validator.trim(email);
    if (!validator.isEmail(email)) {
      ctx.response.body = {
        ok: false,
        error: {
          code: "auth/invalid-email",
          message: ctx.t("auth/invalid-email"),
        },
      };
      return;
    }

    body.email = email;
    await next();
  };
}

export function passwordValidator(): Handler {
  return async (ctx: Context, next: koa.Next) => {
    const body = ctx.request.body as Record<string, string>;
    const password = String(body.password || "");
    if (password.length < PASSWORD_MIN_LENGTH) {
      ctx.response.body = {
        ok: false,
        error: {
          code: "auth/weak-password",
          message: ctx.t("auth/weak-password"),
        },
      };
      return;
    }

    body.password = password;
    await next();
  };
}

function isoRender(ctx: Context): void {
  ctx.setState("base.nonce", ctx.state.nonce);
  ctx.body = ctx.isoReactRender({
    VDom: (
      <ThemeProvider>
        <IdentityAppContainer />
      </ThemeProvider>
    ),
    reducer: noopReducer,
    clientScript: "/identity-provider-main.js",
  });
}

export function setEmailPasswordIdentityProviderRoutes(server: MyServer): void {
  // view routes
  server.get(
    "login",
    "/login",
    // server.auth.authOptionalContinue,
    async (ctx: Context) => {
      ctx.setState("base.next", ctx.query.next);
      ctx.setState("base.userId", ctx.state.userId);
      return isoRender(ctx);
    }
  );
  server.get(
    "sign-up",
    "/sign-up",
    // server.auth.authOptionalContinue,
    async (ctx: Context) => {
      ctx.setState("base.next", ctx.query.next);
      ctx.setState("base.userId", ctx.state.userId);
      return isoRender(ctx);
    }
  );
  server.get(
    "forgot-password",
    "/forgot-password",
    // server.auth.authOptionalContinue,
    async (ctx: Context) => {
      ctx.setState("base.next", ctx.query.next);
      ctx.setState("base.userId", ctx.state.userId);
      return isoRender(ctx);
    }
  );
  server.get(
    "reset-password",
    "/settings/reset-password",
    async (ctx: Context) => {
      const { token } = ctx.query as Record<string, string>;
      const found = await server.auth.emailToken.findOne(token);
      ctx.setState("base.token", found && found.token);
      return isoRender(ctx);
    }
  );
  server.get("logout", "/logout", server.auth.logout);
  server.get(
    "email-token",
    "/email-token/:token",
    async (ctx: Context, next: koa.Next): Promise<void> => {
      const et = await server.auth.emailToken.findOneAndDelete(
        ctx.params.token
      );
      if (!et || !et.userId) {
        isoRender(ctx);
        return;
      }

      const newToken = await server.auth.emailToken.newAndSave(et.userId);
      ctx.query.next = `/settings/reset-password/?token=${encodeURIComponent(
        newToken.token
      )}`;
      ctx.state.userId = et.userId;
      await next();
    },
    server.auth.postAuthentication
  );

  // API routes
  server.post(
    "api-sign-up",
    "/api/sign-up/",
    emailValidator(),
    passwordValidator(),
    async (ctx: Context, next: koa.Next) => {
      const { email, password } = ctx.request.body as Record<string, string>;
      const locale = ctx.i18n.getLocale();
      try {
        const user = await server.auth.user.newAndSave({
          email,
          password,
          locale,
          ip: ctx.ip,
        });
        ctx.state.userId = user._id;
        await next();
      } catch (err) {
        if (err.code === 11000) {
          ctx.body = {
            ok: false,
            error: {
              code: "auth/email-already-in-use",
              message: ctx.t("auth/email-already-in-use"),
            },
          };
        } else {
          logger.error(`failed to create user`, { meta: err });
          ctx.body = {
            ok: false,
            error: {
              code: "auth/email-already-in-use",
              message: ctx.t("auth/email-already-in-use"),
            },
          };
        }
      }
    },
    server.auth.postAuthentication
  );

  server.post(
    "api-sign-in",
    "/api/sign-in/",
    emailValidator(),
    async (ctx: Context, next: koa.Next) => {
      const { email, password } = ctx.request.body as Record<string, string>;
      const user = await server.auth.user.getByMail(email);
      if (!user) {
        ctx.response.body = {
          ok: false,
          error: {
            code: "auth/user-not-found",
            message: ctx.t("auth/user-not-found"),
          },
        };
        return;
      }
      const isPasswordVerified = await server.auth.user.verifyPassword(
        user._id,
        password
      );
      if (!isPasswordVerified) {
        ctx.response.body = {
          ok: false,
          error: {
            code: "auth/wrong-password",
            message: ctx.t("auth/wrong-password"),
          },
        };
        return;
      }
      if (user.isBlocked) {
        ctx.response.body = {
          ok: false,
          error: {
            code: "auth/user-disabled",
            message: ctx.t("auth/user-disabled"),
          },
        };
        return;
      }
      ctx.state.userId = user._id;
      await next();
    },
    server.auth.recordUserLocale,
    server.auth.postAuthentication
  );

  server.post(
    "api-forgot-password",
    "/api/forgot-password/",
    emailValidator(),
    async (ctx: Context): Promise<void> => {
      const { email } = ctx.request.body as Record<string, string>;

      const user = await server.auth.user.getByMail(email);
      if (user) {
        await server.auth.sendResetPasswordLink(user.id, user.email, ctx.t);
      }

      ctx.response.body = {
        ok: true,
      };
    }
  );

  server.post(
    "reset-password",
    "/api/reset-password/",
    server.auth.authRequired,
    async (ctx: Context): Promise<void> => {
      const { token, password, newPassword } = ctx.request.body as Record<
        string,
        string
      >;
      if (token) {
        const verified = Boolean(await server.auth.emailToken.findOne(token));
        if (!verified) {
          ctx.redirect(`${server.auth.config.emailTokenLink}invalid`);
          return;
        }
      } else {
        const verified = await server.auth.user.verifyPassword(
          ctx.state.userId,
          password
        );
        if (!verified) {
          ctx.response.body = {
            ok: false,
            error: {
              code: "auth/wrong-password",
              message: ctx.t("auth/wrong-password"),
            },
          };
          return;
        }
      }

      if (newPassword.length < PASSWORD_MIN_LENGTH) {
        ctx.response.body = {
          ok: false,
          error: {
            code: "auth/weak-password",
            message: ctx.t("auth/weak-password"),
          },
        };
        return;
      }

      await server.auth.user.updatePassword(ctx.state.userId, newPassword);
      if (token) {
        // forgot password
        ctx.response.body = { ok: true, shouldRedirect: true, next: "/" };
      } else {
        // reset password
        ctx.response.body = { ok: true };
      }
      await server.auth.emailToken.findOneAndDelete(token);
    }
  );
}
