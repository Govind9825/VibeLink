// /src/app/api/chat/addChat/route.js
import { connectToDatabase } from '../../../../utils/mongodb';
import Connection from '../../../../utils/models/connection';

export async function POST(req) {
  try {
    // Extracting email from headers using the 'get' method
    const email = req.headers.get('email'); 
    const useremail = req.headers.get('useremail'); // Extract the useremail from headers

    if (!email || !useremail) {
      return new Response(
        JSON.stringify({ status: 'error', message: 'Both email and useremail are required' }),
        { status: 400 }
      );
    }

    await connectToDatabase();

    // Check if the connection already exists
    const existingConnection = await Connection.findOne({
      user_email: email,
      connected_user_email: useremail,
    });

    if (existingConnection) {
      return new Response(
        JSON.stringify({ status: 'error', message: 'Connection already exists' }),
        { status: 400 }
      );
    }

    // Create new connection
    const newConnection = new Connection({ user_email: email, connected_user_email: useremail });
    await newConnection.save();

    return new Response(
      JSON.stringify({ status: 'success', message: 'Chat connection created' }),
      { status: 201 }
    );
  } catch (err) {
    console.error("Error creating chat connection:", err);
    return new Response(
      JSON.stringify({ status: 'error', message: 'Error creating chat connection' }),
      { status: 500 }
    );
  }
}
