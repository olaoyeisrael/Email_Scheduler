const express = require('express');
const app = express();
const nodeCron = require('node-cron');
const nodemailer = require('nodemailer');
const {google} = require("googleapis")
const config = require("./config.js")
const OAuth2 = google.auth.OAuth2

// const dotenv = require('dotenv')

// dotenv.config()
const OAuth2_client = new OAuth2(config.clientId, config.clientSecret)
OAuth2_client.setCredentials({refresh_token: config.refreshToken})
const accessToken = OAuth2_client.getAccessToken()

app.use(express.json());




const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
      type: 'OAuth2',
      user: "harduragbemeei@gmail.com",
      clientId: config.clientId,
      clientSecret: config.clientSecret,
      refreshToken: config.refreshToken, 
      accessToken: accessToken
    
  },
});

// creating CRON job to send email every 5 minutes
const Job = nodeCron.schedule('*/5 * * * *', () => {

  // Generate six digit random code
  const code = Math.floor(Math.random() * 90000 + 100000 )
  //   console.log(code)
  //   console.log(code.toString().length)

  const mailOptions = {
    from: config.user,
    to: 'olaoyeaisrael@gmail.com',
    subject: 'Code',
    text: `Your six-digit code is: ${code}`
  };

  // Send email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
    } else {
      console.log('Email sent:', info.response);
    }
  });
});

 


// POST endpoint to start the the Cron job
app.post('/send-email', (req, res) => {
  const { email } = req.body;
  
  Job.start();
   
  
  res.send('Email scheduling started!');
});

//Post endpoint to stop/delete the Cron job
app.post('/stop-email', (req, res) => {
  // Stop the job
  Job.stop();

  res.send('Email scheduling stopped/deleted');
});




// Start the server
const port = 3000
app.listen(port, () => {
  console.log('server is running on port 3000');
});





