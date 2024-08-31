'use client'
import styles from "../auth.module.css"
import AppButton from "@/app/components/AppButton/AppButton";
import Link from "next/link";
import { useFormState } from "react-dom";
import { login } from "@/app/actions/auth";
import { FormState } from "@/app/lib/definitions";
import { UserContext } from "@/app/components/Providers/UserProvider/UserProvider";
import { useContext } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [state, action, pending] = useFormState(userLogin, undefined);
  const {setUser} = useContext(UserContext)

  async function userLogin(state: FormState, formData: FormData) {
    let result = await login(state, formData)
    if (result.user) {
      setUser(result.user)
      router.push('/dashboard')
    }
    return  result
  }

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
            {state.errors.password.map((error: string) => (
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
