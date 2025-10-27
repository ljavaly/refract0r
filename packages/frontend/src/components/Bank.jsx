import { useState } from "react";
import "../styles/Bank.css";

function Bank() {
  const [showError, setShowError] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowError(true);
  };

  return (
    <div className="bank-container">
      <form className="credit-card-form" onSubmit={handleSubmit}>
        {showError && (
          <div className="error-message">
            Must be a valid credit card number
          </div>
        )}
        <div className="form-group">
          <label htmlFor="cardNumber">Card Number:</label>
          <div className="card-input-container">
            <div className="card-brand">
              <span>VISA</span>
            </div>
            <input
              type="text"
              id="cardNumber"
              className="card-number-input"
              placeholder="XXXX XXXX XXXX XXXX"
              maxLength="19"
            />
            {/* <div className="checkmark">✓</div> */}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="expirationDate">Expiration Date</label>
            <input
              type="text"
              id="expirationDate"
              className="form-input"
              placeholder="mm/yyyy"
              maxLength="7"
            />
          </div>

          <div className="form-group">
            <label htmlFor="cvv">CVV</label>
            <input
              type="text"
              id="cvv"
              className="form-input"
              placeholder="XXX"
              maxLength="4"
            />
          </div>
        </div>

        <div className="form-group">
          <button type="submit" className="submit-button">
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}

export default Bank;
