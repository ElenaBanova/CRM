import {Metadata} from "next";
import MenuNavigation from "@/components/menu-navigation/menu-navigation/MenuNavigation";
import {authService} from "@/api-services/auth.api";


export const metadata: Metadata = {
    title: "Authenticated Layout metadata"
};

type Props = { children: React.ReactNode };

const AuthLayout = async ({children}: Props) => {
    const {name, role} = await authService.meServer();

    return (
        <>
            <MenuNavigation name={name} role={role}/>
            {children}
        </>
    );
}

export default AuthLayout;
