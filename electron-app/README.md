# Redmine Logger

Redmine Tracker is a cross-platform application built using Electron and React. It allows users to track
and manage tasks in Redmine and Jira project management systems.
The application is available for Windows, macOS or Linux.

## Features

- Connects to Redmine and Jira project management systems.
- Tracks and manages tasks, issues, and projects.
- Provides a user-friendly interface for interacting with the project management systems.

## Installation

To install and run the Redmine Tracker application on your platform, follow these steps:

1. Clone the GitHub repository:

```bash
git clone https://github.com/Misyuk-T/redmine-application.git
```

2. Make sure that u have Node.js >= v18.0.0 and yarn >= v1.22.19

```bash
node --version && yarn --version
```

3. Install dependency for electron app and react app

```bash
cd electron-app yarn install && cd react-app yarn install
```

4. Build electron app inside electron-app folder with necessary flag: --win --mac or --linux

```bash
yarn build --mac
```
