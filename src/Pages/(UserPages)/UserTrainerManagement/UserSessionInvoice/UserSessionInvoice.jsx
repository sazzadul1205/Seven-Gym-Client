/* eslint-disable react/prop-types */
const UserSessionInvoice = ({
  SessionRefundInvoicesData,
  SessionPaymentInvoicesData,
}) => {
  console.log("Session Refund Invoices Data : ", SessionRefundInvoicesData);
  console.log("Session Payment Invoices Data : ", SessionPaymentInvoicesData);

  return (
    <div>
      {/* Header */}
      <div className="text-center py-1">
        {/* Title */}
        <h3 className="text-center text-xl font-semibold">
          Session Payment and Refund Invoice
        </h3>
      </div>

      {/* Divider */}
      <div className="mx-auto bg-black w-1/3 p-[1px]" />

      {/* Bookings List */}
      <div className="py-1">
        {/* Title */}
        <h4 className="text-xl sm:text-2xl py-2 bg-[#A1662F] font-bold text-center border border-white  text-white">
          Session Payment Invoices
        </h4>
        {SessionRefundInvoicesData.length > 0 ? (
          <>
            {/* Desktop View */}
            <div className="overflow-x-auto hidden md:block">
              <table className="min-w-full table-auto bg-white border-collapse">
                {/* Table Header */}
                <thead>
                  <tr className="bg-[#A1662F] text-white">
                    {[
                      "No",
                      "Trainer",
                      "Paid At",
                      "Total Price",
                      "Price",
                      "Sessions No",
                      "payment Id",
                      "Action",
                    ].map((heading) => (
                      <th
                        key={heading}
                        className={`px-4 py-2 border border-gray-200`}
                      >
                        {heading}
                      </th>
                    ))}
                  </tr>
                </thead>

                {/* Table Body */}
                <tbody>
                  {SessionRefundInvoicesData.map((item, index) => (
                    <tr
                      key={`List_No_${item._id}_${index}`}
                      className={`border-b bg-white hover:bg-gray-100 cursor-default`}
                    >
                      {/* Number */}
                      <td className="px-4 py-2 border-r border-gray-500">
                        {index + 1}
                      </td>
                      
                      {/* Trainer Image and Name */}
                      <td className="px-4 py-2 border-r border-gray-500"></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          // If No Payment are fetched then show this
          <p className="text-center text-lg font-semibold text-black py-5 bg-white">
            There are no Payment made this Far
          </p>
        )}
      </div>
    </div>
  );
};

export default UserSessionInvoice;
