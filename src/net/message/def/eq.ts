/* eslint-disable */

export enum ItemPacketType {
    ItemPacketViewLink = 'ItemPacketViewLink',
    ItemPacketTradeView = 'ItemPacketTradeView',
    ItemPacketLoot = 'ItemPacketLoot',
    ItemPacketTrade = 'ItemPacketTrade',
    ItemPacketCharInventory = 'ItemPacketCharInventory',
    ItemPacketSummonItem = 'ItemPacketSummonItem',
    ItemPacketTributeItem = 'ItemPacketTributeItem',
    ItemPacketMerchant = 'ItemPacketMerchant',
    ItemPacketWorldContainer = 'ItemPacketWorldContainer',
}

export enum OpCodes {
    OP_Unknown = 'OP_Unknown',
    OP_LoginWeb = 'OP_LoginWeb',
    OP_LoginAccepted = 'OP_LoginAccepted',
    OP_PlayEverquestRequest = 'OP_PlayEverquestRequest',
    OP_PlayEverquestResponse = 'OP_PlayEverquestResponse',
    OP_ServerListRequest = 'OP_ServerListRequest',
    OP_ServerListResponse = 'OP_ServerListResponse',
    OP_EnterWorld = 'OP_EnterWorld',
    OP_SendLoginInfo = 'OP_SendLoginInfo',
    OP_WebInitiateConnection = 'OP_WebInitiateConnection',
    OP_SendCharInfo = 'OP_SendCharInfo',
    OP_ZoneServerInfo = 'OP_ZoneServerInfo',
    Nested_WorldServer = 'Nested_WorldServer',
    Nested_CharacterSelectEntry = 'Nested_CharacterSelectEntry',
    Nested_CharSelectEquip = 'Nested_CharSelectEquip',
    Nested_Tint = 'Nested_Tint',
    OP_ExploreUnknown = 'OP_ExploreUnknown',
    OP_0x0193 = 'OP_0x0193',
    OP_0x0347 = 'OP_0x0347',
    OP_AAAction = 'OP_AAAction',
    OP_AAExpUpdate = 'OP_AAExpUpdate',
    OP_AcceptNewTask = 'OP_AcceptNewTask',
    OP_AckPacket = 'OP_AckPacket',
    OP_Action = 'OP_Action',
    OP_Action2 = 'OP_Action2',
    OP_AddNimbusEffect = 'OP_AddNimbusEffect',
    OP_AdventureData = 'OP_AdventureData',
    OP_AdventureDetails = 'OP_AdventureDetails',
    OP_AdventureFinish = 'OP_AdventureFinish',
    OP_AdventureInfo = 'OP_AdventureInfo',
    OP_AdventureInfoRequest = 'OP_AdventureInfoRequest',
    OP_AdventureLeaderboardReply = 'OP_AdventureLeaderboardReply',
    OP_AdventureLeaderboardRequest = 'OP_AdventureLeaderboardRequest',
    OP_AdventureMerchantPurchase = 'OP_AdventureMerchantPurchase',
    OP_AdventureMerchantRequest = 'OP_AdventureMerchantRequest',
    OP_AdventureMerchantResponse = 'OP_AdventureMerchantResponse',
    OP_AdventureMerchantSell = 'OP_AdventureMerchantSell',
    OP_AdventurePointsUpdate = 'OP_AdventurePointsUpdate',
    OP_AdventureRequest = 'OP_AdventureRequest',
    OP_AdventureStatsReply = 'OP_AdventureStatsReply',
    OP_AdventureStatsRequest = 'OP_AdventureStatsRequest',
    OP_AdventureUpdate = 'OP_AdventureUpdate',
    OP_AggroMeterLockTarget = 'OP_AggroMeterLockTarget',
    OP_AggroMeterTargetInfo = 'OP_AggroMeterTargetInfo',
    OP_AggroMeterUpdate = 'OP_AggroMeterUpdate',
    OP_AltCurrency = 'OP_AltCurrency',
    OP_AltCurrencyMerchantReply = 'OP_AltCurrencyMerchantReply',
    OP_AltCurrencyMerchantRequest = 'OP_AltCurrencyMerchantRequest',
    OP_AltCurrencyPurchase = 'OP_AltCurrencyPurchase',
    OP_AltCurrencyReclaim = 'OP_AltCurrencyReclaim',
    OP_AltCurrencySell = 'OP_AltCurrencySell',
    OP_AltCurrencySellSelection = 'OP_AltCurrencySellSelection',
    OP_Animation = 'OP_Animation',
    OP_AnnoyingZoneUnknown = 'OP_AnnoyingZoneUnknown',
    OP_ApplyPoison = 'OP_ApplyPoison',
    OP_ApproveName = 'OP_ApproveName',
    OP_ApproveWorld = 'OP_ApproveWorld',
    OP_ApproveZone = 'OP_ApproveZone',
    OP_Assist = 'OP_Assist',
    OP_AssistGroup = 'OP_AssistGroup',
    OP_AugmentInfo = 'OP_AugmentInfo',
    OP_AugmentItem = 'OP_AugmentItem',
    OP_AutoAttack = 'OP_AutoAttack',
    OP_AutoAttack2 = 'OP_AutoAttack2',
    OP_AutoFire = 'OP_AutoFire',
    OP_Bandolier = 'OP_Bandolier',
    OP_BankerChange = 'OP_BankerChange',
    OP_Barter = 'OP_Barter',
    OP_Bazaar = 'OP_Bazaar',
    OP_BazaarInspect = 'OP_BazaarInspect',
    OP_BazaarSearch = 'OP_BazaarSearch',
    OP_BecomeCorpse = 'OP_BecomeCorpse',
    OP_BecomeTrader = 'OP_BecomeTrader',
    OP_Begging = 'OP_Begging',
    OP_BeginCast = 'OP_BeginCast',
    OP_Bind_Wound = 'OP_Bind_Wound',
    OP_BlockedBuffs = 'OP_BlockedBuffs',
    OP_BoardBoat = 'OP_BoardBoat',
    OP_BookButton = 'OP_BookButton',
    OP_Buff = 'OP_Buff',
    OP_BuffCreate = 'OP_BuffCreate',
    OP_BuffRemoveRequest = 'OP_BuffRemoveRequest',
    OP_Bug = 'OP_Bug',
    OP_CameraEffect = 'OP_CameraEffect',
    OP_Camp = 'OP_Camp',
    OP_CancelSneakHide = 'OP_CancelSneakHide',
    OP_CancelTask = 'OP_CancelTask',
    OP_CancelTrade = 'OP_CancelTrade',
    OP_CashReward = 'OP_CashReward',
    OP_CastSpell = 'OP_CastSpell',
    OP_ChangeSize = 'OP_ChangeSize',
    OP_ChannelMessage = 'OP_ChannelMessage',
    OP_CharacterCreate = 'OP_CharacterCreate',
    OP_CharacterCreateRequest = 'OP_CharacterCreateRequest',
    OP_CharInventory = 'OP_CharInventory',
    OP_Charm = 'OP_Charm',
    OP_ChatMessage = 'OP_ChatMessage',
    OP_ClearAA = 'OP_ClearAA',
    OP_ClearBlockedBuffs = 'OP_ClearBlockedBuffs',
    OP_ClearLeadershipAbilities = 'OP_ClearLeadershipAbilities',
    OP_ClearNPCMarks = 'OP_ClearNPCMarks',
    OP_ClearObject = 'OP_ClearObject',
    OP_ClearSurname = 'OP_ClearSurname',
    OP_ClickDoor = 'OP_ClickDoor',
    OP_ClickObject = 'OP_ClickObject',
    OP_ClickObjectAction = 'OP_ClickObjectAction',
    OP_ClientError = 'OP_ClientError',
    OP_ClientReady = 'OP_ClientReady',
    OP_ClientTimeStamp = 'OP_ClientTimeStamp',
    OP_ClientUpdate = 'OP_ClientUpdate',
    OP_CloseContainer = 'OP_CloseContainer',
    OP_CloseTributeMaster = 'OP_CloseTributeMaster',
    OP_ColoredText = 'OP_ColoredText',
    OP_CombatAbility = 'OP_CombatAbility',
    OP_Command = 'OP_Command',
    OP_CompletedTasks = 'OP_CompletedTasks',
    OP_ConfirmDelete = 'OP_ConfirmDelete',
    OP_Consent = 'OP_Consent',
    OP_ConsentDeny = 'OP_ConsentDeny',
    OP_ConsentResponse = 'OP_ConsentResponse',
    OP_Consider = 'OP_Consider',
    OP_ConsiderCorpse = 'OP_ConsiderCorpse',
    OP_Consume = 'OP_Consume',
    OP_ControlBoat = 'OP_ControlBoat',
    OP_CorpseDrag = 'OP_CorpseDrag',
    OP_CorpseDrop = 'OP_CorpseDrop',
    OP_CrashDump = 'OP_CrashDump',
    OP_CrystalCountUpdate = 'OP_CrystalCountUpdate',
    OP_CrystalCreate = 'OP_CrystalCreate',
    OP_CrystalReclaim = 'OP_CrystalReclaim',
    OP_CustomTitles = 'OP_CustomTitles',
    OP_Damage = 'OP_Damage',
    OP_Death = 'OP_Death',
    OP_DelegateAbility = 'OP_DelegateAbility',
    OP_DeleteCharacter = 'OP_DeleteCharacter',
    OP_DeleteCharge = 'OP_DeleteCharge',
    OP_DeleteItem = 'OP_DeleteItem',
    OP_DeletePetition = 'OP_DeletePetition',
    OP_DeleteSpawn = 'OP_DeleteSpawn',
    OP_DeleteSpell = 'OP_DeleteSpell',
    OP_DenyResponse = 'OP_DenyResponse',
    OP_Disarm = 'OP_Disarm',
    OP_DisarmTraps = 'OP_DisarmTraps',
    OP_DisciplineTimer = 'OP_DisciplineTimer',
    OP_DisciplineUpdate = 'OP_DisciplineUpdate',
    OP_DiscordMerchantInventory = 'OP_DiscordMerchantInventory',
    OP_DoGroupLeadershipAbility = 'OP_DoGroupLeadershipAbility',
    OP_DuelDecline = 'OP_DuelDecline',
    OP_DuelAccept = 'OP_DuelAccept',
    OP_DumpName = 'OP_DumpName',
    OP_Dye = 'OP_Dye',
    OP_DynamicWall = 'OP_DynamicWall',
    OP_DzAddPlayer = 'OP_DzAddPlayer',
    OP_DzChooseZone = 'OP_DzChooseZone',
    OP_DzChooseZoneReply = 'OP_DzChooseZoneReply',
    OP_DzCompass = 'OP_DzCompass',
    OP_DzExpeditionEndsWarning = 'OP_DzExpeditionEndsWarning',
    OP_DzExpeditionInfo = 'OP_DzExpeditionInfo',
    OP_DzExpeditionInvite = 'OP_DzExpeditionInvite',
    OP_DzExpeditionInviteResponse = 'OP_DzExpeditionInviteResponse',
    OP_DzExpeditionLockoutTimers = 'OP_DzExpeditionLockoutTimers',
    OP_DzListTimers = 'OP_DzListTimers',
    OP_DzMakeLeader = 'OP_DzMakeLeader',
    OP_DzMemberList = 'OP_DzMemberList',
    OP_DzMemberListName = 'OP_DzMemberListName',
    OP_DzMemberListStatus = 'OP_DzMemberListStatus',
    OP_DzPlayerList = 'OP_DzPlayerList',
    OP_DzQuit = 'OP_DzQuit',
    OP_DzRemovePlayer = 'OP_DzRemovePlayer',
    OP_DzSetLeaderName = 'OP_DzSetLeaderName',
    OP_DzSwapPlayer = 'OP_DzSwapPlayer',
    OP_Emote = 'OP_Emote',
    OP_EndLootRequest = 'OP_EndLootRequest',
    OP_EnduranceUpdate = 'OP_EnduranceUpdate',
    OP_EnterChat = 'OP_EnterChat',
    OP_EnvDamage = 'OP_EnvDamage',
    OP_ExpansionInfo = 'OP_ExpansionInfo',
    OP_ExpUpdate = 'OP_ExpUpdate',
    OP_FaceChange = 'OP_FaceChange',
    OP_Feedback = 'OP_Feedback',
    OP_FeignDeath = 'OP_FeignDeath',
    OP_FellowshipUpdate = 'OP_FellowshipUpdate',
    OP_FindPersonReply = 'OP_FindPersonReply',
    OP_FindPersonRequest = 'OP_FindPersonRequest',
    OP_FinishTrade = 'OP_FinishTrade',
    OP_FinishWindow = 'OP_FinishWindow',
    OP_FinishWindow2 = 'OP_FinishWindow2',
    OP_Fishing = 'OP_Fishing',
    OP_Fling = 'OP_Fling',
    OP_FloatListThing = 'OP_FloatListThing',
    OP_Forage = 'OP_Forage',
    OP_ForceFindPerson = 'OP_ForceFindPerson',
    OP_FormattedMessage = 'OP_FormattedMessage',
    OP_FriendsWho = 'OP_FriendsWho',
    OP_GetGuildMOTD = 'OP_GetGuildMOTD',
    OP_GetGuildMOTDReply = 'OP_GetGuildMOTDReply',
    OP_GetGuildsList = 'OP_GetGuildsList',
    OP_GiveMoney = 'OP_GiveMoney',
    OP_GMApproval = 'OP_GMApproval',
    OP_GMBecomeNPC = 'OP_GMBecomeNPC',
    OP_GMDelCorpse = 'OP_GMDelCorpse',
    OP_GMEmoteZone = 'OP_GMEmoteZone',
    OP_GMEndTraining = 'OP_GMEndTraining',
    OP_GMEndTrainingResponse = 'OP_GMEndTrainingResponse',
    OP_GMFind = 'OP_GMFind',
    OP_GMGoto = 'OP_GMGoto',
    OP_GMHideMe = 'OP_GMHideMe',
    OP_GMKick = 'OP_GMKick',
    OP_GMKill = 'OP_GMKill',
    OP_GMLastName = 'OP_GMLastName',
    OP_GMNameChange = 'OP_GMNameChange',
    OP_GMSearchCorpse = 'OP_GMSearchCorpse',
    OP_GMServers = 'OP_GMServers',
    OP_GMSummon = 'OP_GMSummon',
    OP_GMToggle = 'OP_GMToggle',
    OP_GMTraining = 'OP_GMTraining',
    OP_GMTrainSkill = 'OP_GMTrainSkill',
    OP_GMTrainSkillConfirm = 'OP_GMTrainSkillConfirm',
    OP_GMZoneRequest = 'OP_GMZoneRequest',
    OP_GMZoneRequest2 = 'OP_GMZoneRequest2',
    OP_GroundSpawn = 'OP_GroundSpawn',
    OP_GroupAcknowledge = 'OP_GroupAcknowledge',
    OP_GroupCancelInvite = 'OP_GroupCancelInvite',
    OP_GroupDelete = 'OP_GroupDelete',
    OP_GroupDisband = 'OP_GroupDisband',
    OP_GroupDisbandOther = 'OP_GroupDisbandOther',
    OP_GroupDisbandYou = 'OP_GroupDisbandYou',
    OP_GroupFollow = 'OP_GroupFollow',
    OP_GroupFollow2 = 'OP_GroupFollow2',
    OP_GroupInvite = 'OP_GroupInvite',
    OP_GroupInvite2 = 'OP_GroupInvite2',
    OP_GroupLeaderChange = 'OP_GroupLeaderChange',
    OP_GroupLeadershipAAUpdate = 'OP_GroupLeadershipAAUpdate',
    OP_GroupMakeLeader = 'OP_GroupMakeLeader',
    OP_GroupMentor = 'OP_GroupMentor',
    OP_GroupRoles = 'OP_GroupRoles',
    OP_GroupUpdate = 'OP_GroupUpdate',
    OP_GroupUpdateB = 'OP_GroupUpdateB',
    OP_GroupUpdateLeaderAA = 'OP_GroupUpdateLeaderAA',
    OP_GuildBank = 'OP_GuildBank',
    OP_GuildBankItemList = 'OP_GuildBankItemList',
    OP_GuildCreate = 'OP_GuildCreate',
    OP_GuildDelete = 'OP_GuildDelete',
    OP_GuildDemote = 'OP_GuildDemote',
    OP_GuildInvite = 'OP_GuildInvite',
    OP_GuildInviteAccept = 'OP_GuildInviteAccept',
    OP_GuildLeader = 'OP_GuildLeader',
    OP_GuildManageAdd = 'OP_GuildManageAdd',
    OP_GuildManageBanker = 'OP_GuildManageBanker',
    OP_GuildManageRemove = 'OP_GuildManageRemove',
    OP_GuildManageStatus = 'OP_GuildManageStatus',
    OP_GuildMemberLevelUpdate = 'OP_GuildMemberLevelUpdate',
    OP_GuildMemberList = 'OP_GuildMemberList',
    OP_GuildMemberUpdate = 'OP_GuildMemberUpdate',
    OP_GuildMOTD = 'OP_GuildMOTD',
    OP_GuildPeace = 'OP_GuildPeace',
    OP_GuildPromote = 'OP_GuildPromote',
    OP_GuildPublicNote = 'OP_GuildPublicNote',
    OP_GuildRemove = 'OP_GuildRemove',
    OP_GuildsList = 'OP_GuildsList',
    OP_GuildStatus = 'OP_GuildStatus',
    OP_GuildTributeInfo = 'OP_GuildTributeInfo',
    OP_GuildUpdateURLAndChannel = 'OP_GuildUpdateURLAndChannel',
    OP_GuildWar = 'OP_GuildWar',
    OP_Heartbeat = 'OP_Heartbeat',
    OP_Hide = 'OP_Hide',
    OP_HideCorpse = 'OP_HideCorpse',
    OP_HPUpdate = 'OP_HPUpdate',
    OP_Illusion = 'OP_Illusion',
    OP_IncreaseStats = 'OP_IncreaseStats',
    OP_InitialHPUpdate = 'OP_InitialHPUpdate',
    OP_InitialMobHealth = 'OP_InitialMobHealth',
    OP_InspectAnswer = 'OP_InspectAnswer',
    OP_InspectBuffs = 'OP_InspectBuffs',
    OP_InspectMessageUpdate = 'OP_InspectMessageUpdate',
    OP_InspectRequest = 'OP_InspectRequest',
    OP_InstillDoubt = 'OP_InstillDoubt',
    OP_InterruptCast = 'OP_InterruptCast',
    OP_ItemLinkClick = 'OP_ItemLinkClick',
    OP_ItemLinkResponse = 'OP_ItemLinkResponse',
    OP_ItemLinkText = 'OP_ItemLinkText',
    OP_ItemName = 'OP_ItemName',
    OP_ItemPacket = 'OP_ItemPacket',
    OP_ItemPreview = 'OP_ItemPreview',
    OP_ItemRecastDelay = 'OP_ItemRecastDelay',
    OP_ItemVerifyReply = 'OP_ItemVerifyReply',
    OP_ItemVerifyRequest = 'OP_ItemVerifyRequest',
    OP_ItemViewUnknown = 'OP_ItemViewUnknown',
    OP_Jump = 'OP_Jump',
    OP_KeyRing = 'OP_KeyRing',
    OP_KickPlayers = 'OP_KickPlayers',
    OP_KnowledgeBase = 'OP_KnowledgeBase',
    OP_LDoNButton = 'OP_LDoNButton',
    OP_LDoNDisarmTraps = 'OP_LDoNDisarmTraps',
    OP_LDoNInspect = 'OP_LDoNInspect',
    OP_LDoNOpen = 'OP_LDoNOpen',
    OP_LDoNPickLock = 'OP_LDoNPickLock',
    OP_LDoNSenseTraps = 'OP_LDoNSenseTraps',
    OP_LeadershipExpToggle = 'OP_LeadershipExpToggle',
    OP_LeadershipExpUpdate = 'OP_LeadershipExpUpdate',
    OP_LeaveAdventure = 'OP_LeaveAdventure',
    OP_LeaveBoat = 'OP_LeaveBoat',
    OP_LevelAppearance = 'OP_LevelAppearance',
    OP_LevelUpdate = 'OP_LevelUpdate',
    OP_LFGAppearance = 'OP_LFGAppearance',
    OP_LFGCommand = 'OP_LFGCommand',
    OP_LFGGetMatchesRequest = 'OP_LFGGetMatchesRequest',
    OP_LFGGetMatchesResponse = 'OP_LFGGetMatchesResponse',
    OP_LFGResponse = 'OP_LFGResponse',
    OP_LFGuild = 'OP_LFGuild',
    OP_LFPCommand = 'OP_LFPCommand',
    OP_LFPGetMatchesRequest = 'OP_LFPGetMatchesRequest',
    OP_LFPGetMatchesResponse = 'OP_LFPGetMatchesResponse',
    OP_LinkedReuse = 'OP_LinkedReuse',
    OP_LoadSpellSet = 'OP_LoadSpellSet',
    OP_LocInfo = 'OP_LocInfo',
    OP_LockoutTimerInfo = 'OP_LockoutTimerInfo',
    OP_Login = 'OP_Login',
    OP_LoginComplete = 'OP_LoginComplete',
    OP_LoginExpansionPacketData = 'OP_LoginExpansionPacketData',
    OP_LoginUnknown1 = 'OP_LoginUnknown1',
    OP_LoginUnknown2 = 'OP_LoginUnknown2',
    OP_Logout = 'OP_Logout',
    OP_LogoutReply = 'OP_LogoutReply',
    OP_LogServer = 'OP_LogServer',
    OP_LootComplete = 'OP_LootComplete',
    OP_LootItem = 'OP_LootItem',
    OP_LootRequest = 'OP_LootRequest',
    OP_ManaChange = 'OP_ManaChange',
    OP_ManaUpdate = 'OP_ManaUpdate',
    OP_MarkNPC = 'OP_MarkNPC',
    OP_MarkRaidNPC = 'OP_MarkRaidNPC',
    OP_Marquee = 'OP_Marquee',
    OP_MemorizeSpell = 'OP_MemorizeSpell',
    OP_Mend = 'OP_Mend',
    OP_MendHPUpdate = 'OP_MendHPUpdate',
    OP_MercenaryAssign = 'OP_MercenaryAssign',
    OP_MercenaryCommand = 'OP_MercenaryCommand',
    OP_MercenaryDataRequest = 'OP_MercenaryDataRequest',
    OP_MercenaryDataResponse = 'OP_MercenaryDataResponse',
    OP_MercenaryDataUpdate = 'OP_MercenaryDataUpdate',
    OP_MercenaryDataUpdateRequest = 'OP_MercenaryDataUpdateRequest',
    OP_MercenaryDismiss = 'OP_MercenaryDismiss',
    OP_MercenaryHire = 'OP_MercenaryHire',
    OP_MercenarySuspendRequest = 'OP_MercenarySuspendRequest',
    OP_MercenarySuspendResponse = 'OP_MercenarySuspendResponse',
    OP_MercenaryTimer = 'OP_MercenaryTimer',
    OP_MercenaryTimerRequest = 'OP_MercenaryTimerRequest',
    OP_MercenaryUnknown1 = 'OP_MercenaryUnknown1',
    OP_MercenaryUnsuspendResponse = 'OP_MercenaryUnsuspendResponse',
    OP_MobEnduranceUpdate = 'OP_MobEnduranceUpdate',
    OP_MobHealth = 'OP_MobHealth',
    OP_MobManaUpdate = 'OP_MobManaUpdate',
    OP_MobRename = 'OP_MobRename',
    OP_MobUpdate = 'OP_MobUpdate',
    OP_MoneyOnCorpse = 'OP_MoneyOnCorpse',
    OP_MoneyUpdate = 'OP_MoneyUpdate',
    OP_MOTD = 'OP_MOTD',
    OP_MoveCoin = 'OP_MoveCoin',
    OP_MoveDoor = 'OP_MoveDoor',
    OP_MoveItem = 'OP_MoveItem',
    OP_MoveMultipleItems = 'OP_MoveMultipleItems',
    OP_MoveLogDisregard = 'OP_MoveLogDisregard',
    OP_MoveLogRequest = 'OP_MoveLogRequest',
    OP_MultiLineMsg = 'OP_MultiLineMsg',
    OP_NewSpawn = 'OP_NewSpawn',
    OP_NewTitlesAvailable = 'OP_NewTitlesAvailable',
    OP_NewZone = 'OP_NewZone',
    OP_OnLevelMessage = 'OP_OnLevelMessage',
    OP_OpenContainer = 'OP_OpenContainer',
    OP_OpenDiscordMerchant = 'OP_OpenDiscordMerchant',
    OP_OpenGuildTributeMaster = 'OP_OpenGuildTributeMaster',
    OP_OpenInventory = 'OP_OpenInventory',
    OP_OpenTributeMaster = 'OP_OpenTributeMaster',
    OP_PDeletePetition = 'OP_PDeletePetition',
    OP_PetBuffWindow = 'OP_PetBuffWindow',
    OP_PetCommands = 'OP_PetCommands',
    OP_PetCommandState = 'OP_PetCommandState',
    OP_PetHoTT = 'OP_PetHoTT',
    OP_Petition = 'OP_Petition',
    OP_PetitionBug = 'OP_PetitionBug',
    OP_PetitionCheckIn = 'OP_PetitionCheckIn',
    OP_PetitionCheckout = 'OP_PetitionCheckout',
    OP_PetitionCheckout2 = 'OP_PetitionCheckout2',
    OP_PetitionDelete = 'OP_PetitionDelete',
    OP_PetitionQue = 'OP_PetitionQue',
    OP_PetitionRefresh = 'OP_PetitionRefresh',
    OP_PetitionResolve = 'OP_PetitionResolve',
    OP_PetitionSearch = 'OP_PetitionSearch',
    OP_PetitionSearchResults = 'OP_PetitionSearchResults',
    OP_PetitionSearchText = 'OP_PetitionSearchText',
    OP_PetitionUnCheckout = 'OP_PetitionUnCheckout',
    OP_PetitionUpdate = 'OP_PetitionUpdate',
    OP_PickPocket = 'OP_PickPocket',
    OP_PlayerProfile = 'OP_PlayerProfile',
    OP_PlayerStateAdd = 'OP_PlayerStateAdd',
    OP_PlayerStateRemove = 'OP_PlayerStateRemove',
    OP_PlayMP3 = 'OP_PlayMP3',
    OP_Poll = 'OP_Poll',
    OP_PollResponse = 'OP_PollResponse',
    OP_PopupResponse = 'OP_PopupResponse',
    OP_PostEnterWorld = 'OP_PostEnterWorld',
    OP_PotionBelt = 'OP_PotionBelt',
    OP_PreLogoutReply = 'OP_PreLogoutReply',
    OP_PurchaseLeadershipAA = 'OP_PurchaseLeadershipAA',
    OP_PVPLeaderBoardDetailsReply = 'OP_PVPLeaderBoardDetailsReply',
    OP_PVPLeaderBoardDetailsRequest = 'OP_PVPLeaderBoardDetailsRequest',
    OP_PVPLeaderBoardReply = 'OP_PVPLeaderBoardReply',
    OP_PVPLeaderBoardRequest = 'OP_PVPLeaderBoardRequest',
    OP_PVPStats = 'OP_PVPStats',
    OP_QueryResponseThing = 'OP_QueryResponseThing',
    OP_QueryUCSServerStatus = 'OP_QueryUCSServerStatus',
    OP_RaidDelegateAbility = 'OP_RaidDelegateAbility',
    OP_RaidClearNPCMarks = 'OP_RaidClearNPCMarks',
    OP_RaidInvite = 'OP_RaidInvite',
    OP_RaidJoin = 'OP_RaidJoin',
    OP_RaidUpdate = 'OP_RaidUpdate',
    OP_RandomNameGenerator = 'OP_RandomNameGenerator',
    OP_RandomReply = 'OP_RandomReply',
    OP_RandomReq = 'OP_RandomReq',
    OP_ReadBook = 'OP_ReadBook',
    OP_RecipeAutoCombine = 'OP_RecipeAutoCombine',
    OP_RecipeDetails = 'OP_RecipeDetails',
    OP_RecipeReply = 'OP_RecipeReply',
    OP_RecipesFavorite = 'OP_RecipesFavorite',
    OP_RecipesSearch = 'OP_RecipesSearch',
    OP_ReclaimCrystals = 'OP_ReclaimCrystals',
    OP_ReloadUI = 'OP_ReloadUI',
    OP_RemoveAllDoors = 'OP_RemoveAllDoors',
    OP_RemoveBlockedBuffs = 'OP_RemoveBlockedBuffs',
    OP_RemoveNimbusEffect = 'OP_RemoveNimbusEffect',
    OP_RemoveTrap = 'OP_RemoveTrap',
    OP_Report = 'OP_Report',
    OP_ReqClientSpawn = 'OP_ReqClientSpawn',
    OP_ReqNewZone = 'OP_ReqNewZone',
    OP_RequestClientZoneChange = 'OP_RequestClientZoneChange',
    OP_RequestDuel = 'OP_RequestDuel',
    OP_RequestKnowledgeBase = 'OP_RequestKnowledgeBase',
    OP_RequestTitles = 'OP_RequestTitles',
    OP_RespawnWindow = 'OP_RespawnWindow',
    OP_RespondAA = 'OP_RespondAA',
    OP_RestState = 'OP_RestState',
    OP_Rewind = 'OP_Rewind',
    OP_RezzAnswer = 'OP_RezzAnswer',
    OP_RezzComplete = 'OP_RezzComplete',
    OP_RezzRequest = 'OP_RezzRequest',
    OP_Sacrifice = 'OP_Sacrifice',
    OP_SafeFallSuccess = 'OP_SafeFallSuccess',
    OP_SafePoint = 'OP_SafePoint',
    OP_Save = 'OP_Save',
    OP_SaveOnZoneReq = 'OP_SaveOnZoneReq',
    OP_SelectTribute = 'OP_SelectTribute',
    OP_SendAAStats = 'OP_SendAAStats',
    OP_SendAATable = 'OP_SendAATable',
    OP_SendExpZonein = 'OP_SendExpZonein',
    OP_SendFindableNPCs = 'OP_SendFindableNPCs',
    OP_SendGuildTributes = 'OP_SendGuildTributes',
    OP_SendMaxCharacters = 'OP_SendMaxCharacters',
    OP_SendMembership = 'OP_SendMembership',
    OP_SendMembershipDetails = 'OP_SendMembershipDetails',
    OP_SendSystemStats = 'OP_SendSystemStats',
    OP_SendTitleList = 'OP_SendTitleList',
    OP_SendTributes = 'OP_SendTributes',
    OP_SendZonepoints = 'OP_SendZonepoints',
    OP_SenseHeading = 'OP_SenseHeading',
    OP_SenseTraps = 'OP_SenseTraps',
    OP_SessionReady = 'OP_SessionReady',
    OP_SetChatServer = 'OP_SetChatServer',
    OP_SetChatServer2 = 'OP_SetChatServer2',
    OP_SetFace = 'OP_SetFace',
    OP_SetGroupTarget = 'OP_SetGroupTarget',
    OP_SetGuildMOTD = 'OP_SetGuildMOTD',
    OP_SetGuildRank = 'OP_SetGuildRank',
    OP_SetRunMode = 'OP_SetRunMode',
    OP_SetServerFilter = 'OP_SetServerFilter',
    OP_SetStartCity = 'OP_SetStartCity',
    OP_SetTitle = 'OP_SetTitle',
    OP_SetTitleReply = 'OP_SetTitleReply',
    OP_SharedTaskMemberList = 'OP_SharedTaskMemberList',
    OP_SharedTaskAddPlayer = 'OP_SharedTaskAddPlayer',
    OP_SharedTaskRemovePlayer = 'OP_SharedTaskRemovePlayer',
    OP_SharedTaskMakeLeader = 'OP_SharedTaskMakeLeader',
    OP_SharedTaskMemberInvite = 'OP_SharedTaskMemberInvite',
    OP_SharedTaskInvite = 'OP_SharedTaskInvite',
    OP_SharedTaskInviteResponse = 'OP_SharedTaskInviteResponse',
    OP_SharedTaskAcceptNew = 'OP_SharedTaskAcceptNew',
    OP_SharedTaskMemberChange = 'OP_SharedTaskMemberChange',
    OP_SharedTaskPlayerList = 'OP_SharedTaskPlayerList',
    OP_SharedTaskSelectWindow = 'OP_SharedTaskSelectWindow',
    OP_SharedTaskQuit = 'OP_SharedTaskQuit',
    OP_TaskTimers = 'OP_TaskTimers',
    OP_Shielding = 'OP_Shielding',
    OP_ShopDelItem = 'OP_ShopDelItem',
    OP_ShopEnd = 'OP_ShopEnd',
    OP_ShopEndConfirm = 'OP_ShopEndConfirm',
    OP_ShopItem = 'OP_ShopItem',
    OP_ShopPlayerBuy = 'OP_ShopPlayerBuy',
    OP_ShopPlayerSell = 'OP_ShopPlayerSell',
    OP_ShopRequest = 'OP_ShopRequest',
    OP_SimpleMessage = 'OP_SimpleMessage',
    OP_SkillUpdate = 'OP_SkillUpdate',
    OP_Sneak = 'OP_Sneak',
    OP_Some3ByteHPUpdate = 'OP_Some3ByteHPUpdate',
    OP_Some6ByteHPUpdate = 'OP_Some6ByteHPUpdate',
    OP_SomeItemPacketMaybe = 'OP_SomeItemPacketMaybe',
    OP_Sound = 'OP_Sound',
    OP_SpawnAppearance = 'OP_SpawnAppearance',
    OP_SpawnDoor = 'OP_SpawnDoor',
    OP_SpawnPositionUpdate = 'OP_SpawnPositionUpdate',
    OP_SpecialMesg = 'OP_SpecialMesg',
    OP_SpellEffect = 'OP_SpellEffect',
    OP_Split = 'OP_Split',
    OP_Stamina = 'OP_Stamina',
    OP_Stun = 'OP_Stun',
    OP_Surname = 'OP_Surname',
    OP_SwapSpell = 'OP_SwapSpell',
    OP_TargetBuffs = 'OP_TargetBuffs',
    OP_TargetCommand = 'OP_TargetCommand',
    OP_TargetHoTT = 'OP_TargetHoTT',
    OP_TargetMouse = 'OP_TargetMouse',
    OP_TargetReject = 'OP_TargetReject',
    OP_TaskActivity = 'OP_TaskActivity',
    OP_TaskActivityComplete = 'OP_TaskActivityComplete',
    OP_TaskDescription = 'OP_TaskDescription',
    OP_TaskHistoryReply = 'OP_TaskHistoryReply',
    OP_TaskHistoryRequest = 'OP_TaskHistoryRequest',
    OP_TaskRequestTimer = 'OP_TaskRequestTimer',
    OP_TaskSelectWindow = 'OP_TaskSelectWindow',
    OP_Taunt = 'OP_Taunt',
    OP_TestBuff = 'OP_TestBuff',
    OP_TGB = 'OP_TGB',
    OP_TimeOfDay = 'OP_TimeOfDay',
    OP_Track = 'OP_Track',
    OP_TrackTarget = 'OP_TrackTarget',
    OP_TrackUnknown = 'OP_TrackUnknown',
    OP_TradeAcceptClick = 'OP_TradeAcceptClick',
    OP_TradeBusy = 'OP_TradeBusy',
    OP_TradeCoins = 'OP_TradeCoins',
    OP_TradeMoneyUpdate = 'OP_TradeMoneyUpdate',
    OP_Trader = 'OP_Trader',
    OP_TraderBuy = 'OP_TraderBuy',
    OP_TraderDelItem = 'OP_TraderDelItem',
    OP_TradeRequest = 'OP_TradeRequest',
    OP_TradeRequestAck = 'OP_TradeRequestAck',
    OP_TraderItemUpdate = 'OP_TraderItemUpdate',
    OP_TraderShop = 'OP_TraderShop',
    OP_TradeSkillCombine = 'OP_TradeSkillCombine',
    OP_Translocate = 'OP_Translocate',
    OP_TributeInfo = 'OP_TributeInfo',
    OP_TributeItem = 'OP_TributeItem',
    OP_TributeMoney = 'OP_TributeMoney',
    OP_TributeNPC = 'OP_TributeNPC',
    OP_TributePointUpdate = 'OP_TributePointUpdate',
    OP_TributeTimer = 'OP_TributeTimer',
    OP_TributeToggle = 'OP_TributeToggle',
    OP_TributeUpdate = 'OP_TributeUpdate',
    OP_Untargetable = 'OP_Untargetable',
    OP_UpdateAA = 'OP_UpdateAA',
    OP_UpdateAura = 'OP_UpdateAura',
    OP_UpdateLeadershipAA = 'OP_UpdateLeadershipAA',
    OP_VetClaimReply = 'OP_VetClaimReply',
    OP_VetClaimRequest = 'OP_VetClaimRequest',
    OP_VetRewardsAvaliable = 'OP_VetRewardsAvaliable',
    OP_VoiceMacroIn = 'OP_VoiceMacroIn',
    OP_VoiceMacroOut = 'OP_VoiceMacroOut',
    OP_WeaponEquip1 = 'OP_WeaponEquip1',
    OP_WearChange = 'OP_WearChange',
    OP_Weather = 'OP_Weather',
    OP_Weblink = 'OP_Weblink',
    OP_WhoAllRequest = 'OP_WhoAllRequest',
    OP_WhoAllResponse = 'OP_WhoAllResponse',
    OP_World_Client_CRC1 = 'OP_World_Client_CRC1',
    OP_World_Client_CRC2 = 'OP_World_Client_CRC2',
    OP_World_Client_CRC3 = 'OP_World_Client_CRC3',
    OP_WorldClientReady = 'OP_WorldClientReady',
    OP_WorldComplete = 'OP_WorldComplete',
    OP_WorldLogout = 'OP_WorldLogout',
    OP_WorldObjectsSent = 'OP_WorldObjectsSent',
    OP_WorldUnknown001 = 'OP_WorldUnknown001',
    OP_XTargetAutoAddHaters = 'OP_XTargetAutoAddHaters',
    OP_XTargetOpen = 'OP_XTargetOpen',
    OP_XTargetOpenResponse = 'OP_XTargetOpenResponse',
    OP_XTargetRequest = 'OP_XTargetRequest',
    OP_XTargetResponse = 'OP_XTargetResponse',
    OP_YellForHelp = 'OP_YellForHelp',
    OP_ZoneChange = 'OP_ZoneChange',
    OP_ZoneComplete = 'OP_ZoneComplete',
    OP_ZoneEntry = 'OP_ZoneEntry',
    OP_ZoneGuildList = 'OP_ZoneGuildList',
    OP_ZoneInUnknown = 'OP_ZoneInUnknown',
    OP_ZonePlayerToBind = 'OP_ZonePlayerToBind',
    OP_ZoneServerReady = 'OP_ZoneServerReady',
    OP_ZoneSpawns = 'OP_ZoneSpawns',
    OP_ZoneUnavail = 'OP_ZoneUnavail',
    OP_ResetAA = 'OP_ResetAA',
    OP_UnderWorld = 'OP_UnderWorld',
}

