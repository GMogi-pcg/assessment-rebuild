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

// file upload function
export const uploadFiles = async (files) => {
  const fileUrls = [];

  for (const file of files) {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(
        "https://quiet-fire-9731.gmogi-work.workers.dev/",
        {
          method: "POST",
          body: formData,
        }
      );
      if (response.ok) {
        const result = await response.json();
        fileUrls.push(result.fileUrls);
      } else {
        throw new Error("Failed to upload file");
      }
    } catch (error) {
      console.error("Error uploading file", error);
      throw error;
    }
  }
  return fileUrls;
};

// create a new land holding
export const createLandHolding = async (landHoldingData, files = []) => {
  const landHoldingsCollection = getLandHoldingsCollection();

  const landHolding = new LandHoldings(landHoldingData);

  if (!landHolding.isValid()) {
    throw new Error("Invalid owner data, when creating land holding");
  }

  // Upload files if any
  let fileUrls = [];
  if (files.length > 0) {
    try {
      fileUrls = await uploadFiles(files);
    } catch (error) {
      console.error("Error uploading files", error);
      throw error;
    }
  }

  // Prepare land holding document
  const landHoldingDocument = landHolding.toMongoDocument();
  if (fileUrls.length > 0) {
    landHoldingDocument.fileUrls = fileUrls;
  }
  console.log("File URLS:", fileUrls);

  // Save landholding to database
  try {
    const result = await landHoldingsCollection.insertOne(landHoldingDocument);

    if (landHolding.owner) {
      const ownersCollection = getOwnersCollection();
      await ownersCollection.updateOne(
        { _id: landHolding.owner },
        { $inc: { totalLandHoldings: 1 } }
      );
    }
    console.log("Created land holding successfully", result);
    return { _id: result.insertedId, ...landHoldingDocument };
  } catch (error) {
    console.error("Error creating land holding", error);
    throw new Error("Failed to create land holding");
  }

  // console.log("Creating land holding with data from service", landHoldingData); // log incoming data
  // const landHolding = new LandHoldings(landHoldingData);
  // console.log("Instantiating LandHoldings with data:", landHolding); // log instantiated data

  // // validation
  // if (!landHolding.isValid()) {
  //   throw new Error("Invalid land holding data, when creating land holding");
  // }

  // // save
  // try {
  //   const landHoldingsCollection = getLandHoldingsCollection();
  //   const result = await landHoldingsCollection.insertOne(
  //     landHolding.toMongoDocument()
  //   );

  //   if (landHolding.owner) {
  //     const ownersCollection = getOwnersCollection();
  //     await ownersCollection.updateOne(
  //       { _id: landHolding.owner },
  //       { $inc: { totalLandHoldings: 1 } }
  //     );
  //   }
  //   console.log("Created land holding successfully", result); // log result
  //   return { _id: result.inwertedId, ...landHolding.toMongoDocument() };
  // } catch (error) {
  //   console.error("Error creating land holding service", error);
  //   throw new Error("Failed to create land holding");
  // }
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
export const updateLandHolding = async (
  landHoldingId,
  landHoldingData,
  files = null
) => {
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

  let fileUrls = [];

  if (files && files.length > 0) {
    try {
      fileUrls = await uploadFiles(files);
    } catch (error) {
      console.error("Error uploading file", error);
      throw error;
    }
  }

  const landHoldingDocument = landHolding.toMongoDocument();

  if (fileUrls.length > 0) {
    landHoldingDocument.fileUrls = fileUrls;
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
