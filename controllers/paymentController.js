const asyncErrorHandler = require('../middleware/ErrorHandler');
const paytm = require('paytmchecksum');
const https = require('https');
const Payment = require('../models/payment');
const ErrorHandler = require('../utils/SyncErrorHandler');
const { v4: uuidv4 } = require('uuid');

module.exports = {

    processPayment: asyncErrorHandler(async (req, res, next) => {

        const { amount, email, phoneNo } = req.body;

        var params = {};
        /* initialize an array */
        params["MID"] = process.env.PAYTM_MID;
        params["WEBSITE"] = process.env.PAYTM_WEBSITE;
        params["CHANNEL_ID"] = process.env.PAYTM_CHANNEL_ID;
        params["INDUSTRY_TYPE_ID"] = process.env.PAYTM_INDUSTRY_TYPE;
        params["ORDER_ID"] = "oid" + uuidv4();
        params["CUST_ID"] = process.env.PAYTM_CUST_ID;
        params["TXN_AMOUNT"] = JSON.stringify(amount);
        params["CALLBACK_URL"] = `https://${req.get("host")}/api/v1/callback`;
        params["EMAIL"] = email;
        params["MOBILE_NO"] = phoneNo;

        let paytmChecksum = paytm.generateSignature(params, process.env.PAYTM_MERCHANT_KEY);
        paytmChecksum.then(function (checksum) {
            let paytmParams = { ...params, "CHECKSUMHASH": checksum, };

            res.status(200).json({ paytmParams });
        }).catch(function (error) {
            console.log(error);
        });
    }),

    // Paytm Callback
    paytmResponse: (req, res, next) => {

        let paytmChecksum = req.body.CHECKSUMHASH;
        delete req.body.CHECKSUMHASH;

        let isVerifySignature = paytm.verifySignature(req.body, process.env.PAYTM_MERCHANT_KEY, paytmChecksum);
        if (isVerifySignature) {
            // "Checksum Matched"

            var paytmParams = {};

            paytmParams.body = {
                "mid": req.body.MID,
                "orderId": req.body.ORDERID,
            };

            paytm.generateSignature(JSON.stringify(paytmParams.body), process.env.PAYTM_MERCHANT_KEY).then(function (checksum) {

                paytmParams.head = {
                    "signature": checksum
                };

                /* prepare JSON string for request */
                var post_data = JSON.stringify(paytmParams);

                var options = {
                    /* for Staging */
                    hostname: 'securegw-stage.paytm.in',
                    /* for Production */
                    // hostname: 'securegw.paytm.in',
                    port: 443,
                    path: '/v3/order/status',
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Content-Length': post_data.length
                    }
                };

                // Set up the request
                var response = "";
                var post_req = https.request(options, function (post_res) {
                    post_res.on('data', function (chunk) {
                        response += chunk;
                    });

                    post_res.on('end', function () {
                        let { body } = JSON.parse(response);
                        // let status = body.resultInfo.resultStatus;
                        // res.json(body);
                        addPayment(body);
                        // res.redirect(`${req.protocol}://${req.get("host")}/order/${body.orderId}`)
                        res.redirect(`https://${req.get("host")}/order/${body.orderId}`)
                    });
                });

                // post the data
                post_req.write(post_data);
                post_req.end();
            });

        } else {
            console.log("Checksum Mismatched");
        }
    },
    getPaymentStatus: asyncErrorHandler(async (req, res, next) => {

        const payment = await Payment.findOne({ orderId: req.params.id });

        if (!payment) {
            return next(new ErrorHandler("Payment Details Not Found", 404));
        }

        const txn = {
            id: payment.txnId,
            status: payment.resultInfo.resultStatus,
        }

        res.status(200).json({
            success: true,
            txn,
        });
    })
}

const addPayment = async (data) => {
    try {
        await Payment.create(data);
    } catch (error) {
        console.log("Payment Failed!");
    }
}

