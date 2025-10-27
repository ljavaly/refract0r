import "../styles/Bank.css";

function Bank() {
  return (
    <div className="bank-container">
      <div className="credit-card-form">
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
      </div>
    </div>
  );
}

export default Bank;
