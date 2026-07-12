"use client"

import '../../login/login-css/login.css';
import {useParams} from 'next/navigation';
import activateOrRecoveryPassword from "@/server-actions/serverActionsActivateOrRecoveryPassword";
import Form from "next/form";
import {useActionState} from "react";


const ActivatePage = () => {
    const params = useParams();
    const token = params.token as string;

    const [state, formAction] = useActionState(activateOrRecoveryPassword, null)

    return (
        <div className="login-page">
            <Form action={formAction} className="login-form">
                <input type="hidden" name="typeAction" value='activate'/>
                <input type="hidden" name="token" value={token || ''}/>
                <label className="login-label">
                    Password
                    <input className="form-input" type="password" placeholder="Password"
                           name={'password'}/>
                </label>
                <label className="login-label">
                    Confirm password
                    <input className="form-input" type="password"
                           placeholder="Confirm password"
                           name={'confirmPassword'}/>
                </label>
                <button className="form-button" type="submit"
                >ACTIVATE
                </button>
                {state?.error && (
                    <p className="text-red-500 mb-4">
                        {state.error}
                    </p>
                )}
            </Form>
        </div>)
}


export default ActivatePage;