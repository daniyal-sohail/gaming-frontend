import React from 'react'

function Title({ title }) {
    return (
        <div className="inline-flex items-center px-4 py-2 cursor-pointer  border border-cyan-500 bg-cyan-500/10 backdrop-blur-sm rounded-sm">
            <span className="text-sm font-light text-black">
                {title}
            </span>
        </div>
    )
}

export default Title