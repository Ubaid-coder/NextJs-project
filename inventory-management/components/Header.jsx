import React from 'react'
import { ModeToggle } from './ModeToggle'

function Header() {
    return (
        <>
            <header className="text-primary body-font">
                <div className="container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center">
                    <a className="flex title-font font-medium items-center text-primary mb-4 md:mb-0">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-10 h-10 text-white p-2 bg-indigo-500 rounded-full" viewBox="0 0 24 24">
                            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
                        </svg>
                        <span className="ml-3 text-xl">Stock Management System</span>
                    </a>
                    <nav className="md:ml-auto flex flex-wrap items-center text-base justify-center">
                        <a className="mr-5">First Link</a>
                        <a className="mr-5">Second Link</a>
                        <a className="mr-5">Third Link</a>
                        <a className="mr-5">Fourth Link</a>
                        <ModeToggle />
                    </nav>

                </div>
            </header>
        </>
    )
}

export default Header