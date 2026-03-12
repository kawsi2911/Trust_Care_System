const { getDB } = require("../config/db");
const { createUser } = require("../models/familyModel");

async function registerUser(req, res) {

    try{

        const db = getDB();

        const user = createUser(req.body);

        const result = await db.collection("users").insertOne(user);

        res.json({
            message: "user registered successfully",
            id:result.insertId
        });
    } catch (error){
        res.status(500).json({
            error:"Registration Failed"
        });
    }
}

module.exports = { registerUser};