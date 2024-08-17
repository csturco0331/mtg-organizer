import {Session} from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {

    interface Session extends DefaultSession {
        user: DefaultSession["user"] & {
          id: string;
          // ...other properties
          username?: string;
          // role: UserRole;
        };
      }
    
      interface User extends DefaultUser {
        _id: string;
        username: string;
        // ...other properties
        // role: UserRole;
      }
}