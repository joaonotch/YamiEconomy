const { QuickDB } = require("quick.db");
const db = new QuickDB();

async function getVipStatus(userId) {
    const isVip = await db.get(`${userId}_General.VIP`);
    const vipExpire = await db.get(`${userId}_General.VIPExpire`);

    if (!isVip || !vipExpire) return { vip: false };

    if (Date.now() > vipExpire) {
        await db.set(`${userId}_General.VIP`, false);
        await db.set(`${userId}_General.VIPExpire`, null);
        return { vip: false };
    }

    return { vip: true, expire: vipExpire };
}

module.exports = getVipStatus;