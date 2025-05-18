# Payment Microservice

The Payment microservice facilitates secure and efficient payment processing for orders placed within the system. It integrates with payment gateways to handle transactions and provide reliable payment solutions for users.

## Access

The microservice can be hosted on AWS ECS Docker.

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
