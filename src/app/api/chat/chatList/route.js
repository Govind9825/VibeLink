// /src/app/api/chat/chatList/route.js
import { connectToDatabase } from '../../../../utils/mongodb';
import Connection from '../../../../utils/models/connection';
import User from '../../../../utils/models/user';

export async function GET(req) {
  const email = req.headers.get('email');
  
  try {
    await connectToDatabase();
    const connections = await Connection.find({ user_email: email });
    const connectedUserEmails = connections.map(conn => conn.connected_user_email);
    const users = await User.find({ email: { $in: connectedUserEmails } }, { username: 1, email: 1 });
    
    return new Response(JSON.stringify(users), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ status: 'error', message: 'Error fetching users' }), { status: 500 });
  }
}
