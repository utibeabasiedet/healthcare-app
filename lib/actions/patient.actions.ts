"use server";

import { ID,  Query } from "node-appwrite";

import {
  BUCKET_ID,
  DATABASE_ID,
  ENDPOINT,
  PATIENT_COLLECTION_ID,
  PROJECT_ID,
  databases,
  storage,
  users,
} from "../appwrite.config";
import { parseStringify } from "../utils";

// CREATE APPWRITE USER
export const createUser = async (user: CreateUserParams) => {
  console.log("Trying to create user...");

  try {
    // Attempt to create a new user
    const newuser = await users.create(
      ID.unique(), // Generate a unique ID for the user
      user.email,
      user.phone,
      undefined, // Assuming this is an optional parameter, adjust if needed
      user.name
    );

    console.log("New user created:", newuser);
    
    // Return the parsed stringified version of the new user object
    return parseStringify(newuser);
  } catch (error: any) {
    // Check if the error is due to existing user (409 conflict)
    if (error && error.code === 409) {
      // List users with the given email to find the existing user
      const existingUser = await users.list([
        Query.equal("email", [user.email]),
      ]);

      console.log("Existing user found:", existingUser.users[0]);
      
      // Return the first user found with the given email
      return existingUser.users[0];
    }

    // Log any other errors that might occur during user creation
    console.error("An error occurred while creating a new user:", error);
    throw error; // Propagate the error back to the calling function if necessary
  }
};

// GET USER
export const getUser = async (userId: string) => {
  try {
    const user = await users.get(userId);
    console.log('user', user)

    return parseStringify(user);
  } catch (error) {
    console.error(
      "An error occurred while retrieving the user details:",
      error
    );
  }
};

// REGISTER PATIENT
export const registerPatient = async ({
  
  ...patient
}: RegisterUserParams) => {
  try {
    // Upload file ->  // https://appwrite.io/docs/references/cloud/client-web/storage#createFile
    // let file;
    // if (identificationDocument) {
    //   const inputFile =
    //     identificationDocument &&
    //     InputFile.Buffer(
    //       identificationDocument?.get("blobFile") as Blob,
    //       identificationDocument?.get("fileName") as string
    //     );

      // file = await storage.createFile(BUCKET_ID!, ID.unique(), inputFile);
    // }

    // Create new patient document -> https://appwrite.io/docs/references/cloud/server-nodejs/databases#createDocument
    const newPatient = await databases.createDocument(
      DATABASE_ID!,
      PATIENT_COLLECTION_ID!,
      ID.unique(),
      {
        // identificationDocumentId: file?.$id ? file.$id : null,
        // identificationDocumentUrl: file?.$id
        //   ? `${ENDPOINT}/storage/buckets/${BUCKET_ID}/files/${file.$id}/view??project=${PROJECT_ID}`
        //   : null,
        ...patient,
      }
    );

    return parseStringify(newPatient);
  } catch (error) {
    console.error("An error occurred while creating a new patient:", error);
  }
};

// GET PATIENT
export const getPatient = async (userId: string) => {
  try {
    const patients = await databases.listDocuments(
      DATABASE_ID!,
      PATIENT_COLLECTION_ID!,
      [Query.equal("userId", [userId])]
    );

    return parseStringify(patients.documents[0]);
  } catch (error) {
    console.error(
      "An error occurred while retrieving the patient details:",
      error
    );
  }
};
