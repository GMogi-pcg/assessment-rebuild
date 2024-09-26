import  { getMongoClient } from './mongoClient';
import { Owner } from '../models/Owner';

const ownersCollection = getMongoClient().db("PCGDB").collection("owners");

// create a new owner
export const createOwner = async (ownerData) => {
  const owner = new Owner(ownerData);

  // validation
  if (!owner.isValid()) {
    throw new Error("Invalid owner data");
  }

  // save
  await ownersCollection.insertOne(owner.toMongoDocument());
};

// fetch all owners
export const fetchOwners = async () => {
  return await ownersCollection.find();
};


// Delete owner
export const deleteOwner = async (ownerId) => {
  return await ownersCollection.deleteOne({ _id: ownerId });
};