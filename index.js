require("dotenv").config();
const {
    Client,
    GatewayIntentBits,
    EmbedBuilder,
    ActivityType,
} = require("discord.js");
const axios = require("axios");
const express = require("express");
const app = express();
const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
    res.send("Bot is running!");
});
app.listen(PORT, "0.0.0.0", () => {
    console.log("Web server aktif di port " + PORT);
});

// ===== CONFIG =====
const TOKEN = process.env.TOKEN;
const OWNER_ID = "752554326907420672";

// ================= DEPLOY BOT =================
const ALLOWED_GUILDS = [
    "1478401276105461853",
    "1379789649773334588",

];


// ================= INIT CLIENT =================
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
});

// ================= SERVER LIST =================
const servers = [
    { name: "IDP", alias: "idp", id: "bak4pl" },
    { name: "EXECUTIVE 2.0", alias: "exe", id: "roek67" },
    { name: "KOTABARU", alias: "kb", id: "mez5p7" },
    { name: "NUSA V INDONESIA", alias: "nv", id: "ele3bm" },
    { name: "JING ARENA INDONESIA", alias: "jing", id: "6gqrq4" },
    { name: "V3 PVP", alias: "v3", id: "y84779" },
    { name: "KOTAKITA", alias: "kotkit", id: "r35px8" },
    { name: "IME RP", alias: "ime", id: "zrvmg4" },
    { name: "CERITA KITA", alias: "ck", id: "zxmea5" },
    { name: "INDOZONE", alias: "indozone", id: "jadyla" },
    { name: "HOPE", alias: "hope", id: "ymzj4j" },
    { name: "Town Glorix VII", alias: "glorix", id: "bjyd8b" },
    { name: "SixNine", alias: "69", id: "qldge6" },
    { name: "VICTORIA RP", alias: "victoria", id: "3qjvrz" },
    { name: "MERCY", alias: "mercy", id: "xj9l5r" },
    { name: "SATU MIMPI", alias: "sm", id: "3e3gdb" },
    { name: "KOTABARU", alias: "kotabaru", id: "mez5p7" },
    { name: "MOXIE RP", alias: "moxie", id: "plky8m" },
    { name: "LAST PARADISE RP", alias: "lp", id: "eql83a" },
    { name: "KAMPOENG", alias: "kampoeng", id: "55kd96" },
    { name: "AMORA STATE INDONESIA", alias: "amora", id: "lk6x85" },
    { name: "SENPAI FAMS PVP", alias: "senpai", id: "6abxd4" },
    { name: "ORIGAMI RP", alias: "origami", id: "plj9dy" },
    { name: "OUR GLORY", alias: "ourglory", id: "55k88a" },
    { name: "DayDream", alias: "daydream", id: "4zqglv" },
    { name: "SUASANA BARU", alias: "suasanabaru", id: "g6b3xx" },
    { name: "RETORIKA", alias: "retorika", id: "6j4z5j" },
    { name: "SOM Roleplay Indonesia", alias: "som", id: "893d83" },
    { name: "KERTA969 Arena", alias: "kerta969", id: "mxk58q" },
    { name: "CR Roleplay", alias: "cr", id: "kr7k7d" },
    { name: "Retro Roleplay", alias: "retro", id: "98y8l9y" },
    { name: "Kisah Nusantara Roleplay", alias: "kn", id: "jj9zx4" },
    { name: "Garuda Prime Roleplay", alias: "garuda", id: "vgaqm5" },
];

// ================= FUNCTION CFX =================
async function getServerData(serverId) {
    try {
        const res = await axios.get(
            `https://servers-frontend.fivem.net/api/servers/single/${serverId}`,
            { timeout: 5000 },
        );
        return res.data.Data;
    } catch (err) {
        return null;
    }
}

// ================= READY =================
client.once("ready", async () => {
    console.log(`✅ Bot online sebagai ${client.user.tag}`);

    for (const guild of client.guilds.cache.values()) {
        if (!ALLOWED_GUILDS.includes(guild.id)) {
            console.log(`❌ Keluar dari server ilegal: ${guild.name} (${guild.id})`);
            await guild.leave();
        } else {
            console.log(`✅ Diizinkan: ${guild.name}`);
        }
    }

    client.user.setPresence({
        activities: [
            {
                name: "customstatus",
                type: ActivityType.Custom,
                state: "Petunjuk: !com",
            },
        ],
        status: "online",
    });
});

