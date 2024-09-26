import { getMongoClient } from "./mongoClient";
import { Owner } from "../models/Owner";
import * as Realm from "realm-web";


const ownersCollection = getMongoClient().db("PCGDB").collection("owners");

// create a new owner
export const createOwner = async (ownerData) => {
  const owner = new Owner(ownerData);

  // validation
  if (!owner.isValid()) {
    throw new Error("Invalid owner data");
  }

  // save
  try {
    await ownersCollection.insertOne(owner.toMongoDocument());
  } catch (error) {
    console.error("Error creating owner", error);
    throw new Error("Failed to create owner");
  }
};

// fetch all owners
export const fetchOwners = async () => {
  try {
    if (!app.currentUser) {
      throw new Error("Must be logged in to access MongoDB");
    }

    return await ownersCollection.find();
  } catch (error) {
    console.error("Error fetching owners", error);
    throw error;
  }
};

// Delete owner
export const deleteOwner = async (ownerId) => {
  return await ownersCollection.deleteOne({ _id: new Realm.BSON.ObjectId(ownerId) });
};
