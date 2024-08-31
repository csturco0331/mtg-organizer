'use client'
import styles from '../auth.module.css'
import { signUp } from "@/app/actions/auth";
import AppButton from "@/app/components/AppButton/AppButton";
import { UserContext } from '@/app/components/Providers/UserProvider/UserProvider';
import { FormState } from '@/app/lib/definitions';
import Link from "next/link";
import { useRouter } from 'next/navigation';
import { useContext } from 'react';
import { useFormState } from "react-dom";

export default function SignUp() {
  const router = useRouter();
  const [state, action, pending] = useFormState(userSignUp, undefined);
  const {setUser} = useContext(UserContext)
 
  async function userSignUp(state: FormState, formData: FormData) {
    let result = await signUp(state, formData)
    if (result.user) {
      setUser(result.user)
      router.push('/dashboard')
    }
    return  result
  }

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
function setUser(user: any) {
  throw new Error('Function not implemented.');
}

