import { WithId } from 'mongodb';
import { NextResponse } from 'next/server';
import clientPromise from '../../lib/mongodb';

// Structure of our audio data
interface AudioData {
    language: string;
    url: string;
}

// Store the initial data
const initialAudioData: AudioData[] = [
    {
        language: "english",
        url: "/english.mp3"
    },
    {
        language: "arabic",
        url: "/arabic.mp3"
    }
];

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const lang = searchParams.get('lang');

    if (!lang) {
        return NextResponse.json({ error: 'Language parameter is missing' }, { status: 400 });
    }

    try {
        const client = await clientPromise;
        const db = client.db("elevenlabsDB");
        const collection = db.collection<AudioData>('audioFiles');

        // First, let's seed the data if collection is empty
        const count = await collection.countDocuments();
        if (count === 0) {
            console.log('Collection is empty, inserting initial data...');
            await collection.insertMany(initialAudioData);
            console.log('Initial data inserted successfully');
        }

        // Find the audio file for the requested language
        let audioFile: WithId<AudioData> | null = await collection.findOne({ language: lang.toLowerCase() });

        if (audioFile) {
            return NextResponse.json({ url: audioFile.url });
        } else {
            return NextResponse.json({ error: `Audio for ${lang} not found` }, { status: 404 });
        }

    } catch (e) {
        console.error('Database error:', e);
        return NextResponse.json({ error: 'Failed to communicate with the database' }, { status: 500 });
    }
}