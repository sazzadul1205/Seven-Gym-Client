import { FaFileInvoiceDollar } from "react-icons/fa";

const UserRefundInvoices = () => {
  return (
    <div className="bg-gradient-to-b from-gray-100 to-gray-200 min-h-screen">
      {/* Header */}
      <div className="bg-gray-400 px-5 py-2">
        <p className="flex gap-2 items-center text-xl font-semibold italic text-white">
          <FaFileInvoiceDollar /> User Refund Invoices
        </p>
      </div>
    </div>
  );
};

export default UserRefundInvoices;
