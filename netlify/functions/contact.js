const dotenv = require('dotenv')
dotenv.config()
const nodemailer = require('nodemailer')
var date = new Date()
const { Pool, Client } = require('pg')
const pool = new Pool({
  connectionString: process.env.PG_URL,
});
const text = 'INSERT INTO contact_request(mail, name, phone, message, date) VALUES($1, $2, $3, $4, $5) RETURNING *'

const transport = nodemailer.createTransport({

  host: "in-v3.mailjet.com",
  port: 587,
  secure: false, // use TLS
  auth: {
    user: process.env.API_KEY,
    pass: process.env.API_SECRET,
  },
  tls: {
    // do not fail on invalid certs
    rejectUnauthorized: false,
  },
});


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
    const info = await transport.sendMail(mailer);

    const values = [mail, name, phone, message, date]
    const res = await pool.query(text, values)
    console.log(res.rows[0])

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