
export const mq: MacroQuest.MQGlobal;

export const tlo: MacroQuest.TopLevelObjects;

/** Object Interfaces **/
namespace MacroQuest {
    interface MQGlobal {
        /**
         * Logs to MQ Chat window
         */
        log(): void;
    
        /**
         * Warns to chat window - Yellow text
         */
        warn(): void;
    
        /**
         *
         * @param evalString String to parse by MacroQuest variable parsing
         * @returns Return of the parsed string, possibly cast to number, bool or string
         * @example eval('Me.Name') -> "Jamesjoyce"
         * @example eval('Me.Stunned') -> false
         * @example eval('Me.Copper') -> 12345
         */
        eval(evalString): string | bool | number;
    
        /**
         *
         * @param command Command to run
         * @example run('say Hello there!') -> '/say Hello there!'
         * @example run('bct Groupie //sit') -> '/bct Groupie //sit'
         */
        run(command: string): void;
    
        /**
         * @returns Spawn matching the ID or if not found, null
         * @param id Spawn ID
         */
    
        tlo: TopLevelObjects
    }

    interface TopLevelObjects {
        
        /**
         * @summary Look up an achievement by name or by id. 
         * @param arg - Description: `#|_Name_`
         */
        Achievement(arg: string) : Achievement;
            
        /**
         * @summary Returns pipe "|" separated list of alert ids 
         */
        Alert : String;
            
        /**
         * @summary  
         */
        AltAbility : Altability;
            
        /**
         * @summary  
         */
        AltAbility : Altability;
            
        /**
         * @summary No description 
         * @param arg - Description: `text`
         */
        Bool(arg: string) : Bool;
            
        /**
         * @summary No description 
         */
        Corpse : Corpse;
            
        /**
         * @summary No description 
         */
        Cursor : Item;
            
        /**
         * @summary No description 
         * @param arg - Description: `name`
         */
        Defined(arg: string) : Bool;
            
        /**
         * @summary No description 
         */
        DisplayItem : Item;
            
        /**
         * @summary No description 
         */
        DoorTarget : Spawn;
            
        /**
         * @summary No description 
         */
        DynamicZone : Dynamiczone;
            
        /**
         * @summary No description 
         */
        Event : Event;
            
        /**
         * @summary No description 
         */
        EverQuest : Everquest;
            
        /**
         * @summary Retrieves the item in your familiars keyring by index 
         * @param arg - Description: `N`
         */
        Familiar(arg: string) : Keyringitem;
            
        /**
         * @summary Retrieve the item in your familiars keyring by name. A `=` can be prepended for an exact match. 
         * @param arg - Description: `name`
         */
        Familiar(arg: string) : Keyringitem;
            
        /**
         * @summary Access to the familiars keyring 
         */
        Familiar : Keyring;
            
        /**
         * @summary No description 
         */
        Familiar : Keyring;
            
        /**
         * @summary  
         */
        FindItem : Item;
            
        /**
         * @summary  
         */
        FindItem : Item;
            
        /**
         * @summary  
         */
        FindItemBank : Item;
            
        /**
         * @summary  
         */
        FindItemBank : Item;
            
        /**
         * @summary  
         */
        FindItemBankCount : Int;
            
        /**
         * @summary  
         */
        FindItemBankCount : Int;
            
        /**
         * @summary  
         */
        FindItemCount : Int;
            
        /**
         * @summary  
         */
        FindItemCount : Int;
            
        /**
         * @summary No description 
         * @param arg - Description: `n`
         */
        Float(arg: string) : Float;
            
        /**
         * @summary No description 
         */
        FPS : Fps;
            
        /**
         * @summary No description 
         */
        Friends : Friends;
            
        /**
         * @summary No description 
         */
        GameTime : Time;
            
        /**
         * @summary No description 
         */
        GameTime : Time;
            
        /**
         * @summary No description 
         */
        Ground : Ground;
            
        /**
         * @summary No description 
         */
        Group : Group;
            
        /**
         * @summary  
         */
        Heading : Heading;
            
        /**
         * @summary  
         */
        Heading : Heading;
            
        /**
         * @summary  
         */
        Heading : Heading;
            
        /**
         * @summary Retrieves the item in your illusions keyring by index 
         * @param arg - Description: `N`
         */
        Illusion(arg: string) : Keyringitem;
            
        /**
         * @summary Retrieve the item in your illusions keyring by name. A `=` can be prepended for an exact match. 
         * @param arg - Description: `name`
         */
        Illusion(arg: string) : Keyringitem;
            
        /**
         * @summary Access to the illusions keyring 
         */
        Illusion : Keyring;
            
        /**
         * @summary No description 
         */
        Illusion : Keyring;
            
        /**
         * @summary No description 
         * @param arg - Description: `n`
         */
        Int(arg: string) : Int;
            
        /**
         * @summary No description 
         */
        Irc : Irc;
            
        /**
         * @summary  
         */
        LastSpawn : Spawn;
            
        /**
         * @summary  
         */
        LastSpawn : Spawn;
            
        /**
         * @summary No description 
         * @param arg - Description: `y,x,z:y,x,z`
         */
        LineOfSight(arg: string) : Bool;
            
        /**
         * @summary No description 
         * @param arg - Description: `y,x,z,y,x,z`
         */
        LineOfSight(arg: string) : Bool;
            
        /**
         * @summary No description 
         */
        MacroQuest : Macroquest;
            
        /**
         * @summary No description 
         */
        Math : Math;
            
        /**
         * @summary No description 
         */
        Me : Character;
            
        /**
         * @summary  
         */
        Mercenary : Mercenary;
            
        /**
         * @summary No description 
         */
        Merchant : Merchant;
            
        /**
         * @summary Retrieves the item in your mount keyring by index 
         * @param arg - Description: `N`
         */
        Mount(arg: string) : Keyringitem;
            
        /**
         * @summary Retrieve the item in your mount keyring by name. A `=` can be prepended for an exact match. 
         * @param arg - Description: `name`
         */
        Mount(arg: string) : Keyringitem;
            
        /**
         * @summary Access to the Mount keyring 
         */
        Mount : Keyring;
            
        /**
         * @summary No description 
         */
        Mount : Keyring;
            
        /**
         * @summary The #th nearest spawn 
         * @param arg - Description: `#`
         */
        NearestSpawn(arg: string) : Spawn;
            
        /**
         * @summary The nearest spawn matching this search string (see [Spawn Search](../../general-information/spawn-search.md)) 
         * @param arg - Description: `search`
         */
        NearestSpawn(arg: string) : Spawn;
            
        /**
         * @summary The #th nearest spawn matching this search string (see [Spawn Search](../../general-information/spawn-search.md)) 
         * @param arg - Description: `#,search`
         */
        NearestSpawn(arg: string) : Spawn;
            
        /**
         * @summary Plugin by number, starting with 1 and stopping whenever the list runs out of plugins. 
         * @param arg - Description: `#`
         */
        Plugin(arg: string) : Plugin;
            
        /**
         * @summary Finds plugin by name 
         * @param arg - Description: `name`
         */
        Plugin(arg: string) : Plugin;
            
        /**
         * @summary No description 
         */
        Raid : Raid;
            
        /**
         * @summary No description 
         */
        Range : Range;
            
        /**
         * @summary No description 
         * @param arg - Description: `argument_,_value1_[,_value2_,...]`
         */
        Select(arg: string)_ : Int;
            
        /**
         * @summary No description 
         */
        SelectedItem : Item;
            
        /**
         * @summary  
         */
        Skill : Skill;
            
        /**
         * @summary  
         */
        Skill : Skill;
            
        /**
         * @summary Spawn matching ID # 
         * @param arg - Description: `#`
         */
        Spawn(arg: string) : Spawn;
            
        /**
         * @summary Any spawns matching _search string_ 
         * @param arg - Description: `search string`
         */
        Spawn(arg: string) : Spawn;
            
        /**
         * @summary  
         */
        SpawnCount : Int;
            
        /**
         * @summary  
         */
        SpawnCount : Int;
            
        /**
         * @summary  
         */
        Spell : Spell;
            
        /**
         * @summary  
         */
        Spell : Spell;
            
        /**
         * @summary No description 
         */
        Switch : Switch;
            
        /**
         * @summary No description 
         */
        Target : Target;
            
        /**
         * @summary No description 
         */
        Target : Spawn;
            
        /**
         * @summary No description 
         */
        Task : Task;
            
        /**
         * @summary No description 
         */
        Time : Time;
            
        /**
         * @summary No description 
         * @param arg - Description: `name`
         */
        Window(arg: string) : Window;
            
        /**
         * @summary  
         */
        Zone : Currentzone;
            
        /**
         * @summary  
         */
        Zone : Zone;
            
        /**
         * @summary  
         */
        Zone : Zone;
            
    }

    
        interface Achievement {
            /**
             * Members
             */
            
            /**
             * @summary The achievement's unique ID. 
             */
            ID : Int;
                
            /**
             * @summary The achievement's name 
             */
            Name : String;
                
            /**
             * @summary The achievement's description 
             */
            Description : String;
                
            /**
             * @summary The point value for the achievement 
             */
            Points : Int;
                
            /**
             * @summary Find an objective by its objective ID or Description. 
             * @param arg - Description: `#|_Description_`
             */
            Objective(arg: string) : Achievementobj;
                
            /**
             * @summary Find an objective by its visual ordering as displayed in the achievements window. 
             * @param arg - Description: `#`
             */
            ObjectiveByIndex(arg: string) : Achievementobj;
                
            /**
             * @summary The number of objectives in this achievement. 
             */
            ObjectiveCount : Int;
                
            /**
             * @summary Generate an achievement link. An optional name can be provided to display in the achievement, otherwise the current character's name will be used. 
             * @param arg - Description: `_opt: Name_`
             */
            Link(arg: string) : String;
                
            /**
             * @summary The index of the achievement. See [Achievement Indices](../top-level-objects/tlo-achievement.md#note-about-achievement-indices) for more information. 
             */
            Index : Int;
                
            /**
             * @summary ID of the Achievement's Icon. See [Achievement Icon](datatype-achievement.md#achievement-icon) below. 
             */
            IconID : Int;
                
            /**
             * @summary The achievement state. See [Achievement State](datatype-achievement.md#achievement-state) below. 
             */
            State : String;
                
            /**
             * @summary True if the achievement has been completed 
             */
            Completed : Bool;
                
            /**
             * @summary True if the achievement is open 
             */
            Open : Bool;
                
            /**
             * @summary True if the achievement is locked 
             */
            Locked : Bool;
                
            /**
             * @summary True if the achievement is hidden 
             */
            Hidden : Bool;
                
            /**
             * @summary Calendar time when the achievement was completed. 
             */
            CompletedTime : Time;
                

            /**
             * Methods
             */
             
        }
        
        interface Achievementcat {
            /**
             * Members
             */
            
            /**
             * @summary The unique ID for the category 
             */
            ID : Int;
                
            /**
             * @summary The category's display name 
             */
            Name : String;
                
            /**
             * @summary The category's description 
             */
            Description : String;
                
            /**
             * @summary Find an achievement in this category by its ID or name. 
             * @param arg - Description: `#|_Name_`
             */
            Achievement(arg: string) : Achievement;
                
            /**
             * @summary Find an achievement by its index in this category. 
             * @param arg - Description: `#`
             */
            AchievementByIndex(arg: string) : Achievement;
                
            /**
             * @summary The number of achievements in this category. 
             */
            AchievementCount : Int;
                
            /**
             * @summary Find a child category in this category by its ID or name. 
             * @param arg - Description: `#|_Name_`
             */
            Category(arg: string) : Achievementcat;
                
            /**
             * @summary Find a child category by its index in this category. 
             */
            CategoryByIndex : Achievementcat;
                
            /**
             * @summary The number of child categories in this category. 
             */
            CategoryCount : Int;
                
            /**
             * @summary The total earned points of achievements in this category. 
             */
            Points : Int;
                
            /**
             * @summary The number of achievements earned in this category and its subcategories 
             */
            CompletedAchievements : Int;
                
            /**
             * @summary The total number of achievements in this category and its subcategories. 
             */
            TotalAchievements : Int;
                
            /**
             * @summary Name of the image texture that is used to represent this category in the Achievements Window. 
             */
            ImageTextureName : String;
                
            /**
             * @summary The index of the category in the achievement manager. For more information see [Achievement Indices](../top-level-objects/tlo-achievement.md#note-about-achievement-indices). 
             */
            Index : Int;
                

            /**
             * Methods
             */
             
        }
        
        interface Achievementcomp {
            /**
             * Members
             */
            
            /**
             * @summary The achievement's component's unique ID. 
             */
            ID : Int;
                

            /**
             * Methods
             */
             
        }
        
        interface Achievementobj {
            /**
             * Members
             */
            
            /**
             * @summary The objective's unique ID. 
             */
            ID : Int;
                
            /**
             * @summary Text describing this objective. 
             */
            Description : String;
                
            /**
             * @summary The current count recorded by the objective. 
             */
            Count : Int;
                
            /**
             * @summary The total count required to be complete the objective. For objectives that don't require a count, this will be zero. 
             */
            RequiredCount : Int;
                
            /**
             * @summary True if the objective has been completed. 
             */
            Completed : Bool;
                
            /**
             * @summary Visual index of the objective as displayed in the achievement window. Can be used with **Achievement.ObjectiveByIndex**. 
             */
            Index : Int;
                

            /**
             * Methods
             */
             
        }
        
        interface Alertlist {
            /**
             * Members
             */
            

            /**
             * Methods
             */
             
        }
        
        interface Altability {
            /**
             * Members
             */
            
            /**
             * @summary Rank required to train 
             */
            AARankRequired : Int;
                
            /**
             * @summary Returns true/false on if the Alternative Ability can be trained 
             */
            CanTrain : Bool;
                
            /**
             * @summary The name of the category that this AA belongs to. 
             */
            Category : String;
                
            /**
             * @summary Base cost to train 
             */
            Cost : Int;
                
            /**
             * @summary Basic description 
             */
            Description : String;
                
            /**
             * @summary ID of the AA group that this AA belongs to 
             */
            GroupID : Int;
                
            /**
             * @summary ID 
             */
            ID : Int;
                
            /**
             * @summary Returns the index number of the Alternative Ability 
             */
            Index : Int;
                
            /**
             * @summary Max rank available in this ability 
             */
            MaxRank : Int;
                
            /**
             * @summary Minimum level to train 
             */
            MinLevel : Int;
                
            /**
             * @summary Reuse time with any hastened AA abilties 
             */
            MyReuseTime : Int;
                
            /**
             * @summary Name 
             */
            Name : String;
                
            /**
             * @summary Returns the next index number of the Alternative Ability 
             */
            NextIndex : Int;
                
            /**
             * @summary Returns the amount of points spent on an AA 
             */
            PointsSpent : Int;
                
            /**
             * @summary Returns true/false on if the Alternative Ability is passive 
             */
            Passive : Bool;
                
            /**
             * @summary Required ability (if any) 
             */
            RequiresAbility : Altability;
                
            /**
             * @summary Returns the Rank of the AA 
             */
            Rank : Int;
                
            /**
             * @summary Points required in above ability 
             */
            RequiresAbilityPoints : Int;
                
            /**
             * @summary Reuse time in seconds 
             */
            ReuseTime : Int;
                
            /**
             * @summary First line of button label (if any) 
             */
            ShortName : String;
                
            /**
             * @summary Second line of button label (if any) 
             */
            ShortName2 : String;
                
            /**
             * @summary Spell used by the ability (if any) 
             */
            Spell : Spell;
                

            /**
             * Methods
             */
             
        }
        
        interface Argb {
            /**
             * Members
             */
            
            /**
             * @summary Alpha 
             */
            A : Int;
                
            /**
             * @summary Red 
             */
            R : Int;
                
            /**
             * @summary Green 
             */
            G : Int;
                
            /**
             * @summary Blue 
             */
            B : Int;
                
            /**
             * @summary The integer formed by ARGB 
             */
            Int : Int;
                
