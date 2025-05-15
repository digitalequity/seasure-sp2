# Service Provider System for Marine Services

A comprehensive web application for marine service providers to manage boats, service requests, communications, and knowledge resources, integrated with the SeaSure platform.

## Features

### Core Functionality
- **Multi-Boat Management**: Manage portfolios of boats from both SeaSure users and external clients
- **Service Request System**: Handle maintenance, repairs, inspections, and emergency requests
- **Communication Hub**: Boat-specific and support chat channels
- **Knowledge Management**: Centralized document and resource library
- **Business Operations**: Time tracking, invoicing, and performance metrics

### Key Components
1. **Dashboard**
   - Overview of active requests, urgent tasks, and key metrics
   - Quick actions for common tasks
   - Performance indicators and trends

2. **Boat Management**
   - Detailed boat profiles with specifications and history
   - Service records and maintenance schedules
   - Photo galleries and document storage
   - Owner information and preferences

3. **Service Requests**
   - Priority-based request tracking
   - Status workflow management
   - Technician assignment
   - Time and parts tracking

4. **Communication System**
   - Real-time chat with boat owners
   - File sharing capabilities
   - Message history and search
   - Notification system

5. **Knowledge Base**
   - Document categorization and tagging
   - Search functionality
   - Video tutorials and guides
   - Manufacturer manuals and specs

## Technical Stack

- **Frontend**: React 18 with TypeScript
- **UI Framework**: Tailwind CSS with Headless UI
- **State Management**: React Context API
- **Routing**: React Router v6
- **Backend**: Firebase (Firestore, Auth, Storage, Functions)
- **Real-time**: Firebase Realtime Database for chat
- **File Storage**: Firebase Storage
- **Analytics**: Firebase Analytics

## Prerequisites

- Node.js 16+ and npm/yarn
- Firebase account and project
- Firebase CLI installed globally

## Installation

1. Clone the repository:
```bash
git clone [repository-url]
cd service-provider-system
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```bash
cp .env.example .env
```

4. Add your Firebase configuration to `.env`:
```
REACT_APP_FIREBASE_API_KEY=your-api-key
REACT_APP_FIREBASE_AUTH_DOMAIN=your-auth-domain
REACT_APP_FIREBASE_PROJECT_ID=your-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET=your-storage-bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
REACT_APP_FIREBASE_APP_ID=your-app-id
REACT_APP_FIREBASE_MEASUREMENT_ID=your-measurement-id
```

## Development

Run the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Firebase Setup

1. Initialize Firebase in your project:
```bash
firebase init
```

2. Select the following services:
   - Firestore
   - Functions
   - Storage
   - Hosting

3. Deploy Firebase rules and functions:
```bash
firebase deploy --only firestore:rules,storage:rules,functions
```

## Project Structure

```
src/
├── components/          # React components
│   ├── auth/           # Authentication components
│   ├── boats/          # Boat management
│   ├── chat/           # Chat interface
│   ├── dashboard/      # Dashboard widgets
│   ├── knowledge/      # Knowledge base
│   ├── requests/       # Service requests
│   └── shared/         # Shared components
├── contexts/           # React contexts
├── hooks/              # Custom hooks
├── services/           # API and Firebase services
├── types/              # TypeScript definitions
└── utils/              # Helper functions
```

## Key Features Implementation

### Authentication
- Email/password authentication
- Service provider profiles
- Role-based access control

### Real-time Updates
- Live chat messaging
- Request status updates
- Notification system

### File Management
- Document upload and storage
- Image galleries for boats
- Knowledge base resources

### Business Logic
- Service request workflow
- Maintenance scheduling
- Time and expense tracking
- Invoice generation

## Deployment

1. Build the production version:
```bash
npm run build
```

2. Deploy to Firebase Hosting:
```bash
firebase deploy --only hosting
```

## Environment Variables

Required environment variables:
- `REACT_APP_FIREBASE_API_KEY`
- `REACT_APP_FIREBASE_AUTH_DOMAIN`
- `REACT_APP_FIREBASE_PROJECT_ID`
- `REACT_APP_FIREBASE_STORAGE_BUCKET`
- `REACT_APP_FIREBASE_MESSAGING_SENDER_ID`
- `REACT_APP_FIREBASE_APP_ID`
- `REACT_APP_FIREBASE_MEASUREMENT_ID`

## Security

- Firebase security rules for data access control
- Authentication required for all routes
- Service provider isolation for data privacy
- Secure file upload validation

## Performance Optimization

- Lazy loading for code splitting
- Image optimization and caching
- Pagination for large data sets
- Efficient real-time subscriptions

## Future Enhancements

1. **Mobile Application**: Native mobile app for field technicians
2. **Offline Support**: Work without internet connectivity
3. **Advanced Analytics**: Detailed business intelligence
4. **Integration APIs**: Connect with third-party services
5. **AI Features**: Predictive maintenance and diagnostics
6. **Multi-language Support**: Internationalization

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

[Your license information]

## Support

For support and questions, please contact [your contact information]