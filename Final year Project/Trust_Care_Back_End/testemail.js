import dotenv from "dotenv";
dotenv.config();

import { sendOTP } from "./utils/sendEmail.js";  // make sure path matches

console.log("Starting OTP test...");

sendOTP("tharmaratnam.kawsikan@gmail.com", "123456")
  .then(() => console.log("Test OTP sent"))
  .catch(err => console.error("Test failed:", err));