            /**
             * @summary The hex value of the integer formed by **ARGB** 
             */
            "To String" : String;
                

            /**
             * Methods
             */
             
        }
        
        interface Array {
            /**
             * Members
             */
            
            /**
             * @summary Number of dimensions in the array 
             */
            Dimensions : Int;
                
            /**
             * @summary Total number of elements in the array 
             */
            Size : Int;
                
            /**
             * @summary Total number of elements stored in the #th dimension of the array 
             * @param arg - Description: `#`
             */
            Size(arg: string) : Int;
                
            /**
             * @summary _None_ 
             */
            "To String" : String;
                

            /**
             * Methods
             */
             
        }
        
        interface Body {
            /**
             * Members
             */
            
            /**
             * @summary The ID of the body type 
             */
            ID : Int;
                
            /**
             * @summary The full name of the body type 
             */
            Name : String;
                
            /**
             * @summary Same as **Name** 
             */
            "To String" : String;
                

            /**
             * Methods
             */
             
        }
        
        interface Bool {
            /**
             * Members
             */
            
            /**
             * @summary "TRUE" for non-zero, or "FALSE" for zero 
             */
            "To String" : String;
                

            /**
             * Methods
             */
             
        }
        
        interface Buff extends Spell {
            /**
             * Members
             */
            
            /**
             * @summary The number of counters added by the buff 
             */
            Counters : Int;
                
            /**
             * @summary The remaining damage absorption of the buff (if any). _This is not entirely accurate, it will only show you to the Dar of your spell when it was initially cast, or what it was when you last zoned (whichever is more recent)._ 
             */
            Dar : Int;
                
            /**
             * @summary The time remaining before the buff fades (not total duration) 
             */
            Duration : Ticks;
                
            /**
             * @summary The ID of the buff or shortbuff slot 
             */
            ID : Int;
                
            /**
             * @summary The level of the person that cast the buff on you (not the level of the spell) 
             */
            Level : Int;
                
            /**
             * @summary The modifier to a bard song 
             */
            Mod : Float;
                
            /**
             * @summary The spell 
             */
            Spell : Spell;
                
            /**
             * @summary Same as Name 
             */
            "To String" : String;
                

            /**
             * Methods
             */
             
            /**
             * @summary Removes the named/partial name buff 
             */
            Remove();
                
        }
        
        interface Byte {
            /**
             * Members
             */
            

            /**
             * Methods
             */
             
        }
        
        interface Cachedbuff {
            /**
             * Members
             */
            
            /**
             * @summary Returns the name of the caster who applied the cached buff 
             */
            CasterName : String;
                
            /**
             * @summary Returns the amount of buffs catched, or -1 it none 
             */
            Count : Int;
                
            /**
             * @summary Returns the duration of the cached buff 
             */
            Duration : Int;
                
            /**
             * @summary Returns the buff slot the target had the buff in 
             */
            Slot : Int;
                
            /**
             * @summary Returns the buff's spell ID 
             */
            SpellID : Int;
                

            /**
             * Methods
             */
             
        }
        
        interface Character extends Spawn {
            /**
             * Members
             */
            
            /**
             * @summary AA exp as a raw number out of 10,000 10,000=100  
             */
            AAExp : Int;
                
            /**
             * @summary Unused AA points 
             */
            AAPoints : Int;
                
            /**
             * @summary Number of AA Points currently assigned 
             */
            AAPointsAssigned : Int;
                
            /**
             * @summary The number of points you have spent on AA abilities 
             */
            AAPointsSpent : Int;
                
            /**
             * @summary The total number of AA points you have 
             */
            AAPointsTotal : Int;
                
            /**
             * @summary The total number of AA Vitality you have 
             */
            AAVitality : Int;
                
            /**
             * @summary Skill name assigned to this doability button 
             * @param arg - Description: `name`
             */
            Ability(arg: string) : String;
                
            /**
             * @summary The doability button number that the skill name is on 
             * @param arg - Description: `#`
             */
            Ability(arg: string) : Int;
                
            /**
             * @summary Ability with this name or on this button ready? 
             * @param arg - Description: `#|name`
             */
            AbilityReady(arg: string) : Bool;
                
            /**
             * @summary Accuracy bonus from gear and spells 
             */
            AccuracyBonus : Int;
                
            /**
             * @summary Returns a spell if melee discipline is active. 
             */
            ActiveDisc : Spell;
                
            /**
             * @summary If Tribute is active how much it is costing you every 10 minutes Returns NULL if tribute is inactive. 
             */
            ActiveFavorCost : Int;
                
            /**
             * @summary Returns the name of the Aegolism buff or equivalent Aego HP Buff Symbol from a Cleric. 
             */
            Aego : Buff;
                
            /**
             * @summary Spawn info for aggro lock player 
             */
            AggroLock : Spawn;
                
            /**
             * @summary Character Agility 
             */
            AGI : Int;
                
            /**
             * @summary Returns the total number of points you have spent in ability or name 
             * @param arg - Description: `#|name`
             */
            AltAbility(arg: string) : Altability;
                
            /**
             * @summary Alt ability or name ready? 
             * @param arg - Description: `#|name`
             */
            AltAbilityReady(arg: string) : Bool;
                
            /**
             * @summary Alt ability reuse time remaining in ticks for ability or name 
             * @param arg - Description: `#|name`
             */
            AltAbilityTimer(arg: string) : Int;
                
            /**
             * @summary The amount of alternate currency given the name e.g Marks of Valor) 
             * @param arg - Description: `name`
             */
            AltCurrency(arg: string) : Int;
                
            /**
             * @summary Alternate timer ready Bash/Slam/Frenzy/Backstab Note AbilityReady works fine with most of these. 
             */
            AltTimerReady : Bool;
                
            /**
             * @summary Am I the group leader? 
             */
            AmIGroupLeader : Bool;
                
            /**
             * @summary returns true/false if the assist is complete 
             */
            AssistComplete : Bool;
                
            /**
             * @summary Attack bonus from gear and spells 
             */
            AttackBonus : Int;
                
            /**
             * @summary Your Attack Speed No haste spells/items AttackSpeed of 100 A 41 haste item will result in an AttackSpeed of 141 This variable does not take into account spell or song haste. 
             */
            AttackSpeed : Int;
                
            /**
             * @summary The aura effect name 
             */
            Aura : String;
                
            /**
             * @summary Is Autofire on? 
             */
            AutoFire : Bool;
                
            /**
             * @summary Avoidance bonus from gear/spells 
             */
            AvoidanceBonus : Int;
                
            /**
             * @summary Item in this bankslot  
             * @param arg - Description: `#`
             */
            Bank(arg: string) : Item;
                
            /**
             * @summary Is a bard song playing? 
             */
            BardSongPlaying : Bool;
                
            /**
             * @summary Base Agility 
             */
            BaseAGI : Int;
                
            /**
             * @summary Base Charisma 
             */
            BaseCHA : Int;
                
            /**
             * @summary Base Dexterity 
             */
            BaseDEX : Int;
                
            /**
             * @summary Base Intelligence 
             */
            BaseINT : Int;
                
            /**
             * @summary Base Stamana 
             */
            BaseSTA : Int;
                
            /**
             * @summary Base Strength 
             */
            BaseSTR : Int;
                
            /**
             * @summary Base Wisdom 
             */
            BaseWIS : Int;
                
            /**
             * @summary Returns the first Beneficial buff found in your list of buffs 
             */
            Beneficial : Buff;
                
            /**
             * @summary Slot in your spell book assigned to spell name 
             * @param arg - Description: `name`
             */
            Book(arg: string) : Int;
                
            /**
             * @summary Spell assigned to this slot in your spell book 
             * @param arg - Description: `#`
             */
            Book(arg: string) : Spell;
                
            /**
             * @summary Returns information about your bind points 0-4) 
             * @param arg - Description: `#`
             */
            BoundLocation(arg: string) : Worldlocation;
                
            /**
             * @summary Returns the Brell's line HP buff from a Paladin 
             */
            Brells : Buff;
                
            /**
             * @summary The buff with this name 
             * @param arg - Description: `name`
             */
            Buff(arg: string) : Buff;
                
            /**
             * @summary The buff in this slot  
             * @param arg - Description: `#`
             */
            Buff(arg: string) : Buff;
                
            /**
             * @summary Are you an active buyer? 
             */
            Buyer : Bool;
                
            /**
             * @summary Can you use a mount here? 
             */
            CanMount : Bool;
                
            /**
             * @summary Career favor/tribute 
             */
            CareerFavor : Int;
                
            /**
             * @summary Total cash on your character expressed in coppers eg if you are carrying 100pp Cash will return 100000) 
             */
            Cash : Int;
                
            /**
             * @summary Total cash in your bank expressed in coppers 
             */
            CashBank : Int;
                
            /**
             * @summary Character Charisma 
             */
            CHA : Int;
                
            /**
             * @summary Chronobines on your character 
             */
            Chronobines : Int;
                
            /**
             * @summary Clairvoyance Bonus 
             */
            ClairvoyanceBonus : Int;
                
            /**
             * @summary In combat? 
             */
            Combat : Bool;
                
            /**
             * @summary The name of Combat Ability in your list not the same as anyone else's list  
             * @param arg - Description: `#`
             */
            CombatAbility(arg: string) : Spell;
                
            /**
             * @summary The number of Combat ability name in your list not the same as anyone else's list  
             * @param arg - Description: `name`
             */
            CombatAbility(arg: string) : Int;
                
            /**
             * @summary Is this Combat Ability ready? 
             * @param arg - Description: `name|#`
             */
            CombatAbilityReady(arg: string) : Bool;
                
            /**
             * @summary The time remaining in seconds before the Combat Ability name is usable 
             * @param arg - Description: `name|#`
             */
            CombatAbilityTimer(arg: string) : Int;
                
            /**
             * @summary Combat Effects bonus from gear and spells 
             */
            CombatEffectsBonus : Int;
                
            /**
             * @summary Returns one of the following COMBAT DEBUFFED COOLDOWN ACTIVE RESTING UNKNOWN 
             */
            CombatState : String;
                
            /**
             * @summary Copper on your character 
             */
            Copper : Int;
                
            /**
             * @summary Copper in bank 
             */
            CopperBank : Int;
                
            /**
             * @summary Returns the name of the Corrupted debuff if you have one 
             */
            Corrupted : Spell;
                
            /**
             * @summary Number of buffs you have not including short duration buffs 
             */
            CountBuffs : Int;
                
            /**
             * @summary Number of curse counters you have 
             */
            CountersCurse : Int;
                
            /**
             * @summary Number of disease counters you have 
             */
            CountersDisease : Int;
                
            /**
             * @summary Number of poison counters you have 
             */
            CountersPoison : Int;
                
            /**
             * @summary Number of songs you have 
             */
            CountSongs : Int;
                
            /**
             * @summary Damage Absorption Counters Remaining 
             */
            Counters : Int;
                
            /**
             * @summary Current endurance 
             */
            CurrentEndurance : Int;
                
            /**
             * @summary Current favor/tribute 
             */
            CurrentFavor : Int;
                
            /**
             * @summary Current hit points 
             */
            CurrentHPs : Int;
                
            /**
             * @summary Current mana 
             */
            CurrentMana : Int;
                
            /**
             * @summary Current weight 
             */
            CurrentWeight : Int;
                
            /**
             * @summary Returns the name of the Curse debuff if you are effected by one 
             */
            Cursed : Spell;
                
            /**
             * @summary Damage Shield bonus from gear and spells 
             */
            DamageShieldBonus : Int;
                
            /**
             * @summary Damage Shield Mitigation bonus from gear and spells 
             */
            DamageShieldMitigationBonus : Int;
                
            /**
             * @summary Damage absorption remaining eg from Rune-type spells) 
             */
            Dar : Int;
                
            /**
             * @summary Returns the name of first Disease spell on character 
             */
            Diseased : String;
                
            /**
             * @summary Character Dexterity 
             */
            DEX : Int;
                
            /**
             * @summary Returns name of first DoT on character 
             */
            Dotted : String;
                
            /**
             * @summary DoT Shield bonus from gear and spells 
             */
            DoTShieldBonus : Int;
                
            /**
             * @summary Doubloons on your character 
             */
            Doubloons : Int;
                
            /**
             * @summary Downtime Ticks left til combat timer end) 
             */
            Downtime : Ticks;
                
            /**
             * @summary Drunkenness level 
             */
            Drunk : Int;
                
            /**
             * @summary Number of Ebon Crystals on your character 
             */
            EbonCrystals : Int;
                
            /**
             * @summary Endurance bonus from gear and spells 
             */
            EnduranceBonus : Int;
                
            /**
             * @summary Endurance regen from the last tick 
             */
            EnduranceRegen : Int;
                
            /**
             * @summary Endurance regen bonus 
             */
            EnduranceRegenBonus : Int;
                
            /**
             * @summary Experience out of 10,000) 
             */
            Exp : Int;
                
            /**
             * @summary Returns a numeric number representing which expansions your toon is flagged for 
             */
            ExpansionFlags : Int;
                
            /**
             * @summary Faycites on your character 
             */
            Faycites : Int;
                
            /**
             * @summary Info about Fellowship 
             */
            Fellowship : Fellowship;
                
            /**
             * @summary Number of open buff slots not counting the short duration buff slots) 
             */
            FreeBuffSlots : Int;
                
            /**
             * @summary Number of free inventory spaces 
             */
            FreeInventory : Int;
                
            /**
             * @summary Number of free inventory spaces of at least size giant=4) 
             * @param arg - Description: `#`
             */
            FreeInventory(arg: string) : Int;
                
            /**
             * @summary Returns the slot with the spell name 
             * @param arg - Description: `name`
             */
            Gem(arg: string) : Int;
                
            /**
             * @summary The name of the spell in this slot  
             * @param arg - Description: `#`
             */
            Gem(arg: string) : Spell;
                
            /**
             * @summary The timer for the spell with this name or in this gem  
             * @param arg - Description: `name|#`
             */
            GemTimer(arg: string) : Ticks;
                
            /**
             * @summary Gold on character 
             */
            Gold : Int;
                
            /**
             * @summary Gold in bank 
             */
            GoldBank : Int;
                
            /**
             * @summary Current group assist target 
             */
            GroupAssistTarget : Spawn;
                
            /**
             * @summary Grouped? 
             */
            Grouped : Bool;
                
            /**
             * @summary Group leadership experience out of 330) 
             */
            GroupLeaderExp : Int;
                
            /**
             * @summary Group leadership points 
             */
            GroupLeaderPoints : Int;
                
            /**
             * @summary Returns a string of your group members excluding you) 
             */
            GroupList : String;
                
            /**
             * @summary Current group marked NPC 1-3) 
             * @param arg - Description: `#`
             */
            GroupMarkNPC(arg: string) : Spawn;
                
            /**
             * @summary Size of group 
             */
            GroupSize : Int;
                
            /**
             * @summary Total LDoN points earned in Deepest Guk 
             */
            GukEarned : Int;
                
            /**
             * @summary Returns the ID number of your guild 
             */
            GuildID : Int;
                
            /**
             * @summary Returns TRUE/FALSE if you have that expansion  
             * @param arg - Description: `#`
             */
            HaveExpansion(arg: string) : Bool;
                
            /**
             * @summary Total Combined Haste worn and spell as shown in Inventory Window stats 
             */
            Haste : Int;
                
            /**
             * @summary Total Heal Amount bonus from gear 
             */
            HealAmountBonus : Int;
                
            /**
             * @summary Total Heroic Agility bonus from gear 
             */
            HeroicAGIBonus : Int;
                
            /**
             * @summary Total Heroic Charisma bonus from gear 
             */
            HeroicCHABonus : Int;
                
            /**
             * @summary Total Heroic Dexterity bonus from gear 
             */
            HeroicDEXBonus : Int;
                
            /**
             * @summary Total Heroic Intelligence bonus from gear 
             */
            HeroicINTBonus : Int;
                
