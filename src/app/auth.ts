import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { authorize } from './actions/auth'

export const { handlers, signIn, signOut, auth } = NextAuth({
  session: {
    strategy: 'jwt'
  },
  secret: process.env.SESSION_SECRET,
  providers: [
    Credentials({
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      credentials: {
        email: {label: 'Email', type: 'email', required: true},
        password: {label: 'Password', type: 'password', required: true},
      },
      authorize: authorize
    }),
  ],
  callbacks: {
    async jwt({token, user}) {
      if (user) {
        console.log('returning modified token')
        return {
          ...token,
          username: user.username,
          _id: user._id
        }
      }
      console.log('returning default token')
      return token
    },
    async session({session, user, token}) {
      return {
        ...session,
        user: {
          ...session.user,
          username: token.username,
          _id: token._id
        }
      }
    }
  }
})