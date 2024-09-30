import { getMongoClient } from "./mongoClient";
import { LandHoldings } from "../models/LandHoldings";
import { getOwnersCollection } from "./ownerService";
import * as Realm from "realm-web";

// get Land Holdings collection
const getLandHoldingsCollection = () => {
  const mongoClient = getMongoClient();
  if (!mongoClient) {
    throw new Error("Must be logged in to access MongoDB");
  }
  return mongoClient.db("PCGDB").collection("landholdings");
};

// create a new land holding
export const createLandHolding = async (landHoldingData) => {
  console.log("Creating land holding with data from service", landHoldingData); // log incoming data
  const landHolding = new LandHoldings(landHoldingData);
  console.log("Instantiating LandHoldings with data:", landHolding); // log instantiated data

  // validation
  if (!landHolding.isValid()) {
    throw new Error("Invalid land holding data, when creating land holding");
  }

  // save
  try {
    const landHoldingsCollection = getLandHoldingsCollection();
    const result = await landHoldingsCollection.insertOne(
      landHolding.toMongoDocument()
    );

    if (landHolding.owner) {
      const ownersCollection = getOwnersCollection();
      await ownersCollection.updateOne(
        { _id: landHolding.owner },
        { $inc: { totalLandHoldings: 1 } }
      );
    }
    console.log("Created land holding successfully", result); // log result
    return { _id: result.inwertedId, ...landHolding.toMongoDocument() };
  } catch (error) {
    console.error("Error creating land holding service", error);
    throw new Error("Failed to create land holding");
  }
};

// fetch all land holdings
export const fetchLandHoldings = async () => {
  try {
    const landHoldingsCollection = getLandHoldingsCollection();
    const ownersCollection = getOwnersCollection();

    const landHoldings = await landHoldingsCollection.find();

    // fetch owners for each land holding
    const landHoldingsWithOwners = await Promise.all(
      landHoldings.map(async (landHolding) => {
        if (landHolding.owner) {
          const owner = await ownersCollection.findOne({
            _id: landHolding.owner,
          });
          return { ...landHolding, owner };
        }
        return landHolding;
      })
    );

    return landHoldingsWithOwners;
  } catch (error) {
    console.error("Error fetching land holdings", error);
    throw error;
  }
};

// update land holding
export const updateLandHolding = async (landHoldingId, landHoldingData) => {
  if (landHoldingData.owner && typeof landHoldingData.owner === "string") {
    try {
      landHoldingData.owner = new Realm.BSON.ObjectId(landHoldingData.owner);
    } catch (error) {
      throw new BSONTypeError("Invalid ObjectId for owner");
    }
  }

  const landHolding = new LandHoldings(landHoldingData);

  // validation
  if (!landHolding.isValid()) {
    throw new Error("Invalid land holding data, when updating land holding");
  }

  // save
  try {
    const landHoldingsCollection = getLandHoldingsCollection();
    await landHoldingsCollection.updateOne(
      { _id: new Realm.BSON.ObjectId(landHoldingId) },
      { $set: landHolding.toMongoDocument() }
    );
    return { _id: landHoldingId, ...landHolding.toMongoDocument() };
  } catch (error) {
    console.error("Error updating land holding", error);
    throw new Error("Failed to update land holding");
  }
};

// delete land holding
export const deleteLandHolding = async (landHoldingId) => {
  try {
    const landHoldingsCollection = getLandHoldingsCollection();

    const landHolding = await landHoldingsCollection.findOne({
      _id: new Realm.BSON.ObjectId(landHoldingId),
    });

    if (!landHolding) {
      throw new Error("Land holding not found");
    }

    const result = await landHoldingsCollection.deleteOne({
      _id: new Realm.BSON.ObjectId(landHoldingId),
    });

    if (landHolding.owner) {
      const ownersCollection = getOwnersCollection();
      await ownersCollection.updateOne(
        { _id: landHolding.owner },
        { $inc: { totalLandHoldings: -1 } }
      );
    }
    return result;
  } catch (error) {
    console.error("Error deleting land holding", error);
    throw new Error("Failed to delete land holding");
  }
};