            /**
             * @summary Total Heroic Stamina bonus from gear 
             */
            HeroicSTABonus : Int;
                
            /**
             * @summary Total Heroic Strength bonus from gear 
             */
            HeroicSTRBonus : Int;
                
            /**
             * @summary Total Heroic Wisdom bonus from gear 
             */
            HeroicWISBonus : Int;
                
            /**
             * @summary Hit point bonus from gear and spells 
             */
            HPBonus : Int;
                
            /**
             * @summary Hit point regeneration from last tick 
             */
            HPRegen : Int;
                
            /**
             * @summary HP regen bonus from gear and spells 
             */
            HPRegenBonus : Int;
                
            /**
             * @summary Hunger level 
             */
            Hunger : Int;
                
            /**
             * @summary Spawn ID 
             */
            ID : Int;
                
            /**
             * @summary Returns TRUE/FALSE if you are in an instance. 
             */
            InInstance : Bool;
                
            /**
             * @summary Character Intelligence 
             */
            INT : Int;
                
            /**
             * @summary Item in this slot  
             * @param arg - Description: `#`
             */
            Inventory(arg: string) : Item;
                
            /**
             * @summary Item in this slotname inventory slots only See Slot Names for a list of slotnames. 
             * @param arg - Description: `slotname`
             */
            Inventory(arg: string) : Item;
                
            /**
             * @summary Returns the invulnerable spell name on you can be used with spell data type ex Me.Invulnerable.Spell.ID} 
             */
            Invulnerable : String;
                
            /**
             * @summary True/False on if the item is ready to cast. 
             * @param arg - Description: `XXX`
             */
            ItemReady(arg: string) : Bool;
                
            /**
             * @summary Level of Delegate MA of the current group leader not your own ability level) 
             */
            LADelegateMA : Int;
                
            /**
             * @summary Level of Delegate Mark NPC of the current group leader not your own ability level) 
             */
            LADelegateMarkNPC : Int;
                
            /**
             * @summary Level of Find Path PC of the current group leader not your own ability level) 
             */
            LAFindPathPC : Int;
                
            /**
             * @summary Level of Health Enhancement of the current group leader not your own ability level) 
             */
            LAHealthEnhancement : Int;
                
            /**
             * @summary Level of Health Regen of the current group leader not your own ability level) 
             */
            LAHealthRegen : Int;
                
            /**
             * @summary Level of HoTT of the current group leader not your own ability level) 
             */
            LAHoTT : Int;
                
            /**
             * @summary Level of Inspect Buffs of the current group leader not your own ability level) 
             */
            LAInspectBuffs : Int;
                
            /**
             * @summary Level of Mana Enhancement of the current group leader not your own ability level) 
             */
            LAManaEnhancement : Int;
                
            /**
             * @summary Level of Mark NPC of the current group leader not your own ability level) 
             */
            LAMarkNPC : Int;
                
            /**
             * @summary Level of NPC Health of the current group leader not your own ability level) 
             */
            LANPCHealth : Int;
                
            /**
             * @summary Level of Offense Enhancement of the current group leader not your own ability level) 
             */
            LAOffenseEnhancement : Int;
                
            /**
             * @summary Level of Spell Awareness of the current group leader not your own ability level) 
             */
            LASpellAwareness : Int;
                
            /**
             * @summary The EQ language number of the specified language See below for language/number table. 
             * @param arg - Description: `language name`
             */
            Language(arg: string) : Int;
                
            /**
             * @summary Returns the EQ language name of the language number specified See below for language/number table. 
             * @param arg - Description: `language number`
             */
            Language(arg: string) : String;
                
            /**
             * @summary Your skill in language 
             * @param arg - Description: `language`
             */
            LanguageSkill(arg: string) : Int;
                
            /**
             * @summary Size of your largest free inventory space 
             */
            LargestFreeInventory : Int;
                
            /**
             * @summary Size of your largest free inventory space 
             */
            LargestFreeInventory : Int;
                
            /**
             * @summary Returns a timestamp of last time you zoned 
             */
            LastZoned : Timestamp;
                
            /**
             * @summary Available LDoN points 
             */
            LDoNPoints : Int;
                
            /**
             * @summary Character Level 
             */
            Level : Int;
                
            /**
             * @summary Mana bonus from gear and spells 
             */
            ManaBonus : Int;
                
            /**
             * @summary Mana regeneration from last tick 
             */
            ManaRegen : Int;
                
            /**
             * @summary Mana regen bonus from gear and spells 
             */
            ManaRegenBonus : Int;
                
            /**
             * @summary Max number of buffs you can have on you echo Me.MaxBuffSlots} 
             */
            MaxBuffSlots : Int;
                
            /**
             * @summary Max endurance 
             */
            MaxEndurance : Int;
                
            /**
             * @summary Max hit points 
             */
            MaxHPs : Int;
                
            /**
             * @summary Max mana 
             */
            MaxMana : Int;
                
            /**
             * @summary The state of your Mercenary ACTIVE SUSPENDED or UNKNOWN If it's dead Returns NULL if you do not have a Mercenary. 
             */
            Mercenary : String;
                
            /**
             * @summary Current active mercenary stance as a string default is NULL. 
             */
            MercenaryStance : String;
                
            /**
             * @summary Total LDoN points earned in Miragul's 
             */
            MirEarned : Int;
                
            /**
             * @summary Total LDoN points earned in Mistmoore 
             */
            MMEarned : Int;
                
            /**
             * @summary Moving including strafe) 
             */
            Moving : Bool;
                
            /**
             * @summary First name 
             */
            Name : String;
                
            /**
             * @summary Returns the amount of spell gems your toon has 
             */
            NumGems : Int;
                
            /**
             * @summary Orux on your character 
             */
            Orux : Int;
                
            /**
             * @summary AA exp as a  
             */
            PctAAExp : Float;
                
            /**
             * @summary Percentage of AA Vitality your toon has 
             */
            PctAAVitality : Int;
                
            /**
             * @summary Your aggro percentage 
             */
            PctAggro : Int;
                
            /**
             * @summary Current endurance as a  
             */
            PctEndurance : Int;
                
            /**
             * @summary Experience as a  
             */
            PctExp : Float;
                
            /**
             * @summary Group leadership exp as a  
             */
            PctGroupLeaderExp : Float;
                
            /**
             * @summary Current HP as a  
             */
            PctHPs : Int;
                
            /**
             * @summary Current mana as a  
             */
            PctMana : Int;
                
            /**
             * @summary Raid leadership experience as a  
             */
            PctRaidLeaderExp : Float;
                
            /**
             * @summary Percentage of Vitality the toon has 
             */
            PctVitality : Int;
                
            /**
             * @summary The spell in this PetBuff slot  
             * @param arg - Description: `#`
             */
            PetBuff(arg: string) : Spell;
                
            /**
             * @summary Finds PetBuff slot with the spell name 
             * @param arg - Description: `name`
             */
            PetBuff(arg: string) : Int;
                
            /**
             * @summary Phosphenes on your character 
             */
            Phosphenes : Int;
                
            /**
             * @summary Phosphites on your character 
             */
            Phosphites : Int;
                
            /**
             * @summary Platinum on your character 
             */
            Platinum : Int;
                
            /**
             * @summary Platinum in bank 
             */
            PlatinumBank : Int;
                
            /**
             * @summary Platinum in shared bank 
             */
            PlatinumShared : Int;
                
            /**
             * @summary Returns the name of any Poison spell 
             */
            Poisoned : String;
                
            /**
             * @summary Number of Radiant Crystals on your character 
             */
            RadiantCrystals : Int;
                
            /**
             * @summary Current raid assist target 1-3) 
             * @param arg - Description: `#`
             */
            RaidAssistTarget(arg: string) : Spawn;
                
            /**
             * @summary Raid leadership exp out of 330) 
             */
            RaidLeaderExp : Int;
                
            /**
             * @summary Raid leadership points 
             */
            RaidLeaderPoints : Int;
                
            /**
             * @summary Current raid marked NPC 1-3) 
             * @param arg - Description: `#`
             */
            RaidMarkNPC(arg: string) : Spawn;
                
            /**
             * @summary Ranged attack ready? 
             */
            RangedReady : Bool;
                
            /**
             * @summary Total LDoN points earned in Rujarkian 
             */
            RujEarned : Int;
                
            /**
             * @summary Do I have auto-run turned on? 
             */
            Running : Bool;
                
            /**
             * @summary Secondary Percentage aggro 
             */
            SecondaryPctAggro : Int;
                
            /**
             * @summary spawninfo for secondary aggro player 
             */
            SecondaryAggroPlayer : Spawn;
                
            /**
             * @summary Shielding bonus from gear and spells 
             */
            ShieldingBonus : Int;
                
            /**
             * @summary Am I Shrouded? 
             */
            Shrouded : Bool;
                
            /**
             * @summary Returns the name of the Silence type effect on you 
             */
            Silenced : String;
                
            /**
             * @summary Silver on your character 
             */
            Silver : Int;
                
            /**
             * @summary Silver in bank 
             */
            SilverBank : Int;
                
            /**
             * @summary Skill level of skill with this name or ID  
             * @param arg - Description: `name|#`
             */
            Skill(arg: string) : Int;
                
            /**
             * @summary Skill cap of skill with this name or ID  
             * @param arg - Description: `name|#`
             */
            SkillCap(arg: string) : Int;
                
            /**
             * @summary Finds song with this name 
             * @param arg - Description: `name`
             */
            Song(arg: string) : Buff;
                
            /**
             * @summary The song in this slot  
             * @param arg - Description: `#`
             */
            Song(arg: string) : Buff;
                
            /**
             * @summary The character's spawn 
             */
            Spawn : Spawn;
                
            /**
             * @summary returns TRUE if you have a spell in cooldown and FALSE when not. 
             */
            SpellInCooldown : Bool;
                
            /**
             * @summary Spell Damage bonus 
             */
            SpellDamageBonus : Int;
                
            /**
             * @summary your characters spell rank cap if it returns 1 Rk I spells 2 Rk II spells 3 Rk III spells 
             */
            SpellRankCap : Int;
                
            /**
             * @summary Gem with this spell name or in this gem ready to cast? 
             * @param arg - Description: `name|#`
             */
            SpellReady(arg: string) : Bool;
                
            /**
             * @summary Spell Shield bonus from gear and spells 
             */
            SpellShieldBonus : Int;
                
            /**
             * @summary Character Stamina 
             */
            STA : Int;
                
            /**
             * @summary Character Strength 
             */
            STR : Int;
                
            /**
             * @summary Strikethrough bonus from gear and spells 
             */
            StrikeThroughBonus : Int;
                
            /**
             * @summary Am I stunned? 
             */
            Stunned : Bool;
                
            /**
             * @summary Stun Resist bonus from gear and spells 
             */
            StunResistBonus : Int;
                
            /**
             * @summary Subscription type GOLD FREE Silver  
             */
            Subscription : String;
                
            /**
             * @summary Usage echo I have Me.SubscriptionDays left before my all access expires. 
             */
            SubscriptionDays : Int;
                
            /**
             * @summary Last name 
             */
            Surname : String;
                
            /**
             * @summary Your character's lowest resist 
             */
            svChromatic : Int;
                
            /**
             * @summary Character Cold Resist 
             */
            svCold : Int;
                
            /**
             * @summary Character Corruption Resist 
             */
            svCorruption : Int;
                
            /**
             * @summary Character Disease Resist 
             */
            svDisease : Int;
                
            /**
             * @summary Character Fire Resist 
             */
            svFire : Int;
                
            /**
             * @summary Character Magic Resist 
             */
            svMagic : Int;
                
            /**
             * @summary Character Poison Resist 
             */
            svPoison : Int;
                
            /**
             * @summary The average of your character's resists 
             */
            svPrismatic : Int;
                
            /**
             * @summary Total LDoN points earned in Takish 
             */
            TakEarned : Int;
                
            /**
             * @summary Target of Target will only work when group or raid Target of Target is active if not it will return NULL) 
             */
            TargetOfTarget : Spawn;
                
            /**
             * @summary Thirst level 
             */
            Thirst : Int;
                
            /**
             * @summary if you are an active Trader 
             */
            Trader : Bool;
                
            /**
             * @summary Tribute Active 
             */
            TributeActive : Bool;
                
            /**
             * @summary Tribute Timer 
             */
            TributeTimer : Ticks;
                
            /**
             * @summary TRUE/FALSE if using advanced looting 
             */
            UseAdvancedLooting : Bool;
                
            /**
             * @summary Character Wisdom 
             */
            WIS : Int;
                
            /**
             * @summary XTAggroCount XTAggroCount[100 Returns the number of AUTO-HATER mobs on the extended target window where your aggro is less than the optional parameter N N must be between 1-100 inclusive or it will be set to 100 the default value Me.XTAggroCount and Me.XTAggroCount[100 are identical. 
             * @param arg - Description: `N`
             */
            XTAggroCount(arg: string) : Int;
                
            /**
             * @summary Extended target data for the specified XTarget Note Passing no index to this returns the number of current extended targets. 
             * @param arg - Description: `#`
             */
            XTarget(arg: string) : Xtarget;
                
            /**
             * @summary Total amount of Vitality your toon has 
             */
            Vitality : Int;
                
            /**
             * @summary Same as Name 
             */
            "To String" : String;
                

            /**
             * Methods
             */
             
            /**
             * @summary Causes toon to sit if not already 
             */
            Sit();
                

            /**
             * @summary Causes toon to stand if not already 
             */
            Stand();
                

            /**
             * @summary Causes toon to stop casting 
             */
            StopCast();
                
        }
        
        interface Class {
            /**
             * Members
             */
            
            /**
             * @summary Can cast spells, including Bard 
             */
            CanCast : Bool;
                
            /**
             * @summary Cleric/Paladin? 
             */
            ClericType : Bool;
                
            /**
             * @summary Druid/Ranger? 
             */
            DruidType : Bool;
                
            /**
             * @summary Cleric/Druid/Shaman? 
             */
            HealerType : Bool;
                
            /**
             * @summary The class's ID # 
             */
            ID : Int;
                
            /**
             * @summary Mercenary? 
             */
            MercType : Bool;
                
            /**
             * @summary The "long name" as in "Ranger" 
             */
            Name : String;
                
            /**
             * @summary Necromancer/Shadow Knight? 
             */
            NecromancerType : Bool;
                
            /**
             * @summary Any one of: Shaman, Necromancer, Mage, Beastlord 
             */
            PetClass : Bool;
                
            /**
             * @summary Any one of: Cleric, Druid, Shaman, Necromancer, Wizard, Mage, Enchanter 
             */
            PureCaster : Bool;
                
            /**
             * @summary Shaman/Beastlord? 
             */
            ShamanType : Bool;
                
            /**
             * @summary The "short name" as in "RNG" 
             */
            ShortName : String;
                
            /**
             * @summary Same as **Name** 
             */
            "To String" : String;
                

            /**
             * Methods
             */
             
        }
        
        interface Corpse {
            /**
             * Members
             */
            
            /**
             * @summary #th item on the corpse 
             * @param arg - Description: `#`
             */
            Item(arg: string) : Item;
                
            /**
             * @summary Finds an item by partial _name_ in this corpse (use **Item[=***name***]** for exact) 
             * @param arg - Description: `name`
             */
            Item(arg: string) : Item;
                
            /**
             * @summary Number of items on the corpse 
             */
            Items : Int;
                
            /**
             * @summary Corpse open? 
             */
            Open : Bool;
                
            /**
             * @summary Same as **Open** 
             */
            "To String" : String;
                

            /**
             * Methods
             */
             
        }
        
        interface Currentzone extends Zone {
            /**
             * Members
             */
            
            /**
             * @summary Are we in a dungeon 
             */
            Dungeon : Bool;
                
            /**
             * @summary Gravity 
             */
            Gravity : Float;
                
            /**
             * @summary Zone ID 
             */
            ID : Int;
                
            /**
             * @summary Are we indoors? 
             */
            Indoor : Bool;
                
