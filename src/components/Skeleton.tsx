"use client";
import React from "react";

export function Block({ className = "", style }: { className?: string; style?: React.CSSProperties }) {
    return <div className={`motion-safe:animate-pulse bg-zinc-800 ${className}`} style={style} aria-hidden="true" />;
}

export function BlogCardSkeleton() {
    return (
        <article className="bg-zinc-900 border border-white/10 rounded-xl p-4 sm:p-6 mb-4 sm:mb-6 flex flex-col sm:flex-row gap-4">
            <div className="h-40 sm:h-48 w-full sm:w-64 rounded-xl bg-zinc-800" />
            <div className="flex-1 space-y-3">
                <div className="h-4 w-1/3 bg-zinc-800 rounded" />
                <div className="h-6 w-3/4 bg-zinc-800 rounded" />
                <div className="h-4 w-full bg-zinc-800 rounded" />
                <div className="h-4 w-5/6 bg-zinc-800 rounded" />
            </div>
        </article>
    );
}

export function ArticleSkeleton() {
    return (
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 py-12">
            <main className="lg:col-span-2 p-6 bg-transparent">
                <div className="mb-6">
                    <div className="w-full h-64 bg-zinc-800 rounded-xl mb-6" />
                    <div className="h-8 w-3/4 bg-zinc-800 rounded mb-4" />
                    <div className="h-4 w-1/4 bg-zinc-800 rounded mb-2" />
                    <div className="space-y-3">
                        <div className="h-4 w-full bg-zinc-800 rounded" />
                        <div className="h-4 w-full bg-zinc-800 rounded" />
                        <div className="h-4 w-5/6 bg-zinc-800 rounded" />
                        <div className="h-4 w-4/6 bg-zinc-800 rounded" />
                    </div>
                </div>
            </main>
            <aside className="lg:col-span-1">
                <div className="space-y-4">
                    <div className="h-40 bg-zinc-800 rounded" />
                    <div className="h-20 bg-zinc-800 rounded" />
                </div>
            </aside>
        </div>
    );
}

export function SidebarSkeleton() {
    return (
        <>
            <li className="">
                <div className="h-4 bg-zinc-800 rounded mb-2 w-3/4" />
                <div className="h-3 bg-zinc-800 rounded w-1/3" />
            </li>
            <li className="">
                <div className="h-4 bg-zinc-800 rounded mb-2 w-3/4" />
                <div className="h-3 bg-zinc-800 rounded w-1/3" />
            </li>
            <li className="">
                <div className="h-4 bg-zinc-800 rounded mb-2 w-3/4" />
                <div className="h-3 bg-zinc-800 rounded w-1/3" />
            </li>
        </>
    );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
    return (
        <div className="space-y-3">
            {Array.from({ length: rows }).map((_, i) => (
                <div key={i} className="p-3 bg-zinc-900 rounded flex justify-between items-center">
                    <div className="flex-1">
                        <div className="h-4 w-1/3 bg-zinc-800 rounded mb-2" />
                        <div className="h-3 w-1/2 bg-zinc-800 rounded" />
                    </div>
                    <div className="w-24 h-8 bg-zinc-800 rounded" />
                </div>
            ))}
        </div>
    );
}

export function DashboardStatsSkeleton() {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 bg-zinc-900 rounded-xl">
                <div className="h-12 w-12 rounded-full bg-zinc-800 mb-3" />
                <div className="h-4 w-1/3 bg-zinc-800 rounded mb-2" />
                <div className="h-6 w-1/2 bg-zinc-800 rounded" />
            </div>
            <div className="p-4 bg-zinc-900 rounded-xl">
                <div className="h-12 w-12 rounded-full bg-zinc-800 mb-3" />
                <div className="h-4 w-1/3 bg-zinc-800 rounded mb-2" />
                <div className="h-6 w-1/2 bg-zinc-800 rounded" />
            </div>
            <div className="p-4 bg-zinc-900 rounded-xl">
                <div className="h-12 w-12 rounded-full bg-zinc-800 mb-3" />
                <div className="h-4 w-1/3 bg-zinc-800 rounded mb-2" />
                <div className="h-6 w-1/2 bg-zinc-800 rounded" />
            </div>
        </div>
    );
}

export default function Skeleton() {
    return <Block className="h-6 w-24" />;
}
