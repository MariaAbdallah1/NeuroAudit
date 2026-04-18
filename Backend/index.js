// import express from "express"
// import bootStrab from "./src/app.controller.js"
// import * as dotenv from 'dotenv';
// dotenv.config();

// const app=express()
// const port=3000


// bootStrab(app,express)

// app.listen(port, () => {
//     console.log(`app listening on port ${port}`)
//   })

import express from "express";
import cors from "cors"; // ✅ Import CORS
import bootStrab from "./src/app.controller.js";
import * as dotenv from 'dotenv';
dotenv.config();

const app = express();
const port = 3000;

// ✅ Apply CORS middleware before any routes
app.use(cors({
  origin: 'http://localhost:8080', // Replace with your frontend's actual origin
  credentials: true
}));

bootStrab(app, express);

app.listen(port, () => {
  console.log(`app listening on port ${port}`);
});
