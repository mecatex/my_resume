const nodemailer = require('nodemailer')
const mailjetTransport = require('nodemailer-mailjet-transport')
const mailjet = nodemailer.createTransport(mailjetTransport({
  auth: {
    apiKey: process.env.API_KEY,
    apiSecret: process.env.API_SECRET
  }
}));

exports.handler = async function (event, context) {

  const { name, mail, phone, message } = JSON.parse(event.body)

  const mailer = {
    from: 'contact@atoum-yanis.com',
    to: 'atoum302@gmail.com',
    replyTo: mail,
    subject: 'nouvelle demande CV',
    text: `${name} vous a envoyé un message: ${message} - Son téléphone : ${phone} - son mail : ${mail}`,
    html: `${name} vous a envoyé un message: ${message} - Son téléphone : ${phone} - son mail : ${mail}`
  };

  try {
    const info = await mailjet.sendMail(mailer);
    return {
      statusCode: 200,
      body: JSON.stringify({ status: "ok" }),
    };
  } catch (err) {
    console.error(err);
    return {
      statusCode: 403,
      body: JSON.stringify({ err }),
    };
  }


}

