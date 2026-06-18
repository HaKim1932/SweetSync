const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

exports.sendOrderStatusEmail = async (
    customerEmail,
    customerName,
    orderId,
    status
) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: customerEmail,
        subject: `SweetSync Order #${orderId} Status Update`,
        html: `
            <h2>SweetSync Order Update</h2>

            <p>Hello ${customerName},</p>

            <p>
                Your order <strong>#${orderId}</strong>
                status has been updated to:
            </p>

            <h3>${status}</h3>

            <p>
                Thank you for ordering from SweetSync!
            </p>
        `
    };

    const info =
        await transporter.sendMail(mailOptions);

    console.log(
        "Email sent:",
        info.response
    );

    return info;
};