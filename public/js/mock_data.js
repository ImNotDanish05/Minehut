/**
 * Minehut Search Engine - Mock Database Fallback
 * Declared as global variable so it can be loaded directly from file:// protocol without module CORS issues.
 */
window.MinehutMockData = {
  // Mock data for https://api.minehut.com/network/simple_stats
  simpleStats: {
    "player_count": 4812,
    "server_count": 1245,
    "server_max": 3500,
    "server_free": 1310,
    "server_paid": 2190,
    "ram_count": 3584128,
    "ram_max": 20480
  },

  // Mock data for https://api.minehut.com/network/homepage_stats
  homepageStats: {
    "server_count": 13761070,
    "user_count": 8001165
  },

  // Mock data for https://api.minehut.com/servers (list of servers)
  servers: [
    {
      "staticInfo": {
        "_id": "666bf9e9d55ba45e1e946e0d",
        "serverPlan": "External Server",
        "serviceStartDate": 1780644790427,
        "platform": "java",
        "planMaxPlayers": null,
        "planRam": null,
        "alwaysOnline": true,
        "rawPlan": "EXTERNAL",
        "connectedServers": []
      },
      "maxPlayers": 1000,
      "name": "TechMines",
      "motd": "<color:#66ccff> <bold>TechMines</bold> </color>\n <color:#3399ff>Box PvP</color>\n\n <bold><color:#66ffff>» MINING</color></bold>\n <bold><color:#33ccff>» BOSSES</color></bold>\n <bold><color:#0099ff>» CUSTOM GEAR</color></bold>\n\n<green><bold>JOIN THE FIGHT</bold></green>",
      "icon": "END_CRYSTAL",
      "playerData": {
        "timeNoPlayers": 0,
        "playerCount": 177
      },
      "connectable": true,
      "visibility": true,
      "allCategories": ["box", "pvp", "rpg"],
      "usingCosmetics": false,
      "minehutPlugins": ["Essentials", "WorldEdit", "ViaVersion", "LuckPerms"],
      "author": "Zyptrik",
      "authorRank": "VIP"
    },
    {
      "staticInfo": {
        "_id": "61dbcb5e48fc29008df207a9",
        "serverPlan": "External Server",
        "serviceStartDate": 1780537066398,
        "platform": "java",
        "planMaxPlayers": null,
        "planRam": null,
        "alwaysOnline": true,
        "rawPlan": "EXTERNAL",
        "connectedServers": []
      },
      "maxPlayers": 500,
      "name": "Lifesteal",
      "motd": "       <!i><#F41643>❤</#F41643> <gradient:#f41643:#ff8cbd><b>LIFESTEAL</b></gradient> <#F41643>❤</#F41643>\n  <!i><#D3D3D3>[Lifesteal & Random Kits]   \n\n<!i><color:#ff8cbd>❤</color> <white>Steal hearts</white>\n<!i><color:#ff8cbd>⚔</color> <white>Battle Players</white>\n\n<!i><#55ff55><b>JOIN US TODAY!</b>\n",
      "icon": "GOLDEN_APPLE",
      "playerData": {
        "timeNoPlayers": 0,
        "playerCount": 118
      },
      "connectable": true,
      "visibility": true,
      "allCategories": ["lifesteal", "pvp", "smp"],
      "usingCosmetics": false,
      "minehutPlugins": ["WorldGuard", "EssentialsX", "Vault", "PlaceholderAPI"],
      "author": "AlexMC",
      "authorRank": "DEFAULT"
    },
    {
      "staticInfo": {
        "_id": "637c1f78cdd5a4020e603c6e",
        "serverPlan": "External Server",
        "serviceStartDate": 1778141630810,
        "platform": "java",
        "planMaxPlayers": null,
        "planRam": null,
        "alwaysOnline": true,
        "rawPlan": "EXTERNAL",
        "connectedServers": []
      },
      "maxPlayers": 500,
      "name": "SolarSkies",
      "motd": "<gradient:#FFE08C:#ffb554><b>SOLAR SKIES</gradient>\n<gray>[JAVA & BEDROCK]\n\n<#f58948><b>⚡ NEW SEASON LIVE</b>\n\n<green><b>✔ </b><white>Free Rank on Join\n<yellow><b>⭐ </b><white>Farming, Fishing\n<aqua><b>❤ </b><white>Mining & Dungeons!\n\n<#75e36b><b>CLICK TO JOIN",
      "icon": "DIAMOND",
      "playerData": {
        "timeNoPlayers": 0,
        "playerCount": 95
      },
      "connectable": true,
      "visibility": true,
      "allCategories": ["gens", "farming", "pvp"],
      "usingCosmetics": false,
      "minehutPlugins": ["Slimefun", "ClearLag", "Multiverse-Core"],
      "author": "Firosee",
      "authorRank": "DEFAULT"
    },
    {
      "staticInfo": {
        "_id": "64f2eeb10a6b44e16e5085aa",
        "serverPlan": "FREE",
        "serviceStartDate": 1693642417204,
        "platform": "java",
        "planMaxPlayers": 10,
        "planRam": 1024,
        "alwaysOnline": false,
        "rawPlan": "FREE",
        "connectedServers": []
      },
      "maxPlayers": 10,
      "name": "ChillDan",
      "motd": "<color:#ffaa00><bold>ChillDan</bold></color>\nA quiet and cozy place to build. Survival mode.",
      "icon": "CAMPFIRE",
      "playerData": {
        "timeNoPlayers": 3600,
        "playerCount": 0
      },
      "connectable": true,
      "visibility": true,
      "allCategories": ["smp", "survival", "vanilla"],
      "usingCosmetics": true,
      "minehutPlugins": ["CoreProtect", "GriefPrevention"],
      "author": "DanielX",
      "authorRank": "PRO"
    },
    {
      "staticInfo": {
        "_id": "65112f458e0a12e3129486ad",
        "serverPlan": "PRO",
        "serviceStartDate": 1750645129302,
        "platform": "bedrock",
        "planMaxPlayers": 150,
        "planRam": 4096,
        "alwaysOnline": true,
        "rawPlan": "PRO",
        "connectedServers": []
      },
      "maxPlayers": 150,
      "name": "AetherSMP",
      "motd": "<gradient:#8a2be2:#4a0e4e><bold>AETHER SMP</bold></gradient> <color:#ff007f>[SEASON 3]</color>\nCustom sky island survival! <gold>Friendly community.</gold>",
      "icon": "ELYTRA",
      "playerData": {
        "timeNoPlayers": 0,
        "playerCount": 64
      },
      "connectable": true,
      "visibility": true,
      "allCategories": ["smp", "bedrock", "skyblock"],
      "usingCosmetics": true,
      "minehutPlugins": ["GeyserMC", "Floodgate", "GriefDefender", "DecentHolograms"],
      "author": "AetherStaff",
      "authorRank": "SUPER_ADMIN"
    },
    {
      "staticInfo": {
        "_id": "65891ac3a8b417c80214819d",
        "serverPlan": "ULTRA",
        "serviceStartDate": 1761899120000,
        "platform": "java",
        "planMaxPlayers": 250,
        "planRam": 8192,
        "alwaysOnline": true,
        "rawPlan": "ULTRA",
        "connectedServers": []
      },
      "maxPlayers": 250,
      "name": "LobbyHub",
      "motd": "<color:#55ff55><bold>MINEHUT HUB</bold></color> <gray>» Connect to mini-games!</gray>\n<color:#55ffff>★ BedWars</color> | <color:#ff55ff>★ SkyWars</color> | <color:#ffff55>★ Creative</color>",
      "icon": "BEACON",
      "playerData": {
        "timeNoPlayers": 0,
        "playerCount": 210
      },
      "connectable": true,
      "visibility": true,
      "allCategories": ["lobby", "minigames", "bedwars"],
      "usingCosmetics": true,
      "minehutPlugins": ["BungeeCord", "Citizens", "ProtocolLib", "DeluxeMenus"],
      "author": "MinehutTeam",
      "authorRank": "ADMIN"
    },
    {
      "staticInfo": {
        "_id": "664c12bb94fa22108ec993d0",
        "serverPlan": "FREE",
        "serviceStartDate": 1775199388102,
        "platform": "java",
        "planMaxPlayers": 10,
        "planRam": 1024,
        "alwaysOnline": false,
        "rawPlan": "FREE",
        "connectedServers": []
      },
      "maxPlayers": 10,
      "name": "BedrockPvP",
      "motd": "<color:#ff5555><bold>1v1 / 2v2 Arena</bold></color>\nLow ping, competitive combat.",
      "icon": "IRON_SWORD",
      "playerData": {
        "timeNoPlayers": 10,
        "playerCount": 0
      },
      "connectable": true,
      "visibility": false,
      "allCategories": ["pvp", "arena"],
      "usingCosmetics": false,
      "minehutPlugins": ["Duels", "CombatLogX"],
      "author": "PvPMaster",
      "authorRank": "DEFAULT"
    },
    {
      "staticInfo": {
        "_id": "65fc12dcb4190c10f8fa2a4f",
        "serverPlan": "EXTERNAL",
        "serviceStartDate": 1779654120399,
        "platform": "java",
        "planMaxPlayers": 200,
        "planRam": null,
        "alwaysOnline": true,
        "rawPlan": "EXTERNAL",
        "connectedServers": []
      },
      "maxPlayers": 200,
      "name": "HypixelClone",
      "motd": "<color:#ffaa00><bold>HYPIXEL MINI-GAMES CLONE</bold></color>\n<color:#55ff55>Skyblock, Bedwars, Murder Mystery!</color>",
      "icon": "NETHER_STAR",
      "playerData": {
        "timeNoPlayers": 0,
        "playerCount": 142
      },
      "connectable": true,
      "visibility": true,
      "allCategories": ["minigames", "skyblock", "pvp"],
      "usingCosmetics": false,
      "minehutPlugins": [],
      "author": "CloneDeveloper",
      "authorRank": "VIP_PLUS"
    }
  ],

  // Mock server detail database helper to get full detail page fields
  getServerDetailByName: function(name) {
    const server = this.servers.find(s => s.name.toLowerCase() === name.toLowerCase());
    if (!server) return null;

    // Build the format returned by https://api.minehut.com/server/{Name}?byName=true
    return {
      "server": {
        "_id": server.staticInfo._id,
        "owner": "5ea0ee097cf6" + server.name.length + "7cf668018630f493",
        "name": server.name,
        "name_lower": server.name.toLowerCase(),
        "creation": server.staticInfo.serviceStartDate,
        "platform": server.staticInfo.platform,
        "storage_node": "s3",
        "motd": server.motd,
        "categories": server.allCategories,
        "inheritedCategories": server.allCategories,
        "purchased_icons": [],
        "credits_per_day": server.staticInfo.serverPlan === "FREE" ? 0 : 40,
        "server_plan": server.staticInfo.serverPlan,
        "backup_slots": server.staticInfo.serverPlan === "FREE" ? 0 : 3,
        "visibility": server.visibility,
        "suspended": false,
        "server_version_type": "PAPER",
        "proxy": false,
        "connectedServers": [],
        "default_banner_image": "server-banner-" + (server.name.length % 10 + 1) + ".png",
        "default_banner_tint": server.name.length % 2 === 0 ? "#1390E5" : "#8A2BE2",
        "in_game": server.playerData.playerCount > 0,
        "using_cosmetics": server.usingCosmetics,
        "joins": Math.floor(server.staticInfo.serviceStartDate / 1000000000) + (server.playerData.playerCount * 12),
        "__v": 1,
        "port": -1,
        "last_online": Date.now() - (server.playerData.playerCount > 0 ? 0 : 3600000),
        "daily_online_time": {
          "11-5-2026": 11575414
        },
        "boosts": server.staticInfo.serverPlan === "ULTRA" ? 2 : 0,
        "deleted": false,
        "deletion": {
          "started": false,
          "started_at": 0,
          "reason": "",
          "completed": false,
          "completed_at": 0,
          "storage_completed": false,
          "storage_completed_at": 0
        },
        "hidden": !server.visibility,
        "minehut_plugins": server.minehutPlugins || [],
        "online": server.playerData.playerCount > 0 || server.staticInfo.alwaysOnline,
        "maxPlayers": server.maxPlayers,
        "playerCount": server.playerData.playerCount,
        "rawPlan": server.staticInfo.rawPlan,
        "activeServerPlan": server.staticInfo.serverPlan
      }
    };
  }
};
