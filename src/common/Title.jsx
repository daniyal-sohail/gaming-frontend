import React from 'react'

function Title({ title }) {
    return (
        <div className="inline-flex items-center px-4 py-2 cursor-pointer  border border-[#fc964c] bg-[#fc964c]/10 backdrop-blur-sm rounded-sm">
            <span className="text-sm font-light text-[#fff]">
                {title}
            </span>
        </div>
    )
}

export default Title