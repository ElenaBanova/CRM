import {NextRequest, NextResponse} from "next/server";
import {urls} from "@/constants/urls";
import {parseUrl} from "next/dist/shared/lib/router/utils/parse-url";
import {deleteCookies, setCookie} from "@/api-services/helper";


const proxy = async (req: NextRequest) => {
    const url = req.url as string;
    const parsedUrl = parseUrl(url);
    const pathname = parsedUrl.pathname || '';

    if (pathname === "/orders" || pathname === "/adminPanel") {
        const refresh = req.cookies.get('refreshToken')?.value || '';
        const access = req.cookies.get('accessToken')?.value || '';

            if (!access) {
                if (refresh) {
                    const response = await fetch(`${process.env.BASE_URL}${urls.auth.refresh}`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({refreshToken: refresh})
                    });

                    const {tokens} = await response.json();

                    if (!tokens) {
                        await deleteCookies();
                        return NextResponse.redirect(new URL('/login', req.url));
                    }

                    await setCookie('accessToken', tokens.accessToken);
                    await setCookie('refreshToken', tokens.refreshToken);

                    return NextResponse.redirect(req.nextUrl);
                }
                return NextResponse.redirect(new URL('/login', req.url));
            }
        }
    }

export default proxy;

