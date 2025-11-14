import { config } from 'dotenv';
config();

import '@/ai/flows/generate-conversation-starters.ts';
import '@/ai/flows/suggest-profile-improvements.ts';
import '@/ai/flows/provide-safe-dating-guidance.ts';
import '@/ai/flows/analyze-personality-from-text.ts';
import '@/ai/flows/detect-risky-behavior.ts';