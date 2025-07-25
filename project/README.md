# AgriConnect

AgriConnect is a modern web application designed to connect farmers, agricultural experts, and consumers. It provides a platform for sharing knowledge, trading farm products, chatting, and managing farm requirements through an integrated shop.

## Deployment

The latest version is deployed at: [https://agri-chat-project.vercel.app/](https://agri-chat-project.vercel.app/)

## Demo Video

Watch a demo of AgriConnect in action: [Video Demo](https://screenrec.com/share/tdZr32Makp)

## Features

- **User Authentication:** Register, login, and manage user profiles (admin and customer roles).
- **Dashboard:** Personalized dashboard with feature cards and animated backgrounds.
- **Market:** Upload, browse, edit, and delete farm products. Product owners can manage their own listings.
- **AgriChatShop:**
  - Customers can browse, search, and order farm requirements.
  - Admins can add, edit, and delete shop items.
  - Cart with live item count and dropdown preview.
  - Place orders directly from the cart or shop page.
  - View order history (customers) and manage all orders (admins).
- **Chatroom:** Real-time chat for community discussions.
- **FAQ, About, and Contact Pages:** Modern, informative, and interactive.
- **Responsive UI:** Built with React and Tailwind CSS for a beautiful experience on all devices.

## Tech Stack

- **Frontend:** React, Tailwind CSS, React Router DOM
- **Backend:** Node.js, Express.js
- **Database:** MongoDB (with Mongoose ODM)
- **Real-time:** Socket.IO (for chat)
- **Authentication:** JWT-based, with role-based access control

## Getting Started

### Prerequisites
- Node.js (v16+ recommended)
- MongoDB (local or cloud)
- pnpm (or npm/yarn)

### Installation

1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd Agrichat
   ```

2. **Install dependencies:**
   - For the backend:
     ```bash
     cd server
     pnpm install
     ```
   - For the frontend:
     ```bash
     cd ../client
     pnpm install
     ```

3. **Configure environment variables:**
   - Create a `.env` file in the `server` directory with your MongoDB URI and JWT secret:
     ```env
     MONGO_URI=mongodb://localhost:27017/agrichat
     JWT_SECRET=your_jwt_secret
     PORT=5000
     ```

4. **Start the backend server:**
   ```bash
   cd server
   pnpm start
   ```

5. **Start the frontend dev server:**
   ```bash
   cd ../client
   pnpm run dev
   ```

6. **Access the app:**
   - Frontend: [http://localhost:5173](http://localhost:5173)
   - Backend API: [http://localhost:5000](http://localhost:5000)

## Usage

- Register as a new user or login.
- Explore the dashboard, market, and shop.
- Admins can access the admin dashboard for full management.
- Use the chatroom to connect with the community.

## Scripts

- **Database seeding:**
  - Use the provided script in `server/scripts/addShopItems.js` to populate the shop with sample items.

## Folder Structure

```
Agrichat/
  client/      # React frontend
  server/      # Express backend
```

## Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

## License

[MIT](LICENSE) 