            /**
             * @summary Maximum clip plane allowed in zone 
             */
            MaxClip : Float;
                
            /**
             * @summary Minimum clip plane allowed in zone 
             */
            MinClip : Float;
                
            /**
             * @summary Full zone name 
             */
            Name : String;
                
            /**
             * @summary Can we bind here? 
             */
            NoBind : Bool;
                
            /**
             * @summary Are we outdoors? 
             */
            Outdoor : Bool;
                
            /**
             * @summary Short zone name 
             */
            ShortName : String;
                
            /**
             * @summary Sky type 
             */
            SkyType : Int;
                
            /**
             * @summary Same as **Name** 
             */
            "To String" : String;
                

            /**
             * Methods
             */
             
        }
        
        interface Deity {
            /**
             * Members
             */
            
            /**
             * @summary The deity's ID # 
             */
            ID : Int;
                
            /**
             * @summary The full deity name 
             */
            Name : String;
                
            /**
             * @summary The team name 
             */
            Team : String;
                
            /**
             * @summary Same as **Name** 
             */
            "To String" : String;
                

            /**
             * Methods
             */
             
        }
        
        interface Dynamiczone {
            /**
             * Members
             */
            
            /**
             * @summary The leader of the dynamic zone 
             */
            Leader : Dzmember;
                
            /**
             * @summary Returns true if the dzleader can successfully enter the dz this also means the dz is actually Loaded Example DynamicZone.LeaderFlagged} 
             */
            LeaderFlagged : Bool;
                
            /**
             * @summary Maximum number of characters that can enter this dynamic zone 
             */
            MaxMembers : Int;
                
            /**
             * @summary The dynamic zone member or name 
             * @param arg - Description: `#|name`
             */
            Member(arg: string) : Dzmember;
                
            /**
             * @summary Current number of characters in the dynamic zone 
             */
            Members : Int;
                
            /**
             * @summary The full name of the dynamic zone 
             */
            Name : String;
                
            /**
             * @summary The number of timers present in Timers 
             */
            MaxTimers : Int;
                
            /**
             * @summary Access the list of current lockout timers This is either an index from 1 to MaxTimers or a Expedition|Event combination Event is optional but if multiple Expeditions match the timer with the earliest lockout expiration will be returned Example echo DynamicZone.Timer[Nagafen's Lair|Lord Nagafen Timer.TimeDHM Output 2:10:24 
             * @param arg - Description: `#|Name`
             */
            Timer(arg: string) : Dztimer;
                
            /**
             * @summary Same as Name 
             */
            "To String" : String;
                

            /**
             * Methods
             */
             
        }
        
        interface Dzmember {
            /**
             * Members
             */
            
            /**
             * @summary Returns true if the dzmember can successfully enter the dz. where x is either index or the name. 
             */
            Flagged : Bool;
                
            /**
             * @summary The name of the member 
             */
            Name : String;
                
            /**
             * @summary The status of the member - one of the following: Unknown, Online, Offline, In Dynamic Zone, Link Dead 
             */
            Status : String;
                
            /**
             * @summary Same as **Name** 
             */
            "To String" : String;
                

            /**
             * Methods
             */
             
        }
        
        interface Dztimer {
            /**
             * Members
             */
            
            /**
             * @summary The name of the expedition 
             */
            ExpeditionName : String;
                
            /**
             * @summary The name of the event 
             */
            EventName : String;
                
            /**
             * @summary The timestamp indicating when this lockout expires 
             */
            Timer : Timestamp;
                
            /**
             * @summary ID of the event. These values are only unique per Expedition. Non-event lockouts (Replay Timer) will have a -1 event id. 
             */
            EventID : Int;
                
            /**
             * @summary Returns the string formatted as `ExpeditionName|EventName` 
             */
            "To String" : String;
                

            /**
             * Methods
             */
             
        }
        
        interface Everquest {
            /**
             * Members
             */
            
            /**
             * @summary Returns TRUE if EverQuest is in Background 
             */
            Background : Bool;
                
            /**
             * @summary Date that MQ2Main.dll was built 
             */
            BuildDate : String;
                
            /**
             * @summary Currently returns the zone ID the character is currently in 
             */
            CharSelectList : Int;
                
            /**
             * @summary Returns TRUE if _channel-name_ is joined 
             * @param arg - Description: `_channel-name_`
             */
            ChatChannel(arg: string) : Bool;
                
            /**
             * @summary Returns the name of chat channel # 
             * @param arg - Description: `#`
             */
            ChatChannel(arg: string) : String;
                
            /**
             * @summary Returns the number of channels currently joined 
             */
            ChatChannels : Int;
                
            /**
             * @summary return a string representing the currently loaded UI skin 
             */
            CurrentUI : String;
                
            /**
             * @summary Last normal error message 
             */
            Error : String;
                
            /**
             * @summary Returns TRUE if EverQuest is in Foreground 
             */
            Foreground : Bool;
                
            /**
             * @summary CHARSELECT INGAME UNKNOWN 
             */
            GameState : String;
                
            /**
             * @summary returns a bool true or false if the "Default" UI skin is the one loaded 
             */
            IsDefaultUILoaded : Bool;
                
            /**
             * @summary Last command entered 
             */
            LastCommand : String;
                
            /**
             * @summary Returns the name of the last window you moused over 
             */
            "LastMouseOver.Name" : Int;
                
            /**
             * @summary Name of last person to send you a tell 
             */
            LastTell : String;
                
            /**
             * @summary Returns TRUE if a layoutcopy is in progress and FALSE if not. 
             */
            LayoutCopyInProgress : Bool;
                
            /**
             * @summary Returns TRUE if an object has been left clicked 
             */
            LClickedObject : Bool;
                
            /**
             * @summary Your station name 
             */
            LoginName : String;
                
            /**
             * @summary Mouse's X location 
             */
            MouseX : Int;
                
            /**
             * @summary Mouse's Y location 
             */
            MouseY : Int;
                
            /**
             * @summary Last MQ2Data parsing error message 
             */
            MQ2DataError : String;
                
            /**
             * @summary Your current (Process ID) 
             */
            PID : Int;
                
            /**
             * @summary Your current ping 
             */
            Ping : Int;
                
            /**
             * @summary Running time of current MQ2 session, in milliseconds 
             */
            Running : Int;
                
            /**
             * @summary Returns the screenmode as an integer, 2 is Normal and 3 is No Windows 
             */
            ScreenMode : Int;
                
            /**
             * @summary Full name of your server 
             */
            Server : String;
                
            /**
             * @summary Last syntax error message 
             */
            SyntaxError : String;
                
            /**
             * @summary Returns the processor priority that Everquest is set to. Where 1 is Low 2 is below Normal 3 is Normal 4 is Above Normal 5 is High and 6 is RealTime 
             */
            PPriority : Int;
                
            /**
             * @summary EverQuest viewport upper left (X) position 
             */
            ViewportX : Int;
                
            /**
             * @summary EverQuest viewport center (X) position 
             */
            ViewportXCenter : Int;
                
            /**
             * @summary EverQuest viewport lower right (X) position 
             */
            ViewportXMax : Int;
                
            /**
             * @summary EverQuest viewport upper left (Y) position 
             */
            ViewportY : Int;
                
            /**
             * @summary EverQuest viewport center (Y) position 
             */
            ViewportYCenter : Int;
                
            /**
             * @summary EverQuest viewport lower right (Y) position 
             */
            ViewportYMax : Int;
                
            /**
             * @summary None 
             */
            "To String" : String;
                

            /**
             * Methods
             */
             
        }
        
        interface Evolving {
            /**
             * Members
             */
            
            /**
             * @summary Percentage of experience that the item has gained 
             */
            ExpPct : Float;
                
            /**
             * @summary Is evolving item experience turned on for this item? 
             */
            ExpOn : Bool;
                
            /**
             * @summary The level of the evolving item. 
             */
            Level : Int;
                
            /**
             * @summary The maximum level of the evolving item 
             */
            MaxLevel : Int;
                
            /**
             * @summary Same as **ExpOn** 
             */
            "To String" : String;
                

            /**
             * Methods
             */
             
        }
        
        interface Fellowship {
            /**
             * Members
             */
            
            /**
             * @summary TRUE if campfire is up, FALSE if not 
             */
            Campfire : Bool;
                
            /**
             * @summary Time left on current campfire 
             */
            CampfireDuration : Ticks;
                
            /**
             * @summary Campfire X location 
             */
            CampfireX : Float;
                
            /**
             * @summary Campfire Y location 
             */
            CampfireY : Float;
                
            /**
             * @summary Campfire Z location 
             */
            CampfireZ : Float;
                
            /**
             * @summary Zone information for the zone that contains your campfire 
             */
            CampfireZone : Zone;
                
            /**
             * @summary Fellowship ID 
             */
            ID : Int;
                
            /**
             * @summary Fellowship leader's name 
             */
            Leader : String;
                
            /**
             * @summary Member data by _name_ or _#_ 
             * @param arg - Description: `name|#`
             */
            Member(arg: string) : Fellowshipmember;
                
            /**
             * @summary Number of members in the fellowship 
             */
            Members : Int;
                
            /**
             * @summary Fellowship Message of the Day 
             */
            MotD : String;
                
            /**
             * @summary TRUE if currently in a fellowship, FALSE if not 
             */
            "To String" : String;
                

            /**
             * Methods
             */
             
        }
        
        interface Fellowshipmember {
            /**
             * Members
             */
            
            /**
             * @summary Member's class 
             */
            Class : Class;
                
            /**
             * @summary Member's level 
             */
            Level : Int;
                
            /**
             * @summary How long since member was last online 
             */
            LastOn : Ticks;
                
            /**
             * @summary Member's name 
             */
            Name : String;
                
            /**
             * @summary Zone information for the member's zone 
             */
            Zone : Zone;
                
            /**
             * @summary player name 
             */
            "To String" : String;
                

            /**
             * Methods
             */
             
        }
        
        interface Float {
            /**
             * Members
             */
            
            /**
             * @summary The number as a string with **one** place of precision, _i.e._ ###.# 
             */
            Deci : String;
                
            /**
             * @summary The number as a string with **two** places of precision, _i.e._ ###.## 
             */
            Centi : String;
                
            /**
             * @summary Integer portion of the number truncated rather than rounded, _e.g._ 12.779 returns 12 
             */
            Int : Int;
                
            /**
             * @summary The number as a string with **three** places of precision, _i.e._ ###.### 
             */
            Milli : String;
                
            /**
             * @summary The number as a string with # places of precision 
             * @param arg - Description: `#`
             */
            Precision(arg: string) : String;
                
            /**
             * @summary Same as **Centi** 
             */
            "To String" : String;
                

            /**
             * Methods
             */
             
        }
        
        interface Friends {
            /**
             * Members
             */
            
            /**
             * @summary Returns TRUE if _name_ is on your friend list 
             * @param arg - Description: `name`
             */
            Friend(arg: string) : Bool;
                
            /**
             * @summary Returns the name of friend list member _#_ 
             * @param arg - Description: `#`
             */
            Friend(arg: string) : String;
                
            /**
             * @summary Number of friends on your friends list 
             */
            "To String" : String;
                

            /**
             * Methods
             */
             
        }
        
        interface Ground {
            /**
             * Members
             */
            
            /**
             * @summary Ground item ID (not the same as item ID, this is like spawn ID) 
             */
            ID : Int;
                
            /**
             * @summary Distance from player to ground item 
             */
            Distance : Int;
                
            /**
             * @summary X coordinate 
             */
            X : Float;
                
            /**
             * @summary Y coordinate 
             */
            Y : Float;
                
            /**
             * @summary Z coordinate 
             */
            Z : Float;
                
            /**
             * @summary Ground item is facing this heading 
             */
            Heading : Heading;
                
            /**
             * @summary Name 
             */
            Name : String;
                
            /**
             * @summary Direction player must move to meet this ground item 
             */
            HeadingTo : Heading;
                
            /**
             * @summary Returns TRUE if ground spawn is in line of sight 
             */
            LineOfSight : Bool;
                
            /**
             * @summary ??? 
             */
            Address : Int;
                
            /**
             * @summary Displays name of the grounspawn 
             */
            DisplayName : Float;
                
            /**
             * @summary Distance from player to ground item 
             */
            Distance3D : Int;
                
            /**
             * @summary ??? 
             */
            SubID : Int;
                
            /**
             * @summary ??? 
             */
            ZoneID : Int;
                
            /**
             * @summary First spawn 
             */
            First : Ground;
                
            /**
             * @summary Last spawn 
             */
            Last : Ground;
                
            /**
             * @summary Next spawn 
             */
            Next : Ground;
                
            /**
             * @summary Prev spawn 
             */
            Prev : Ground;
                
            /**
             * @summary X coordinate (Westward-positive) 
             */
            W : Float;
                
            /**
             * @summary Y coordinate (Northward-positive) 
             */
            N : Float;
                
            /**
             * @summary Z coordinate (Upward-positive) 
             */
            U : Float;
                
            /**
             * @summary Same as ID 
             */
            "To String" : String;
                

            /**
             * Methods
             */
             
            /**
             * @summary Will cause the toon to face the called for spawn if it exists 
             */
            DoFace();
                

            /**
             * @summary Will cause the toon to target the called for spawn if it exists 
             */
            DoTarget();
                

            /**
             * @summary Picks up the ground spawn 
             */
            Grab();
                
        }
        
        interface Group {
            /**
             * Members
             */
            
            /**
             * @summary TRUE if someone is missing in group, offline, in other zone or simply just dead 
             */
            AnyoneMissing : Bool;
                
            /**
             * @summary count of how many Caster DPS mercenaries are in your group 
             */
            CasterMercCount : Int;
                
            /**
             * @summary Will now return the cleric as a spawntype if a cleric is in the group (not a mercenary but a REAL cleric) 
             */
            Cleric : String;
                
            /**
             * @summary Number of members in your group, including yourself 
             */
            GroupSize : Int;
                
            /**
             * @summary count of how many Healer mercenaries are in your group 
             */
            HealerMercCount : Int;
                
            /**
             * @summary Will return the numbers of people in the group that has a hp percent lower than 90 
             * @param arg - Description: `XX`
             */
            Injured(arg: string) : Int;
                
            /**
             * @summary Data on the leader of the group 
             */
            Leader : Groupmember;
                
            /**
             * @summary Data on the main assist of the group 
             */
            MainAssist : Groupmember;
                
            /**
             * @summary Data on the main tank of the group 
             */
            MainTank : Groupmember;
                
            /**
             * @summary Data on the group member who can mark NPCs, if one is assigned 
             */
            MarkNpc : Groupmember;
                
            /**
             * @summary Data on the Master Looter of the group, if one is assigned 
             */
            MasterLooter : Groupmember;
                
            /**
             * @summary count of how many Melee DPS mercenaries are in your group 
             */
            MeleeMercCount : Int;
                
            /**
             * @summary Accesses #th member of your group; 0 is you, 1 is the first person in the group list, etc. 
             * @param arg - Description: `#`
             */
            Member(arg: string) : Groupmember;
                
            /**
             * @summary Call this .Index for which number in the group the PC with _name_ is 
             * @param arg - Description: `name`
             */
            Member(arg: string) : Int;
                
            /**
             * @summary Call this .Pet to return the group members' pet name 
             * @param arg - Description: `#/name`
             */
            Member(arg: string) : Spawn;
                
            /**
             * @summary Total number of group members, excluding yourself 
             */
            Members : Int;
                
            /**
             * @summary Count of how many Mercenaries are in the group 
             */
            MercenaryCount : Int;
                
            /**
             * @summary Returns the name of the group member your mouse is hovering over 
             */
            MouseOver : String;
                
            /**
             * @summary will return a TRUE if offline, and FALSE if online 
             */
            Offline : Bool;
                
            /**
             * @summary will return a Bool TRUE if online but in another zone and FALSE if online and in same zone as you. 
             */
            OtherZone : Bool;
                
            /**
             * @summary Data on the puller of the group 
             */
            Puller : Groupmember;
                
