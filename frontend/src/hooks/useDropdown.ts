import {useState, useRef, useEffect} from 'react';

const useDropdown = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedValue, setSelectedValue] = useState<string | null>(null);
    const [selectedId, setSelectedId] = useState<string | null>(null);

    const dropdownRef = useRef<HTMLDivElement>(null);

    const toggleDropdown = () => setIsOpen(!isOpen);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return {
        isOpen,
        toggleDropdown,
        selectedValue,
        setSelectedValue,
        selectedId,
        setSelectedId,
        dropdownRef,
        setIsOpen
    };
}

export default useDropdown;