require("dotenv").config();
const express = require("express");
const cors = require("cors");
const twilio = require("twilio");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioNumber = process.env.TWILIO_PHONE_NUMBER;

const client = twilio(accountSid, authToken);

app.post("/call-student", async (req, res) => {
    const { phoneNumber } = req.body;
    console.log(req.body);

    try {
        const call = await client.calls.create({
            to: phoneNumber, 
            from: twilioNumber,
            url: "http://demo.twilio.com/docs/voice.xml"
        });

        res.status(200).json({ success: true, message: "Call initiated!", callSid: call.sid });
    } catch (error) {
        res.status(500).json({ success: false, message: "Call failed", error: error.message });
    }
});

const PORT = 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


// air
// retail ai
// 