            /**
             * @summary count of how many Tank mercenaries are in your group 
             */
            TankMercCount : Int;
                
            /**
             * @summary Same as **Members** 
             */
            "To String" : String;
                

            /**
             * Methods
             */
             
        }
        
        interface Groupmember extends Spawn {
            /**
             * Members
             */
            
            /**
             * @summary Which number in the group the member is 
             */
            Index : Int;
                
            /**
             * @summary TRUE if the member is the group's leader, FALSE otherwise 
             */
            Leader : Bool;
                
            /**
             * @summary The member's level 
             */
            Level : Int;
                
            /**
             * @summary TRUE if the member is designated as the group's Main Assist, FALSE otherwise 
             */
            MainAssist : Bool;
                
            /**
             * @summary TRUE if the member is designated as the group's Main Tank, FALSE otherwise 
             */
            MainTank : Bool;
                
            /**
             * @summary TRUE if the member is a mercenary, FALSE otherwise 
             */
            Mercenary : Bool;
                
            /**
             * @summary The name of the group member. This works even if they are not in the same zone as you. 
             */
            Name : String;
                
            /**
             * @summary TRUE if the member is offline and FALSE if online 
             */
            Offline : Bool;
                
            /**
             * @summary TRUE if the member is online but in another zone and FALSE if online and in same zone as you. 
             */
            OtherZone : Bool;
                
            /**
             * @summary TRUE if the member is online and in same zone and FALSE if online and not in same zone as you. 
             */
            Present : Bool;
                
            /**
             * @summary TRUE if the member is designated as the group's Puller, FALSE otherwise 
             */
            Puller : Bool;
                
            /**
             * @summary Accesses the group member's spawn. Not all members will have a spawn (if they are out of the zone). 
             */
            Spawn : Spawn;
                
            /**
             * @summary Same as **Name** 
             */
            "To String" : String;
                

            /**
             * Methods
             */
             
        }
        
        interface Heading {
            /**
             * Members
             */
            
            /**
             * @summary The nearest clock direction, e.g. 1-12 
             */
            Clock : Int;
                
            /**
             * @summary Heading in degrees (same as casting to float) 
             */
            Degrees : Float;
                
            /**
             * @summary Heading in degrees counter-clockwise (the way the rest of MQ2 and EQ uses it) 
             */
            DegreesCCW : Float;
                
            /**
             * @summary The long compass direction, eg. "south", "south by southeast" 
             */
            Name : String;
                
            /**
             * @summary The short compass direction, eg. "S", "SSE" 
             */
            ShortName : String;
                
            /**
             * @summary Same as **ShortName** 
             */
            "To String" : String;
                

            /**
             * Methods
             */
             
        }
        
        interface Int {
            /**
             * Members
             */
            
            /**
             * @summary The number as a float (123 is represented as 123.0) 
             */
            Float : Float;
                
            /**
             * @summary The hex value of the integer (10 is represented as 0xA) 
             */
            Hex : String;
                
            /**
             * @summary Endianness reversed 
             */
            Reverse : Int;
                
            /**
             * @summary The number 
             */
            "To String" : String;
                

            /**
             * Methods
             */
             
        }
        
        interface Invslot {
            /**
             * Members
             */
            
            /**
             * @summary ID of this item slot (usable directly by [/itemnotify](../../commands/slash-commands/itemnotify.md)) 
             */
            ID : Int;
                
            /**
             * @summary Item data for the item in this slot 
             */
            Item : Item;
                
            /**
             * @summary For inventory slots not inside packs, the slot name, otherwise NULL 
             */
            Name : String;
                
            /**
             * @summary Container that must be opened to access the slot with [/itemnotify](../../commands/slash-commands/itemnotify.md) 
             */
            Pack : Invslot;
                
            /**
             * @summary Slot number inside the pack which holds the item, otherwise NULL 
             */
            Slot : Int;
                
            /**
             * @summary Same as **ID** 
             */
            "To String" : String;
                

            /**
             * Methods
             */
             
        }
        
        interface Item {
            /**
             * Members
             */
            
            /**
             * @summary AC value on item 
             */
            AC : Int;
                
            /**
             * @summary AGI value on item 
             */
            AGI : Int;
                
            /**
             * @summary Accuracy 
             */
            Accuracy : Int;
                
            /**
             * @summary Attack value on item 
             */
            Attack : Int;
                
            /**
             * @summary Attuneable? 
             */
            Attuneable : Bool;
                
            /**
             * @summary Augment Restrictions 
             */
            AugRestrictions : Int;
                
            /**
             * @summary Number of augs on this item 
             */
            Augs : Int;
                
            /**
             * @summary Aug slot 1 
             */
            AugSlot1 : Int;
                
            /**
             * @summary Aug slot 2 
             */
            AugSlot2 : Int;
                
            /**
             * @summary Aug slot 3 
             */
            AugSlot3 : Int;
                
            /**
             * @summary Aug slot 4 
             */
            AugSlot4 : Int;
                
            /**
             * @summary Aug slot 5 
             */
            AugSlot5 : Int;
                
            /**
             * @summary Augment Type 
             */
            AugType : Int;
                
            /**
             * @summary Avoidance 
             */
            Avoidance : Int;
                
            /**
             * @summary The cost to buy this item from active merchant 
             */
            BuyPrice : Int;
                
            /**
             * @summary Spell effect's cast time (in seconds) 
             */
            CastTime : Float;
                
            /**
             * @summary CHA value on item 
             */
            CHA : Int;
                
            /**
             * @summary Charges 
             */
            Charges : Int;
                
            /**
             * @summary Clairvoyance 
             */
            Clairvoyance : Int;
                
            /**
             * @summary Returns the #th long class name of the listed classes on an item. Items suitable for ALL classes will effectively have all 17 classes listed. 
             * @param arg - Description: `#`
             */
            Class(arg: string) : String;
                
            /**
             * @summary The number of classes that can use the item. Items suitable for ALL classes will return 16. 
             */
            Classes : Int;
                
            /**
             * @summary CombatEffects 
             */
            CombatEffects : Int;
                
            /**
             * @summary Number of slots, if this is a container 
             */
            Container : Int;
                
            /**
             * @summary Damage Shield Mitigation 
             */
            DamageShieldMitigation : Int;
                
            /**
             * @summary Damage Shield value on item 
             */
            DamShield : Int;
                
            /**
             * @summary Returns the #th deity of the listed deities on an item. Items with no deity restrictions will return NULL for all values of #. 
             * @param arg - Description: `#`
             */
            Deity(arg: string) : String;
                
            /**
             * @summary The number of deities that can use the item. Items with no deity restrictions will return 0. 
             */
            Deities : Int;
                
            /**
             * @summary DEX value on item 
             */
            DEX : Int;
                
            /**
             * @summary "None", "Magic", "Fire", "Cold", "Poison", "Disease" 
             */
            DMGBonusType : String;
                
            /**
             * @summary DoT Shielding 
             */
            DoTShielding : Int;
                
            /**
             * @summary Spell effect type (see below for spell effect types) 
             */
            EffectType : String;
                
            /**
             * @summary Endurance 
             */
            Endurance : Int;
                
            /**
             * @summary Endurance regen 
             */
            EnduranceRegen : Int;
                
            /**
             * @summary Does this item have Evolving experience on? 
             */
            Evolving : Evolving;
                
            /**
             * @summary The number of items needed to fill all the stacks of the item you have (with a stacksize of 20).  If you have 3 stacks (1, 10, 20 in those stacks), you have room for 60 total and you have 31 on you, so **FreeStack** would return 29. 
             */
            FreeStack : Int;
                
            /**
             * @summary Haste value on item 
             */
            Haste : Int;
                
            /**
             * @summary HealAmount (regen?) 
             */
            HealAmount : Int;
                
            /**
             * @summary Heroic AGI value on item 
             */
            HeroicAGI : Int;
                
            /**
             * @summary Heroic CHA value on item 
             */
            HeroicCHA : Int;
                
            /**
             * @summary Heroic DEX value on item 
             */
            HeroicDEX : Int;
                
            /**
             * @summary Heroic INT value on item 
             */
            HeroicINT : Int;
                
            /**
             * @summary Heroic STA value on item 
             */
            HeroicSTA : Int;
                
            /**
             * @summary Heroic STR value on item 
             */
            HeroicSTR : Int;
                
            /**
             * @summary Heroic SvCold value on item 
             */
            HeroicSvCold : Int;
                
            /**
             * @summary Heroic SvCorruption value on item 
             */
            HeroicSvCorruption : Int;
                
            /**
             * @summary Heroic SvDisease value on item 
             */
            HeroicSvDisease : Int;
                
            /**
             * @summary Heroic SvFire value on item 
             */
            HeroicSvFire : Int;
                
            /**
             * @summary Heroic SvMagic value on item 
             */
            HeroicSvMagic : Int;
                
            /**
             * @summary Heroic SvPoison value on item 
             */
            HeroicSvPoison : Int;
                
            /**
             * @summary Heroic WIS value on item 
             */
            HeroicWIS : Int;
                
            /**
             * @summary HP value on item 
             */
            HP : Int;
                
            /**
             * @summary HPRegen value on item 
             */
            HPRegen : Int;
                
            /**
             * @summary Item Icon 
             */
            Icon : Int;
                
            /**
             * @summary Item ID 
             */
            ID : Int;
                
            /**
             * @summary Instrument Modifier Value 
             */
            InstrumentMod : Float;
                
            /**
             * @summary INT value on item 
             */
            INT : Int;
                
            /**
             * @summary Inventory Slot Number (Historic and now deprecated, use ItemSlot and ItemSlot2) 
             */
            InvSlot : Int;
                
            /**
             * @summary Item in #th slot, if this is a container or has augs 
             * @param arg - Description: `#`
             */
            Item(arg: string) : Item;
                
            /**
             * @summary Returns the delay of the weapon 
             */
            ItemDelay : Float;
                
            /**
             * @summary just prints the actual hexlink for an item (not clickable) unless [CLICKABLE] is included 
             * @param arg - Description: `CLICKABLE`
             */
            ItemLink(arg: string) : String;
                
            /**
             * @summary Number of items, if this is a container. 
             */
            Items : Int;
                
            /**
             * @summary Item Slot number see [Slot Names](../../general-information/slot-names.md) 
             */
            ItemSlot : Int;
                
            /**
             * @summary Item Slot subnumber see [Slot Names](../../general-information/slot-names.md) 
             */
            ItemSlot2 : Int;
                
            /**
             * @summary "All", "Deepest Guk", "Miragul's", "Mistmoore", "Rujarkian", "Takish", "Unknown" 
             */
            LDoNTheme : String;
                
            /**
             * @summary Lore? 
             */
            Lore : Bool;
                
            /**
             * @summary Magic? 
             */
            Magic : Bool;
                
            /**
             * @summary Mana value on item 
             */
            Mana : Int;
                
            /**
             * @summary ManaRegen value on item 
             */
            ManaRegen : Int;
                
            /**
             * @summary Max power on an power source 
             */
            MaxPower : Int;
                
            /**
             * @summary Quantity of item active merchant has 
             */
            MerchQuantity : Int;
                
            /**
             * @summary Name 
             */
            Name : String;
                
            /**
             * @summary No Trade? 
             */
            NoDrop : Bool;
                
            /**
             * @summary Temporary? 
             */
            NoRent : Bool;
                
            /**
             * @summary Power left on power source 
             */
            Power : Int;
                
            /**
             * @summary Purity of item 
             */
            Purity : Int;
                
            /**
             * @summary Returns the #th long race name of the listed races on an item. Items suitable for ALL races will effectively have all 15 races listed. 
             * @param arg - Description: `#`
             */
            Race(arg: string) : String;
                
            /**
             * @summary The number of races that can use the item. Items suitable for ALL races will return 15. 
             */
            Races : Int;
                
            /**
             * @summary Returns the Required Level of an item. Items with no required level will return 0. 
             */
            RequiredLevel : Int;
                
            /**
             * @summary Price to sell this item at this merchant 
             */
            SellPrice : Int;
                
            /**
             * @summary Shielding 
             */
            Shielding : Int;
                
            /**
             * @summary Item size:  1 SMALL  2 MEDIUM  3 LARGE  4 GIANT 
             */
            Size : Int;
                
            /**
             * @summary If item is a container, size of items it can hold:  1 SMALL  2 MEDIUM  3 LARGE  4 GIANT 
             */
            SizeCapacity : Int;
                
            /**
             * @summary Spell effect 
             */
            Spell : Spell;
                
            /**
             * @summary Spell damage 
             */
            SpellDamage : Int;
                
            /**
             * @summary SpellShield 
             */
            SpellShield : Int;
                
            /**
             * @summary STA value on item 
             */
            STA : Int;
                
            /**
             * @summary Number of items in the stack 
             */
            Stack : Int;
                
            /**
             * @summary Number of stacks of the item in your inventory 
             */
            Stacks : Int;
                
            /**
             * @summary Stackable? 
             */
            Stackable : Bool;
                
            /**
             * @summary The total number of the stackable item in your inventory 
             */
            StackCount : Int;
                
            /**
             * @summary Maximum number if items that can be in the stack 
             */
            StackSize : Int;
                
            /**
             * @summary STR value on item 
             */
            STR : Int;
                
            /**
             * @summary StrikeThrough 
             */
            StrikeThrough : Int;
                
            /**
             * @summary Stun resist 
             */
            StunResist : Int;
                
            /**
             * @summary svCold value on item 
             */
            svCold : Int;
                
            /**
             * @summary svCorruption value on item 
             */
            svCorruption : Int;
                
            /**
             * @summary svDisease value on item 
             */
            svDisease : Int;
                
            /**
             * @summary svFire value on item 
             */
            svFire : Int;
                
            /**
             * @summary svMagic value on item 
             */
            svMagic : Int;
                
            /**
             * @summary svPoison value on item 
             */
            svPoison : Int;
                
            /**
             * @summary Returns the number of ticks remaining on an item recast timer 
             */
            Timer : Ticks;
                
            /**
             * @summary Returns the number of seconds remaining on an item recast timer 
             */
            TimerReady : Int;
                
            /**
             * @summary Tradeskills? 
             */
            Tradeskills : Bool;
                
            /**
             * @summary Item value in coppers 
             */
            Value : Int;
                
            /**
             * @summary Item weight 
             */
            Weight : Int;
                
            /**
             * @summary WIS value on item 
             */
            WIS : Int;
                
            /**
             * @summary The #th invslot this item can be worn in (fingers/ears count as 2 slots) 
             * @param arg - Description: `#`
             */
            WornSlot(arg: string) : Invslot;
                
            /**
             * @summary Can item be worn in invslot with this _name_? (worn slots only) 
             * @param arg - Description: `name`
             */
            WornSlot(arg: string) : Bool;
                
            /**
             * @summary The number of invslots this item can be worn in (fingers/ears count as 2 slots) 
             */
            WornSlots : Int;
                
            /**
             * @summary Same as **Name** 
             */
            "To String" : String;
                

            /**
             * Methods
             */
             
        }
        
        interface Keyring {
            /**
             * Members
             */
            
            /**
             * @summary The number of items in this keyring 
             */
            Count : Int;
                
            /**
             * @summary The keyring item assigned as the stat item 
             */
            Stat : Keyringitem;
                

            /**
             * Methods
             */
             
        }
        
        interface Keyringitem {
            /**
             * Members
             */
            
            /**
             * @summary Where on the keyring list 
             */
            Index : Int;
                
            /**
             * @summary The item on the keyring 
             */
            Item : Item;
                
            /**
             * @summary name of the keyring item 
             */
            Name : String;
                

            /**
             * Methods
             */
             
        }
        
        interface Macro {
            /**
             * Members
             */
            
            /**
             * @summary list the current line number, macro name, and code of the macro being processed 
             */
            CurCommand : String;
                
            /**
             * @summary The current line number of the macro being processed 
             */
            CurLine : Int;
                
            /**
             * @summary The current subroutine 
             */
            CurSub : String;
                
