'use client'

import {useRouter, useSearchParams} from "next/navigation";
import {urls} from "@/constants/urls";
import "../orders-component-css/ordersComponent.css"


const OrdersHeadTable = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const params = new URLSearchParams(searchParams);
    const orderParams = params.get("order");

    if (!orderParams) {
        params.set("order", `-_id`);

        const url = `${urls.orders}?${params.toString()}`;
        router.push(url);
    }

    const handleClick = (key: string) => {

        if (orderParams === key) {
            params.set("order", `-${key}`);
        } else {
            params.set("order", key);
        }

        const url = `${urls.orders}?${params.toString()}`;
        router.push(url);
    }

    return (
        <thead className="orders-head-table">
        <tr>
            <th onClick={() => handleClick('_id')} style={{cursor: 'pointer'}}>Id
            </th>
            <th onClick={() => handleClick('name')} style={{cursor: 'pointer'}}>Name
            </th>
            <th onClick={() => handleClick('surname')} style={{cursor: 'pointer'}}>Surname
            </th>
            <th onClick={() => handleClick('email')} style={{cursor: 'pointer'}}>Email
            </th>
            <th onClick={() => handleClick('phone')} style={{cursor: 'pointer'}}>Phone
            </th>
            <th onClick={() => handleClick('age')} style={{cursor: 'pointer'}}>Age
            </th>
            <th onClick={() => handleClick('course')} style={{cursor: 'pointer'}}>Course
            </th>
            <th onClick={() => handleClick('course_format')} style={{cursor: 'pointer'}}>Course_Format
            </th>
            <th onClick={() => handleClick('course_type')} style={{cursor: 'pointer'}}>Course_Type
            </th>
            <th onClick={() => handleClick('status')} style={{cursor: 'pointer'}}>Status
            </th>
            <th onClick={() => handleClick('sum')} style={{cursor: 'pointer'}}>Sum
            </th>
            <th onClick={() => handleClick('already_paid')} style={{cursor: 'pointer'}}>Already_Paid
            </th>
            <th onClick={() => handleClick('created_at')} style={{cursor: 'pointer'}}>Created_At
            </th>
            <th onClick={() => handleClick('group')} style={{cursor: 'pointer'}}>Group
            </th>
            <th onClick={() => handleClick('manager')} style={{cursor: 'pointer'}}>Manager
            </th>
        </tr>
        </thead>
    )
}

export default OrdersHeadTable;