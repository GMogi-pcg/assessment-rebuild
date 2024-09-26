import * as Realm from "realm-web";
import app from "./mongoClient";

// log in user
export const loginUser = async (email, password) => {
  const credentials = Realm.Credentials.emailPassword(email, password);
  try {
    const user = await app.logIn(credentials);
    console.log("Successfully logged in!", user);
    return user;
  } catch (error) {
    console.error("Failed to log in", error);
    throw new Error("Failed to log in. Please check your email and password and try again.");
  }
};

// register user
export const registerUser = async (email, password) => {
  try {
    await app.emailPasswordAuth.registerUser({email, password});
    console.log("Successfully registered!");
  } catch (error) {
    console.error("Failed to register", error);
    throw new Error("Failed to register. Please try again.");
  }
};

export const logoutUser = async () => {
  if (app.currentUser) {
    try {
      await app.currentUser.logOut();
      console.log("Successfully logged out!");
    } catch (error) {
      console.error("Failed to log out", error);
      throw new Error("Failed to log out. Please try again.");
    }
  } else {
    console.log("No user logged in.");
  }
};