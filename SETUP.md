# 🛠️ Backend Setup Instructions

Follow these steps to set up the backend of the Flight Status Notification System.

## Prerequisites

- Node.js
- PostgreSQL
- RabbitMQ
- AviationStack API Key
- Twilio Account for SMS and WhatsApp
- SendGrid Account for Email

## Steps

1. **Clone the repository**
    ```bash
    git clone <backend-repo-url>
    cd backend
    ```

2. **Install dependencies**
    ```bash
    npm install
    ```

3. **Set up the database**
    ```bash
    npx sequelize-cli db:migrate
    ```

4. **Configure environment variables**
    Create a `.env` file and add your configurations:
    ```env
    DATABASE_URL=<your-database-url>
    TWILIO_ACCOUNT_SID=<your-twilio-account-sid>
    TWILIO_AUTH_TOKEN=<your-twilio-auth-token>
    SENDGRID_API_KEY=<your-sendgrid-api-key>
    AVIATIONSTACK_API_KEY=<your-aviationstack-api-key>
    ```

5. **Start the server**
    ```bash
    node index.js
    ```

6. **Start the RabbitMQ consumer**
    ```bash
    node events/consumer.js
    ```

Your backend should now be up and running!
