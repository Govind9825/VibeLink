// /src/app/api/users/login/route.js
import { connectToDatabase } from '../../../../utils/mongodb';
import User from '@/utils/models/user';

export async function POST(req) {
  try {
    const { email, password } = await req.json();
    await connectToDatabase();

    const user = await User.findOne({ email, password });
    if (user) {
      return new Response(JSON.stringify({ status: 'success', username: user.username }), { status: 200 });
    } else {
      return new Response(JSON.stringify({ status: 'error', message: 'Invalid email or password' }), { status: 401 });
    }
  } catch (err) {
    return new Response(JSON.stringify({ status: 'error', message: 'Something went wrong' }), { status: 500 });
  }
}
