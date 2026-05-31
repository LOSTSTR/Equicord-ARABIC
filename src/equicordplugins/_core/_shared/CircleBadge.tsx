/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import ErrorBoundary from "@components/ErrorBoundary";
import { Tooltip, useRef } from "@webpack/common";
import type { JSX } from "react";

interface CircleBadgeProps {
    /** Pixel size of the badge (width = height). */
    size: number;
    /** Image shown inside the circle — a base64 data: URI or a URL. */
    image: string;
    /** Outer ring (circle) color. */
    ring: string;
    /** Tooltip text shown on hover, also used as the accessible label. */
    tooltip: string;
    /** CSS class carrying this badge's own glow/animation (defined in its styles.css). */
    className: string;
}

/**
 * Shared circular badge drawing: a colored ring with an image clipped inside,
 * wrapped in a hover tooltip. Every Esharq badge draws the exact same way —
 * only the image, ring color, tooltip and CSS class differ. Each badge keeps
 * its own data and styling and just calls this one component to draw itself,
 * so the drawing recipe lives in a single place instead of being copied.
 */
export function CircleBadge({ size, image, ring, tooltip, className }: CircleBadgeProps): JSX.Element {
    const clipId = useRef(`esharq-badge-${Math.random().toString(36).slice(2, 9)}`).current;
    return (
        <ErrorBoundary noop>
            <Tooltip text={tooltip} position="top">
                {({ onMouseEnter, onMouseLeave }) => (
                    <div
                        className={className}
                        onMouseEnter={onMouseEnter}
                        onMouseLeave={onMouseLeave}
                        style={{ width: size, height: size }}
                        role="img"
                        aria-label={tooltip}
                    >
                        <svg width={size} height={size} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                            <defs>
                                <clipPath id={clipId}><circle cx="12" cy="12" r="10" /></clipPath>
                            </defs>
                            <circle cx="12" cy="12" r="12" fill={ring} />
                            <image
                                href={image}
                                x="2" y="2" width="20" height="20"
                                preserveAspectRatio="xMidYMid slice"
                                clipPath={`url(#${clipId})`}
                            />
                        </svg>
                    </div>
                )}
            </Tooltip>
        </ErrorBoundary>
    );
}
