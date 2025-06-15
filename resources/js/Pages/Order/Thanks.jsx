import React from "react";
import { Link } from "@inertiajs/react";

const Thanks = ({ orderDetails }) => {
    console.log("thanks", orderDetails);

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center px-4">
            <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-2xl">
                {/* Thank You Header */}
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-gray-800 mb-4">
                        🎉 Thank You!
                    </h1>
                    <p className="text-lg text-gray-600">
                        Your order has been successfully placed.
                    </p>
                    <p className="mt-2 text-gray-700 font-semibold">
                        Order No:
                        <span className="text-blue-600">
                            {orderDetails.order_id}
                        </span>
                    </p>
                </div>

                {/* Order Items */}
                <h2 className="text-lg font-semibold text-gray-800 mb-4">
                    Order Details
                </h2>
                <ul className="divide-y divide-gray-300">
                    {orderDetails?.order_items.map((item) => (
                        <li key={item.id} className="flex items-center py-4">
                            <img
                                src={`/public/images/products/${item.product_image}`}
                                alt={item.product_name}
                                className="w-16 h-16 rounded-md object-cover"
                            />
                            <div className="ml-4 flex-1">
                                <h3 className="text-lg font-medium text-gray-800">
                                    {item.product_name}
                                </h3>
                                <p className="text-sm text-gray-600">
                                    Size: {item.product_size || "N/A"}
                                </p>
                            </div>
                            <div className="ml-4 flex-1">
                                <p className="text-sm text-gray-600">
                                    Quantity: {item.quantity}
                                </p>
                                <p className="text-sm text-gray-600">
                                    Price: Tk {item.unit_price}
                                </p>
                            </div>
                            <div className="ml-4 flex-1">
                                <p className="text-sm text-gray-600">
                                    Sub Total: {item.subtotal} Tk
                                </p>
                            </div>
                        </li>
                    ))}

                    {/* Total Price */}
                    <div className="mr-9 flex-1">
                        <p className="text-lg font-bold text-gray-800 text-right">
                            Total: {orderDetails.total_price} Tk
                        </p>
                    </div>
                </ul>

                <div className="mt-8">
                    <Link
                        href={route("home")}
                        className="block w-full bg-blue-500 text-white text-center py-3 rounded-lg text-lg font-medium hover:bg-blue-600 transition duration-200"
                    >
                        Continue Shopping
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Thanks;
