import React, { useState } from "react";
import { Link, usePage } from "@inertiajs/react";
import { hasAnyRole, hasRole } from "../Utils/RoleCheck";

const SidebarMenu = () => {
    const { auth } = usePage().props;

    const [dropdownState, setDropdownState] = useState({
        generalMemberDropdown: false,
        productDropdown: false,
        orderDropdown: false,
        sliderDropdown: false,
        categoryDropdown: false,
        settings: false,
    });

    const toggleDropdown = (dropdown) => {
        setDropdownState((prevState) => ({
            ...prevState,
            [dropdown]: !prevState[dropdown],
        }));
    };

    return (
        <div>
            <div className="flex">
                <button
                    onClick={() => toggleDropdown("generalMemberDropdown")}
                    className="bg-blue-400 hover:bg-white font-bold btn w-full text-lg rounded"
                >
                    {dropdownState.generalMemberDropdown
                        ? "General Member ▲"
                        : "General Member ▼"}
                </button>
            </div>
            {dropdownState.generalMemberDropdown && (
                <div className="flex flex-col gap-1">
                    {hasAnyRole(auth.user, [
                        "super-admin",
                        "admin",
                        "sub-admin",
                        "user",
                    ]) && (
                        <Link
                            href="/general/members/create"
                            className="hover:bg-yellow-200 font-bold btn btn-blue rounded"
                        >
                            Add New Member
                        </Link>
                    )}

                    {hasAnyRole(auth.user, [
                        "super-admin",
                        "admin",
                        "sub-admin",
                        "user",
                        "general",
                    ]) && (
                        <Link
                            href="/general/members"
                            className="hover:bg-yellow-200 font-bold btn btn-blue rounded"
                        >
                            Manage Members
                        </Link>
                    )}
                </div>
            )}

            <div className="flex">
                <button
                    onClick={() => toggleDropdown("productDropdown")}
                    className="bg-blue-400 hover:bg-white font-bold btn w-full text-lg rounded"
                >
                    {dropdownState.productDropdown
                        ? "Products ▲"
                        : "Products ▼"}
                </button>
            </div>
            {dropdownState.productDropdown && (
                <div className="flex flex-col gap-1">
                    {hasAnyRole(auth.user, [
                        "super-admin",
                        "admin",
                        "sub-admin",
                        "user",
                    ]) && (
                        <Link
                            href="/products/create"
                            className="hover:bg-yellow-200 font-bold btn btn-blue rounded"
                        >
                            Add Product
                        </Link>
                    )}

                    {hasAnyRole(auth.user, [
                        "super-admin",
                        "admin",
                        "sub-admin",
                        "user",
                        "general",
                    ]) && (
                        <Link
                            href="/products"
                            className="hover:bg-yellow-200 font-bold btn btn-blue rounded"
                        >
                            Manage Products
                        </Link>
                    )}
                </div>
            )}

            <div className="flex">
                <button
                    onClick={() => toggleDropdown("orderDropdown")}
                    className="bg-blue-400 hover:bg-white font-bold btn w-full text-lg rounded"
                >
                    {dropdownState.orderDropdown ? "Orders ▲" : "Orders ▼"}
                </button>
            </div>

            {dropdownState.orderDropdown && (
                <div className="flex flex-col gap-1">
                    <Link
                        href="/orders/create"
                        className="hover:bg-yellow-200 font-bold btn btn-blue rounded"
                    >
                        Add Order
                    </Link>
                    <Link
                        href="/orders"
                        className="hover:bg-yellow-200 font-bold btn btn-blue rounded"
                    >
                        Manage Order
                    </Link>
                </div>
            )}

            <div className="flex">
                <button
                    onClick={() => toggleDropdown("sliderDropdown")}
                    className="bg-blue-400 hover:bg-white font-bold btn w-full text-lg rounded"
                >
                    {dropdownState.sliderDropdown ? "Slider ▲" : "Slider ▼"}
                </button>
            </div>
            {dropdownState.sliderDropdown && (
                <div className="flex flex-col gap-1">
                    {hasAnyRole(auth.user, ["super-admin", "admin"]) && (
                        <Link
                            href="/sliders/create"
                            className="hover:bg-yellow-200 font-bold btn btn-blue rounded"
                        >
                            Add Slider
                        </Link>
                    )}

                    {hasAnyRole(auth.user, ["super-admin", "admin"]) && (
                        <Link
                            href="/sliders"
                            className="hover:bg-yellow-200 font-bold btn btn-blue rounded"
                        >
                            Manage Slider
                        </Link>
                    )}
                </div>
            )}

            <div className="flex">
                <button
                    onClick={() => toggleDropdown("categoryDropdown")}
                    className="bg-blue-400 hover:bg-white font-bold btn w-full text-lg rounded"
                >
                    {dropdownState.categoryDropdown
                        ? "Categories ▲"
                        : "Categories ▼"}
                </button>
            </div>
            {dropdownState.categoryDropdown && (
                <div className="flex flex-col gap-1">
                    <Link
                        href="/categories/create"
                        className="hover:bg-yellow-200 font-bold btn btn-blue rounded"
                    >
                        Add Category
                    </Link>
                    <Link
                        href="/categories"
                        className="hover:bg-yellow-200 font-bold btn btn-blue rounded"
                    >
                        Manage Category
                    </Link>
                </div>
            )}

            <div className="flex">
                <button
                    onClick={() => toggleDropdown("settings")}
                    className="bg-blue-400 hover:bg-white font-bold btn w-full text-lg rounded"
                >
                    {dropdownState.settings ? "Settings ▲" : "Settings ▼"}
                </button>
            </div>
            {dropdownState.settings && (
                <div className="flex flex-col">
                    {hasAnyRole(auth.user, ["super-admin", "admin"]) && (
                        <Link
                            className="hover:bg-yellow-200 font-bold btn btn-blue rounded"
                            href="/users"
                        >
                            Manage User
                        </Link>
                    )}
                </div>
            )}
            {dropdownState.settings && (
                <div className="flex flex-col">
                    {hasRole(auth.user, "super-admin") && (
                        <Link
                            className="hover:bg-yellow-200 font-bold btn btn-blue rounded"
                            href="/roles"
                        >
                            Manage roles
                        </Link>
                    )}
                </div>
            )}

            {dropdownState.settings && (
                <div className="flex flex-col">
                    {hasRole(auth.user, "super-admin") && (
                        <Link
                            className="hover:bg-yellow-200 font-bold btn btn-blue rounded"
                            href="/permissions"
                        >
                            Manage Permissions
                        </Link>
                    )}
                </div>
            )}
        </div>
    );
};

export default SidebarMenu;
