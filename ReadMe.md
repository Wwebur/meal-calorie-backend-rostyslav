# Meal Calorie Count Generator – Backend

This is the backend API for the **Meal Calorie Count Generator** application. It provides endpoints for user authentication, calorie lookup using the USDA FoodData Central API, and meal history tracking.

---

## **1. Project Structure**

```
backend/
│
├── controllers/
│   ├── authController.js         # Handles user registration, login, logout
│   ├── calorieController.js      # Handles USDA API calls and calorie calculations
│   ├── mealHistoryController.js  # Handles user meal history
│
├── routes/
│   ├── auth.js                   # Authentication routes
│   ├── calories.js               # Calorie lookup routes
│   ├── mealHistory.js            # Meal history routes
│
├── middleware/
│   ├── authMiddleware.js         # JWT authentication validation
│   ├── errorHandler.js           # Centralized error handling
│   ├── rateLimiter.js            # Rate limiting (15 requests/min)
│
├── models/
│   ├── userModel.js              # Mongoose schema for users
│   ├── mealLogModel.js           # Mongoose schema for meal logs
│
├── utils/
│   ├── usdaApi.js                # Handles USDA API interactions
│   ├── fuzzyMatch.js             # Fuzzy string matching for dishes
│
├── config/
│   ├── db.js                     # MongoDB connection
│
├── app.js                        # Main express app with middleware and routes
├── server.js                     # Entry point for starting the server
└── .env                          # Environment variables
```

---

## **2. Setup Instructions**

### **Prerequisites**

* Node.js (>=16)
* MongoDB (local or Atlas)
* npm
* USDA API Key

### **Steps**

1. **Clone the repository**

   ```bash
   git clone https://github.com/Wwebur/meal-calorie-backend-rostyslav.git
   cd meal-calorie-backend-rostyslav
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Run the server**

   ```bash
   npm run dev
   ```

   The backend runs at `http://localhost:5000`.

---

## **3. API Endpoints**

### **Auth**

* `POST /auth/register` – Register a new user
* `POST /auth/login` – Login and receive a JWT
* `POST /auth/refresh` – Refresh access token
* `POST /auth/logout` – Logout (clears refresh token cookie)

### **Calories**

* `POST /get-calories` – Lookup calories for a dish
  **Request Body:**

  ```json
  {
    "dish_name": "pasta alfredo",
    "servings": 2
  }
  ```

---

## **4. Design Decisions & Trade-offs**

* **Express.js**: Lightweight framework for rapid API development.
* **JWT Auth**: Access & refresh tokens implemented for secure sessions.
* **Rate Limiting**: Implemented via `express-rate-limit` (15 requests/min) to prevent abuse.
* **Error Handling**: Centralized error handling middleware ensures consistent error responses.
* **USDA API**: Chosen for its reliable food data, but fuzzy matching is applied to handle variations in dish names.
* **Security**: Cookies with `httpOnly` flag are used for refresh tokens. All sensitive keys are loaded from `.env`.