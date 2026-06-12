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
      "server_list_favicon": "data:image/png;base64,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",
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
    if (name.toLowerCase() === 'lifesteal') {
      return {
        "server": {
          "_id": "61dbcb5e48fc29008df207a9",
          "categories": ["lifesteal", "pvp", "smp"],
          "inheritedCategories": ["lifesteal", "pvp", "smp"],
          "purchased_icons": ["5eb9c200a812e61b8dfe62d9", "6172e2276aa038008ee04dc2"],
          "backup_slots": 0,
          "suspended": false,
          "server_version_type": "VELOCITY",
          "proxy": true,
          "connectedServers": [],
          "motd": "<#F41643>❤ LIFESTEAL <#F41643>❤ <#D3D3D3>[Lifesteal & Random Kits] ❤ Steal hearts ⚔ Battle Players 💵 Earn Money <#55ff55>JOIN US TODAY!",
          "visibility": true,
          "server_plan": "EXTERNAL",
          "storage_node": "s1",
          "owner": "608b8485b5d74d006c7720df",
          "name": "Lifesteal",
          "name_lower": "lifesteal",
          "creation": 1641794398968,
          "platform": "java",
          "credits_per_day": 26.666666666666668,
          "__v": 26,
          "port": -1,
          "last_online": 1733434473953,
          "active_icon": "5eb9c200a812e61b8dfe62d9",
          "default_banner_image": "server-banner-07.png",
          "default_banner_tint": "#662D91",
          "expired": false,
          "joins": 5676958,
          "daily_online_time": {
            "25-3-2023": 50976649794
          },
          "deletion": {
            "started": false,
            "started_at": 1714435200000,
            "reason": "PURGE",
            "metadata": {
              "description": "Apr/May 2024",
              "last_unflagged": 1714543200000
            },
            "completed": false,
            "completed_at": 0,
            "storage_completed": false,
            "storage_completed_at": 0
          },
          "deleted": false,
          "hidden": false,
          "boosts": 0,
          "server_list_favicon": "data:image/png;base64,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",
          "server_list_motd": ["",{"text":" "},{"text":"❤","color":"#f41643"},{"text":" "},{"text":"L","bold":true,"color":"#f41643"},{"text":"I","bold":true,"color":"#f52552"},{"text":"F","bold":true,"color":"#f73462"},{"text":"E","bold":true,"color":"#f84271"},{"text":"S","bold":true,"color":"#fa5180"},{"text":"T","bold":true,"color":"#fb608f"},{"text":"E","bold":true,"color":"#fc6f9f"},{"text":"A","bold":true,"color":"#fe7dae"},{"text":"L","bold":true,"color":"#ff8cbd"},{"text":" "},{"text":"❤","color":"#f41643"},{"text":"\n"},{"text":" "},{"text":"1.21+ ","color":"#ff8cbd"},{"text":"-","color":"white","bold":true},{"text":" ","color":"#ff8cbd"},{"text":"Lifesteal & Random Kits ","color":"#d3d3d3","italic":true}],
          "minehut_plugins": [],
          "icon": "GOLDEN_APPLE",
          "online": true,
          "maxPlayers": 10,
          "playerCount": 108,
          "rawPlan": "EXTERNAL",
          "activeServerPlan": "External Server"
        }
      };
    }

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
        "server_list_favicon": server.server_list_favicon || null,
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
