export const OP_CODES = {
  OP_Unknown       : 0x0000,
  OP_ExploreUnknown: 0x0000, // used for unknown explorer

  // world packets
  OP_ApproveWorld        : 0x3c25, // ShowEQ 10/27/05
  OP_LogServer           : 0x0fa6, // ShowEQ 10/27/05
  OP_MOTD                : 0x024d, // ShowEQ 10/27/05
  OP_SendLoginInfo       : 0x4dd0, // ShowEQ 10/27/05
  OP_DeleteCharacter     : 0x26c9, // ShowEQ 10/27/05
  OP_SendCharInfo        : 0x4513, // ShowEQ 10/27/05
  OP_ExpansionInfo       : 0x04ec, // ShowEQ 10/27/05
  OP_CharacterCreate     : 0x10b2, // EQEmu 11/28/05
  OP_RandomNameGenerator : 0x23d4, // EQEmu 11/28/05
  OP_GuildsList          : 0x6957, // same as zone guild list afaik
  OP_ApproveName         : 0x3ea6, // EQEmu 11/28/05
  OP_EnterWorld          : 0x7cba, // ShowEQ 10/27/05
  OP_PostEnterWorld      : 0x52a4, // EQEmu 06/29/05
  OP_World_Client_CRC1   : 0x5072, // ShowEQ 10/27/05
  OP_World_Client_CRC2   : 0x5b18, // ShowEQ 10/27/05
  OP_SetChatServer       : 0x00d7, // ShowEQ 10/27/05
  OP_SetChatServer2      : 0x6536, // ShowEQ 10/27/05
  OP_ZoneServerInfo      : 0x61b6, // ShowEQ 10/27/05
  OP_WorldComplete       : 0x509d, // ShowEQ 10/27/05
  OP_ZoneUnavail         : 0x407c,
  OP_WorldClientReady    : 0x5e99, // EQEmu 11/28/05 (Guess - Doodman)
  OP_WorldUnknown001     : 0x0000, // EQEmu 06/29/05 (New to 6/29)
  OP_CharacterStillInZone: 0x60fa, // world->client. reject.
  OP_WorldChecksumFailure: 0x7d37, // world->client. reject.
  OP_WorldLoginFailed    : 0x8da7, // world->client. reject.
  OP_WorldLogout         : 0x7718, // client->world
  OP_WorldLevelTooHigh   : 0x583b, // world->client. Cancels zone in.
  OP_CharInacessable     : 0x436a, // world->client. Cancels zone in.

  // Zone in opcodes
  OP_ZoneEntry       : 0x7213, // ShowEQ 10/27/05
  OP_ZoneInUnknown   : 0x0000,
  OP_AckPacket       : 0x7752, // ShowEQ 10/27/05
  OP_NewZone         : 0x0920, // ShowEQ 10/27/05
  OP_ReqClientSpawn  : 0x0322, // ShowEQ 10/27/05, may actually be 0x5966
  OP_ZoneSpawns      : 0x2e78, // ShowEQ 10/27/05
  OP_CharInventory   : 0x5394, // EQEmu 06/29/05
  OP_SetServerFilter : 0x6563, // ShowEQ 10/27/05
  OP_LockoutTimerInfo: 0x7f63,
  OP_SendZonepoints  : 0x3eba, // ShowEQ 10/27/05
  OP_SpawnDoor       : 0x4c24, // ShowEQ 10/27/05
  OP_ReqNewZone      : 0x7ac5, // ShowEQ 10/27/05
  OP_PlayerProfile   : 0x75df, // ShowEQ 10/27/05
  OP_TimeOfDay       : 0x1580, // ShowEQ 10/27/05
  OP_ZoneServerReady : 0x0000, // dosent exist in this version

  OP_Logout        : 0x61ff,
  OP_LogoutReply   : 0x3cdc, // 0x48c2		//0x0F66	is not quite right.. this causes disconnect error...
  OP_PreLogoutReply: 0x711e, // 0 len packet sent during logout/zoning
  OP_LevelUpdate   : 0x6d44,
  OP_Stamina       : 0x7a83, // ShowEQ 10/27/05

  // Petition Opcodes
  OP_PetitionSearch       : 0x0000, // search term for petition
  OP_PetitionSearchResults: 0x0000, // (list of?) matches from search
  OP_PetitionSearchText   : 0x0000, // text results of search
  OP_Petition             : 0x251f,
  OP_PetitionUpdate       : 0x0000, // guess
  OP_PetitionCheckout     : 0x0000,
  OP_PetitionCheckIn      : 0x0000,
  OP_PetitionQue          : 0x33c3,
  OP_PetitionUnCheckout   : 0x0000,
  OP_PetitionDelete       : 0x5692,
  OP_DeletePetition       : 0x0000,
  OP_PetitionResolve      : 0x0000, // 0x0000
  OP_PDeletePetition      : 0x0000,
  OP_PetitionBug          : 0x0000,
  OP_PetitionRefresh      : 0x0000,
  OP_PetitionCheckout2    : 0x0000,
  OP_PetitionViewPetition : 0x0000,

  // Guild Opcodes
  // list to client : 0x0F4D, 0x147d, 0x18B7, 0x2ec9, 0x3230, 0x32CF, 0x461A, 0x4CC7
  // 0x6966, 0x712A, 0x754E, 0x7C32, 0x7C59
  // some from client: 0x7825
  OP_ZoneGuildList         : 0x6957,
  OP_GetGuildMOTD          : 0x7fec,
  OP_GetGuildMOTDReply     : 0x3246,
  OP_GuildMemberList       : 0x147d, // ShowEQ 10/27/05
  OP_GuildMemberUpdate     : 0x0f4d, // ShowEQ 10/27/05
  OP_GuildMemberLevelUpdate: 0x0000, // dosent exist in this version
  OP_GuildRemove           : 0x0179,
  OP_GuildPeace            : 0x215a,
  OP_GuildWar              : 0x0c81,
  OP_GuildLeader           : 0x12b1,
  OP_GuildDemote           : 0x4eb9,
  OP_GuildMOTD             : 0x475a,
  OP_SetGuildMOTD          : 0x591c,
  OP_GetGuildsList         : 0x0000,
  OP_GuildInvite           : 0x18b7,
  OP_GuildPublicNote       : 0x17a2, // ShowEQ 10/27/05
  OP_GuildDelete           : 0x6cce,
  OP_GuildInviteAccept     : 0x61d0,
  // ,OP_GuildManageRemove:0x0000
  // ,OP_GuildManageAdd:0x0000
  // ,OP_GuildManageStatus:0x0000
  OP_GuildManageBanker     : 0x3d1e,
  OP_GuildBank             : 0xb4ab,
  OP_SetGuildRank          : 0x6966,
  OP_LFGuild               : 0x1858,

  // GM/guide opcodes
  OP_GMServers     : 0x3387, // /servers
  OP_GMBecomeNPC   : 0x7864, // /becomenpc
  OP_GMZoneRequest : 0x1306, // /zone
  OP_GMSearchCorpse: 0x3c32, // /searchcorpse
  OP_GMHideMe      : 0x15b2, // /hideme
  OP_GMGoto        : 0x1cee, // /goto
  OP_GMDelCorpse   : 0x0b2f, // /delcorpse
  OP_GMApproval    : 0x0c0f, // /approval
  OP_GMToggle      : 0x7fea, // /toggletell
  OP_GMZoneRequest2: 0x244c,
  OP_GMSummon      : 0x1edc, // /summon
  OP_GMEmoteZone   : 0x39f2, // /emotezone
  OP_GMEmoteWorld  : 0x3383, // /emoteworld (not implemented)
  OP_GMFind        : 0x5930, // /find
  OP_GMKick        : 0x692c, // /kick
  OP_GMNameChange  : 0x0000,

  OP_SafePoint            : 0x0000,
  OP_Bind_Wound           : 0x601d,
  OP_GMTraining           : 0x238f,
  OP_GMEndTraining        : 0x613d,
  OP_GMTrainSkill         : 0x11d2,
  // ,OP_GMEndTrainingResponse:0x0000
  OP_Animation            : 0x2acf, // ShowEQ 10/27/05
  OP_Stun                 : 0x1e51,
  OP_MoneyUpdate          : 0x267c,
  OP_SendExpZonein        : 0x0587, // ShowEQ 10/27/05
  OP_IncreaseStats        : 0x5b7b,
  OP_CrashDump            : 0x7825,
  OP_ReadBook             : 0x1496,
  OP_Dye                  : 0x00dd, // ShowEQ 10/27/05
  OP_Consume              : 0x77d6, // ShowEQ 10/27/05
  OP_Begging              : 0x13e7, // ShowEQ 10/27/05
  OP_InspectRequest       : 0x775d, // ShowEQ 10/27/05
  OP_InspectAnswer        : 0x2403, // ShowEQ 10/27/05
  OP_Action2              : 0x0000,
  OP_BeginCast            : 0x3990, // ShowEQ 10/27/05
  OP_ColoredText          : 0x0b2d, // ShowEQ 10/27/05
  OP_Consent              : 0x1081, // ShowEQ 10/27/05
  OP_ConsentDeny          : 0x4e8c, // ShowEQ 10/27/05
  OP_ConsentResponse      : 0x6380, // ShowEQ 10/27/05
  OP_LFGCommand           : 0x68ac, // ShowEQ 10/27/05
  OP_LFGGetMatchesRequest : 0x022f, // ShowEQ 10/27/05
  OP_LFGAppearance        : 0x1a85,
  OP_LFGResponse          : 0x0000,
  OP_LFGGetMatchesResponse: 0x45d0, // ShowEQ 10/27/05
  OP_LootItem             : 0x7081, // ShowEQ 10/27/05
  OP_Bug                  : 0x7ac2, // ShowEQ 10/27/05
  OP_BoardBoat            : 0x4298, // ShowEQ 10/27/05
  OP_Save                 : 0x736b, // ShowEQ 10/27/05
  OP_Camp                 : 0x78c1, // ShowEQ 10/27/05
  OP_EndLootRequest       : 0x2316, // ShowEQ 10/27/05
  OP_MemorizeSpell        : 0x308e, // ShowEQ 10/27/05
  OP_LinkedReuse          : 0x6a00,
  OP_SwapSpell            : 0x2126, // ShowEQ 10/27/05
  OP_CastSpell            : 0x304b, // ShowEQ 10/27/05
  OP_DeleteSpell          : 0x4f37,
  OP_LoadSpellSet         : 0x403e, // ShowEQ 10/27/05
  OP_AutoAttack           : 0x5e55, // ShowEQ 10/27/05
  OP_AutoFire             : 0x6c53,
  OP_Consider             : 0x65ca, // ShowEQ 10/27/05
  OP_Emote                : 0x547a, // ShowEQ 10/27/05
  OP_PetCommands          : 0x10a1, // ShowEQ 10/27/05
  OP_PetBuffWindow        : 0x4e31,
  OP_SpawnAppearance      : 0x7c32, // ShowEQ 10/27/05
  OP_DeleteSpawn          : 0x55bc, // ShowEQ 10/27/05
  OP_FormattedMessage     : 0x5a48, // ShowEQ 10/27/05
  OP_WhoAllRequest        : 0x5cdd, // ShowEQ 10/27/05
  OP_WhoAllResponse       : 0x757b, // ShowEQ 10/27/05
  OP_AutoAttack2          : 0x0701, // ShowEQ 10/27/05
  OP_SetRunMode           : 0x4aba, // ShowEQ 10/27/05
  OP_SimpleMessage        : 0x673c, // ShowEQ 10/27/05
  OP_SaveOnZoneReq        : 0x1540, // ShowEQ 10/27/05
  OP_SenseHeading         : 0x05ac, // ShowEQ 10/27/05
  OP_Buff                 : 0x6a53, // ShowEQ 10/27/05
  OP_LootComplete         : 0x0a94, // ShowEQ 10/27/05
  OP_EnvDamage            : 0x31b3, // ShowEQ 10/27/05
  OP_Split                : 0x4848, // ShowEQ 10/27/05
  OP_Surname              : 0x4668, // ShowEQ 10/27/05
  OP_ClearSurname         : 0x6cdb,
  OP_MoveItem             : 0x420f, // ShowEQ 10/27/05
  OP_MoveMultipleItems    : 0x463b,
  OP_FaceChange           : 0x0f8e, // ShowEQ 10/27/05
  OP_ItemPacket           : 0x3397, // ShowEQ 10/27/05
  OP_ItemLinkResponse     : 0x667c, // ShowEQ 10/27/05
  OP_ClientReady          : 0x5e20, // ShowEQ 10/27/05
  OP_ZoneChange           : 0x5dd8, // ShowEQ 10/27/05
  OP_ItemLinkClick        : 0x53e5, // ShowEQ 10/27/05
  OP_Forage               : 0x4796,
  OP_BazaarSearch         : 0x1ee9, // ShowEQ 10/27/05
  OP_NewSpawn             : 0x1860, // ShowEQ 10/27/05
  // a similar unknonw packet to NewSpawn: 0x12b2
  OP_WearChange           : 0x7441, // ShowEQ 10/27/05
  OP_Action               : 0x497c, // ShowEQ 10/27/05
  OP_SpecialMesg          : 0x2372, // ShowEQ 10/27/05
  OP_Bazaar               : 0x0000,
  OP_LeaveBoat            : 0x67c9, // ShowEQ 10/27/05
  OP_Weather              : 0x254d, // ShowEQ 10/27/05
  OP_LFPGetMatchesRequest : 0x35a6, // ShowEQ 10/27/05
  OP_Illusion             : 0x448d, // ShowEQ 10/27/05
  OP_TargetReject         : 0x0000,
  OP_TargetCommand        : 0x1477,
  OP_TargetMouse          : 0x6c47, // ShowEQ 10/27/05
  OP_TargetHoTT           : 0x6a12,
  OP_GMKill               : 0x6980, // ShowEQ 10/27/05
  OP_MoneyOnCorpse        : 0x7fe4, // ShowEQ 10/27/05
  OP_ClickDoor            : 0x043b, // ShowEQ 10/27/05
  OP_MoveDoor             : 0x700d, // ShowEQ 10/27/05
  OP_RemoveAllDoors       : 0x77d0,
  OP_LootRequest          : 0x6f90, // ShowEQ 10/27/05
  OP_YellForHelp          : 0x61ef, // ShowEQ 10/27/05
  OP_ManaChange           : 0x4839, // ShowEQ 10/27/05
  OP_LFPCommand           : 0x6f82, // ShowEQ 10/27/05
  OP_RandomReply          : 0x6cd5, // ShowEQ 10/27/05
  OP_DenyResponse         : 0x7c66, // ShowEQ 10/27/05
  OP_ConsiderCorpse       : 0x773f, // ShowEQ 10/27/05
  OP_CorpseDrag           : 0x50c0, //
  OP_CorpseDrop           : 0x7c7c, //
  OP_ConfirmDelete        : 0x3838, // ShowEQ 10/27/05
  OP_MobHealth            : 0x0695, // ShowEQ 10/27/05
  OP_SkillUpdate          : 0x6a93, // ShowEQ 10/27/05
  OP_RandomReq            : 0x5534, // ShowEQ 10/27/05
  OP_ClientUpdate         : 0x14cb, // ShowEQ 10/27/05
  OP_Report               : 0x7f9d,
  OP_GroundSpawn          : 0x0f47, // ShowEQ 10/27/05
  OP_LFPGetMatchesResponse: 0x06c5,
  OP_Jump                 : 0x0797, // ShowEQ 10/27/05
  OP_ExpUpdate            : 0x5ecd, // ShowEQ 10/27/05
  OP_Death                : 0x6160, // ShowEQ 10/27/05
  OP_BecomeCorpse         : 0x4dbc,
  OP_GMLastName           : 0x23a1, // ShowEQ 10/27/05
  OP_InitialMobHealth     : 0x3d2d, // ShowEQ 10/27/05
  OP_Mend                 : 0x14ef, // ShowEQ 10/27/05
  OP_MendHPUpdate         : 0x0000,
  OP_Feedback             : 0x5306, // ShowEQ 10/27/05
  OP_TGB                  : 0x0c11, // ShowEQ 10/27/05
  OP_InterruptCast        : 0x0b97,
  OP_Damage               : 0x5c78, // ShowEQ 10/27/05
  OP_ChannelMessage       : 0x1004, // ShowEQ 10/27/05
  OP_LevelAppearance      : 0x358e,
  OP_MultiLineMsg         : 0x0000,
  OP_Charm                : 0x12e5,
  OP_ApproveZone          : 0x0000,
  OP_Assist               : 0x7709,
  OP_AssistGroup          : 0x5104,
  OP_AugmentItem          : 0x539b,
  OP_BazaarInspect        : 0x0000,
  OP_ClientError          : 0x0000,
  OP_DeleteItem           : 0x4d81,
  OP_DeleteCharge         : 0x1c4a,
  OP_ControlBoat          : 0x2c81,
  OP_DumpName             : 0x0000,
  OP_FeignDeath           : 0x7489,
  OP_Heartbeat            : 0x0000,
  OP_ItemName             : 0x0000,
  OP_LDoNButton           : 0x13c8,
  OP_MoveCoin             : 0x7657,
  OP_ReloadUI             : 0x0000,
  OP_ZonePlayerToBind     : 0x385e, // FNW Discovered on Feb 9, 2007
  OP_Rewind               : 0x4cfa, // Lieka 4/20/08: /rewind command
  OP_Translocate          : 0x8258,
  OP_Sacrifice            : 0x727a,
  OP_KeyRing              : 0x68c4,
  OP_ApplyPoison          : 0x0c2c,
  OP_AugmentInfo          : 0x45ff, // RealityIncarnate 4/28/09
  OP_SetStartCity         : 0x41dc, // realityincarnate 6/25/09
  OP_SpellEffect          : 0x22c5,
  OP_RemoveNimbusEffect   : 0x0000,
  OP_CrystalReclaim       : 0x7cfe,
  OP_CrystalCreate        : 0x62c3,
  OP_Marquee              : 0x1d4d,
  OP_CancelSneakHide      : 0x48c2,

  OP_DzQuit                    : 0x486d,
  OP_DzListTimers              : 0x39aa,
  OP_DzAddPlayer               : 0x7fba,
  OP_DzRemovePlayer            : 0x540b,
  OP_DzSwapPlayer              : 0x794a,
  OP_DzMakeLeader              : 0x0ce9,
  OP_DzPlayerList              : 0xada0,
  OP_DzExpeditionInvite        : 0x3817,
  OP_DzExpeditionInviteResponse: 0x5da9,
  OP_DzExpeditionInfo          : 0x98e,
  OP_DzExpeditionLockoutTimers : 0x7c12,
  OP_DzMemberList              : 0x9b6,
  OP_DzMemberListName          : 0x1826,
  OP_DzMemberListStatus        : 0x330d,
  OP_DzSetLeaderName           : 0x7abc,
  OP_DzExpeditionEndsWarning   : 0x1c3f,
  OP_DzCompass                 : 0x28aa,
  OP_DzChooseZone              : 0x1022,
  OP_DzChooseZoneReply         : 0x20e7,

  // bazaar trader stuff stuff:
  // become and buy from
  // Server->Client: [ Opcode: ,OP_Unknown (0x0000) Size: 8 ]
  //   0: 46 01 00 00 39 01 00 00                            | F...9...
  OP_TraderDelItem   : 0x0da9,
  OP_BecomeTrader    : 0x2844,
  OP_TraderShop      : 0x35e8,
  OP_TraderItemUpdate: 0x0000,
  OP_Trader          : 0x524e,
  OP_ShopItem        : 0x0000,
  OP_TraderBuy       : 0x6dd8, // ShowEQ 10/27/05
  OP_Barter          : 0x7460,

  // pc/npc trading
  OP_TradeRequest    : 0x372f,
  OP_TradeAcceptClick: 0x0065, // ShowEQ 10/27/05
  OP_TradeRequestAck : 0x4048, // ShowEQ 10/27/05
  OP_TradeCoins      : 0x34c1, // guess...
  OP_FinishTrade     : 0x6014,
  OP_CancelTrade     : 0x2dc1, // ShowEQ 10/27/05
  OP_TradeBusy       : 0x6839, //
  OP_TradeMoneyUpdate: 0x0000, // not sure

  // merchant crap
  OP_ShopPlayerSell: 0x0e13, // ShowEQ 10/27/05
  OP_ShopEnd       : 0x7e03, // ShowEQ 10/27/05
  OP_ShopEndConfirm: 0x20b2,
  OP_ShopPlayerBuy : 0x221e,
  OP_ShopRequest   : 0x45f9, // ShowEQ 10/27/05
  OP_ShopDelItem   : 0x0da9,

  // tradeskill stuff:
  // something 0x21ed (8)
  // something post combine 0x5f4e (8)
  OP_ClickObject      : 0x3bc2, // ShowEQ 10/27/05
  OP_ClickObjectAction: 0x6937,
  OP_ClearObject      : 0x21ed, // was 0x711e
  // 0x711e of len 0 comes right after ,OP_ClickObjectAck from server
  OP_RecipeDetails    : 0x4ea2,
  OP_RecipesFavorite  : 0x23f0,
  OP_RecipesSearch    : 0x164d,
  OP_RecipeReply      : 0x31f8,
  OP_RecipeAutoCombine: 0x0353,
  OP_TradeSkillCombine: 0x0b40,

  OP_RequestDuel: 0x28e1,
  OP_DuelDecline: 0x3bad,
  OP_DuelAccept : 0x1b09, // when accepted

  OP_RezzComplete   : 0x4b05,
  OP_RezzRequest    : 0x1035,
  OP_RezzAnswer     : 0x6219,
  OP_SafeFallSuccess: 0x3b21,
  OP_Shielding      : 0x3fe6,
  OP_TestBuff       : 0x6ab0, // /testbuff
  OP_Track          : 0x5d11, // ShowEQ 10/27/05
  OP_TrackTarget    : 0x7085,
  OP_TrackUnknown   : 0x6177, // size 0 right after ,OP_Track

  // Tribute Packets:
  OP_OpenGuildTributeMaster: 0x0000,
  OP_OpenTributeMaster     : 0x512e, // open tribute master window
  OP_OpenTributeReply      : 0x27b3, // reply to open request
  OP_SelectTribute         : 0x625d, // clicking on a tribute, and text reply
  OP_TributeItem           : 0x6f6c, // donating an item
  OP_TributeMoney          : 0x27b3, // donating money
  OP_TributeNPC            : 0x7f25, // seems to be missing now
  OP_TributeToggle         : 0x2688, // activating/deactivating tribute
  OP_TributeTimer          : 0x4665, // testing		//a 4 byte tier update, 10 minutes for seconds
  OP_TributePointUpdate    : 0x6463, // 16 byte point packet
  OP_TributeUpdate         : 0x5639, // ShowEQ 10/27/05
  OP_GuildTributeInfo      : 0x5e3d, // ShowEQ 10/27/05
  OP_TributeInfo           : 0x152d,
  OP_SendGuildTributes     : 0x5e3a, // request packet, 4 bytes
  OP_SendTributes          : 0x067a, // request packet, 4 bytes, migth be backwards
  // 27b3 4665

  // Adventure packets:
  OP_LeaveAdventure             : 0x0c0d,
  OP_AdventureFinish            : 0x3906,
  OP_AdventureInfoRequest       : 0x2aaf, // right click adventure recruiter
  OP_AdventureInfo              : 0x1db5, // text reply to right click
  OP_AdventureRequest           : 0x43fd,
  OP_AdventureDetails           : 0x3f26,
  OP_AdventureData              : 0x0677,
  OP_AdventureUpdate            : 0x64ac,
  OP_AdventureMerchantRequest   : 0x0950,
  OP_AdventureMerchantResponse  : 0x4416,
  OP_AdventureMerchantPurchase  : 0x413d,
  OP_AdventureMerchantSell      : 0x0097,
  OP_AdventurePointsUpdate      : 0x420a, // not sure, followed purchase
  OP_AdventureStatsRequest      : 0x5fc7,
  OP_AdventureStatsReply        : 0x56cd,
  OP_AdventureLeaderboardRequest: 0x230a,
  OP_AdventureLeaderboardReply  : 0x0d0f,
  // request stats: 0x5fc7, reply 0x56cd?
  // request leaderboard: 0x230a?, reply 0x0d0f?

  // Group Opcodes
  OP_GroupDisband     : 0x0e76, // ShowEQ 10/27/05
  OP_GroupInvite      : 0x1b48, // ShowEQ 10/27/05
  OP_GroupFollow      : 0x7bc7, // ShowEQ 10/27/05
  OP_GroupUpdate      : 0x2dd6, // ShowEQ 10/27/05
  OP_GroupAcknowledge : 0x0000,
  OP_GroupCancelInvite: 0x1f27, // ShowEQ 10/27/05
  OP_GroupDelete      : 0x0000,
  OP_GroupFollow2     : 0x0000, // used in conjunction with ,OP_GroupInvite2
  OP_GroupInvite2     : 0x12d6, // sometimes sent instead of ,OP_GroupInvite
  OP_CancelInvite     : 0x0000,

  OP_RaidJoin  : 0x1f21, // ShowEQ 10/27/05
  OP_RaidInvite: 0x5891, // ShowEQ 10/27/05
  OP_RaidUpdate: 0x1f21, // EQEmu 06/29/05

  OP_InspectBuffs: 0x4fb6,

  OP_ZoneComplete     : 0x0000,
  OP_ItemLinkText     : 0x0000,
  OP_DisciplineUpdate : 0x7180,
  OP_DisciplineTimer  : 0x53df,
  OP_LocInfo          : 0x0000,
  OP_FindPersonRequest: 0x3c41, // ShowEQ 10/27/05
  OP_FindPersonReply  : 0x5711, // ShowEQ 10/27/05
  OP_ForceFindPerson  : 0x0000,
  OP_LoginComplete    : 0x0000,
  OP_Sound            : 0x541e,
  OP_CashReward       : 0x4c8c, // maybe
  // ,OP_Zone_MissingName01:0x0000		//remove on recompile
  OP_MobRename        : 0x0498, // ShowEQ 10/27/05
  OP_BankerChange     : 0x6a5b,

  // Button-push commands
  OP_Taunt        : 0x5e48,
  OP_CombatAbility: 0x5ee8,
  OP_SenseTraps   : 0x5666, // ShowEQ 10/27/05
  OP_PickPocket   : 0x2ad8,
  OP_DisarmTraps  : 0x1241,
  OP_Disarm       : 0x17d9,
  OP_Hide         : 0x4312,
  OP_Sneak        : 0x74e1,
  OP_Fishing      : 0x0b36,
  OP_InstillDoubt : 0x389e, // intimidation
  OP_LDoNOpen     : 0x083b,

  // Task packets
  OP_TaskActivityComplete    : 0x54eb,
  OP_CompletedTasks          : 0x76a2, // ShowEQ 10/27/05
  OP_TaskDescription         : 0x5ef7, // ShowEQ 10/27/05
  OP_TaskActivity            : 0x682d, // ShowEQ 10/27/05
  OP_TaskSelectWindow        : 0x5e7c,
  OP_AvaliableTask           : 0x0000,
  OP_AcceptNewTask           : 0x207f,
  OP_TaskHistoryRequest      : 0x5df4,
  OP_TaskHistoryReply        : 0x397d,
  OP_CancelTask              : 0x3ba8,
  OP_DeclineAllTasks         : 0x0000, // not sure, 12 bytes
  OP_TaskMemberInvite        : 0x79b4,
  OP_TaskMemberInviteResponse: 0x0358,
  OP_TaskMemberChange        : 0x5886,
  OP_TaskMakeLeader          : 0x1b25,
  OP_TaskAddPlayer           : 0x6bc4,
  OP_TaskRemovePlayer        : 0x37b9,
  OP_TaskRequestTimer        : 0x6a1d,
  // task complete related: 0x0000 (24 bytes), 0x0000 (8 bytes), 0x0000 (4 bytes)

  // Shared Tasks
  OP_SharedTaskMemberList    : 0x722f, //
  OP_SharedTaskRemovePlayer  : 0x37b9, // /taskremoveplayer
  OP_SharedTaskAddPlayer     : 0x6934, // /taskaddplayer
  OP_SharedTaskMakeLeader    : 0x1b25, // /taskmakeleader
  OP_SharedTaskInvite        : 0x79b4, // Dialog window
  OP_SharedTaskInviteResponse: 0x0358, // Dialog window response
  OP_SharedTaskAcceptNew     : 0x194d, // Not sure why this has a separate handler
  OP_SharedTaskMemberChange  : 0x5886, // Not sure yet?
  OP_TaskTimers              : 0x6a1d, // /tasktimers
  OP_SharedTaskQuit          : 0x35dd, // /taskquit
  OP_SharedTaskSelectWindow  : 0x013f,
  OP_SharedTaskPlayerList    : 0x3961, // /taskplayerlist

  OP_RequestClientZoneChange: 0x7834, // ShowEQ 10/27/05

  OP_SendAATable             : 0x367d, // ShowEQ 10/27/05
  OP_ClearAA                 : 0x5918,
  OP_ClearLeadershipAbilities: 0x7416,
  OP_UpdateAA                : 0x5966,
  OP_RespondAA               : 0x3af4,
  OP_SendAAStats             : 0x5996, // ShowEQ 10/27/05
  OP_AAAction                : 0x0681, // ShowEQ 10/27/05
  OP_AAExpUpdate             : 0x5f58, // ShowEQ 10/27/05

  OP_PurchaseLeadershipAA    : 0x17bf,
  OP_UpdateLeadershipAA      : 0x07f1,
  OP_LeadershipExpUpdate     : 0x596e,
  OP_LeadershipExpToggle     : 0x5b37,
  OP_MarkNPC                 : 0x5483,
  OP_ClearNPCMarks           : 0x3ef6,
  OP_DoGroupLeadershipAbility: 0x569e,
  OP_DelegateAbility         : 0x10f4,
  OP_SetGroupTarget          : 0x3eec,

  // The following 4 Opcodes are for SoF only:
  OP_FinishWindow     : 0x0000, // Trevius 03/15/09
  OP_FinishWindow2    : 0x0000, // Trevius 03/15/09
  OP_ItemVerifyRequest: 0x0000, // Trevius 03/15/09
  OP_ItemVerifyReply  : 0x0000, // Trevius 03/15/09

  // discovered opcodes not yet used:
  OP_PlayMP3                     : 0x26ab,
  OP_FriendsWho                  : 0x48fe,
  OP_MoveLogRequest              : 0x7510, // gone I think
  OP_MoveLogDisregard            : 0x0000, // gone I think
  OP_ReclaimCrystals             : 0x7cfe,
  OP_CrystalCountUpdate          : 0x0ce3,
  OP_DynamicWall                 : 0x0000,
  OP_CustomTitles                : 0x2a28, // ShowEQ 10/27/05
  OP_NewTitlesAvailable          : 0x4eca, //
  OP_RequestTitles               : 0x5eba, //
  OP_SendTitleList               : 0x3e89, // EQEmu 06/29/05
  OP_SetTitle                    : 0x1f22, //
  OP_SetTitleReply               : 0x5eab, //
  OP_Bandolier                   : 0x6f0c,
  OP_PotionBelt                  : 0x0719,
  OP_OpenDiscordMerchant         : 0x0000, // 8 bytes
  OP_DiscordMerchantInventory    : 0x0000, // long item packet
  OP_GiveMoney                   : 0x0000, // 16 bytes, pp, gp, sp, cp.
  OP_OnLevelMessage              : 0x1dde,
  OP_PopupResponse               : 0x3816,
  OP_RequestKnowledgeBase        : 0x0000,
  OP_KnowledgeBase               : 0x0000,
  OP_SlashAdventure              : 0x571a, // /adventure
  OP_VetRewardsAvaliable         : 0x0557,
  OP_VetClaimRequest             : 0x6ba0,
  OP_VetClaimReply               : 0x407e,
  OP_BecomePVPPrompt             : 0x36b2, // guessed from ASM
  OP_PVPStats                    : 0x5cc0,
  OP_PVPLeaderBoardRequest       : 0x61d2,
  OP_PVPLeaderBoardReply         : 0x1a59,
  OP_PVPLeaderBoardDetailsRequest: 0x06a2,
  OP_PVPLeaderBoardDetailsReply  : 0x246a,
  OP_PickLockSuccess             : 0x40e7,
  OP_WeaponEquip1                : 0x6c5e,
  OP_PlayerStateAdd              : 0x63da,
  OP_PlayerStateRemove           : 0x381d,
  OP_VoiceMacroIn                : 0x2866, // Client to Server
  OP_VoiceMacroOut               : 0x2ec6, // Server to Client
  OP_CameraEffect                : 0x0937, // Correct
  OP_UnderWorld                  : 0x7186, // clients sends up when they detect an underworld issue, might be useful for cheat detection

  // named unknowns, to make looking for real unknown easier
  OP_AnnoyingZoneUnknown: 0x729c,
  OP_Some6ByteHPUpdate  : 0x0000, // seems to happen when you target group members
  OP_SomeItemPacketMaybe: 0x4033, // EQEmu 06/29/05
  OP_QueryResponseThing : 0x1974,
  OP_FloatListThing     : 0x6a1b, // EQEmu 06/29/05

  // Login opcodes
  OP_SessionReady         : 0x0001,
  OP_Login                : 0x0002,
  OP_ServerListRequest    : 0x0004,
  OP_PlayEverquestRequest : 0x000d,
  OP_PlayEverquestResponse: 0x0021,
  OP_ChatMessage          : 0x0016,
  OP_LoginAccepted        : 0x0017,
  OP_ServerListResponse   : 0x0018,
  OP_Poll                 : 0x0029,
  OP_EnterChat            : 0x000f,
  OP_PollResponse         : 0x0011,

  // raw opcodes
  OP_RAWSessionRequest     : 0x0000,
  OP_RAWSessionResponse    : 0x0000,
  OP_RAWCombined           : 0x0000,
  OP_RAWSessionDisconnect  : 0x0000,
  OP_RAWKeepAlive          : 0x0000,
  OP_RAWSessionStatRequest : 0x0000,
  OP_RAWSessionStatResponse: 0x0000,
  OP_RAWPacket             : 0x0000,
  OP_RAWFragment           : 0x0000,
  OP_RAWOutOfOrderAck      : 0x0000,
  OP_RAWAck                : 0x0000,
  OP_RAWAppCombined        : 0x0000,
  OP_RAWOutOfSession       : 0x0000,

  // mail opcodes
  OP_Command      : 0x0000,
  OP_MailboxHeader: 0x0000,
  OP_MailHeader   : 0x0000,
  OP_MailBody     : 0x0000,
  OP_NewMail      : 0x0000,
  OP_SentConfirm  : 0x0000,

  OP_MobUpdate: 0x0000, // not used anymore, here for backwards compat

  // we need to document the differences between these packets to make identifying them easier
  OP_MobHealth        : 0x0695,
  OP_HPUpdate         : 0x3bcf, // ShowEQ 10/27/05
  OP_Some3ByteHPUpdate: 0x0000, // initial HP update for mobs
  OP_InitialHPUpdate  : 0x0000
};

export const getOpCode = buffer => {
  const view = new DataView(buffer, 0);
  return view.getUint16(0, true);
};

export const getOpCodeDesc = buffer => {
  const view = new DataView(buffer, 0);
  const opCode = view.getUint16(0, true);
  for (const [entry, val] of Object.entries(OP_CODES)) {
    if (val === opCode) {
      return entry;
    }
  }
  return OP_CODES.OP_Unknown;
};
