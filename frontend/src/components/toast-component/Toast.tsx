import {useState, useEffect, FC} from 'react';

interface Props {
    message: string | null;
    type?: "success" | "error";
}

export const Toast: FC<Props> = ({ message, type = "success" }) => {
    const [show, setShow] = useState(false);

    const toastStyles = {
        success: "bg-[#43a047]",
        error: "bg-red-500",
    };

    useEffect(() => {
        if (message) {
            setShow(true);
            const timer = setTimeout(() => setShow(false), 3000);
            return () => clearTimeout(timer);
        }
    }, [message]);

    if (!show) return null;

    return (
        <div className={`fixed bottom-4 right-4 ${toastStyles[type]} text-white px-4 py-2 rounded`}>
            {message}
        </div>
    );
};