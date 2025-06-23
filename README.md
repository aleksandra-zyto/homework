# Store Review Analytics System

A full-stack application for managing and analyzing product reviews with real-time analytics and data visualization.

## 🚀 Local Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd be
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

The backend will start on `http://localhost:5000` and automatically:
- Create an SQLite database (`database.sqlite`)
- Set up all required tables
- Seed with demo data including users and sample reviews

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd fe
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

The frontend will start on `http://localhost:3000`

### Demo Credentials
- **Admin**: `admin@store.com` / `Admin123`
- **Staff**: `staff@store.com` / `Staff123`

## 🛠 Technology Choices and Reasoning

### Backend
- **Node.js + Express**: Fast development with robust ecosystem
- **TypeScript**: Type safety and better developer experience
- **Sequelize + SQLite**: 
  - SQLite for zero-config database setup
  - Sequelize for robust ORM with migrations and relationships
- **JWT Authentication**: Stateless authentication for scalability
- **bcryptjs**: Secure password hashing
- **CORS**: Cross-origin request handling
- **DOMPurify + JSDOM**: Server-side XSS protection for user comments

### Frontend
- **React + TypeScript**: Component-based UI with type safety
- **SCSS Modules**: Scoped styling with CSS preprocessing
- **Recharts**: Professional data visualization library
- **React Router**: Client-side routing
- **Context API**: State management for authentication

### Database Design
- **Users**: Authentication and user management
- **Products**: Product catalog with categories and pricing
- **Reviews**: Star ratings with optional comments, linked to products
- **Denormalized category field**: Fast analytics queries without joins

## 🤖 LLM Usage Documentation

### Claude Sonnet 4 was used for:

#### Model Syncing Between Frontend and Backend
- Generated matching TypeScript interfaces for API responses and database models
- Ensured consistent data structures between Sequelize models and React components
- Created unified type definitions for User, Product, Review, and Analytics entities
- Synchronized validation rules between backend models and frontend form validation

#### Service Layer Syncing
- Generated matching API service methods for frontend consumption of backend endpoints
- Created consistent error handling patterns across frontend ApiService and backend controllers

#### SVG Icon Generation
- Generated custom SVG components for dashboard icons (charts, analytics, user actions)
- Created consistent icon sets with proper accessibility attributes
- Generated responsive icon components with size and color variants
- Produced semantic SVG markup for better screen reader compatibility

#### Comment Generation and Documentation
- Generated inline code comments explaining complex business logic and data transformations
- Created JSDoc documentation for API endpoints, service methods, and component props
- Produced descriptive comments for database schema relationships and validation rules
- Generated README documentation sections and setup instructions

#### Code Documentation
- API endpoint documentation with request/response examples
- Component prop interfaces with usage examples
- Database schema documentation with relationship explanations
- Architecture decision documentation for technology choices

The LLM ensured consistency across the full-stack application, maintaining type safety and documentation standards throughout the development process.

## 📊 Features Implemented

### Analytics Dashboard
- **Store Insights**: Total reviews, average rating, top category, popular price range
- **Visual Charts**: Bar and pie charts for category, rating, and price range distribution
- **Interactive Filtering**: Filter reviews by category and rating
- **Products Needing Attention**: Automatic identification of low-rated products

### Review Management
- **Add Reviews**: Modal form with product selection and star rating
- **Comment Sanitization**: XSS protection for user-generated content
- **Real-time Updates**: Dashboard refreshes after new review submission
- **Pagination**: Efficient handling of large review datasets

### Authentication
- **JWT-based Authentication**: Secure login system
- **Protected Routes**: Dashboard access requires authentication
- **Demo Credentials**: Pre-seeded admin and staff accounts

### Data Visualization
- **Responsive Charts**: Works across desktop and mobile devices
- **Multiple View Types**: Switch between bar and pie chart formats
- **Dynamic Data**: Charts update based on selected filters

## 🚧 Known Limitations

### Not Implemented
- **User Registration Frontend**: Backend endpoints exist but no UI component
- **User Management**: CRUD operations for user accounts
- **Advanced Filtering**: Date ranges, multiple category selection
- **Export Functionality**: Data export features
- **Real-time Notifications**: WebSocket-based updates

### Technical Debt
- No comprehensive test suite
- Limited error boundary implementation
- No data caching layer
- Basic responsive design (could be enhanced)

## 🔮 Future Improvements

### State Management
- **Redux Toolkit or Zustand**: Replace Context API with more robust state management
  - Better performance for large applications
  - Time travel debugging capabilities
  - Middleware support for logging and persistence
  - Normalized state structure for complex data relationships

### Testing Strategy
- **Backend Testing**:
  - Unit tests with Jest for models and controllers
  - Integration tests for API endpoints
  - Database testing with test fixtures
  - Authentication middleware testing
- **Frontend Testing**:
  - Component testing with React Testing Library
  - E2E testing with Cypress or Playwright
  - Visual regression testing for UI consistency
  - Accessibility testing with axe-core

### Icon System
- **Dedicated Icon Library**:
  - Extract inline SVGs to reusable icon components
  - Create icon registry with consistent naming
  - Implement icon variants (size, color, weight)
  - Add icon documentation with Storybook
  - Support for both filled and outlined styles

### Additional Enhancements
- **Performance**: React.memo, useMemo, lazy loading
- **Error Handling**: Global error boundaries and error reporting
- **Caching**: React Query for server state management
- **Progressive Web App**: Service workers and offline functionality
- **Real-time Features**: WebSocket integration for live updates
- **Advanced Analytics**: Time-series charts and trend analysis

## 📁 Project Structure

```
├── be/                 # Backend (Node.js + Express)
│   ├── src/
│   │   ├── controllers/    # Route handlers
│   │   ├── models/        # Sequelize models
│   │   ├── routes/        # API routes
│   │   ├── middleware/    # Auth middleware
│   │   ├── utils/         # JWT utilities
│   │   └── seeds/         # Database seeding
│   └── database.sqlite    # SQLite database
├── fe/                 # Frontend (React + TypeScript)
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Route components
│   │   ├── services/      # API client
│   │   ├── contexts/      # React contexts
│   │   ├── types/         # TypeScript definitions
│   │   └── styles/        # SCSS modules
└── README.md
```

## 🎯 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/auth/profile` - Get user profile

### Products
- `GET /api/products` - Get all products
- `GET /api/products/category/:category` - Get products by category
- `GET /api/products/price/:range` - Get products by price range

### Reviews
- `GET /api/reviews` - Get reviews with pagination/filtering
- `POST /api/reviews` - Create new review
- `GET /api/reviews/analytics` - Get analytics data
- `GET /api/reviews/:id` - Get single review

### Users
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create user
- `DELETE /api/users/:id` - Delete user

## 🔒 Security Features

- **Password Hashing**: bcrypt with configurable salt rounds
- **JWT Tokens**: Secure authentication with expiration
- **Input Sanitization**: DOMPurify prevents XSS attacks
- **SQL Injection Protection**: Sequelize ORM parameterized queries
- **CORS Configuration**: Controlled cross-origin access

---

