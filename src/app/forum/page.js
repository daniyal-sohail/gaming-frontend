import ThreadList from '@/components/forumComponents/ThreadList'
import React from 'react'

export default function ForumPage() {
    return (
        <div className="min-h-screen bg-white  mt-24">
            <div className="max-w-6xl mx-auto">
                <ThreadList />
            </div>
        </div>
    )
}

