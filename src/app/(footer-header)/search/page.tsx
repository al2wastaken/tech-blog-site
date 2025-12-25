import React, { Suspense } from 'react';
import SearchClient from './SearchClient';
import Sidebar from '@/components/Sidebar';
import { BlogCardSkeleton } from '@/components/Skeleton';

export default function SearchPage() {
    return (
        <Suspense fallback={

            <>
                <BlogCardSkeleton />
                <BlogCardSkeleton />
                <BlogCardSkeleton />
            </>
        }>
            <SearchClient />
        </Suspense>
    );
}
