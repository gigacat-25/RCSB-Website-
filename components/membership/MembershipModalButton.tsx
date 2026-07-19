"use client";

import { useState } from "react";
import MembershipModal from "./MembershipModal";

interface MembershipModalButtonProps {
    children?: React.ReactNode;
    className?: string;
}

export default function MembershipModalButton({ children, className }: MembershipModalButtonProps) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <button
                type="button"
                onClick={() => setIsOpen(true)}
                className={className || "px-8 py-4 bg-brand-gold hover:bg-yellow-500 text-brand-blue font-black rounded-full transition-all shadow-[0_10px_30px_rgba(247,168,27,0.3)] hover:shadow-[0_15px_35px_rgba(247,168,27,0.5)] hover:-translate-y-1"}
            >
                {children || "Apply for Membership →"}
            </button>

            <MembershipModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
        </>
    );
}
