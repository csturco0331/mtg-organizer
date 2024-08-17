'use client'
import styles from '../auth.module.css'
import { signUp } from "@/app/actions/auth";
import AppButton from "@/app/components/AppButton/AppButton";
import Link from "next/link";
import { useFormState } from "react-dom";

//https://scryfall.com/docs/api/cards/search
//https://scryfall.com/docs/syntax
//https://github.com/ChiriVulpes/scryfall-sdk/blob/main/DOCUMENTATION.md#cardssearch-query-string-options-searchoptions--number-magicemittercard-

export default function SignUp() {
    const [state, action, pending] = useFormState(signUp, undefined);
 
  return (
    <form action={action}>
      <input id="username" name="username" placeholder="Username" />
      {state?.errors?.username && <p className={styles.err}>{state.errors.username}</p>}
 
      <input id="email" name="email" placeholder="Email" />
      {state?.errors?.email && <p className={styles.err}>{state.errors.email}</p>}
 
      <input id="password" name="password" type="password" placeholder="Password" />
      {state?.errors?.password && (
        <div>
          <p className={styles.err}>Password must:</p>
          <ul>
            {state.errors.password.map((error) => (
              <li key={error} className={styles.err}>{error}</li>
            ))}
          </ul>
        </div>
      )}
      <AppButton aria-disabled={pending} text={pending ? 'Submitting...' : 'Sign up'}/>
      <Link className={styles.link} href="/signIn">Sign In</Link>
    </form>
  )
}
