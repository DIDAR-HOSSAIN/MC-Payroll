import React, { useRef } from "react";
import logo from "@/assets/images/Logo/Logo-Bright.png";
// import signature from "@/assets/images/sign/didar_sign.png";
import { useReactToPrint } from "react-to-print";
import AdminDashboardLayout from "@/backend/Dashboard/AdminDashboardLayout";
import { Head } from "@inertiajs/react";
import numberToWords from "number-to-words";
import { QRCodeCanvas } from "qrcode.react";

const Invoice = ({ auth, invoice }) => {
    console.log('invoice', invoice);

    const formatDate = (dateString) => {
        const options = { day: "numeric", month: "short", year: "numeric" };
        return new Date(dateString).toLocaleDateString("en-GB", options);
    };

    const total = invoice.order_items.reduce((sum, item) => {
        const subtotal = parseFloat(item.subtotal) || 0;
        return sum + subtotal;
    }, 0);

    const contentToPrint = useRef(null);
    const handlePrint = useReactToPrint({
        documentTitle: `${invoice.order_id || "N/A"}`,
        onBeforePrint: () => console.log("before printing..."),
        onAfterPrint: () => console.log("after printing..."),
        removeAfterPrint: true,
        content: () => contentToPrint.current,
        pageStyle: `
            @page {
                size: A4;
                margin: 0;
            }
            @media print {
                .total-section {
                    width: auto !important;
                    text-align: right !important;
                }
                .in-word-section {
                    flex-grow: 1 !important;
                    text-align: left !important;
                }
            }
        `,
    });

    // Function to convert number to inwords
    const convertToWords = (amount) => {
        return numberToWords.toWords(amount);
    };

    return (
        <AdminDashboardLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Invoice
                </h2>
            }
        >
            <Head title="Invoice" />
            <button
                onClick={() => {
                    handlePrint(null, () => contentToPrint.current);
                }}
                className="mx-auto mt-2 block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
                Print
            </button>
            <div
                className="max-w-4xl mx-auto p-4 bg-white rounded-lg"
                ref={contentToPrint}
            >
                {/* Logo and Company Information */}
                <div className="flex items-center justify-between mb-2 bg-blue-100 p-2 overflow-x-auto">
                    <div className="flex items-center flex-shrink-0">
                        <img
                            src={logo}
                            alt="Company Logo"
                            className="h-20 md:h-32 mr-4"
                        />
                        <div className="flex flex-col flex-shrink-0">
                            <h1 className="text-2xl md:text-3xl font-bold text-[#11017d] whitespace-nowrap">
                                Bright Fashion 24
                            </h1>
                            <p className="text-black whitespace-nowrap">
                                Address: Green Saronika, Elephent Road, Dhaka
                            </p>
                            <p className="text-black whitespace-nowrap">
                                Mob: +8801778862270
                            </p>
                            <p className="text-black whitespace-nowrap">
                                web: www.brightfashion24.com
                            </p>
                            <p className="text-black whitespace-nowrap">
                                Email: brightfashion95@gmail.com
                            </p>
                        </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                        <h2 className="text-xl md:text-2xl font-bold text-[#fc0101]">
                            Invoice
                        </h2>
                        <p className="text-black whitespace-nowrap">
                            Invoice #: {invoice.order_id}
                        </p>
                        <p className="text-black whitespace-nowrap">
                            Date: {formatDate(invoice.order_date)}
                        </p>
                    </div>
                </div>

                {/* Billing Information */}
                <div className="border border-gray-300 p-2">
                    {/* Section Title */}
                    <h3 className="text-lg font-bold border-b text-gray-800">
                        Billing Information
                    </h3>

                    {/* Name and Contact Row */}
                    <div className="flex justify-between items-center">
                        <p className="text-base">
                            <span className="font-semibold text-gray-700">Name:</span> {invoice.customer_name}
                        </p>
                        <p className="text-base">
                            <span className="font-semibold text-gray-700">Contact No:</span> {invoice.contact_no}
                        </p>
                    </div>

                    {/* Shipping Address */}
                    <div className="w-full">
                        <p className="text-base font-semibold text-gray-700">Shipping Address:</p>
                        <p className="text-gray-600">{invoice.shipping_address}</p>
                    </div>
                </div>


                {/* Invoice Items */}
                <div className="overflow-x-auto mb-1">
                    <table className="min-w-full border-collapse border border-gray-200">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="border border-gray-200 px-4 py-2 text-left">
                                    #
                                </th>
                                <th className="border border-gray-200 px-4 py-2 text-left">
                                    Description
                                </th>
                                <th className="border border-gray-200 px-4 py-2 text-left">
                                    Product Size
                                </th>
                                <th className="border border-gray-200 px-4 py-2 text-left">
                                    Quantity
                                </th>
                                <th className="border border-gray-200 px-4 py-2 text-left">
                                    Unit Price
                                </th>
                                <th className="border border-gray-200 px-4 py-2 text-left">
                                    Price
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {invoice.order_items.map((item, index) => (
                                <tr key={index} className="border-t">
                                    <td className="border border-gray-200 px-4 py-2">
                                        {index + 1}
                                    </td>
                                    <td className="border border-gray-200 px-4 py-2">
                                        {item.product_name}
                                    </td>
                                    <td className="border border-gray-200 px-4 py-2">
                                        {item.product_size}
                                    </td>
                                    <td className="border border-gray-200 px-4 py-2">
                                        {item.quantity}
                                    </td>
                                    <td className="border border-gray-200 px-4 py-2">
                                        {item.unit_price}
                                    </td>
                                    <td className="border border-gray-200 px-4 py-2 text-right">
                                        {item.quantity * item.unit_price}.00
                                    </td>
                                </tr>
                            ))}
                            {/* Total Row */}
                            <tr className="border-t">
                                <td
                                    colSpan="5"
                                    className="border border-gray-200 px-4 py-2 text-right font-bold"
                                >
                                    Total
                                </td>
                                <td className="border border-gray-200 px-4 py-2 text-right font-bold">
                                    {invoice.total_price}.00
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                {/* Total Section */}
                <div className="flex flex-col md:flex-row justify-between">
                    <p className="in-word-section">
                        In Word: {convertToWords(total || 0)} Taka. Receive from{" "}
                        {invoice.customer_name}
                    </p>
                </div>

                {/* Warranty Information */}
                <div className="">
                    <h3 className="text-lg md:text-xl font-semibold border-b pb-2">
                        Terms and Conditions
                    </h3>
                    <ul className="list-disc pl-5 space-y-2">
                        <li>
                            The warranty will be rendered invalid if
                            unauthorized repairs are attempted.
                        </li>
                        <li>
                            Damage or failure caused by unauthorized
                            modification or alteration, or if it is used for
                            other than the intended purpose.
                        </li>
                        <li>
                            Warranty does not cover accidental damages due to
                            incorrect handling, normal wear and tear, misuse,
                            rodent / insect infestation, lightning, fire,
                            floods, and natural calamities.
                        </li>
                        <li>
                            Warranty does not cover products that have been
                            tampered with or altered in any way, or subjected to
                            misuse, negligence, or accident, or where the serial
                            number has been altered, defaced, or removed
                            contrary to the instructions outlined in the product
                            owner's manual.
                        </li>
                        <li>Warranty does not cover cables.</li>
                        <li>
                            The warranty period begins from the invoice date.
                        </li>
                        <li>
                            The original invoice must be presented as proof of
                            purchase for claiming the warranty.
                        </li>
                    </ul>
                </div>

                {/* Signatures and QR Code */}
                <div className="flex flex-row justify-between items-center mt-2 overflow-x-auto">
                    <div className="flex flex-col items-center flex-shrink-0 mb-2 md:mb-0">
                        <p src="" alt="" className="h-20" />
                        <div className="border-t border-gray-400 w-full mt-2" />
                        <p className="mt-2">Receiver Signature</p>
                    </div>
                    <div className="flex-shrink-0 mx-4 md:mx-0 my-4 md:my-0">
                        <QRCodeCanvas
                            className="mx-auto"
                            value={invoice.order_id || "N/A"}
                        // size={256}
                        />
                    </div>
                    <div className="flex flex-col items-center flex-shrink-0">
                        {/* <img
                            src={signature}
                            alt="Proprietor Signature"
                            className="h-20"
                        /> */}
                        <p src="" alt="" className="h-20" />
                        <div className="border-t border-gray-400 w-full" />
                        <p className="mt-2">Proprietor</p>
                    </div>
                </div>

                {/* Footer */}
                <div className="text-center mt-4">
                    <p className="italic">Thank you for your purchase!</p>
                </div>
            </div>
        </AdminDashboardLayout>
    );
};

export default Invoice;