import React, { useContext, useEffect, useState } from "react";
import { Link } from "@inertiajs/react";
import { CartContext } from "@/frontend/ui/CartContext";
import axios from "axios";

const OrderCreate = () => {
    const [customerName, setCustomerName] = useState("");
    const [shippingAddress, setShippingAddress] = useState("");
    const [contactNo, setContactNo] = useState("");
    const [localCartItems, setLocalCartItems] = useState([]);
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [shippingCharge, setShippingCharge] = useState(100);
    const { cartItems } = useContext(CartContext);

    useEffect(() => {
        if (!cartItems) {
            const storedCartItems =
                JSON.parse(localStorage.getItem("Cart")) || [];
            setLocalCartItems(storedCartItems);
        }
    }, [cartItems]);

    const itemsToUse = cartItems || localCartItems;

    console.log('items product id', itemsToUse)

    const calculateSubtotal = () => {
        if (!itemsToUse) return 0;

        return itemsToUse
            .reduce((total, item) => {
                const price = parseFloat(item.product.sales_price);
                const quantity = parseInt(item.quantity);
                return (
                    total +
                    (isNaN(price) || isNaN(quantity) ? 0 : price * quantity)
                );
            }, 0)
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const totalPrice = calculateSubtotal() + shippingCharge;


        const orderData = {
            customer_name: customerName,
            shipping_address: shippingAddress,
            contact_no: contactNo,
            shipping_charge: shippingCharge,
            total_price: totalPrice,
            cartItems: itemsToUse.map((item) => ({
                product_id: item.product.product_id,
                product_name: item.product.product_name,
                product_size: item.product_size?.join(", ") || "Not selected",
                quantity: item.quantity,
                product_image: item.product.image1,
            })),
        };

        console.log("Order Data: ", orderData);

        try {
            const response = await axios.post("/orders", orderData);

            if (response.status === 201) {
                localStorage.removeItem("Cart");
                setCustomerName("");
                setShippingAddress("");
                setContactNo("");
                setLocalCartItems([]);
                setSuccessMessage(response.data.message);
                setErrorMessage("");

                window.location.href = `/thanks/${response.data.order_id}`;
            }
        } catch (error) {
            console.error("Error during checkout:", error);
            setErrorMessage(
                error.response?.data?.message ||
                "There was an error processing your order. Please try again."
            );
            setSuccessMessage("");
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Shipping Address</h1>
            <Link
                href={route("home")}
                className="btn w-full bg-blue-500 text-white hover:bg-blue-600 text-lg"
            >
                Continue Shopping
            </Link>
            {successMessage && (
                <div
                    className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4"
                    role="alert"
                >
                    <span className="block sm:inline">{successMessage}</span>
                </div>
            )}
            {errorMessage && (
                <div
                    className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
                    role="alert"
                >
                    <span className="block sm:inline">{errorMessage}</span>
                </div>
            )}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <form onSubmit={handleSubmit}>
                    <div className="mb-2">
                        <label className="block text-gray-700">
                            Customer Name
                        </label>
                        <input
                            type="text"
                            className="w-full p-2 border rounded"
                            value={customerName.toUpperCase()}
                            onChange={(e) =>
                                setCustomerName(e.target.value.toUpperCase())
                            }
                            required
                        />
                    </div>

                    <div className="mb-2">
                        <label className="block text-gray-700">
                            Shipping Address
                        </label>
                        <input
                            type="text"
                            className="w-full p-2 border rounded"
                            value={shippingAddress.toUpperCase()}
                            onChange={(e) =>
                                setShippingAddress(e.target.value.toUpperCase())
                            }
                            required
                        />
                    </div>

                    <div className="mb-2">
                        <label className="block text-gray-700">
                            Contact No
                        </label>
                        <input
                            type="text"
                            className="w-full p-2 border rounded"
                            value={contactNo}
                            onChange={(e) => setContactNo(e.target.value)}
                            maxLength={15}
                            required
                        />
                    </div>

                    <div className="mb-2">
                        <label className="block text-gray-700 font-semibold mb-2">
                            Shipping Charge
                        </label>
                        <div className="flex space-x-4">
                            <label className="flex items-center">
                                <input
                                    type="radio"
                                    name="shipping_charge"
                                    value={100}
                                    checked={shippingCharge === 100}
                                    onChange={() => setShippingCharge(100)}
                                    className="mr-2"
                                />
                                Inside Dhaka - 100 Tk
                            </label>
                            <label className="flex items-center">
                                <input
                                    type="radio"
                                    name="shipping_charge"
                                    value={150}
                                    checked={shippingCharge === 150}
                                    onChange={() => setShippingCharge(150)}
                                    className="mr-2"
                                />
                                Outside Dhaka - 150 Tk
                            </label>
                        </div>
                    </div>

                    <div className="mt-2">
                        <button
                            type="submit"
                            className="btn btn-primary w-full"
                        >
                            Place Order
                        </button>
                    </div>
                </form>

                <div>
                    <h2 className="text-md font-semibold mb-2">
                        Order Summary
                    </h2>
                    <ul className="divide-y divide-gray-200">
                        {itemsToUse?.length ? (
                            itemsToUse.map((item, index) => (
                                <li key={index} className="flex py-2">
                                    <img
                                        src={`/public/images/products/${item.product.image1}`}
                                        alt={item.product.name}
                                        className="w-16 h-16 rounded-md"
                                    />
                                    <div className="ml-2 flex-1">
                                        <h3 className="text-lg font-semibold">
                                            {item.product.product_name}
                                        </h3>
                                        <p className="cart-item-sizes">
                                            Size:
                                            {item.product_size &&
                                                item.product_size.length > 0
                                                ? item.product_size.join(", ")
                                                : "Not selected"}
                                        </p>
                                    </div>
                                    <div className="ml-2 flex-1">
                                        <p className="text-sm text-gray-600">
                                            Quantity: {item.quantity}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            Unit Price:
                                            {item.product.sales_price}
                                        </p>
                                    </div>
                                    <div className="ml-2">
                                        <p className="text-md font-semibold">
                                            {(
                                                parseFloat(
                                                    item.product.sales_price
                                                ) * parseInt(item.quantity)
                                            )}.00
                                        </p>
                                    </div>
                                </li>
                            ))
                        ) : (
                            <p>Your cart is empty.</p>
                        )}
                    </ul>
                    <hr></hr>
                    <div className="flex justify-between items-center mt-2">
                        <span className="text-md font-semibold">Total (With Courier Charge)</span>
                        <span className="text-md font-semibold">
                        Tk {calculateSubtotal() + shippingCharge}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderCreate;
