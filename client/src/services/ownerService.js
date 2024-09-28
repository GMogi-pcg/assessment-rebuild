import { getMongoClient } from "./mongoClient";
import { Owner } from "../models/Owner";
import * as Realm from "realm-web";
import app from "./mongoClient";

export const getOwnersCollection = () => {
  const mongoClient = getMongoClient();
  if (!mongoClient) {
    throw new Error("Must be logged in to access MongoDB");
  }
  return mongoClient.db("PCGDB").collection("owners");
};

// create a new owner
export const createOwner = async (ownerData) => {
  const owner = new Owner(ownerData);

  // validation
  if (!owner.isValid()) {
    throw new Error("Invalid owner data, when creating owner");
  }

  // save
  try {
    const ownersCollection = getOwnersCollection();
    const result = await ownersCollection.insertOne(owner.toMongoDocument());

    return { _id: result.insertedId, ...owner.toMongoDocument() };
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

    const ownersCollection = getOwnersCollection();
    const owners = await ownersCollection.find();

    return owners.filter((owner) => owner && owner._id);
  } catch (error) {
    console.error("Error fetching owners", error);
    throw error;
  }
};

// Update owner
export const updateOwner = async (ownerId, ownerData) => {
  const owner = new Owner(ownerData);

  // validation
  if (!owner.isValid()) {
    throw new Error("Invalid owner data, when updating owner");
  }

  // save
  try {
    const ownersCollection = getOwnersCollection();
    await ownersCollection.updateOne(
      { _id: new Realm.BSON.ObjectId(ownerId) },
      { $set: owner.toMongoDocument() }
    );
    return { _id: ownerId, ...owner.toMongoDocument() };
  } catch (error) {
    console.error("Error updating owner", error);
    throw new Error("Failed to update owner");
  }
};

// Delete owner
export const deleteOwner = async (ownerId) => {
  try {
    const ownersCollection = getOwnersCollection();
    return await ownersCollection.deleteOne({
      _id: new Realm.BSON.ObjectId(ownerId),
    });
  } catch (error) {
    console.error("Error deleting owner", error);
    throw new Error("Failed to delete owner");
  }

};
