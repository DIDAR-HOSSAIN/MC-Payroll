import AdminDashboardLayout from "@/backend/Dashboard/AdminDashboardLayout";

const ShowOrder = ({ auth, order }) => {
    console.log("show order", order);

    // Format date for readability
    const formatDate = (date) => new Date(date).toLocaleDateString("en-GB");

    if (!order) {
        return (
            <AdminDashboardLayout
                user={auth.user}
                header={<h2 className="text-lg font-bold">Order Details</h2>}
            >
                <div className="flex items-center justify-center h-64 text-gray-600 text-lg">
                    No order details found.
                </div>
            </AdminDashboardLayout>
        );
    }

    // Ensure unit_price and quantity are valid numbers before calculations
    const grandTotal =
        order.order_items.reduce((sum, item) => {
            const quantity = Number(item.quantity) || 0;
            const unitPrice = Number(item.unit_price) || 0;
            return sum + quantity * unitPrice;
        }, 0) + (Number(order.shipping_charge) || 0);


    return (
        <AdminDashboardLayout
            user={auth.user}
            header={<h2 className="text-lg font-bold">Order Details</h2>}
        >
            {/* Order Information */}
            <div className="bg-white p-4 md:p-6 shadow-md rounded-lg mb-4">
                <h1 className="text-xl md:text-2xl font-bold text-gray-800 border-b pb-2 md:pb-3 mb-2">
                    Order Information
                </h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-gray-700 text-sm md:text-base">
                    <p>
                        <strong>Order ID:</strong> {order.order_id}
                    </p>
                    <p>
                        <strong>Customer Name:</strong> {order.customer_name}
                    </p>
                    <p>
                        <strong>Contact No:</strong> {order.contact_no}
                    </p>
                    <p>
                        <strong>Shipping Address:</strong>{" "}
                        {order.shipping_address}
                    </p>
                    <p>
                        <strong>Order Date:</strong>{" "}
                        {formatDate(order.order_date)}
                    </p>
                    <p>
                        <strong>Total Price:</strong> Tk. {order.total_price}
                    </p>
                </div>
            </div>

            {/* Order Items */}
            <div className="bg-white p-4 md:p-6 shadow-md rounded-lg">
                <h2 className="text-lg md:text-xl font-semibold text-gray-800 border-b pb-2">
                    Order Items
                </h2>

                {order.order_items?.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full border border-gray-300 rounded-lg overflow-hidden mt-2">
                            <thead className="bg-gray-100 text-gray-600 text-xs md:text-sm uppercase tracking-wide">
                                <tr>
                                    <th className="border px-2 md:px-4 py-2">
                                        Product Image
                                    </th>
                                    <th className="border px-2 md:px-4 py-2">
                                        Product Name
                                    </th>
                                    <th className="border px-2 md:px-4 py-2">
                                        Product Sizes
                                    </th>
                                    <th className="border px-2 md:px-4 py-2 text-right">
                                        Quantity
                                    </th>
                                    <th className="border px-2 md:px-4 py-2 text-right">
                                        Price
                                    </th>
                                    <th className="border px-2 md:px-4 py-2 text-right">
                                        Total
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {order.order_items.map((item, index) => (
                                    <tr
                                        key={index}
                                        className="hover:bg-gray-50 text-xs md:text-sm"
                                    >
                                        <td className="border px-2 md:px-4 py-2">
                                            <img
                                                src={`/public/images/products/${item.product_image}`}
                                                alt={item.product_name}
                                                className="w-12 h-12 md:w-16 md:h-16 object-cover rounded"
                                            />
                                        </td>
                                        <td className="border px-2 md:px-4 py-2">
                                            {item.product_name}
                                        </td>
                                        <td className="border px-2 md:px-4 py-2">
                                            {item.product_size}
                                        </td>
                                        <td className="border px-2 md:px-4 py-2 text-right">
                                            {item.quantity}
                                        </td>
                                        <td className="border px-2 md:px-4 py-2 text-right">
                                            Tk {item.unit_price}
                                        </td>
                                        <td className="border px-2 md:px-4 py-2 text-right">
                                            Tk {(
                                                item.quantity * item.unit_price
                                            )}.00
                                        </td>
                                    </tr>
                                ))}
                                <tr className="font-bold bg-gray-100">
                                    <td
                                        colSpan="5"
                                        className="border px-2 md:px-4 py-2 text-right"
                                    >
                                        Grand Total:
                                    </td>
                                    <td className="border px-2 md:px-4 py-2 text-right">
                                        {grandTotal}.00
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="text-gray-600 mt-4">
                        No order items available.
                    </div>
                )}
            </div>
        </AdminDashboardLayout>
    );
};

export default ShowOrder;