export interface LoginInfo {
    name?: string;
    password?: string;
    zoning?: number;
}

export interface EnterWorld {
    name?: string;
    tutorial?: number;
    returnHome?: number;
}

export interface InventorySlot {
    type?: number;
    slot?: number;
    subIndex?: number;
}

export interface TypelessInventorySlot {
    slot?: number;
    subIndex?: number;
}

export interface NameApproval {
    name?: string;
    race?: number;
    charClass?: number;
    deity?: number;
}

export interface EntityId {
    entityId?: number;
}

export interface Duel {
    duelInitiator?: number;
    duelTarget?: number;
}

export interface DuelResponse {
    targetId?: number;
    entityId?: number;
}

export interface AdventureInfo {
    questId?: number;
    npcId?: number;
    inUse?: boolean;
    status?: number;
    showCompass?: boolean;
    objetive?: number;
    objetiveValue?: number;
    text?: string;
    type?: number;
    minutes?: number;
    points?: number;
    x?: number;
    y?: number;
    zoneid?: number;
    zonedungeonid?: number;
}

export interface Tint {
    blue?: number;
    green?: number;
    red?: number;
    useTint?: number;
}

export interface TextureProfile {
    head?: number;
    chest?: number;
    arms?: number;
    wrist?: number;
    hands?: number;
    legs?: number;
    feet?: number;
    primary?: number;
    secondary?: number;
}

