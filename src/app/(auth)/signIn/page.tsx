'use client'
import styles from "../auth.module.css"
import AppButton from "@/app/components/AppButton/AppButton";
import Link from "next/link";
import { useFormState } from "react-dom";
import { login } from "@/app/actions/auth";

//https://scryfall.com/docs/api/cards/search
//https://scryfall.com/docs/syntax
//https://github.com/ChiriVulpes/scryfall-sdk/blob/main/DOCUMENTATION.md#cardssearch-query-string-options-searchoptions--number-magicemittercard-

export default function Home() {
  const [state, action, pending] = useFormState(login, undefined);

  return (
    <form action={action}>
      {state?.message && <p className={styles.err}>{state.message}</p>}
      <input name="email" type="email" placeholder="Email"/>
      {state?.errors?.email && <p className={styles.err}>{state.errors.email}</p>}
      <input name="password" type="password" placeholder="Password"/>
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
      <AppButton aria-disabled={pending} text={pending ? 'Submitting...' : 'Sign in'}/>
      <Link className={styles.link} href="/signUp">New User</Link>
    </form>
  )
}
