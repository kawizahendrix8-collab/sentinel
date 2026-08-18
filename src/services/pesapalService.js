
const pesapal = require("../config/pesapal");

let cachedToken = null;
let tokenExpiry = null;

async function getAccessToken() {
  if (
    cachedToken &&
    tokenExpiry &&
    Date.now() < tokenExpiry
  ) {
    return cachedToken;
  }

  if (!pesapal.consumerKey || !pesapal.consumerSecret) {
    throw new Error("PesaPal credentials are not configured");
  }

  const response = await fetch(
    `${pesapal.baseUrl}/api/Auth/RequestToken`,
    {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        consumer_key: pesapal.consumerKey,
        consumer_secret: pesapal.consumerSecret
      })
    }
  );

  const data = await response.json();

  if (!response.ok || !data.token) {
    throw new Error(
      data.message ||
      data.error?.message ||
      "Failed to authenticate with PesaPal"
    );
  }

  cachedToken = data.token;

  if (data.expiryDate) {
    tokenExpiry =
      new Date(data.expiryDate).getTime() - 30000;
  } else {
    tokenExpiry = Date.now() + 4 * 60 * 1000;
  }

  return cachedToken;
}

async function submitOrder(order) {
  const token = await getAccessToken();

  const response = await fetch(
    `${pesapal.baseUrl}/api/Transactions/SubmitOrderRequest`,
    {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(order)
    }
  );

  const data = await response.json();

  console.log("PesaPal SubmitOrder response:", data);

  if (!response.ok) {
    throw new Error(
      data.message ||
      data.error?.message ||
      "PesaPal order request failed"
    );
  }

  if (data.error) {
    throw new Error(
      data.error.message ||
      data.error.code ||
      "PesaPal rejected the order"
    );
  }

  if (!data.order_tracking_id || !data.redirect_url) {
    throw new Error(
      "PesaPal returned no order tracking ID or redirect URL"
    );
  }

  return data;
}

async function getTransactionStatus(orderTrackingId) {
  const token = await getAccessToken();

  const response = await fetch(
    `${pesapal.baseUrl}/api/Transactions/GetTransactionStatus?orderTrackingId=${encodeURIComponent(
      orderTrackingId
    )}`,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      }
    }
  );

  const data = await response.json();

  if (!response.ok || data.error) {
    throw new Error(
      data.message ||
      data.error?.message ||
      "Failed to get PesaPal transaction status"
    );
  }

  return data;
}

module.exports = {
  getAccessToken,
  submitOrder,
  getTransactionStatus
};