            /**
             * @summary true if the provided parameter is a defined outer variable 
             */
            isOuterVariable : Bool;
                
            /**
             * @summary true if the provided parameter an existing TLO 
             */
            isTLO : Bool;
                
            /**
             * @summary How much memory the macro is using 
             */
            MemUse : Int;
                
            /**
             * @summary The name of the macro currently running 
             */
            Name : String;
                
            /**
             * @summary The number of parameters that were passed to the current subroutine 
             */
            Params : Int;
                
            /**
             * @summary NULL if no macro running, FALSE if mqpause is off, TRUE if mqpause is on 
             */
            Paused : Bool;
                
            /**
             * @summary The value that was returned by the last completed subroutine 
             */
            Return : String;
                
            /**
             * @summary How long the macro has been running (in seconds) 
             */
            RunTime : Int;
                
            /**
             * @summary StackSize? 
             */
            StackSize : Int;
                
            /**
             * @summary returns the value given the name of Macro variable 
             */
            Variable : Any;
                

            /**
             * Methods
             */
             
        }
        
        interface Macroquest {
            /**
             * Members
             */
            
            /**
             * @summary Date that MQ2Main.dll was built 
             */
            BuildDate : String;
                
            /**
             * @summary Returns TRUE if _channel name_ is joined 
             * @param arg - Description: `channel name`
             */
            ChatChannel(arg: string) : Bool;
                
            /**
             * @summary Returns the name of chat channel # 
             * @param arg - Description: `#`
             */
            ChatChannel(arg: string) : String;
                
            /**
             * @summary Returns the number of channels currently joined 
             */
            ChatChannels : Int;
                
            /**
             * @summary Last normal error message 
             */
            Error : String;
                
            /**
             * @summary Returns "INGAME, CHARSELECT, PRECHARSELECT, UNKNOWN" 
             */
            GameState : String;
                
            /**
             * @summary Last command entered 
             */
            LastCommand : String;
                
            /**
             * @summary Name of last person to send you a tell 
             */
            LastTell : String;
                
            /**
             * @summary Returns TRUE if an object has been left clicked 
             */
            LClickedObject : Bool;
                
            /**
             * @summary Your station name 
             */
            LoginName : String;
                
            /**
             * @summary Mouse's X location 
             */
            MouseX : Int;
                
            /**
             * @summary Mouse's Y location 
             */
            MouseY : Int;
                
            /**
             * @summary Last MQ2Data parsing error message 
             */
            MQ2DataError : String;
                
            /**
             * @summary Directory that Macroquest.exe launched from 
             */
            Path : String;
                
            /**
             * @summary Your current ping 
             */
            Ping : Int;
                
            /**
             * @summary Running time of current MQ2 session, in milliseconds 
             */
            Running : Int;
                
            /**
             * @summary Full name of your server 
             */
            Server : String;
                
            /**
             * @summary Last syntax error message 
             */
            SyntaxError : String;
                
            /**
             * @summary EverQuest viewport upper left (X) position 
             */
            ViewportX : Int;
                
            /**
             * @summary EverQuest viewport center (X) position 
             */
            ViewportXCenter : Int;
                
            /**
             * @summary EverQuest viewport lower right (X) position 
             */
            ViewportXMax : Int;
                
            /**
             * @summary EverQuest viewport upper left (Y) position 
             */
            ViewportY : Int;
                
            /**
             * @summary EverQuest viewport center (Y) position 
             */
            ViewportYCenter : Int;
                
            /**
             * @summary EverQuest viewport lower right (Y) position 
             */
            ViewportYMax : Int;
                
            /**
             * @summary None 
             */
            "To String" : String;
                

            /**
             * Methods
             */
             
        }
        
        interface Math {
            /**
             * Members
             */
            
            /**
             * @summary The absolute value of the result of _n_ 
             * @param arg - Description: `_n_`
             */
            Abs(arg: string) : Float;
                
            /**
             * @summary Arccosine of _n_ (in degrees) 
             * @param arg - Description: `_n_`
             */
            Acos(arg: string) : Float;
                
            /**
             * @summary Arcsine of _n_ (in degrees) 
             * @param arg - Description: `_n_`
             */
            Asin(arg: string) : Float;
                
            /**
             * @summary Arctangent of _n_ (in degrees) 
             * @param arg - Description: `_n_`
             */
            Atan(arg: string) : Float;
                
            /**
             * @summary Performs a mathematical calculation _n_ 
             * @param arg - Description: `_n_`
             */
            Calc(arg: string) : Float;
                
            /**
             * @summary Clamps the value _n_ such that _min _<= _n_ <= _max_ 
             * @param arg - Description: `_n, min, max_`
             */
            Clamp(arg: string) : Int;
                
            /**
             * @summary Cosine of _n_ (in degrees) 
             * @param arg - Description: `_n_`
             */
            Cos(arg: string) : Float;
                
            /**
             * @summary Decimal value of a hexidecimal string 
             * @param arg - Description: `_hex_`
             */
            Dec(arg: string) : Int;
                
            /**
             * @summary <ul><li>Calculates the distance between two points on the map</li><li>1, 2, or 3 dimensions may be provided</li><li>Defaults to your character's current location</li></ul> 
             * @param arg - Description: `y,x,z:y,x,z`
             */
            Distance(arg: string) : Float;
                
            /**
             * @summary Returns hexidecimal value of [_int_](datatype-int.md) _n_ 
             * @param arg - Description: `_n_`
             */
            Hex(arg: string) : String;
                
            /**
             * @summary Bitwise complement of _n_ 
             * @param arg - Description: `_n_`
             */
            Not(arg: string) : Int;
                
            /**
             * @summary Random integer. Rand[5] range 0 to 4. Rand[100,200] range 100 to 199 
             * @param arg - Description: `_n_`
             */
            Rand(arg: string) : Int;
                
            /**
             * @summary Sine of _n_ (in degrees) 
             * @param arg - Description: `_n_`
             */
            Sin(arg: string) : Float;
                
            /**
             * @summary Square root of _n_ 
             * @param arg - Description: `_n_`
             */
            Sqrt(arg: string) : Float;
                
            /**
             * @summary Tangent of _n_ (in degrees) 
             * @param arg - Description: `_n_`
             */
            Tan(arg: string) : Float;
                
            /**
             * @summary NULL 
             */
            "To String" : String;
                

            /**
             * Methods
             */
             
        }
        
        interface Mercenary extends Spawn {
            /**
             * Members
             */
            
            /**
             * @summary AA Points spent on mercenary abilities 
             */
            AAPoints : Int;
                
            /**
             * @summary Current stance of the mercenary 
             */
            Stance : String;
                
            /**
             * @summary Current state of the mercenary (returns "DEAD","SUSPENDED","ACTIVE", or "UNKNOWN" 
             */
            State : String;
                
            /**
             * @summary Current state ID of the mercenary as a number. 
             */
            StateID : Int;
                
            /**
             * @summary Index 
             */
            Index : String;
                
            /**
             * @summary Same as **Name** 
             */
            "To String" : String;
                

            /**
             * Methods
             */
             
        }
        
        interface Merchant extends Spawn {
            /**
             * Members
             */
            
            /**
             * @summary Returns TRUE if the merchant's inventory is full 
             */
            Full : Bool;
                
            /**
             * @summary Number of items on the merchant 
             */
            Items : Int;
                
            /**
             * @summary Item number on the merchant's list 
             * @param arg - Description: `#`
             */
            Item(arg: string) : Item;
                
            /**
             * @summary Finds an item by partial name on the merchant use merchant.Item name for exact) 
             * @param arg - Description: `name`
             */
            Item(arg: string) : Item;
                
            /**
             * @summary The number used to calculate the buy and sell value for an item this is what is changed by charisma and faction This value is capped at 1.05 Markup*Item Value Amount you buy item for Item Value 1/Markup Amount you sell item for 
             */
            Markup : Float;
                
            /**
             * @summary Returns TRUE if merchant is open 
             */
            Open : Bool;
                
            /**
             * @summary The currently selected item in the merchant window and item type 
             */
            SelectedItem : Item;
                
            /**
             * @summary True if the merchants itemlist has been filled in. 
             */
            ItemsReceived : Bool;
                
            /**
             * @summary Same as Open 
             */
            "To String" : String;
                

            /**
             * Methods
             */
             
            /**
             * @summary Buys \# of whatever is selected with **Merchant.SelectItem\[xxx\]** 
             * @param arg - Description #
             */
            Buy(arg :string);
                

            /**
             * @summary Will open the merchant closest to you, or if you have a merchant target 
             */
            OpenWindow();
                

            /**
             * @summary Select item specified or partial match that fits. Use **SelectItem\[=xxx\]** for EXACT match \(its not case sensitive\) 
             * @param arg - Description xxx
             */
            SelectItem(arg :string);
                

            /**
             * @summary Sell \# of whatever is selected with /selectitem. See examples 
             * @param arg - Description #
             */
            Sell(arg :string);
                
        }
        
        interface Mount {
            /**
             * Members
             */
            
            /**
             * @summary name of the mount in XX slot 
             */
            Name : String;
                

            /**
             * Methods
             */
             
        }
        
        interface Pet extends Spawn {
            /**
             * Members
             */
            
            /**
             * @summary Returns the slot# for buffname 
             * @param arg - Description: `buffname`
             */
            Buff(arg: string) : Int;
                
            /**
             * @summary Prints name of the buff at slot# 
             * @param arg - Description: `slot#`
             */
            Buff(arg: string) : String;
                
            /**
             * @summary Combat state 
             */
            Combat : Bool;
                
            /**
             * @summary GHold state 
             */
            GHold : Bool;
                
            /**
             * @summary Hold state 
             */
            Hold : Bool;
                
            /**
             * @summary ReGroup state 
             */
            ReGroup : Bool;
                
            /**
             * @summary Returns the pet's current stance, (e.g. FOLLOW, GUARD) 
             */
            Stance : String;
                
            /**
             * @summary Stop state 
             */
            Stop : Bool;
                
            /**
             * @summary Returns the pet's current target. 
             */
            Target : Spawn;
                
            /**
             * @summary Taunt state 
             */
            Taunt : Bool;
                
            /**
             * @summary Buff time remaining for pet buff [buffname] in miliseconds 
             * @param arg - Description: `buffname`
             */
            BuffDuration(arg: string) : Int;
                
            /**
             * @summary Buff time remaining for pet buff in slot [slot#] in miliseconds 
             * @param arg - Description: `slot#`
             */
            BuffDuration(arg: string) : Int;
                
            /**
             * @summary Focus state 
             */
            Focus : Bool;
                

            /**
             * Methods
             */
             
        }
        
        interface Plugin {
            /**
             * Members
             */
            
            /**
             * @summary Name of the plugin 
             */
            Name : String;
                
            /**
             * @summary Version number of the plugin 
             */
            Version : Float;
                
            /**
             * @summary Same as **Name** 
             */
            "To String" : String;
                

            /**
             * Methods
             */
             
        }
        
        interface Race {
            /**
             * Members
             */
            
            /**
             * @summary The ID of the race 
             */
            ID : Int;
                
            /**
             * @summary The name of the race 
             */
            Name : String;
                
            /**
             * @summary Same as **Name** 
             */
            "To String" : String;
                

            /**
             * Methods
             */
             
        }
        
        interface Raid {
            /**
             * Members
             */
            
            /**
             * @summary Average level of raid members more accurate than in the window) 
             */
            AverageLevel : Float;
                
            /**
             * @summary Have I been invited to the raid? 
             */
            Invited : Bool;
                
            /**
             * @summary Raid leader 
             */
            Leader : Raidmember;
                
            /**
             * @summary Returns TRUE if the raid is locked 
             */
            Locked : Bool;
                
            /**
             * @summary Specified looter name by number 
             * @param arg - Description: `#`
             */
            Looter(arg: string) : String;
                
            /**
             * @summary Number of specified looters 
             */
            Looters : Int;
                
            /**
             * @summary Loot type number 1 Leader 2 Leader GroupLeader 3 Leader Specified 
             */
            LootType : Int;
                
            /**
             * @summary Raid main assist 
             */
            MainAssist : Raidmember;
                
            /**
             * @summary Raid Master Looter 
             */
            MasterLooter : Raidmember;
                
            /**
             * @summary Raid member by number 
             * @param arg - Description: `#`
             */
            Member(arg: string) : Raidmember;
                
            /**
             * @summary Raid member by name 
             * @param arg - Description: `name`
             */
            Member(arg: string) : Raidmember;
                
            /**
             * @summary Total number of raid members 
             */
            Members : Int;
                
            /**
             * @summary Raid target clicked in raid window) 
             */
            Target : Raidmember;
                
            /**
             * @summary Sum of all raid members levels 
             */
            TotalLevels : Int;
                
            /**
             * @summary None 
             */
            "To String" : String;
                

            /**
             * Methods
             */
             
        }
        
        interface Raidmember {
            /**
             * Members
             */
            
            /**
             * @summary Raid member's class (works without being in zone) 
             */
            Class : Class;
                
            /**
             * @summary Current group number (or 0) 
             */
            Group : Int;
                
            /**
             * @summary Returns TRUE if the member is a group leader 
             */
            GroupLeader : Bool;
                
            /**
             * @summary Raid member's level (works without being in zone) 
             */
            Level : Int;
                
            /**
             * @summary Allowed to loot with current loot rules and looters? 
             */
            Looter : Bool;
                
            /**
             * @summary Raid member's name 
             */
            Name : String;
                
            /**
             * @summary Returns TRUE if the member is the raid leader 
             */
            RaidLeader : Bool;
                
            /**
             * @summary Spawn object for this player if available (must be in zone) 
             */
            Spawn : Spawn;
                
            /**
             * @summary Same as **Name** 
             */
            "To String" : String;
                

            /**
             * Methods
             */
             
        }
        
        interface Range {
            /**
             * Members
             */
            
            /**
             * @summary is _**n**_ Between the range of _#1_ and _#2_ both numbers included 
             * @param arg - Description: `#1,#2:_n_`
             */
            Between(arg: string) : Bool;
                
            /**
             * @summary is _**n**_ Inside the range of _#1_ and _#2_ both numbers excluded 
             * @param arg - Description: `#1,#2:_n_`
             */
            Inside(arg: string) : Bool;
                

            /**
             * Methods
             */
             
        }
        
        interface Skill {
            /**
             * Members
             */
            
            /**
             * @summary Returns TRUE if the skill uses the kick/bash/slam/backstab/frenzy timer 
             */
            AltTimer : Bool;
                
            /**
             * @summary Skill number 
             */
            ID : Int;
                
            /**
             * @summary Minimum level for your class 
             */
            MinLevel : Int;
                
            /**
             * @summary Name of the skill 
             */
            Name : String;
                
            /**
             * @summary Reuse timer _(what number format? ticks, seconds, deciseconds?)_ 
             */
            ReuseTime : Int;
                
            /**
             * @summary Skill cap based on your current level and class. 
             */
            SkillCap : Int;
                
            /**
             * @summary Base skill level for your class 
             */
            StartingSkill : Int;
                
            /**
             * @summary Same as **Name** 
             */
            "To String" : String;
                

            /**
             * Methods
             */
             
        }
        
        interface Spawn {
            /**
             * Members
             */
            
            /**
             * @summary AA rank number 
             */
            AARank : Int;
                
            /**
             * @summary AFK? 
             */
            AFK : Bool;
                
            /**
             * @summary returns TRUE or FALSE if a mob is aggressive or not 
             */
            Aggressive : Bool;
                
            /**
             * @summary Current animation ID See Animations for a list of animations. 
             */
            Animation : Int;
                
            /**
             * @summary Anonymous 
             */
            Anonymous : Bool;
                
            /**
             * @summary Current Raid or Group assist target? 
             */
            Assist : Bool;
                
            /**
             * @summary Binding wounds? 
             */
            Binding : Bool;
                
            /**
             * @summary Body type 
             */
            Body : Body;
                
