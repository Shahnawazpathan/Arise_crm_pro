# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`
"# Arise_crm" 
"# Arise_crm" 

## Development

To run the application in development mode, you will need to start both the frontend and backend servers.

**Backend:**

```bash
cd backend
npm install
npm run dev
```

**Frontend:**

```bash
npm install
npm run dev
```

## Production

To build the application for production, you will need to build the frontend and then start the backend server.

**1. Build the frontend:**

```bash
npm install
npm run build
```

This will create a `dist` directory with the compiled frontend assets.

**2. Start the backend:**

```bash
cd backend
npm install
npm start
```

The backend server will serve the frontend assets from the `dist` directory. The application will be available at `http://localhost:3001`.
