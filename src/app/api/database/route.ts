import { NextResponse } from "next/server";
import {
  createTables,
  findUserById,
  findUserByEmail,
  addUser,
  userSignIn,
  getMessages,
  sendMessage,
  getUsernameByEmail,
  getRecents,
  getAllUsernames,
} from "./query";

export async function POST(req: Request) {
  const data = await req.json();

  if (data.action === "createTables") {
    await createTables();
    return NextResponse.json({ message: 'Success!' }, { status: 200 });
  }

  else if (data.action === "addUser") {
    const response = await addUser(data.email, data.password, data.username, data.firstName, data.lastName);
    if (response == "User already exists") {
      return NextResponse.json({ message: 'User already exists! Please sign in.' }, { status: 400 });
    }
    else if (response == "Username is already in use") {
      return NextResponse.json({ message: 'Username is already in use. Please choose another username.' }, { status: 400 });
    }
    return NextResponse.json({ message: "Registration successful." }, { status: 200 });
  }

  else if (data.action === "findUserById") {
    const response = await findUserById(data.id);
    if (response == null) {
      return NextResponse.json({ message: 'No user found! Please sign up.' }, { status: 400 });
    }
    return NextResponse.json({ message: response }, { status: 200 });
  }

  else if (data.action === "findUserByEmail") {
    const response = await findUserByEmail(data.email);
    if (response == null) {
      return NextResponse.json({ message: 'No user found! Please sign up.' }, { status: 400 });
    }
    return NextResponse.json({ message: response }, { status: 200 });
  }

  else if (data.action === "getUsernameByEmail") {
    const response = await getUsernameByEmail(data.email);
    if (response == null) {
      return NextResponse.json({ message: 'Error retrieving username.' }, { status: 400 });
    }
    return NextResponse.json({ message: response }, { status: 200 });
  }

  else if (data.action === "userSignIn") {
    const response = await userSignIn(data.email, data.password);
    if (response == "No user found") {
      return NextResponse.json({ message: 'No user found! Please sign up.' }, { status: 400 });
    }
    else if (response == "Incorrect password") {
      return NextResponse.json({ message: 'Incorrect password.' }, { status: 400 });
    }
    return NextResponse.json({ message: response }, { status: 200 });
  }

  else if (data.action === "getMessages") {
    const response = await getMessages(data.email, data.withUsername);
    if (response == null) {
      return NextResponse.json({ message: 'Error retrieving messages.' }, { status: 400 });
    }
    return NextResponse.json({ message: response }, { status: 200 });
  }

  else if (data.action === "getRecents") {
    const response = await getRecents(data.email);
    if (response == null) {
      return NextResponse.json({ message: 'Error retrieving recents.' }, { status: 400 });
    }
    return NextResponse.json({ message: response }, { status: 200 });
  }

  else if (data.action === "getAllUsernames") {
    const response = await getAllUsernames();
    if (response == null) {
      return NextResponse.json({ message: 'Error retrieving usernames.' }, { status: 400 });
    }
    return NextResponse.json({ message: response }, { status: 200 });
  }

  else if (data.action === "sendMessage") {
    const response = await sendMessage(data.email, data.withUsername, data.message);
    if (response == null) {
      return NextResponse.json({ message: 'An error occured.' }, { status: 400 });
    }
    return NextResponse.json({ message: response }, { status: 200 });
  }

  else {
    return NextResponse.json({ message: 'Not a valid action.' }, { status: 500 });
  }
}