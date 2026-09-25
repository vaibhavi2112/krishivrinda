const otpStore = new Map();

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function saveOTP(mobile, otp) {
  otpStore.set(mobile, {
    otp,
    expires: Date.now() + 5 * 60 * 1000
  });
}

function verifyOTP(mobile, otp) {
  const rec = otpStore.get(mobile);
  if (!rec) return { ok: false, error: 'OTP not found' };
  if (rec.expires < Date.now()) {
    otpStore.delete(mobile);
    return { ok: false, error: 'OTP expired' };
  }
  if (rec.otp !== otp) return { ok: false, error: 'Invalid OTP' };
  otpStore.delete(mobile);
  return { ok: true };
}

async function sendSMS(mobile, otp) {
  if (process.env.NODE_ENV !== 'production') {
    console.log(`\n📱 [DEV] KrishiVrinda OTP for ${mobile}: ${otp}\n`);
    return true;
  }
  const twilio = require('twilio')(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
  );
  await twilio.messages.create({
    body: `Your KrishiVrinda OTP: ${otp}. Valid for 5 minutes.`,
    from: process.env.TWILIO_PHONE,
    to: mobile
  });
  return true;
}

module.exports = { generateOTP, saveOTP, verifyOTP, sendSMS };