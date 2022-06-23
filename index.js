require("dotenv").config()
const express = require('express')
const app = express();
 const mongoose = require('mongoose');
const cors = require("cors")
const UserModel = require("./models/Users")
app.use(express.json())
app.use(cors())

const DB = process.env.DATABASE;
mongoose.connect(DB,{
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(()=> console.log('connection start'))

app.post("/createUser", async (req, res) => {
    const user = req.body;
    const newUser = new UserModel(user);
    await newUser.save()

    res.json(user)
})
app.get("/getUsers", (request, response) => {
    UserModel.find({}, (err, result) => {
        if (!err) {
            response.json(result)
        } else {
            response.json(err)
        }
    })
})

// For Updating

app.put("/updateUser", (req, res) => {

    const { id, fullName,email, age,phoneNo  } = req.body
    try {
        UserModel.findById(id, (err, user) => {
            user.fullName = fullName;
            user.email = email
            user.age = age
            user.phoneNo = phoneNo
            user.save()
            res.send("User has been successfully updated in DB")
        })
    }
    catch (err) {
        res.send("Getting error from server")
    }
})
// For getting single User data on Edit page
app.get("/getuser/:id",async(req,res)=>{
    try {
        const id = req.params.id;

        const userindividual = await UserModel.findById(id);
        res.status(201).json(userindividual)
        res.send("User has been successfully ")

    } catch (error) {
        
    }
})

app.delete("/deleteUser/:id", async (req, res) => {
    const id = req.params.id

    await UserModel.findByIdAndRemove(id).exec()
    res.send("User has been successfully deleted from DB")
})

const PORT = process.env.PORT|| '8000';
app.listen(PORT, () => {
    console.log(`Server is running perfectly on port ${PORT}`)
})