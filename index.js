require("dotenv").config();
const mongoose = require("mongoose");
const ChannelConfigSchema = require("./models/ChannelConfig");

mongoose.connection.on("error", (err) => {
  console.error(`MongoDB error: ${err}`);
});

mongoose.connection.once("open", () => {
  console.info("MongoDB open");
});

mongoose.connection.on("connected", () => {
  console.info("MongoDB connected");
});

mongoose.connection.on("disconnected", () => {
  console.warn("MongoDB disconnected");
});

mongoose.connection.on("reconnected", () => {
  console.info("MongoDB reconnected");
});

const { OLD_DATABASE_CONNECTION_STRING, NEW_DATABASE_CONNECTION_STRING } =
  process.env;

const connectToDb = (connectionString) =>
  mongoose.createConnection(connectionString, {
    family: 4,
    useNewUrlParser: true,
    keepAlive: true,
    useUnifiedTopology: true,
  });

const saveNewConfig = async (NewConfig, legacyConfigObject) => {
  const newConfigObject = new NewConfig({
    channelId: legacyConfigObject.channelId,
    createdAt: legacyConfigObject.createdAt,
    updatedAt: legacyConfigObject.updatedAt,
    profiles: legacyConfigObject.profiles,
  });
  console.log(`Saving document: ${legacyConfigObject.channelId}`);
  await newConfigObject.save();
};

const start = async () => {
  console.log("Starting...");
  console.log("Connecting to old db...");
  const oldDb = await connectToDb(OLD_DATABASE_CONNECTION_STRING);
  const oldDbConfigs = oldDb.model("ChannelConfig", ChannelConfigSchema);
  console.log("Old db connected!");

  console.log("Connecting to new db...");
  const newDb = await connectToDb(NEW_DATABASE_CONNECTION_STRING);
  const NewConfig = newDb.model("ChannelConfig", ChannelConfigSchema);
  console.log("New db connected!");

  // cleaning new database before the operation to avoid duplicate id errors
  console.log("Cleaning new Db...");
  await NewConfig.deleteMany({});

  let i = 0;

  // here we goooooooo
  for await (const oldConfig of oldDbConfigs.find()) {
    await saveNewConfig(NewConfig, oldConfig);
    i++;
    console.log(oldConfig);
    console.log(`Documents processed: ${i}`);
  }
};

(async function () {
  await start();
  console.log("Done!");
  process.exit();
})();
