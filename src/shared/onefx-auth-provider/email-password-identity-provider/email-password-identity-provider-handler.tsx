import { MyServer } from "@/server/start-server";
import koa from "koa";
import { noopReducer } from "onefx/lib/iso-react-render/root/root-reducer";
import { createRateLimiter } from "onefx/lib/middleware/rate-limiter-middleware";
import { Context } from "onefx/lib/types";
import * as React from "react";
import validator from "validator";
import { IdentityAppContainer } from "./view/identity-app-container";

const PASSWORD_MIN_LENGTH = 8;

type Handler = (ctx: Context, next: koa.Next) => Promise<void>;

export function emailValidator(): Handler {
  return async (ctx: Context, next: koa.Next) => {
    let { email } = ctx.request.body;
    email = String(email).toLowerCase();
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

    ctx.request.body.email = email;
    await next();
  };
}

export function passwordValidator(): Handler {
  return async (ctx: Context, next: koa.Next) => {
    let { password } = ctx.request.body;
    password = String(password);
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

    ctx.request.body.password = password;
    await next();
  };
}

function isoRender(ctx: Context): void {
  ctx.body = ctx.isoReactRender({
    VDom: <IdentityAppContainer />,
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
      const { token } = ctx.query;
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
      const { email, password } = ctx.request.body;
      const locale = ctx.i18n.getLocale();
      try {
        const user = await server.auth.user.newAndSave({
          email,
          password,
          locale,
          ip: ctx.headers["x-forwarded-for"],
        });
        ctx.state.userId = user._id;
        await next();
      } catch (err) {
        if (err.name === "MongoError" && err.code === 11000) {
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
    createRateLimiter(server, {
      name: "api-sign-in",
      generateKey(ctx) {
        return ctx.request.ip;
      },
      // interval: Time Type - how long should records of requests be kept in memory. Defaults to 60000 (1 minute).
      interval: 60000,
      // max number of connections during interval milliseconds before sending a 429 response code. Defaults to 5. Set to 0 to disable.
      max: 5,
    }),
    async (ctx: Context, next: koa.Next) => {
      const { email, password } = ctx.request.body;
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
      const { email } = ctx.request.body;

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
      const { token, password, newPassword } = ctx.request.body;
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
