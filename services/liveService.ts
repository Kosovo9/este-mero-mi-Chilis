import { GoogleGenAI, LiveServerMessage, Modality } from "@google/genai";
import { LIVE_MODEL_NAME } from "../constants";

// Types for audio processing
interface AudioState {
    inputContext: AudioContext;
    outputContext: AudioContext;
    inputSource?: MediaStreamAudioSourceNode;
    processor?: ScriptProcessorNode;
    outputNode: GainNode;
    nextStartTime: number;
    sources: Set<AudioBufferSourceNode>;
}

let audioState: AudioState | null = null;
let currentSession: any = null;

// PCM Encoding
const encodePCM = (data: Float32Array) => {
    const l = data.length;
    const int16 = new Int16Array(l);
    for (let i = 0; i < l; i++) {
        int16[i] = data[i] * 32768;
    }
    let binary = '';
    const bytes = new Uint8Array(int16.buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
};

// PCM Decoding
const decodeAudioData = async (
    base64String: string,
    ctx: AudioContext
): Promise<AudioBuffer> => {
    const binaryString = atob(base64String);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    
    const dataInt16 = new Int16Array(bytes.buffer);
    const frameCount = dataInt16.length;
    const buffer = ctx.createBuffer(1, frameCount, 24000);
    const channelData = buffer.getChannelData(0);
    
    for (let i = 0; i < frameCount; i++) {
        channelData[i] = dataInt16[i] / 32768.0;
    }
    return buffer;
};

export const startLiveSession = async (onCloseCallback: () => void) => {
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        
        // Setup Audio Contexts
        const inputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
        const outputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
        
        // Ensure contexts are running (they start suspended in some browsers without user interaction)
        if (inputCtx.state === 'suspended') {
            await inputCtx.resume();
        }
        if (outputCtx.state === 'suspended') {
            await outputCtx.resume();
        }

        audioState = {
            inputContext: inputCtx,
            outputContext: outputCtx,
            outputNode: outputCtx.createGain(),
            nextStartTime: 0,
            sources: new Set()
        };
        
        audioState.outputNode.connect(outputCtx.destination);
        
        // Get Mic Stream
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        
        // Connect to Gemini Live
        const sessionPromise = ai.live.connect({
            model: LIVE_MODEL_NAME,
            config: {
                responseModalities: [Modality.AUDIO],
                systemInstruction: "You are a cheerful, magical Christmas Elf assistant for a photo studio. You help users decide what kind of photo setting they want (e.g. snowy, cozy fireplace, fancy party). Keep your responses short, fun, and very festive. Suggest creative ideas for Christmas photos.",
                speechConfig: {
                    voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } }
                }
            },
            callbacks: {
                onopen: () => {
                    console.log("Live Session Opened");
                    if (!audioState) return;
                    
                    // Setup Input Pipeline
                    const source = audioState.inputContext.createMediaStreamSource(stream);
                    const processor = audioState.inputContext.createScriptProcessor(4096, 1, 1);
                    
                    processor.onaudioprocess = (e) => {
                        const inputData = e.inputBuffer.getChannelData(0);
                        const base64Data = encodePCM(inputData);
                        
                        sessionPromise.then(session => {
                            session.sendRealtimeInput({
                                media: {
                                    mimeType: 'audio/pcm;rate=16000',
                                    data: base64Data
                                }
                            });
                        });
                    };
                    
                    source.connect(processor);
                    processor.connect(audioState.inputContext.destination);
                    
                    audioState.inputSource = source;
                    audioState.processor = processor;
                },
                onmessage: async (msg: LiveServerMessage) => {
                    if (!audioState) return;
                    
                    // Handle Audio Output
                    const audioData = msg.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
                    if (audioData) {
                        const buffer = await decodeAudioData(audioData, audioState.outputContext);
                        
                        audioState.nextStartTime = Math.max(audioState.nextStartTime, audioState.outputContext.currentTime);
                        
                        const source = audioState.outputContext.createBufferSource();
                        source.buffer = buffer;
                        source.connect(audioState.outputNode);
                        
                        source.addEventListener('ended', () => {
                           audioState?.sources.delete(source); 
                        });
                        
                        source.start(audioState.nextStartTime);
                        audioState.nextStartTime += buffer.duration;
                        audioState.sources.add(source);
                    }
                    
                    // Handle Interruption
                    if (msg.serverContent?.interrupted) {
                        audioState.sources.forEach(s => s.stop());
                        audioState.sources.clear();
                        audioState.nextStartTime = 0;
                    }
                },
                onclose: () => {
                    console.log("Live Session Closed");
                    onCloseCallback();
                },
                onerror: (err) => {
                    console.error("Live Session Error", err);
                    onCloseCallback();
                }
            }
        });
        
        currentSession = sessionPromise;
        return true;
        
    } catch (e) {
        console.error("Failed to start live session", e);
        return false;
    }
};

export const stopLiveSession = async () => {
    if (audioState) {
        audioState.inputSource?.disconnect();
        audioState.processor?.disconnect();
        audioState.sources.forEach(s => s.stop());
        await audioState.inputContext.close();
        await audioState.outputContext.close();
        audioState = null;
    }
    // Note: We don't explicitly close the session object here as the API connection
    // is closed when we stop sending data and close contexts, effectively ending the turn.
};