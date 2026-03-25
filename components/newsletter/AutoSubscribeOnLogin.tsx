"use client";

import { useEffect, useRef } from "react";
import { useUser } from "@clerk/nextjs";

/**
 * Silently subscribes Clerk-logged-in users to the newsletter on first login.
 * Renders nothing visible — just a side-effect component.
 */
export default function AutoSubscribeOnLogin() {
    const { isSignedIn, user } = useUser();
    const attempted = useRef(false);

    useEffect(() => {
        if (!isSignedIn || !user || attempted.current) return;
        const email = user.primaryEmailAddress?.emailAddress;
        if (!email) return;

        // Only run once per browser session
        if (sessionStorage.getItem("rcsbAutoSub") === "true") return;
        attempted.current = true;

        fetch("/api/newsletter/subscribe", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, name: user.fullName || null }),
        })
            .then(() => {
                sessionStorage.setItem("rcsbAutoSub", "true");
                // Also set the popup suppression so they don't see the popup
                localStorage.setItem("rcsbSubscribed", "true");
            })
            .catch(() => {/* silent fail */ });
    }, [isSignedIn, user]);

    return null;
}
