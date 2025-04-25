const express = require('express')
const app = express()
const cors = require('cors')
const { DBConnection } = require('./config/connection')
require('dotenv').config()
PORT = process.env.PORT

app.use(cors({
    // origin: "https://inquisitive-daffodil-a3092a.netlify.app",
    origin: "https://digital-diner-client.netlify.app",
    credentials: true
}))

DBConnection()
app.use(express.json())

const fs = require('fs')
const Menu = require('./models/menu')
// const menuItems = fs.readFileSync('data.json')
// const menuItemsJson = JSON.parse(menuItems)


const authRoutes = require("./routes/auth")
const userRoutes = require("./routes/user")
const paymentRoutes = require("./routes/payment")

app.use("/auth", authRoutes)
app.use("/user", userRoutes)
app.use("/payment", paymentRoutes)

app.get("/", (req, res) => {
    return res.status(200).json({
        success: true,
        message: `Digital Dinner Server is up on port ${PORT}`
    })
})

// menuItemsJson.forEach(item => {

//     async function seedData(data) {
//         try {
//             const newItem = await Menu.create({
//                 name: data.name,
//                 description: data.description,
//                 price: +data.price,
//                 image_url: data.image_url,
//                 type: data.type,
//                 category: data.category,
//                 is_vegan: data.is_vegan,
//                 is_gluten_free: data.is_gluten_free,
//             })
//         } catch (error) {
//             console.log(error);
//             throw error

//         }
//     }

//     seedData(item)
// });


app.listen(PORT, () => {
    console.log("Digital Diner server running on port", PORT);
})