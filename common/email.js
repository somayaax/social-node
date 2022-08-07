const nodemailer = require("nodemailer");
exports.sendEmail = async (dest, msg) => {
    let transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false, // true for 465, false for other ports
        service: 'gmail',
        auth: {
            user: process.env.SENDER_EMAIL,
            pass: process.env.SENDER_PASSWORD,
        },
    });

    // send mail with defined transport object
    await transporter.sendMail({
        from: `"Fred Foo 👻" ${process.env.SENDER_EMAIL} `, // sender address
        to: dest, 
        subject: "Hello ✔", // Subject line
        html: msg, // html body
    });
}