export interface TintProfile {
    head?: number;
    chest?: number;
    arms?: number;
    wrist?: number;
    hands?: number;
    legs?: number;
    feet?: number;
    primary?: number;
    secondary?: number;
}

export interface CharSelectEquip {
    material?: number;
    color?: number;
}

export interface CharacterSelectEntry {
    name?: string;
    charClass?: number;
    race?: number;
    level?: number;
    zone?: number;
    instance?: number;
    gender?: number;
    face?: number;
    equip?: CharSelectEquip[];
    deity?: number;
    primaryIdFile?: number;
    secondaryIdFile?: number;
    goHome?: number;
    enabled?: number;
    lastLogin?: number;
}

export interface CharacterSelect {
    characterCount?: number;
    characters?: CharacterSelectEntry[];
}

export interface Spawn {
    gm?: number;
    aaitle?: number;
    anon?: number;
    face?: number;
    name?: string;
    deity?: number;
    size?: number;
    npc?: number;
    invis?: number;
    haircolor?: number;
    curHp?: number;
    maxHp?: number;
    findable?: number;
    deltaHeading?: number;
    x?: number;
    y?: number;
    animation?: number;
    z?: number;
    deltaY?: number;
    deltaX?: number;
    heading?: number;
    deltaZ?: number;
    eyecolor1?: number;
    showhelm?: number;
    isNpc?: number;
    hairstyle?: number;
    beardcolor?: number;
    level?: number;
    playerState?: number;
    beard?: number;
    suffix?: string;
    petOwnerId?: number;
    guildrank?: number;
    equipment?: TextureProfile;
    runspeed?: number;
    afk?: number;
    guildId?: number;
    title?: string;
    helm?: number;
    race?: number;
    lastName?: string;
    walkspeed?: number;
    isPet?: number;
    light?: number;
    charClass?: number;
    eyecolor2?: number;
    flymode?: number;
    gender?: number;
    bodytype?: number;
    equipChest?: number;
    mountColor?: number;
    spawnId?: number;
    boundingRadius?: number;
    equipmentTint?: number;
    lfg?: number;
}

