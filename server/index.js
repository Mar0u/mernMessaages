require('dotenv').config()
const userRoutes = require("./routes/users")
const authRoutes = require("./routes/auth")
const detailsRoutes = require("./routes/details");


const messagesRoutes = require("./routes/messages");


const express = require('express')
const app = express()
const cors = require('cors')
const tokenVerification = require('./middleware/tokenVerification')
//middleware
app.use(express.json())
app.use(cors())
const port = process.env.PORT || 8080
app.listen(port, () => console.log(`Nasłuchiwanie na porcie ${port}`))
// routes
app.use("/api/users", userRoutes)
app.use("/api/auth", authRoutes)
app.use("/api/details", tokenVerification, detailsRoutes);


app.use("/api/messages", tokenVerification, messagesRoutes); // Dodana trasa dla wiadomości



//trasy wymagające weryfikacji tokenem:
app.get("/api/users/", tokenVerification)
app.use("/api/users/", tokenVerification, userRoutes);
app.get("/api/messages", tokenVerification, messagesRoutes);
//POTEM trasy nie wymagające tokena (kolejnośd jest istotna!)
app.use("/api/auth", authRoutes)
app.use("/api/users", userRoutes) //tylko metoda get wymaga tokena
app.use("/api/details", detailsRoutes);



app.use("/api/messages", messagesRoutes);


const connection = require('./db')
connection()
