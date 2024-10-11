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
  const ownersCollection = getOwnersCollection();

  // logic for checking if owner with same name and address exists
  const existingOwner = await ownersCollection.findOne({
    name: ownerData.name,
    address: ownerData.address,
  });

  if (existingOwner) {
    throw new Error("An owner with same name and address already exists");
  }

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
  console.log("File URLS:", fileUrls);
  // Save owner in MongoDB
  try {
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

// UPDATE OWNER
export const updateOwner = async (ownerId, ownerData, files = null) => {
  const ownersCollection = getOwnersCollection();

  // logic for checking if owner with same name and address exists
  const existingOwner = await ownersCollection.findOne({
    name: ownerData.name,
    address: ownerData.address,
  });
  console.log("TEST",existingOwner.name)
  // if (existingOwner) {
  //   throw new Error("An owner with same name and address already exists");
  // }

  const owner = new Owner(ownerData);
  console.log(owner)
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
    return { _id: ownerId, ...ownerDocument };
  } catch (error) {
    console.error("Error updating owner", error);
    throw new Error("Failed to update owner");
  }
};

// Delete owner
export const deleteOwner = async (ownerId) => {
  try {
    const mongoClient = getMongoClient();
    const ownersCollection = getOwnersCollection();
    const landholdingsCollection = mongoClient
      .db("PCGDB")
      .collection("landholdings");

    const objectIdOwnerId = new Realm.BSON.ObjectId(ownerId);

    const result = await landholdingsCollection.deleteMany({
      owner: objectIdOwnerId,
    });
    console.log("Landholdings deletion result:", result);

    return await ownersCollection.deleteOne({
      _id: objectIdOwnerId,
    });
  } catch (error) {
    console.error("Error deleting owner", error);
    throw new Error("Failed to delete owner");
  }
};

// export const deleteFile = async (ownerId, fileUrl) => {
//   try {
//     const ownersCollection = getOwnersCollection();
//      // Check if owner exists
//     console.log(`Looking for owner with ID ${ownerId}`);
//     const owner = await ownersCollection.findOne({
//       _id: new Realm.BSON.ObjectId(ownerId),
//     });

//     if (!owner) {
//       console.error(`Owner with ID ${ownerId} not found`);
//       throw new Error(`Owner with ID ${ownerId} not found`);
//     }

//     console.log("Owner found:", owner); // Debug

//     const updatedFileUrls = owner.fileUrls.filter((fileUrlArray) => {
//       return fileUrlArray[0] !== fileUrl
//     });

//     if (updatedFileUrls.length === owner.fileUrls.length) {
//       console.log("No changes to file URLs, the file was not found in the array.");
//       return
//     }

//     const updateResult = await ownersCollection.updateOne(
//       { _id: new Realm.BSON.ObjectId(ownerId) },
//       { $set: { fileUrls: updatedFileUrls } }
//     )

//     console.log("MongoDB update result:", updateResult);

//     console.log(`File ${fileUrl} deleted from owner ${ownerId}`);
//     return true
//   } catch (error) {
//     console.error("Error deleting file", error);
//     throw new Error("Failed to delete file");
//   }
// }
