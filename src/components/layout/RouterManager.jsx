'use client';

import { usePathname } from 'next/navigation';
import Navbar from './Navbar';
import Footer from './Footer';

export default function RouterManager({ children }) {
    const pathname = usePathname();

    // Pages where navbar and footer should be hidden
    const authPages = ['/signin', '/signup'];
    const shouldShowLayout = !authPages.includes(pathname);

    return (
        <>
            {shouldShowLayout && <Navbar />}
            {children}
            {shouldShowLayout && <Footer />}
        </>
    );
}
