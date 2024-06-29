const express = require("express")
const morgan = require("morgan")
const cors = require("cors")
const path = require("path")
const fileupload = require('express-fileupload')
const routes = require("./routes/index.routes")
const connectDB = require("./config/db")

require("dotenv").config()
// environment
const port = process.env.PORT || 3003

// app
const app = express()

app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.use(morgan("combined"))
app.use(cors({
    origin:"http://localhost:3000",
    credentials: true,
}))
app.use(fileupload({
    createParentPath: true,
}))
app.use(express.static(path.join(__dirname,"public")))

connectDB()
routes(app)

app.listen(port,()=>{
    console.log(`Server is running on port ${port}`)
})