            /**
             * @summary Is a buyer ie Buyer in the bazaar) 
             */
            Buyer : Bool;
                
            /**
             * @summary Caches buff information cast on others 
             */
            CachedBuff : Cachedbuff;
                
            /**
             * @summary TRUE/FALSE on if a splash spell can land Note This check is ONLY for line of sight to the targetindicator red/green circle) 
             */
            CanSplashLand : Bool;
                
            /**
             * @summary Spell if currently casting only accurate on yourself not NPCs or other group members) 
             */
            Casting : Spell;
                
            /**
             * @summary Class 
             */
            Class : Class;
                
            /**
             * @summary The cleaned up name 
             */
            CleanName : String;
                
            /**
             * @summary GREY GREEN LIGHT BLUE BLUE WHITE YELLOW RED 
             */
            ConColor : String;
                
            /**
             * @summary Current Endurance points only updates when target/group) 
             */
            CurrentEndurance : Int;
                
            /**
             * @summary Current hit points 
             */
            CurrentHPs : Int;
                
            /**
             * @summary Current Mana points only updates when target/group) 
             */
            CurrentMana : Int;
                
            /**
             * @summary Dead? 
             */
            Dead : Bool;
                
            /**
             * @summary Deity 
             */
            Deity : Deity;
                
            /**
             * @summary Name displayed in game same as EQ's T) 
             */
            DisplayName : String;
                
            /**
             * @summary Distance from player in x,y) 
             */
            Distance : Float;
                
            /**
             * @summary Distance from player in x,y,z in 3D 
             */
            Distance3D : Float;
                
            /**
             * @summary Distance from player in Y plane North/South) 
             */
            DistanceN : Float;
                
            /**
             * @summary Estimated distance in x,y taking into account the spawn's movement speed but not the player's 
             */
            DistancePredict : Float;
                
            /**
             * @summary Distance from player in Z plane Up/Down) 
             */
            DistanceU : Float;
                
            /**
             * @summary Distance from player in X plane East/West) 
             */
            DistanceW : Float;
                
            /**
             * @summary Distance from player in X plane 
             */
            DistanceX : Float;
                
            /**
             * @summary Distance from player in Y plane 
             */
            DistanceY : Float;
                
            /**
             * @summary Distance from player in Z plane 
             */
            DistanceZ : Float;
                
            /**
             * @summary Ducking? 
             */
            Ducking : Bool;
                
            /**
             * @summary returns a inttype it takes numbers 0-8 or names head chest arms wrists hands legs feet primary offhand 
             */
            Equipment : Int;
                
            /**
             * @summary Location using EQ format 
             */
            EQLoc : Float;
                
            /**
             * @summary Feet wet/swimming? 
             */
            FeetWet : Bool;
                
            /**
             * @summary Feigning? 
             */
            Feigning : Bool;
                
            /**
             * @summary The spawn a player is following using follow on also returns your pet's target via Me.Pet.Following} 
             */
            Following : Spawn;
                
            /**
             * @summary Is your target moving away from you? 
             */
            Fleeing : Bool;
                
            /**
             * @summary Gender 
             */
            Gender : String;
                
            /**
             * @summary GM or Guide? 
             */
            GM : Bool;
                
            /**
             * @summary Group leader? 
             */
            GroupLeader : Bool;
                
            /**
             * @summary Guild name 
             */
            Guild : String;
                
            /**
             * @summary Guild status Leader Officer Member NOTE GuildStatus is no longer present in BETA/TEST/LIVE versions and only available in UF and ROF EMU builds. 
             */
            "GuildStatus **" : String;
                
            /**
             * @summary Heading in this direction 
             */
            Heading : Heading;
                
            /**
             * @summary Heading player must travel in to reach this spawn 
             */
            HeadingTo : Heading;
                
            /**
             * @summary Heading to the coordinates y,x from the spawn 
             * @param arg - Description: `y,x`
             */
            HeadingToLoc(arg: string) : Heading;
                
            /**
             * @summary Height 
             */
            Height : Float;
                
            /**
             * @summary Represents what the pc/npc is holding 
             */
            Holding : Int;
                
            /**
             * @summary Hovering? 
             */
            Hovering : Bool;
                
            /**
             * @summary Spawn ID 
             */
            ID : Int;
                
            /**
             * @summary Gives TRUE/FALSE returns Options are ANY or 0 Me.Invis[ANY or Me.Invis[0 or Me.Invis NORMAL or 1 Me.Invis[NORMAL or just Me.Invis[1 UNDEAD or 2 Me.Invis[UNDEAD or just Me.Invis[2 ANIMAL or 3 Me.Invis[ANIMAL or just Me.Invis[3 SOS or 4 Me.Invis[SOS or just Me.Invis[4 returns true IF you are a ROG AND in fact hidden AND have a skill of at least 100 in HIDE AND have the AA for SoS 
             * @param arg - Description: `ANY|0`
             */
            Invis(arg: string) : Bool;
                
            /**
             * @summary Invited to group? 
             */
            Invited : Bool;
                
            /**
             * @summary Level 
             */
            Level : Int;
                
            /**
             * @summary Levitating? 
             */
            Levitating : Bool;
                
            /**
             * @summary LFG? 
             */
            LFG : Bool;
                
            /**
             * @summary Name of the light class this spawn has 
             */
            Light : String;
                
            /**
             * @summary Returns TRUE if spawn is in LoS 
             */
            LineOfSight : Bool;
                
            /**
             * @summary Linkdead? 
             */
            Linkdead : Bool;
                
            /**
             * @summary Loc of the spawn 
             */
            Loc : String;
                
            /**
             * @summary LocYX of the spawn 
             */
            LocYX : String;
                
            /**
             * @summary Looking this angle 
             */
            Look : Float;
                
            /**
             * @summary Current Raid or Group marked npc mark number raid first) 
             */
            Mark : Int;
                
            /**
             * @summary Master if it is charmed or a pet 
             */
            Master : Spawn;
                
            /**
             * @summary Maximum Endurance points only updates when target/group) 
             */
            MaxEndurance : Int;
                
            /**
             * @summary Maximum hit points 
             */
            MaxHPs : Int;
                
            /**
             * @summary Maximum Mana points only updates when target/group) 
             */
            MaxMana : Int;
                
            /**
             * @summary The max distance from this spawn for it to hit you 
             */
            MaxRange : Float;
                
            /**
             * @summary The Max distance from this spawn for you to hit it 
             */
            MaxRangeTo : Float;
                
            /**
             * @summary Mount 
             */
            Mount : Spawn;
                
            /**
             * @summary Moving? 
             */
            Moving : Bool;
                
            /**
             * @summary Location using MQ format 
             */
            MQLoc : Float;
                
            /**
             * @summary Name 
             */
            Name : String;
                
            /**
             * @summary Is this a named spawn ie does it's name not start with an a or an an  
             */
            Named : Bool;
                
            /**
             * @summary Find the nearest spawn matching this Spawn Search to this spawn most efficient on yourself) 
             * @param arg - Description: `search`
             */
            NearestSpawn(arg: string) : Spawn;
                
            /**
             * @summary Find the th nearest spawn matching this Spawn Search to this spawn most efficient on yourself) 
             * @param arg - Description: `#,search`
             */
            NearestSpawn(arg: string) : Spawn;
                
            /**
             * @summary Next spawn in the list 
             */
            Next : Spawn;
                
            /**
             * @summary Owner if mercenary 
             */
            Owner : Spawn;
                
            /**
             * @summary Previous spawn in the list 
             */
            Prev : Spawn;
                
            /**
             * @summary Pet 
             */
            Pet : Spawn;
                
            /**
             * @summary Percent hit points 
             */
            PctHPs : Int;
                
            /**
             * @summary returns a mask as an inttype which has the following meaning 0=Idle 1=Open 2=WeaponSheathed 4=Aggressive 8=ForcedAggressive 0x10=InstrumentEquipped 0x20=Stunned 0x40=PrimaryWeaponEquipped 0x80=SecondaryWeaponEquipped 
             */
            PlayerState : Int;
                
            /**
             * @summary Item ID of anything that may be in the Primary slot 
             */
            Primary : Int;
                
            /**
             * @summary Race 
             */
            Race : Race;
                
            /**
             * @summary Roleplaying? 
             */
            Roleplaying : Bool;
                
            /**
             * @summary Item ID of anything that may be in the Secondary slot 
             */
            Secondary : Int;
                
            /**
             * @summary Sitting? 
             */
            Sitting : Bool;
                
            /**
             * @summary Sneaking? 
             */
            Sneaking : Bool;
                
            /**
             * @summary Speed moving 
             */
            Speed : Float;
                
            /**
             * @summary Standing? 
             */
            Standing : Bool;
                
            /**
             * @summary StandState 
             */
            StandState : Int;
                
            /**
             * @summary STAND SIT DUCK BIND FEIGN DEAD STUN HOVER MOUNT UNKNOWN 
             */
            State : String;
                
            /**
             * @summary Stunned? 
             */
            Stunned : Bool;
                
            /**
             * @summary Stuck? 
             */
            Stuck : Bool;
                
            /**
             * @summary Suffix attached to name eg of 
             */
            Suffix : String;
                
            /**
             * @summary Last name 
             */
            Surname : String;
                
            /**
             * @summary Prefix/Title before name 
             */
            Title : String;
                
            /**
             * @summary Trader? 
             */
            Trader : Bool;
                
            /**
             * @summary PC NPC Untargetable Mount Pet Corpse Chest Trigger Trap Timer Item Mercenary Aura Object Banner Campfire Flyer 
             */
            Type : String;
                
            /**
             * @summary Underwater? 
             */
            Underwater : Bool;
                
            /**
             * @summary X coordinate 
             */
            X : Float;
                
            /**
             * @summary Y coordinate 
             */
            Y : Float;
                
            /**
             * @summary Z coordinate 
             */
            Z : Float;
                
            /**
             * @summary X the Northward-positive coordinate 
             */
            N : Float;
                
            /**
             * @summary Y the Westward-positive coordinate 
             */
            W : Float;
                
            /**
             * @summary Z the Upward-positive coordinate 
             */
            U : Float;
                
            /**
             * @summary Shortcut for X makes Eastward positive) 
             */
            E : Float;
                
            /**
             * @summary Shortcut for Y makes Southward positive) 
             */
            S : Float;
                
            /**
             * @summary Shortcut for Z makes Downward positive) 
             */
            D : Float;
                
            /**
             * @summary Same as Name 
             */
            "To String" : String;
                

            /**
             * Methods
             */
             
            /**
             * @summary assists the spawn 
             */
            DoAssist();
                

            /**
             * @summary Faces target 
             */
            DoFace();
                

            /**
             * @summary left clicks the spawn 
             */
            DoLeftClick();
                

            /**
             * @summary Right clicks the spawn 
             */
            DoRightClick();
                

            /**
             * @summary Targets the spawn 
             */
            DoTarget();
                
        }
        
        interface Spell {
            /**
             * Members
             */
            

            /**
             * Methods
             */
             
        }
        
        interface String {
            /**
             * Members
             */
            
            /**
             * @summary Returns the th argument of the string separated by s The separator s must be a single character defaults to space See below for difference between Token and Arg 
             * @param arg - Description: `#,s`
             */
            Arg(arg: string) : String;
                
            /**
             * @summary Determines how the initial string and the second string text compare to each other If both are the same Compare will return 0 If the string is alphabetically before text Compare will return 1 If text is alphabetically after string Compare will return 1 Compare is case-insensitive 
             * @param arg - Description: `text`
             */
            Compare(arg: string) : Int;
                
            /**
             * @summary CompareCS is exactly the same as Compare except that it is case-sensitive 
             * @param arg - Description: `text`
             */
            CompareCS(arg: string) : Int;
                
            /**
             * @summary Returns how many times a single character c occurs in the string 
             * @param arg - Description: `c`
             */
            Count(arg: string) : Int;
                
            /**
             * @summary If the initial string and the second string text are exactly the same returns TRUE Equal is case-insensitive 
             * @param arg - Description: `text`
             */
            Equal(arg: string) : Bool;
                
            /**
             * @summary EqualCS is exactly the same as Equal except that it is case-sensitive 
             * @param arg - Description: `text`
             */
            EqualCS(arg: string) : Bool;
                
            /**
             * @summary This tries to find the second string text within the original string If it is successful it returns the first position in the string where text begins It returns NULL if text is not found Find is case-insensitive 
             * @param arg - Description: `text`
             */
            Find(arg: string) : Int;
                
            /**
             * @summary Returns the length of the string as an integer 
             */
            Length : Int;
                
            /**
             * @summary Returns the first characters of the string A negative will return the whole string except for the last characters 
             * @param arg - Description: `#`
             */
            Left(arg: string) : String;
                
            /**
             * @summary Returns the string in all lower-case 
             */
            Lower : String;
                
            /**
             * @summary Returns a segment of the string starting at position p and running n characters 
             * @param arg - Description: `p,n`
             */
            Mid(arg: string) : String;
                
            /**
             * @summary If the initial string and the second string text are exactly the same returns FALSE NotEqual is case-insensitive 
             * @param arg - Description: `text`
             */
            NotEqual(arg: string) : Bool;
                
            /**
             * @summary NotEqualCS is exactly the same as NotEqual except that it is case-sensitive 
             * @param arg - Description: `text`
             */
            NotEqualCS(arg: string) : Bool;
                
            /**
             * @summary Replaces ReplaceThis with WithThis 
             * @param arg - Description: `ReplaceThis,WithThis`
             */
            Replace(arg: string) : String;
                
            /**
             * @summary Returns the last characters of the string A negative will return the whole string except for the first characters 
             * @param arg - Description: `#`
             */
            Right(arg: string) : String;
                
            /**
             * @summary Returns the th token of the string separated by s The separator s must be a single character defaults to space See below for difference between Arg and Token 
             * @param arg - Description: `#,s`
             */
            Token(arg: string) : String;
                
            /**
             * @summary Returns the string in all upper-case 
             */
            Upper : String;
                
            /**
             * @summary This is a string! 
             */
            "To String" : String;
                

            /**
             * Methods
             */
             
        }
        
        interface Switch {
            /**
             * Members
             */
            
            /**
             * @summary D coordinate (Upward-positive) 
             */
            D : Float;
                
            /**
             * @summary Heading of "closed" switch 
             */
            DefaultHeading : Heading;
                
            /**
             * @summary Y coordinate of "closed" switch (Northward-positive) 
             */
            DefaultN : Float;
                
            /**
             * @summary Z coordinate of "closed" switch (Upward-positive) 
             */
            DefaultU : Float;
                
            /**
             * @summary X coordinate of "closed" switch (Westward-positive) 
             */
            DefaultW : Float;
                
            /**
             * @summary X coordinate of "closed" switch 
             */
            DefaultX : Float;
                
            /**
             * @summary Y coordinate of "closed" switch 
             */
            DefaultY : Float;
                
            /**
             * @summary Z coordinate of "closed" switch 
             */
            DefaultZ : Float;
                
            /**
             * @summary Distance from player to switch in (x,y) 
             */
            Distance : Float;
                
            /**
             * @summary Switch is facing this heading 
             */
            Heading : Heading;
                
            /**
             * @summary Direction player must move to meet this switch 
             */
            HeadingTo : Heading;
                
            /**
             * @summary Switch ID 
             */
            ID : Int;
                
            /**
             * @summary Returns TRUE if the switch is in LoS 
             */
            LineOfSight : Bool;
                
            /**
             * @summary Y coordinate (Northward-positive) 
             */
            N : Float;
                
            /**
             * @summary Name 
             */
            Name : String;
                
            /**
             * @summary True if the switch is in the "open" state (State == 1) 
             */
            Open : Bool;
                
            /**
             * @summary The "state" of the switch. 
             */
            State : Int;
                
            /**
             * @summary X coordinate (Westward-positive) 
             */
            W : Float;
                
            /**
             * @summary X coordinate 
             */
            X : Float;
                
            /**
             * @summary Y coordinate 
             */
            Y : Float;
                