export interface NewSpawn {
    spawn?: Spawn;
}

export interface ClientzoneEntry {
    charName?: string;
}

export interface ServerZoneEntry {
    player?: NewSpawn;
}

export interface NewZone {
    charName?: string;
    zoneShortName?: string;
    zoneLongName?: string;
    ztype?: number;
    fogRed?: number[];
    fogGreen?: number[];
    fogBlue?: number[];
    fogMinclip?: number[];
    fogMaxclip?: number[];
    gravity?: number;
    timeType?: number;
    rainChance?: number[];
    rainDuration?: number[];
    snowChance?: number[];
    snowDuration?: number[];
    sky?: number;
    zoneExpMultiplier?: number;
    safeY?: number;
    safeX?: number;
    safeZ?: number;
    maxZ?: number;
    underworld?: number;
    minclip?: number;
    maxclip?: number;
    zoneShortName2?: string;
    zoneId?: number;
    zoneInstance?: number;
}

export interface MemorizeSpell {
    slot?: number;
    spellId?: number;
    scribing?: number;
    reduction?: number;
}

export interface Charm {
    ownerId?: number;
    petId?: number;
    command?: number;
}

export interface InterruptCast {
    spawnid?: number;
    messageid?: number;
    message?: string;
}

export interface DeleteSpell {
    spellSlot?: number;
    success?: number;
}

