// hooks/useFlashMessage.ts
"use client";

import { useState, useEffect } from "react";

interface Flash {
    message: string;
    type: "success" | "error" | "info";
    key: number;
}

export const useFlashMessage = () => {
    const [flash, setFlash] = useState<Flash | null>(null);

    useEffect(() => {
        // baca cookie flash
        const cookie = document.cookie.split("; ").find(c => c.startsWith("flash="));
        if (!cookie) return;

        try {
            const value = JSON.parse(decodeURIComponent(cookie.split("=")[1]));
            setFlash({ ...value, key: Date.now() });

            // hapus cookie setelah dibaca
            document.cookie = "flash=; path=/; max-age=0";
        } catch (err) {
            console.error(err);
        }
    }, []);

    return flash;
};