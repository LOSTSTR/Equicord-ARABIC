/*
 * Esharq — English translations for all arabized plugins.
 * Keys are the plugin's `name` field from definePlugin().
 * Absence of a key means the plugin already has an English description.
 */

export interface PluginI18n {
    description: string;
    options?: Record<string, string>;
}

export const PLUGIN_TRANSLATIONS: Record<string, PluginI18n> = {
    // ── equicordplugins ──────────────────────────────────────────────────────

    AltKrispSwitch: {
        description: "Makes the noise suppression toggle cycle between None and Krisp instead of Krisp and Standard.",
    },
    AlwaysExpandProfiles: {
        description: "Always opens user profiles fully expanded in a full popup window.",
    },
    Animalese: {
        description: "Plays Animal Crossing Animalese sounds for every message sent.",
        options: {
            volume: "Animalese volume level.",
            speed: "Animalese sound speed.",
            pitch: "Pitch multiplier.",
            messageLengthLimit: "Maximum message length to process.",
            processOwnMessages: "Enable to also play sounds for your own messages.",
            soundQuality: "Sound quality used.",
        },
    },
    ArabicAutoUpdater: {
        description: "Automatically checks for Esharq updates and notifies you when a new version is available.",
    },
    AtSomeone: {
        description: "Mentions a random person in the channel.",
    },
    AudioPlayerAPI: {
        description: "API for playing Discord internal audio files or external audio URLs.",
    },
    AutoZipper: {
        description: "Automatically compresses specified file types and folders before uploading to Discord.",
        options: {
            extensions: "Comma-separated list of file extensions to auto-compress (e.g. .psd,.blend,.exe,.dmg).",
        },
    },
    BannersEverywhere: {
        description: "Displays user banners in the member list.",
        options: {
            animate: "Animate animated banners.",
            preferNameplate: "Prefer the nameplate over the banner.",
        },
    },
    DecodeBase64: {
        description: "Decode Base64 content in any message and copy the decoded result.",
        options: {
            clickMethod: "Change the decode Base64 button interaction method.",
        },
    },
    BetterActivities: {
        description: "Shows activity icons in the member list and allows viewing all activities.",
        options: {
            memberList: "Show activity icons in the member list.",
            iconSize: "Activity icon size.",
            specialFirst: "Show featured activities first (currently: Spotify and Twitch).",
            renderGifs: "Allow animated GIF images.",
            removeGameActivityStatus: "Remove game activity icon and its associated status.",
            userPopout: "Show all activities in the profile popup/sidebar.",
            hideTooltip: "Hide activities in multiple places.",
            allActivitiesStyle: "Style for displaying all activities.",
        },
    },
    BetterAudioPlayer: {
        description: "Adds a visual spectrum analyser and oscilloscope to audio attachment players.",
        options: {
            oscilloscope: "Enable the oscilloscope visualizer.",
            spectrograph: "Enable the spectrograph (frequency spectrum) visualizer.",
            oscilloscopeSolidColor: "Use a solid color for the oscilloscope.",
            oscilloscopeColor: "Oscilloscope color (R, G, B or #hex).",
            spectrographSolidColor: "Use a solid color for the spectrograph visualizer.",
            spectrographColor: "Spectrograph visualizer color (R, G, B or #hex).",
            corsProxy: "CORS proxy URL for audio playback. Leave empty to disable the proxy.",
        },
    },
    BetterBanReasons: {
        description: "Create custom preset reasons for the ban dialog, or show a plain text field instead.",
        options: {
            reasons: "Your custom ban reasons.",
            isTextInputDefault: "Show a text input field instead of the selection list by default (equivalent to clicking 'Other').",
        },
    },
    BetterBlockedUsers: {
        description: "Allows searching the blocked users list and makes usernames copyable in settings.",
    },
    BetterCommands: {
        description: "Improves the slash command system with various enhancements.",
        options: {
            autoFillArguments: "Auto-fill the command with all arguments instead of only the required ones.",
            allowNewlinesInCommands: "Allow new lines in command inputs (CTRL + Shift + Enter).",
        },
    },
    BetterInvites: {
        description: "Shows invite expiry, lets you view the invitee's profile and browse the server before joining by clicking the name.",
    },
    BetterPlusReacts: {
        description: "The number of + signs before :emoji: determines which message the reaction is added to.",
    },
    BlockKeywords: {
        description: "Hides messages containing user-specified keywords, as if the sender were blocked.",
        options: {
            blockedWords: "Comma-separated list of blocked keywords.",
            useRegex: "Treat each value as a regular expression when checking message content (advanced).",
            caseSensitive: "Whether the search is case-sensitive.",
            ignoreBlockedMessages: "Completely ignore the new-message bar.",
        },
    },
    BlockKrisp: {
        description: "Prevents Krisp noise suppression from loading.",
    },
    BypassPinPrompt: {
        description: "Bypasses the confirmation prompt when pinning or unpinning messages.",
    },
    BypassStatus: {
        description: "Continue receiving notifications from specific sources even in Do Not Disturb mode. Right-click users/channels/servers to configure bypass.",
        options: {
            guilds: "Servers allowed to bypass (notified when mentioned anywhere in the server).",
            channels: "Channels allowed to bypass (notified when mentioned in that channel).",
            users: "Users allowed to bypass (notified of all their direct messages).",
            allowOutsideOfDms: "Allow selected users to bypass outside DMs too (acts as a channel/server bypass for all messages from selected users).",
            notificationSound: "Whether to play a notification sound.",
            respectSilentPings: "Respect silent mentions (@silent / muted notifications).",
            statusToUse: "The status used to activate the whitelist.",
        },
    },
    ChannelBadges: {
        description: "Adds badges to channels based on their type.",
        options: {
            oneBadgePerChannel: "Show only one badge per channel.",
            showTextBadge: "Show the text channel badge.",
            showVoiceBadge: "Show the voice channel badge.",
            showCategoryBadge: "Show the category badge.",
            showDirectoryBadge: "Show the directory badge.",
            showAnnouncementThreadBadge: "Show the announcement thread badge.",
            showPublicThreadBadge: "Show the public thread badge.",
            showPrivateThreadBadge: "Show the private thread badge.",
            showStageBadge: "Show the stage badge.",
            showAnnouncementBadge: "Show the announcement badge.",
            showForumBadge: "Show the forum badge.",
            showMediaBadge: "Show the media badge.",
            showNSFWBadge: "Show the NSFW badge.",
            showLockedBadge: "Show the locked badge.",
            showRulesBadge: "Show the rules badge.",
            showUnknownBadge: "Show the unknown type badge.",
            textBadgeLabel: "Text channel badge label.",
            voiceBadgeLabel: "Voice channel badge label.",
            categoryBadgeLabel: "Category badge label.",
            announcementBadgeLabel: "Announcement badge label.",
            announcementThreadBadgeLabel: "Announcement thread badge label.",
            publicThreadBadgeLabel: "Public thread badge label.",
            privateThreadBadgeLabel: "Private thread badge label.",
            stageBadgeLabel: "Stage badge label.",
            directoryBadgeLabel: "Directory badge label.",
            forumBadgeLabel: "Forum badge label.",
            mediaBadgeLabel: "Media badge label.",
            nsfwBadgeLabel: "NSFW badge label.",
            lockedBadgeLabel: "Locked badge label.",
            rulesBadgeLabel: "Rules badge label.",
            unknownBadgeLabel: "Unknown type badge label.",
            textBadgeColor: "Text channel badge color.",
            voiceBadgeColor: "Voice channel badge color.",
            categoryBadgeColor: "Category badge color.",
            announcementBadgeColor: "Announcement badge color.",
            announcementThreadBadgeColor: "Announcement thread badge color.",
            publicThreadBadgeColor: "Public thread badge color.",
            privateThreadBadgeColor: "Private thread badge color.",
            stageBadgeColor: "Stage badge color.",
            directoryBadgeColor: "Directory badge color.",
            forumBadgeColor: "Forum badge color.",
            mediaBadgeColor: "Media badge color.",
            nsfwBadgeColor: "NSFW badge color.",
            lockedBadgeColor: "Locked badge color.",
            rulesBadgeColor: "Rules badge color.",
            unknownBadgeColor: "Unknown type badge color.",
        },
    },
    ChannelTabs: {
        description: "Browse your most-visited channels in browser-style tabs.",
        options: {
            onStartup: "What to do when Discord starts.",
            noPomeloNames: "Use display names instead of usernames in DMs.",
            showStatusIndicators: "Show status indicators in DMs.",
            showBookmarkBar: "Show the bookmark bar.",
            bookmarkNotificationDot: "Show notification dot on bookmarks.",
            persistUnreadCountFallback: "Persist fallback unread badges across reloads for tabs and bookmarks.",
            widerTabsAndBookmarks: "Extend tab and bookmark length for larger screens.",
            tabHeightScale: "Tab height scale (percentage).",
            renderAllTabs: "Keep all tabs in memory for faster switching (preserves scroll position and state).",
            switchToExistingTab: "Switch to an existing tab when navigating to a channel that already has one open.",
            createNewTabIfNotExists: "Create a new tab if none exists for the channel you navigate to.",
            enableRapidNavigation: "Enable rapid navigation — fast channel switching replaces the current tab instead of opening new tabs.",
            rapidNavigationThreshold: "Time window (seconds) for rapid navigation.",
            tabBarPosition: "Where to display the tab bar.",
            enableNumberKeySwitching: "Enable number keys (1–9) to switch between tabs.",
            numberKeySwitchCount: "Number of tabs accessible via number keys.",
            enableCloseTabShortcut: "Enable keyboard shortcut to close a tab.",
            enableNewTabShortcut: "Enable keyboard shortcut to open a new tab.",
            enableTabCycleShortcut: "Enable keyboard shortcut to cycle through tabs.",
            showTabNumbers: "Show numbered badges on tabs for keyboard shortcut hints.",
            tabNumberPosition: "Where to display the numbered badge on tabs.",
            compactAutoExpandSelected: "Auto-expand compact tabs when selected to show the full channel name.",
            compactAutoExpandOnHover: "Auto-expand compact tabs on hover to show the full channel name.",
            openInNewTabAutoSwitch: "Auto-switch to new tabs opened from the 'Open in New Tab' context menu.",
            bookmarksIndependentFromTabs: "Bookmarks navigate independently without affecting the active tab bar.",
            showResizeHandle: "Show a resize handle on hover to adjust tab width.",
            openNewTabsInCompactMode: "Open all new tabs in compact mode by default.",
            newTabButtonBehavior: "New tab (+) button follows tabs instead of staying pinned to the right.",
            oneTabPerServer: "Limit to one tab per server; opening a new channel reuses the existing tab for that server.",
            maxOpenTabs: "Maximum number of open tabs (0 = no limit).",
        },
    },
    CleanChannelName: {
        description: "Removes emoji and decorations from channel names; shows the original name when editing.",
    },
    CleanerChannelGroups: {
        description: "Hides all channels inside collapsed categories, even if they have unread messages.",
    },
    CancelFriendRequest: {
        description: "Adds a way to cancel outgoing friend requests from user profiles.",
    },
    ClickableRoles: {
        description: "Makes roles in profiles and the member list clickable to see who has them.",
    },
    ClientSideBlock: {
        description: "Lets you hide nearly all content from any user locally.",
        options: {
            hideVc: "Hide blocked users from voice channels.",
            usersToBlock: "Users to block client-side.",
            hideBlockedUsers: "Hide blocked users from member lists and profiles.",
            hideBlockedMessages: "Hide messages from blocked users.",
            hideEmptyRoles: "Hide roles that have no visible members after blocking.",
            blockedReplyDisplay: "How to display replies to blocked messages.",
            guildBlackList: "Servers to apply blocking in (leave empty for all).",
            guildWhiteList: "Servers to exclude from blocking.",
        },
    },
    ClipsEnhancements: {
        description: "Adds extra frame-rate and duration options for clips, a custom length, RPC highlights, and more.",
        options: {
            richPresenceTagging: "When to tag clips with the current Rich Presence.",
            enableScreenshotKeybind: "Enable keyboard shortcut to take screenshots.",
            enableVoiceOnlyClips: "Enable voice-only clips (no video).",
            enableSpeakingIndicators: "Enable speaking indicators.",
            enableAdvancedSignals: "Enable advanced clip signals (automatic recording triggers).",
            ignorePlatformRestriction: "Allow recording on restricted platforms (may cause save errors).",
        },
    },
    CollapsibleUI: {
        description: "Makes the channel panel, member list, chat buttons, and user area collapsible.",
        options: {
            collapsedSize: "Size of the hover area when collapsed in pixels.",
            transitionMs: "Panel transition speed in milliseconds.",
            guildBarCollapsed: "Keep the server bar collapsed.",
            channelListCollapsed: "Keep the channel list collapsed.",
            membersListCollapsed: "Keep the members list collapsed.",
            chatButtonsCollapsed: "Keep the message buttons bar collapsed.",
            titleBarCollapsed: "Keep the title bar collapsed.",
            headerBarCollapsed: "Keep the header bar collapsed.",
            userAreaCollapsed: "Keep the user area collapsed.",
        },
    },
    CommandPalette: {
        description: "Run actions quickly through a searchable command palette.",
        options: {
            compactStartEnabled: "Open the command palette in compact mode first.",
            closeAfterExecute: "Close the command palette after executing a command.",
        },
    },
    ContentWarning: {
        description: "Lets you specify words that are automatically blurred. Hover or click blurred content to reveal it.",
        options: {
            onClick: "Action when clicking on blurred content.",
        },
    },
    CopyProfileColors: {
        description: "Copies a user's profile gradient colors to the clipboard.",
    },
    CopyStatusUrls: {
        description: "Copies a user's status URL when you right-click it.",
    },
    CopyUserMention: {
        description: "Adds a button to copy user mentions from the context menu; works best with ValidUser.",
    },
    CursorBuddy: {
        description: "Adds an animated character that follows your cursor.",
        options: {
            buddy: "Select the cursor buddy character.",
            speed: "Movement speed of the buddy.",
            fps: "Animation frame rate.",
            furColor: "Buddy fur/body color.",
            outlineColor: "Buddy outline color.",
            size: "Size of the buddy.",
            fade: "Fade the buddy when inactive.",
            freeroam: "Allow the buddy to roam freely.",
            shake: "Shake the buddy on click.",
        },
    },
    CustomFolderIcons: {
        description: "Lets you customize folder icons with any PNG image.",
        options: {
            solidIcon: "Use a solid background behind the folder icon.",
        },
    },
    CustomSounds: {
        description: "Customize Discord's notification sounds.",
    },
    CustomStatusTimeouts: {
        description: "Adds customizable presets for status expiry duration in the presence menu.",
        options: {
            showForeverOnTop: "Show the 'Forever' option at the top of the list.",
            extraSeconds: "Additional seconds presets.",
            extraMinutes: "Additional minutes presets.",
            extraHours: "Additional hours presets.",
            extraDays: "Additional days presets.",
        },
    },
    CustomTimestamps: {
        description: "Custom time formats for messages and tooltips.",
        options: {
            formats: "Custom timestamp formats.",
        },
    },
    CustomUserColors: {
        description: "Lets you assign a custom color to any user anywhere. Works great with TypingTweaks and RoleColorEverywhere.",
        options: {
            dmList: "Apply custom colors in the DM list.",
            colorInServers: "Apply custom colors in servers.",
        },
    },
    Declutter: {
        description: "Tidies Discord by removing non-essential UI elements like profile effects, store tabs, support, and more.",
        options: {
            removeAvatarDecoration: "Remove avatar decorations.",
            removeNameplate: "Remove nameplates.",
            removeProfileEffect: "Remove profile effects.",
            removeClanTag: "Remove clan tags.",
            alwaysShowUsername: "Always show the username.",
            removeShopAboveDM: "Remove the shop section above DMs.",
            removeQuestsAboveDM: "Remove the quests section above DMs.",
            removeServerBoostInfo: "Remove server boost info.",
            removeBillingSettings: "Remove billing settings.",
            removeGiftButton: "Remove the gift button.",
            removeUnavailableEmojiPicker: "Remove the unavailable emoji picker.",
            removeAudioMenus: "Remove audio menus.",
            removeButtonTooltips: "Remove button tooltips.",
        },
    },
    DisableCameras: {
        description: "Disables the camera in calls by default.",
    },
    DiscordDevBanner: {
        description: "Enables Discord's developer info banner to display the build ID.",
    },
    DragFavoriteEmotes: {
        description: "Allows reordering favorite emoji by drag-and-drop.",
    },
    Dragify: {
        description: "Drag users, channels, or servers into the chat to insert mentions or invites.",
        options: {
            userOutput: "Output format when dragging a user.",
            channelOutput: "Output format when dragging a channel.",
            inviteExpireAfter: "Invite expiry duration.",
            inviteMaxUses: "Maximum invite uses.",
            inviteTemporaryMembership: "Create temporary membership invites.",
            reuseExistingInvites: "Reuse existing invites when possible.",
            allowChatBodyDrop: "Allow dropping into the chat body (not just the input box).",
        },
    },
    ElementHighlighter: {
        description: "Easily highlight and inspect UI elements.",
    },
    EquibopStreamFixes: {
        description: "Attempts to fix streaming quality on Equibop by tweaking Discord's encoder and quality limits.",
    },
    EquicordHelper: {
        description: "Used to provide support and fix issues caused by Discord and various other features.",
    },
    EquicordToolbox: {
        description: "Adds a button next to the inbox in the channel header with quick Equicord actions.",
        options: {
            showPluginMenu: "Show the plugin quick-actions menu.",
        },
    },
    Equissant: {
        description: "Plays a croissant sound every N clicks. :trolley:",
    },
    ExitSounds: {
        description: "Plays soundboard sounds when you disconnect from voice.",
        options: {
            soundGuildId: "Server ID that contains the sound.",
            soundId: "Sound ID to play on disconnect.",
        },
    },
    ExportMessages: {
        description: "Lets you export any message to a file.",
    },
    FastDeleteChannels: {
        description: "Adds a trash icon for fast channel deletion.",
    },
    FavouriteAnything: {
        description: "Lets you favourite any image, video, or attachment.",
    },
    FileUpload: {
        description: "Upload images and videos to file-hosting services like Zipline and Nest.",
    },
    FindReply: {
        description: "Jumps to the oldest reply to a message in a channel (useful for following old conversations).",
    },
    FixFileExtensions: {
        description: "Fixes file extensions by renaming them to a supported format when possible.",
    },
    FollowVoiceUser: {
        description: "Follow a friend between voice channels.",
        options: {
            onlyWhenInVoice: "Only follow when you are already in a voice channel.",
            leaveWhenUserLeaves: "Leave the voice channel when the followed user leaves.",
        },
    },
    FontLoader: {
        description: "Loads any font from Google Fonts.",
        options: {
            selectedFont: "The selected font to load.",
            fontSearch: "Search for a font by name.",
            applyOnCodeBlocks: "Also apply the font to code blocks.",
        },
    },
    ForwardAnywhere: {
        description: "If forwarding fails, sends it as a regular message. Also allows forwarding NSFW content.",
    },
    FrequentQuickSwitcher: {
        description: "Reorders Quick Switcher results to show your most-used channels first.",
    },
    FriendCodes: {
        description: "Generates friend codes for easy friend requests.",
    },
    FriendTags: {
        description: "Lets you filter by custom tags in the Quick Switcher; start your search with &.",
        options: {
            tagConfiguration: "Tag configuration for your friends.",
        },
    },
    FriendshipRanks: {
        description: "Adds badges showing how long you have been friends with a user.",
    },
    FullVCPFP: {
        description: "Makes the avatar fill the entire user tile in voice channels.",
    },
    Ghosted: {
        description: "Shows a ghost indicator if you haven't replied to their DMs.",
        options: {
            showIndicator: "Show the ghost indicator.",
            showDmIcons: "Show ghost icons in the DM list.",
            ignoreGroupDms: "Ignore group DMs.",
            exemptedChannels: "Channels exempt from the ghost indicator.",
            ignoreBots: "Ignore messages from bots.",
            maxInactiveTimeMs: "Maximum inactive time before showing the ghost indicator (in milliseconds).",
        },
    },
    GifCollections: {
        description: "Lets you create and organize custom GIF collections.",
    },
    GitHubRepos: {
        description: "Displays a user's public GitHub repositories on their profile.",
    },
    GlobalBadges: {
        description: "Adds global badges from other Discord modifications.",
    },
    GoogleThat: {
        description: "Adds a command to send an internet search link.",
    },
    GuildPickerDumper: {
        description: "Adds a context-menu option to download emoji and stickers from any server.",
    },
    HeaderBarAPI: {
        description: "API for adding buttons to the header bar and channel toolbar.",
    },
    HideChatButtons: {
        description: "Lets you hide chat buttons.",
        options: {
            color: "Button highlight color.",
            open: "Open the button configuration panel.",
        },
    },
    HideMessages: {
        description: "Temporarily hide messages until you restart.",
        options: {
            hidePopoverButton: "Show a hide button in the message hover actions.",
        },
    },
    HideServers: {
        description: "Lets you hide servers from the guild list and Quick Switcher by right-clicking them.",
    },
    HomeTyping: {
        description: "Turns the home button into a typing indicator when someone is typing in your DMs.",
    },
    HopOn: {
        description: "Hop on! Opens a configurable link whenever a message in the current channel matches a custom regex.",
        options: {
            regex: "Regular expression to match against messages.",
            url: "URL to open when a message matches.",
        },
    },
    Husk: {
        description: "Adds a Husk button to the toolbox (see settings to change the emoji).",
        options: {
            findInServer: "Server ID to find the emoji in.",
            emojiName: "Emoji name to use.",
            emojiID: "Emoji ID to use.",
        },
    },
    IRememberYou: {
        description: "Locally saves everyone you've interacted with (including servers) as a backup in case of loss.",
    },
    IconViewer: {
        description: "Adds a new tab in settings to preview all icons.",
    },
    IdleAutoRestart: {
        description: "Automatically restarts the client after a configurable idle period, avoiding restarts while in voice.",
        options: {
            isEnabled: "Enable automatic restart on idle.",
            idleMinutes: "Number of idle minutes before restarting.",
        },
    },
    IgnoreCalls: {
        description: "Lets you ignore calls from specific users or group DMs.",
        options: {
            permanentlyIgnoredUsers: "Users whose calls are permanently ignored.",
        },
    },
    InRole: {
        description: "See who has a given role via the context menu or /inrole command (read plugin info!).",
    },
    Ingtoninator: {
        description: "Appends 'ington' to a random word in your message.",
        options: {
            showIcon: "Show a toolbar icon to toggle the plugin.",
            isEnabled: "Enable the Ingtoninator.",
        },
    },
    InstantScreenshare: {
        description: "Instantly starts screen sharing when you join a voice channel, supporting desktop, windows, cameras, and capture cards.",
    },
    InvisibleChat: {
        description: "Encrypt your messages in an unsuspicious way!",
    },
    InviteDefaults: {
        description: "Lets you modify the default values when creating server invites.",
        options: {
            inviteDuration: "Default invite expiry duration.",
            maxUses: "Default maximum invite uses.",
            temporaryMembership: "Create temporary membership invites by default.",
        },
    },
    JumpTo: {
        description: "Adds context-menu options to jump to the first or last message in a channel or DM.",
    },
    Jumpscare: {
        description: "Adds a configurable chance of jump-scaring you each time you open a channel. Inspired by Geometry Dash Mega Hack.",
        options: {
            imageSource: "URL of the jump-scare image.",
            audioSource: "URL of the jump-scare audio.",
            chance: "Probability of a jump-scare (1 in X, e.g. 100 = 1%, 50 = 2%).",
        },
    },
    KeyboardNavigation: {
        description: "Lets you navigate the UI using your keyboard.",
        options: {
            hotkey: "Keyboard shortcut to open the command palette.",
            allowMouseControl: "Allow controlling the command palette with the mouse.",
        },
    },
    KeyboardSounds: {
        description: "Adds OperaGX or osu! sound effects when typing on the keyboard.",
        options: {
            volume: "Keyboard sounds volume level.",
            soundPack: "Sound pack to use.",
        },
    },
    KeywordNotify: {
        description: "Sends a notification if a message matches specified keywords or regex patterns.",
        options: {
            ignoreBots: "Ignore messages from bots.",
            amountToKeep: "Number of matched messages to keep in the list.",
            keywords: "Keywords or regex patterns to watch for.",
        },
    },
    LastActive: {
        description: "Lets you jump to your or another user's last active message in a channel or server.",
    },
    LoginWithQR: {
        description: "Lets you sign in to another device by scanning its QR code, just like on mobile!",
        options: {
            scanQr: "Scan a QR code.",
        },
    },
    MediaPlaybackSpeed: {
        description: "Lets you change the playback speed of media attachments (default ones).",
        options: {
            defaultVoiceMessageSpeed: "Default playback speed for voice messages.",
            defaultVideoSpeed: "Default playback speed for videos.",
            defaultAudioSpeed: "Default playback speed for audio files.",
        },
    },
    MessageBurst: {
        description: "Merges messages sent within a time window with your previous message if no one else sent between them.",
        options: {
            timePeriod: "Time window in seconds to merge messages.",
            shouldMergeWithAttachment: "Also merge messages that have attachments.",
            useSpace: "Insert a space between merged messages.",
        },
    },
    MessageColors: {
        description: "Renders color codes like #FF0042 inline within messages.",
    },
    MessageFetchTimer: {
        description: "Shows how long it took to load messages in the current channel.",
        options: {
            showIcon: "Show a clock icon next to the timer.",
            showMs: "Show time in milliseconds.",
            iconColor: "Color of the timer icon.",
        },
    },
    MessageLinkTooltip: {
        description: "Adds a message preview tooltip when hovering over message links, replies, and forwarded messages.",
        options: {
            onLink: "Show tooltip when hovering over message links.",
            onReply: "Show tooltip when hovering over replies.",
            onForward: "Show tooltip when hovering over forwarded messages.",
            display: "Tooltip display style.",
        },
    },
    MessageLoggerEnhanced: {
        description: "Enhances MessageLogger with edit history, ghost-ping detection, and more.",
    },
    MessageNotifier: {
        description: "Sends notifications when selected users send a message.",
        options: {
            users: "Users to notify when they send a message.",
        },
    },
    MessagePeek: {
        description: "Shows a preview of the last message and timestamp in the DM list.",
        options: {
            hideMuted: "Hide message preview for muted DMs.",
        },
    },
    MessageTranslate: {
        description: "Automatically translates messages into your language with caching, per-channel toggle, and more options.",
    },
    MicLoopbackTester: {
        description: "Adds a microphone loopback test icon to the user panel.",
    },
    MiddleClickTweaks: {
        description: "Various middle-click tweaks such as pasting and opening links.",
        options: {
            openScope: "Where middle-click opens links.",
            pasteScope: "Where middle-click pastes text.",
            pasteThreshold: "Minimum text length to trigger paste.",
        },
    },
    MoreCommands: {
        description: "Adds various fun and useful slash commands.",
    },
    MoreStickers: {
        description: "Adds sticker packs from other platforms (e.g., LINE).",
        options: {
            promptToUpload: "Place the sticker in the chat bar instead of sending immediately.",
            packs: "Sticker packs to enable.",
        },
    },
    MoreUserTags: {
        description: "Adds tags for webhooks and admin roles (owner, moderator, etc.).",
    },
    Moyai: {
        description: "Plays a 🗿 sound effect when a moyai emoji is sent, reacted with, or used as a voice effect.",
        options: {
            volume: "Volume of the moyai sound effect.",
            quality: "Sound quality.",
            triggerWhenUnfocused: "Also play when Discord is not focused.",
            ignoreBots: "Ignore moyai from bots.",
            ignoreBlocked: "Ignore moyai from blocked users.",
        },
    },
    MusicControls: {
        description: "Music controls and lyrics for multiple streaming services.",
    },
    NeverPausePreviews: {
        description: "Prevents call/PiP previews (screen share, stream, etc.) from pausing when focus is lost.",
    },
    NewPluginsManager: {
        description: "Alerts you when new plugins are added to Equicord.",
    },
    NoNitroUpsell: {
        description: "Removes all Nitro upsell prompts by tricking the client into thinking you're subscribed.",
    },
    NoPushToTalk: {
        description: "Bypasses push-to-talk requirements in voice channels that enforce it.",
    },
    NoRPC: {
        description: "Disables Discord's RPC server.",
    },
    NoRoleHeaders: {
        description: "We're all equal!! Removes role headers from the member list.",
    },
    NormalizeMessageLinks: {
        description: "Removes canary/ptb from message links.",
    },
    NotificationTitle: {
        description: "Makes desktop notifications more detailed and informative.",
    },
    OrbolayBridge: {
        description: "Bridge plugin for connecting Orbolay to Discord.",
        options: {
            port: "The port to connect to.",
            isKeybindEnabled: "Enable/disable the global keybind (Ctrl + `).",
            messageAlignment: "Alignment of messages in the overlay.",
            userAlignment: "Alignment of users in the overlay.",
            voiceSemitransparent: "Make voice channel members semi-transparent.",
            messagesSemitransparent: "Make message notifications semi-transparent.",
        },
    },
    PartyMode: {
        description: "Lets you use party mode because the party never stops ✨",
        options: {
            superIntensePartyMode: "Party intensity level.",
        },
    },
    PendingFriendRequest: {
        description: "Adds a way to cancel outgoing friend requests from profiles.",
    },
    PinIcon: {
        description: "Adds a pin icon on pinned messages.",
    },
    PingNotifications: {
        description: "Customizable notifications with improved mention formatting.",
        options: {
            friends: "Notify for messages from friends.",
            mentions: "Notify for mentions.",
            dms: "Notify for direct messages.",
            showInActive: "Show notifications even when the channel is active.",
            ignoreMuted: "Ignore notifications from muted channels/servers.",
        },
    },
    PlatformSpoofer: {
        description: "Spoof the platform or device you appear to be using.",
        options: {
            platform: "Platform to spoof.",
        },
    },
    PolishWording: {
        description: "Adjusts your messages to make them more polished and grammatically correct. See settings.",
        options: {
            quickDisable: "Quickly disable the plugin from the toolbar.",
            blockedWords: "Words to exclude from processing.",
            fixApostrophes: "Fix missing apostrophes.",
            expandContractions: "Expand contractions (e.g. don't → do not).",
            fixCapitalization: "Fix sentence capitalization.",
            fixPunctuation: "Fix missing punctuation.",
            fixPunctuationFrequency: "How often to fix punctuation.",
        },
    },
    ProfileCollectionsAPI: {
        description: "API for adding collections to the user profile panel like Discord's game collection.",
    },
    ProfileSectionsAPI: {
        description: "API for adding sections near the 'member since' area in user profile panels.",
    },
    ProfileSets: {
        description: "Lets you save and load different profile configurations via the profile section in settings.",
        options: {
            avatarSize: "Avatar size in the preset list.",
        },
    },
    Questify: {
        description: "Improves quest features, removes annoyances, or hides quests entirely.",
    },
    QuickThemeSwitcher: {
        description: "Quickly switch between themes using keyboard shortcuts.",
    },
    Quoter: {
        description: "Adds the ability to generate an inspirational quote image from a message.",
    },
    RandomVoice: {
        description: "Adds a button next to the mute button to join a random voice channel.",
        options: {
            UserAmountOperation: "Choose a comparison operator for the user count filter.",
            UserAmount: "Choose the target number of users for the filter.",
            spacesLeftOperation: "Choose a comparison operator for the spaces-left filter.",
            spacesLeft: "Choose the target number of spaces left for the filter.",
            vcLimitOperation: "Choose a comparison operator for the voice channel user limit.",
            vcLimit: "Choose the target voice channel user limit.",
            Servers: "Included servers (leave empty to include all).",
            autoNavigate: "Automatically navigate to the joined voice channel.",
            autoCamera: "Automatically enable camera on join.",
            autoStream: "Automatically start streaming on join.",
            selfMute: "Automatically mute yourself when joining a voice channel.",
            selfDeafen: "Automatically deafen yourself when joining a voice channel.",
            leaveEmpty: "Search for another random call when the voice channel becomes empty.",
            prioritizeFriends: "Prefer channels that contain your friends when possible.",
            avoidStages: "Avoid joining stage voice channels.",
            avoidAfk: "Avoid joining AFK voice channels.",
            video: "Filter for users who have their camera on.",
            stream: "Filter for users who are streaming.",
            mute: "Filter for users who are muted.",
            deafen: "Filter for users who are deafened.",
            includeStates: "Only join channels where at least one user matches the state filters.",
            avoidStates: "Avoid joining channels where any user matches the state filters.",
        },
    },
    RecentDMSwitcher: {
        description: "Navigate between most-used DMs with Ctrl+Tab (Ctrl+Shift+Tab to go back).",
        options: {
            visualStyle: "Visual indicator style while cycling.",
            overlayMode: "Overlay content to display.",
            amountOfUsers: "Number of users shown in the overlay.",
            overlayRowLength: "Number of recent DMs shown in the overlay row.",
            overlayShowAvatars: "Show avatars in the overlay.",
            toastDurationMs: "Duration before the toast notification hides (in milliseconds).",
            clearRdms: "Clear the RDMS history.",
        },
    },
    RemixRevived: {
        description: "Brings back the Remix feature and makes it available on desktop.",
    },
    RepeatMessages: {
        description: "Lets you quickly repeat messages. Holding Shift while clicking repeat will reply to the message.",
    },
    ReplyPingControl: {
        description: "Control whether message reply pings are always on or always off, with whitelist and blacklist support.",
        options: {
            alwaysPingOnReply: "Always ping when replying.",
            replyPingWhitelist: "Users who always get pinged when you reply.",
            replyPingBlacklist: "Users who never get pinged when you reply.",
        },
    },
    RichMagnetLinks: {
        description: "Renders magnet links as interactive message links.",
    },
    RichPresence: {
        description: "Unified Rich Presence hub for AudioBookShelf, osu!, stats.fm, Jellyfin, ListenBrainz, and Gensokyo Radio.",
    },
    RPCEditor: {
        description: "Modify the type and content of any Rich Presence.",
    },
    RPCStats: {
        description: "Displays your activity statistics as an RPC.",
    },
    SaveFavoriteGIFs: {
        description: "Export your favourite GIF links.",
    },
    ScheduledMessages: {
        description: "Schedule messages to be sent at a specified time or after a delay.",
        options: {
            maxMessagesPerMinute: "Maximum messages sent per minute.",
            checkIntervalSeconds: "How often to check for due messages (in seconds).",
            showNotifications: "Show notifications when a scheduled message is sent.",
            showPhantomMessages: "Show a preview of the scheduled message in the chat.",
        },
    },
    ScreenRecorder: {
        description: "Adds an option to record your screen and upload the recording to the channel.",
    },
    SearchFix: {
        description: "Fixes the search functionality.",
    },
    SekaiStickers: {
        description: "Sekai stickers integrated into Discord; original source: github.com/TheOriginalAyaka.",
        options: {
            AutoCloseModal: "Automatically close the modal after selecting a sticker.",
        },
    },
    SelfForward: {
        description: "Adds the current channel to the forward popup list.",
    },
    ServerSearch: {
        description: "Navigate between servers quickly via the quick search button.",
    },
    ShowBadgesInChat: {
        description: "Displays user badges next to their name in chat.",
    },
    ShowMessageEmbeds: {
        description: "Adds a context-menu option to show embeds for links that don't have them.",
    },
    ShowResourceChannels: {
        description: "Shows channels hidden behind server resources in the channel list.",
    },
    ShowSongName: {
        description: "Shows the song name instead of the artist in Spotify activity.",
    },
    Signature: {
        description: "Automatic signature/footer text.",
        options: {
            signature: "The signature appended to the end of your messages.",
            header: "Header text added before the signature.",
            showChatBarIcon: "Show an icon in the chat bar to toggle the plugin.",
            addContextMenu: "Add a context menu option to toggle the signature.",
            enabled: "Toggle the signature on or off.",
        },
    },
    SilenceUsers: {
        description: "Mutes @mention alerts and server badge counters from specified users. Normal messages and DMs are unaffected.",
        options: {
            mutedUserIds: "User IDs to silence.",
        },
    },
    Snowfall: {
        description: "Makes it snow on Discord.",
        options: {
            typeOfSnow: "Type of snowflakes.",
            maxSize: "Maximum snowflake size.",
            speed: "Snowfall speed.",
            flakesPerSecond: "Number of snowflakes per second.",
        },
    },
    Soggy: {
        description: "Adds a Soggy button to the toolbox.",
        options: {
            songVolume: "Volume of the Soggy song.",
            boopVolume: "Volume of the boop sound.",
            tooltipText: "Tooltip text for the Soggy button.",
            imageLink: "URL of the Soggy image.",
            songLink: "URL of the Soggy song.",
            boopLink: "URL of the boop sound.",
        },
    },
    SongLink: {
        description: "Adds streaming service buttons below song links.",
        options: {
            servicesSettings: "Which streaming services to show buttons for.",
            userCountry: "Your country for regional availability.",
            includeMetadata: "Include song metadata in the link.",
        },
    },
    SongSpotlight: {
        description: "Displays songs you're listening to on your profile.",
    },
    SplitLargeMessages: {
        description: "Splits long messages into multiple parts to fit Discord's message limit.",
        options: {
            maxLength: "Maximum message length before splitting. Set to 0 for auto-detection.",
            disableFileConversion: "When enabled, disables file conversion for long messages.",
            sendDelay: "Delay between each part in seconds.",
            hardSplit: "When enabled, splits at the last character instead of the last space/newline.",
            splitInSlowmode: "Whether to split messages if slowmode is enabled in the channel.",
            slowmodeMax: "Maximum slowmode delay when splitting in slowmode.",
        },
    },
    SpotifyActivityToggle: {
        description: "Adds a toggle to show/hide Spotify activity.",
        options: {
            location: "Where to show the Spotify activity toggle button.",
        },
    },
    StatusPresets: {
        description: "Lets you save your statuses and apply them later.",
        options: {
            StatusPresets: "Saved status presets.",
        },
    },
    StatusWhileActive: {
        description: "Automatically updates your online status when you join a voice channel.",
        options: {
            statusToSet: "Status to set when you join a voice channel.",
        },
    },
    SteamStatusSync: {
        description: "Sync your status with Steam! (Online, Away, Invisible, or Offline.)",
        options: {
            onlineStatus: "Discord status to sync when Steam is Online.",
            idleStatus: "Discord status to sync when Steam is Away.",
            dndStatus: "Discord status to sync when Steam is Busy.",
            invisibleStatus: "Discord status to sync when Steam is Invisible.",
            goInvisibleIfActivityIsHidden: "Go invisible if the activity is hidden.",
        },
    },
    StickerBlocker: {
        description: "Lets you block stickers from being displayed.",
    },
    Streaks: {
        description: "Shows a streak counter next to a user when you exchange DMs with them daily.",
    },
    StreamingCodecDisabler: {
        description: "Disable streaming codecs of your choice.",
        options: {
            disableAv1Codec: "Disable the AV1 codec.",
            disableH265Codec: "Disable the H.265 codec.",
            disableH264Codec: "Disable the H.264 codec.",
            disableVP8Codec: "Disable the VP8 codec.",
            disableVP9Codec: "Disable the VP9 codec.",
        },
    },
    TalkInReverse: {
        description: "Reverses the content of your message before sending.",
    },
    ThemeLibrary: {
        description: "A theme library for Vencord.",
    },
    TidalEmbeds: {
        description: "Embeds TIDAL songs for in-Discord playback.",
    },
    TiktokTTS: {
        description: "Adds a context-menu option to read chat messages aloud using TikTok TTS. :sob:",
    },
    Timezones: {
        description: "Displays users' local time in profiles and message headers.",
        options: {
            showOwnTimezone: "Show your own timezone.",
            use24HourTime: "Use 24-hour time format.",
            showTimezoneInfo: "Show timezone info in profiles.",
            showMessageHeaderTime: "Show local time in message headers.",
            showProfileTime: "Show local time in profile popouts.",
            useDatabase: "Use the timezone database.",
            preferDatabaseOverLocal: "Prefer database timezone over local setting.",
            databaseUrl: "URL of the timezone database.",
            setDatabaseTimezone: "Set your timezone in the database.",
            resetDatabaseTimezone: "Reset your timezone in the database.",
            askedTimezone: "Whether you've been asked to set a timezone.",
        },
    },
    Title: {
        description: "Replaces the window title prefix.",
        options: {
            title: "Window title prefix.",
        },
    },
    ToastNotifications: {
        description: "Shows popup toast notifications, configurable for DMs, groups, friends, and server channels.",
        options: {
            position: "Where notifications appear on screen.",
            timeout: "How long notifications stay visible (in seconds).",
            opacity: "Notification opacity.",
            maxNotifications: "Maximum number of notifications shown at once.",
            disableInStreamerMode: "Disable notifications in streamer mode.",
            respectDoNotDisturb: "Respect Do Not Disturb status.",
            directMessages: "Show notifications for direct messages.",
            groupMessages: "Show notifications for group messages.",
            friendServerNotifications: "Show notifications for friends' server messages.",
            ignoreUsers: "Users to ignore notifications from.",
            notifyFor: "Which types of messages trigger notifications.",
            exampleButton: "Show an example notification.",
        },
    },
    ToggleVideoBind: {
        description: "Adds a customizable shortcut to toggle the camera.",
    },
    ToneIndicators: {
        description: "Shows tooltips for tone indicators like /srs, /gen, etc. on sent messages.",
        options: {
            prefix: "Prefix characters for tone indicators.",
            customIndicators: "Custom tone indicators to add.",
        },
    },
    "Translate+": {
        description: "Vencord's translation plugin with support for technical languages!",
    },
    TriviaAI: {
        description: "A plugin that helps you answer trivia questions using AI.",
    },
    UnitConverter: {
        description: "Converts metric units to imperial and vice versa.",
        options: {
            myUnits: "The unit system you use and want conversions shown in.",
        },
    },
    UniversalMention: {
        description: "Mention any user regardless of channel access permissions.",
        options: {
            globalMention: "Mention users from any server, not just the current one.",
            onlyDMUsers: "Only show users you have exchanged direct messages with.",
        },
    },
    UnlimitedAccounts: {
        description: "Increases the maximum number of accounts you can add.",
    },
    UnreadCountBadge: {
        description: "Shows unread message count badges on channels in the channel list.",
    },
    UserAreaAPI: {
        description: "API for adding buttons to the user area panel.",
    },
    UrlHighlighter: {
        description: "Highlights URLs in messages that match your custom patterns.",
        options: {
            patterns: "URL patterns to highlight.",
            boldUrls: "Bold matched URLs.",
            highlightEmbeds: "Also highlight embed URLs.",
        },
    },
    UserPFP: {
        description: "Lets you use an animated profile picture without Nitro.",
    },
    UserpluginInstaller: {
        description: "Install user plugins with a single button click.",
    },
    VcNarratorCustom: {
        description: "Announces when users join, leave, or move between voice channels using a narrator via TikTok TTS. Revived and back again.",
        options: {
            customVoice: "TikTok TTS voice to use.",
            volume: "Narrator volume.",
            rate: "Narrator speech rate.",
            sayOwnName: "Announce your own name.",
            ignoreSelf: "Ignore your own joins/leaves.",
            latinOnly: "Only announce Latin-script names.",
            joinMessage: "Message template for join announcements.",
            leaveMessage: "Message template for leave announcements.",
            moveMessage: "Message template for move announcements.",
            announceOthersMute: "Announce when others mute/unmute.",
            announceOthersDeafen: "Announce when others deafen/undeafen.",
            announceOthersStream: "Announce when others start/stop streaming.",
            announceSelfStream: "Announce when you start/stop streaming.",
            stateChangeCooldownMs: "Cooldown between state-change announcements (ms).",
            userVoiceMap: "Custom voice assignments per user.",
            stateChangeFilterMode: "Which users to announce state changes for.",
            stateChangeFilterList: "User list for state-change filtering.",
            ignoredUsers: "Users to never announce.",
            joinLeaveTimeout: "Timeout between join/leave announcements (seconds).",
            troubleshooting: "Show troubleshooting options.",
        },
    },
    VCPanelSettings: {
        description: "Control voice settings directly from the voice panel.",
        options: {
            uncollapseSettingsByDefault: "Show settings expanded by default.",
            outputVolume: "Show output volume slider.",
            inputVolume: "Show input volume slider.",
            outputDevice: "Show output device selector.",
            inputDevice: "Show input device selector.",
            camera: "Show camera toggle.",
            showOutputVolumeHeader: "Show header for output volume.",
            showInputVolumeHeader: "Show header for input volume.",
            showOutputDeviceHeader: "Show header for output device.",
            showInputDeviceHeader: "Show header for input device.",
            showVideoDeviceHeader: "Show header for video device.",
        },
    },
    ViewRawVariant: {
        description: "View or copy the raw content of any message, channel, or server from the right-click menu.",
    },
    VoiceButtons: {
        description: "Send a DM, mute, or deafen any user directly from the voice call panel.",
    },
    VoiceChannelLog: {
        description: "Logs voice channel activity including joins, leaves, deafens, mutes, cameras, streams, and more.",
    },
    VoiceChatUtilities: {
        description: "Lets you perform bulk actions on a whole voice channel (move, mute, disconnect, etc.).",
        options: {
            waitAfter: "Wait after each action.",
            waitSeconds: "Seconds to wait between actions.",
        },
    },
    VoiceJoinMessages: {
        description: "Receive temporary client-side messages when your friends join voice channels.",
        options: {
            friendDirectMessages: "Receive join notifications via friend DMs.",
            friendDirectMessagesShowMembers: "Show other members in the voice channel when receiving a friend join DM.",
            friendDirectMessagesShowMemberCount: "Show the member count in the voice channel when receiving a friend join DM.",
            friendDirectMessagesSelf: "Receive notifications even when you are in the same voice channel as your friend.",
            friendDirectMessagesSilent: "Make friend join DMs silent.",
            allowedFriends: "Friend IDs to receive join messages from (comma or space separated).",
            ignoredFriends: "Friend IDs to never receive join messages from (comma or space separated).",
            ignoreBlockedUsers: "Don't send messages about blocked users joining/leaving/moving.",
        },
    },
    VoiceMessageTranscriber: {
        description: "Transcribes voice messages on-device using Whisper v3.",
    },
    VoiceRejoin: {
        description: "Automatically rejoins DM calls and server voice channels after Discord restarts.",
        options: {
            rejoinDelay: "Delay before rejoining the voice channel (in seconds).",
            rejoinTimeout: "Don't attempt to rejoin after this many seconds since disconnecting.",
            preventReconnectIfCallEnded: "Don't reconnect if the call ended or the voice channel is empty or gone.",
            applyOnlyToDms: "Only apply to DM calls.",
        },
    },
    VoiceStats: {
        description: "Shows how much time you've spent in voice channels with each user on their profile.",
    },
    WaitForSlot: {
        description: "Automatically joins a full voice channel when a slot becomes available.",
        options: {
            autoJoin: "Join the channel immediately when a slot opens instead of showing a notification.",
            notificationSound: "Play a sound when a slot becomes available.",
        },
    },
    WebpackTarball: {
        description: "Converts Discord's webpack sources into a tarball.",
    },
    WhitelistedEmojis: {
        description: "Adds the ability to disable all emoji in messages except those on your whitelist.",
        options: {
            defaultEmojis: "Hide default emoji from autocomplete except those on the whitelist.",
            serverEmojis: "Hide custom server emoji from autocomplete except those on the whitelist.",
            disableToasts: "Do not show toast notifications when adding or removing emoji.",
            whiteListedEmojis: "Emoji currently on the whitelist.",
            exportEmojis: "Export the whitelist.",
            importEmojis: "Import the whitelist.",
            resetEmojis: "Reset the whitelist.",
        },
    },
    WhosWatching: {
        description: "Hover over the screen-share icon to see which users are watching your stream.",
        options: {
            showPanel: "Show viewers below the screen-share panel.",
        },
    },
    WigglyText: {
        description: "Adds a new Markdown format that makes text wiggle.",
        options: {
            intensity: "Wiggle intensity in pixels.",
        },
    },
    WriteUpperCase: {
        description: "Capitalizes the first letter of each sentence in the message input.",
        options: {
            excludedWords: "Words that should not be capitalized (comma-separated).",
        },
    },
    ConcatenatedModules: {
        description: "Extracts modules that were concatenated by the bundler.",
    },
    ZipPreview: {
        description: "Previews the contents of ZIP files directly inside message attachments.",
    },

    // ── src/plugins (arabized Vencord/Equicord built-ins) ───────────────────

    AccountPanelServerProfile: {
        description: "Shows the server profile instead of the global profile when clicking the account panel.",
        options: {
            prioritizeServerProfile: "Prioritize the server profile when left-clicking your account panel.",
        },
    },
    BadgeAPI: {
        description: "API for adding badges to users.",
    },
    AlwaysAnimate: {
        description: "Always animate avatars and animated emoji, even without Nitro.",
        options: {
            icons: "Always animate server icons, avatars, and decorations.",
            statusEmojis: "Always animate status emojis.",
            serverBanners: "Always animate server banners.",
            nameplates: "Always animate nameplates.",
            roleGradients: "Always animate role gradients.",
        },
    },
    AlwaysExpandRoles: {
        description: "Automatically expands the role list in user profiles.",
        options: {
            hideArrow: "Hide the expand arrow.",
        },
    },
    AlwaysTrust: {
        description: "Removes verification prompts and warning dialogs when opening external links or downloading files.",
        options: {
            domain: "Remove the warning popup when opening links from untrusted domains.",
            file: "Remove the 'Potentially dangerous download' popup when opening links.",
            noDeleteSafety: "Remove the server name input requirement when deleting it.",
            confirmModal: "Show a 'Are you sure you want to delete?' confirmation modal.",
        },
    },
    AnonymiseFileNames: {
        description: "Assigns random names to files before uploading.",
        options: {
            anonymiseByDefault: "Anonymise file names by default.",
            spoilerMessages: "Add a spoiler prefix to messages.",
            method: "Anonymisation method.",
            randomisedLength: "Random characters length.",
            consistent: "Fixed file name.",
        },
    },
    AppleMusicRichPresence: {
        description: "Displays your Apple Music activity as a status.",
        options: {
            activityType: "Activity type displayed.",
            showInMemberList: "Show track/artist name in the members list.",
            refreshRate: "Time between activity updates (in seconds).",
            enableTimestamps: "Toggle timestamps on or off.",
            enableButtons: "Toggle buttons on or off.",
            nameFormat: "Activity name format text.",
            detailsFormat: "Activity details format text.",
            stateFormat: "Activity state format text.",
            largeImageType: "Large image type in activity assets.",
            largeTextFormat: "Large text format in activity assets.",
            smallImageType: "Small image type in activity assets.",
            smallTextFormat: "Small text format in activity assets.",
        },
    },
    WebRichPresence: {
        description: "Adds an arRPC client to enable RPC on Discord Web (experimental).",
    },
    AutoDNDWhilePlaying: {
        description: "Automatically sets your status to Do Not Disturb while playing a game.",
        options: {
            statusToSet: "The status to set while playing a game.",
            excludeInvisible: "Prevent automatic status changes when your status is set to invisible.",
        },
    },
    BetterGifAltText: {
        description: "Changes the Alt Text of GIFs from just 'GIF' to include the GIF tags or file name.",
    },
    BetterFolders: {
        description: "Adds improvements to server folders.",
        options: {
            sidebar: "Show servers from a folder in a dedicated sidebar.",
            sidebarAnim: "Animate opening the folder sidebar.",
            closeAllFolders: "Close all folders when selecting a server not in any folder.",
            closeAllHomeButton: "Close all folders when clicking the home button.",
            closeOthers: "Close other folders when opening a folder.",
            closeServerFolder: "Close the folder when selecting a server inside it.",
            forceOpen: "Force the folder to open when navigating to a server inside it.",
            enableNestedFolders: "Allow folders to be nested inside each other via drag and drop.",
            keepIcons: "Keep showing server icons in the main server bar when the BetterFolders sidebar is open.",
            showFolderIcon: "Show the folder icon above folder servers in the BetterFolders sidebar.",
        },
    },
    BetterGifPicker: {
        description: "Improves the GIF picker and adds category filtering.",
        options: {
            keepOpen: "Keep the GIF picker open after selecting a GIF.",
        },
    },
    BetterRoleContext: {
        description: "Adds extra options to role context menus.",
        options: {
            roleIconFileFormat: "File format to use when saving role icons.",
        },
    },
    BetterRoleDot: {
        description: "Replaces the role dot color in names with custom role emoji.",
        options: {
            bothStyles: "Show both the role dot and the role emoji.",
            copyRoleColorInProfilePopout: "Add a copy button for role colors in the profile popout.",
        },
    },
    BetterSettings: {
        description: "Improves the Discord settings UI with visual effects.",
        options: {
            disableFade: "Disable the fade-in animation in the settings panel.",
            organizeMenu: "Organize the Vencord settings in the menu.",
            eagerLoad: "Load the settings panel eagerly to reduce lag.",
        },
    },
    BetterSessions: {
        description: "Improves the sessions page and adds identifiers.",
        options: {
            backgroundCheck: "Check for suspicious sessions in the background and send a notification.",
            checkInterval: "How often to check for suspicious sessions (in minutes).",
        },
    },
    BetterUploadButton: {
        description: "Single click to upload a file, right-click to open the menu.",
    },
    BiggerStreamPreview: {
        description: "Allows enlarging stream previews in Discord.",
    },
    BlurNSFW: {
        description: "Automatically blurs NSFW images and videos.",
        options: {
            blurAmount: "Blur amount for NSFW content.",
            blurAllChannels: "Blur all channels marked as NSFW.",
        },
    },
    CallTimer: {
        description: "Adds a timer to voice calls.",
        options: {
            format: "Compact or human-readable format.",
            allCallTimers: "Add a call timer for all users in a server voice channel.",
            showWithoutHover: "Always show the timer without needing to hover over it.",
            showRoleColor: "Show the user's role color (if the RoleColorEverywhere plugin is enabled).",
            trackSelf: "Also track your own join time.",
            showSeconds: "Show seconds in the timer.",
            watchLargeGuilds: "Track users in large servers. May cause lag if you are in many large servers with active voice users.",
        },
    },
    CharacterCounter: {
        description: "Adds a character counter to the message input box.",
        options: {
            colorEffects: "Show color effects when approaching or exceeding the character limit.",
        },
    },
    ChatInputButtonAPI: {
        description: "API for adding buttons to the chat input box.",
    },
    ClearURLs: {
        description: "Automatically removes tracking elements from links you send.",
    },
    ClientTheme: {
        description: "Recreates the old theme experience. Add a custom color to your Discord theme.",
    },
    ColorSighted: {
        description: "Removes the custom color-blind status icons, as they were in Discord between 2015–2017.",
    },
    CommandsAPI: {
        description: "API required for all plugins that use commands.",
    },
    ConcatenatedComponentExtractor: {
        description: "Extracts components bundled together by the bundler.",
    },
    ConsoleJanitor: {
        description: "Hides useless log messages from the console.",
        options: {
            disableLoggers: "Disable Discord's internal loggers entirely.",
            disableSpotifyLogger: "Disable Spotify's internal logger.",
            whitelistedLoggers: "Loggers to always show even when others are hidden.",
            allowLevel: "Log level to allow (messages below this level will be hidden).",
        },
    },
    ConsoleShortcuts: {
        description: "Adds shorter aliases for many things on the window. Run `shortcutList` to see the list.",
    },
    CopyEmojiMarkdown: {
        description: "Adds an option to copy the raw emoji format.",
        options: {
            copyUnicode: "Copy the raw Unicode character instead of the emoji markup for standard emoji.",
        },
    },
    ContextMenuAPI: {
        description: "API for adding and removing items from context menus.",
    },
    CopyFileContents: {
        description: "Adds a button on text file attachments to copy their contents.",
    },
    CopyStickerLinks: {
        description: "Adds the ability to copy and open sticker links.",
    },
    CopyUserURLs: {
        description: "Adds a 'Copy User URL' option to the user context menu.",
    },
    CrashHandler: {
        description: "Handles Discord crashes and allows recovery.",
        options: {
            attemptToPreventCrashes: "Attempt to prevent Discord from crashing.",
            attemptToNavigateToHome: "Attempt to navigate to the home page when a crash is detected.",
        },
    },
    CustomCommands: {
        description: "Adds custom commands to replace text in your messages.",
    },
    CustomIdle: {
        description: "Allows setting a custom timeout for switching to idle status.",
        options: {
            idleTimeout: "Time before switching to idle status (in minutes). Set to 0 to use Discord's default.",
            remainInIdle: "Stay in idle status when coming back to Discord after becoming idle.",
        },
    },
    CustomRPC: {
        description: "Adds a fully customizable Rich Presence activity to your Discord profile.",
    },
    Dearrow: {
        description: "Improves YouTube titles and thumbnails using DeArrow.",
        options: {
            hideButton: "Hide the DeArrow button from embedded YouTube videos.",
            replaceElements: "Choose which elements to replace in the embed.",
            dearrowByDefault: "Apply DeArrow to videos automatically.",
        },
    },
    Decor: {
        description: "Create and use custom avatar decorations, or choose from ready-made templates.",
    },
    DevCompanion: {
        description: "Vencord developer tool for debugging.",
        options: {
            notifyOnAutoConnect: "Show a notification when DevCompanion auto-connects.",
            usePatchedModule: "Use the patched module in DevCompanion.",
            reloadAfterToggle: "Automatically reload Discord after toggling a plugin.",
        },
    },
    DisableCallIdle: {
        description: "Prevents automatic removal from a DM voice call after 3 minutes and being moved to the AFK channel.",
    },
    DontRoundMyTimestamps: {
        description: "Always rounds relative timestamps down, so 7.6 years becomes 7 years instead of 8.",
    },
    DynamicImageModalAPI: {
        description: "Lets you ignore width or height when opening the image modal.",
    },
    Experiments: {
        description: "Enables access to Discord's experimental developer features.",
        options: {
            toolbarDevMenu: "Add a developer menu to the Discord toolbar.",
        },
    },
    ExpressionCloner: {
        description: "Allows cloning emoji and stickers to your server (right-click them).",
    },
    F8Break: {
        description: "Pauses the app when F8 is pressed with DevTools open.",
    },
    FakeNitro: {
        description: "Allows sending paid emoji, stickers, and streaming in Nitro quality.",
        options: {
            enableEmojiBypass: "Allow sending emoji from servers you are not in.",
            emojiSize: "Size of emojis when sent as images.",
            transformEmojis: "Transform emoji in messages to display them.",
            enableStickerBypass: "Allow sending stickers you do not own.",
            stickerSize: "Size of stickers when sent as images.",
            transformStickers: "Transform stickers in messages to display them.",
            transformCompoundSentence: "Transform emoji in compound sentences (e.g. 'Hello :emoji: World').",
            enableStreamQualityBypass: "Allow streaming in high quality without Nitro.",
            useStickerHyperLinks: "Send stickers as hyperlinks when no other bypass can be used.",
            useEmojiHyperLinks: "Send emojis as hyperlinks when no other bypass can be used.",
            hyperLinkText: "Text to use for hyperlinks.",
            disableEmbedPermissionCheck: "Disable the permission check for embeds.",
        },
    },
    FakeProfileThemes: {
        description: "Customizes profile colors using invisible 3y3 encoding.",
        options: {
            nitroFirst: "Display Nitro gradient theme over custom theme if the user has Nitro.",
        },
    },
    FavoriteEmojiFirst: {
        description: "Shows your favorite emoji at the top of the emoji list.",
        options: {
            aliases: "Aliases to add to favorite emoji.",
            clearAll: "Clear all emoji aliases.",
        },
    },
    FavoriteGifSearch: {
        description: "Allows searching within favorite GIFs.",
        options: {
            searchOption: "The GIF attribute to search by.",
        },
    },
    FixCodeblockGap: {
        description: "Removes the extra gap between code blocks and the text below them.",
    },
    FixImagesQuality: {
        description: "Restores images to the highest possible resolution.",
        options: {
            originalImagesInChat: "Also show original (non-resized) images in chat.",
        },
    },
    FixSpotifyEmbeds: {
        description: "Fixes the Spotify session expiry issue in embeds.",
        options: {
            volume: "The volume percentage for Spotify embeds.",
        },
    },
    FixYoutubeEmbeds: {
        description: "Fixes the preview of embedded YouTube videos.",
        options: {
            youtubeDescription: "Show the YouTube description in the embed.",
        },
    },
    ForceOwnerCrown: {
        description: "Always shows the owner crown next to their name, even in large servers.",
    },
    FriendInvites: {
        description: "Create and manage friend invite links via slash commands.",
    },
    FriendsSince: {
        description: "Shows when you became friends with a user in their profile popup.",
    },
    FullSearchContext: {
        description: "Adds all message context menu options to search results.",
    },
    FullUserInChatbox: {
        description: "Adds extra functions to user mentions in the chat input box, like left and right click.",
    },
    GameActivityToggle: {
        description: "Adds a button to quickly toggle game activity on or off.",
        options: {
            oldIcon: "Use the old game activity toggle icon.",
            location: "Where to show the game activity toggle button.",
        },
    },
    GifPaste: {
        description: "Makes selecting a GIF paste its link in the chat box instead of sending it immediately.",
    },
    GreetStickerPicker: {
        description: "Improves the greeting sticker picker.",
        options: {
            greetMode: "Greet mode: always show stickers, or show them only for the first message.",
        },
    },
    HideMedia: {
        description: "Hides attachments and embeds for specific messages via a button that appears on hover.",
    },
    ILoveSpam: {
        description: "Does not hide messages from users suspected of sending spam.",
    },
    ImageFilename: {
        description: "Shows the original filename instead of a modified one.",
        options: {
            showFullUrl: "Show the full URL instead of just the filename.",
        },
    },
    ImageLink: {
        description: "Does not hide image links in messages even if they are the only content.",
    },
    ImageZoom: {
        description: "Allows zooming images by dragging and panning.",
        options: {
            saveZoomValues: "Save zoom and lens size values between sessions.",
            invertScroll: "Invert the scroll direction when zooming.",
            nearestNeighbour: "Use nearest-neighbour (pixelated) rendering when zoomed in.",
            square: "Use a square zoom lens.",
            zoom: "Zoom level.",
            size: "Lens size.",
            zoomSpeed: "How fast to zoom in and out.",
        },
    },
    ImplicitRelationships: {
        description: "Adds unofficial DM channels to the friends list.",
        options: {
            sortByAffinity: "Sort implicit relationships by affinity (how frequently you interact).",
        },
    },
    IgnoreActivities: {
        description: "Allows ignoring specific activities from showing in your status.",
        options: {
            importCustomRPC: "Import the current custom RPC as an ignored activity.",
            listMode: "Whether to use the list as a blacklist (ignore listed) or whitelist (only show listed).",
            idsList: "Activity IDs to ignore or allow.",
            ignorePlaying: "Ignore games with PLAYING status.",
            ignoreStreaming: "Ignore streams with STREAMING status.",
            ignoreListening: "Ignore music with LISTENING status.",
            ignoreWatching: "Ignore videos with WATCHING status.",
            ignoreCompeting: "Ignore events with COMPETING status.",
            ignoredActivities: "Activities manually added to the ignored list.",
        },
    },
    IrcColors: {
        description: "Adds IRC colors to messages.",
        options: {
            lightness: "Color lightness adjustment.",
            memberListColors: "Apply IRC colors in the member list.",
            applyColorOnlyToUsersWithoutColor: "Only apply IRC colors to users who have no role color.",
            applyColorOnlyInDms: "Only apply IRC colors in DMs.",
        },
    },
    KeepCurrentChannel: {
        description: "Attempts to return to the channel you were in before switching accounts or restarting Discord.",
    },
    LastFMRichPresence: {
        description: "Shows what you're listening to on Last.fm as a status.",
        options: {
            apiKey: "Your Last.fm API key.",
            username: "Your Last.fm username.",
            shareUsername: "Show your Last.fm profile button in your status.",
            clickableLinks: "Make album and song titles clickable.",
            hideWithSpotify: "Hide Last.fm presence if Spotify is running.",
            hideWithActivity: "Hide Last.fm presence if you have another activity.",
            statusName: "Custom activity status name.",
            statusDisplayType: "What to show in the status — artist, album, or track.",
            nameFormat: "How to format the activity name.",
            useListeningStatus: "Use LISTENING status type instead of PLAYING.",
            missingArt: "What to show when album art is missing.",
            showLastFmLogo: "Show the Last.fm logo as the small image.",
            showAlbumCover: "Show the album cover as the large image.",
        },
    },
    LoadingQuotes: {
        description: "Changes the loading screen quotes.",
        options: {
            replaceEvents: "Also replace event-related loading quotes.",
            enablePluginPresetQuotes: "Enable the preset quotes added by plugins.",
            enableDiscordPresetQuotes: "Enable Discord's default preset quotes.",
            additionalQuotes: "Additional custom quotes to show on the loading screen.",
            additionalQuotesDelimiter: "Delimiter used between custom quotes.",
        },
    },
    MemberCount: {
        description: "Shows the member count of a server and channel.",
        options: {
            toolTip: "Show member count in the channel tooltip.",
            memberList: "Show member count in the member list.",
            voiceActivity: "Show voice activity counts.",
        },
    },
    MemberListDecoratorsAPI: {
        description: "API for adding decorators to member list entries in servers and DMs.",
    },
    MentionAvatars: {
        description: "Adds avatars next to mentions in messages.",
        options: {
            showAtSymbol: "Show the @ symbol before the username in mentions.",
        },
    },
    MessageClickActions: {
        description: "Adds actions when clicking on messages.",
        options: {
            singleClickAction: "Action on single click (your messages).",
            singleClickModifier: "Modifier required for single click (your messages).",
            singleClickOthersAction: "Action on single click (others' messages).",
            singleClickOthersModifier: "Modifier required for single click (others' messages).",
            doubleClickAction: "Action on double click (your messages).",
            doubleClickOthersAction: "Action on double click (others' messages).",
            doubleClickModifier: "Modifier required for double click.",
            tripleClickAction: "Action on triple click.",
            tripleClickModifier: "Modifier required for triple click.",
            reactEmoji: "Emoji to use for reaction actions.",
            addAdditionalReacts: "Also add custom emoji as reaction actions.",
            additionalReactEmojis: "Additional custom emoji for reaction actions.",
            disableInDms: "Disable all click actions in DMs.",
            disableInSystemDms: "Disable all click actions in system messages.",
            clickTimeout: "Timeout to distinguish between double and triple clicks (ms).",
            doubleClickHoldThreshold: "Maximum press duration for double click (ms). Longer presses allow text selection.",
            deferDoubleClickForTriple: "Delay double click to allow triple-click actions (disables triple click when off).",
            selectionHoldTimeout: "Timeout to allow text selection (ms).",
            quoteWithReply: "When quoting, also reply to the message.",
            useSelectionForQuote: "When quoting, use selected text if available.",
        },
    },
    MessageLatency: {
        description: "Shows an indicator for messages that took ≥n seconds to send.",
        options: {
            latency: "Minimum latency threshold to show an indicator (in seconds).",
            detectDiscordKotlin: "Detect messages sent from the Discord Android app.",
            showMillis: "Show milliseconds in the latency indicator.",
            ignoreSelf: "Do not show the indicator for your own messages.",
        },
    },
    MessageLinkEmbeds: {
        description: "Adds a preview for message links wrapped in <>.",
        options: {
            messageBackgroundColor: "Use the message background color in embeds.",
            automodEmbeds: "Display auto-moderation embeds without requiring a click.",
            listMode: "Whether to use the list as a blacklist or whitelist.",
            idList: "List of channel or server IDs to blacklist or whitelist.",
            clearMessageCache: "Clear the cached message data.",
        },
    },
    MessageLogger: {
        description: "Saves deleted and edited messages.",
        options: {
            deleteStyle: "How to display deleted messages.",
            logDeletes: "Log deleted messages.",
            collapseDeleted: "Collapse deleted messages by default.",
            logEdits: "Log message edits.",
            inlineEdits: "Show edits inline instead of below the message.",
            ignoreBots: "Ignore messages from bots.",
            ignoreSelf: "Ignore your own messages.",
            ignoreSelfEdits: "Ignore your own message edits.",
            ignoreUsers: "User IDs to ignore.",
            ignoreChannels: "Channel IDs to ignore.",
            ignoreGuilds: "Server IDs to ignore.",
            showEditDiffs: "Show a diff between the original and edited message.",
            separatedDiffs: "Show the diff in a separate section.",
        },
    },
    MessageAccessoriesAPI: {
        description: "API for adding accessories to messages.",
    },
    MessageDecorationsAPI: {
        description: "API for adding decorations to messages.",
    },
    MessageEventsAPI: {
        description: "API required for all plugins that use message events.",
    },
    MessagePopoverAPI: {
        description: "API for adding buttons to message popover menus.",
    },
    MessageUpdaterAPI: {
        description: "API for updating and re-rendering messages.",
    },
    MoreQuickReactions: {
        description: "Adds more quick reactions to the reaction picker.",
        options: {
            reactionCount: "Number of quick reactions to show.",
            frequentEmojis: "Show frequently used emoji first.",
            rows: "Number of rows in the reaction picker.",
            columns: "Number of columns in the reaction picker.",
            compactMode: "Use compact mode for the reaction picker.",
            scroll: "Allow scrolling through reactions.",
        },
    },
    MutualGroupDMs: {
        description: "Shows mutual group DMs in user profiles.",
    },
    NewGuildSettings: {
        description: "Automatically applies custom default settings to every new server you join.",
        options: {
            guild: "Default server notification setting.",
            messages: "Default message notification setting.",
            everyone: "Default @everyone notification setting.",
            role: "Default role mention notification setting.",
            highlights: "Default message highlights setting.",
            events: "Default server events notification setting.",
            showAllChannels: "Show all channels by default.",
            mobilePush: "Enable mobile push notifications by default.",
            voiceChannels: "Suppress voice channel join messages by default.",
        },
    },
    NicknameIconsAPI: {
        description: "API for adding icons next to names in profiles.",
    },
    NoBlockedMessages: {
        description: "Hides messages from blocked users completely.",
        options: {
            alsoHideIgnoredUsers: "Also hide messages from ignored users.",
            disableNotifications: "Disable notifications from blocked users.",
            allowAutoModMessages: "Allow AutoMod messages even from blocked users.",
            hideBlockedUserReplies: "Hide reply chains that reference a blocked user's message.",
            defaultHideUsers: "Hide blocked users from the member list by default.",
            overrideUsers: "User IDs to always show even if blocked.",
        },
    },
    NoDevtoolsWarning: {
        description: "Disables the 'HOLD UP' console warning and prevents Discord from hiding the token to avoid random sign-outs.",
    },
    NoF1: {
        description: "Disables the F1 help shortcut.",
    },
    NoMosaic: {
        description: "Removes the mosaic (grid) layout for multiple image attachments.",
        options: {
            inlineVideo: "Play videos inline instead of opening them in a lightbox.",
        },
    },
    NoOnboardingDelay: {
        description: "Skips the slow and annoying initial setup delay.",
    },
    NoPendingCount: {
        description: "Removes the counter badge on the pending requests icon.",
        options: {
            hideFriendRequestsCount: "Hide the friend request count badge.",
            hideMessageRequestsCount: "Hide the message request count badge.",
            hidePremiumOffersCount: "Hide the premium offers count badge.",
        },
    },
    NoProfileThemes: {
        description: "Removes Nitro themes from others' profiles while keeping yours.",
    },
    NoReplyMention: {
        description: "Automatically removes the mention ping from replies.",
        options: {
            userList: "Users to always or never ping when replying.",
            roleList: "Roles to always or never ping when replying.",
            shouldPingListed: "If enabled, listed users/roles are always pinged; if disabled, they are never pinged.",
            inverseShiftReply: "Swap the Shift+Enter reply behavior (ping by default when Shift is not held).",
        },
    },
    NoServerEmojis: {
        description: "Prevents Discord from converting emoji text to server emoji images.",
        options: {
            shownEmojis: "Which emoji to show: all, only animated, or none.",
        },
    },
    NoticesAPI: {
        description: "Prevents notices from being automatically dismissed.",
    },
    NoTrack: {
        description: "Disable Discord tracking (analytics/metrics), performance metrics, and Sentry crash reports.",
        options: {
            disableAnalytics: "Disable Discord's analytics/telemetry.",
        },
    },
    NoTypingAnimation: {
        description: "Disables the typing dots animation that consumes resources.",
    },
    NoUnblockToJump: {
        description: "Allows jumping to messages from blocked or ignored users without having to unblock them.",
    },
    NotificationVolume: {
        description: "Allows adjusting the notification volume independently.",
        options: {
            notificationVolume: "Volume for Discord notifications (0–100%).",
        },
    },
    OnePingPerDM: {
        description: "Sends only one notification per DM conversation.",
        options: {
            channelToAffect: "Whether to apply this to DMs, group DMs, or both.",
            allowMentions: "Always notify on direct mentions.",
            allowEveryone: "Always notify on @everyone mentions.",
            ignoreUsers: "User IDs to always notify for.",
            alwaysPlaySound: "Always play a sound even if the tab is focused.",
        },
    },
    OpenInApp: {
        description: "Opens external app links directly in their respective apps.",
        options: {
            spotify: "Open Spotify links in the Spotify app.",
            steam: "Open Steam links in the Steam app.",
            epic: "Open Epic Games links in the Epic launcher.",
            tidal: "Open Tidal links in the Tidal app.",
            itunes: "Open iTunes/Apple Music links in the app.",
            vrcx: "Open VRChat links in VRCX.",
        },
    },
    OverrideForumDefaults: {
        description: "Allows customizing the default settings for forum channels.",
        options: {
            defaultLayout: "Default layout for forum channels.",
            defaultSortOrder: "Default sort order for forum channels.",
        },
    },
    PermissionFreeWill: {
        description: "Disables client-side permission checks when managing channel permissions.",
        options: {
            lockout: "Bypass the channel lockout check.",
            onboarding: "Bypass the onboarding requirement check.",
        },
    },
    PermissionsViewer: {
        description: "Shows server and role permissions in detail.",
        options: {
            permissionsSortOrder: "Sort order for permissions in the viewer.",
        },
    },
    PauseInvitesForever: {
        description: "Brings back the option to pause invites indefinitely that Discord removed.",
    },
    PetPet: {
        description: "Adds a /petpet command to create animated GIFs from any image.",
    },
    PictureInPicture: {
        description: "Adds Picture-in-Picture support for video attachments.",
        options: {
            loop: "Loop videos in Picture-in-Picture mode.",
        },
    },
    PinDMs: {
        description: "Allows pinning DM conversations to the top of the list.",
        options: {
            pinOrder: "How pinned DMs are sorted.",
            canCollapseDmSection: "Allow collapsing the pinned DMs section.",
            dmSectionCollapsed: "Collapse the pinned DMs section by default.",
        },
    },
    PlainFolderIcon: {
        description: "Hides the small server icons inside folders.",
    },
    PlatformIndicators: {
        description: "Shows an icon indicating the device the user is on next to their name.",
        options: {
            list: "Show platform indicators in the member list.",
            profiles: "Show platform indicators in profiles.",
            messages: "Show platform indicators next to usernames in messages.",
            colorMobileIndicator: "Color the mobile indicator.",
            showBots: "Show platform indicators for bots.",
        },
    },
    PreviewMessage: {
        description: "Allows previewing your message before sending it.",
    },
    QuickMention: {
        description: "Adds a quick mention button to the message action bar.",
    },
    QuickReply: {
        description: "Allows quick replies by pressing R without opening a menu.",
        options: {
            shouldMention: "Whether to mention the user when replying.",
            ignoreBlockedAndIgnored: "Skip blocked and ignored users when cycling through messages to reply.",
        },
    },
    ReadAllNotificationsButton: {
        description: "Read all server notifications with a single button click!",
    },
    ReactErrorDecoder: {
        description: "Translates React error codes into readable messages.",
    },
    RelationshipNotifier: {
        description: "Notifies you when removed from a friend list, group DM, or server.",
        options: {
            notices: "Show a notice at the top of the screen when removed.",
            offlineRemovals: "Notify you on startup if you were removed while offline.",
            friends: "Notify you when removed from someone's friend list.",
            friendRequestCancels: "Notify you when a friend request is cancelled.",
            servers: "Notify you when removed from a server.",
            groups: "Notify you when removed from a group DM.",
        },
    },
    ReplaceGoogleSearch: {
        description: "Replaces Google with another search engine in the search context menu.",
        options: {
            customEngineName: "Custom search engine name.",
            customEngineURL: "Custom search engine URL.",
            replacementEngine: "Search engine to replace Google with.",
        },
    },
    ReplyTimestamp: {
        description: "Shows the timestamp on reply message previews.",
    },
    ReverseImageSearch: {
        description: "Adds a reverse image search option to the context menu.",
    },
    RevealAllSpoilers: {
        description: "Reveal all spoilers by ctrl+clicking a spoiler, or in a message by ctrl+shift+clicking.",
    },
    ReviewDB: {
        description: "Rate other users (adds a reviews section to profiles).",
    },
    RoleColorEverywhere: {
        description: "Applies the role color to names in all places in Discord.",
        options: {
            chatMentions: "Apply role colors to mentions in chat.",
            memberList: "Apply role colors in the member list.",
            voiceUsers: "Apply role colors to users in voice channels.",
            reactorsList: "Apply role colors in the reactors list.",
            pollResults: "Apply role colors in poll results.",
            colorChatMessages: "Apply role colors to message text.",
            messageSaturation: "Saturation of the role color applied to messages.",
        },
    },
    SecretRingToneEnabler: {
        description: "Changes the Discord call ringtone.",
        options: {
            onlySnow: "Only use the secret ringtone during snowfall events.",
        },
    },
    SendTimestamps: {
        description: "Adds a command to send a formatted timestamp.",
        options: {
            replaceMessageContents: "Replace message text timestamps with formatted Discord timestamps on send.",
        },
    },
    ServerInfo: {
        description: "Adds a context menu option to view server information.",
        options: {
            sorting: "Sort order for the server info display.",
        },
    },
    ServerListAPI: {
        description: "API required for plugins that modify the server list.",
    },
    ServerListIndicators: {
        description: "Adds visual indicators in the server list.",
        options: {
            mode: "Which indicator mode to use.",
            useCompact: "Use compact indicators.",
        },
    },
    ShikiCodeblocks: {
        description: "Brings VSCode-style code blocks to Discord powered by Shiki.",
    },
    ShowAllMessageButtons: {
        description: "Always shows all message buttons without hovering.",
        options: {
            noShiftDelete: "Remove the shift requirement for the delete button.",
            noShiftPin: "Remove the shift requirement for the pin button.",
        },
    },
    ShowConnections: {
        description: "Shows linked accounts in the mini profile.",
        options: {
            iconSize: "Size of connection icons.",
            iconSpacing: "Spacing between connection icons.",
        },
    },
    ShowHiddenChannels: {
        description: "Shows hidden channels with an indicator that they cannot be accessed.",
        options: {
            channelStyle: "Visual style for hidden channels.",
            showMode: "What to show for hidden channels.",
            defaultAllowedUsersAndRolesDropdownState: "Default state of the allowed users/roles dropdown.",
        },
    },
    ShowHiddenThings: {
        description: "Shows hidden elements and admin-only features regardless of permissions.",
        options: {
            showTimeouts: "Show member timeout icons in chat.",
            showInvitesPaused: "Show the invites paused tooltip in the server list.",
            showModView: "Show the member mod view context menu item in all servers.",
        },
    },
    ShowMeYourName: {
        description: "Shows the original username next to the display name.",
        options: {
            messages: "Show usernames in messages.",
            replies: "Show usernames in reply previews.",
            mentions: "Show usernames in mentions.",
            typingIndicator: "Show usernames in the typing indicator.",
            memberList: "Show usernames in the member list.",
            profilePopout: "Show usernames in the profile popout.",
            voiceChannels: "Show usernames in voice channel user lists.",
        },
    },
    ShowTimeoutDuration: {
        description: "Shows timed-out users in the member list.",
        options: {
            displayStyle: "How to display the timeout duration.",
        },
    },
    SilentMessageToggle: {
        description: "Adds a button to toggle silent messages on or off.",
        options: {
            persistState: "Remember the silent message toggle state between sessions.",
            autoDisable: "Automatically disable silent messages after sending.",
        },
    },
    SilentTyping: {
        description: "Prevents your typing indicator from showing to others.",
        options: {
            enabledGlobally: "Enable or disable hiding your typing indicator globally.",
            hideChatBoxTypingIndicators: "Hide other users' typing indicators above the chat box.",
            hideMembersListTypingIndicators: "Hide other users' typing indicators in the member list.",
            chatIcon: "Show an icon in the chat bar to toggle the plugin while in use.",
            chatIconLeftClickAction: "What happens when left-clicking the chat icon.",
            chatIconMiddleClickAction: "What happens when middle-clicking the chat icon.",
            chatIconRightClickAction: "What happens when right-clicking the chat icon.",
            chatContextMenu: "Show a context menu in the chat bar to toggle plugin settings.",
            defaultHidden: "If enabled, your typing is hidden by default in all locations not listed in 'Enabled Locations'. If disabled, your typing is shown in all locations not listed in 'Disabled Locations'.",
            enabledLocations: "Enable the feature for these IDs. Accepts a comma-separated list of DM, channel, and server IDs. Only used when 'Hidden by Default' is disabled.",
            disabledLocations: "Disable the feature for these IDs. Accepts a comma-separated list of DM, channel, and server IDs. Only used when 'Hidden by Default' is enabled.",
        },
    },
    SortFriends: {
        description: "Sorts friend requests by date.",
        options: {
            showDates: "Show the date when friend requests were received.",
        },
    },
    SpotifyCrack: {
        description: "Improves the Spotify experience in Discord.",
        options: {
            noSpotifyAutoPause: "Disable Spotify auto-pause when playing audio in Discord.",
            keepSpotifyActivityOnIdle: "Keep the Spotify activity visible when idle.",
        },
    },
    SpotifyShareCommands: {
        description: "Share your current Spotify track, album, or artist via slash commands (/track, /album, /artist).",
    },
    StickerPaste: {
        description: "Makes selecting a sticker insert it into the chat box instead of sending it immediately.",
    },
    StreamerModeOn: {
        description: "Automatically enables streamer mode when you start streaming in Discord.",
    },
    Summaries: {
        description: "Allows viewing conversation summaries for long threads.",
        options: {
            summaryExpiryThresholdDays: "Number of days after which a summary expires and is hidden.",
        },
    },
    SuperReactionTweaks: {
        description: "Allows customizing super reactions.",
        options: {
            superReactByDefault: "Use super reactions by default.",
            unlimitedSuperReactionPlaying: "Remove the limit on simultaneously playing super reactions.",
            superReactionPlayingLimit: "Maximum number of super reactions playing at once (when unlimited is off).",
        },
    },
    SupportHelper: {
        description: "Helps us provide technical support to you.",
    },
    StartupTimings: {
        description: "Adds startup timings to the settings menu.",
    },
    TextReplace: {
        description: "Automatically replaces text while typing using custom rules.",
        options: {
            replace: "Whether text replacement is enabled.",
            stringRules: "String replacement rules.",
            regexRules: "Regex replacement rules.",
        },
    },
    ThemeAttributes: {
        description: "Adds data attributes to various elements for theme customization purposes.",
    },
    Translate: {
        description: "Translate messages using Google Translate, DeepL, or Kagi.",
    },
    TypingIndicator: {
        description: "Shows who is typing in other channels.",
        options: {
            includeCurrentChannel: "Show typing indicators for the current channel.",
            includeMutedChannels: "Show typing indicators for muted channels.",
            includeIgnoredUsers: "Show typing indicators for ignored users.",
            includeBlockedUsers: "Show typing indicators for blocked users.",
            indicatorMode: "Where to show the typing indicator.",
        },
    },
    TypingTweaks: {
        description: "Improves the typing indicator with avatars and names.",
        options: {
            showAvatars: "Show user avatars in the typing indicator.",
            showRoleColors: "Show role colors in the typing indicator.",
            alternativeFormatting: "Use alternative formatting for the typing indicator.",
            amITyping: "Show yourself in the typing indicator when you are typing.",
        },
    },
    USRBG: {
        description: "Adds a custom profile background via USRBG.",
        options: {
            nitroFirst: "Display Nitro gradient theme over USRBG background.",
            voiceBackground: "Use USRBG background in the voice channel panel.",
        },
    },
    Unindent: {
        description: "Removes leading indentation from code blocks.",
    },
    UnlockedAvatarZoom: {
        description: "Allows zooming avatars more than the usual limit.",
        options: {
            zoomMultiplier: "Avatar zoom multiplier.",
        },
    },
    UnsuppressEmbeds: {
        description: "Allows you to un-suppress embedded content in messages.",
    },
    UserMessagesPronouns: {
        description: "Adds pronouns to user messages in chat.",
    },
    UserSettingsAPI: {
        description: "Modifies Discord user settings to expose group and name.",
    },
    UserVoiceShow: {
        description: "Shows the voice channel a user is in on their profile.",
        options: {
            showInUserProfileModal: "Show the voice channel in the user profile modal.",
            showInMemberList: "Show the voice channel in the member list.",
            showInMessages: "Show the voice channel next to usernames in messages.",
        },
    },
    ValidReply: {
        description: "Fixes the 'message not found' error in replies.",
    },
    ValidUser: {
        description: "Adds user mention validation.",
    },
    VcNarrator: {
        description: "Announces when users join, leave, or move between voice channels using a narrator.",
        options: {
            volume: "Narrator volume.",
            rate: "Narrator speed.",
            sayOwnName: "Announce your own name.",
            latinOnly: "Remove non-Latin characters from names before announcing.",
            joinMessage: "Join message template.",
            leaveMessage: "Leave message template.",
            moveMessage: "Move message template.",
            muteMessage: "Mute message template (self only for now).",
            unmuteMessage: "Unmute message template (self only for now).",
            deafenMessage: "Deafen message template (self only for now).",
            undeafenMessage: "Undeafen message template (self only for now).",
        },
    },
    ViewIcons: {
        description: "Allows viewing server and user icons at full resolution.",
        options: {
            format: "File format to download icons in.",
            imgSize: "Resolution of the viewed icon.",
        },
    },
    ViewRaw: {
        description: "Shows the raw code of messages and embeds.",
    },
    VoiceDownload: {
        description: "Adds a download button for voice messages (opens a new browser tab).",
    },
    VoiceMessages: {
        description: "Adds the ability to send voice messages in any channel.",
        options: {
            noiseSuppression: "Enable noise suppression for voice messages.",
            echoCancellation: "Enable echo cancellation for voice messages.",
        },
    },
    VolumeBooster: {
        description: "Allows raising the volume above 200%.",
        options: {
            multiplier: "Volume multiplier (applied on top of Discord's maximum).",
        },
    },
    WebContextMenus: {
        description: "Restores the original context menus in the web version.",
        options: {
            addBack: "Re-add removed context menu entries.",
        },
    },
    WebKeybinds: {
        description: "Restores missing keyboard shortcuts in Discord Web: ctrl+t, ctrl+shift+t, ctrl+tab, ctrl+1-9, ctrl+,. Fully functional only on Vesktop/Legcord.",
    },
    WebScreenShareFixes: {
        description: "Removes the 2500kbps bitrate cap on Chromium clients and Vesktop.",
    },
    WhoReacted: {
        description: "Shows a list of who reacted to each reaction on hover.",
        options: {
            avatarClick: "Action when clicking a reactor's avatar.",
        },
    },
    XSOverlay: {
        description: "Supports the XSOverlay VR overlay.",
        options: {
            webSocketPort: "WebSocket port to connect to XSOverlay.",
            preferUDP: "Prefer UDP over WebSocket for communication.",
            botNotifications: "Send bot message notifications to XSOverlay.",
            serverNotifications: "Send server message notifications to XSOverlay.",
            dmNotifications: "Send DM notifications to XSOverlay.",
            groupDmNotifications: "Send group DM notifications to XSOverlay.",
            callNotifications: "Send call notifications to XSOverlay.",
            pingColor: "Color for ping/mention notifications.",
            channelPingColor: "Color for channel mention notifications.",
            soundPath: "Sound to play for XSOverlay notifications.",
            timeout: "How long notifications are shown (in seconds).",
            lengthBasedTimeout: "Scale notification duration based on message length.",
        },
    },
    YoutubeAdblock: {
        description: "Blocks ads in embedded YouTube videos and WatchTogether via AdGuard.",
    },
    Settings: {
        description: "Adds a settings UI and diagnostic information.",
        options: {
            settingsLocation: "Where to display the Equicord settings section.",
            includeVencordInfoWhenCopying: "Also copy Vencord info (Vencord, Electron, Chromium) when clicking the version info in the bottom-left corner of the settings page.",
        },
    },

    // ── userplugins ──────────────────────────────────────────────────────────

    BigFileUploadEnhanced: {
        description: "Bypass Discord's upload limit by uploading files to an external server and sharing the link in chat. Faster and uses no DOM manipulation.",
    },
    NitroSniper: {
        description: "Automatically redeems Nitro gift links sent in chat.",
        options: {
            notifyOnRedeem: "Show a notification when a Nitro code is successfully redeemed.",
            notifyOnFail: "Show a notification when a Nitro code fails to redeem.",
        },
    },
    BetterMicrophone: {
        description: "Lets you customize your microphone settings in much greater depth.",
    },
    FakeDeafen: {
        description: "Appear deafened to others while still hearing everything.",
    },
    GuildCopier: {
        description: "Copies roles, channels, emoji, stickers, and more from one server to another.",
        options: {
            copyRoles: "Copy roles from the original server.",
            copyChannels: "Copy channels and categories from the original server.",
            copyEmojis: "Copy emoji from the original server.",
            copyStickers: "Copy stickers from the original server.",
            copyBots: "Create a #bots-list channel with invite links for all bots in the original server.",
            emojiCount: "Maximum number of emoji to copy per type (PNG and GIF).",
            stickerCount: "Maximum number of stickers to copy.",
        },
    },
    MessageBookmarks: {
        description: "Save your favourite messages and jump to them with a single click.",
    },
    "VirusTotal-Scanner": {
        description: "Scan Discord attachments with the VirusTotal API — local SHA-256 fingerprinting, no data uploaded without your explicit request.",
    },
    CustomScreenSharePreview: {
        description: "Adds the ability to choose a custom image as your screen-share preview.",
    },
    Leash: {
        description: "Tethers a user to you by automatically moving them to the voice channel you join.",
        options: {
            enabled: "Enable the Leash plugin.",
            onlyWhenInVoice: "Only move the user when you are in a voice channel.",
            showNotifications: "Show notifications on move operations.",
        },
    },
    PhilsPluginLibrary: {
        description: "A library for Phil's plugins.",
    },
};
