import { roastSquad } from "../api/roast";

export const analyzeSquad = async (image: string) => {
  return await roastSquad(image);
};
