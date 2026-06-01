import type { RoastResult } from "../types/roastResult";
import { toPng } from "html-to-image";

export async function downloadMeme(data: RoastResult) {
  const wrapper = document.createElement("div");
  wrapper.innerHTML = generateMemeHTML(data);

  const node = wrapper.firstElementChild as HTMLElement | null;
  if (!node) throw new Error("Failed to build meme node");

  // Position at visible area (0,0) but hide from user view
  node.style.position = "fixed";
  node.style.left = "0";
  node.style.top = "0";
  node.style.visibility = "hidden";
  node.style.zIndex = "-9999";

  document.body.appendChild(node);

  try {
    // Use toPng dengan options yang proper untuk render
    const dataUrl = await toPng(node, {
      cacheBust: true,
      width: 1080,
      height: 1920,
      pixelRatio: 2,
      backgroundColor: "#1a1a1a",
    });
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = `eRoast-${Date.now()}.png`;
    link.click();
  } finally {
    document.body.removeChild(node);
  }
}

export async function shareToTiktok(data: RoastResult) {
  const text = `
eROAST - Squad Analysis
🏆 Roast Score: ${data.roastScore}/10
💸 Dompet: ${data.walletScore}/10
☠️ Meta Abuse: ${data.metaAbuse}/10
🧠 Tactical IQ: ${data.tacticalIQ}/10

${data.tiktokMode}

#eFootball #eRoast #Squad
`.trim();

  if (navigator.share) {
    try {
      await navigator.share({
        title: "eROAST",
        text: text,
      });
    } catch (error) {
      console.log("Share cancelled or failed");
    }
  } else {
    // Fallback: copy to clipboard
    await navigator.clipboard.writeText(text);
    alert("Text copied to clipboard! Paste on TikTok");
  }
}

function generateMemeHTML(data: RoastResult) {
  return `
<div style="
  width: 1080px;
  height: 1920px;
  background: #1a1a1a;
  background-image: linear-gradient(135deg, #1a1a1a 0%, #2d1b2e 100%);
  color: white;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 40px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  box-sizing: border-box;
  margin: 0;
">
  <div style="text-align: center;">
    <div style="font-size: 120px; line-height: 1; margin-bottom: 10px;">☠️</div>
    <h1 style="font-size: 80px; font-weight: 900; color: #ff3333; margin: 0; letter-spacing: 3px;">eROAST</h1>
    <p style="font-size: 40px; color: #ff9999; margin: 20px 0 0 0;">${data.squadType} Squad</p>
  </div>

  <div style="text-align: center; background: #330000; padding: 40px; border-radius: 20px; border: 2px solid #ff3333;">
    <div style="font-size: 100px; font-weight: 900; color: #ff3333; margin: 0; line-height: 1;">${data.roastScore.toFixed(1)}</div>
    <div style="font-size: 50px; color: #ffaaaa; margin-top: 20px; font-weight: bold;">ROAST SCORE</div>
  </div>

  <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin: 40px 0;">
    <div style="background: #003355; padding: 30px; border-radius: 15px; text-align: center; border: 2px solid #64c8ff;">
      <div style="font-size: 60px; font-weight: 900; color: #64c8ff; margin: 0; line-height: 1;">${data.walletScore.toFixed(1)}</div>
      <div style="font-size: 30px; color: #aaffff; margin-top: 20px; font-weight: bold;">💸 DOMPET</div>
    </div>
    <div style="background: #553300; padding: 30px; border-radius: 15px; text-align: center; border: 2px solid #ff9632;">
      <div style="font-size: 60px; font-weight: 900; color: #ff9632; margin: 0; line-height: 1;">${data.metaAbuse.toFixed(1)}</div>
      <div style="font-size: 30px; color: #ffcc99; margin-top: 20px; font-weight: bold;">🎯 META</div>
    </div>
  </div>

  <div style="text-align: center; background: #000000; padding: 35px; border-radius: 15px; border: 2px solid #ff3333;">
    <p style="font-size: 35px; color: #ffaaaa; font-weight: bold; margin: 0; line-height: 1.4;">
      ${data.netizanComments[0] || "Squad lu brutal!"}
    </p>
  </div>

  <div style="text-align: center;">
    <p style="font-size: 30px; color: #999999; margin: 0; font-weight: bold;">@ratemysquad</p>
    <p style="font-size: 25px; color: #666666; margin: 10px 0 0 0;">#eFootball #eRoast</p>
  </div>
</div>
`;
}
