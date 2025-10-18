# CommentHub - Nested Commenting System

A modern, full-stack nested commenting system built with Next.js 15 and MongoDB, featuring real-time interactions, user authentication, and a beautiful UI.

## 🚀 Features

### Core Functionality

- **Nested Comments** - Unlimited depth comment threading with visual hierarchy
- **User Authentication** - Secure JWT-based authentication with httpOnly cookies
- **Upvoting System** - Optimized upvote/downvote functionality with real-time updates
- **Reply System** - Reply to any comment at any level
- **Comment Management** - Edit and delete your own comments
- **Admin Controls** - Admin users can manage all comments

### User Experience

- **Profile Management** - Edit name, avatar, and password through modal interface
- **Custom Modals** - Beautiful animated modals replacing browser alerts
- **Responsive Design** - Mobile-first design with smooth transitions
- **Live Avatar Preview** - Real-time preview when updating profile photo
- **Toast Notifications** - User-friendly feedback for all actions
- **Smooth Animations** - Framer Motion powered transitions

### Technical Features

- **Server-Side Rendering** - Next.js 15 App Router for optimal performance
- **Database Optimization** - Efficient schema design with user-based upvote tracking
- **Form Validation** - Zod schema validation for all inputs
- **Security** - Password hashing with bcryptjs, secure cookie handling
- **Type Safety** - TypeScript support for enhanced development experience

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 19, Tailwind CSS
- **Backend**: Next.js API Routes, MongoDB, Mongoose
- **Authentication**: JWT (jsonwebtoken), bcryptjs
- **Validation**: Zod
- **Animations**: Framer Motion
- **Notifications**: React Hot Toast

## 📋 Prerequisites

Before running this application, make sure you have:

- **Node.js** (v18 or higher)
- **MongoDB** (local installation or MongoDB Atlas account)
- **npm** or **yarn** package manager

## ⚙️ Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd inter-iit-task
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration

Create a `.env.local` file in the root directory:

```env
MONGODB_URI=mongodb://localhost:27017/commenthub
JWT_SECRET=your-super-secret-jwt-key-change-this
NODE_ENV=development
```

**Important**: Change the `JWT_SECRET` to a strong, random string in production.

### 4. Start MongoDB

**For local MongoDB:**

```bash
mongod
```

**For MongoDB Atlas:**

- Create a cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- Get your connection string
- Update `MONGODB_URI` in `.env.local`

### 5. Run the Development Server

```bash
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000)

### 6. Create Your First User

1. Navigate to [http://localhost:3000/login](http://localhost:3000/login)
2. Click on "Don't have an account? Sign up"
3. Fill in the registration form
4. Start commenting!
5. To sign in as Admin use email 'admin@example.com' and password 'password123'

## 🏗️ Our Approach

### Architecture Decisions

**1. Schema Optimization**

- Moved upvote tracking from `Comment.upvotedBy[]` to `User.upvotedComments[]`
- Reduces comment document size and improves query performance
- Enables efficient user-specific upvote checks

**2. Authentication Strategy**

- JWT tokens stored in httpOnly cookies for security
- Server-side token verification on all protected routes
- Async cookie handling compatible with Next.js 15

**3. Component Design**

- Reusable modal system for confirmations and forms
- Nested comment recursion with proper key management
- Client/Server component separation for optimal rendering

**4. Database Design**

```javascript
User Schema:
- _id (UUID string)
- name, email, password (hashed)
- avatar (URL with fallback)
- upvotedComments (array of comment IDs)
- isAdmin (boolean)

Comment Schema:
- _id (auto-increment number)
- content, author, post
- parentComment (for nesting)
- upvotes (count only)
- replies (array of comment IDs)

Post Schema:
- _id (auto-increment number)
- title, content, author
- createdAt, updatedAt
```

### Key Implementation Details

**Nested Comments Rendering:**

- Recursive component structure
- Visual indentation with border and padding
- Lazy loading for deep comment threads

**Upvote System:**

- Single source of truth in User model
- Optimistic UI updates
- Atomic database operations

**Profile Management:**

- Modal-based editing interface
- Current password verification for security
- Real-time avatar preview
- Optional password change

## 📁 Project Structure

```
inter-iit-task/
├── src/
│   ├── app/
│   │   ├── api/          # API routes
│   │   │   ├── auth/     # Authentication endpoints
│   │   │   ├── comments/ # Comment CRUD operations
│   │   │   └── posts/    # Post operations
│   │   ├── login/        # Login/Signup page
│   │   ├── post/[id]/    # Individual post view
│   │   └── layout.tsx    # Root layout
│   └── components/
│       ├── Comment.jsx        # Recursive comment component
│       ├── CommentForm.jsx    # Comment input form
│       ├── CommentList.jsx    # Comment list container
│       ├── Navbar.jsx         # Navigation bar
│       ├── ProfileModal.jsx   # Profile editing modal
│       ├── ConfirmModal.jsx   # Confirmation dialog
│       └── Logo components
├── lib/
│   ├── auth.js          # Authentication utilities
│   ├── mongodb.js       # Database connection
│   └── models/          # Mongoose schemas
├── public/              # Static assets
└── package.json
```

## 🎨 UI/UX Features

- **Gradient Backgrounds** - Modern blue-purple gradients
- **Hover Effects** - Scale and shadow animations on interactive elements
- **Loading States** - Skeleton loaders and spinners
- **Error Handling** - User-friendly error messages with toast notifications
- **Responsive Layout** - Adapts to mobile, tablet, and desktop screens
- **Accessibility** - Proper ARIA labels and keyboard navigation

## 🔒 Security Features

- Password hashing with bcryptjs (10 salt rounds)
- JWT tokens with 7-day expiration
- httpOnly cookies to prevent XSS attacks
- Server-side authentication verification
- Input validation with Zod schemas
- SQL injection prevention via Mongoose ORM

