import { canActivateAuth } from "./lib/auth/access.guard";
import { Auth } from "./lib/auth/auth";
import { authTokenInterceptor } from "./lib/auth/auth.interceptor";
export * from './lib/feature-login'

export {
  canActivateAuth,
  authTokenInterceptor,
  Auth
}
