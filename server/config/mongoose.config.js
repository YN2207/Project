const mongoose = require ("mongoose");
const username = process.env.DB_USERNAME;
const dbName = process.env.DB;
const pw = process.env.PASSWORD;
const dbUri = process.env.DB_URI;
const uri = `mongodb+srv://yaminkmar817:nOER44LRUgy0bRLX@solocluster0.bltfp.mongodb.net/?retryWrites=true&w=majority&appName=soloCluster0`;
mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log("Established a connection to the database"))
  .catch(err => console.log("Something went wrong when connecting to the database", err));