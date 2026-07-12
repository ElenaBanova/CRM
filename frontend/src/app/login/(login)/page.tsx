'use client'

import React, {useActionState, useEffect} from 'react';
import Form from "next/form";
import loginUser from "@/server-actions/serverActions";
import '../login-css/login.css';
import {deleteCookies, getCookie} from "@/api-services/helper";


const LoginPage = () => {
    const [state, formAction] = useActionState(loginUser, null)

    useEffect(() => {
        const cleanupToken = async () => {
            const token = await getCookie("refreshToken");
        if (token) {
            await deleteCookies();
        }}

        cleanupToken();
    }, [])

    // if (state?.success === true) {
    //     redirect('/orders?page=1&order=-_id');
    // }

    return (
        <div className="login-page">
            <Form action={formAction} className="login-form">
                <label className="login-label">
                    Email
                    <input className="form-input" type="email" placeholder="Email"
                           name={'email'}/>
                </label>
                <label className="login-label">
                    Password
                    <input className="form-input" type="password"
                           placeholder="Password"
                           name={'password'}/>
                </label>
                <button className="form-button" type="submit"
                >Login
                </button>
                {state?.error && (
                    <p className="text-red-500 mb-4">
                        {state.error}
                    </p>
                )}
            </Form>
        </div>
    );
};

export default LoginPage;