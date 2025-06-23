// import Icons
import { FaFileInvoiceDollar } from "react-icons/fa";
import { FaTriangleExclamation } from "react-icons/fa6";

const UserClassRefundInvoices = ({ UserClassRefundData }) => {
  return (
    <div className="bg-gradient-to-b from-gray-100 to-gray-200 min-h-screen">
      {/* Header */}
      <div className="bg-gray-400 px-5 py-2">
        <p className="flex gap-2 items-center text-xl font-semibold italic text-white">
          <FaFileInvoiceDollar /> User Class Refund Invoices
        </p>
      </div>
    </div>
  );
};

export default UserClassRefundInvoices;