            /**
             * @summary Z coordinate 
             */
            Z : Float;
                
            /**
             * @summary Same as **ID** 
             */
            ToString : String;
                

            /**
             * Methods
             */
             
        }
        
        interface Target extends Spawn {
            /**
             * Members
             */
            

            /**
             * Methods
             */
             
        }
        
        interface Task {
            /**
             * Members
             */
            
            /**
             * @summary Returns the task's place on the tasklist 
             */
            Index : String;
                
            /**
             * @summary Call this Instruction to return a tasks's Objectives 
             * @param arg - Description: `#`
             */
            Objective(arg: string) : String;
                
            /**
             * @summary Call this Status to return the status of the objective in the format amount done Vs total IE 0/3 
             * @param arg - Description: `#`
             */
            Objective(arg: string) : String;
                
            /**
             * @summary Call this Zone to return the zone the objective is to be performed in 
             * @param arg - Description: `#`
             */
            Objective(arg: string) : String;
                
            /**
             * @summary Returns the current count of the Type needed to complete a objective 
             */
            CurrentCount : Int;
                
            /**
             * @summary Returns the required count of the Type needed to complete a objective 
             */
            RequiredCount : Int;
                
            /**
             * @summary Returns true or false if a objective is optional 
             */
            Optional : Bool;
                
            /**
             * @summary Returns a string of the required item to complete a objective. 
             */
            RequiredItem : String;
                
            /**
             * @summary Returns a string of the required skill to complete a objective. 
             */
            RequiredSkill : String;
                
            /**
             * @summary Returns a string of the required spell to complete a objective. 
             */
            RequiredSpell : String;
                
            /**
             * @summary Returns an int of the switch used in a objective. 
             */
            DZSwitchID : Int;
                
            /**
             * @summary Returns an int of the task ID 
             */
            ID : Int;
                
            /**
             * @summary Returns description of current step in the task 
             */
            Step : String;
                
            /**
             * @summary Selects the task 
             */
            Select : String;
                
            /**
             * @summary Returns name of the shared task 
             */
            Title : String;
                
            /**
             * @summary Returns amount of time before task expires 
             */
            Timer : Timestamp;
                
            /**
             * @summary Returns number of members in task 
             */
            Members : Int;
                
            /**
             * @summary Returns specified member in task by index 
             * @param arg - Description: `#`
             */
            Member(arg: string) : Taskmember;
                
            /**
             * @summary Returns specified member in task by name 
             * @param arg - Description: `name`
             */
            Member(arg: string) : Taskmember;
                
            /**
             * @summary Returns task leader's name 
             */
            Leader : String;
                
            /**
             * @summary Returns the Quest Window List Index if the window actually has the list filled) 
             */
            WindowIndex : Int;
                
            /**
             * @summary Returns a string that can be one of the following Unknown None Deliver Kill Loot Hail Explore Tradeskill Fishing Foraging Cast UseSkill DZSwitch DestroyObject Collect Dialogue 
             */
            Type : String;
                

            /**
             * Methods
             */
             
        }
        
        interface Taskmember {
            /**
             * Members
             */
            
            /**
             * @summary Returns true if member is leader 
             */
            Leader : Bool;
                
            /**
             * @summary Returns task index for member (i.e., 1-6) 
             */
            Index : Int;
                

            /**
             * Methods
             */
             
        }
        
        interface Taskmember {
            /**
             * Members
             */
            
            /**
             * @summary Returns name of the member 
             */
            Name : String;
                
            /**
             * @summary Returns true if member is leader 
             */
            Leader : Bool;
                
            /**
             * @summary Returns task index for member (i.e., 1-6) 
             */
            Index : Int;
                

            /**
             * Methods
             */
             
        }
        
        interface Ticks {
            /**
             * Members
             */
            
            /**
             * @summary The number of hours in HH:MM:SS (0-23) 
             */
            Hours : Int;
                
            /**
             * @summary The number of minutes in HH:MM:SS (1-59) 
             */
            Minutes : Int;
                
            /**
             * @summary The number of seconds in HH:MM:SS (1-59) 
             */
            Seconds : Int;
                
            /**
             * @summary The total number of minutes 
             */
            TotalMinutes : Int;
                
            /**
             * @summary The total number of seconds 
             */
            TotalSeconds : Int;
                
            /**
             * @summary The value in ticks 
             */
            Ticks : Int;
                
            /**
             * @summary Time in the form MM:SS 
             */
            Time : String;
                
            /**
             * @summary Time in the form HH:MM:SS (if there are no hours, the form will be MM:SS) 
             */
            TimeHMS : String;
                
            /**
             * @summary Same as **Ticks** 
             */
            "To String" : String;
                

            /**
             * Methods
             */
             
        }
        
        interface Time {
            /**
             * Members
             */
            
            /**
             * @summary Date in the format MM/DD/YYYY 
             */
            Date : String;
                
            /**
             * @summary Day of the month 
             */
            Day : Int;
                
            /**
             * @summary Day of the week (1=sunday to 7=saturday) 
             */
            DayOfWeek : Int;
                
            /**
             * @summary Hour (0-23) 
             */
            Hour : Int;
                
            /**
             * @summary Minute (0-59) 
             */
            Minute : Int;
                
            /**
             * @summary Month of the year (1-12) 
             */
            Month : Int;
                
            /**
             * @summary Gives true if the current hour is considered "night" in EQ (7:00pm-6:59am) 
             */
            Night : Bool;
                
            /**
             * @summary Second (0-59) 
             */
            Second : Int;
                
            /**
             * @summary Number of seconds since midnight 
             */
            SecondsSinceMidnight : Int;
                
            /**
             * @summary Time in 12-hour format (HH:MM:SS) 
             */
            Time12 : String;
                
            /**
             * @summary Time in 24-hour format (HH:MM:SS) 
             */
            Time24 : String;
                
            /**
             * @summary Year 
             */
            Year : Int;
                
            /**
             * @summary Same as **Time24** 
             */
            "To String" : String;
                

            /**
             * Methods
             */
             
        }
        
        interface Timer {
            /**
             * Members
             */
            
            /**
             * @summary Original value of the timer 
             */
            OriginalValue : Int;
                
            /**
             * @summary Current value of the timer 
             */
            Value : Int;
                
            /**
             * @summary Same as **Value** 
             */
            "To String" : String;
                

            /**
             * Methods
             */
             
        }
        
        interface Timestamp {
            /**
             * Members
             */
            
            /**
             * @summary Number of days remaining in the timestamp (3d 2h 23m will return 3) 
             */
            Days : Int;
                
            /**
             * @summary Number of hours remaining in the timestamp (1hr 23min 53 seconds will return 1) 
             */
            Hours : Int;
                
            /**
             * @summary Number of Minutes remaining in the timestamp (1hr 23min 53 seconds will return 23) 
             */
            Minutes : Int;
                
            /**
             * @summary Number of Seconds remaining in the timestamp (1hr 23min 53 seconds will return 53) 
             */
            Seconds : Int;
                
            /**
             * @summary Remaining time value formatted in D:H:M (Days:Hours:Minutes) 
             */
            TimeDHM : String;
                
            /**
             * @summary Remaining time value formatted in H:M:S 
             */
            TimeHMS : String;
                
            /**
             * @summary Remaining time value formatted in M:S 
             */
            Time : String;
                
            /**
             * @summary Total number of remaining minutes in the timestamp (1hr 23min 53 seconds will return 83) 
             */
            TotalMinutes : Int;
                
            /**
             * @summary Total number of remaining minutes in the timestamp (1hr 23min 53 seconds will return 5033) 
             */
            TotalSeconds : Int;
                
            /**
             * @summary Remaining time value represented in milliseconds 
             */
            Raw : Int;
                
            /**
             * @summary timestamp represented in remaining seconds (1hr 23 min 53 seconds will return 5033.00) 
             */
            Float : Float;
                
            /**
             * @summary Remaining time value represented in ticks 
             */
            Ticks : Int;
                
            /**
             * @summary Same as **Raw** 
             */
            "To String" : String;
                

            /**
             * Methods
             */
             
        }
        
        interface Type {
            /**
             * Members
             */
            
            /**
             * @summary Type name 
             */
            Name : String;
                
            /**
             * @summary Member name based on an internal ID number (based on 1 through n, not all values will be used) 
             * @param arg - Description: `#`
             */
            TypeMember(arg: string) : String;
                
            /**
             * @summary Member internal ID number based on _name_ (will be a number from 1 to n) 
             * @param arg - Description: `_name_`
             */
            TypeMember(arg: string) : Int;
                
            /**
             * @summary Same as **Name** 
             */
            "To String" : String;
                

            /**
             * Methods
             */
             
        }
        
        interface Window {
            /**
             * Members
             */
            
            /**
             * @summary Background color 
             */
            BGColor : Argb;
                
            /**
             * @summary Returns TRUE if the button has been checked 
             */
            Checked : Bool;
                
            /**
             * @summary Find a child window with the provided name 
             * @param arg - Description: ` name `
             */
            Child(arg: string) : Window;
                
            /**
             * @summary Returns TRUE if the window has children 
             */
            Children : Bool;
                
            /**
             * @summary TabBox Returns the Page window associated with the currently selected tab. 
             */
            CurrentTab : Window;
                
            /**
             * @summary TabBox Returns the index of the currently selected tab. 
             */
            CurrentTabIndex : Int;
                
            /**
             * @summary Returns TRUE if the window is enabled 
             */
            Enabled : Bool;
                
            /**
             * @summary First child window 
             */
            FirstChild : Window;
                
            /**
             * @summary Index of the currently selected/highlighted item in a list or treeview 
             */
            GetCurSel : Int;
                
            /**
             * @summary Height in pixels 
             */
            Height : Int;
                
            /**
             * @summary Returns TRUE if the window is highlighted 
             */
            Highlighted : Bool;
                
            /**
             * @summary Has the other person clicked the Trade button? 
             */
            HisTradeReady : Bool;
                
            /**
             * @summary Horizontal scrollbar range 
             */
            HScrollMax : Int;
                
            /**
             * @summary Horizontal scrollbar position 
             */
            HScrollPos : Int;
                
            /**
             * @summary Horizontal scrollbar position in to range from 0 to 100 
             */
            HScrollPct : Int;
                
            /**
             * @summary Number of items in a Listbox or Combobox 
             */
            Items : Int;
                
            /**
             * @summary Get the text for the th item in a list box Only works on list boxes Use of y is optional and allows selection of the column of the window to get text from. 
             * @param arg - Description: ` #, y `
             */
            List(arg: string) : String;
                
            /**
             * @summary Find an item in a list box by partial match use window.List text for exact Only works on list boxes Use of y is optional and allows selection of the column of the window to search in. 
             * @param arg - Description: ` text, y `
             */
            List(arg: string) : Int;
                
            /**
             * @summary Returns TRUE if the window is minimized 
             */
            Minimized : Bool;
                
            /**
             * @summary Returns TRUE if the mouse is currently over the window 
             */
            MouseOver : Bool;
                
            /**
             * @summary Have I clicked the Trade button? 
             */
            MyTradeReady : Bool;
                
            /**
             * @summary Name of window piece e.g ChatWindow for top level windows or the piece name for child windows b b Note this is Custom UI dependent 
             */
            Name : String;
                
            /**
             * @summary Next sibling window 
             */
            Next : Window;
                
            /**
             * @summary Returns TRUE if the window is open 
             */
            Open : Bool;
                
            /**
             * @summary Parent window 
             */
            Parent : Window;
                
            /**
             * @summary ScreenID of window piece b b Note This is not Custom UI dependent it must be the same on all UIs 
             */
            ScreenID : String;
                
            /**
             * @summary Returns TRUE if the window has siblings 
             */
            Siblings : Bool;
                
            /**
             * @summary Window style code 
             */
            Style : Int;
                
            /**
             * @summary TabBox The number of tabs present in the TabBox. 
             */
            TabCount : Int;
                
            /**
             * @summary TabBox Looks up the Page window that matches the provided index or tab text. 
             * @param arg - Description: ` # or Name `
             */
            Tab(arg: string) : Window;
                
            /**
             * @summary Window's text STMLBox returns the contents of the STML Page returns the name of the page's Tab. 
             */
            Text : String;
                
            /**
             * @summary TooltipReference text 
             */
            Tooltip : String;
                
            /**
             * @summary Type of window piece Screen for top level windows or Listbox Button Gauge Label Editbox Slider etc) 
             */
            Type : String;
                
            /**
             * @summary Vertical scrollbar range 
             */
            VScrollMax : Int;
                
            /**
             * @summary Vertical scrollbar position in to range from 0 to 100 
             */
            VScrollPct : Int;
                
            /**
             * @summary Vertical scrollbar position 
             */
            VScrollPos : Int;
                
            /**
             * @summary Width in pixels 
             */
            Width : Int;
                
            /**
             * @summary Screen X position 
             */
            X : Int;
                
            /**
             * @summary Screen Y position 
             */
            Y : Int;
                
            /**
             * @summary TRUE if window exists FALSE if not 
             */
            "To String" : String;
                

            /**
             * Methods
             */
             
            /**
             * @summary Action 
             */
            Name();
                

            /**
             * @summary Does the action of closing a window 
             */
            DoClose();
                

            /**
             * @summary Does the action of opening a window 
             */
            DoOpen();
                

            /**
             * @summary Does the action of clicking the left mouse button down 
             */
            LeftMouseDown();
                

            /**
             * @summary Does the action of holding the left mouse button 
             */
            LeftMouseHeld();
                

            /**
             * @summary does the action of holding the left mouse button up 
             */
            LeftMouseHeldUp();
                

            /**
             * @summary Does the action of clicking the left mouse button up 
             */
            LeftMouseUp();
                

            /**
             * @summary does the action of clicking the right mouse button 
             */
            RightMouseDown();
                

            /**
             * @summary Does the action of holding the right mouse button 
             */
            RightMouseHeld();
                

            /**
             * @summary Does the action of holding the right mouse button up 
             */
            RightMouseHeldUp();
                

            /**
             * @summary Does the action of clicking the right mouse button up 
             */
            RightMouseUp();
                

            /**
             * @summary Selects the specified window 
             */
            Select();
                

            /**
             * @summary If the window is a TabBox, set the current tab by index or by name. 
             * @param arg - Description  # or Name 
             */
            SetCurrentTab(arg :string);
                
        }
        
        interface Worldlocation {
            /**
             * Members
             */
            
            /**
             * @summary The location's ID 
             */
            ID : Int;
                
            /**
             * @summary At the point of binding, what direction was the character facing 
             */
            Heading : Float;
                
            /**
             * @summary Access to the zone data 
             */
            Zone : Zone;
                
            /**
             * @summary The X coordinate 
             */
            X : Float;
                
            /**
             * @summary The Y coordinate 
             */
            Y : Float;
                
            /**
             * @summary The Z coordinate 
             */
            Z : Float;
                

            /**
             * Methods
             */
             
        }
        
        interface Xtaggrocount {
            /**
             * Members
             */
            

            /**
             * Methods
             */
             
        }
        
        interface Xtarget {
            /**
             * Members
             */
            
            /**
             * @summary ID of specified XTarget 
             */
            ID : Int;
                
            /**
             * @summary Name of specified XTarget 
             */
            Name : String;
                
            /**
             * @summary PctAggro of specified XTarget 
             */
            PctAggro : Int;
                
            /**
             * @summary Extended target type (see below) 
             */
            TargetType : String;
                
            /**
             * @summary Number of current extended targets 
             */
            "To String" : String;
                

            /**
             * Methods
             */
             
        }
        
        interface Zone {
            /**
             * Members
             */
            
            /**
             * @summary ID of the zone 
             */
            ID : Int;
                
            /**
             * @summary Full zone name 
             */
            Name : String;
                
            /**
             * @summary Short zone name 
             */
            ShortName : String;
                
            /**
             * @summary Same as **Name** 
             */
            "To String" : String;
                

            /**
             * Methods
             */
             
        }
        

}

