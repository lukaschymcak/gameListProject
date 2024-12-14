const axios = require("axios");
const { MongoClient } = require("mongodb");

// vqyrpsewa1ndmenonc9g70z7k8e7fm

const mongoUri =
  "mongodb+srv://chymcakLukas:BznHbFtVPaLOB7I6@cluster0.x71zm.mongodb.net/";
const igdbClientId = "xg4uu26nijdbfp5j3cj4qtd1t53jqp";
const igdbAccessToken = "vqyrpsewa1ndmenonc9g70z7k8e7fm";
const offset = 4500;

const client = new MongoClient(mongoUri);

async function fetchDataAndInsert() {
  try {
    // Connect to MongoDB
    await client.connect();
    console.log("Connected to MongoDB");

    const database = client.db("test");
    const collection = database.collection("platforms");

    // Fetch data from IGDB API
    const response = await axios.post(
      "https://api.igdb.com/v4/platforms",
      `fields name,abbreviation; limit 500;`,
      {
        headers: {
          "Client-ID": igdbClientId,
          Authorization: `Bearer ${igdbAccessToken}`,
        },
      }
    );

    const data = response.data; // API response data

    // Insert data into MongoDB
    const result = await collection.insertMany(data);
    console.log(`${result.insertedCount} documents were inserted`);
    console.log(data);
  } catch (error) {
    console.error("Error:", error.response?.data || error.message);
  } finally {
    await client.close();
  }
}

fetchDataAndInsert();
