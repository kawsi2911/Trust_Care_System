const { MongoClient, ServerApiVersion } = require('mongodb');

const uri = "mongodb+srv://sof21b106_db_user:TrustCare2025@cluster0.ffnvxkg.mongodb.net/?appName=Cluster0";

const client = new MongoClient(uri,{
    serverApi:{
        version: ServerApiVersion.v1,
        strict:true,
        deprecationErrors: true,
    }
});

async function connectDB(){
    try{
        await client.connect();

        const db = client.db("Trust_Care_DB");

        console.log("connected");

        return db;
    } catch (error){
        console.error(error);
    }
}

module.exports = connectDB;