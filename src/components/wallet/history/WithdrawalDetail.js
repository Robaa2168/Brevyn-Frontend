import React, { useEffect, useState } from 'react';
import api from '../../../api';
import Lottie from "lottie-react";
import { FaLock } from 'react-icons/fa';
import { HiOutlineDownload } from 'react-icons/hi'; // Import the download icon
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import loadingAnimation from '../../lottie/loading.json';
import errorAnimation from '../../lottie/noLinks.json';
import { useUser } from "../../context";
import { AiOutlineArrowLeft } from 'react-icons/ai';
import jsPDF from "jspdf";
import "jspdf-autotable"


const WithdrawalDetail = ({ withdrawalId, onBack }) => {
    const { user } = useUser();
    const [withdrawalDetails, setWithdrawalDetails] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const userName = user?.userInfo?.firstName ? user.userInfo.firstName.toUpperCase() : 'Customer';

    useEffect(() => {
        const fetchWithdrawalDetails = async () => {
            setIsLoading(true);
            try {
                // Assuming an endpoint exists to get withdrawal details by ID
                const response = await api.get(`/api/transactions/withdrawals/${withdrawalId}`, {
                    headers: { Authorization: `Bearer ${user.token}` },
                });

                if (response.status === 200 && response.data) {
                    setWithdrawalDetails(response.data);
                } else {
                    setError('Failed to fetch withdrawal details');
                }
            } catch (error) {
                console.error("Error fetching withdrawal details:", error);
                setError('An error occurred while fetching withdrawal details');
            } finally {
                setIsLoading(false);
            }
        };

        fetchWithdrawalDetails();
    }, [withdrawalId, user.token]);


    const generateReceipt = async (withdrawalDetails) => {
        setIsGenerating(true); // Indicate the receipt is being generated
        const doc = new jsPDF();

        // Fetch images and convert to Base64 format
        const paperPlaneImage = await getImageBase64('https://res.cloudinary.com/dx6jw8k0m/image/upload/v1709472568/send-money__1_-removebg-preview_hg9tip.png');
        const barcodeImage = await getImageBase64('https://t3.ftcdn.net/jpg/02/55/97/94/360_F_255979498_vewTRAL5en9T0VBNQlaDBoXHlCvJzpDl.jpg');

        // Receipt Title and Subtitle
        doc.setFont("helvetica", "bold");
        doc.setFontSize(22);
        doc.setTextColor(34, 139, 34); // Emerald color for the title
        doc.text("Ravel Global Pay Withdrawal Receipt", doc.internal.pageSize.getWidth() / 2, 20, { align: "center" });

        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0); // Black color for the subtitle
        doc.text("Moving Money for Better", doc.internal.pageSize.getWidth() / 2, 30, { align: "center" });

        // Add paper plane image and a horizontal line
        doc.addImage(paperPlaneImage, 'PNG', doc.internal.pageSize.getWidth() / 2 - 20, 40, 40, 30);
        doc.setLineWidth(0.2);
        doc.line(20, 35, doc.internal.pageSize.getWidth() - 20, 35);

        // Personalized Greeting
        doc.setFont("helvetica", "bold");
        doc.setFontSize(18);
        doc.setTextColor(0, 112, 186); // Blue color for the greeting
        doc.text(`Hi ${user?.primaryInfo?.firstName.toUpperCase()},`, doc.internal.pageSize.getWidth() / 2, 70, { align: "center" });

        // Calculate the center position for the square and details
        const pageCenter = doc.internal.pageSize.getWidth() / 2;
        const squareSize = 40; // Size of the square
        const squareX = pageCenter - squareSize - 15; // Adjust to position the square more centered
        const squareY = 80; // Adjust Y to align with the details section

        // Add blue square for "Total Amount" on the left
        doc.setDrawColor(0, 112, 186); // Blue border color
        doc.setFillColor(0, 112, 186); // Blue fill color
        doc.rect(squareX, squareY, squareSize, squareSize, 'F');

        // Inside square details
        doc.setFont("helvetica", "bold");
        doc.setFontSize(10);
        doc.setTextColor(255, 255, 255); // White text inside the blue square
        doc.text("Total Amount:", squareX + 5, squareY + 15, { maxWidth: squareSize - 10 });
        doc.setFontSize(14);
        doc.text(`${withdrawalDetails.currency} ${withdrawalDetails.amount}`, squareX + 5, squareY + 25, { maxWidth: squareSize - 10 });

        // Transaction Details on the right of the square
        let detailsStartY = squareY; // Align with the top of the square
        const detailsX = pageCenter - 10; // Position details to the right of the square, adjusted for centering

        // Reset text color for the rest of the details
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(0, 0, 0);

        // Display transaction details next to the square
        if (withdrawalDetails.type === 'Bank') {
            doc.text(`Bank: ${withdrawalDetails.bank}`, detailsX, detailsStartY);
            doc.text(`Account No: ${withdrawalDetails.accountNo}`, detailsX, detailsStartY += 6);
            doc.text(`Beneficiary Name: ${withdrawalDetails.beneficiaryName}`, detailsX, detailsStartY += 6);
        } else if (withdrawalDetails.type === 'Paypal') {
            doc.text(`Email: ${withdrawalDetails.email}`, detailsX, detailsStartY);
        } else if (withdrawalDetails.type === 'MobileMoney') {
            doc.text(`Phone Number: ${withdrawalDetails.phoneNumber}`, detailsX, detailsStartY);
            doc.text(`Provider: ${withdrawalDetails.provider}`, detailsX, detailsStartY += 6);
        }

        // Additional spacing before common details
        detailsStartY += 12;

        // Common details
        doc.text(`Channel: ${withdrawalDetails.type}`, detailsX, detailsStartY);
        doc.text(`Amount: ${withdrawalDetails.amount} ${withdrawalDetails.currency}`, detailsX, detailsStartY += 6);
        doc.text(`Status:${withdrawalDetails.status}`, detailsX, detailsStartY += 6);
        doc.text(`Date: ${formatDate(withdrawalDetails.createdAt)}`, detailsX, detailsStartY += 6);

        // Add barcode image below the dotted line
        doc.addImage(barcodeImage, 'PNG', doc.internal.pageSize.getWidth() / 2 - 80, detailsStartY + 20, 160, 30);

        // Footer content with contact and security information
        doc.setFont("helvetica", "italic");
        doc.setFontSize(8);
        const footerTextStartY = doc.internal.pageSize.getHeight() - 30; // Position the footer text towards the bottom
        const footerText = "If you encounter any issues, please contact support at support@verdantcharity.org. " +
            "Payment is secured with DLocal. Ravel Global Pay, Apt. 992, 54072 Larson Stravenue, Port Kymside, IA 70661-2925. " +
            "For support: support@verdantcharity.org | Hotline: +1 800 555 0199";
        doc.text(footerText, 20, footerTextStartY, { maxWidth: 180 });

        // Transaction ID on the top right corner
        const transactionId = `${withdrawalDetails.withdrawalId}`;
        const transactionIdWidth = doc.getStringUnitWidth(transactionId) * doc.internal.getFontSize() / doc.internal.scaleFactor;
        doc.text(transactionId, doc.internal.pageSize.getWidth() - transactionIdWidth - 10, 5);

        // Save the PDF document
        doc.save(`Withdrawal_Receipt_${withdrawalDetails.withdrawalId}.pdf`);
        setIsGenerating(false); // Re-enable the download button after generation is complete
    };

    const getImageBase64 = async (url) => {
        // Implementation to fetch the image and convert it to Base64
        const response = await fetch(url);
        const blob = await response.blob();
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.readAsDataURL(blob);
        });
    };

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true };
        return new Date(dateString).toLocaleDateString('en-US', options);
    };

    const statusClasses = (status) => {
        switch (status) {
            case 'pending':
            case 'processing':
                return 'bg-yellow-200 text-yellow-800';
            case 'completed':
                return 'bg-green-200 text-green-800';
            case 'failed':
                return 'bg-red-200 text-red-800';
            case 'cancelled':
                return 'bg-gray-200 text-gray-800';
            default:
                return 'bg-gray-200 text-gray-800'; // Default case for an unknown status
        }
    };
    if (isLoading) {
        return (
            <div className="container mx-auto p-4 bg-white rounded-lg border shadow-xl ">
                <div className="flex justify-center items-center">
                    <Lottie animationData={loadingAnimation} style={{ width: 100, height: 100 }} />
                </div>
            </div>
        );
    }


    if (error || !withdrawalDetails) {
        return (
            <div className="container mx-auto p-4 bg-white rounded-lg border shadow-xl ">
                <div className="flex flex-col justify-center items-center">
                    <Lottie animationData={errorAnimation} style={{ width: 200, height: 200 }} />
                    <p className="mt-4 text-sm font-semibold text-gray-600">{error || "No withdrawal details found."}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4 bg-white rounded-lg border shadow-xl ">
            <div className="border-b border-dotted pb-4">
                <div className="flex flex-col lg:flex-row items-center justify-between">
                    <button onClick={onBack} className="flex items-center justify-center p-2 text-emerald-600 hover:text-emerald-800 transition-colors duration-150 ease-in-out mb-4 lg:mb-0 lg:mr-4">
                        <span className="inline-flex items-center justify-center p-2 mr-2 rounded-full border border-green-600 bg-green-100 hover:bg-green-200">
                            <AiOutlineArrowLeft />
                        </span>
                        Back
                    </button>
                    <p className="text-xs text-center text-gray-600 flex-1">Please review the details of your withdrawal below.</p>
                </div>
            </div>


            {/* Informational message for processing or pending transactions */}
            {(withdrawalDetails.status === 'processing' || withdrawalDetails.status === 'pending') && (
                <div className="bg-blue-50 border border-blue-300 text-blue-700 p-4 mt-4 rounded text-xs" role="alert">
                    <p className="font-bold">Processing Withdrawal</p>
                    <p>
                        Your withdrawal of <strong>{withdrawalDetails.withdrawalId}</strong> is currently processing. International transactions typically process within 72 hours.
                        For more information regarding the transaction, contact <a href="mailto:support@verdantcharity.org" className="underline">support@verdantcharity.org</a>.
                    </p>
                </div>
            )}


            <div className="pt-4">
                {/* Conditional rendering based on the type of withdrawal */}
                {withdrawalDetails.type === 'Bank' && (
                    <div className="text-xs mb-4">
                        <div className="flex justify-between mb-2">
                            <p><strong>Bank:</strong></p>
                            <p>{withdrawalDetails.bank}</p>
                        </div>
                        <div className="flex justify-between mb-2">
                            <p><strong>Account No:</strong></p>
                            <p>{withdrawalDetails.accountNo}</p>
                        </div>
                        <div className="flex justify-between mb-2">
                            <p><strong>Beneficiary Name:</strong></p>
                            <p>{withdrawalDetails.beneficiaryName}</p>
                        </div>
                        {/* Repeat the pattern for other bank-specific details */}
                    </div>

                )}

                {withdrawalDetails.type === 'Paypal' && (
                    <div className="text-xs mb-4">
                        <div className="flex justify-between mb-2">
                            <p><strong>Email:</strong></p>
                            <p> {withdrawalDetails.email}</p>
                        </div>
                    </div>
                )}

                {withdrawalDetails.type === 'MobileMoney' && (
                    <div className="text-xs mb-4">
                        <div className="flex justify-between">
                            <p><strong>Phone Number:</strong> </p>
                            <p>{withdrawalDetails.phoneNumber}</p>
                        </div>
                        <div className="flex justify-between">
                            <p><strong>Provider:</strong></p>
                            <p> {withdrawalDetails.provider}</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Common details for all withdrawal types */}
            <div className="border-t border-dotted border-gray-400 text-xs pt-4 mt-4 relative">
                <div className="flex justify-between">
                    <p><strong>Channel:</strong></p>
                    <p>{withdrawalDetails.type}</p>
                </div>
                <div className="flex justify-between">
                    <p><strong>Amount:</strong></p>
                    <p>{withdrawalDetails.amount} {withdrawalDetails.currency}</p>
                </div>
                <div className="flex justify-between">
                    <p><strong>Status:</strong></p>
                    <p className={`rounded-full px-3  ${statusClasses(withdrawalDetails.status)}`}>
                        {withdrawalDetails.status.charAt(0).toUpperCase() + withdrawalDetails.status.slice(1)}
                    </p>
                </div>
                <div className="flex justify-between">
                    <p><strong>Date:</strong></p>
                    <div>
                        <span className="text-xs  mr-2" style={{ fontStyle: 'italic' }}>
                            {new Date(withdrawalDetails.createdAt).toLocaleDateString('en-GB', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric',
                            })}
                        </span>
                        <span className="text-xs " style={{ fontStyle: 'italic' }}>
                            {new Date(withdrawalDetails.createdAt).toLocaleTimeString('en-US', {
                                hour: '2-digit',
                                minute: '2-digit',
                                hour12: true,
                            })}
                        </span>
                    </div>
                </div>
                <div className="border-t border-dotted border-gray-400 pt-4 mt-4"></div> {/* Dotted border */}
                <button
                    className={`mt-4 px-4 py-2 flex justify-center items-center ${isGenerating ? 'bg-gray-500' : 'bg-blue-500'} text-white rounded hover:bg-blue-700 transition duration-150 ease-in-out ${isGenerating ? '' : 'w-full sm:w-auto'}`}
                    onClick={() => generateReceipt(withdrawalDetails)}
                    disabled={isGenerating}
                >
                    {isGenerating ? (
                        <>
                            <AiOutlineLoading3Quarters className="animate-spin mr-2" /> Generating...
                        </>
                    ) : (
                        <>
                            <HiOutlineDownload className="mr-2" /> Download Receipt
                        </>
                    )}
                </button>

            </div>




            <div className="mt-4 py-4 border-t text-xs text-gray-600 text-center rounded bg-gray-100">
                <p>If you encounter any issues, please contact support at <a href="mailto:support@verdantcharity.org" className="text-blue-600 hover:text-blue-800">support@verdantcharity.org</a>.</p>
                <div className="flex justify-center items-center mt-2">
                    <FaLock className="text-green-600 mr-2" />
                    <span>Payment is secured with DLocal</span>
                </div>
                <p className="mt-2">Ravel Global Pay, Apt. 992</p>
                <p>54072 Larson Stravenue, Port Kymside, IA 70661-2925</p>
                <p className="mt-2">For support: <a href="mailto:support@verdantcharity.org" className="text-blue-600 hover:text-blue-800">support@verdantcharity.org</a> | Hotline: +1 800 555 0199</p>
            </div>

        </div>
    );

};

export default WithdrawalDetail;


