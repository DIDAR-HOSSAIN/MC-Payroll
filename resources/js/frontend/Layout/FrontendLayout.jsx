import React from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { usePage } from "@inertiajs/react";

const FrontendLayout = ({ children, user, handleSearch, searchQuery }) => {
    const { menus } = usePage().props;

    console.log("Menus:", menus); // Ensure it's fetching correctly
    return (
        <div>
            <Navbar user={user} menus={menus} />
            {children}
            <Footer />
        </div>
    );
};

export default FrontendLayout;
