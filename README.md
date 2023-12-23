# Rental Dhoondo

Rental Dhoondo is a comprehensive full-stack application designed to help you find the best rentals in your vicinity. Built on the MongoDB/Express/Node (MEN) stack, the application follows a RESTful architecture and is styled using the Bootstrap 5 framework. It incorporates user authentication for a secure experience and seamlessly integrates Google Maps for precise location information.

## Features

- **MEN Stack**: Utilizing MongoDB for the database, Express for the backend, and Node for server-side scripting, Rental Dhoondo ensures a robust and scalable foundation.
- **Bootstrap 5 Styling**: The application boasts an intuitive and visually appealing user interface crafted with the Bootstrap 5 framework.
- **User Authentication**: Secure your experience by authenticating users, ensuring that only authorized individuals can access and interact with the platform.
- **Google Maps Integration**: Gain geographical insights into rental locations through seamless integration with Google Maps.

## Getting Started

To run this project locally, follow these steps:

### Prerequisites

- Node.js: Make sure you have Node.js installed on your machine. You can download it from [https://nodejs.org/](https://nodejs.org/).
- MongoDB: Install MongoDB on your local machine. You can find installation instructions at [https://docs.mongodb.com/manual/installation/](https://docs.mongodb.com/manual/installation/).

### Installation

1. Clone the repository to your local machine:

   ```bash
   git clone https://github.com/AaryakPrasad/rental-dhoondo.git

2. Navigate to the project directory:

   ```bash
   cd rental-dhoondo

3. Install dependencies:

   ```bash
   npm install

### Configuration

1. Create a .env file in the root of the project and set the following variables:
   ```bash
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   MAPS_API_KEY=your_maps_api_key
   DB_URL=your_mongodb_connection_string
   SESSION_SECRET=your_session_secret

### Running the Application

1. Start the MongoDB server:
   ```bash
   mongosh
   
   mongod
   
2. Run the application:
   
   ```bash
   nodemon app.js
   
3. Open your browser and visit http://localhost:3000/ to access Rental Dhoondo locally.
