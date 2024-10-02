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

// create a new owner
export const createOwner = async (ownerData, files = []) => {
  const owner = new Owner(ownerData);

  // Validate owner
  if (!owner.isValid()) {
    throw new Error("Invalid owner data, when creating owner");
  }

  // Upload files if any
  let fileUrls = [];
  if (files.length > 0) {
    try {
      fileUrls = await uploadFiles(files); // Upload all files at once
    } catch (error) {
      console.error("Error uploading files", error);
      throw error;
    }
  }

  // Prepare the owner document
  const ownerDocument = owner.toMongoDocument();
  if (fileUrls.length > 0) {
    ownerDocument.fileUrls = fileUrls;
  }
  console.log('File URLS:',fileUrls);
  // Save owner in MongoDB
  try {
    const ownersCollection = getOwnersCollection();
    const result = await ownersCollection.insertOne(ownerDocument);
    return { _id: result.insertedId, ...ownerDocument };
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
export const updateOwner = async (ownerId, ownerData, files = null) => {
  const owner = new Owner(ownerData);

  // validation
  if (!owner.isValid()) {
    throw new Error("Invalid owner data, when updating owner");
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

  const ownerDocument = owner.toMongoDocument();

  if (fileUrls.length > 0) {
    ownerDocument.fileUrls = fileUrls;
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
