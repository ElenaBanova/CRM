import {userService} from "@/api-services/user.api";
import AdminPanelComponent from "@/components/admin-panel-component/admin-panel-component/AdminPanelComponent";
import {orderService} from "@/api-services/order.api";
import {SearchParams} from "next/dist/server/request/search-params";
import {authService} from "@/api-services/auth.api";
import PaginationOrders from "@/components/pagination/pagination/PaginationOrders";

const AdminPanel = async ({searchParams}: { searchParams: Promise<SearchParams> }) => {
    const params = await searchParams;
    const activate = params.activate || '';
    const recovery = params.recovery || '';
    const page = params.page || '1';

    const {data: users, totalPages} = await userService.loadManager(`${page}`);
    const ordersStatistic = await orderService.getByOrdersStatistic();
    const  {_id} = await authService.meServer();

    let activateURL: string = '';
    if (activate) {
        const url = await authService.userActivateURL(activate.toString());
        if (url) {
            activateURL = url;
        }
    }

    let recoveryURL: string = '';
    if (recovery) {
        const url = await authService.userRecoveryURL(recovery.toString());
        if (url) {
            recoveryURL = url;
        }
    }

    return (
        <div className="admin-panel">
            <AdminPanelComponent me={_id} managers={users} statistic={ordersStatistic} activateURL={activateURL} recoveryURL={recoveryURL}/>
            <PaginationOrders totalPages={totalPages}/>
        </div>
    )
}
export default AdminPanel