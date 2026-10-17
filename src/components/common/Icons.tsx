import type { JSX } from "react";

interface IconProps {
    size?: number;
}

export function CartIcon({ size = 18 }: IconProps): JSX.Element {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            focusable="false"
        >
            <circle cx="9" cy="20" r="1.5" />
            <circle cx="18" cy="20" r="1.5" />
            <path d="M2 3h3l2.6 12.4a1 1 0 0 0 1 .8h9.6a1 1 0 0 0 1-.8L21 7H6" />
        </svg>
    );
}