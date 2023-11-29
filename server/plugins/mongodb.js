import { MongoClient } from "mongodb";

export default defineNitroPlugin(async (nitroApp) => {

    // get runtime config
    const config = useRuntimeConfig();

    // check if has mongoDbUri set
    if (!config.mongoDbUri) throw new Error('MongoDB URI is not provided. MONGO_DB_URI must be set in .env');
    if (!config.mongoDbName) throw new Error('MongoDB Name is not provided. MONGO_DB_NAME must be set in .env');

    
    let client = new MongoClient(config.mongoDbUri);
    try {
        await client.connect();
        let db = client.db(config.mongoDbName);
        nitroApp.$db = db;
        console.log("MONGO DB Connected")
    } catch(e) {
        throw new Error('MongoDB Connection failed.')
    }
    


});