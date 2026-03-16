// const nodemailer = require("nodemailer");

// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     type: "OAuth2",
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS,
//     clientId: process.env.CLIENT_ID,
//     clientSecret: process.env.CLIENT_SECRET,
//     refreshToken: process.env.REFRESH_TOKEN,
//   },
// });

// // verify connection
// transporter.verify((error) => {
//   if (error) {
//     console.error("Error connecting to email server:", error);
//   } else {
//     console.log("Email server is ready to send messages");
//   }
// });

// // generic email sender
// const sendEmail = async (to, subject, text, html) => {
//   try {
//     const info = await transporter.sendMail({
//       from: `"Bank Transaction System" <${process.env.EMAIL_USER}>`,
//       to: to,
//       subject: subject,
//       text: text,
//       html: html,
//     });

//     console.log("Message sent:", info.messageId);
//   } catch (error) {
//     console.error("Error sending email:", error);
//   }
// };

// async function sendRegisterationEmail(userEmail, name) {
//   const subject = "Welcome to Bank Transaction System!";

//   const text = `Hello ${name},

// Thank you for registering.
// We're excited to have you on board!

// Best regards,
// The Bank Team`;

//   const html = `
//   <p>Hello ${name},</p>
//   <p>Thank you for registering. We're excited to have you on board!</p>
//   <p>Best regards,<br>The Bank Team</p>
//   `;

//   await sendEmail(userEmail, subject, text, html);
// }

// module.exports = { sendRegisterationEmail };

require("dotenv").config();
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// verify email server
transporter.verify((error) => {
  if (error) {
    console.error("Error connecting to email server:", error);
  } else {
    console.log("Email server is ready to send messages");
  }
});

// generic email function
const sendEmail = async (to, subject, text, html) => {
  try {
    const info = await transporter.sendMail({
      from: `"Bank Transaction System" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
      html,
    });

    console.log("Message sent:", info.messageId);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

// registration email
async function sendRegisterationEmail(userEmail, name) {
  const subject = "Welcome to Bank Transaction System!";

  const text = `Hello ${name},

Thank you for registering.
We're excited to have you on board!

Best regards,
The Bank Team`;

  const html = `
  <p>Hello ${name},</p>
  <p>Thank you for registering. We're excited to have you on board!</p>
  <p>Best regards,<br>The Bank Team</p>
  `;

  await sendEmail(userEmail, subject, text, html);
}

module.exports = { sendRegisterationEmail };
