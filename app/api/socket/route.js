// app/api/socket/route.js
import Pusher from 'pusher';

// Initialize Pusher with your credentials
const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID, 
  key: process.env.PUSHER_KEY, 
  secret: process.env.PUSHER_SECRET, 
  cluster: "mt1",
  useTLS: true,
});

export async function POST(req) {
  const { message } = await req.json(); // Parse the incoming JSON body

  // Trigger an event on Pusher
  try {
    await pusher.trigger('my-channel', 'my-event', {
      message,
    });

    return new Response('Message sent', { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response('Failed to send message', { status: 500 });
  }
}
