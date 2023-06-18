const client = require("../database/connection");
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require('uuid');
import User from "./models/user";

export async function createTables(){
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
  
  export async function findUserById(id: string){
    try{
      const response = await client.query(`SELECT * FROM users WHERE id = $1`, [id]);
      if(response.rows.length > 0){
        return response.rows[0];
      }
      else{
        return null;
      }
    } catch(error){
      return error;
    }
  }
  
  export async function findUserByEmail(email: string){
    try{
      const response = await client.query(`SELECT * FROM users WHERE email = $1`, [email]);
      if(response.rows.length > 0){
        return response.rows[0];
      }
      else{
        return null;
      }
    } catch(error){
      return error;
    }
  }

  export async function userSignIn(email: string, password: string){
    try{
      const response = await client.query(`SELECT * FROM users WHERE email = $1`, [email]);
      if(response.rows.length > 0){
        const isPasswordValid = bcrypt.compareSync(password, response.rows[0].password);
        if(isPasswordValid){
          return response.rows[0];
        }
        else{
          return "Incorrect password";
        }
      }
      else{
        return "No user found";
      }
    } catch(error){
      return error;
    }
  }
  
  export async function addUser(
    email: string,
    password: string,
    username: string,
    firstName: string,
    lastName: string
  ) {
    try {
      const emails = await client.query('SELECT * FROM users WHERE email = $1', [email]);
      if (emails.rows.length > 0) {
        return "User already exists";
      }
      const usernames = await client.query('SELECT * FROM users WHERE username = $1', [username]);
      if (usernames.rows.length > 0) {
        return "Username is already in use";
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
        [newUser.id, newUser.username, newUser.email, '[]', '[]']
      );
      return "Success";
    } catch (error) {
      console.error('Error inserting data:', error);
      // handle the error or throw it for the calling function to handle
      throw error;
    }
  }