// /src/app/api/chat/addUsers/route.js
import { connectToDatabase } from '../../../../utils/mongodb';
import Connection from '../../../../utils/models/connection';
import User from '../../../../utils/models/user';

export async function GET(req) {
  try {
    // Extract email from headers
    const email = req.headers.get('email'); // Use 'get' for header extraction

    if (!email) {
      return new Response(JSON.stringify({ status: 'error', message: 'Email is required in the headers' }), { status: 400 });
    }

    await connectToDatabase();

    // Get the list of users that the current user is connected to
    const connectedUsers = await Connection.find({ user_email: email }).select('connected_user_email');

    // Extract emails of connected users
    const connectedEmails = connectedUsers.map((user) => user.connected_user_email);

    // Find users who are not connected to the current user and exclude the current user
    const usersToAdd = await User.find({
      email: { $nin: [...connectedEmails, email] },
    }).sort({ created_at: 1 });

    return new Response(JSON.stringify(usersToAdd), { status: 200 });
  } catch (error) {
    console.error("Error fetching users:", error);
    return new Response(JSON.stringify({ status: 'error', message: 'Error fetching users' }), { status: 500 });
  }
}
