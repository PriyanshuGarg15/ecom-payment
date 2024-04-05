# Payment Microservice

The Payment microservice facilitates secure and efficient payment processing for orders placed within the system. It integrates with payment gateways to handle transactions and provide reliable payment solutions for users.

## Access

The microservice is hosted on AWS ECS Docker at the following URL:
http://ecom-user-lb-321143357.ap-south-1.elb.amazonaws.com:4043

## Postman Collection

https://api.postman.com/collections/20014395-9376e620-a680-4795-b1ac-9d387a3d02f7?access_key=PMAT-01HTQDTZC5DT1GPEQBQJNP4T4K

## Routes

### Payment Routes

#### Process Payment

- **Route**: `/api/payment/process`
- **Method**: POST
- **Description**: Initiates the payment process for an order.

#### Get Payment Status

- **Route**: `/api/payment/status/:id`
- **Method**: GET
- **Description**: Retrieves the payment status for a specific order. (Authentication required)

#### PAYTM Webhook

- **Route**: `/api/callback`
- **Method**: POST
- **Description**: Endpoint for PAYTM to send payment status updates.

## Dependencies

- Express.js: Web framework for Node.js
- Mongoose: MongoDB object modeling tool
- paytmchecksum: ^1.5.1
- uuid: ^9.0.1

## Usage

1. Clone the repository.
2. Install dependencies using `npm install`.
3. Set environment variables in a `.env` file.
4. Run the microservice using `npm start`.

## Contributors

- [Priyanshu Garg](#) - Developer
