import React, { useRef } from "react";

const PayedClassReceptModal = ({
  paymentSuccessData,
  setPaymentSuccessData,
}) => {
  console.log(paymentSuccessData);

  const receiptRef = useRef();
  return (
    <div className="modal-box bg-[#ffffff] shadow-lg rounded-lg w-full max-w-md mx-auto p-4 sm:p-6 overflow-y-auto">
      {/* Receipt Section */}
      <div ref={receiptRef} id="receipt">
        {/* Header */}
        <div className="text-center border-b pb-4 mb-1">
          <h4 className="text-2xl font-bold text-[#1f2937]">Seven Gym</h4>
          <p className="text-sm text-[#6b7280]">Tier Upgrade Payment Receipt</p>
          <p className="text-sm text-[#6b7280]">www.SevenGym.com</p>
        </div>
      </div>
    </div>
  );
};

export default PayedClassReceptModal;
