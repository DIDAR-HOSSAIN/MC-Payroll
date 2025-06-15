import React, { useState, useEffect } from "react";
import { Inertia as InertiaCore } from "@inertiajs/inertia";
import AdminDashboardLayout from "@/backend/Dashboard/AdminDashboardLayout";
import { Head } from "@inertiajs/react";

const EditOrder = ({ auth, orderDetails }) => {
    const [formData, setFormData] = useState({
        customer_name: "",
        shipping_address: "",
        contact_no: "",
        total_price: 0,
        cartItems: [],
    });

    useEffect(() => {
        if (orderDetails) {
            setFormData({
                customer_name: orderDetails.customer_name || "",
                shipping_address: orderDetails.shipping_address || "",
                contact_no: orderDetails.contact_no || "",
                total_price: orderDetails.total_price || 0,
                cartItems: orderDetails.order_items.map((item) => ({
                    id: item.id,
                    product_id: item.product_id || "",
                    product_name: item.product_name || "",
                    serial_no: item.serial_no || "",
                    product_image: item.product_image || "",
                    unit_price: item.unit_price || 0,
                    quantity: item.quantity || 1,
                    subtotal: (item.unit_price || 0) * (item.quantity || 1),
                })),
            });
        }
    }, [orderDetails]);

    useEffect(() => {
        const newTotalPrice = formData.cartItems.reduce(
            (total, item) =>
                total + (item.unit_price || 0) * (item.quantity || 0),
            0
        );
        setFormData((prevData) => ({
            ...prevData,
            total_price: newTotalPrice,
        }));
    }, [formData.cartItems]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleItemChange = (index, e) => {
        const { name, value } = e.target;
        const updatedItems = formData.cartItems.map((item, idx) =>
            idx === index
                ? {
                      ...item,
                      [name]: value || "",
                      subtotal: item.unit_price * item.quantity,
                  }
                : item
        );
        setFormData((prevData) => ({
            ...prevData,
            cartItems: updatedItems,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Form Data:", formData); // Debugging
        InertiaCore.put(
            route("orders.update", { order: orderDetails.id }),
            formData
        );
    };

    const addNewItem = () => {
        setFormData((prevData) => ({
            ...prevData,
            cartItems: [
                ...prevData.cartItems,
                {
                    id: null,
                    product_id: "",
                    product_name: "",
                    serial_no: "",
                    unit_price: 0,
                    quantity: 1,
                    subtotal: 0,
                },
            ],
        }));
    };

    const removeItem = (index) => {
        const updatedItems = formData.cartItems.filter(
            (item, idx) => idx !== index
        );
        setFormData((prevData) => ({
            ...prevData,
            cartItems: updatedItems,
        }));
    };

    if (!orderDetails) {
        return <div>Loading...</div>;
    }

    return (
        <AdminDashboardLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Edit Order
                </h2>
            }
        >
            <Head title="Edit Order" />
            <div className="container mx-auto mt-4">
                <h1 className="text-2xl font-bold mb-4">Edit Order</h1>
                <form
                    onSubmit={handleSubmit}
                    className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
                >
                    <div className="mb-4">
                        <label
                            className="block text-gray-700 text-sm font-bold mb-2"
                            htmlFor="customer_name"
                        >
                            Customer Name
                        </label>
                        <input
                            type="text"
                            id="customer_name"
                            name="customer_name"
                            value={formData.customer_name}
                            onChange={handleChange}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label
                            className="block text-gray-700 text-sm font-bold mb-2"
                            htmlFor="shipping_address"
                        >
                            Shipping Address
                        </label>
                        <input
                            type="text"
                            id="shipping_address"
                            name="shipping_address"
                            value={formData.shipping_address}
                            onChange={handleChange}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label
                            className="block text-gray-700 text-sm font-bold mb-2"
                            htmlFor="contact_no"
                        >
                            Contact Number
                        </label>
                        <input
                            type="text"
                            id="contact_no"
                            name="contact_no"
                            value={formData.contact_no}
                            onChange={handleChange}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label
                            className="block text-gray-700 text-sm font-bold mb-2"
                            htmlFor="total_price"
                        >
                            Total Price
                        </label>
                        <input
                            type="number"
                            id="total_price"
                            name="total_price"
                            value={formData.total_price}
                            readOnly
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            required
                        />
                    </div>

                    {formData.cartItems.map((item, index) => (
                        <div key={index} className="mb-4 p-4 border rounded">
                            <div className="mb-4">
                                <label
                                    className="block text-gray-700 text-sm font-bold mb-2"
                                    htmlFor={`product_name_${index}`}
                                >
                                    Product Name
                                </label>
                                <input
                                    type="text"
                                    id={`product_name_${index}`}
                                    name="product_name"
                                    value={item.product_name}
                                    onChange={(e) => handleItemChange(index, e)}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    required
                                />
                            </div>

                            <div className="mb-4">
                                <label
                                    className="block text-gray-700 text-sm font-bold mb-2"
                                    htmlFor={`serial_no_${index}`}
                                >
                                    Serial No
                                </label>
                                <input
                                    type="text"
                                    id={`serial_no_${index}`}
                                    name="serial_no"
                                    value={item.serial_no}
                                    onChange={(e) => handleItemChange(index, e)}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                />
                            </div>

                            <div className="mb-4">
                                <label
                                    className="block text-gray-700 text-sm font-bold mb-2"
                                    htmlFor={`quantity_${index}`}
                                >
                                    Quantity
                                </label>
                                <input
                                    type="number"
                                    id={`quantity_${index}`}
                                    name="quantity"
                                    value={item.quantity}
                                    onChange={(e) => handleItemChange(index, e)}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label
                                    className="block text-gray-700 text-sm font-bold mb-2"
                                    htmlFor={`unit_price_${index}`}
                                >
                                    Unit Price
                                </label>
                                <input
                                    type="number"
                                    id={`unit_price_${index}`}
                                    name="unit_price"
                                    value={item.unit_price}
                                    onChange={(e) => handleItemChange(index, e)}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label
                                    className="block text-gray-700 text-sm font-bold mb-2"
                                    htmlFor={`subtotal_${index}`}
                                >
                                    Subtotal
                                </label>
                                <input
                                    type="number"
                                    id={`subtotal_${index}`}
                                    name="subtotal"
                                    value={item.unit_price * item.quantity}
                                    readOnly
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                />
                            </div>
                            <button
                                type="button"
                                onClick={() => removeItem(index)}
                                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                            >
                                Remove Item
                            </button>
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={addNewItem}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                        Add Item
                    </button>
                    <div className="flex items-center justify-between mt-4">
                        <button
                            type="submit"
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        >
                            Update Order
                        </button>
                    </div>
                </form>
            </div>
        </AdminDashboardLayout>
    );
};

export default EditOrder;