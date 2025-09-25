

export default function Heading({ headOne, headTwo, headThree, align = "center" }) {
    const isCenter = align === "center";

    return (
        <div className={`flex flex-col ${isCenter ? 'items-center text-center' : 'items-start text-left'}`}>

            {/* Large Heading */}
            <h1
                data-aos="fade-up"
                className={`my-1 max-w-3xl ${isCenter ? 'mx-auto' : ''} text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl ${isCenter ? 'text-center' : 'text-left'} text-white font-semibold`}
            >
                {headOne} <span className="bg-gradient-to-r from-amber-400 via-orange-500 to-amber-600 bg-clip-text text-transparent">{headTwo}</span> {headThree}
            </h1>


        </div>
    );
}