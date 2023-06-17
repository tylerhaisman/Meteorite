import { NextResponse } from "next/server";
const client = require("../database/connection");
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require('uuid');
import User from "./models/user";

export async function POST(req: Request) {
  const data = await req.json();
  if (data.action === "createTables") {
    await createTables();
    return NextResponse.json({ message: 'Success!' }, { status: 200 });
  } else if (data.action === "addUser") {
    const response = await addUser(data.email, data.password, data.username, data.firstName, data.lastName);
    if(response == "User already exists"){
      return NextResponse.json({ message: 'User already exists! Please sign in.' }, { status: 400 });
    }
      return NextResponse.json({ message: "Registration successful."}, { status: 200 });
  } else if (data.action === "findUserById") {
    const response = await findUserById(data.id);
    if(response == "No user found"){
      return NextResponse.json({ message: 'No user found! Please sign up.' }, { status: 400 });
    }
    return NextResponse.json({ message: response}, { status: 200 });
  } else if (data.action === "findUserByEmail") {
    const response = await findUserByEmail(data.email);
    if(response == "No user found"){
      return NextResponse.json({ message: 'No user found! Please sign up.' }, { status: 400 });
    }
    return NextResponse.json({ message: response}, { status: 200 });
  } else {
    return NextResponse.json({ message: 'Not a valid action.' }, { status: 500 });
  }
}
async function createTables(){
  // await client.query('DROP TABLE users;');
  // await client.query('DROP TABLE messagedata;');
    const createUsers = `
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(255),
        username VARCHAR(100) NOT NULL,
        email VARCHAR(100) NOT NULL,
        password VARCHAR(255),
        firstName VARCHAR(255),
        lastName VARCHAR(255),
        isAdmin boolean
      );
    `;
    await client.query(createUsers);
    const createMessageData = `
      CREATE TABLE IF NOT EXISTS messagedata (
        id VARCHAR(255),
        username VARCHAR(100) NOT NULL,
        email VARCHAR(100) NOT NULL,
        recents JSON,
        messages JSON
      );
    `;
    await client.query(createMessageData);
    // await client.end();
}

async function findUserById(id: string){
  try{
    const response = await client.query(`SELECT id, username, email, firstName, lastName, isAdmin FROM users WHERE id = $1`, [id]);
    if(response.rows.length > 0){
      return response.rows[0];
    }
    else{
      return "No user found";
    }
  } catch(error){
    return error;
  }
}

async function findUserByEmail(email: string){
  try{
    const response = await client.query(`SELECT id, username, email, firstName, lastName, isAdmin FROM users WHERE email = $1`, [email]);
    if(response.rows.length > 0){
      return response.rows[0];
    }
    else{
      return "No user found";
    }
  } catch(error){
    return error;
  }
}

async function addUser(
  email: string,
  password: string,
  username: string,
  firstName: string,
  lastName: string
) {
  try {
    const response = await client.query('SELECT * FROM users WHERE email = $1', [email]);
    if (response.rows.length > 0) {
      return "User already exists";
    }
    const encryptedPassword = await bcrypt.hash(password, 10); // Generate salt using bcrypt
    const uuid = uuidv4();

    const newUser = new User({
      id: uuid,
      username,
      email,
      password: encryptedPassword,
      firstName,
      lastName,
      isAdmin: false,
    });

    const values = [
      newUser.id,
      newUser.username,
      newUser.email,
      newUser.password,
      newUser.firstName,
      newUser.lastName,
      newUser.isAdmin,
    ];

    await client.query(
      'INSERT INTO users (id, username, email, password, firstName, lastName, isAdmin) VALUES ($1, $2, $3, $4, $5, $6, $7)',
      values
    );
    await client.query(
      'INSERT INTO messagedata (id, username, email, recents, messages) VALUES ($1, $2, $3, $4, $5)',
      [newUser.id, newUser.email, newUser.username, '[]', '[]']
    );
    return response;
  } catch (error) {
    console.error('Error inserting data:', error);
    // handle the error or throw it for the calling function to handle
    throw error;
  }
}