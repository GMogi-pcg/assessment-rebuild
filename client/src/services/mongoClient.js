import * as Realm from "realm-web";

// initialize MondoDB Realm app
const app = new Realm.App({ id: "data-thxentr" });

export const mongoClient = app.currentUser?.mongoClient("mongodb-atlas");

export const loginUser = async (email, password) => {
  await app.logIn(Realm.Credentials.emailPassword(email, password));
};

export const logoutUser = async () => {
  await app.currentUser?.logOut();
}