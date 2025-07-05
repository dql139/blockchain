# API application for blockchain app
This project is a Node.js backend designed to interact with a blockchain-based application. It provides RESTful APIs to manage blockchain-related data such as blocks, transactions, and wallets, and handles secure interaction with smart contracts.
## Features
RESTful API server built with Express.js

JWT-based secure middleware

Models for Blocks, Transactions, Wallets

Includes SQL scripts for table creation and seeding

Modular architecture: controllers, models, routes, middleware

.env environment configuration
## Tech Stack
Node.js + Express.js

PostgreSQL

JWT for authentication

dotenv for config management
## Project Structure
.
├── controllers/
├── middlewares/
├── models/
├── routes/
├── utils/
├── server.js
├── create_tables.txt
├── table_datas.txt
├── .env

## Setup
Clone the repository:
<pre lang="markdown">git clone https://github.com/dql139/blockchain
cd blockchain
</pre>
Create npm for the project:
<pre lang="markdown">pnpm install</pre>
Create a .env
<pre lang="markdown">PORT=3000
DB_USER=your_user
DB_PASS=your_password
DB_NAME=your_database
DB_HOST=localhost
JWT_SECRET=your_jwt_secret</pre>
Run the app:
<pre lang="markdown">node server.js</pre>
## API examples:
`POST /api/auth/register` – Register user

`POST /api/auth/login` – Authenticate and receive token

`GET /api/blocks` – List all blocks

`POST /api/transactions` – Submit a transaction


