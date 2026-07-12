import {Metadata} from "next";
import MenuNavigation from "@/components/menu-navigation/menu-navigation/MenuNavigation";


export const metadata: Metadata = {
    title: "Authenticated Layout metadata"
};

type Props = { children: React.ReactNode };

const AuthLayout = ({children}: Props) => {
        return (
        <>
            <MenuNavigation/>
            {children}
        </>
    );
}

export default AuthLayout;
