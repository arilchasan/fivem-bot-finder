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
    { name: "LAST PARADISE RP", alias: "lp", id: "8rvzg5" },
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
client.once("ready", () => {
    console.log(`✅ Bot online sebagai ${client.user.tag}`);

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
});
