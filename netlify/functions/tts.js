exports.handler = async function(event, context) {
  // Only allow POST
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      },
      body: ''
    };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { text, voice_id, language } = JSON.parse(event.body);

    if (!text || text.length > 5000) {
      return { statusCode: 400, body: 'Invalid text' };
    }

    // Voice ID: use provided or default to Iordanis (Greek Male)
    const voiceId = voice_id || 'KDImLuG6RkuyuX5httC7';

    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
      {
        method: 'POST',
        headers: {
          'xi-api-key': process.env.ELEVENLABS_API_KEY,
          'Content-Type': 'application/json',
          'Accept': 'audio/mpeg'
        },
        body: JSON.stringify({
          text: text,
          model_id: 'eleven_multilingual_v2',
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75,
            style: 0.3,
            use_speaker_boost: true
          }
        })
      }
    );

    if (!response.ok) {
      const err = await response.text();
      console.error('ElevenLabs error:', err);
      return { statusCode: response.status, body: 'TTS error: ' + err };
    }

    // Convert audio to base64 to send back
    const audioBuffer = await response.arrayBuffer();
    const base64Audio = Buffer.from(audioBuffer).toString('base64');

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        audio: base64Audio,
        contentType: 'audio/mpeg'
      })
    };

  } catch (error) {
    console.error('Function error:', error);
    return { statusCode: 500, body: 'Server error: ' + error.message };
  }
};
