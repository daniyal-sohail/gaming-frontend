"use client";
import React, { useRef, useState } from "react";
import {
    motion,
    useAnimationFrame,
    useMotionTemplate,
    useMotionValue,
    useTransform,
} from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/cn";

export function Button({
    borderRadius = "1rem",
    children,
    as: Component = "button",
    containerClassName,
    borderClassName,
    duration,
    className,
    label = "Free Audit",
    showIcon = true,
    ...otherProps
}) {
    const [hovered, setHovered] = useState(false);

    return (
        <Component
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            className={cn(
                "group relative inline-flex h-12 w-fit overflow-hidden bg-transparent p-[1px] text-base cursor-pointer",
                "transform transition-all duration-500 ease-out",

                containerClassName
            )}
            style={{ borderRadius }}
            {...otherProps}
        >
            {/* animated border layer */}
            <div className="absolute inset-0" style={{ borderRadius: `calc(${borderRadius} * 0.96)` }}>
                <MovingBorder
                    duration={duration}
                    rx="30%"
                    ry="30%"
                    paused={hovered}
                    showFullStroke={false}
                >
                    <div
                        className={cn(
                            "h-16 w-16 bg-[radial-gradient(#f59e0b_35%,transparent_60%)] opacity-70",
                            hovered ? "opacity-0" : "opacity-70",
                            "transition-opacity duration-300",
                            borderClassName
                        )}
                    />
                </MovingBorder>
            </div>

            {/* inner glassy pill */}
            <div
                className={cn(
                    "relative flex h-full items-center justify-center gap-2 px-5",
                    "rounded-[inherit] border transition-all duration-500 ease-out",
                    "backdrop-blur-xl",
                    hovered
                        ? "border-amber-400/50 bg-gradient-to-r from-neutral-800/95 via-neutral-700/95 to-neutral-800/95 text-amber-50" +
                        " shadow-[inset_0_1px_0_rgba(251,191,36,0.2),0_0_30px_rgba(245,158,11,0.4),0_10px_40px_rgba(0,0,0,0.3)]"
                        : "border-white/10 bg-neutral-900/90 text-white" +
                        " shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_2px_8px_rgba(0,0,0,0.45)]",
                    className
                )}
                style={{ borderRadius: `calc(${borderRadius} * 0.96)` }}
            >
                {/* Enhanced highlight effects */}
                <span className={cn(
                    "pointer-events-none absolute inset-x-0 bottom-0 h-px rounded-full transition-all duration-700",
                    hovered
                        ? "bg-gradient-to-r from-transparent via-amber-300 to-transparent opacity-100 shadow-[0_0_8px_rgba(251,191,36,0.6)]"
                        : "bg-gradient-to-r from-transparent via-amber-400/30 to-transparent opacity-0"
                )} />

                {/* Top rim highlight */}
                <span className={cn(
                    "pointer-events-none absolute inset-x-0 top-0 h-px rounded-full transition-all duration-700",
                    hovered
                        ? "bg-gradient-to-r from-transparent via-amber-200/40 to-transparent opacity-100"
                        : "opacity-0"
                )} />

                <motion.span
                    className="relative z-10 font-semibold"
                    animate={hovered
                        ? { scale: 1.02, textShadow: "0 0 8px rgba(251,191,36,0.5)" }
                        : { scale: 1, textShadow: "none" }
                    }
                    transition={{ duration: 0.4, ease: "easeOut" }}
                >
                    {children ?? label}
                </motion.span>

                {showIcon && (
                    <motion.span
                        className="relative z-10 inline-flex items-center justify-center"
                        animate={hovered
                            ? {
                                x: 6,
                                y: -3,
                                rotate: 45,
                                scale: 1.15,
                                filter: "drop-shadow(0 0 4px rgba(251,191,36,0.6))"
                            }
                            : {
                                x: 0,
                                y: 0,
                                rotate: 0,
                                scale: 1,
                                filter: "drop-shadow(0 0 0px rgba(251,191,36,0))"
                            }
                        }
                        transition={{
                            type: "spring",
                            stiffness: 300,
                            damping: 20,
                            duration: 0.6
                        }}
                    >
                        <ArrowUpRight className="h-4 w-4 text-current" aria-hidden="true" />
                    </motion.span>
                )}
            </div>
        </Component>
    );
}

/* ---------- animation helper with hover controls ---------- */
export const MovingBorder = ({
    children,
    duration = 3000,
    rx,
    ry,
    paused = false,
    showFullStroke = false,
    ...otherProps
}) => {
    const pathRef = useRef(null);
    const progress = useMotionValue(0);

    useAnimationFrame((time) => {
        if (paused) return; // ⬅️ freeze the orb on hover
        const length = pathRef.current?.getTotalLength();
        if (length) {
            const pxPerMillisecond = length / duration;
            progress.set((time * pxPerMillisecond) % length);
        }
    });

    const x = useTransform(progress, (v) => pathRef.current?.getPointAtLength(v).x);
    const y = useTransform(progress, (v) => pathRef.current?.getPointAtLength(v).y);
    const transform = useMotionTemplate`translateX(${x}px) translateY(${y}px) translateX(-50%) translateY(-50%)`;

    return (
        <>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                preserveAspectRatio="none"
                className="absolute h-full w-full"
                width="100%"
                height="100%"
                {...otherProps}
            >
                <defs>
                    <linearGradient id="btn-stroke" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#f59e0b" />
                        <stop offset="50%" stopColor="#fbbf24" />
                        <stop offset="100%" stopColor="#f59e0b" />
                    </linearGradient>
                </defs>

                {/* hover: full gradient stroke */}
                <rect
                    fill="none"
                    width="100%"
                    height="100%"
                    rx={rx}
                    ry={ry}
                    stroke="url(#btn-stroke)"
                    strokeWidth="2"
                    className={cn(
                        "transition-opacity duration-200",
                        showFullStroke ? "opacity-100" : "opacity-0"
                    )}
                />

                {/* path for measuring/moving orb */}
                <rect fill="none" width="100%" height="100%" rx={rx} ry={ry} ref={pathRef} />
            </svg>

            {/* moving orb (hidden when hovered) */}
            <motion.div
                style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    display: "inline-block",
                    transform,
                    opacity: showFullStroke ? 0 : 1,
                }}
                transition={{ duration: 0.2 }}
            >
                {children}
            </motion.div>
        </>
    );
};

export default Button;
