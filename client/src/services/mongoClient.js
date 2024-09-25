import * as Realm from "realm-web";

// initialize MondoDB Realm app
const app = new Realm.App({ id: "data-thxentr" });

export const getMongoClient = () => {
  if (!app.currentUser) {
    throw new Error("Must be logged in to access MongoDB");
  }
  return app.currentUser.mongoClient("mongodb-atlas");
};

export default app;