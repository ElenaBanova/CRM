'use client'

import {IUsersWithStatistic} from "@/interfaces/IUser";
import React, {FC, useEffect, useState} from "react";
import {formatDate} from "@/utils/date";
import "../admin-panel-components-css/adminPanelComponent.css"
import {IStatistic} from "@/interfaces/IStatistic";
import Form from "next/form";
import managerCreate from "@/server-actions/serverActionsCreateManager";
import {useFormState} from "react-dom";
import {useRouter, useSearchParams} from "next/navigation";
import {Toast} from "@/components/toast-component/Toast";
import {userService} from "@/api-services/user.api";

interface Props {
    managers: IUsersWithStatistic[],
    statistic: IStatistic,
    activateURL?: string,
    recoveryURL?: string,
}

const AdminPanelComponent: FC<Props> = ({managers, statistic, activateURL, recoveryURL}) => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const params = new URLSearchParams(searchParams);
    const [state, formAction] = useFormState(managerCreate, null);
    const [nameText, setNameText] = useState<string>('');
    const [surnameText, setSurnameText] = useState<string>('');
    const [emailText, setEmailText] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const [isOpenCreateWindow, setIsOpenCreateWindow] = useState<boolean>(false);
    const [toastMessage, setToastMessage] = useState<string | null>(null);

    useEffect(() => {
        if (state?.success === true) {
            setError(null);
            setEmailText('');
            setNameText('');
            setSurnameText('');
            setIsOpenCreateWindow(false);
            router.refresh();
        } else {
            if (state?.error) {
                setError(state?.error.toString());
            }
            if (state?.values?.email) {
                setEmailText(state?.values?.email.toString())
            }
            if (state?.values?.name) {
                setNameText(state?.values?.name.toString())
            }
            if (state?.values?.surname) {
                setSurnameText(state?.values?.surname.toString())
            }
        }
    }, [state])

    useEffect(() => {
        if (activateURL) {
            navigator.clipboard.writeText(activateURL)
                .then(() => setToastMessage('The link has been copied to the clipboard.!'))
                .catch(() => setToastMessage('Error copying link to clipboard.'));
        }

        if (recoveryURL) {
            navigator.clipboard.writeText(recoveryURL)
                .then(() => setToastMessage('The link has been copied to the clipboard.!'))
                .catch(() => setToastMessage('Error copying link to clipboard.'));
        }

    }, [activateURL, recoveryURL])

    const toggleCreateManager = () => {
        if (isOpenCreateWindow) {
            setError(null);
            setEmailText('');
            setNameText('');
            setSurnameText('');
        }
        setIsOpenCreateWindow(!isOpenCreateWindow)
    }

    const toggleActivateManager = (key: string, value: string) => {
        if (value) {
            params.set(key, value);
        }

        router.push(`/adminPanel?${params.toString()}`);
    }

    const toggleBunUnbanManager = async (value: string) => {
        await userService.banUnbanManager(value);
        router.refresh()
    }

    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            toggleCreateManager();
        }
    }
    return (
        <div className="list-managers">
            <div className="statistic">
                <div>Orders statistic</div>
                <div className="line-statistic-info">
                    <div>Total: {statistic.total}</div>
                    <div>In work: {statistic.inWork}</div>
                    <div>Agree: {statistic.agree}</div>
                    <div>Disagree: {statistic.disagree}</div>
                    <div>Dubbing: {statistic.dubbing}</div>
                    <div>New: {statistic.new}</div>
                </div>
            </div>
            <div className="create-manager">
                <button onClick={toggleCreateManager} className="create-manager-button">CREATE</button>
            </div>
            {isOpenCreateWindow && <div className="manager-create-window" onClick={handleBackdropClick}><Form
                className="manager-create-form-with-button" action={formAction}>
                <label className="create-label">
                    Email
                    <input className="create-input" type="email" placeholder="Email"
                           name={'email'} value={emailText || ''} onChange={(e) => {
                        setEmailText(e.target.value.toString());
                        setError(null);
                    }}/>
                </label>
                <label className="create-label">
                    Name
                    <input className="create-input" type="text" placeholder="Name"
                           name={'name'} value={nameText || ''} onChange={(e) => {
                        setNameText(e.target.value.toString());
                        setError(null);
                    }}/>
                </label>
                <label className="create-label">
                    Surname
                    <input className="create-input" type="text" placeholder="Surname"
                           name={'surname'} value={surnameText || ''} onChange={(e) => {
                        setSurnameText(e.target.value.toString());
                        setError(null);
                    }}/>
                </label>
                <div className="create-buttons">
                    {error && (
                        <p className="error-message-create-manager">
                            {error}
                        </p>
                    )}
                    <div className="manager-create-buttons">
                        <button className="create-button" type="button" onClick={toggleCreateManager}
                        >CANCEL
                        </button>
                        <button className="create-button" type="submit"
                        >CREATE
                        </button>
                    </div>
                </div>
            </Form></div>}
            {managers && managers.map(manager => <div key={manager._id} className="manager-panel">
                <div className="basic-info">
                    <div>id: {manager.rowNumber}</div>
                    <div>email: {manager.email}</div>
                    <div>name: {manager.name}</div>
                    <div>surname: {manager.surname}</div>
                    <div>is_active: {manager.isActive.toString()}</div>
                    <div>last_login: {manager.lastLogin && formatDate(manager.lastLogin)}</div>
                </div>
                <div className="manager-statistic">
                    <div>Total: {manager.statistic.total}</div>
                    {manager.statistic.inWork >= 1 && <div>In work: {manager.statistic.inWork}</div>}
                    {manager.statistic.agree >= 1 && <div>Agree: {manager.statistic.agree}</div>}
                    {manager.statistic.disagree >= 1 && <div>Disagree: {manager.statistic.disagree}</div>}
                    {manager.statistic.dubbing >= 1 && <div>Dubbing: {manager.statistic.dubbing}</div>}
                </div>
                <div className="manager-buttons">
                    {!manager.isActive && <button className="manager-button" disabled={manager.blockUser}
                                                  onClick={() => toggleActivateManager('activate', manager._id)}>ACTIVATE</button>}
                    {manager.isActive &&
                        <button className="manager-button" style={{fontSize: '14px', paddingTop: '0.5px'}} disabled={manager.blockUser}
                                onClick={() => toggleActivateManager('recovery', manager._id)}>RECOVERY
                            PASSWORD</button>}
                    <button className="manager-button" type="button" disabled={manager.blockUser} onClick={() =>
                        toggleBunUnbanManager(manager._id)
                    }>
                        BAN
                    </button>
                    <button className="manager-button" type="button" disabled={!manager.blockUser} onClick={() =>
                        toggleBunUnbanManager(manager._id)
                    }>
                        UNBAN
                    </button>
                </div>
            </div>)}
            <Toast message={toastMessage}/>
        </div>
    )
}

export default AdminPanelComponent;