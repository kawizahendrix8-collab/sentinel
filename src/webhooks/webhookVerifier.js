const crypto = require("crypto");

function verifySignature(payload, signature, secret) {


  const expectedSignature = crypto
  .createHmac("sha256", secret)
  .update(payload)
  .digest("hex");

  return expectedSignature === signature;

}

module.exports = {verifySignature};