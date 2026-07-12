import {orderService} from "@/api-services/order.api";
import PaginationOrders from "@/components/pagination/pagination/PaginationOrders";
import OrdersHeadTable from "@/components/orders-component/orders-component/OrdersHeadTable";
import OrdersBodyTable from "@/components/orders-component/orders-component/OrdersBodyTable";
import "../orders-css/orders.css"
import {SearchParams} from "next/dist/server/request/search-params";
import {authService} from "@/api-services/auth.api";
import MenuSearch from "@/components/menu-search/menu-search/MenuSearch";
import {groupService} from "@/api-services/group.api";
import {IOrderQuery} from "@/interfaces/IOrderQuery";
import {IOrder} from "@/interfaces/IOrder";

const OrdersPage = async ({searchParams}: { searchParams: Promise<SearchParams> }) => {
        const params = await searchParams;
        const page = params.page || '1';
        const order = params.order || '-_id';
        const name = params.name;
        const surname = params.surname;
        const email = params.email;
        const phone = params.phone;
        const age = params.age;
        const course = params.course;
        const course_format = params.course_format;
        const course_type = params.course_type;
        const status = params.status;
        const group = params.group;
        const manager = params.manager;
        const excel = params.excel;

        const query: IOrderQuery = {
            order: `${order}`,
            ...(name && {name: `${name}`}),
            ...(surname && {surname: `${surname}`}),
            ...(email && {email: `${email}`}),
            ...(phone && {phone: `${phone}`}),
            ...(age && {age: `${age}`}),
            ...(course && {course: `${course}`}),
            ...(course_format && {course_format: `${course_format}`}),
            ...(course_type && {course_type: `${course_type}`}),
            ...(status && {status: `${status}`}),
            ...(group && {group: `${group}`}),
            ...(manager && {manager: `${manager}`}),
        };

        const {data: orders, totalPages} = await orderService.getAll(`${page}`, query);
        const {_id} = await authService.meServer();
        const groups = await groupService.loadGroups();

        const ordersExcel: IOrder[] = [];
        if (excel) {
            const orders = await orderService.getAllForExcel(query);
            if (orders) {
                orders.map(order => {
                    ordersExcel.push(order);
                });
            }
        }

        return (
            <div className="orders-page">
                <MenuSearch groups={groups} query={query} userId={_id} orders={ordersExcel}/>
                <table className="orders-table">
                    <OrdersHeadTable/>
                    <OrdersBodyTable orders={orders} userId={_id} groups={groups}/>
                </table>
                <PaginationOrders totalPages={totalPages}/>
            </div>
        );
    }
;

export default OrdersPage;
