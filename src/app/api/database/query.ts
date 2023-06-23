import Database from './connection';
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require('uuid');
import User from "./models/user";
const crypto = require('crypto');
const ALGO = process.env.ALGO;
const ENC = process.env.ENC;
const IV = process.env.IV;

export async function createTables() {
  const db = Database.getInstance();
  const client = db.getPool();
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
  const db = Database.getInstance();
  const client = db.getPool();
  try {
    const response = await client.query(`SELECT username, firstName, lastName FROM users WHERE id = $1`, [id]);
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
  const db = Database.getInstance();
  const client = db.getPool();
  try {
    const response = await client.query(`SELECT username, firstName, lastName FROM users WHERE email = $1`, [email]);
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

export async function findFullUser(email: string) {
  const db = Database.getInstance();
  const client = db.getPool();
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

export async function getAllUsernames() {
  const db = Database.getInstance();
  const client = db.getPool();
  try {
    const response = await client.query(`SELECT username FROM users`);
    if (response.rows.length > 0) {
      return response.rows;
    }
    else {
      return null;
    }
  } catch (error) {
    return error;
  }
}

export async function getUsernameByEmail(email: string) {
  const db = Database.getInstance();
  const client = db.getPool();
  try {
    const response = await client.query(`SELECT username FROM users WHERE email = $1`, [email]);
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
  const db = Database.getInstance();
  const client = db.getPool();
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
  const db = Database.getInstance();
  const client = db.getPool();
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
  if (!ALGO || !ENC || !IV) {
    throw new Error('Missing environment variables: ALGO, ENC, IV');
  }
  const db = Database.getInstance();
  const client = db.getPool();
  try {

    const response = await client.query(`SELECT messages FROM messagedata WHERE email = $1`, [email]);
    if (response.rows.length > 0) {
      interface UserMessage {
        from: string;
        to: string;
        content: string;
        timestamp: string;
        read: boolean;
      }
      let messages: UserMessage[] = [];
      messages = response.rows[0].messages;
      const filteredMessages = messages.filter((message) => (message.from === withUsername) || (message.to === withUsername));
      const decryptedMessages = filteredMessages.map((message) => ({
        ...message,
        content: decrypt(message.content, ENC, IV),
      }));
      return decryptedMessages;
    }
    else {
      return null;
    }
  } catch (error) {
    return error;
  }
}

export async function getRecents(email: string) {
  const db = Database.getInstance();
  const client = db.getPool();
  try {
    const response = await client.query(`SELECT recents FROM messagedata WHERE email = $1`, [email]);
    if (response.rows.length > 0) {
      interface Contact {
        firstName: string;
        lastName: string;
        username: string;
      }
      let recents: Contact[] = [];
      recents = response.rows[0].recents;
      return recents;
    }
    else {
      return null;
    }
  } catch (error) {
    return error;
  }
}

export async function changePassword(email: string, password: string) {
  const db = Database.getInstance();
  const client = db.getPool();
  try {
    const response = await client.query(`SELECT recents FROM messagedata WHERE email = $1`, [email]);
    if (response.rows.length > 0) {
      interface Contact {
        firstName: string;
        lastName: string;
        username: string;
      }
      let recents: Contact[] = [];
      recents = response.rows[0].recents;
      return recents;
    }
    else {
      return null;
    }
  } catch (error) {
    return error;
  }
}

export async function setMessagesRead(email: string, withUsername: string) {
  const db = Database.getInstance();
  const client = db.getPool();
  try {
    interface Contact {
      firstName: string;
      lastName: string;
      username: string;
      unreadMessages: boolean;
    }    
    const results = await client.query('SELECT messages, recents, username FROM messagedata WHERE email = $1', [email]);
    const recents: Contact[] = results.rows[0].recents;
    const username = results.rows[0].username;

    const index = recents.findIndex(recent => recent.username === withUsername);
    recents[index].unreadMessages = false;
    const recentString = JSON.stringify(recents);
    try {
      await client.query('UPDATE messagedata SET recents = $1 WHERE username = $2', [recentString, username]);
    } catch (error) {
      console.error(error);
      return error;
    }
    return true;
  } catch (error) {
    return error;
  }
}

export async function sendMessage(email: string, withUsername: string, message: string) {
  const db = Database.getInstance();
  const client = db.getPool();
  try {

    interface UserMessage {
      from: string;
      to: string;
      content: string;
      timestamp: string;
      read: boolean;
    }

    interface Contact {
      firstName: string;
      lastName: string;
      username: string;
      unreadMessages: boolean;
    }

    let userMessages: UserMessage[] = [];
    let recents: Contact[] = [];
    let username: string;

    try {
      const results = await client.query('SELECT messages, recents, username FROM messagedata WHERE email = $1', [email]);
      userMessages = results.rows[0].messages;
      recents = results.rows[0].recents;
      username = results.rows[0].username;
      const timestamp = new Date().toString();

      const encryptedMessage = encrypt(message).encrypted;

      userMessages.push({
        from: username,
        to: withUsername,
        content: encryptedMessage,
        timestamp: timestamp,
        read: false,
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
          const otherEncryptedMessage = encrypt(message).encrypted;

          otherUserMessages.push({
            from: username,
            to: withUsername,
            content: otherEncryptedMessage,
            timestamp: timestamp,
            read: false,
          });

          const otherUserString = JSON.stringify(otherUserMessages);
          await client.query('UPDATE messagedata SET messages = $1 WHERE username = $2', [otherUserString, withUsername]);
        } catch (error) {
          console.error(error);
          return error;
        }
      }

      // Add user to the contacts list
      if (recents.findIndex(recent => recent.username === withUsername) === -1) {
        try {
          recents.push({
            firstName: withUsername,
            lastName: withUsername,
            username: withUsername,
            unreadMessages: true,
          });
          const recentsString = JSON.stringify(recents);
          await client.query('UPDATE messagedata SET recents = $1 WHERE username = $2', [recentsString, username]);
        } catch (error) {
          console.error(error);
          return error;
        }
      }

      // Add user to the other contacts list
      let otherRecents: Contact[] = [];
      try {
        const results = await client.query('SELECT recents FROM messagedata WHERE username = $1', [withUsername]);
        otherRecents = results.rows[0].recents;
        if (otherRecents.findIndex(recent => recent.username === username) === -1) {
          otherRecents.push({
            firstName: username,
            lastName: username,
            username: username,
            unreadMessages: true,
          });
          const otherRecentsString = JSON.stringify(otherRecents);
          await client.query('UPDATE messagedata SET recents = $1 WHERE username = $2', [otherRecentsString, withUsername]);
        }
        else {
          const index = otherRecents.findIndex(recent => recent.username === username);
          otherRecents[index].unreadMessages = true;
          const otherRecentsString = JSON.stringify(otherRecents);
          await client.query('UPDATE messagedata SET recents = $1 WHERE username = $2', [otherRecentsString, withUsername]);
        }
      } catch (error) {
        console.error(error);
        return error;
      }
      return "Success";

    } catch (error) {
      console.error(error);
      return error;
    }
  } catch (error) {
    return error;
  }
}

const encrypt = (text: string) => {
  if (!ALGO || !ENC || !IV) {
    throw new Error('Missing environment variables: ALGO, ENC, IV');
  }
  let cipher = crypto.createCipheriv(ALGO, Buffer.from(ENC, 'hex'), Buffer.from(IV, 'hex'));
  let encrypted = cipher.update(text, "utf8", "base64");
  encrypted += cipher.final("base64");
  return {
    encrypted: encrypted,
    ENC: ENC,
    IV: IV
  };
};

const decrypt = (text: string, ENC: string, IV: string) => {
  let decipher = crypto.createDecipheriv(ALGO, Buffer.from(ENC, 'hex'), Buffer.from(IV, 'hex'));
  let decrypted = decipher.update(text, "base64", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
};