const client = require("../database/connection");
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require('uuid');
import User from "./models/user";

export async function createTables() {
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

export async function findUserById(id: string) {
  try {
    const response = await client.query(`SELECT * FROM users WHERE id = $1`, [id]);
    if (response.rows.length > 0) {
      return response.rows[0];
    }
    else {
      return null;
    }
  } catch (error) {
    return error;
  }
}

export async function findUserByEmail(email: string) {
  try {
    const response = await client.query(`SELECT * FROM users WHERE email = $1`, [email]);
    if (response.rows.length > 0) {
      return response.rows[0];
    }
    else {
      return null;
    }
  } catch (error) {
    return error;
  }
}

export async function userSignIn(email: string, password: string) {
  try {
    const response = await client.query(`SELECT * FROM users WHERE email = $1`, [email]);
    if (response.rows.length > 0) {
      const isPasswordValid = bcrypt.compareSync(password, response.rows[0].password);
      if (isPasswordValid) {
        return response.rows[0];
      }
      else {
        return "Incorrect password";
      }
    }
    else {
      return "No user found";
    }
  } catch (error) {
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

export async function getMessages(email: string, withUsername: string) {
  try {
    const response = await client.query(`SELECT messages FROM messagedata WHERE email = $1`, [email]);
    if (response.rows.length > 0) {
      interface UserMessage {
        from: string;
        to: string;
        content: string;
        timestamp: string;
      }
      let messages: UserMessage[] = [];
      messages = response.rows[0].messages;
      const filteredMessages = messages.filter((message) => (message.from === withUsername) || (message.to === withUsername));
      return filteredMessages;
    }
    else {
      return null;
    }
  } catch (error) {
    return error;
  }
}

export async function sendMessage(email: string, withUsername: string, message: string) {
  try {

    interface UserMessage {
      from: string;
      to: string;
      content: string;
      timestamp: string;
    }

    let userMessages: UserMessage[] = [];
    let recents: Array<string>;
    let username: string;

    try {
      const results = await client.query('SELECT messages, recents, username FROM messagedata WHERE email = $1', [email]);
      userMessages = results.rows[0].messages;
      recents = results.rows[0].recents;
      username = results.rows[0].username;
      const timestamp = new Date().toString();

      userMessages.push({
        from: username,
        to: withUsername,
        content: message,
        timestamp: timestamp,
      });

      const userString = JSON.stringify(userMessages);
      try {
        await client.query('UPDATE messagedata SET messages = $1 WHERE username = $2', [userString, username]);
      } catch (error) {
        console.error(error);
        return error;
      }
      if (withUsername != username) {
        let otherUserMessages: UserMessage[] = [];
        try {
          const results = await client.query('SELECT messages FROM messagedata WHERE username = $1', [withUsername]);
          otherUserMessages = results.rows[0].messages;
          // Adding user message and timestamp to the other user's conversation array
          otherUserMessages.push({
            from: username,
            to: withUsername,
            content: message,
            timestamp: timestamp,
          });

          const otherUserString = JSON.stringify(otherUserMessages);
          await client.query('UPDATE messagedata SET messages = $1 WHERE username = $2', [otherUserString, withUsername]);
        } catch (error) {
          console.error(error);
          return error;
        }
      }
      // Add user to the contacts list
      if (recents.findIndex(recent => recent === withUsername) === -1) {
        try {
          recents.push(withUsername);
          const recentsString = JSON.stringify(recents);
          await client.query('UPDATE messagedata SET recents = $1 WHERE username = $2', [recentsString, username]);
        } catch (error) {
          console.error(error);
          return error;
        }
      }

      // Add user to the other contacts list
      let otherRecents: Array<string>;
      try {
        const results = await client.query('SELECT recents FROM messagedata WHERE username = $1', [withUsername]);
        otherRecents = results.rows[0].recents;
        if (otherRecents.findIndex(recent => recent === username) === -1) {
          otherRecents.push(username);
          const otherRecentsString = JSON.stringify(otherRecents);
          await client.query('UPDATE messagedata SET recents = $1 WHERE username = $2', [otherRecentsString, withUsername]);
        }
      } catch (error) {
        console.error(error);
        return error;
      }

      // Send the completion response to the client
      return "Success";

    } catch (error) {
      console.error(error);
      return error;
    }
  } catch (error) {
    return error;
  }
}