client.login(process.env.TOKEN);
client.on("guildCreate", async (guild) => {
    if (!ALLOWED_GUILDS.includes(guild.id)) {
        console.log(`🚨 Server ilegal: ${guild.name} (${guild.id})`);

        let inviter = "Tidak diketahui";

        try {
            // 🔍 Ambil audit log
            const logs = await guild.fetchAuditLogs({
                limit: 1,
                type: 28 // BOT_ADD
            });

            const entry = logs.entries.first();

            if (entry && entry.executor) {
                inviter = `${entry.executor.tag} (${entry.executor.id})`;
            }
        } catch (err) {
            console.log("❌ Gagal ambil audit log");
        }

        try {
            // 📩 Kirim DM ke owner
            const owner = await client.users.fetch(OWNER_ID);

            const embed = new EmbedBuilder()
                .setColor(0xff0000)
                .setTitle("🚨 Bot Diinvite ke Server Ilegal")
                .addFields(
                    { name: "🏷 Nama Server", value: guild.name, inline: true },
                    { name: "🆔 Server ID", value: guild.id, inline: true },
                    { name: "👥 Member", value: `${guild.memberCount}`, inline: true },
                    { name: "👤 Diinvite oleh", value: inviter, inline: false }
                )
                .setTimestamp();

            await owner.send({ embeds: [embed] });

        } catch (err) {
            console.log("❌ Gagal kirim DM ke owner");
        }

        // ❌ keluar dari server ilegal
        await guild.leave();
    }
});

