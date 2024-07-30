# ⚙️ How the Backend Works

## Authentication

- **Endpoint**: `/authenticate`
- **Description**: Authenticates users based on their mobile number.

## Flight Details

- **Endpoint**: `/flights/:userId`
- **Description**: Retrieves flight details for a specific user.

## Notifications

- **Endpoints**:
  - `/notifications/:userId`: Manages user notification preferences.
  - `/sendNotification`: Sends flight status updates to users.
  - `/subscribe`: Subscribes users to push notifications (not used in the current version).

## Data Flow

1. **User Authentication**: Users authenticate using their mobile numbers.
2. **Flight Information**: Flight details are fetched from the database.
3. **Notification Preferences**: Users manage their notification preferences.
4. **Sending Notifications**: Notifications are sent via SMS, Email, and WhatsApp using RabbitMQ for message queuing.

## API Integration

- **AviationStack API**: Fetches real-time flight data.
- **Twilio API**: Sends SMS and WhatsApp notifications.
- **SendGrid API**: Sends email notifications.
