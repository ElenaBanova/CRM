"use client"

import Image from "next/image";
import Link from "next/link";
import "../menu-navigation-css/menuNavigation.css";
import {redirect, usePathname} from "next/navigation";

type Props = {
    name: string;
    role: string;
};

const MenuNavigation = ({name, role}: Props) => {
    const pathname = usePathname();

    return (
        <div className='menu'>
            <div><Image src="/pngegg.png" alt={`logo`} width={120} height={120}/></div>
            <div className='button-navigation'>
                <h2 className="name">{name}</h2>
                {role === 'admin' && pathname === '/orders' && <div className='button' style={{cursor: "pointer"}}>
                    <Link href={'/adminPanel'}><Image
                        src="/admin-with-cogwheels.svg" alt={`logo admin panel`} width={60} height={60}/>
                    </Link></div>}
                {role === 'admin' && pathname === '/adminPanel' && <div className='button' style={{cursor: "pointer"}}>
                <Link href={'/orders'}><Image
                    src="/admin-with-cogwheels.svg" alt={`logo admin panel`} width={60} height={60}/>
                </Link></div>}
                <div className='button' onClick={() => {
                    redirect("/login")
                }} style={{cursor: "pointer"}}>
                    <Image src="/135533211.png"
                           alt={`logo exit`}
                           width={60}
                           height={60}/>
                </div>
            </div>
        </div>
    );
};

export default MenuNavigation;