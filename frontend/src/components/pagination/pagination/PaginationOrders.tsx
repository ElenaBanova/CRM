'use client'

import {useRouter, useSearchParams} from "next/navigation";
import {urls} from "@/constants/urls";
import {FC, useEffect} from "react";
import "../pagination-css/pagination.css"

interface Props {
    totalPages: number
}

const PaginationOrders: FC<Props> = ({totalPages}) => {
        const router = useRouter();
        const searchParams = useSearchParams();
        const params = new URLSearchParams(searchParams);

        let page = Number(searchParams.get('page')) || 1;

        useEffect(() => {
            if (page > totalPages) {
                params.set("page", `1`);
                router.push(`${urls.orders}?${params.toString()}`)
            }
        }, [totalPages]);

        if (!searchParams.get('page')) {
            params.set("page", `1`);
            router.push(`${urls.orders}?${params.toString()}`)
        }

        const generatePageButtons = () => {
            const buttons = []
            const maxVisibleButtons = 7;
            let startPage: number, endPage: number

            if (totalPages <= maxVisibleButtons) {
                startPage = 1
                endPage = totalPages
            } else {
                const half = Math.floor(maxVisibleButtons / 2)

                if (page <= half + 1) {
                    startPage = 1
                    endPage = maxVisibleButtons
                } else if (page >= totalPages - half) {
                    startPage = totalPages - maxVisibleButtons + 1
                    endPage = totalPages
                } else {
                    startPage = page - half
                    endPage = page + half
                }
            }

            if (startPage > 1) {
                buttons.push(
                    <button className='button-pag'
                            key={1}
                            onClick={() => {
                                params.set("page", `${1}`);
                                router.push(`${urls.orders}?${params.toString()}`)
                            }} disabled={page === 1}>
                        1
                    </button>)
                if (startPage > 2) {
                    buttons.push(<span className='button-pag' key="start-ellipsis">...</span>)
                }
            }

            for (let i = startPage; i <= endPage; i++) {
                buttons.push(
                    <button key={i}
                            className={`button-pag ${page === i ? 'active' : ''}`}
                            onClick={() => {
                                params.set("page", `${i.toString()}`);
                                router.push(`${urls.orders}?${params.toString()}`)
                            }} disabled={page === i}>
                        {i}
                    </button>)
            }


            if (endPage < totalPages) {
                if (endPage < totalPages - 1) {
                    buttons.push(<span className='button-pag' key="end-ellipsis">...</span>)
                }
                buttons.push(
                    <button className='button-pag'
                            key={totalPages}
                            onClick={() => {
                                params.set("page", `${totalPages.toString()}`);
                                router.push(`${urls.orders}?${params.toString()}`)
                            }} disabled={page === totalPages}>
                        {totalPages}
                    </button>)
            }

            return buttons
        }

        return (
            <div className="pagination-page">
                {page > 1 && <button className='button-pag' onClick={() => {
                    params.set("page", `${(--page).toString()}`);
                    router.push(`${urls.orders}?${params.toString()}`)
                }} disabled={page <= 1}>&lt;
                </button>}
                {generatePageButtons()}
                {page < totalPages && <button className='button-pag' onClick={() => {
                    params.set("page", `${(++page).toString()}`);
                    router.push(`${urls.orders}?${params.toString()}`)
                }} disabled={page >= totalPages}>&gt;
                </button>}
            </div>
        );
    }
;

export default PaginationOrders;