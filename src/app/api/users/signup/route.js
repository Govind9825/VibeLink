// /src/app/api/users/signup/route.js
import { connectToDatabase } from '../../../../utils/mongodb';
import User from '../../../../utils/models/user';

export async function POST(req) {
  try {
    const { email, password, username } = await req.json();
    await connectToDatabase();

    const newUser = new User({ email, password, username });
    await newUser.save();

    return new Response(JSON.stringify({ status: 'success', message: 'User created successfully' }), { status: 201 });
  } catch (err) {
    return new Response(JSON.stringify({ status: 'error', message: 'Error creating user' }), { status: 500 });
  }
}
