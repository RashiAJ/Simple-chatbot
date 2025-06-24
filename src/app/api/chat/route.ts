import { xai } from '@ai-sdk/xai';
import { generateText } from 'ai';
import { XAISettings } from '../../../config';

export async function POST(request: Request) {
  try {
    const { messages } = await request.json();
    
    // Extract the last user message
    const lastMessage = messages[messages.length - 1]?.content || '';
    
    // Generate response using xAI
    const result = await generateText({
      model: xai('grok-3-mini-beta'),
      system: 'You are a helpful assistant. Keep your responses concise and to the point.',
      messages: [
        {
          role: 'user',
          content: lastMessage
        }
      ],
      ...XAISettings
    });

    return new Response(JSON.stringify({ 
      reply: result.text || 'No response from AI'
    }), {
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (error) {
    console.error('Error:', error)
    return new Response(JSON.stringify({ 
      error: 'An error occurred' 
    }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}
