"use client"

import Form from "next/form";
import React, {FC, useEffect, useState} from "react";
import useDropdown from "@/hooks/useDropdown";
import {courses, formats, statuses, types} from "@/constants/options-search";
import {IGroup} from "@/interfaces/IGroup";
import orderEdit from "@/server-actions/serverActionsEdit";
import {useFormState} from "react-dom";
import {useRouter} from "next/navigation";
import "../orders-component-css/ordersComponent.css"
import {IOrderPromise} from "@/interfaces/IOrder";
import {groupService} from "@/api-services/group.api";
import {groupValidatorSchema} from "@/validators/group.validator";
import {ordersPageAction} from "@/app/orders/(orders)/action";


interface Props {
    groups: IGroup[],
    order: IOrderPromise;
    onClose: () => void;
}

const OrderEditWindow: FC<Props> = ({groups, onClose, order}) => {
    const router = useRouter();
    const [state, formAction] = useFormState(orderEdit, null)
    const [isOpenAddGroup, setIsOpenAddGroup] = useState(false);
    const [groupText, setGroupText] = useState<string>('');
    const [error, setError] = useState<string | null>(null);

    if (state?.success) {
        onClose();
        router.refresh();
    }

    const {
        isOpen: isCourseOpen,
        toggleDropdown: toggleCourse,
        selectedValue: selectedCourse,
        setSelectedValue: setSelectedCourse,
        dropdownRef: courseRef,
        setIsOpen: setIsOpenCourse,
    } = useDropdown();

    const {
        isOpen: isFormatOpen,
        toggleDropdown: toggleFormat,
        selectedValue: selectedFormat,
        setSelectedValue: setSelectedFormat,
        dropdownRef: formatRef,
        setIsOpen: setIsOpenFormat,
    } = useDropdown();

    const {
        isOpen: isTypeOpen,
        toggleDropdown: toggleType,
        selectedValue: selectedType,
        setSelectedValue: setSelectedType,
        dropdownRef: typeRef,
        setIsOpen: setIsOpenType,
    } = useDropdown();

    const {
        isOpen: isStatusOpen,
        toggleDropdown: toggleStatus,
        selectedValue: selectedStatus,
        setSelectedValue: setSelectedStatus,
        dropdownRef: statusRef,
        setIsOpen: setIsOpenStatus,
    } = useDropdown();

    const {
        isOpen: isGroupOpen,
        toggleDropdown: toggleGroup,
        selectedValue: selectedGroup,
        setSelectedValue: setSelectedGroup,
        selectedId: selectedGroupId,
        setSelectedId: setSelectedGroupId,
        dropdownRef: groupRef,
        setIsOpen: setIsOpenGroup,
    } = useDropdown();

    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    }

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onClose]);

    useEffect(() => {
        setSelectedCourse(order.course);
        setSelectedFormat(order.course_format);
        setSelectedType(order.course_type);
        setSelectedStatus(order.status);
        setSelectedGroupId(order.group);
        const matchedGroup = groups.find(group => order.group === group._id);
        setSelectedGroup(matchedGroup?.name || '');
    }, [order]);

    const handleOnClickAddGroup = () => {
        setIsOpenAddGroup(!isOpenAddGroup)
    }

    const handleAddGroup = async () => {
        const data = {
            name: groupText as string,
        }

        const {error} = groupValidatorSchema.validate(data);

        if (error) {
            return setError(error.details[0].message);
        }

        try {
            await groupService.createGroup(data.name);
            setGroupText("");
            await ordersPageAction();
            handleOnClickAddGroup();
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (e) {
            return setError('Unable to save changes, data entered incorrectly.');
        }
    }

    return (
        <div className="order-edit-window" onClick={handleBackdropClick}>
            <Form action={formAction} className="order-edit-form-with-button">
                <div className="edit-form">
                    <input type="hidden" name="id" value={order._id}/>
                    <input type="hidden" name="group" value={selectedGroupId || ''}/>
                    <input type="hidden" name="status" value={selectedStatus || ''}/>
                    <input type="hidden" name="course" value={selectedCourse || ''}/>
                    <input type="hidden" name="course_format"
                           value={selectedFormat ? selectedFormat.toLowerCase() : ''}/>
                    <input type="hidden" name="course_type" value={selectedType ? selectedType.toLowerCase() : ''}/>
                    <label className="edit-label">
                        <div className="edit-label-text">
                            Group
                        </div>
                        <div style={{position: 'relative', display: 'inline-block'}}>
                            <div className="form-input-edit" ref={groupRef}>
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        toggleGroup();
                                    }}
                                    className="edit-input-button"
                                >
                                    <div>{selectedGroup || 'all groups'}</div>
                                    <span
                                        className="span">&#8744;</span>
                                </button>
                                {isGroupOpen && (
                                    <div className="search-input-open" onClick={(e) => e.preventDefault()}>
                                        <div
                                            onClick={() => {
                                                setSelectedGroup("");
                                                setSelectedGroupId("");
                                                setIsOpenGroup(false)
                                            }}
                                            className="input-open-click"
                                        >
                                            all groups
                                        </div>

                                        {groups && groups.map((group) => (
                                            <div
                                                key={group._id}
                                                onClick={() => {
                                                    setSelectedGroup(group.name);
                                                    setSelectedGroupId(group._id);
                                                    setIsOpenGroup(false)
                                                }}
                                                className="input-open-click"
                                            >
                                                {group.name}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <button className="group-button" onClick={handleOnClickAddGroup}
                                    type="button">ADD GROUP
                            </button>
                            {isOpenAddGroup && (
                                <div style={{position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10}}>
                                    <div className="form-field" onClick={(e) => {
                                        e.preventDefault();
                                    }}>
                                        <label className="edit-label">
                                            <input className="form-input-edit" type="text" placeholder="Group"
                                                   name={'name'} value={groupText} onChange={(e) => {
                                                setGroupText(e.target.value.toString());
                                                setError(null);
                                            }}/>
                                            <div className="group-buttons">
                                                <button className="add-group-button" type="button" onClick={() => {
                                                    setGroupText("");
                                                    setError(null);
                                                    handleOnClickAddGroup()
                                                }}>CLOSE
                                                </button>
                                                <button className="add-group-button" type="button"
                                                        onClick={handleAddGroup}
                                                        disabled={!groupText.trim()}>ADD
                                                </button>
                                            </div>
                                        </label>
                                        {error && (
                                            <p className="error-message">
                                                {error}
                                            </p>
                                        )}</div>
                                </div>)}
                        </div>
                    </label>
                    <div className="form-field">
                        <label className="edit-label">
                            <div className="edit-label-text">Name</div>
                            <input className="form-input-edit" type="text"
                                   name={'name'} defaultValue={order.name}/>
                        </label>
                        {state?.errors?.name && (
                            <p className="error-message">
                                {state.errors.name}
                            </p>
                        )}</div>
                    <div className="form-field">
                        <label className="edit-label">
                            <div className="edit-label-text">Surname</div>
                            <input className="form-input-edit" type="text"
                                   name={'surname'} defaultValue={order.surname}/>
                        </label>
                        {state?.errors?.surname && (
                            <p className="error-message">
                                {state.errors.surname}
                            </p>
                        )}</div>
                    <div className="form-field">
                        <label className="edit-label">
                            <div className="edit-label-text">Email</div>
                            <input className="form-input-edit" type="email"
                                   name={'email'} defaultValue={order.email}/>
                        </label>
                        {state?.errors?.email && (
                            <p className="error-message">
                                {state.errors.email}
                            </p>
                        )}</div>
                    <div className="form-field">
                        <label className="edit-label">
                            <div className="edit-label-text"> Phone</div>
                            <input className="form-input-edit" type="text"
                                   name={'phone'} defaultValue={order.phone}/>
                        </label>
                        {state?.errors?.phone && (
                            <p className="error-message">
                                {state.errors.phone}
                            </p>
                        )}</div>
                    <div className="form-field">
                        <label className="edit-label">
                            <div className="edit-label-text">Age</div>
                            <input className="form-input-edit" type="number"
                                   name={'age'} defaultValue={order.age}/>
                        </label>
                        {state?.errors?.age && (
                            <p className="error-message">
                                {state.errors.age}
                            </p>
                        )}</div>
                    <label className="edit-label">
                        <div className="edit-label-text">Status</div>
                        <div className="form-input-edit" ref={statusRef}>
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.preventDefault();
                                    toggleStatus();
                                }}
                                className="edit-input-button"
                            >
                                <div>{selectedStatus || 'all statuses'}</div>
                                <span
                                    className="span">&#8744;</span>
                            </button>
                            {isStatusOpen && (
                                <div className="search-input-open" onClick={(e) => e.preventDefault()}>
                                    <div
                                        onClick={() => {
                                            setSelectedStatus('');
                                            setIsOpenStatus(false);
                                        }}
                                        className="input-open-click"
                                    >
                                        all statuses
                                    </div>

                                    {statuses.map((status) => (
                                        <div
                                            key={status}
                                            onClick={() => {
                                                setSelectedStatus(status);
                                                setIsOpenStatus(false);
                                            }}
                                            className="input-open-click"
                                        >
                                            {status}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </label>
                    <div className="form-field">
                        <label className="edit-label">
                            <div className="edit-label-text">Sum</div>
                            <input className="form-input-edit" type="number" min="0"
                                   name={'sum'} defaultValue={order.sum}/>
                        </label>
                        {state?.errors?.sum && (
                            <p className="error-message">
                                {state.errors.sum}
                            </p>
                        )}</div>
                    <div className="form-field">
                        <label className="edit-label">
                            <div className="edit-label-text">Already paid</div>
                            <input className="form-input-edit" type="number" min="0"
                                   name={'already_paid'} defaultValue={order.already_paid}/>
                        </label>
                        {state?.errors?.already_paid && (
                            <p className="error-message">
                                {state.errors.already_paid}
                            </p>
                        )}</div>
                    <label className="edit-label">
                        <div className="edit-label-text">Course</div>
                        <div className="form-input-edit" ref={courseRef}>
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.preventDefault();
                                    toggleCourse();
                                }}
                                className="edit-input-button"
                            >
                                <div>{selectedCourse || 'all courses'}</div>
                                <span
                                    className="span">&#8744;</span>
                            </button>
                            {isCourseOpen && (
                                <div className="search-input-open" onClick={(e) => e.preventDefault()}>
                                    <div
                                        onClick={() => {
                                            setSelectedCourse('');
                                            setIsOpenCourse(false);
                                        }}
                                        className="input-open-click"
                                    >
                                        all courses
                                    </div>

                                    {courses.map((course) => (
                                        <div
                                            key={course}
                                            onClick={() => {
                                                setSelectedCourse(course);
                                                setIsOpenCourse(false);
                                            }}
                                            className="input-open-click"
                                        >
                                            {course}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </label>
                    <label className="edit-label">
                        <div className="edit-label-text">Course format</div>
                        <div className="form-input-edit" ref={formatRef}>
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.preventDefault();
                                    toggleFormat();
                                }}
                                className="edit-input-button"
                            >
                                <div>{selectedFormat || 'all formats'}</div>
                                <span
                                    className="span">&#8744;</span>
                            </button>
                            {isFormatOpen && (
                                <div className="search-input-open" onClick={(e) => e.preventDefault()}>
                                    <div
                                        onClick={() => {
                                            setSelectedFormat('');
                                            setIsOpenFormat(false);
                                        }}
                                        className="input-open-click"
                                    >
                                        all formats
                                    </div>

                                    {formats.map((format) => (
                                        <div
                                            key={format}
                                            onClick={() => {
                                                setSelectedFormat(format);
                                                setIsOpenFormat(false);
                                            }}
                                            className="input-open-click"
                                        >
                                            {format}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </label>
                    <label className="edit-label">
                        <div className="edit-label-text">Course type</div>
                        <div className="form-input-edit" ref={typeRef}>
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.preventDefault();
                                    toggleType();
                                }}
                                className="edit-input-button"
                            >
                                <div>{selectedType || 'all types'}</div>
                                <span
                                    className="span">&#8744;</span>
                            </button>
                            {isTypeOpen && (
                                <div className="search-input-open" onClick={(e) => e.preventDefault()}>
                                    <div
                                        onClick={() => {
                                            setSelectedType('');
                                            setIsOpenType(false);
                                        }}
                                        className="input-open-click"
                                    >
                                        all types
                                    </div>

                                    {types.map((type) => (
                                        <div
                                            key={type}
                                            onClick={() => {
                                                setSelectedType(type);
                                                setIsOpenType(false);
                                            }}
                                            className="input-open-click"
                                        >
                                            {type}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </label>
                </div>
                <div className="form-edit-buttons">
                    {state?.error && (
                        <p className="error-message">
                            {state.error}
                        </p>
                    )}
                    <button className="form-button-edit" onClick={onClose}
                    >CLOSE
                    </button>
                    <button className="form-button-edit" type="submit"
                    >SUBMIT
                    </button>
                </div>
            </Form>
        </div>
    )
}

export default OrderEditWindow