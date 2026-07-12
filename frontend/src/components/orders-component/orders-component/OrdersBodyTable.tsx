"use client"

import {FC, useEffect, useRef, useState} from "react";
import {IOrder} from "@/interfaces/IOrder";
import React from "react";
import {commentService} from "@/api-services/comment.api";
import {IComment} from "@/interfaces/IComment";
import "../orders-component-css/ordersComponent.css"
import {commentValidatorSchema} from "@/validators/comment.validator";
import {formatDate} from "@/utils/date";
import {ordersPageAction} from "@/app/orders/(orders)/action";
import OrderEditWindow from "@/components/orders-component/orders-component/OrderEditWindow";
import {IGroup} from "@/interfaces/IGroup";

interface Props {
    orders: IOrder[]
    userId: string;
    groups: IGroup[];
}

const OrdersBodyTable: FC<Props> = ({orders, userId, groups}) => {
    const tableRef = useRef<HTMLTableSectionElement>(null);

    const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null)
    const [comments, setComments] = useState<IComment[]>([])
    const [commentText, setCommentText] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (tableRef.current && !tableRef.current.contains(event.target as Node)) {
                setExpandedOrderId(null);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);


    if (!mounted) return (
        <tbody>
        <tr>
            <td colSpan={15}>Loading...</td>
        </tr>
        </tbody>
    );


    const toggleOrderExpansion = async (orderId: string) => {
        if (expandedOrderId === orderId) {
            setExpandedOrderId(null)
        } else {
            setExpandedOrderId(orderId);
            const data = await commentService.getAll(orderId)
            setComments(data || [])
        }
        setCommentText('');
        setError(null);
    }

    const handleClick = async () => {
        const {error} = commentValidatorSchema.validate({comment: commentText})

        if (error) {
            return setError("The comment is incorrect.")
        }

        if (expandedOrderId) {
            const newComment = await commentService.addComment(commentText, expandedOrderId);
            setComments(prevComments => [...prevComments, newComment])
            await ordersPageAction();
            setCommentText('');
        }
    };

    const toggleModalEdit = () => {
        setIsEditOpen(!isEditOpen);
    }

    return (
        <tbody ref={tableRef}>
        {orders && orders.map(order =>
            <React.Fragment key={order._id}>
                <tr className={`tr-body ${expandedOrderId === order._id ? 'active-row' : ''}`}
                    onClick={() => toggleOrderExpansion(order._id)}
                    style={{cursor: "pointer"}}>
                    <td>{order.rowNumber}</td>
                    <td>{order.name}</td>
                    <td>{order.surname}</td>
                    <td>{order.email}</td>
                    <td>{order.phone}</td>
                    <td>{order.age}</td>
                    <td>{order.course}</td>
                    <td>{order.course_format}</td>
                    <td>{order.course_type}</td>
                    <td>{order.status}</td>
                    <td>{order.sum}</td>
                    <td>{order.already_paid}</td>
                    <td>{order.created_at && formatDate(order.created_at)}</td>
                    <td>{groups.map(group => {
                        if (group._id === order.group) return group.name
                    })}</td>
                    <td>{order.managerInfo}</td>
                </tr>
                {expandedOrderId === order._id && (
                    <tr>
                        <td colSpan={15}>
                            <div className="additional-window" style={{padding: "10px"}}>
                                <div className="left-side">
                                    <div>UTM: {order.utm}</div>
                                    <div>MSG: {order.msg}</div>
                                </div>
                                <div className="right-side">
                                    <div className="comments-block">
                                        {comments.length >= 1 && (
                                            <div className="comments">{comments.map(comment =>
                                                <div
                                                    className="comment"
                                                    key={comment._id}>
                                                    <a>{comment.comment}</a><a>{comment.userName} {comment.userSurname} {formatDate(comment.createdAt)}</a>
                                                </div>
                                            )}</div>)}
                                        <div className="add-comment">
                                            <input className="comment-input" type="text"
                                                   placeholder="Comment"
                                                   value={commentText}
                                                   onChange={(e) => {
                                                       setCommentText(e.target.value);
                                                       setError(null);
                                                   }}/>
                                            <button className="comment-add-button"
                                                    onClick={handleClick}
                                                    disabled={order.manager !== null && order.manager !== undefined && order.manager !== userId}>CONFIRM
                                            </button>
                                            {error && (
                                                <p className="text-red-500 mb-4">
                                                    {error}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    <div className="edit-block">
                                        <button className="button-edit" onClick={toggleModalEdit}
                                                disabled={order.manager !== null && order.manager !== undefined && order.manager !== userId}>EDIT
                                        </button>
                                        {isEditOpen && (
                                            <OrderEditWindow groups={groups} order={order} onClose={toggleModalEdit}/>)}
                                    </div>
                                </div>
                            </div>
                        </td>
                    </tr>
                )}
            </React.Fragment>
        )}
        </tbody>
    )
}

export default OrdersBodyTable;