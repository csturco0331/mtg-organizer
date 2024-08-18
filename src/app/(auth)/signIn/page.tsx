'use client'
import styles from "../auth.module.css"
import { login } from "./actions";
import AppButton from "@/app/components/AppButton/AppButton";
import Link from "next/link";
import { useFormState } from "react-dom";

//https://scryfall.com/docs/api/cards/search
//https://scryfall.com/docs/syntax
//https://github.com/ChiriVulpes/scryfall-sdk/blob/main/DOCUMENTATION.md#cardssearch-query-string-options-searchoptions--number-magicemittercard-

export default function Home() {
  const [state, action, pending] = useFormState(login, undefined);

  return (
    <form action={action}>
      {state?.message && <p className={styles.err}>{state.message}</p>}
      <input name="email" type="email" placeholder="Email"/>
      <input name="password" type="password" placeholder="Password"/>
      <AppButton text="Sign in"/>
      <Link className={styles.link} href="/signUp">New User</Link>
    </form>
  )
}
