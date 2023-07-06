# MERN Messaging App

This is a messaging application built using the MERN stack (MongoDB, Express.js, React.js, Node.js) for sending messages between users. The application is containerized using Docker.

## Features

1. Sign up for a new account by providing your name, email address, and password.

2. Log in using your email address and password.

3. Once logged in, you will see a list of existing users.

4. Click on a user to view the conversation and send messages.

5. You can search for users by their name to find specific individuals.

6. You can change your email address and avatar image. You can also delete your account.

## Sample screenshots

![Logging screen](https://github.com/Mar0u/mernMessages/blob/main/screens/logging%20screen.png?raw=true)

![Sign up screen](https://github.com/Mar0u/mernMessages/blob/main/screens/sign%20up%20screen.png?raw=true)

![Profile screen](https://github.com/Mar0u/mernMessages/blob/main/screens/profile%20screen.png?raw=true)

![Messages screen](https://github.com/Mar0u/mernMessages/blob/main/screens/messages%20screen.png?raw=true)

## Prerequisites

You need:

- Docker
- Docker Compose

## Getting Started

1. Clone the repository and navigate to the project directory.

2. Build and run the Docker containers:
```
docker-compose up --build
```

3. Access the client applications on: [http://localhost:3000](http://localhost:3000) and [http://localhost:3001](http://localhost:3001)

## Sample data
The sample login credentials have the following format:
```
emails: firstnamelastname + example.com
passwords: firstnamelastname + 123!A
```

For example:

```
jamesanderson@example.com
jamesanderson123!A
```