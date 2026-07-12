import { useState, useEffect } from 'react';

export const Toast = ({ message }: { message: string | null }) => {
    const [show, setShow] = useState(false);

    useEffect(() => {
        if (message) {
            setShow(true);
            const timer = setTimeout(() => setShow(false), 3000);
            return () => clearTimeout(timer);
        }
    }, [message]);

    if (!show) return null;

    return (
        <div className="fixed bottom-4 right-4 bg-[#43a047] text-white px-4 py-2 rounded">
            {message}
        </div>
    );
};