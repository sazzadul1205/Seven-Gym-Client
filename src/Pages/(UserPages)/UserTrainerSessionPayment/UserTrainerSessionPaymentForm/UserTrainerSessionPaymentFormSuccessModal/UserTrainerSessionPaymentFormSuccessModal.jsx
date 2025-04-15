/* eslint-disable react/prop-types */


const UserTrainerSessionPaymentFormSuccessModal = ({ PaymentID }) => {
  return (
    <div className="modal-box">
      <h3 className="font-bold text-lg">Hello!</h3>
      <p className="py-4">
        Press ESC key or click the button below to close {PaymentID}
      </p>
      <div className="modal-action">
        <form method="dialog">
          {/* if there is a button in form, it will close the modal */}
          <button className="btn">Close</button>
        </form>
      </div>
    </div>
  );
};

export default UserTrainerSessionPaymentFormSuccessModal;