// ================= COMMAND =================
client.on("messageCreate", async (message) => {
    if (message.author.bot) return;

    const args = message.content.trim().split(/\s+/);
    const command = args[0].toLowerCase();

    // =====================================
    // 📋 SERVERLIST (KIRIM SEMUA HALAMAN)
    // =====================================
    if (message.content.startsWith("!")) {
        const validCommands = [
            "!com",
            "!allplayer",
            "!allserver",
            "!player",
            "!dev",
            "!servers",
            "!leaveall",
        ];

        const usedCommand = command;

        if (!validCommands.includes(usedCommand)) {
            const embed = new EmbedBuilder()
                .setColor(0xff0000)
                .setTitle("❌ Command Tidak Ditemukan")
                .setDescription(
                    `Command \`${usedCommand}\` tidak tersedia.\n\nGunakan \`!com\` untuk melihat daftar command yang tersedia.`,
                )
                .setFooter({
                    text: "IndoFiveM Finder | Developed by Wizz",
                });

            return message.reply({ embeds: [embed] });
        }
    }

    if (command === "!com") {
        const embed = new EmbedBuilder()
            .setTitle("📖 Daftar Command Bot")
            .setColor(0xffd700)
            .setDescription("Berikut command yang tersedia:")
            .addFields(
                {
                    name: "📋 !allserver",
                    value: "Menampilkan semua daftar server.",
                },
                {
                    name: "👥 !allplayer <server>",
                    value: "Menampilkan semua player online dari server tertentu.\nContoh: `!allplayer indozone`",
                },
                {
                    name: "👥 !player <server> <nama>",
                    value: "Menampilkan informasi player dari server tertentu.\nContoh: `!player indozone Wizz`",
                },
                {
                    name: "📖 !com",
                    value: "Menampilkan daftar command yang tersedia.",
                },
                {
                    name: "👨‍💻 !dev",
                    value: "Informasi tentang developer bot.",
                },
            )
            .setFooter({
                text: "IndoFiveM Finder | Developed by Wizz",
            });

        return message.channel.send({ embeds: [embed] });
    }

    if (command === "!allserver") {
        const perPage = 10;
        const totalPages = Math.ceil(servers.length / perPage);

        for (let page = 1; page <= totalPages; page++) {
            const start = (page - 1) * perPage;
            const selected = servers.slice(start, start + perPage);

            const embed = new EmbedBuilder()
                .setTitle(`📋 Daftar Server - Halaman ${page}`)
                .setColor(0x00aeff);

            selected.forEach((server) => {
                embed.addFields({
                    name: `🔎 ${server.name}`,
                    value:
                        `🆔 ID Server: ${server.id}\n` +
                        `🎯 key: \`${server.alias}\`\n` +
                        `Gunakan: \`!allplayer ${server.alias}\``,
                    inline: false,
                });
            });
            embed.setFooter({
                text: `Halaman ${page}/${totalPages} | IndoFiveM Finder | Developed by Wizz`,
            });

            await message.channel.send({ embeds: [embed] });
        }
    }

    function errorEmbed(description) {
        return new EmbedBuilder()
            .setColor(0xff0000)
            .setTitle("Terjadi Kesalahan")
            .setDescription(description)
            .setFooter({ text: "Bot Fivem RP Indonesia | Developed by Wizz" });
    }

    function warningEmbed(description) {
        return new EmbedBuilder()
            .setColor(0xffa500)
            .setTitle("Peringatan")
            .setDescription(description)
            .setFooter({ text: "IndoFiveM Finder | Developed by Wizz" });
    }

    // =====================================
    // 👥 ALLPLAYER (FIXED)
    // =====================================
    if (command === "!allplayer") {
        const alias = args[1];
        if (!alias)
            return message.reply({
                embeds: [errorEmbed("Gunakan: `!allplayer <alias>`")],
            });

        const server = servers.find((s) => s.alias === alias);
        if (!server)
            return message.reply({
                embeds: [errorEmbed("❌ Server tidak ditemukan.")],
            });

        const data = await getServerData(server.id);
        if (!data)
            return message.reply({
                embeds: [
                    errorEmbed("❌ Server offline atau gagal ambil data."),
                ],
            });
        if (!data.players || data.players.length === 0)
            return message.reply({
                embeds: [warningEmbed("⚠️ Tidak ada player online.")],
            });

        // 🔽 SORT BY ID DESC
        const sortedPlayers = [...data.players].sort((a, b) => b.id - a.id);

        function getPingIcon(ping) {
            if (ping <= 95) return "🟢";
            if (ping <= 200) return "🟡";
            return "🔴";
        }

        const formattedPlayers = sortedPlayers.map(
            (p) =>
                `${getPingIcon(p.ping)} [${p.id}] **${p.name}** (${p.ping}ms)`,
        );

        const perPage = 40;
        const totalPages = Math.ceil(formattedPlayers.length / perPage);

        for (let page = 1; page <= totalPages; page++) {
            const start = (page - 1) * perPage;
            const pagePlayers = formattedPlayers.slice(start, start + perPage);

            const half = Math.ceil(pagePlayers.length / 2);
            const leftColumn =
                pagePlayers.slice(0, half).join("\n") || "Kosong";
            const rightColumn = pagePlayers.slice(half).join("\n") || "Kosong";

            const embed = new EmbedBuilder()
                .setTitle(`🏙 ${server.name} • Page ${page}/${totalPages}`)
                .addFields(
                    { name: "👥 Player List", value: leftColumn, inline: true },
                    { name: "‎", value: rightColumn, inline: true },
                    {
                        name: "📊 Server Info",
                        value: `👥 ${data.clients} / ${data.sv_maxclients}`,
                        inline: false,
                    },
                )
                .setColor(0x00ff00);

            await message.channel.send({ embeds: [embed] });
        }
    }

    if (command === "!player") {
        const alias = args[1];
        const playerName = args.slice(2).join(" ");

        if (!alias || !playerName)
            return message.reply({
                embeds: [errorEmbed("❌ Gunakan: `!player <server> <nama>`")],
            });

        const server = servers.find((s) => s.alias === alias);
        if (!server)
            return message.reply({
                embeds: [errorEmbed("❌ Server tidak ditemukan.")],
            });
        const data = await getServerData(server.id);
        if (!data)
            return message.reply({
                embeds: [
                    errorEmbed("❌ Server offline atau gagal ambil data."),
                ],
            });

        if (!data.players || data.players.length === 0)
            return message.reply({
                embeds: [warningEmbed("⚠️ Tidak ada player online.")],
            });

        // 🔍 Cari SEMUA player yang cocok (case insensitive)
        const matchedPlayers = data.players.filter((p) =>
            p.name.toLowerCase().includes(playerName.toLowerCase()),
        );

        if (matchedPlayers.length === 0)
            return message.reply({
                embeds: [
                    errorEmbed(
                        "❌ Player tidak ditemukan atau sedang offline.",
                    ),
                ],
            });

        // 🔽 SORT BY ID DESC
        const sortedPlayers = matchedPlayers.sort((a, b) => b.id - a.id);

        function getPingIcon(ping) {
            if (ping <= 95) return "🟢";
            if (ping <= 200) return "🟡";
            return "🔴";
        }

        const formattedPlayers = sortedPlayers.map(
            (p) =>
                `${getPingIcon(p.ping)} [${p.id}] **${p.name}** (${p.ping}ms)`,
        );

        // 🔥 Batasi 30 per embed biar aman
        const perPage = 30;
        const totalPages = Math.ceil(formattedPlayers.length / perPage);

        for (let page = 1; page <= totalPages; page++) {
            const start = (page - 1) * perPage;
            const pagePlayers = formattedPlayers.slice(start, start + perPage);

            const half = Math.ceil(pagePlayers.length / 2);
            const leftColumn =
                pagePlayers.slice(0, half).join("\n") || "Kosong";
            const rightColumn = pagePlayers.slice(half).join("\n") || "Kosong";

            const embed = new EmbedBuilder()
                .setTitle(`🔎 Hasil Pencarian: "${playerName}"`)
                .setDescription(
                    `🏙 Server: **${server.name}**\n👥 Ditemukan: **${matchedPlayers.length} player**`,
                )
                .addFields(
                    { name: "👥 Player List", value: leftColumn, inline: true },
                    { name: "‎", value: rightColumn, inline: true },
                )
                .setColor(0x3498db);

            await message.channel.send({ embeds: [embed] });
        }
    }

    if (command === "!dev") {
        const embed = new EmbedBuilder()
            .setColor(0x9b59b6)
            .setTitle("👨‍💻 Developer Information")
            .setDescription(
                "Bot ini dibuat untuk memonitor server FiveM RP Indonesia secara realtime.\n\n" +
                "Jika ada bug atau ingin request fitur, silakan hubungi developer.",
            )
            .addFields(
                {
                    name: "👤 Developer",
                    value: "**Wizz**",
                    inline: true,
                },
                {
                    name: "💬 Discord",
                    value: "<@752554326907420672>",
                    inline: true,
                },
            )
            .setFooter({
                text: "IndoFiveM Finder | Developed by Wizz",
            })
            .setTimestamp();

        return message.channel.send({ embeds: [embed] });
    }

    if (command === "!servers") {
        if (message.author.id !== OWNER_ID) return;

        const guilds = client.guilds.cache;

        if (guilds.size === 0) {
            return message.channel.send("Bot tidak ada di server manapun.");
        }

        const list = guilds
            .map(g => `• **${g.name}**\nID: ${g.id}`)
            .join("\n\n");

        const embed = new EmbedBuilder()
            .setColor(0x00aeff)
            .setTitle("📋 List Server Bot")
            .setDescription(list)
            .setFooter({
                text: `Total: ${guilds.size} server`,
            })
            .setTimestamp();

        return message.channel.send({ embeds: [embed] });
    }
    if (command === "!leaveall") {
        if (message.author.id !== OWNER_ID) return;

        const embedStart = new EmbedBuilder()
            .setColor(0xff0000)
            .setTitle("⚠️ Leave All Server")
            .setDescription("Bot sedang keluar dari semua server...")
            .setTimestamp();

        await message.channel.send({ embeds: [embedStart] });

        let count = 0;

        for (const guild of client.guilds.cache.values()) {
            try {
                console.log(`Keluar dari ${guild.name}`);
                await guild.leave();
                count++;
            } catch (err) {
                console.log(`Gagal keluar dari ${guild.name}`);
            }
        }

        const embedDone = new EmbedBuilder()
            .setColor(0x00ff00)
            .setTitle("✅ Selesai")
            .setDescription(`Bot berhasil keluar dari **${count} server**.`)
            .setTimestamp();

        message.channel.send({ embeds: [embedDone] });
    }
});
