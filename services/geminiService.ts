
import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import { Client, MedicalResultStatus, PaymentStatus, BookingStatus } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.warn("API_KEY environment variable not set. Gemini service will not work.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

const clientSchema = {
    type: Type.OBJECT,
    properties: {
        id: { type: Type.STRING, description: 'A unique UUID for the client' },
        firstName: { type: Type.STRING },
        lastName: { type: Type.STRING },
        passportNumber: { type: Type.STRING, description: 'A unique alphanumeric passport number' },
        nationality: { type: Type.STRING },
        dateOfBirth: { type: Type.STRING, description: 'Date in YYYY-MM-DD format' },
        contactNumber: { type: Type.STRING },
        email: { type: Type.STRING, description: 'A unique email address' },
        profilePicture: { type: Type.STRING, description: 'A URL to a profile picture from a placeholder service like picsum.photos' },
        appointment: {
            type: Type.OBJECT,
            properties: {
                id: { type: Type.STRING, description: 'A unique UUID for the appointment' },
                wafidApplicationId: { type: Type.STRING, description: 'A unique Wafid reference ID like "WFD123456"' },
                appointmentDate: { type: Type.STRING, description: 'Date in ISO 8601 format (YYYY-MM-DDTHH:mm:ss.sssZ)' },
                appointmentTime: { type: Type.STRING, description: 'Time in HH:MM format (24-hour)' },
                medicalCenterName: { type: Type.STRING },
                paymentStatus: { type: Type.STRING, enum: Object.values(PaymentStatus).filter(v => !["Pending", "Failed"].includes(v)) },
                bookingStatus: { type: Type.STRING, enum: Object.values(BookingStatus) },
                medicalResultStatus: { type: Type.STRING, enum: Object.values(MedicalResultStatus).filter(v => !["Pending Info", "Appointment Booked"].includes(v))},
                bookingDate: { type: Type.STRING, description: 'Date in YYYY-MM-DD format' },
                medicalSlipUrl: { type: Type.STRING, description: 'A placeholder URL for the medical slip PDF' }
            },
        }
    },
};

export const generateMockClients = async (count: number): Promise<Client[]> => {
  if (!API_KEY) {
    console.error("Cannot call Gemini: API_KEY is not configured.");
    return [];
  }

  try {
    const prompt = `
      Generate a list of ${count} mock clients for a medical visa processing CRM.
      The clients are primarily from India, Pakistan, Bangladesh, and the Philippines, seeking visas for GCC countries like UAE, Saudi Arabia, and Qatar.
      Ensure the data is realistic and diverse. Follow the provided JSON schema precisely.
      For the profilePicture, use a random image URL from "https://picsum.photos/200".
      For the medicalSlipUrl, just use "#" as a placeholder.
      For bookingStatus, ensure a good distribution among all possible enum values.
    `;

    const response: GenerateContentResponse = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.ARRAY,
                items: clientSchema
            },
        },
    });

    const jsonText = response.text.trim();
    const clients = JSON.parse(jsonText);
    return clients as Client[];
  } catch (error) {
    console.error("Error generating mock clients with Gemini:", error);
    return [];
  }
};