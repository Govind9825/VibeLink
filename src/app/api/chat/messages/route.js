import { connectToDatabase } from '../../../../utils/mongodb';
import SentMessage from '../../../../utils/models/Message'; // Adjust the path if necessary

export async function GET(req) {
  const email = req.headers.get('email'); 
  const useremail = req.headers.get('useremail'); 

  // Validate email and useremail
  if (!email || !useremail) {
    return new Response(
      JSON.stringify({ status: 'error', message: 'Email or useremail is missing' }),
      { status: 400 }
    );
  }

  try {
    await connectToDatabase();
    console.log("Database connected successfully."); // Log connection success

    const sentMessages = await SentMessage.find({ from: email, to: useremail }).sort({ time: 1 });
    const receivedMessages = await SentMessage.find({ from: useremail, to: email }).sort({ time: 1 });

    const allMessages = [...sentMessages, ...receivedMessages];
    allMessages.sort((a, b) => new Date(a.time) - new Date(b.time)); // Sort all messages by time

    return new Response(JSON.stringify(allMessages), { status: 200 });
  } catch (err) {
    console.error("Error fetching messages:", err); // Log the error
    return new Response(JSON.stringify({ status: 'error', message: 'Error fetching messages' }), { status: 500 });
  }
}
