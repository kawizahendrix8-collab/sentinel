require("dotenv").config();

const baseUrl =
  process.env.PESAPAL_ENV === "production"
    ? "https://pay.pesapal.com/v3"
    : "https://cybqa.pesapal.com/pesapalv3";

module.exports = {
  baseUrl,
  consumerKey: process.env.PESAPAL_CONSUMER_KEY,
  consumerSecret: process.env.PESAPAL_CONSUMER_SECRET,
  callbackUrl: process.env.PESAPAL_CALLBACK_URL,
  ipnUrl: process.env.PESAPAL_IPN_URL,
  notificationId: process.env.PESAPAL_NOTIFICATION_ID
};