export interface ManaChange {
    newMana?: number;
    stamina?: number;
    spellId?: number;
    keepcasting?: number;
    padding?: number[];
}

export interface SwapSpell {
    fromSlot?: number;
    toSlot?: number;
}

export interface BeginCast {
    casterId?: number;
    spellId?: number;
    castTime?: number;
}

export interface CastSpell {
    slot?: number;
    spellId?: number;
    inventoryslot?: number;
    targetId?: number;
}

export interface SpawnAppearance {
    spawnId?: number;
    type?: number;
    parameter?: number;
}

export interface SpellBuff {
    effectType?: number;
    level?: number;
    bardModifier?: number;
    spellid?: number;
    duration?: number;
    counters?: number;
    playerId?: number;
}

export interface SpellBuffPacket {
    entityid?: number;
    buff?: SpellBuff;
    slotid?: number;
    bufffade?: number;
}

export interface ItemNamePacket {
    itemId?: number;
    unkown?: number;
    name?: string;
}

export interface ItemProperties {
    charges?: number;
}

export interface GMTrainee {
    npcid?: number;
    playerid?: number;
    skills?: number[];
}

export interface GMTrainEnd {
    npcid?: number;
    playerid?: number;
}

export interface GMSkillChange {
    npcid?: number;
    skillbank?: number;
    skillId?: number;
}

export interface ConsentResponse {
    grantname?: string;
    ownername?: string;
    permission?: number;
    zonename?: string;
}

export interface NameGeneration {
    race?: number;
    gender?: number;
    name?: string;
}

export interface NameApprove {
    name?: string;
    race?: number;
    gender?: number;
}

export interface CharCreate {
    charClass?: number;
    haircolor?: number;
    beardcolor?: number;
    beard?: number;
    gender?: number;
    race?: number;
    startZone?: number;
    hairstyle?: number;
    deity?: number;
    str?: number;
    sta?: number;
    agi?: number;
    dex?: number;
    wis?: number;
    intel?: number;
    cha?: number;
    face?: number;
    eyecolor1?: number;
    eyecolor2?: number;
    tutorial?: number;
}

export interface AA_Array {
    aa?: number;
    value?: number;
}

export interface Disciplines {
    values?: number[];
}

export interface Tribute {
    tribute?: number;
    tier?: number;
}

export interface BandolierItem {
    id?: number;
    icon?: number;
    name?: string;
}

export interface Bandolier {
    name?: string;
    items?: BandolierItem[];
}

export interface PotionBeltItem {
    id?: number;
    icon?: number;
    name?: string;
}

export interface PotionBelt {
    items?: PotionBeltItem[];
}

export interface StringList {
    str?: string;
}

export interface GroupLeadershipAA {
    groupAaMarkNpc?: number;
    groupAanpcHealth?: number;
    groupAaDelegateMainAssist?: number;
    groupAaDelegateMarkNpc?: number;
    groupAa4?: number;
    groupAa5?: number;
    groupAaInspectBuffs?: number;
    groupAa7?: number;
    groupAaSpellAwareness?: number;
    groupAaOffenseEnhancement?: number;
    groupAaManaEnhancement?: number;
    groupAaHealthEnhancement?: number;
    groupAaHealthRegeneration?: number;
    groupAaFindPathToPc?: number;
    groupAaHealthOfTargetsTarget?: number;
    groupAa15?: number;
}

export interface RaidLeadershipAA {
    raidAaMarkNpc?: number;
    raidAanpcHealth?: number;
    raidAaDelegateMainAssist?: number;
    raidAaDelegateMarkNpc?: number;
    raidAa4?: number;
    raidAa5?: number;
    raidAa6?: number;
    raidAaSpellAwareness?: number;
    raidAaOffenseEnhancement?: number;
    raidAaManaEnhancement?: number;
    raidAaHealthEnhancement?: number;
    raidAaHealthRegeneration?: number;
    raidAaFindPathToPc?: number;
    raidAaHealthOfTargetsTarget?: number;
    raidAa14?: number;
    raidAa15?: number;
}

export interface LeadershipAA {
    group?: GroupLeadershipAA;
    raid?: RaidLeadershipAA;
}

export interface Bind {
    zoneId?: number;
    x?: number;
    y?: number;
    z?: number;
    heading?: number;
}

export interface PVPStatsEntry {
    name?: string;
    level?: number;
    race?: number;
    charClass?: number;
    zone?: number;
    time?: number;
    points?: number;
}

export interface PlayerProfile {
    checksum?: number;
    gender?: number;
    race?: number;
    charClass?: number;
    level?: number;
    level1?: number;
    binds?: Bind[];
    deity?: number;
    intoxication?: number;
    spellSlotRefresh?: number[];
    abilitySlotRefresh?: number;
    haircolor?: number;
    beardcolor?: number;
    eyecolor1?: number;
    eyecolor2?: number;
    hairstyle?: number;
    beard?: number;
    itemMaterial?: TextureProfile;
    itemTint?: number;
    aaArray?: AA_Array[];
    points?: number;
    mana?: number;
    curHp?: number;
    str?: number;
    sta?: number;
    cha?: number;
    dex?: number;
    intel?: number;
    agi?: number;
    wis?: number;
    face?: number;
    spellBook?: number[];
    memSpells?: number[];
    platinum?: number;
    gold?: number;
    silver?: number;
    copper?: number;
    platinumCursor?: number;
    goldCursor?: number;
    silverCursor?: number;
    copperCursor?: number;
    skills?: number[];
    innateSkills?: number[];
    toxicity?: number;
    thirstLevel?: number;
    hungerLevel?: number;
    buffs?: SpellBuff[];
    disciplines?: Disciplines;
    recastTimers?: number[];
    endurance?: number;
    aapointsSpent?: number;
    aapoints?: number;
    bandoliers?: Bandolier[];
    potionbelt?: PotionBelt;
    availableSlots?: number;
    name?: string;
    lastName?: string;
    guildId?: number;
    birthday?: number;
    lastlogin?: number;
    timePlayedMin?: number;
    pvp?: number;
    anon?: number;
    gm?: number;
    guildrank?: number;
    guildbanker?: number;
    exp?: number;
    timeentitledonaccount?: number;
    languages?: number[];
    x?: number;
    y?: number;
    z?: number;
    heading?: number;
    platinumBank?: number;
    goldBank?: number;
    silverBank?: number;
    copperBank?: number;
    platinumShared?: number;
    expansions?: number;
    autosplit?: number;
    zoneId?: number;
    zoneInstance?: number;
    groupMembers?: StringList[];
    groupLeader?: string;
    entityid?: number;
    leadAaActive?: number;
    ldonPointsGuk?: number;
    ldonPointsMir?: number;
    ldonPointsMmc?: number;
    ldonPointsRuj?: number;
    ldonPointsTak?: number;
    ldonPointsAvailable?: number;
    tributeTimeRemaining?: number;
    careerTributePoints?: number;
    tributePoints?: number;
    tributeActive?: number;
    tributes?: Tribute[];
    groupLeadershipExp?: number;
    raidLeadershipExp?: number;
    groupLeadershipPoints?: number;
    raidLeadershipPoints?: number;
    leaderAbilities?: LeadershipAA;
    airRemaining?: number;
    pvpKills?: number;
    pvpDeaths?: number;
    pvpCurrentPoints?: number;
    pvpCareerPoints?: number;
    pvpBestKillStreak?: number;
    pvpWorstDeathStreak?: number;
    pvpCurrentKillStreak?: number;
    pvpLastKill?: PVPStatsEntry;
    pvpLastDeath?: PVPStatsEntry;
    pvpNumberOfKillsInLast_Hours?: number;
    pvpRecentKills?: PVPStatsEntry[];
    expAa?: number;
    currentRadCrystals?: number;
    careerRadCrystals?: number;
    currentEbonCrystals?: number;
    careerEbonCrystals?: number;
    groupAutoconsent?: number;
    raidAutoconsent?: number;
    guildAutoconsent?: number;
    level3?: number;
    showhelm?: number;
}

export interface ClientTarget {
    newTarget?: number;
}

export interface TargetReject {}

export interface PetCommand {
    command?: number;
    target?: number;
}

export interface DeleteSpawn {
    spawnId?: number;
}

export interface ChannelMessage {
    targetname?: string;
    sender?: string;
    language?: number;
    chanNum?: number;
    skillInLanguage?: number;
    message?: string;
}

export interface SpecialMesg {
    header?: string;
    msgType?: number;
    targetSpawnId?: number;
    sayer?: string;
    message?: string;
}

export interface WearChange {
    spawnId?: number;
    material?: number;
    color?: number;
    wearSlotId?: number;
}

export interface BindWound {
    to?: number;
    type?: number;
}

export interface ZoneChange {
    charName?: string;
    zoneId?: number;
    instanceId?: number;
    y?: number;
    x?: number;
    z?: number;
    zoneReason?: number;
    success?: number;
}

