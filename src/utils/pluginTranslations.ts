/*
 * Esharq — English translations for all arabized plugins.
 * Keys are the plugin's `name` field from definePlugin().
 * Absence of a key means the plugin already has an English description.
 */

export interface PluginI18n {
    description: string;
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
    },
    ArabicAutoUpdater: {
        description: "Automatically checks for Esharq updates and notifies you when a new version is available.",
    },
    AtSomeone: {
        description: "Mentions a random person in the channel.",
    },
    AutoZipper: {
        description: "Automatically compresses specified file types and folders before uploading to Discord.",
    },
    BannersEverywhere: {
        description: "Displays user banners in the member list.",
    },
    BaseDecoder: {
        description: "Decode Base64 content in any message and copy the decoded result.",
    },
    BetterActivities: {
        description: "Shows activity icons in the member list and allows viewing all activities.",
    },
    BetterAudioPlayer: {
        description: "Adds a visual spectrum analyser and oscilloscope to audio attachment players.",
    },
    BetterBanReasons: {
        description: "Create custom preset reasons for the ban dialog, or show a plain text field instead.",
    },
    BetterBlockedUsers: {
        description: "Allows searching the blocked users list and makes usernames copyable in settings.",
    },
    BetterCommands: {
        description: "Improves the slash command system with various enhancements.",
    },
    BetterInvites: {
        description: "Shows invite expiry, lets you view the invitee's profile and browse the server before joining by clicking the name.",
    },
    BetterPlusReacts: {
        description: "The number of + signs before :emoji: determines which message the reaction is added to.",
    },
    BlockKeywords: {
        description: "Hides messages containing user-specified keywords, as if the sender were blocked.",
    },
    BlockKrisp: {
        description: "Prevents Krisp noise suppression from loading.",
    },
    BypassPinPrompt: {
        description: "Bypasses the confirmation prompt when pinning or unpinning messages.",
    },
    BypassStatus: {
        description: "Continue receiving notifications from specific sources even in Do Not Disturb mode. Right-click users/channels/servers to configure bypass.",
    },
    ChannelBadges: {
        description: "Adds badges to channels based on their type.",
    },
    ChannelTabs: {
        description: "Browse your most-visited channels in browser-style tabs.",
    },
    CleanChannelName: {
        description: "Removes emoji and decorations from channel names; shows the original name when editing.",
    },
    CleanerChannelGroups: {
        description: "Hides all channels inside collapsed categories, even if they have unread messages.",
    },
    ClickableRoles: {
        description: "Makes roles in profiles and the member list clickable to see who has them.",
    },
    ClientSideBlock: {
        description: "Lets you hide nearly all content from any user locally.",
    },
    ClipsEnhancements: {
        description: "Adds extra frame-rate and duration options for clips, a custom length, RPC highlights, and more.",
    },
    CollapsibleUi: {
        description: "Makes the channel panel, member list, chat buttons, and user area collapsible.",
    },
    CommandPalette: {
        description: "Run actions quickly through a searchable command palette.",
    },
    ContentWarning: {
        description: "Lets you specify words that are automatically blurred. Hover or click blurred content to reveal it.",
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
    },
    CustomFolderIcons: {
        description: "Lets you customize folder icons with any PNG image.",
    },
    CustomSounds: {
        description: "Customize Discord's notification sounds.",
    },
    CustomStatusTimeouts: {
        description: "Adds customizable presets for status expiry duration in the presence menu.",
    },
    CustomTimestamps: {
        description: "Custom time formats for messages and tooltips.",
    },
    CustomUserColors: {
        description: "Lets you assign a custom color to any user anywhere. Works great with TypingTweaks and RoleColorEverywhere.",
    },
    Declutter: {
        description: "Tidies Discord by removing non-essential UI elements like profile effects, store tabs, support, and more.",
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
    },
    Equissant: {
        description: "Plays a croissant sound every N clicks. :trolley:",
    },
    ExitSounds: {
        description: "Plays soundboard sounds when you disconnect from voice.",
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
    },
    FontLoader: {
        description: "Loads any font from Google Fonts.",
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
    },
    FriendshipRanks: {
        description: "Adds badges showing how long you have been friends with a user.",
    },
    FullVcPfp: {
        description: "Makes the avatar fill the entire user tile in voice channels.",
    },
    Ghosted: {
        description: "Shows a ghost indicator if you haven't replied to their DMs.",
    },
    GifCollections: {
        description: "Lets you create and organize custom GIF collections.",
    },
    GithubRepos: {
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
    HideChatButtons: {
        description: "Lets you hide chat buttons.",
    },
    HideMessages: {
        description: "Temporarily hide messages until you restart.",
    },
    HideServers: {
        description: "Lets you hide servers from the guild list and Quick Switcher by right-clicking them.",
    },
    HomeTyping: {
        description: "Turns the home button into a typing indicator when someone is typing in your DMs.",
    },
    HopOn: {
        description: "Hop on! Opens a configurable link whenever a message in the current channel matches a custom regex.",
    },
    Husk: {
        description: "Adds a Husk button to the toolbox (see settings to change the emoji).",
    },
    IRememberYou: {
        description: "Locally saves everyone you've interacted with (including servers) as a backup in case of loss.",
    },
    IconViewer: {
        description: "Adds a new tab in settings to preview all icons.",
    },
    IdleAutoRestart: {
        description: "Automatically restarts the client after a configurable idle period, avoiding restarts while in voice.",
    },
    IgnoreCalls: {
        description: "Lets you ignore calls from specific users or group DMs.",
    },
    InRole: {
        description: "See who has a given role via the context menu or /inrole command (read plugin info!).",
    },
    Ingtoninator: {
        description: "Appends 'ington' to a random word in your message.",
    },
    InstantScreenshare: {
        description: "Instantly starts screen sharing when you join a voice channel, supporting desktop, windows, cameras, and capture cards.",
    },
    InvisibleChat: {
        description: "Encrypt your messages in an unsuspicious way!",
    },
    InviteDefaults: {
        description: "Lets you modify the default values when creating server invites.",
    },
    JumpTo: {
        description: "Adds context-menu options to jump to the first or last message in a channel or DM.",
    },
    Jumpscare: {
        description: "Adds a configurable chance of jump-scaring you each time you open a channel. Inspired by Geometry Dash Mega Hack.",
    },
    KeyboardNavigation: {
        description: "Lets you navigate the UI using your keyboard.",
    },
    KeyboardSounds: {
        description: "Adds OperaGX or osu! sound effects when typing on the keyboard.",
    },
    KeywordNotify: {
        description: "Sends a notification if a message matches specified keywords or regex patterns.",
    },
    LastActive: {
        description: "Lets you jump to your or another user's last active message in a channel or server.",
    },
    LoginWithQR: {
        description: "Lets you sign in to another device by scanning its QR code, just like on mobile!",
    },
    MediaPlaybackSpeed: {
        description: "Lets you change the playback speed of media attachments (default ones).",
    },
    MessageBurst: {
        description: "Merges messages sent within a time window with your previous message if no one else sent between them.",
    },
    MessageColors: {
        description: "Renders color codes like #FF0042 inline within messages.",
    },
    MessageFetchTimer: {
        description: "Shows how long it took to load messages in the current channel.",
    },
    MessageLinkTooltip: {
        description: "Adds a message preview tooltip when hovering over message links, replies, and forwarded messages.",
    },
    MessageLoggerEnhanced: {
        description: "Enhances MessageLogger with edit history, ghost-ping detection, and more.",
    },
    MessageNotifier: {
        description: "Sends notifications when selected users send a message.",
    },
    MessagePeek: {
        description: "Shows a preview of the last message and timestamp in the DM list.",
    },
    MessageTranslate: {
        description: "Automatically translates messages into your language with caching, per-channel toggle, and more options.",
    },
    MicLoopbackTester: {
        description: "Adds a microphone loopback test icon to the user panel.",
    },
    MiddleClickTweaks: {
        description: "Various middle-click tweaks such as pasting and opening links.",
    },
    MoreCommands: {
        description: "Adds various fun and useful slash commands.",
    },
    MoreStickers: {
        description: "Adds sticker packs from other platforms (e.g., LINE).",
    },
    MoreUserTags: {
        description: "Adds tags for webhooks and admin roles (owner, moderator, etc.).",
    },
    Moyai: {
        description: "Plays a 🗿 sound effect when a moyai emoji is sent, reacted with, or used as a voice effect.",
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
    },
    PartyMode: {
        description: "Lets you use party mode because the party never stops ✨",
    },
    PendingFriendRequest: {
        description: "Adds a way to cancel outgoing friend requests from profiles.",
    },
    PinIcon: {
        description: "Adds a pin icon on pinned messages.",
    },
    PingNotifications: {
        description: "Customizable notifications with improved mention formatting.",
    },
    PlatformSpoofer: {
        description: "Spoof the platform or device you appear to be using.",
    },
    PolishWording: {
        description: "Adjusts your messages to make them more polished and grammatically correct. See settings.",
    },
    ProfileSets: {
        description: "Lets you save and load different profile configurations via the profile section in settings.",
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
    },
    RecentDMSwitcher: {
        description: "Navigate between most-used DMs with Ctrl+Tab (Ctrl+Shift+Tab to go back).",
    },
    Remix: {
        description: "Brings back the Remix feature and makes it available on desktop.",
    },
    RepeatMessages: {
        description: "Lets you quickly repeat messages. Holding Shift while clicking repeat will reply to the message.",
    },
    ReplyPingControl: {
        description: "Control whether message reply pings are always on or always off, with whitelist and blacklist support.",
    },
    RichMagnetLinks: {
        description: "Renders magnet links as interactive message links.",
    },
    RichPresence: {
        description: "Unified Rich Presence hub for AudioBookShelf, osu!, stats.fm, Jellyfin, ListenBrainz, and Gensokyo Radio.",
    },
    RpcEditor: {
        description: "Modify the type and content of any Rich Presence.",
    },
    RpcStats: {
        description: "Displays your activity statistics as an RPC.",
    },
    SaveFavoriteGIFs: {
        description: "Export your favourite GIF links.",
    },
    ScheduledMessages: {
        description: "Schedule messages to be sent at a specified time or after a delay.",
    },
    ScreenRecorder: {
        description: "Adds an option to record your screen and upload the recording to the channel.",
    },
    SearchFix: {
        description: "Fixes the search functionality.",
    },
    SekaiStickers: {
        description: "Sekai stickers integrated into Discord; original source: github.com/TheOriginalAyaka.",
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
    },
    SilenceUsers: {
        description: "Mutes @mention alerts and server badge counters from specified users. Normal messages and DMs are unaffected.",
    },
    Snowfall: {
        description: "Makes it snow on Discord.",
    },
    Soggy: {
        description: "Adds a Soggy button to the toolbox.",
    },
    SongLink: {
        description: "Adds streaming service buttons below song links.",
    },
    SongSpotlight: {
        description: "Displays songs you're listening to on your profile.",
    },
    SplitLargeMessages: {
        description: "Splits long messages into multiple parts to fit Discord's message limit.",
    },
    SpotifyActivityToggle: {
        description: "Adds a toggle to show/hide Spotify activity.",
    },
    StatusPresets: {
        description: "Lets you save your statuses and apply them later.",
    },
    StatusWhileActive: {
        description: "Automatically updates your online status when you join a voice channel.",
    },
    SteamStatusSync: {
        description: "Sync your status with Steam! (Online, Away, Invisible, or Offline.)",
    },
    StickerBlocker: {
        description: "Lets you block stickers from being displayed.",
    },
    Streaks: {
        description: "Shows a streak counter next to a user when you exchange DMs with them daily.",
    },
    StreamingCodecDisabler: {
        description: "Disable streaming codecs of your choice.",
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
    TikTokTTS: {
        description: "Adds a context-menu option to read chat messages aloud using TikTok TTS. :sob:",
    },
    Timezones: {
        description: "Displays users' local time in profiles and message headers.",
    },
    Title: {
        description: "Replaces the window title prefix.",
    },
    ToastNotifications: {
        description: "Shows popup toast notifications, configurable for DMs, groups, friends, and server channels.",
    },
    ToggleVideoBind: {
        description: "Adds a customizable shortcut to toggle the camera.",
    },
    ToneIndicators: {
        description: "Shows tooltips for tone indicators like /srs, /gen, etc. on sent messages.",
    },
    TranslatePlus: {
        description: "Vencord's translation plugin with support for technical languages!",
    },
    TriviaAI: {
        description: "A plugin that helps you answer trivia questions using AI.",
    },
    UnitConverter: {
        description: "Converts metric units to imperial and vice versa.",
    },
    UniversalMention: {
        description: "Mention any user regardless of channel access permissions.",
    },
    UnlimitedAccounts: {
        description: "Increases the maximum number of accounts you can add.",
    },
    UnreadBadgeCount: {
        description: "Shows unread message count badges on channels in the channel list.",
    },
    UrlHighlighter: {
        description: "Highlights URLs in messages that match your custom patterns.",
    },
    Userpfp: {
        description: "Lets you use an animated profile picture without Nitro.",
    },
    UserpluginInstaller: {
        description: "Install user plugins with a single button click.",
    },
    VcNarratorCustom: {
        description: "Announces when users join, leave, or move between voice channels using a narrator via TikTok TTS. Revived and back again.",
    },
    VcPanelSettings: {
        description: "Control voice settings directly from the voice panel.",
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
    VoiceChatUtils: {
        description: "Lets you perform bulk actions on a whole voice channel (move, mute, disconnect, etc.).",
    },
    VoiceJoinMessages: {
        description: "Receive temporary client-side messages when your friends join voice channels.",
    },
    VoiceMessageTranscriber: {
        description: "Transcribes voice messages on-device using Whisper v3.",
    },
    VoiceRejoin: {
        description: "Automatically rejoins DM calls and server voice channels after Discord restarts.",
    },
    VoiceStats: {
        description: "Shows how much time you've spent in voice channels with each user on their profile.",
    },
    WaitForSlot: {
        description: "Automatically joins a full voice channel when a slot becomes available.",
    },
    WebpackTarball: {
        description: "Converts Discord's webpack sources into a tarball.",
    },
    WhitelistedEmojis: {
        description: "Adds the ability to disable all emoji in messages except those on your whitelist.",
    },
    WhosWatching: {
        description: "Hover over the screen-share icon to see which users are watching your stream.",
    },
    WigglyText: {
        description: "Adds a new Markdown format that makes text wiggle.",
    },
    WriteUpperCase: {
        description: "Capitalizes the first letter of each sentence in the message input.",
    },
    ZipPreview: {
        description: "Previews the contents of ZIP files directly inside message attachments.",
    },

    // ── userplugins ──────────────────────────────────────────────────────────

    BigFileUploadEnhanced: {
        description: "Bypass Discord's upload limit by uploading files to an external server and sharing the link in chat. Faster and uses no DOM manipulation.",
    },
    NitroSniper: {
        description: "Automatically redeems Nitro gift links sent in chat.",
    },
    "betterMicrophone.desktop": {
        description: "Lets you customize your microphone settings in much greater depth.",
    },
    FakeDeafen: {
        description: "Appear deafened to others while still hearing everything.",
    },
    GuildCopier: {
        description: "Copies roles, channels, emoji, stickers, and more from one server to another.",
    },
    MessageBookmarks: {
        description: "Save your favourite messages and jump to them with a single click.",
    },
    VirusTotalScanner: {
        description: "Scan Discord attachments with the VirusTotal API — local SHA-256 fingerprinting, no data uploaded without your explicit request.",
    },
    VencordCustomScreenSharePreview: {
        description: "Adds the ability to choose a custom image as your screen-share preview.",
    },
};
