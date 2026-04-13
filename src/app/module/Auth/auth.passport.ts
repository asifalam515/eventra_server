import passport from "passport";
import FacebookTokenStrategy from "passport-facebook-token";
import { Strategy as LocalStrategy } from "passport-local";
import { AuthService } from "./auth.service";

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      session: false,
    },
    async (email, password, done) => {
      try {
        const user = await AuthService.validateLocalCredentials(
          email,
          password,
        );
        return done(null, user);
      } catch (error: any) {
        return done(null, false, {
          message: error?.message || "Invalid email or password",
        });
      }
    },
  ),
);

passport.use(
  new FacebookTokenStrategy(
    {
      clientID: process.env.FACEBOOK_APP_ID || "",
      clientSecret: process.env.FACEBOOK_APP_SECRET || "",
      profileFields: ["id", "emails", "name", "displayName", "photos"],
      fbGraphVersion: "v20.0",
    },
    async (
      accessToken: string,
      refreshToken: string,
      profile: unknown,
      done: (
        error: any,
        user?: false | object,
        info?: { message?: string },
      ) => void,
    ) => {
      try {
        const user = await AuthService.findOrCreateFacebookUser(profile as any);
        return done(null, user);
      } catch (error: any) {
        return done(null, false, {
          message: error?.message || "Facebook authentication failed",
        });
      }
    },
  ),
);

export default passport;