export interface RequestClientZoneChange {
    zoneId?: number;
    instanceId?: number;
    y?: number;
    x?: number;
    z?: number;
    heading?: number;
    type?: number;
}

export interface Animation {
    spawnid?: number;
    speed?: number;
    action?: number;
}

export interface Action {
    target?: number;
    source?: number;
    level?: number;
    instrumentMod?: number;
    force?: number;
    hitHeading?: number;
    hitPitch?: number;
    type?: number;
    spell?: number;
    spellLevel?: number;
    effectFlag?: number;
}

export interface CombatDamage {
    target?: number;
    source?: number;
    type?: number;
    spellid?: number;
    damage?: number;
    force?: number;
    hitHeading?: number;
    hitPitch?: number;
}

export interface Consider {
    playerid?: number;
    targetid?: number;
    faction?: number;
    level?: number;
    curHp?: number;
    maxHp?: number;
    pvpcon?: number;
}

export interface Death {
    spawnId?: number;
    killerId?: number;
    corpseid?: number;
    attackSkill?: number;
    spellId?: number;
    bindzoneid?: number;
    damage?: number;
}

export interface BecomeCorpse {
    spawnId?: number;
    y?: number;
    x?: number;
    z?: number;
}

export interface PlayerPositionUpdateServer {
    spawnId?: number;
    deltaHeading?: number;
    xPos?: number;
    yPos?: number;
    animation?: number;
    zPos?: number;
    deltaY?: number;
    deltaX?: number;
    heading?: number;
    deltaZ?: number;
}

export interface PlayerPositionUpdateClient {
    spawnId?: number;
    sequence?: number;
    yPos?: number;
    deltaZ?: number;
    deltaX?: number;
    deltaY?: number;
    animation?: number;
    deltaHeading?: number;
    xPos?: number;
    zPos?: number;
    heading?: number;
}

export interface SpawnHPUpdate {
    curHp?: number;
    maxHp?: number;
    spawnId?: number;
}

export interface SpawnHPUpdate2 {
    spawnId?: number;
    hp?: number;
}

export interface Stamina {
    food?: number;
    water?: number;
}

export interface LevelUpdate {
    level?: number;
    levelOld?: number;
    exp?: number;
}

export interface ExpUpdate {
    exp?: number;
    aaxp?: number;
}

export interface ItemPacket {
    packetType?: ItemPacketType;
    serializedItem?: string;
}

export interface BulkItemPacket {
    serializedItem?: string;
}

export interface Consume {
    slot?: number;
    autoConsumed?: number;
    type?: number;
}

export interface DeleteItem {
    fromSlot?: number;
    toSlot?: number;
    numberInStack?: number;
}

export interface MoveItem {
    fromSlot?: number;
    toSlot?: number;
    numberInStack?: number;
}

export interface MultiMoveItemSub {
    fromSlot?: InventorySlot;
    numberInStack?: number;
    toSlot?: InventorySlot;
}

export interface MultiMoveItem {
    count?: number;
    moves?: MultiMoveItemSub[];
}

export interface MoveCoin {
    fromSlot?: number;
    toSlot?: number;
    cointype1?: number;
    cointype2?: number;
    amount?: number;
}

export interface TradeCoin {
    trader?: number;
    slot?: number;
    amount?: number;
}

export interface TradeMoneyUpdate {
    trader?: number;
    type?: number;
    amount?: number;
}

export interface Surname {
    name?: string;
    lastname?: string;
}

export interface GuildsListEntry {
    name?: string;
}

export interface GuildsList {
    head?: number[];
    guilds?: GuildsListEntry[];
}

export interface GuildUpdate {
    guildId?: number;
    entry?: GuildsListEntry;
}

export interface MoneyOnCorpse {
    response?: number;
    platinum?: number;
    gold?: number;
    silver?: number;
    copper?: number;
}

export interface LootingItem {
    lootee?: number;
    looter?: number;
    slotId?: number;
    autoLoot?: number;
}

export interface GuildManageStatus {
    guildid?: number;
    oldrank?: number;
    newrank?: number;
    name?: string;
}

export interface GuildJoin {
    guildid?: number;
    level?: number;
    charClass?: number;
    rank?: number;
    zoneid?: number;
    name?: string;
}

export interface GuildInviteAccept {
    inviter?: string;
    newmember?: string;
    response?: number;
    guildeqid?: number;
}

export interface GuildManageRemove {
    guildeqid?: number;
    member?: string;
}

export interface Guildcommand {
    othername?: string;
    myname?: string;
    guildeqid?: number;
    officer?: number;
}

export interface OnLevelMessage {
    title?: string;
    text?: string;
    buttons?: number;
    duration?: number;
    popupId?: number;
}

export interface GMZoneRequest {
    charname?: string;
    zoneId?: number;
    x?: number;
    y?: number;
    z?: number;
    heading?: number;
    success?: number;
}

export interface GMSummon {
    charname?: string;
    gmname?: string;
    success?: number;
    zoneId?: number;
    y?: number;
    x?: number;
    z?: number;
}

export interface GMGoto {
    charname?: string;
    gmname?: string;
    success?: number;
    zoneId?: number;
    y?: number;
    x?: number;
    z?: number;
}

export interface GMLastName {
    name?: string;
    gmname?: string;
    lastname?: string;
}

export interface CombatAbility {
    mTarget?: number;
    mAtk?: number;
    mSkill?: number;
}

export interface Instill_Doubt {
    iId?: number;
    iAtk?: number;
    iType?: number;
}

export interface GiveItem {
    toEntity?: number;
    toEquipSlot?: number;
    fromEntity?: number;
    fromEquipSlot?: number;
}

export interface RandomReq {
    low?: number;
    high?: number;
}

export interface RandomReply {
    low?: number;
    high?: number;
    result?: number;
    name?: string;
}

export interface LFG {
    value?: number;
    name?: string;
}

export interface LFG_Appearance {
    spawnId?: number;
    lfg?: number;
}

export interface TimeOfDay {
    hour?: number;
    minute?: number;
    day?: number;
    month?: number;
    year?: number;
}

export interface Merchant_Click {
    npcid?: number;
    playerid?: number;
    command?: number;
    rate?: number;
}

export interface Merchant_Sell {
    npcid?: number;
    playerid?: number;
    itemslot?: number;
    quantity?: number;
    price?: number;
}

export interface Merchant_Purchase {
    npcid?: number;
    itemslot?: number;
    quantity?: number;
    price?: number;
}

export interface Merchant_DelItem {
    npcid?: number;
    playerid?: number;
    itemslot?: number;
}

export interface Adventure_Purchase {
    someFlag?: number;
    npcid?: number;
    itemid?: number;
    variable?: number;
}

export interface Adventure_Sell {
    npcid?: number;
    slot?: number;
    charges?: number;
    sellPrice?: number;
}

export interface AdventurePoints_Update {
    ldonAvailablePoints?: number;
    unkownApu?: number[];
    ldonGukPoints?: number;
    ldonMirugalPoints?: number;
    ldonMistmoorePoints?: number;
    ldonRujarkianPoints?: number;
    ldonTakishPoints?: number;
}

export interface AdventureFinish {
    winLose?: number;
    points?: number;
}

export interface AdventureRequest {
    risk?: number;
    entityId?: number;
}

export interface AdventureRequestResponse {
    text?: string;
    timetoenter?: number;
    timeleft?: number;
    risk?: number;
    x?: number;
    y?: number;
    z?: number;
    showcompass?: number;
}

export interface Illusion {
    spawnid?: number;
    charname?: string;
    race?: number;
    gender?: number;
    texture?: number;
    helmtexture?: number;
    face?: number;
    hairstyle?: number;
    haircolor?: number;
    beard?: number;
    beardcolor?: number;
    size?: number;
}

export interface ZonePoint_Entry {
    iterator?: number;
    y?: number;
    x?: number;
    z?: number;
    heading?: number;
    zoneid?: number;
    zoneinstance?: number;
}

export interface ZonePoints {
    count?: number;
    zpe?: number[];
}

export interface SkillUpdate {
    skillId?: number;
    value?: number;
}

export interface ZoneUnavail {
    zonename?: string;
}

export interface GroupGeneric {
    name1?: string;
    name2?: string;
}

export interface GroupCancel {
    name1?: string;
    name2?: string;
    toggle?: number;
}

export interface GroupUpdate {
    action?: number;
    yourname?: string;
    membername?: StringList[];
    leadersname?: string;
}

export interface GroupUpdate2 {
    action?: number;
    yourname?: string;
    membername?: StringList[];
    leadersname?: string;
    leaderAas?: GroupLeadershipAA;
}

export interface GroupJoin {
    action?: number;
    yourname?: string;
    membername?: string;
}

export interface FaceChange {
    haircolor?: number;
    beardcolor?: number;
    eyecolor1?: number;
    eyecolor2?: number;
    hairstyle?: number;
    beard?: number;
    face?: number;
}

export interface TradeRequest {
    toMobId?: number;
    fromMobId?: number;
}

export interface TradeAccept {
    fromMobId?: number;
}

export interface CancelTrade {
    fromid?: number;
    action?: number;
}

export interface PetitionUpdate {
    petnumber?: number;
    color?: number;
    status?: number;
    senttime?: number;
    accountid?: string;
    gmsenttoo?: string;
    quetotal?: number;
    charname?: string;
}

export interface Petition {
    petnumber?: number;
    urgency?: number;
    accountid?: string;
    lastgm?: string;
    zone?: number;
    charname?: string;
    charlevel?: number;
    charclass?: number;
    charrace?: number;
    checkouts?: number;
    unavail?: number;
    senttime?: number;
    petitiontext?: string;
    gmtext?: string;
}

export interface Who_All {
    whom?: string;
    wrace?: number;
    wclass?: number;
    lvllow?: number;
    lvlhigh?: number;
    gmlookup?: number;
}

export interface Stun {
    duration?: number;
}

export interface AugmentItem {
    containerSlot?: number;
    augmentSlot?: number;
}

export interface Emote {
    message?: string;
}

export interface Inspect {
    targetId?: number;
    playerId?: number;
}

export interface InspectResponse {
    targetId?: number;
    playerid?: number;
    itemnames?: StringList[];
    itemicons?: number[];
    text?: string;
}

export interface SetDataRate {
    newdatarate?: number;
}

export interface SetServerFilter {
    filters?: number[];
}

export interface SetServerFilterAck {
    blank?: number[];
}

export interface IncreaseStat {
    str?: number;
    sta?: number;
    agi?: number;
    dex?: number;
    int_?: number;
    wis?: number;
    cha?: number;
    fire?: number;
    cold?: number;
    magic?: number;
    poison?: number;
    disease?: number;
    str2?: number;
    sta2?: number;
    agi2?: number;
    dex2?: number;
    int2_?: number;
    wis2?: number;
    cha2?: number;
    fire2?: number;
    cold2?: number;
    magic2?: number;
    poison2?: number;
    disease2?: number;
}

