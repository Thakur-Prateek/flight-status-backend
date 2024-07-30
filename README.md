# ✈️ Flight Status Notification System - Backend

Welcome to the backend of the Flight Status Notification System! This project provides real-time flight status updates via SMS, Email, and WhatsApp.

## 📋 Table of Contents

- [Project Overview](#project-overview)
- [Achievements](#achievements)
- [Setup Instructions](#setup-instructions)
- [How It Works](#how-it-works)

## 📄 Project Overview

The backend system handles user authentication, stores flight and notification data, and sends notifications through various channels. It uses Node.js, Express, Sequelize, PostgreSQL, RabbitMQ, Twilio, SendGrid, and the AviationStack API.

## 🏆 Achievements

- Real-time flight status updates using AviationStack API.
- Notification delivery via SMS, Email, and WhatsApp using Twilio and SendGrid.
- Robust user authentication and data management with PostgreSQL.
- Efficient message queuing with RabbitMQ.

## 🛠️ Setup Instructions

Please follow the instructions in the [setup guide](SETUP.md) to get the backend up and running.

## ⚙️ How It Works

The backend consists of several key components:
- **Authentication**: Verifies user mobile numbers.
- **Flight Details**: Retrieves and updates flight information.
- **Notifications**: Manages user notification preferences and sends notifications through RabbitMQ.

For detailed information, refer to the [how it works guide](HOW_IT_WORKS.md).
