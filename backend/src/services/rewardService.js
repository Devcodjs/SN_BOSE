const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const Reward = require('../models/Reward');
const User = require('../models/User');

/**
 * Mock tree-planting API call.
 * Replace with real Tree-Nation / TheGoodAPI integration when API key is available.
 */
async function plantTree(citizen, issue) {
  // Simulated API response
  const treeData = {
    plantingId: `TREE-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    species: 'Neem (Azadirachta indica)',
    project: 'CivicPulse Green India Initiative',
    location: 'Western Ghats Reforestation Zone',
    plantedAt: new Date().toISOString(),
    citizenName: citizen.name,
    issueTitle: issue.title,
  };

  await Reward.create({ user: citizen._id, issue: issue._id, type: 'tree', data: treeData });
  await User.findByIdAndUpdate(citizen._id, { $inc: { 'rewards.treesPlanted': 1 } });

  return treeData;
}

/**
 * Generate a "Responsible Citizen" PDF certificate with:
 * - Indian tricolor border
 * - Ashoka Chakra watermark (drawn with 24 spokes)
 * - Citizen name, issue details, crypto hash
 * Returns Cloudinary URL of the uploaded PDF.
 */
async function generateCertificate(citizen, issue) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: 'A4', layout: 'landscape', margin: 50 });
    const buffers = [];
    doc.on('data', (chunk) => buffers.push(chunk));
    doc.on('end', async () => {
      try {
        const pdfBuffer = Buffer.concat(buffers);
        const fileName = `certificate-${citizen._id}-${issue._id}-${Date.now()}.pdf`;
        const dirPath = path.join(__dirname, '..', '..', 'public', 'certificates');
        
        if (!fs.existsSync(dirPath)) {
          fs.mkdirSync(dirPath, { recursive: true });
        }
        
        fs.writeFileSync(path.join(dirPath, fileName), pdfBuffer);
        const certUrl = `http://localhost:8000/certificates/${fileName}`;
        
        await Reward.create({ user: citizen._id, issue: issue._id, type: 'certificate', data: { url: certUrl } });
        await User.findByIdAndUpdate(citizen._id, { $push: { 'rewards.certificates': certUrl } });
        resolve(certUrl);
      } catch (e) { reject(e); }
    });

    const w = 842; const h = 595; // A4 landscape points
    const mx = 50;

    // ── Tricolor borders ──
    // Top saffron
    doc.rect(mx - 10, mx - 10, w - 2 * mx + 20, 8).fill('#FF9933');
    // Bottom green
    doc.rect(mx - 10, h - mx + 2, w - 2 * mx + 20, 8).fill('#138808');
    // Left and right thin navy lines
    doc.rect(mx - 10, mx - 10, 3, h - 2 * mx + 20).fill('#000080');
    doc.rect(w - mx + 7, mx - 10, 3, h - 2 * mx + 20).fill('#000080');

    // ── Ashoka Chakra watermark (center, 24 spokes) ──
    const cx = w / 2; const cy = h / 2;
    const r = 100;
    doc.save();
    doc.opacity(0.06);
    doc.circle(cx, cy, r).lineWidth(3).stroke('#000080');
    doc.circle(cx, cy, r * 0.15).fill('#000080');
    for (let i = 0; i < 24; i++) {
      const angle = (i * 15 * Math.PI) / 180;
      doc.moveTo(cx + Math.cos(angle) * r * 0.2, cy + Math.sin(angle) * r * 0.2);
      doc.lineTo(cx + Math.cos(angle) * r * 0.95, cy + Math.sin(angle) * r * 0.95);
    }
    doc.lineWidth(1.5).stroke('#000080');
    doc.restore();

    // ── Title ──
    doc.fontSize(10).fillColor('#FF9933').text('GOVERNMENT OF INDIA', mx, mx + 20, { align: 'center' });
    doc.moveDown(0.3);
    doc.fontSize(26).fillColor('#000080').font('Helvetica-Bold')
      .text('Certificate of Responsible Citizenship', { align: 'center' });
    doc.moveDown(0.5);
    doc.fontSize(11).fillColor('#333').font('Helvetica')
      .text('Awarded under the CivicPulse National Civic Participation Initiative', { align: 'center' });

    // ── Body ──
    doc.moveDown(1.5);
    doc.fontSize(13).fillColor('#222').font('Helvetica')
      .text('This is to certify that', { align: 'center' });
    doc.moveDown(0.5);
    doc.fontSize(22).fillColor('#000080').font('Helvetica-Bold')
      .text(citizen.name.toUpperCase(), { align: 'center' });
    doc.moveDown(0.5);
    doc.fontSize(12).fillColor('#333').font('Helvetica')
      .text('has demonstrated exemplary civic responsibility by reporting and facilitating', { align: 'center' });
    doc.text('the resolution of the following infrastructural issue:', { align: 'center' });
    doc.moveDown(0.5);
    doc.fontSize(14).fillColor('#138808').font('Helvetica-BoldOblique')
      .text(`"${issue.title}"`, { align: 'center' });
    doc.moveDown(0.3);
    doc.fontSize(10).fillColor('#666').font('Helvetica')
      .text(`Category: ${issue.category} | Resolved: ${new Date().toLocaleDateString('en-IN')}`, { align: 'center' });

    // ── Hash signature ──
    const crypto = require('crypto');
    const hash = crypto.createHash('sha256')
      .update(`${citizen._id}-${issue._id}-${Date.now()}`)
      .digest('hex').slice(0, 32);
    doc.moveDown(1.5);
    doc.fontSize(7).fillColor('#999').font('Courier')
      .text(`Verification Hash: ${hash}`, { align: 'center' });

    // ── Footer ──
    doc.fontSize(9).fillColor('#666').font('Helvetica')
      .text('CivicPulse — Building Better Communities Together', mx, h - mx - 30, { align: 'center' });

    doc.end();
  });
}

/**
 * Award the India Flag badge to the citizen.
 */
async function awardBadge(citizen, issue) {
  const badgeType = 'responsible-citizen-flag';
  // Avoid duplicate badges for same type
  if (citizen.rewards.badges.includes(badgeType)) return badgeType;

  await Reward.create({ user: citizen._id, issue: issue._id, type: 'badge', data: { badge: badgeType } });
  await User.findByIdAndUpdate(citizen._id, { $addToSet: { 'rewards.badges': badgeType } });
  return badgeType;
}

/**
 * Dispense all three rewards in parallel.
 */
async function dispenseAllRewards(citizen, issue) {
  const results = await Promise.allSettled([
    plantTree(citizen, issue),
    generateCertificate(citizen, issue),
    awardBadge(citizen, issue),
  ]);

  console.log('🎁 Rewards dispensed for', citizen.name, '→',
    results.map((r, i) => `${['tree', 'cert', 'badge'][i]}: ${r.status}`).join(', '));

  return results;
}

module.exports = { plantTree, generateCertificate, awardBadge, dispenseAllRewards };
