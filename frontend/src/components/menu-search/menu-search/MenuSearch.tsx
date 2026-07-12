"use client"

import React, {FC, useCallback, useEffect, useState} from "react";
import {courses, formats, statuses, types} from "@/constants/options-search";
import {IGroup} from "@/interfaces/IGroup";
import {useRouter, useSearchParams} from "next/navigation";
import {urls} from "@/constants/urls";
import {IOrderQuery} from "@/interfaces/IOrderQuery";
import "../menu-search-css/menuSearch.css"
import Image from "next/image";
import useDropdown from "@/hooks/useDropdown";
import {searchValidatorSchema} from "@/validators/search.validator";
import {useDebouncedCallback} from "use-debounce";
import {exportToExcel} from "@/utils/exportToExcel";
import {IOrder} from "@/interfaces/IOrder";

interface Props {
    groups: IGroup[],
    query: IOrderQuery,
    userId: string;
    orders: IOrder[];
}

const MenuSearch: FC<Props> = ({groups, query, userId, orders}) => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const params = new URLSearchParams(searchParams);
    const [isChecked, setIsChecked] = useState(false);
    const [inputValues, setInputValue] = useState({
        name: searchParams.get('name') || '',
        surname: searchParams.get('surname') || '',
        email: searchParams.get('email') || '',
        phone: searchParams.get('phone') || '',
        age: searchParams.get('age') || '',
    });

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
        dropdownRef: groupRef,
        setIsOpen: setIsOpenGroup,
    } = useDropdown();

    useEffect(() => {
        if (query.course) {
            setSelectedCourse(query.course);
        }
        if (query.course_format) {
            setSelectedFormat(query.course_format);
        }
        if (query.course_type) {
            setSelectedType(query.course_type);
        }
        if (query.status) {
            setSelectedStatus(query.status);
        }
        if (query.group) {
            setSelectedGroup(query.group);
        }
        if (query.manager) {
            setIsChecked(query.manager === userId);
        }
    }, [query, userId]);

    const handleInputChange = (key: string, value: string) => {
        if (value === 'delete') {
            handleCheckbox(key, '');
            setInputValue((prev) => ({
                ...prev,
                [key]: ''
            }));
        } else {
            setInputValue((prev) => ({
                ...prev,
                [key]: value
            }));

            if (value) {
                const {error} = searchValidatorSchema.validate({[key]: value})

                if (error) {
                    console.error(`The ${key} is incorrect.`)
                }
            }

            handleInput(key, value);
        }
    }

    const handleInput = useDebouncedCallback((key: string, value: string) => {
        const prevValue = searchParams.get(key) as string;

        if (prevValue?.length > 0 && value === '') {
            params.delete(key);
        } else {
            if (value === '') {
                params.delete(key);
            } else {
                params.set(key, value);
            }
        }

        router.push(`${urls.orders}?${params.toString()}`);
    }, 300)

    const handleCheckbox = useCallback((key: string, value: string) => {

        if (key === 'manager') {
            if (value === '') {
                params.delete(key);
                setIsChecked(false);
            } else {
                if (isChecked) {
                    params.delete(key);
                } else {
                    params.set(key, value);
                }
                setIsChecked(!isChecked);
            }
        } else {
            if (value === '') {
                params.delete(key);
            } else {
                params.set(key, value);
            }
        }

        router.push(`${urls.orders}?${params.toString()}`);

    }, [params, isChecked]);

    const noSearchParams = () => {
        if (searchParams.get('page') !== '1') {
            handleCheckbox('page', '1');
        }
        if (searchParams.get('order') !== '-_id') {
            handleCheckbox('order', '-_id');
        }
        if (searchParams.get('course_format')) {
            handleCheckbox('course_format', '');
            setSelectedFormat('');
        }
        if (searchParams.get('course_type')) {
            handleCheckbox('course_type', '');
            setSelectedType('');
        }
        if (searchParams.get('course')) {
            handleCheckbox('course', '');
            setSelectedCourse('');
        }
        if (searchParams.get('status')) {
            handleCheckbox('status', '');
            setSelectedStatus('');
        }
        if (searchParams.get('group')) {
            handleCheckbox('group', '');
            setSelectedGroup('');
        }
        if (searchParams.get('manager')) {
            handleCheckbox('manager', '');
        }
        if (searchParams.get('name')) {
            handleInputChange('name', 'delete');
        }
        if (searchParams.get('surname')) {
            handleInputChange('surname', 'delete');
        }
        if (searchParams.get('email')) {
            handleInputChange('email', 'delete');
        }
        if (searchParams.get('phone')) {
            handleInputChange('phone', 'delete');
        }
        if (searchParams.get('age')) {
            handleInputChange('age', 'delete');
        }
    }

    useEffect(() => {
        const handleExport = async () => {
            if (orders.length > 0) {
                await exportToExcel(orders);

                params.delete('excel');

                window.history.replaceState(
                    {},
                    '',
                    `${window.location.pathname}?${params.toString()}`
                );
            }
        };

        handleExport().then();
    }, [orders]);

    const onClickForExcel = () => {
        params.set('excel', 'excel');
        router.push(`${urls.orders}?${params.toString()}`)
    }

    return (
        <div className="menu-search">
            <div className="menu-search-input">
                <input className="search-input" type="text"
                       placeholder="Name"
                       value={inputValues.name}
                       onChange={(e) => {
                           handleInputChange('name', e.target.value.toString());
                       }}/>
                <input className="search-input" type="text"
                       placeholder="Surname"
                       value={inputValues.surname}
                       onChange={(e) => {
                           handleInputChange('surname', e.target.value.toString());
                       }}/>
                <input className="search-input" type="text"
                       placeholder="Email"
                       value={inputValues.email}
                       onChange={(e) => {
                           handleInputChange('email', e.target.value.toString());
                       }}/>
                <input className="search-input" type="text"
                       placeholder="Phone"
                       value={inputValues.phone}
                       onChange={(e) => {
                           handleInputChange('phone', e.target.value.toString());
                       }}/>
                <input className="search-input" type="number" min="0"
                       placeholder="Age"
                       value={inputValues.age}
                       onChange={(e) => {
                           handleInputChange('age', e.target.value);
                       }}/>
                <div className="search-input" ref={courseRef}>
                    <button
                        type="button"
                        onClick={toggleCourse}
                        className="search-input-button"
                    >
                        <div>{selectedCourse || 'all courses'}</div>
                        <span
                            className="span">&#8744;</span>
                    </button>
                    {isCourseOpen && (
                        <div className="search-input-open">
                            <div
                                onClick={() => {
                                    handleCheckbox('course', '');
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
                                        handleCheckbox('course', course)
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
                <div className="search-input" ref={formatRef}>
                    <button
                        type="button"
                        onClick={toggleFormat}
                        className="search-input-button"
                    >
                        <div>{selectedFormat || 'all formats'}</div>
                        <span
                            className="span">&#8744;</span>
                    </button>
                    {isFormatOpen && (
                        <div className="search-input-open">
                            <div
                                onClick={() => {
                                    handleCheckbox('course_format', '');
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
                                        handleCheckbox('course_format', format)
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
                <div className="search-input" ref={typeRef}>
                    <button
                        type="button"
                        onClick={toggleType}
                        className="search-input-button"
                    >
                        <div>{selectedType || 'all types'}</div>
                        <span
                            className="span">&#8744;</span>
                    </button>
                    {isTypeOpen && (
                        <div className="search-input-open">
                            <div
                                onClick={() => {
                                    handleCheckbox('course_type', '');
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
                                        handleCheckbox('course_type', type)
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
                <div className="search-input" ref={statusRef}>
                    <button
                        type="button"
                        onClick={toggleStatus}
                        className="search-input-button"
                    >
                        <div>{selectedStatus || 'all statuses'}</div>
                        <span
                            className="span">&#8744;</span>
                    </button>
                    {isStatusOpen && (
                        <div className="search-input-open">
                            <div
                                onClick={() => {
                                    handleCheckbox('status', '');
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
                                        handleCheckbox('status', status)
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
                <div className="search-input" ref={groupRef}>
                    <button
                        type="button"
                        onClick={toggleGroup}
                        className="search-input-button"
                    >
                        <div>{selectedGroup || 'all groups'}</div>
                        <span
                            className="span">&#8744;</span>
                    </button>
                    {isGroupOpen && (
                        <div className="search-input-open">
                            <div
                                onClick={() => {
                                    handleCheckbox('group', '');
                                    setSelectedGroup('');
                                    setIsOpenGroup(false);
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
                                        handleCheckbox('group', group.name)
                                        setIsOpenGroup(false);
                                    }}
                                    className="input-open-click"
                                >
                                    {group.name}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                <input className="search-input" type="date"
                       placeholder="Start date"/>
                <input className="search-input" type="date"
                       placeholder="End date"/>
            </div>
            <div className="search-right-block">
                <label><input className="checkbox-my" type="checkbox"
                              checked={isChecked}
                              onChange={() => handleCheckbox('manager', userId)}/>My
                </label>
                <button className="no-search" onClick={noSearchParams}>
                    <Image src="/image-circular.png"
                           alt={`logo circular-arrow`}
                           width={60}
                           height={60}
                           style={{background: 'transparent'}}
                           priority
                           unoptimized={true}
                    />
                </button>
                <button className="excel" onClick={onClickForExcel}>
                    <Image src="/microsoft-excel.svg"
                           alt={`logo excel file`}
                           width={60}
                           height={60}
                    />
                </button>
            </div>
        </div>
    )
}

export default MenuSearch;