export interface GMName {
    oldname?: string;
    gmname?: string;
    newname?: string;
    badname?: number;
}

export interface GMDelCorpse {
    corpsename?: string;
    gmname?: string;
}

export interface GMKick {
    name?: string;
    gmname?: string;
}

export interface GMKill {
    name?: string;
    gmname?: string;
}

export interface GMEmoteZone {
    text?: string;
}

export interface BookText {
    window?: number;
    type?: number;
    booktext?: string;
}

export interface BookRequest {
    window?: number;
    type?: number;
    txtfile?: string;
}

export interface Object {
    linkedListAddr?: number[];
    dropId?: number;
    zoneId?: number;
    zoneInstance?: number;
    heading?: number;
    z?: number;
    x?: number;
    y?: number;
    objectName?: string;
    objectType?: number;
    spawnId?: number;
}

export interface ClickObject {
    dropId?: number;
    playerId?: number;
}

export interface Shielding {
    targetId?: number;
}

export interface ClickObjectAck {
    playerId?: number;
    dropId?: number;
    open?: number;
    type?: number;
    icon?: number;
    objectName?: string;
}

export interface CloseContainer {
    playerId?: number;
    dropId?: number;
    open?: number;
}

export interface Door {
    name?: string;
    yPos?: number;
    xPos?: number;
    zPos?: number;
    heading?: number;
    incline?: number;
    size?: number;
    doorId?: number;
    opentype?: number;
    stateAtSpawn?: number;
    invertState?: number;
    doorParam?: number;
}

export interface DoorSpawns {
    count?: number;
    doors?: Door[];
}

export interface ClickDoor {
    doorid?: number;
    picklockskill?: number;
    itemId?: number;
    playerId?: number;
}

export interface MoveDoor {
    doorid?: number;
    action?: number;
}

export interface BecomeNPC {
    id?: number;
    maxlevel?: number;
}

export interface Underworld {
    speed?: number;
    y?: number;
    x?: number;
    z?: number;
}

export interface Resurrect {
    zoneId?: number;
    instanceId?: number;
    y?: number;
    x?: number;
    z?: number;
    yourName?: string;
    rezzerName?: string;
    spellid?: number;
    corpseName?: string;
    action?: number;
}

export interface SetRunMode {
    mode?: number;
}

export interface EnvDamage2 {
    id?: number;
    damage?: number;
    dmgtype?: number;
    constant?: number;
}

export interface BazaarWindowStart {
    action?: number;
}

export interface BazaarWelcome {
    beginning?: BazaarWindowStart;
    traders?: number;
    items?: number;
}

export interface BazaarSearch {
    beginning?: BazaarWindowStart;
    traderid?: number;
    charClass?: number;
    race?: number;
    stat?: number;
    slot?: number;
    type?: number;
    name?: string;
    minprice?: number;
    maxprice?: number;
    minlevel?: number;
    maxlevel?: number;
}

export interface BazaarInspect {
    itemId?: number;
    name?: string;
}

export interface BazaarReturnDone {
    type?: number;
    traderid?: number;
}

export interface BazaarSearchResults {
    beginning?: BazaarWindowStart;
    sellerId?: number;
    numItems?: number;
    serialNumber?: number;
    itemName?: string;
    cost?: number;
    itemStat?: number;
}

export interface ServerSideFilters {
    clientattackfilters?: number;
    npcattackfilters?: number;
    clientcastfilters?: number;
    npccastfilters?: number;
}

export interface ItemViewRequest {
    itemId?: number;
    augments?: number[];
    linkHash?: number;
}

export interface PickPocket {
    to?: number;
    from?: number;
    myskill?: number;
    type?: number;
    coin?: number;
    lastsix?: number[];
}

export interface sPickPocket {
    to?: number;
    from?: number;
    myskill?: number;
    type?: number;
    coin?: number;
    itemname?: string;
}

export interface LogServer {
    worldshortname?: string;
}

export interface ApproveWorld {}

export interface ClientError {
    type?: string;
    characterName?: string;
    message?: string;
}

export interface MobHealth {
    hp?: number;
    id?: number;
}

export interface Track {
    entityid?: number;
    distance?: number;
}

export interface Tracking {
    count?: number;
    entries?: Track[];
}

export interface ZoneServerInfo {
    ip?: string;
    port?: number;
}

export interface WhoAllPlayer {
    formatstring?: number;
    pidstring?: number;
    name?: string;
    rankstring?: number;
    guild?: string;
    zonestring?: number;
    zone?: number;
    charClass?: number;
    level?: number;
    race?: number;
    account?: string;
}

export interface WhoAllReturn {
    id?: number;
    playerineqstring?: number;
    line?: string;
    playersinzonestring?: number;
    count?: number;
    player?: WhoAllPlayer[];
}

export interface Trader {
    code?: number;
    itemid?: number[];
    itemcost?: number[];
}

export interface ClickTrader {
    code?: number;
    itemcost?: number[];
}

export interface GetItems {
    items?: number[];
}

export interface BecomeTrader {
    id?: number;
    code?: number;
}

export interface Trader_ShowItems {
    code?: number;
    traderId?: number;
}

export interface TraderBuy {
    action?: number;
    price?: number;
    traderId?: number;
    itemName?: string;
    itemId?: number;
    alreadySold?: number;
    quantity?: number;
}

export interface TraderItemUpdate {
    traderid?: number;
    fromslot?: number;
    toslot?: number;
    charges?: number;
}

export interface MoneyUpdate {
    platinum?: number;
    gold?: number;
    silver?: number;
    copper?: number;
}

export interface TraderDelItem {
    slotid?: number;
    quantity?: number;
}

export interface TraderClick {
    traderid?: number;
    approval?: number;
}

export interface FormattedMessage {
    stringId?: number;
    type?: number;
    message?: string;
}

export interface SimpleMessage {
    stringId?: number;
    color?: number;
}

export interface GuildMemberEntry {
    name?: string;
    level?: number;
    banker?: number;
    charClass?: number;
    rank?: number;
    timeLastOn?: number;
    tributeEnable?: number;
    totalTribute?: number;
    lastTribute?: number;
    publicNote?: string;
    zoneinstance?: number;
    zoneId?: number;
}

export interface GuildMembers {
    playerName?: string;
    count?: number;
    member?: GuildMemberEntry[];
}

export interface GuildMOTD {
    name?: string;
    setbyName?: string;
    motd?: string;
}

export interface GuildUpdate_PublicNote {
    name?: string;
    target?: string;
    note?: string;
}

export interface GuildDemote {
    name?: string;
    target?: string;
}

export interface GuildRemove {
    target?: string;
    name?: string;
    leaderstatus?: number;
}

export interface GuildMakeLeader {
    name?: string;
    target?: string;
}

export interface Make_Pet {
    level?: number;
    charClass?: number;
    race?: number;
    texture?: number;
    pettype?: number;
    size?: number;
    type?: number;
    minDmg?: number;
    maxDmg?: number;
}

export interface Ground_Spawn {
    maxX?: number;
    maxY?: number;
    minX?: number;
    minY?: number;
    maxZ?: number;
    heading?: number;
    name?: string;
    item?: number;
    maxAllowed?: number;
    respawntimer?: number;
}

export interface Ground_Spawns {
    spawn?: Ground_Spawn[];
}

export interface ApproveZone {
    name?: string;
    zoneid?: number;
    approve?: number;
}

export interface ZoneInSendName {
    name?: string;
    name2?: string;
}

export interface ZoneInSendName2 {
    name?: string;
}

export interface StartTribute {
    clientId?: number;
    tributeMasterId?: number;
    response?: number;
}

export interface TributeLevel {
    level?: number;
    tributeItemId?: number;
    cost?: number;
}

export interface TributeAbility {
    tributeId?: number;
    tierCount?: number;
    tiers?: TributeLevel[];
    name?: string;
}

export interface GuildTributeAbility {
    guildId?: number;
    ability?: TributeAbility;
}

export interface SelectTributeReq {
    clientId?: number;
    tributeId?: number;
}

export interface SelectTributeReply {
    clientId?: number;
    tributeId?: number;
    desc?: string;
}

export interface TributeInfo {
    active?: number;
    tributes?: number[];
    tiers?: number[];
    tributeMasterId?: number;
}

export interface TributeItem {
    slot?: number;
    quantity?: number;
    tributeMasterId?: number;
    tributePoints?: number;
}

export interface TributePoint {
    tributePoints?: number;
    careerTributePoints?: number;
}

export interface TributeMoney {
    platinum?: number;
    tributeMasterId?: number;
    tributePoints?: number;
}

export interface Split {
    platinum?: number;
    gold?: number;
    silver?: number;
    copper?: number;
}

export interface NewCombine {
    containerSlot?: number;
    guildtributeSlot?: number;
}

export interface TradeskillFavorites {
    objectType?: number;
    someId?: number;
    favoriteRecipes?: number[];
}

export interface RecipesSearch {
    objectType?: number;
    someId?: number;
    mintrivial?: number;
    maxtrivial?: number;
    query?: string;
}

export interface RecipeReply {
    objectType?: number;
    someId?: number;
    componentCount?: number;
    recipeId?: number;
    trivial?: number;
    recipeName?: string;
}

export interface RecipeAutoCombine {
    objectType?: number;
    someId?: number;
    recipeId?: number;
    replyCode?: number;
}

export interface LevelAppearance {
    spawnId?: number;
    parm1?: number;
    value1a?: number;
    value1b?: number;
    parm2?: number;
    value2a?: number;
    value2b?: number;
    parm3?: number;
    value3a?: number;
    value3b?: number;
    parm4?: number;
    value4a?: number;
    value4b?: number;
    parm5?: number;
    value5a?: number;
    value5b?: number;
}

export interface MerchantList {
    id?: number;
    slot?: number;
    item?: number;
}

export interface TempMerchantList {
    npcid?: number;
    slot?: number;
    item?: number;
    charges?: number;
    origslot?: number;
}

export interface FindPerson_Point {
    y?: number;
    x?: number;
    z?: number;
}

export interface FindPersonRequest {
    npcId?: number;
    clientPos?: number;
}

export interface FindPersonResult {
    dest?: number;
    path?: number[];
}

export interface MobRename {
    oldName?: string;
    oldNameAgain?: string;
    newName?: string;
}

export interface PlayMP3 {
    filename?: string;
}

export interface TitleEntry {
    skillId?: number;
    skillValue?: number;
    title?: string;
}

export interface Titles {
    count?: number;
    titles?: TitleEntry[];
}

export interface TitleListEntry {
    prefix?: string;
    postfix?: string;
}

