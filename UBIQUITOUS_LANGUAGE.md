# Ubiquitous Language — Nexora Social Media Platform

This document defines the common vocabulary used across the **Nexora** project. It helps team members, developers, and evaluators share the same understanding of concepts across the user interface, backend APIs, and database.

---

## 1. User Roles & Identity

### User
- **Simple Meaning**: A person who has registered an account on Nexora to interact with others.
- **How it is used in Nexora**: Represented by the `userModel.js` schema in MongoDB. Each user has an email, encrypted password, name, bio details, and relationships with other users.

### Admin
- **Simple Meaning**: A special user who has administrative privileges on the platform.
- **How it is used in Nexora**: Tracked by the `isAdmin` boolean field in `userModel.js`. Admins can manage platform settings and remove accounts if needed.

### Follower
- **Simple Meaning**: Another user who subscribes to see your updates.
- **How it is used in Nexora**: Stored as an array of user IDs in `user.followers`. When someone follows you, their ID is added to your followers list.

### Following
- **Simple Meaning**: The accounts you have chosen to subscribe to so you can see their updates.
- **How it is used in Nexora**: Stored as an array of user IDs in `user.following`. The posts made by these users automatically appear in your home feed.

---

## 2. Content & Social Interactions

### Post
- **Simple Meaning**: A single piece of content shared by a user, containing an image, a written caption, or both.
- **How it is used in Nexora**: Defined in `postModel.js` with fields for `userId`, `desc` (the caption), `image` (the uploaded photo filename), and a list of `likes`.

### Caption (`desc`)
- **Simple Meaning**: The text description or message that accompanies a photo in a post.
- **How it is used in Nexora**: Users enter this text in the `CreatePostModal` component. It is saved in the database under the `desc` field and displayed beneath the post image.

### Like / Unlike
- **Simple Meaning**: Showing appreciation for a post with a heart icon. Clicking again removes the appreciation.
- **How it is used in Nexora**: Users can click the heart button or double-tap an image. The user's ID is added to or removed from the `likes` array in MongoDB via the `/post/:id/like_dislike` API route.

### Timeline Feed (`Home Feed`)
- **Simple Meaning**: The main stream of posts you see when you open the home page.
- **How it is used in Nexora**: The backend endpoint `/post/:id/timeline` collects posts created by the current user and everyone they follow, sorts them newest first, and renders them through `Posts.js`.

### Stories Bar
- **Simple Meaning**: A horizontal list of circular avatars at the top of the feed that lets users preview moments from other members.
- **How it is used in Nexora**: Located in `Stories.js`. Clicking any avatar opens an interactive story viewer modal with a progress indicator and user preview.

### Explore
- **Simple Meaning**: A discovery section where users can browse photos shared by members across the entire platform.
- **How it is used in Nexora**: Triggered from the navigation menu (`ExploreModal.js`). It gathers all posts with images into a clean, responsive photo grid.

---

## 3. User Profile & Account Details

### Profile
- **Simple Meaning**: The personal page for a specific user showing their information, statistics, and past posts.
- **How it is used in Nexora**: Accessed at the route `/profile/:id`. Rendered by `Profile.js`, showing the user's avatar, cover picture, follower counts, and a grid of their authored posts.

### Profile Picture & Cover Photo
- **Simple Meaning**: The circular portrait image representing the user, and the banner image shown at the top of their profile.
- **How it is used in Nexora**: Stored in `userModel.js` as `profilePicture` and `coverPicture`. Uploaded through `ProfileModal.js` and served statically from `/images`.

### Bio Information (`About`, `Lives In`, `Works At`)
- **Simple Meaning**: Personal details the user shares about themselves, such as their work, location, and relationship status.
- **How it is used in Nexora**: Stored in the User document and displayed in the profile info card. Users can edit these fields anytime through the Edit Profile modal.

---

## 4. Navigation & User Interface

### Sidebar
- **Simple Meaning**: The fixed vertical navigation menu on the left side of the screen on desktop computers.
- **How it is used in Nexora**: Defined in `Sidebar.js`. It contains one-click buttons for Home, Search, Explore, Create, Profile, and Log Out.

### TopNav & BottomNav
- **Simple Meaning**: Navigation bars designed specifically for mobile screens—one at the top and one at the bottom.
- **How it is used in Nexora**: Defined in `TopNav.js` and `BottomNav.js`. On screens smaller than 768px, the sidebar hides and these mobile bars appear for touch navigation.

### Create Post Modal
- **Simple Meaning**: A popup window that allows users to create and publish a new post.
- **How it is used in Nexora**: Built in `CreatePostModal.js`. It supports dragging and dropping image files, live image previews, caption entry, and submission to the backend.

### Search Modal
- **Simple Meaning**: A popup window where users can find other people on Nexora.
- **How it is used in Nexora**: Built in `SearchModal.js`. As the user types, it filters through all registered users in real time and lets them click directly to view any profile.

---

## 5. Technical & Backend Architecture

### REST API
- **Simple Meaning**: The structured set of web addresses that the frontend uses to talk to the backend server.
- **How it is used in Nexora**: Express routes defined under `/auth`, `/user`, `/post`, and `/upload` handle data exchange using standard HTTP methods (`GET`, `POST`, `PUT`, `DELETE`).

### JWT (JSON Web Token)
- **Simple Meaning**: A secure digital ticket issued after login that proves who the user is.
- **How it is used in Nexora**: Created by `jsonwebtoken` in `AuthController.js` during login or registration. Stored in the browser's `localStorage` and sent with every protected request inside the `Authorization: Bearer` header.

### Password Hashing (`Bcrypt`)
- **Simple Meaning**: Scrambling a user's password into an unreadable string before saving it so that raw passwords are never stored in the database.
- **How it is used in Nexora**: When a user registers, `bcrypt.hash()` scrambles their password with 10 salt rounds before storing it in MongoDB.

### Multer Storage
- **Simple Meaning**: A backend tool that receives uploaded photo files from form submissions and saves them to the server disk.
- **How it is used in Nexora**: Configured in `UploadRoute.js`. It places uploaded files in `Server/public/images/` with unique timestamped filenames.

### Redux Store
- **Simple Meaning**: A single, central storage place in the frontend application that holds shared data like the current user and post feed.
- **How it is used in Nexora**: Set up in `ReduxStore.js`. It coordinates state across components and automatically saves the logged-in session to the browser's `localStorage`.