export interface TitleList {
    count?: number;
    titles?: TitleListEntry[];
}

export interface SetTitle {
    isSuffix?: number;
    titleId?: number;
}

export interface SetTitleReply {
    isSuffix?: number;
    title?: string;
    entityId?: number;
}

export interface TaskDescription {
    activityCount?: number;
    taskid?: number;
    unk?: number;
    id?: number;
    name?: string;
    desc?: string;
    rewardCount?: number;
    rewardLink?: string;
}

export interface TaskMemberList {
    gopherId?: number;
    memberCount?: number;
    listPointer?: string;
}

export interface TaskActivity {
    activityCount?: number;
    id?: number;
    taskid?: number;
    activityId?: number;
    activityType?: number;
    mobName?: string;
    itemName?: string;
    goalCount?: number;
    activityName?: string;
    doneCount?: number;
}

export interface TaskHistoryEntry {
    taskId?: number;
    name?: string;
    completedTime?: number;
}

export interface TaskHistory {
    count?: number;
    entries?: TaskHistoryEntry[];
}

export interface AcceptNewTask {
    taskId?: number;
    taskMasterId?: number;
}

export interface CancelTask {}

export interface AvaliableTask {
    taskIndex?: number;
    taskMasterId?: number;
    taskId?: number;
    activityCount?: number;
    desc?: string;
    rewardPlatinum?: number;
    rewardGold?: number;
    rewardSilver?: number;
    rewardCopper?: number;
    someName?: string;
}

export interface BankerChange {
    platinum?: number;
    gold?: number;
    silver?: number;
    copper?: number;
    platinumBank?: number;
    goldBank?: number;
    silverBank?: number;
    copperBank?: number;
}

export interface LeadershipExpUpdate {
    groupLeadershipExp?: number;
    groupLeadershipPoints?: number;
    raidLeadershipExp?: number;
    raidLeadershipPoints?: number;
}

export interface UpdateLeadershipAA {
    abilityId?: number;
    newRank?: number;
    pointsleft?: number;
}

export interface LeadExpUpdate {
    groupLeadershipExp?: number;
    groupLeadershipPoints?: number;
    raidLeadershipExp?: number;
    raidLeadershipPoints?: number;
}

export interface RaidGeneral {
    action?: number;
    playerName?: string;
    leaderName?: string;
    parameter?: number;
}

export interface RaidAddMember {
    raidGen?: RaidGeneral;
    charClass?: number;
    level?: number;
    isGroupLeader?: number;
}

export interface RaidNote {
    general?: RaidGeneral;
    note?: string;
}

export interface RaidMOTD {
    general?: RaidGeneral;
    motd?: string;
}

export interface RaidLeadershipUpdate {
    action?: number;
    playerName?: string;
    leaderName?: string;
    group?: GroupLeadershipAA;
    raid?: RaidLeadershipAA;
}

export interface RaidCreate {
    action?: number;
    leaderName?: string;
    leaderId?: number;
}

export interface RaidMemberInfo {
    groupNumber?: number;
    memberName?: string;
    charClass?: number;
    level?: number;
    isRaidLeader?: number;
    isGroupLeader?: number;
    mainTank?: number;
}

export interface RaidDetails {
    action?: number;
    leaderName?: string;
    abilities?: LeadershipAA;
    leaderId?: number;
}

export interface RaidMembers {
    details?: RaidDetails;
    memberCount?: number;
    members?: RaidMemberInfo[];
    empty?: RaidMemberInfo;
}

export interface DynamicWall {
    name?: string;
    y?: number;
    x?: number;
    z?: number;
    oneHundred?: number;
}

export interface BandolierCreate {
    action?: number;
    number?: number;
    name?: string;
}

export interface BandolierDelete {
    action?: number;
    number?: number;
}

export interface BandolierSet {
    action?: number;
    number?: number;
}

export interface Arrow {
    type?: number;
    srcY?: number;
    srcX?: number;
    srcZ?: number;
    velocity?: number;
    launchAngle?: number;
    tilt?: number;
    arc?: number;
    sourceId?: number;
    targetId?: number;
    itemId?: number;
    modelName?: string;
}

export interface Consent {
    name?: string;
}

export interface AdventureMerchant {
    entityId?: number;
}

export interface Save {}

export interface GMtoggle {
    toggle?: number;
}

export interface GroupInvite {
    inviteeName?: string;
    inviterName?: string;
}

export interface ColoredText {
    color?: number;
    msg?: string;
}

export interface UseAA {
    begin?: number;
    ability?: number;
    end?: number;
}

export interface AA_Ability {
    skillId?: number;
    baseValue?: number;
    limitValue?: number;
    slot?: number;
}

export interface SendAA {
    id?: number;
    hotkeySid?: number;
    hotkeySid2?: number;
    titleSid?: number;
    descSid?: number;
    classType?: number;
    cost?: number;
    seq?: number;
    currentLevel?: number;
    prereqSkill?: number;
    prereqMinpoints?: number;
    type?: number;
    spellid?: number;
    spellType?: number;
    spellRefresh?: number;
    classes?: number;
    maxLevel?: number;
    lastId?: number;
    nextId?: number;
    cost2?: number;
    count?: number;
    abilities?: AA_Ability[];
}

export interface AA_List {
    count?: number;
    aa?: SendAA[];
}

export interface AA_Action {
    action?: number;
    ability?: number;
    targetId?: number;
    expValue?: number;
}

export interface AAExpUpdate {
    aapointsUnspent?: number;
    aaxpPercent?: number;
}

export interface AltAdvStats {
    experience?: number;
    unspent?: number;
    percentage?: number;
}

export interface PlayerAA {
    aaList?: AA_Array[];
}

export interface AATable {
    aaList?: AA_Array[];
}

export interface Weather {
    val?: number;
    type?: number;
    mode?: number;
}

export interface LoadSpellSet {
    spell?: number[];
}

export interface ApplyPoison {
    inventorySlot?: number;
    success?: number;
}

export interface GuildMemberUpdate {
    guildId?: number;
    memberName?: string;
    zoneId?: number;
    instanceId?: number;
}

export interface VeteranRewardItem {
    itemId?: number;
    itemName?: string;
}

export interface VeteranReward {
    claimId?: number;
    item?: VeteranRewardItem;
}

export interface ExpeditionInvite {
    clientId?: number;
    inviterName?: string;
    expeditionName?: string;
    swapping?: number;
    swapName?: string;
    padding?: number[];
    dzZoneId?: number;
    dzInstanceId?: number;
}

export interface ExpeditionInviteResponse {
    dzZoneId?: number;
    dzInstanceId?: number;
    accepted?: number;
    swapping?: number;
    swapName?: string;
}

export interface DynamicZoneInfo {
    clientId?: number;
    assigned?: number;
    maxPlayers?: number;
    dzName?: string;
    leaderName?: string;
}

export interface DynamicZoneMemberEntry {
    name?: string;
    onlineStatus?: number;
}

export interface DynamicZoneMemberList {
    clientId?: number;
    count?: number;
    members?: DynamicZoneMemberEntry[];
}

export interface DynamicZoneMemberListName {
    clientId?: number;
    addName?: number;
    name?: string;
}

export interface ExpeditionLockoutTimerEntry {
    expeditionName?: string;
    secondsRemaining?: number;
    eventType?: number;
    eventName?: string;
}

export interface ExpeditionLockoutTimers {
    clientId?: number;
    count?: number;
    timers?: ExpeditionLockoutTimerEntry[];
}

export interface DynamicZoneLeaderName {
    clientId?: number;
    leaderName?: string;
}

export interface ExpeditionCommand {
    name?: string;
}

export interface ExpeditionCommandSwap {
    addPlayerName?: string;
    remPlayerName?: string;
}

export interface ExpeditionExpireWarning {
    clientId?: number;
    minutesRemaining?: number;
}

export interface DynamicZoneCompassEntry {
    dzZoneId?: number;
    dzInstanceId?: number;
    dzType?: number;
    dzSwitchId?: number;
    y?: number;
    x?: number;
    z?: number;
}

export interface DynamicZoneCompass {
    clientId?: number;
    count?: number;
    entries?: DynamicZoneCompassEntry[];
}

export interface DynamicZoneChooseZoneEntry {
    dzZoneId?: number;
    dzInstanceId?: number;
    dzType?: number;
    description?: string;
    leaderName?: string;
}

export interface DynamicZoneChooseZone {
    clientId?: number;
    count?: number;
    choices?: DynamicZoneChooseZoneEntry[];
}

export interface DynamicZoneChooseZoneReply {
    dzZoneId?: number;
    dzInstanceId?: number;
    dzType?: number;
}

export interface LFGuild_SearchPlayer {
    command?: number;
    fromLevel?: number;
    toLevel?: number;
    minAa?: number;
    timeZone?: number;
    classes?: number;
}

export interface LFGuild_SearchGuild {
    command?: number;
    level?: number;
    aaPoints?: number;
    timeZone?: number;
    charClass?: number;
}

export interface LFGuild_Playertoggle {
    command?: number;
    comment?: string;
    timeZone?: number;
    toggle?: number;
    expires?: number;
}

export interface LFGuild_Guildtoggle {
    command?: number;
    comment?: string;
    fromLevel?: number;
    toLevel?: number;
    classes?: number;
    aaCount?: number;
    timeZone?: number;
    toggle?: number;
    expires?: number;
    name?: string;
}

export interface SayLinkBodyFrame {
    actionId?: string;
    itemId?: string;
    augment1?: string;
    augment2?: string;
    augment3?: string;
    augment4?: string;
    augment5?: string;
    isEvolving?: string;
    evolveGroup?: string;
    evolveLevel?: string;
    hash?: string;
}

export interface WebLogin {
    username?: string;
    password?: string;
}

export interface WebLoginServerRequest {
    sequence?: number;
}

export interface WebLoginReply {
    key?: string;
    errorStrId?: number;
    failedAttempts?: number;
    lsid?: number;
    success?: boolean;
    showPlayerCount?: boolean;
}

export interface WebLoginWorldServer {
    buffer?: string;
    ip?: string;
    longName?: string;
    countryCode?: string;
    languageCode?: string;
    serverType?: number;
    serverId?: number;
    status?: number;
    playersOnline?: number;
}

export interface WebLoginServerResponse {
    serverCount?: number;
    servers?: WebLoginWorldServer[];
}

export interface WebPlayEverquestRequest {
    serverId?: number;
}

export interface WebPlayEverquestResponse {
    serverId?: number;
    success?: boolean;
    errorStrId?: number;
}

export interface WebInitiateConnection {
    login?: boolean;
}

export interface WebSession {
    remoteAddr?: string;
    remoteIp?: number;
    remotePort?: number;
}
