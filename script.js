/* =========================================================
   CLOUD MUSIC v1.3
   Core Application
   Upload system moved to upload.js
   ========================================================= */


/* =========================================================
   SUPABASE
   ========================================================= */

const SUPABASE_URL =
    "https://pyeffshcludxijbkgwcc.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_88Sp-tBIQRM0K2K2V4PhTg_vSXBihDy";

const supabaseClient =
    window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_KEY
    );


/* =========================================================
   STATE
   ========================================================= */

let currentUser = null;

let songs = [];

let librarySongs = [];

let discoverSongs = [];

let playlists = [];

let currentPlaylist = null;

let playlistSongs = [];

let selectedSongForPlaylist = null;

let playbackQueue = [];

let playbackIndex = -1;

let currentSong = null;


/* =========================================================
   DOM ELEMENTS
   ========================================================= */


/* ---------------------------------------------------------
   AUTH
   --------------------------------------------------------- */

const authScreen =
    document.getElementById("authScreen");

const app =
    document.getElementById("app");

const authForm =
    document.getElementById("authForm");

const emailInput =
    document.getElementById("emailInput");

const passwordInput =
    document.getElementById("passwordInput");

const authButton =
    document.getElementById("authButton");

const authModeButton =
    document.getElementById("authModeButton");

const authMessage =
    document.getElementById("authMessage");

const userEmail =
    document.getElementById("userEmail");

const logoutButton =
    document.getElementById("logoutButton");


/* ---------------------------------------------------------
   DISCOVER
   --------------------------------------------------------- */

const discoverRefreshButton =
    document.getElementById(
        "discoverRefreshButton"
    );

const discoverCount =
    document.getElementById(
        "discoverCount"
    );

const discoverLoading =
    document.getElementById(
        "discoverLoading"
    );

const discoverEmptyState =
    document.getElementById(
        "discoverEmptyState"
    );

const discoverSongList =
    document.getElementById(
        "discoverSongList"
    );


/* ---------------------------------------------------------
   LIBRARY
   --------------------------------------------------------- */

const songCount =
    document.getElementById(
        "songCount"
    );

const refreshButton =
    document.getElementById(
        "refreshButton"
    );

const loading =
    document.getElementById(
        "loading"
    );

const emptyState =
    document.getElementById(
        "emptyState"
    );

const songList =
    document.getElementById(
        "songList"
    );


/* ---------------------------------------------------------
   PLAYLISTS
   --------------------------------------------------------- */

const playlistCount =
    document.getElementById(
        "playlistCount"
    );

const createPlaylistButton =
    document.getElementById(
        "createPlaylistButton"
    );

const playlistCreatePanel =
    document.getElementById(
        "playlistCreatePanel"
    );

const playlistNameInput =
    document.getElementById(
        "playlistNameInput"
    );

const savePlaylistButton =
    document.getElementById(
        "savePlaylistButton"
    );

const cancelPlaylistButton =
    document.getElementById(
        "cancelPlaylistButton"
    );

const playlistList =
    document.getElementById(
        "playlistList"
    );

const emptyPlaylistState =
    document.getElementById(
        "emptyPlaylistState"
    );


/* ---------------------------------------------------------
   PLAYLIST VIEW
   --------------------------------------------------------- */

const playlistView =
    document.getElementById(
        "playlistView"
    );

const backToPlaylistsButton =
    document.getElementById(
        "backToPlaylistsButton"
    );

const playlistViewTitle =
    document.getElementById(
        "playlistViewTitle"
    );

const playlistViewCount =
    document.getElementById(
        "playlistViewCount"
    );

const playPlaylistButton =
    document.getElementById(
        "playPlaylistButton"
    );

const downloadPlaylistButton =
    document.getElementById(
        "downloadPlaylistButton"
    );

const playlistSongList =
    document.getElementById(
        "playlistSongList"
    );

const emptyPlaylistSongs =
    document.getElementById(
        "emptyPlaylistSongs"
    );


/* ---------------------------------------------------------
   ADD TO PLAYLIST MODAL
   --------------------------------------------------------- */

const addToPlaylistModal =
    document.getElementById(
        "addToPlaylistModal"
    );

const addToPlaylistSongTitle =
    document.getElementById(
        "addToPlaylistSongTitle"
    );

const closePlaylistModalButton =
    document.getElementById(
        "closePlaylistModalButton"
    );

const addToPlaylistList =
    document.getElementById(
        "addToPlaylistList"
    );


/* ---------------------------------------------------------
   PLAYER
   --------------------------------------------------------- */

const player =
    document.getElementById(
        "player"
    );

const audioPlayer =
    document.getElementById(
        "audioPlayer"
    );

const playerTitle =
    document.getElementById(
        "playerTitle"
    );

const playerArtist =
    document.getElementById(
        "playerArtist"
    );

const playerThumbnail =
    document.getElementById(
        "playerThumbnail"
    );

const playerStatus =
    document.getElementById(
        "playerStatus"
    );

const playerCloseButton =
    document.getElementById(
        "playerCloseButton"
    );

const previousButton =
    document.getElementById(
        "previousButton"
    );

const playButton =
    document.getElementById(
        "playButton"
    );

const nextButton =
    document.getElementById(
        "nextButton"
    );

const currentTime =
    document.getElementById(
        "currentTime"
    );

const totalTime =
    document.getElementById(
        "totalTime"
    );

const seekBar =
    document.getElementById(
        "seekBar"
    );

const volumeBar =
    document.getElementById(
        "volumeBar"
    );


/* ---------------------------------------------------------
   TOAST
   --------------------------------------------------------- */

const toast =
    document.getElementById(
        "toast"
    );


/* =========================================================
   AUTH MODE
   ========================================================= */

let loginMode = true;


/* =========================================================
   HELPERS
   ========================================================= */

function showToast(message) {

    if (!toast) {
        return;
    }

    toast.textContent =
        message;

    toast.classList.add(
        "show"
    );

    clearTimeout(
        showToast.timeout
    );

    showToast.timeout =
        setTimeout(
            () => {

                toast.classList.remove(
                    "show"
                );

            },
            3000
        );
}


function showAuthMessage(
    message,
    isError = true
) {

    if (!authMessage) {
        return;
    }

    authMessage.textContent =
        message;

    authMessage.classList.toggle(
        "error",
        isError
    );
}


function formatTime(seconds) {

    if (
        !Number.isFinite(
            seconds
        ) ||
        seconds < 0
    ) {

        return "0:00";
    }

    const minutes =
        Math.floor(
            seconds / 60
        );

    const remainingSeconds =
        Math.floor(
            seconds % 60
        );

    return `${minutes}:${String(
        remainingSeconds
    ).padStart(
        2,
        "0"
    )}`;
}


function formatFileSize(bytes) {

    if (!bytes) {
        return "0 B";
    }

    if (bytes < 1024) {
        return `${bytes} B`;
    }

    if (
        bytes <
        1024 * 1024
    ) {

        return `${(
            bytes / 1024
        ).toFixed(
            1
        )} KB`;

    }

    if (
        bytes <
        1024 *
        1024 *
        1024
    ) {

        return `${(
            bytes /
            (
                1024 *
                1024
            )
        ).toFixed(
            1
        )} MB`;

    }

    return `${(
        bytes /
        (
            1024 *
            1024 *
            1024
        )
    ).toFixed(
        1
    )} GB`;
}


function getTitleFromFilename(
    filename
) {

    const withoutExtension =
        filename.replace(
            /\.[^/.]+$/,
            ""
        );

    return withoutExtension
        .replace(
            /[_-]+/g,
            " "
        )
        .trim();
}


function sanitizeFilename(
    filename
) {

    return filename
        .replace(
            /[<>:"/\\|?*\x00-\x1F]/g,
            "_"
        )
        .replace(
            /\s+/g,
            " "
        )
        .trim()
        .slice(
            0,
            180
        );
}


function getExtensionFromPath(
    path
) {

    if (!path) {
        return "mp3";
    }

    const filename =
        path
            .split("/")
            .pop();

    const match =
        filename.match(
            /\.([a-zA-Z0-9]+)$/
        );

    if (!match) {
        return "mp3";
    }

    return match[1];
}


function getDownloadFilename(
    song
) {

    const extension =
        getExtensionFromPath(
            song.audio_path
        );

    let title =
        sanitizeFilename(
            song.title ||
            "song"
        );

    if (!title) {
        title =
            "song";
    }

    return `${title}.${extension}`;
}


/* =========================================================
   DOWNLOAD HELPERS
   ========================================================= */

function openDownloadUrl(
    url,
    filename
) {

    if (!url) {

        throw new Error(
            "No download URL was created."
        );

    }

    const link =
        document.createElement(
            "a"
        );

    link.href =
        url;

    link.download =
        filename || "";

    link.target =
        "_blank";

    link.rel =
        "noopener";

    document.body.appendChild(
        link
    );

    link.click();

    link.remove();
}


async function createDownloadUrl(
    storagePath,
    filename
) {

    const {
        data,
        error
    } =
        await supabaseClient.storage
            .from("songs")
            .createSignedUrl(
                storagePath,
                3600,
                {
                    download:
                        filename
                }
            );

    if (error) {
        throw error;
    }

    if (!data?.signedUrl) {

        throw new Error(
            "Could not create download URL."
        );

    }

    return data.signedUrl;
}


/* =========================================================
   AUTH MODE SWITCH
   ========================================================= */

authModeButton?.addEventListener(
    "click",
    () => {

        loginMode =
            !loginMode;

        if (loginMode) {

            authButton.textContent =
                "Log in";

            authModeButton.textContent =
                "Don't have an account? Sign up";

        } else {

            authButton.textContent =
                "Sign up";

            authModeButton.textContent =
                "Already have an account? Log in";

        }

        showAuthMessage("");
    }
);


/* =========================================================
   AUTH FORM
   ========================================================= */

authForm?.addEventListener(
    "submit",
    async (
        event
    ) => {

        event.preventDefault();

        const email =
            emailInput.value.trim();

        const password =
            passwordInput.value;

        if (
            !email ||
            !password
        ) {
            return;
        }

        authButton.disabled =
            true;

        showAuthMessage(
            loginMode
                ? "Logging in..."
                : "Creating account...",
            false
        );

        try {

            if (loginMode) {

                const {
                    error
                } =
                    await supabaseClient.auth
                        .signInWithPassword({
                            email,
                            password
                        });

                if (error) {
                    throw error;
                }

                showAuthMessage(
                    "Logged in.",
                    false
                );

            } else {

                const {
                    data,
                    error
                } =
                    await supabaseClient.auth
                        .signUp({
                            email,
                            password
                        });

                if (error) {
                    throw error;
                }

                if (
                    data.user &&
                    !data.session
                ) {

                    showAuthMessage(
                        "Account created. Check your email to confirm your account.",
                        false
                    );

                } else {

                    showAuthMessage(
                        "Account created.",
                        false
                    );

                }

            }

        } catch (error) {

            console.error(
                "Authentication error:",
                error
            );

            showAuthMessage(
                error.message ||
                "Authentication failed."
            );

        } finally {

            authButton.disabled =
                false;

        }

    }
);


/* =========================================================
   SESSION
   ========================================================= */

async function checkSession() {

    const {
        data,
        error
    } =
        await supabaseClient.auth
            .getSession();

    if (error) {

        console.error(
            "Session error:",
            error
        );

        return;
    }

    if (data.session) {

        await enterApp(
            data.session.user
        );

    } else {

        showAuthScreen();

    }
}


supabaseClient.auth.onAuthStateChange(
    async (
        event,
        session
    ) => {

        if (session) {

            if (
                !currentUser ||
                currentUser.id !==
                session.user.id
            ) {

                await enterApp(
                    session.user
                );

            }

        } else {

            currentUser =
                null;

            showAuthScreen();

        }

    }
);


function showAuthScreen() {

    authScreen?.classList.remove(
        "hidden"
    );

    app?.classList.add(
        "hidden"
    );

    player?.classList.add(
        "hidden"
    );
}


async function enterApp(
    user
) {

    currentUser =
        user;

    authScreen?.classList.add(
        "hidden"
    );

    app?.classList.remove(
        "hidden"
    );

    if (userEmail) {

        userEmail.textContent =
            user.email || "";

    }

    await loadSongs();

    await loadPlaylists();

    await loadDiscoverSongs();
}


/* =========================================================
   LOGOUT
   ========================================================= */

logoutButton?.addEventListener(
    "click",
    async () => {

        const {
            error
        } =
            await supabaseClient.auth
                .signOut();

        if (error) {

            console.error(
                "Logout error:",
                error
            );

            showToast(
                "Could not log out."
            );

            return;
        }

        currentUser =
            null;

        songs =
            [];

        librarySongs =
            [];

        discoverSongs =
            [];

        playlists =
            [];

        currentPlaylist =
            null;

        playlistSongs =
            [];

        playbackQueue =
            [];

        playbackIndex =
            -1;

        currentSong =
            null;

        audioPlayer?.pause();

        audioPlayer?.removeAttribute(
            "src"
        );

        audioPlayer?.load();

        showAuthScreen();

    }
);


/* =========================================================
   LOAD USER LIBRARY
   ========================================================= */

refreshButton?.addEventListener(
    "click",
    async () => {

        await loadSongs();

    }
);


async function loadSongs() {

    if (!currentUser) {
        return;
    }

    loading?.classList.remove(
        "hidden"
    );

    emptyState?.classList.add(
        "hidden"
    );

    const {
        data,
        error
    } =
        await supabaseClient
            .from("songs")
            .select(`
                id,
                user_id,
                title,
                artist_name,
                audio_path,
                thumbnail_path,
                file_size_bytes,
                duration_seconds,
                created_at,
                is_public
            `)
            .eq(
                "user_id",
                currentUser.id
            )
            .order(
                "created_at",
                {
                    ascending: false
                }
            );

    if (error) {

        loading?.classList.add(
            "hidden"
        );

        console.error(
            "Load songs error:",
            error
        );

        showToast(
            "Could not load your music."
        );

        return;
    }

    songs =
        data || [];

    await loadSavedLibrarySongs();

    loading?.classList.add(
        "hidden"
    );

    rebuildLibrarySongs();

    renderSongs();
}


/* =========================================================
   LOAD SAVED PUBLIC SONGS
   ========================================================= */

async function loadSavedLibrarySongs() {

    if (!currentUser) {
        return;
    }

    const {
        data,
        error
    } =
        await supabaseClient
            .from("library_songs")
            .select(`
                id,
                song_id,
                created_at
            `)
            .eq(
                "user_id",
                currentUser.id
            )
            .order(
                "created_at",
                {
                    ascending: false
                }
            );

    if (error) {

        console.error(
            "Load library songs error:",
            error
        );

        showToast(
            "Could not load saved songs."
        );

        librarySongs =
            [];

        return;
    }

    if (
        !data ||
        data.length === 0
    ) {

        librarySongs =
            [];

        return;
    }

    const songIds =
        data.map(
            (item) =>
                item.song_id
        );

    const {
        data:
            savedSongs,
        error:
            savedSongsError
    } =
        await supabaseClient
            .from("songs")
            .select(`
                id,
                user_id,
                title,
                artist_name,
                audio_path,
                thumbnail_path,
                file_size_bytes,
                duration_seconds,
                created_at,
                is_public
            `)
            .in(
                "id",
                songIds
            );

    if (savedSongsError) {

        console.error(
            "Load saved song details error:",
            savedSongsError
        );

        librarySongs =
            [];

        return;
    }

    const songMap =
        new Map(
            (savedSongs || [])
                .map(
                    (song) => [
                        song.id,
                        song
                    ]
                )
        );

    librarySongs =
        data
            .map(
                (row) => ({

                    libraryId:
                        row.id,

                    song:
                        songMap.get(
                            row.song_id
                        ),

                    createdAt:
                        row.created_at

                })
            )
            .filter(
                (item) =>
                    item.song
            );
}


/* =========================================================
   REBUILD LIBRARY
   ========================================================= */

function rebuildLibrarySongs() {

    const ownedIds =
        new Set(
            songs.map(
                (song) =>
                    song.id
            )
        );

    const savedSongs =
        librarySongs
            .filter(
                (item) =>
                    item.song &&
                    !ownedIds.has(
                        item.song.id
                    )
            )
            .map(
                (item) =>
                    item.song
            );

    librarySongs =
        librarySongs.filter(
            (item) =>
                item.song
        );

    return [
        ...songs,
        ...savedSongs
    ];
}


/* =========================================================
   RENDER USER LIBRARY
   ========================================================= */

function renderSongs() {

    if (!songList) {
        return;
    }

    songList.innerHTML =
        "";

    const library =
        rebuildLibrarySongs();

    if (songCount) {

        songCount.textContent =
            `${library.length} ${
                library.length === 1
                    ? "song"
                    : "songs"
            }`;

    }

    if (
        library.length === 0
    ) {

        emptyState?.classList.remove(
            "hidden"
        );

        return;
    }

    emptyState?.classList.add(
        "hidden"
    );

    library.forEach(
        (song) => {

            const isOwner =
                song.user_id ===
                currentUser.id;

            const card =
                createSongCard(
                    song,
                    {
                        isOwner,
                        isDiscover:
                            false
                    }
                );

            songList.appendChild(
                card
            );

        }
    );
}


/* =========================================================
   CREATE SONG CARD
   ========================================================= */

function createSongCard(
    song,
    options = {}
) {

    const {
        isOwner = false,
        isDiscover = false
    } =
        options;

    const card =
        document.createElement(
            "div"
        );

    card.className =
        "song-card";


    /* -----------------------------------------------------
       INFO
       ----------------------------------------------------- */

    const info =
        document.createElement(
            "div"
        );

    info.className =
        "song-info";


    const icon =
        document.createElement(
            "div"
        );

    icon.className =
        "song-icon";

    icon.textContent =
        "♫";


    const details =
        document.createElement(
            "div"
        );

    details.className =
        "song-details";


    const title =
        document.createElement(
            "strong"
        );

    title.textContent =
        song.title ||
        "Untitled";


    const metadata =
        document.createElement(
            "span"
        );

    const parts = [];


    if (
        song.artist_name
    ) {

        parts.push(
            song.artist_name
        );

    }


    if (
        song.duration_seconds
    ) {

        parts.push(
            formatTime(
                song.duration_seconds
            )
        );

    }


    if (
        song.file_size_bytes
    ) {

        parts.push(
            formatFileSize(
                song.file_size_bytes
            )
        );

    }


    if (
        isDiscover &&
        !isOwner
    ) {

        parts.push(
            "Public"
        );

    }


    metadata.textContent =
        parts.join(
            " • "
        );


    details.appendChild(
        title
    );

    details.appendChild(
        metadata
    );


    info.appendChild(
        icon
    );

    info.appendChild(
        details
    );


    /* -----------------------------------------------------
       ACTIONS
       ----------------------------------------------------- */

    const actions =
        document.createElement(
            "div"
        );

    actions.className =
        "song-actions";


    /* PLAY */

    const playButtonForSong =
        document.createElement(
            "button"
        );

    playButtonForSong.className =
        "song-action-button";

    playButtonForSong.type =
        "button";

    playButtonForSong.title =
        "Play";

    playButtonForSong.textContent =
        "▶";


    playButtonForSong.addEventListener(
        "click",
        () => {

            if (isDiscover) {

                playFromDiscover(
                    song
                );

            } else {

                playFromLibrary(
                    song
                );

            }

        }
    );


    actions.appendChild(
        playButtonForSong
    );


    /* -----------------------------------------------------
       DISCOVER: ADD TO LIBRARY
       ----------------------------------------------------- */

    if (
        isDiscover &&
        !isOwner
    ) {

        const addButton =
            document.createElement(
                "button"
            );

        addButton.className =
            "song-action-button";

        addButton.type =
            "button";

        addButton.title =
            "Add to library";

        addButton.textContent =
            "+";


        const alreadySaved =
            librarySongs.some(
                (item) =>
                    item.song?.id ===
                    song.id
            );


        if (alreadySaved) {

            addButton.disabled =
                true;

            addButton.title =
                "Already in library";

            addButton.textContent =
                "✓";

        } else {

            addButton.addEventListener(
                "click",
                async () => {

                    await addSongToLibrary(
                        song
                    );

                }
            );

        }


        actions.appendChild(
            addButton
        );

    }


    /* -----------------------------------------------------
       ADD TO PLAYLIST
       ----------------------------------------------------- */

    if (
        !isDiscover ||
        isOwner
    ) {

        const playlistButton =
            document.createElement(
                "button"
            );

        playlistButton.className =
            "song-action-button";

        playlistButton.type =
            "button";

        playlistButton.title =
            "Add to playlist";

        playlistButton.textContent =
            "+";


        playlistButton.addEventListener(
            "click",
            () => {

                openAddToPlaylistModal(
                    song
                );

            }
        );


        actions.appendChild(
            playlistButton
        );

    }


    /* -----------------------------------------------------
       DOWNLOAD
       ----------------------------------------------------- */

    const downloadButton =
        document.createElement(
            "button"
        );

    downloadButton.className =
        "song-action-button";

    downloadButton.type =
        "button";

    downloadButton.title =
        "Download";

    downloadButton.textContent =
        "↓";


    downloadButton.addEventListener(
        "click",
        () => {

            downloadSong(
                song
            );

        }
    );


    actions.appendChild(
        downloadButton
    );


    /* -----------------------------------------------------
       OWNER EDIT
       ----------------------------------------------------- */

    if (
        isOwner &&
        !isDiscover
    ) {

        const editButton =
            document.createElement(
                "button"
            );

        editButton.className =
            "song-action-button";

        editButton.type =
            "button";

        editButton.title =
            "Edit song";

        editButton.textContent =
            "✎";


        editButton.addEventListener(
            "click",
            () => {

                if (
                    window.cloudMusicUpload &&
                    typeof window
                        .cloudMusicUpload
                        .openEditSong ===
                        "function"
                ) {

                    window.cloudMusicUpload
                        .openEditSong(
                            song
                        );

                } else {

                    showToast(
                        "Upload system is still loading."
                    );

                }

            }
        );


        actions.appendChild(
            editButton
        );

    }


    /* -----------------------------------------------------
       OWNER PUBLIC / PRIVATE
       ----------------------------------------------------- */

    if (
        isOwner &&
        !isDiscover
    ) {

        const publicButton =
            document.createElement(
                "button"
            );

        publicButton.className =
            "song-action-button";

        publicButton.type =
            "button";


        if (song.is_public) {

            publicButton.title =
                "Make private";

            publicButton.textContent =
                "🌐";

        } else {

            publicButton.title =
                "Make public";

            publicButton.textContent =
                "🔒";

        }


        publicButton.addEventListener(
            "click",
            async () => {

                await toggleSongVisibility(
                    song
                );

            }
        );


        actions.appendChild(
            publicButton
        );

    }


    /* -----------------------------------------------------
       OWNER DELETE
       ----------------------------------------------------- */

    if (isOwner) {

        const deleteButton =
            document.createElement(
                "button"
            );

        deleteButton.className =
            "song-action-button";

        deleteButton.type =
            "button";

        deleteButton.title =
            "Delete";

        deleteButton.textContent =
            "×";


        deleteButton.addEventListener(
            "click",
            () => {

                deleteSong(
                    song
                );

            }
        );


        actions.appendChild(
            deleteButton
        );

    } else {

        /* -------------------------------------------------
           REMOVE SAVED SONG
           ------------------------------------------------- */

        const removeButton =
            document.createElement(
                "button"
            );

        removeButton.className =
            "song-action-button";

        removeButton.type =
            "button";

        removeButton.title =
            "Remove from library";

        removeButton.textContent =
            "×";


        removeButton.addEventListener(
            "click",
            () => {

                removeSongFromLibrary(
                    song
                );

            }
        );


        actions.appendChild(
            removeButton
        );

    }


    card.appendChild(
        info
    );

    card.appendChild(
        actions
    );


    return card;
}


/* =========================================================
   PUBLIC / PRIVATE TOGGLE
   ========================================================= */

async function toggleSongVisibility(
    song
) {

    if (
        !currentUser ||
        song.user_id !==
        currentUser.id
    ) {

        return;
    }


    const newValue =
        !song.is_public;


    try {

        const {
            data,
            error
        } =
            await supabaseClient
                .from("songs")
                .update({
                    is_public:
                        newValue
                })
                .eq(
                    "id",
                    song.id
                )
                .eq(
                    "user_id",
                    currentUser.id
                )
                .select()
                .single();


        if (error) {
            throw error;
        }


        const index =
            songs.findIndex(
                (item) =>
                    item.id ===
                    song.id
            );


        if (index !== -1) {

            songs[index] =
                data;

        }


        renderSongs();

        await loadDiscoverSongs();


        showToast(
            newValue
                ? "Song is now public."
                : "Song is now private."
        );


    } catch (error) {

        console.error(
            "Toggle visibility error:",
            error
        );

        showToast(
            "Could not change song visibility."
        );

    }
}


/* =========================================================
   DISCOVER
   ========================================================= */

discoverRefreshButton?.addEventListener(
    "click",
    async () => {

        await loadDiscoverSongs();

    }
);


async function loadDiscoverSongs() {

    if (!currentUser) {
        return;
    }


    discoverLoading?.classList.remove(
        "hidden"
    );

    discoverEmptyState?.classList.add(
        "hidden"
    );


    const {
        data,
        error
    } =
        await supabaseClient
            .from("songs")
            .select(`
                id,
                user_id,
                title,
                artist_name,
                audio_path,
                thumbnail_path,
                file_size_bytes,
                duration_seconds,
                created_at,
                is_public
            `)
            .eq(
                "is_public",
                true
            )
            .order(
                "created_at",
                {
                    ascending: false
                }
            );


    discoverLoading?.classList.add(
        "hidden"
    );


    if (error) {

        console.error(
            "Discover error:",
            error
        );

        showToast(
            "Could not load Discover."
        );

        return;
    }


    discoverSongs =
        data || [];


    renderDiscoverSongs();
}


function renderDiscoverSongs() {

    if (!discoverSongList) {
        return;
    }

    discoverSongList.innerHTML =
        "";


    if (discoverCount) {

        discoverCount.textContent =
            `${discoverSongs.length} ${
                discoverSongs.length === 1
                    ? "public song"
                    : "public songs"
            }`;

    }


    if (
        discoverSongs.length === 0
    ) {

        discoverEmptyState?.classList.remove(
            "hidden"
        );

        return;
    }


    discoverEmptyState?.classList.add(
        "hidden"
    );


    discoverSongs.forEach(
        (song) => {

            const card =
                createSongCard(
                    song,
                    {
                        isOwner:
                            song.user_id ===
                            currentUser.id,

                        isDiscover:
                            true
                    }
                );


            discoverSongList.appendChild(
                card
            );

        }
    );
}


/* =========================================================
   ADD DISCOVER SONG TO LIBRARY
   ========================================================= */

async function addSongToLibrary(
    song
) {

    if (!currentUser) {
        return;
    }


    if (
        song.user_id ===
        currentUser.id
    ) {

        showToast(
            "This song is already in your library."
        );

        return;
    }


    try {

        const {
            data,
            error
        } =
            await supabaseClient
                .from("library_songs")
                .insert({
                    user_id:
                        currentUser.id,

                    song_id:
                        song.id
                })
                .select()
                .single();


        if (error) {

            if (
                error.code ===
                "23505"
            ) {

                showToast(
                    "Song is already in your library."
                );

                return;
            }

            throw error;
        }


        librarySongs.unshift({
            libraryId:
                data.id,

            song:
                song,

            createdAt:
                data.created_at
        });


        renderSongs();

        renderDiscoverSongs();


        showToast(
            `"${song.title}" added to your library.`
        );


    } catch (error) {

        console.error(
            "Add to library error:",
            error
        );

        showToast(
            error.message ||
            "Could not add song to library."
        );

    }
}


/* =========================================================
   REMOVE DISCOVER SONG FROM LIBRARY
   ========================================================= */

async function removeSongFromLibrary(
    song
) {

    if (!currentUser) {
        return;
    }


    const libraryEntry =
        librarySongs.find(
            (item) =>
                item.song?.id ===
                song.id
        );


    if (!libraryEntry) {
        return;
    }


    try {

        const {
            error
        } =
            await supabaseClient
                .from("library_songs")
                .delete()
                .eq(
                    "id",
                    libraryEntry.libraryId
                )
                .eq(
                    "user_id",
                    currentUser.id
                );


        if (error) {
            throw error;
        }


        librarySongs =
            librarySongs.filter(
                (item) =>
                    item.libraryId !==
                    libraryEntry.libraryId
            );


        renderSongs();

        renderDiscoverSongs();


        showToast(
            `"${song.title}" removed from your library.`
        );


    } catch (error) {

        console.error(
            "Remove from library error:",
            error
        );

        showToast(
            "Could not remove song from library."
        );

    }
}


/* =========================================================
   CORE BRIDGE FOR upload.js
   ========================================================= */

window.cloudMusicCore = {

    getCurrentUser() {

        return currentUser;

    },


    getSongs() {

        return songs;

    },


    setSongs(
        newSongs
    ) {

        songs =
            Array.isArray(
                newSongs
            )
                ? newSongs
                : [];

    },


    addSong(
        song
    ) {

        if (!song) {
            return;
        }

        songs.unshift(
            song
        );

        rebuildLibrarySongs();

        renderSongs();

    },


    updateSong(
        updatedSong
    ) {

        if (!updatedSong) {
            return;
        }

        const index =
            songs.findIndex(
                (song) =>
                    song.id ===
                    updatedSong.id
            );

        if (index !== -1) {

            songs[index] =
                updatedSong;

        }

        const libraryIndex =
            librarySongs.findIndex(
                (item) =>
                    item.song?.id ===
                    updatedSong.id
            );

        if (
            libraryIndex !==
            -1
        ) {

            librarySongs[
                libraryIndex
            ].song =
                updatedSong;

        }

        const discoverIndex =
            discoverSongs.findIndex(
                (song) =>
                    song.id ===
                    updatedSong.id
            );

        if (
            discoverIndex !==
            -1
        ) {

            discoverSongs[
                discoverIndex
            ] =
                updatedSong;

        }

        renderSongs();

        renderDiscoverSongs();

    },


    removeSong(
        songId
    ) {

        songs =
            songs.filter(
                (song) =>
                    song.id !==
                    songId
            );

        librarySongs =
            librarySongs.filter(
                (item) =>
                    item.song?.id !==
                    songId
            );

        discoverSongs =
            discoverSongs.filter(
                (song) =>
                    song.id !==
                    songId
            );

        renderSongs();

        renderDiscoverSongs();

    },


    refreshSongs() {

        return loadSongs();

    },


    refreshDiscover() {

        return loadDiscoverSongs();

    },


    showToast,

    getSupabaseClient() {

        return supabaseClient;

    },


    getSupabaseUrl() {

        return SUPABASE_URL;

    },


    getSupabaseKey() {

        return SUPABASE_KEY;

    },


    getAudioDuration,

    getTitleFromFilename,

    sanitizeFilename

};

/* =========================================================
   AUDIO DURATION HELPER
   ========================================================= */

function getAudioDuration(file) {

    return new Promise(
        (resolve) => {

            const audio =
                document.createElement(
                    "audio"
                );

            const objectUrl =
                URL.createObjectURL(
                    file
                );

            audio.preload =
                "metadata";

            audio.onloadedmetadata =
                () => {

                    const duration =
                        Number.isFinite(
                            audio.duration
                        )
                            ? Math.round(
                                audio.duration
                            )
                            : 0;

                    URL.revokeObjectURL(
                        objectUrl
                    );

                    resolve(
                        duration
                    );

                };

            audio.onerror =
                () => {

                    URL.revokeObjectURL(
                        objectUrl
                    );

                    resolve(
                        0
                    );

                };

            audio.src =
                objectUrl;

        }
    );
}


/* =========================================================
   PLAYBACK
   ========================================================= */

async function playFromLibrary(
    song
) {

    playbackQueue =
        rebuildLibrarySongs();

    playbackIndex =
        playbackQueue.findIndex(
            (item) =>
                item.id ===
                song.id
        );

    if (
        playbackIndex === -1
    ) {

        playbackIndex =
            0;

    }

    await playCurrentQueueSong();
}


async function playFromDiscover(
    song
) {

    playbackQueue =
        [...discoverSongs];

    playbackIndex =
        playbackQueue.findIndex(
            (item) =>
                item.id ===
                song.id
        );

    if (
        playbackIndex === -1
    ) {

        playbackIndex =
            0;

    }

    await playCurrentQueueSong();
}


async function playCurrentQueueSong() {

    if (
        playbackIndex < 0 ||
        playbackIndex >=
        playbackQueue.length
    ) {

        return;

    }

    const song =
        playbackQueue[
            playbackIndex
        ];

    await playSong(
        song
    );
}


/* =========================================================
   PLAYER THUMBNAIL
   ========================================================= */

async function setPlayerThumbnail(
    song
) {

    if (!playerThumbnail) {
        return;
    }

    playerThumbnail.removeAttribute(
        "src"
    );

    playerThumbnail.alt =
        song?.title ||
        "Song artwork";

    if (
        !song?.thumbnail_path
    ) {

        playerThumbnail.classList.add(
            "hidden"
        );

        return;

    }

    try {

        const {
            data,
            error
        } =
            await supabaseClient.storage
                .from("songs")
                .createSignedUrl(
                    song.thumbnail_path,
                    3600
                );

        if (
            error ||
            !data?.signedUrl
        ) {

            playerThumbnail.classList.add(
                "hidden"
            );

            return;

        }

        playerThumbnail.src =
            data.signedUrl;

        playerThumbnail.classList.remove(
            "hidden"
        );

    } catch (error) {

        console.error(
            "Thumbnail error:",
            error
        );

        playerThumbnail.classList.add(
            "hidden"
        );

    }
}


/* =========================================================
   PLAY SONG
   ========================================================= */

async function playSong(
    song
) {

    if (!song) {
        return;
    }

    player?.classList.remove(
        "hidden"
    );

    if (playerTitle) {

        playerTitle.textContent =
            song.title ||
            "Untitled";

    }

    if (playerArtist) {

        playerArtist.textContent =
            song.artist_name ||
            "Unknown artist";

    }

    if (playerStatus) {

        playerStatus.textContent =
            "Loading...";

    }

    await setPlayerThumbnail(
        song
    );

    try {

        const {
            data,
            error
        } =
            await supabaseClient.storage
                .from("songs")
                .createSignedUrl(
                    song.audio_path,
                    3600
                );

        if (error) {
            throw error;
        }

        if (
            !data?.signedUrl
        ) {

            throw new Error(
                "Could not create audio URL."
            );

        }

        currentSong =
            song;

        audioPlayer.src =
            data.signedUrl;

        audioPlayer.load();

        await audioPlayer.play();

        if (playerStatus) {

            playerStatus.textContent =
                "Playing";

        }

        if (playButton) {

            playButton.textContent =
                "❚❚";

        }

    } catch (error) {

        console.error(
            "Playback error:",
            error
        );

        if (playerStatus) {

            playerStatus.textContent =
                "Unable to play";

        }

        showToast(
            "Could not play this song."
        );

    }
}


/* =========================================================
   CLOSE PLAYER
   ========================================================= */

function closePlayer() {

    if (!player) {
        return;
    }

    audioPlayer.pause();

    audioPlayer.removeAttribute(
        "src"
    );

    audioPlayer.load();

    currentSong =
        null;

    if (playButton) {

        playButton.textContent =
            "▶";

    }

    if (playerStatus) {

        playerStatus.textContent =
            "Ready";

    }

    if (currentTime) {

        currentTime.textContent =
            "0:00";

    }

    if (totalTime) {

        totalTime.textContent =
            "0:00";

    }

    if (seekBar) {

        seekBar.value =
            "0";

    }

    player.classList.add(
        "hidden"
    );
}


playerCloseButton?.addEventListener(
    "click",
    closePlayer
);


/* =========================================================
   PLAYER PLAY / PAUSE
   ========================================================= */

playButton?.addEventListener(
    "click",
    async () => {

        if (!audioPlayer.src) {

            if (
                playbackQueue.length > 0
            ) {

                await playCurrentQueueSong();

            }

            return;
        }

        if (
            audioPlayer.paused
        ) {

            try {

                await audioPlayer.play();

                if (playerStatus) {

                    playerStatus.textContent =
                        "Playing";

                }

                playButton.textContent =
                    "❚❚";

            } catch (error) {

                console.error(
                    "Play error:",
                    error
                );

            }

        } else {

            audioPlayer.pause();

            if (playerStatus) {

                playerStatus.textContent =
                    "Paused";

            }

            playButton.textContent =
                "▶";

        }

    }
);


/* =========================================================
   PREVIOUS
   ========================================================= */

previousButton?.addEventListener(
    "click",
    async () => {

        if (
            playbackQueue.length === 0
        ) {
            return;
        }

        if (
            playbackIndex > 0
        ) {

            playbackIndex--;

            await playCurrentQueueSong();

        }

    }
);


/* =========================================================
   NEXT
   ========================================================= */

nextButton?.addEventListener(
    "click",
    async () => {

        if (
            playbackQueue.length === 0
        ) {
            return;
        }

        if (
            playbackIndex <
            playbackQueue.length - 1
        ) {

            playbackIndex++;

            await playCurrentQueueSong();

        }

    }
);


/* =========================================================
   AUTOMATIC NEXT
   ========================================================= */

audioPlayer?.addEventListener(
    "ended",
    async () => {

        if (
            playbackIndex <
            playbackQueue.length - 1
        ) {

            playbackIndex++;

            await playCurrentQueueSong();

        } else {

            if (playButton) {

                playButton.textContent =
                    "▶";

            }

            if (playerStatus) {

                playerStatus.textContent =
                    "Finished";

            }

        }

    }
);


/* =========================================================
   AUDIO LOADING
   ========================================================= */

audioPlayer?.addEventListener(
    "loadedmetadata",
    () => {

        if (totalTime) {

            totalTime.textContent =
                formatTime(
                    audioPlayer.duration
                );

        }

        if (seekBar) {

            seekBar.value =
                "0";

        }

    }
);


/* =========================================================
   CURRENT TIME
   ========================================================= */

audioPlayer?.addEventListener(
    "timeupdate",
    () => {

        const duration =
            audioPlayer.duration;

        if (
            Number.isFinite(
                duration
            ) &&
            duration > 0
        ) {

            const percentage =
                (
                    audioPlayer.currentTime /
                    duration
                ) * 100;

            if (seekBar) {

                seekBar.value =
                    percentage;

            }

        }

        if (currentTime) {

            currentTime.textContent =
                formatTime(
                    audioPlayer.currentTime
                );

        }

    }
);


/* =========================================================
   SEEK
   ========================================================= */

seekBar?.addEventListener(
    "input",
    () => {

        if (
            !Number.isFinite(
                audioPlayer.duration
            )
        ) {

            return;

        }

        audioPlayer.currentTime =
            (
                Number(
                    seekBar.value
                ) / 100
            ) *
            audioPlayer.duration;

    }
);


/* =========================================================
   VOLUME
   ========================================================= */

volumeBar?.addEventListener(
    "input",
    () => {

        audioPlayer.volume =
            Number(
                volumeBar.value
            );

    }
);


/* =========================================================
   DOWNLOAD INDIVIDUAL SONG
   ========================================================= */

async function downloadSong(
    song
) {

    try {

        showToast(
            `Preparing ${song.title}...`
        );

        const filename =
            getDownloadFilename(
                song
            );

        const signedUrl =
            await createDownloadUrl(
                song.audio_path,
                filename
            );

        openDownloadUrl(
            signedUrl,
            filename
        );

        showToast(
            "Download started."
        );

    } catch (error) {

        console.error(
            "Download error:",
            error
        );

        showToast(
            error.message ||
            "Could not download this song."
        );

    }
}


/* =========================================================
   DELETE SONG
   ========================================================= */

async function deleteSong(
    song
) {

    if (
        !currentUser ||
        song.user_id !==
        currentUser.id
    ) {

        return;

    }

    const confirmed =
        window.confirm(
            `Delete "${song.title}" from your library?`
        );

    if (!confirmed) {
        return;
    }

    try {

        const storagePaths =
            [];

        if (
            song.audio_path
        ) {

            storagePaths.push(
                song.audio_path
            );

        }

        if (
            song.thumbnail_path
        ) {

            storagePaths.push(
                song.thumbnail_path
            );

        }

        if (
            storagePaths.length > 0
        ) {

            const {
                error:
                    storageError
            } =
                await supabaseClient.storage
                    .from("songs")
                    .remove(
                        storagePaths
                    );

            if (storageError) {
                throw storageError;
            }

        }


        const {
            error:
                databaseError
        } =
            await supabaseClient
                .from("songs")
                .delete()
                .eq(
                    "id",
                    song.id
                )
                .eq(
                    "user_id",
                    currentUser.id
                );

        if (databaseError) {
            throw databaseError;
        }


        if (
            currentSong?.id ===
            song.id
        ) {

            closePlayer();

        }


        songs =
            songs.filter(
                (item) =>
                    item.id !==
                    song.id
            );

        librarySongs =
            librarySongs.filter(
                (item) =>
                    item.song?.id !==
                    song.id
            );

        discoverSongs =
            discoverSongs.filter(
                (item) =>
                    item.id !==
                    song.id
            );


        renderSongs();

        renderDiscoverSongs();


        showToast(
            "Song deleted."
        );


        if (currentPlaylist) {

            await loadPlaylistSongs(
                currentPlaylist.id
            );

        }

    } catch (error) {

        console.error(
            "Delete error:",
            error
        );

        showToast(
            "Could not delete the song."
        );

    }
}


/* =========================================================
   PLAYLISTS
   ========================================================= */

createPlaylistButton?.addEventListener(
    "click",
    () => {

        playlistCreatePanel?.classList.remove(
            "hidden"
        );

        playlistNameInput?.focus();

    }
);


cancelPlaylistButton?.addEventListener(
    "click",
    () => {

        closePlaylistCreatePanel();

    }
);


function closePlaylistCreatePanel() {

    playlistCreatePanel?.classList.add(
        "hidden"
    );

    if (playlistNameInput) {

        playlistNameInput.value =
            "";

    }

}


savePlaylistButton?.addEventListener(
    "click",
    async () => {

        await createPlaylist();

    }
);


playlistNameInput?.addEventListener(
    "keydown",
    async (
        event
    ) => {

        if (
            event.key === "Enter"
        ) {

            event.preventDefault();

            await createPlaylist();

        }

    }
);


async function createPlaylist() {

    if (!currentUser) {
        return;
    }

    const name =
        playlistNameInput.value.trim();

    if (!name) {

        showToast(
            "Enter a playlist name."
        );

        playlistNameInput.focus();

        return;
    }

    savePlaylistButton.disabled =
        true;

    try {

        const {
            data,
            error
        } =
            await supabaseClient
                .from("playlists")
                .insert({
                    user_id:
                        currentUser.id,

                    name:
                        name
                })
                .select()
                .single();

        if (error) {
            throw error;
        }

        playlists.push(
            data
        );

        playlists.sort(
            (
                a,
                b
            ) =>
                new Date(
                    b.created_at
                ) -
                new Date(
                    a.created_at
                )
        );

        renderPlaylists();

        closePlaylistCreatePanel();

        showToast(
            "Playlist created."
        );

    } catch (error) {

        console.error(
            "Create playlist error:",
            error
        );

        showToast(
            error.message ||
            "Could not create playlist."
        );

    } finally {

        savePlaylistButton.disabled =
            false;

    }
}


/* =========================================================
   LOAD PLAYLISTS
   ========================================================= */

async function loadPlaylists() {

    if (!currentUser) {
        return;
    }

    const {
        data,
        error
    } =
        await supabaseClient
            .from("playlists")
            .select(`
                id,
                user_id,
                name,
                created_at
            `)
            .eq(
                "user_id",
                currentUser.id
            )
            .order(
                "created_at",
                {
                    ascending: false
                }
            );

    if (error) {

        console.error(
            "Load playlists error:",
            error
        );

        showToast(
            "Could not load playlists."
        );

        return;
    }

    playlists =
        data || [];

    renderPlaylists();
}


/* =========================================================
   RENDER PLAYLISTS
   ========================================================= */

function renderPlaylists() {

    if (!playlistList) {
        return;
    }

    playlistList.innerHTML =
        "";

    if (playlistCount) {

        playlistCount.textContent =
            `${playlists.length} ${
                playlists.length === 1
                    ? "playlist"
                    : "playlists"
            }`;

    }

    if (
        playlists.length === 0
    ) {

        emptyPlaylistState?.classList.remove(
            "hidden"
        );

        return;
    }

    emptyPlaylistState?.classList.add(
        "hidden"
    );

    playlists.forEach(
        (playlist) => {

            const card =
                document.createElement(
                    "button"
                );

            card.type =
                "button";

            card.className =
                "playlist-card";


            const icon =
                document.createElement(
                    "div"
                );

            icon.className =
                "playlist-icon";

            icon.textContent =
                "♫";


            const info =
                document.createElement(
                    "div"
                );

            info.className =
                "playlist-info";


            const title =
                document.createElement(
                    "strong"
                );

            title.textContent =
                playlist.name;


            const subtitle =
                document.createElement(
                    "span"
                );

            subtitle.textContent =
                "Open playlist";


            info.appendChild(
                title
            );

            info.appendChild(
                subtitle
            );


            const arrow =
                document.createElement(
                    "span"
                );

            arrow.className =
                "playlist-arrow";

            arrow.textContent =
                "›";


            card.appendChild(
                icon
            );

            card.appendChild(
                info
            );

            card.appendChild(
                arrow
            );


            card.addEventListener(
                "click",
                () => {

                    openPlaylist(
                        playlist
                    );

                }
            );


            playlistList.appendChild(
                card
            );

        }
    );
}


/* =========================================================
   OPEN PLAYLIST
   ========================================================= */

async function openPlaylist(
    playlist
) {

    currentPlaylist =
        playlist;

    playlistViewTitle.textContent =
        playlist.name;

    playlistView.classList.remove(
        "hidden"
    );

    document
        .querySelector(
            ".playlists-section"
        )
        ?.classList.add(
            "hidden"
        );

    document
        .querySelector(
            ".library-section"
        )
        ?.classList.add(
            "hidden"
        );

    await loadPlaylistSongs(
        playlist.id
    );
}


/* =========================================================
   CLOSE PLAYLIST
   ========================================================= */

backToPlaylistsButton?.addEventListener(
    "click",
    () => {

        currentPlaylist =
            null;

        playlistSongs =
            [];

        playlistView.classList.add(
            "hidden"
        );

        document
            .querySelector(
                ".playlists-section"
            )
            ?.classList.remove(
                "hidden"
            );

        document
            .querySelector(
                ".library-section"
            )
            ?.classList.remove(
                "hidden"
            );

    }
);


/* =========================================================
   LOAD PLAYLIST SONGS
   ========================================================= */

async function loadPlaylistSongs(
    playlistId
) {

    const {
        data:
            playlistSongRows,
        error:
            playlistSongError
    } =
        await supabaseClient
            .from("playlist_songs")
            .select(`
                id,
                playlist_id,
                song_id,
                created_at
            `)
            .eq(
                "playlist_id",
                playlistId
            )
            .order(
                "created_at",
                {
                    ascending: true
                }
            );

    if (playlistSongError) {

        console.error(
            "Load playlist songs error:",
            playlistSongError
        );

        showToast(
            "Could not load playlist songs."
        );

        return;
    }

    if (
        !playlistSongRows ||
        playlistSongRows.length === 0
    ) {

        playlistSongs =
            [];

        renderPlaylistSongs();

        return;
    }

    const songIds =
        playlistSongRows.map(
            (item) =>
                item.song_id
        );

    const {
        data:
            playlistSongData,
        error:
            songsError
    } =
        await supabaseClient
            .from("songs")
            .select(`
                id,
                user_id,
                title,
                artist_name,
                audio_path,
                thumbnail_path,
                file_size_bytes,
                duration_seconds,
                created_at,
                is_public
            `)
            .in(
                "id",
                songIds
            );

    if (songsError) {

        console.error(
            "Load playlist song details error:",
            songsError
        );

        showToast(
            "Could not load playlist songs."
        );

        return;
    }

    const songMap =
        new Map(
            (playlistSongData || [])
                .map(
                    (song) => [
                        song.id,
                        song
                    ]
                )
        );

    playlistSongs =
        playlistSongRows
            .map(
                (row) => ({

                    playlistSongId:
                        row.id,

                    playlistId:
                        row.playlist_id,

                    songId:
                        row.song_id,

                    createdAt:
                        row.created_at,

                    song:
                        songMap.get(
                            row.song_id
                        )

                })
            )
            .filter(
                (item) =>
                    item.song
            );

    renderPlaylistSongs();
}


/* =========================================================
   RENDER PLAYLIST SONGS
   ========================================================= */

function renderPlaylistSongs() {

    if (!playlistSongList) {
        return;
    }

    playlistSongList.innerHTML =
        "";

    playlistViewCount.textContent =
        `${playlistSongs.length} ${
            playlistSongs.length === 1
                ? "song"
                : "songs"
        }`;

    if (
        playlistSongs.length === 0
    ) {

        emptyPlaylistSongs.classList.remove(
            "hidden"
        );

        playPlaylistButton.disabled =
            true;

        downloadPlaylistButton.disabled =
            true;

        return;
    }

    emptyPlaylistSongs.classList.add(
        "hidden"
    );

    playPlaylistButton.disabled =
        false;

    downloadPlaylistButton.disabled =
        false;


    playlistSongs.forEach(
        (playlistSong) => {

            const song =
                playlistSong.song;

            const card =
                document.createElement(
                    "div"
                );

            card.className =
                "song-card";


            const info =
                document.createElement(
                    "div"
                );

            info.className =
                "song-info";


            const icon =
                document.createElement(
                    "div"
                );

            icon.className =
                "song-icon";

            icon.textContent =
                "♫";


            const details =
                document.createElement(
                    "div"
                );

            details.className =
                "song-details";


            const title =
                document.createElement(
                    "strong"
                );

            title.textContent =
                song.title;


            const metadata =
                document.createElement(
                    "span"
                );

            const parts = [];


            if (
                song.artist_name
            ) {

                parts.push(
                    song.artist_name
                );

            }


            if (
                song.duration_seconds
            ) {

                parts.push(
                    formatTime(
                        song.duration_seconds
                    )
                );

            }


            if (
                song.file_size_bytes
            ) {

                parts.push(
                    formatFileSize(
                        song.file_size_bytes
                    )
                );

            }


            metadata.textContent =
                parts.join(
                    " • "
                );


            details.appendChild(
                title
            );

            details.appendChild(
                metadata
            );


            info.appendChild(
                icon
            );

            info.appendChild(
                details
            );


            const actions =
                document.createElement(
                    "div"
                );

            actions.className =
                "song-actions";


            const playButtonForSong =
                document.createElement(
                    "button"
                );

            playButtonForSong.type =
                "button";

            playButtonForSong.className =
                "song-action-button";

            playButtonForSong.title =
                "Play";

            playButtonForSong.textContent =
                "▶";


            playButtonForSong.addEventListener(
                "click",
                () => {

                    playFromPlaylist(
                        playlistSong
                    );

                }
            );


            const removeButton =
                document.createElement(
                    "button"
                );

            removeButton.type =
                "button";

            removeButton.className =
                "song-action-button";

            removeButton.title =
                "Remove from playlist";

            removeButton.textContent =
                "×";


            removeButton.addEventListener(
                "click",
                () => {

                    removeSongFromPlaylist(
                        playlistSong
                    );

                }
            );


            actions.appendChild(
                playButtonForSong
            );

            actions.appendChild(
                removeButton
            );


            card.appendChild(
                info
            );

            card.appendChild(
                actions
            );


            playlistSongList.appendChild(
                card
            );

        }
    );
}


/* =========================================================
   ADD TO PLAYLIST MODAL
   ========================================================= */

function openAddToPlaylistModal(
    song
) {

    selectedSongForPlaylist =
        song;

    addToPlaylistSongTitle.textContent =
        song.title;

    renderAddToPlaylistList();

    addToPlaylistModal.classList.remove(
        "hidden"
    );
}


function closeAddToPlaylistModal() {

    selectedSongForPlaylist =
        null;

    addToPlaylistModal.classList.add(
        "hidden"
    );
}


closePlaylistModalButton?.addEventListener(
    "click",
    () => {

        closeAddToPlaylistModal();

    }
);


addToPlaylistModal?.addEventListener(
    "click",
    (
        event
    ) => {

        if (
            event.target ===
            addToPlaylistModal
        ) {

            closeAddToPlaylistModal();

        }

    }
);


/* =========================================================
   RENDER MODAL PLAYLISTS
   ========================================================= */

function renderAddToPlaylistList() {

    addToPlaylistList.innerHTML =
        "";

    if (
        playlists.length === 0
    ) {

        const empty =
            document.createElement(
                "p"
            );

        empty.textContent =
            "Create a playlist first.";

        addToPlaylistList.appendChild(
            empty
        );

        return;
    }


    playlists.forEach(
        (playlist) => {

            const item =
                document.createElement(
                    "button"
                );

            item.type =
                "button";

            item.className =
                "modal-playlist-item";


            const icon =
                document.createElement(
                    "div"
                );

            icon.className =
                "modal-playlist-item-icon";

            icon.textContent =
                "♫";


            const text =
                document.createElement(
                    "div"
                );

            text.className =
                "modal-playlist-item-text";


            const name =
                document.createElement(
                    "strong"
                );

            name.textContent =
                playlist.name;


            const subtitle =
                document.createElement(
                    "span"
                );

            subtitle.textContent =
                "Add song";


            text.appendChild(
                name
            );

            text.appendChild(
                subtitle
            );


            item.appendChild(
                icon
            );

            item.appendChild(
                text
            );


            item.addEventListener(
                "click",
                async () => {

                    if (
                        !selectedSongForPlaylist
                    ) {

                        return;

                    }

                    await addSongToPlaylist(
                        playlist.id,
                        selectedSongForPlaylist.id
                    );

                }
            );


            addToPlaylistList.appendChild(
                item
            );

        }
    );
}


/* =========================================================
   ADD SONG TO PLAYLIST
   ========================================================= */

async function addSongToPlaylist(
    playlistId,
    songId
) {

    if (
        !selectedSongForPlaylist
    ) {

        return;

    }

    try {

        const {
            error
        } =
            await supabaseClient
                .from("playlist_songs")
                .insert({
                    playlist_id:
                        playlistId,

                    song_id:
                        songId
                });

        if (error) {

            if (
                error.code ===
                "23505"
            ) {

                showToast(
                    "Song is already in this playlist."
                );

                return;
            }

            throw error;
        }


        const playlist =
            playlists.find(
                (item) =>
                    item.id ===
                    playlistId
            );


        showToast(
            `Added to "${playlist?.name || "playlist"}".`
        );


        closeAddToPlaylistModal();


        if (
            currentPlaylist &&
            currentPlaylist.id ===
            playlistId
        ) {

            await loadPlaylistSongs(
                playlistId
            );

        }

    } catch (error) {

        console.error(
            "Add to playlist error:",
            error
        );

        showToast(
            "Could not add song to playlist."
        );

    }
}


/* =========================================================
   REMOVE SONG FROM PLAYLIST
   ========================================================= */

async function removeSongFromPlaylist(
    playlistSong
) {

    if (!currentPlaylist) {
        return;
    }

    try {

        const {
            error
        } =
            await supabaseClient
                .from("playlist_songs")
                .delete()
                .eq(
                    "id",
                    playlistSong.playlistSongId
                );

        if (error) {
            throw error;
        }


        playlistSongs =
            playlistSongs.filter(
                (item) =>
                    item.playlistSongId !==
                    playlistSong.playlistSongId
            );


        renderPlaylistSongs();


        showToast(
            "Song removed from playlist."
        );

    } catch (error) {

        console.error(
            "Remove playlist song error:",
            error
        );

        showToast(
            "Could not remove song."
        );

    }
}


/* =========================================================
   PLAY PLAYLIST
   ========================================================= */

playPlaylistButton?.addEventListener(
    "click",
    async () => {

        await playPlaylist();

    }
);


async function playPlaylist() {

    if (
        playlistSongs.length === 0
    ) {

        return;

    }

    playbackQueue =
        playlistSongs.map(
            (item) =>
                item.song
        );

    playbackIndex =
        0;

    await playCurrentQueueSong();
}


/* =========================================================
   PLAY SONG FROM PLAYLIST
   ========================================================= */

async function playFromPlaylist(
    playlistSong
) {

    playbackQueue =
        playlistSongs.map(
            (item) =>
                item.song
        );

    playbackIndex =
        playbackQueue.findIndex(
            (song) =>
                song.id ===
                playlistSong.songId
        );

    if (
        playbackIndex === -1
    ) {

        playbackIndex =
            0;

    }

    await playCurrentQueueSong();
}


/* =========================================================
   DOWNLOAD ENTIRE PLAYLIST
   ========================================================= */

downloadPlaylistButton?.addEventListener(
    "click",
    async () => {

        await downloadPlaylist();

    }
);


async function downloadPlaylist() {

    if (
        !currentPlaylist ||
        playlistSongs.length === 0
    ) {

        return;

    }


    if (
        typeof JSZip ===
        "undefined"
    ) {

        showToast(
            "ZIP support is not available."
        );

        return;
    }


    downloadPlaylistButton.disabled =
        true;


    let temporaryZipPath =
        null;


    try {

        const zip =
            new JSZip();


        const folder =
            zip.folder(
                sanitizeFilename(
                    currentPlaylist.name
                ) || "playlist"
            );


        const total =
            playlistSongs.length;


        for (
            let index = 0;
            index < total;
            index++
        ) {

            const playlistSong =
                playlistSongs[index];

            const song =
                playlistSong.song;


            showToast(
                `Preparing ${index + 1}/${total}: ${song.title}`
            );


            const {
                data,
                error
            } =
                await supabaseClient.storage
                    .from("songs")
                    .createSignedUrl(
                        song.audio_path,
                        3600
                    );


            if (error) {
                throw error;
            }


            if (
                !data?.signedUrl
            ) {

                throw new Error(
                    `Could not prepare "${song.title}".`
                );

            }


            const response =
                await fetch(
                    data.signedUrl
                );


            if (!response.ok) {

                throw new Error(
                    `Could not download "${song.title}".`
                );

            }


            const blob =
                await response.blob();


            let filename =
                getDownloadFilename(
                    song
                );


            const existingFiles =
                Object.keys(
                    folder.files
                );


            if (
                existingFiles.some(
                    (file) =>
                        file.endsWith(
                            `/${filename}`
                        )
                )
            ) {

                const extension =
                    getExtensionFromPath(
                        song.audio_path
                    );


                const base =
                    sanitizeFilename(
                        song.title ||
                        "song"
                    );


                filename =
                    `${base} (${index + 1}).${extension}`;

            }


            folder.file(
                filename,
                blob
            );

        }


        showToast(
            "Creating ZIP file..."
        );


        const zipBlob =
            await zip.generateAsync({
                type:
                    "blob",

                compression:
                    "STORE"
            });


        const safePlaylistName =
            sanitizeFilename(
                currentPlaylist.name
            ) || "playlist";


        const uniqueZipName =
            `${safePlaylistName}-${crypto.randomUUID()}.zip`;


        temporaryZipPath =
            `${currentUser.id}/downloads/${uniqueZipName}`;


        const {
            error:
                zipUploadError
        } =
            await supabaseClient.storage
                .from("songs")
                .upload(
                    temporaryZipPath,
                    zipBlob,
                    {
                        contentType:
                            "application/zip",

                        cacheControl:
                            "3600",

                        upsert:
                            false
                    }
                );


        if (zipUploadError) {
            throw zipUploadError;
        }


        showToast(
            "Preparing ZIP download..."
        );


        const signedZipUrl =
            await createDownloadUrl(
                temporaryZipPath,
                `${safePlaylistName}.zip`
            );


        openDownloadUrl(
            signedZipUrl,
            `${safePlaylistName}.zip`
        );


        showToast(
            "Playlist download started."
        );


        const cleanupPath =
            temporaryZipPath;


        setTimeout(
            async () => {

                try {

                    await supabaseClient.storage
                        .from("songs")
                        .remove([
                            cleanupPath
                        ]);

                } catch (cleanupError) {

                    console.warn(
                        "Temporary ZIP cleanup failed:",
                        cleanupError
                    );

                }

            },
            15 * 60 * 1000
        );


        temporaryZipPath =
            null;


    } catch (error) {

        console.error(
            "Playlist download error:",
            error
        );


        if (temporaryZipPath) {

            try {

                await supabaseClient.storage
                    .from("songs")
                    .remove([
                        temporaryZipPath
                    ]);

            } catch (cleanupError) {

                console.warn(
                    "ZIP cleanup error:",
                    cleanupError
                );

            }

        }


        showToast(
            error.message ||
            "Could not download playlist."
        );


    } finally {

        downloadPlaylistButton.disabled =
            false;

    }
}


/* =========================================================
   UPLOAD.JS COMPATIBILITY BRIDGE
   ========================================================= */

window.cloudMusic = {

    getCurrentUser:
        () =>
            currentUser,

    getSongs:
        () =>
            songs,

    getSupabaseClient:
        () =>
            supabaseClient,

    getSupabaseUrl:
        () =>
            SUPABASE_URL,

    getSupabaseKey:
        () =>
            SUPABASE_KEY,

    showToast:
        (message) =>
            showToast(message),

    refreshSongs:
        async () => {

            await loadSongs();

        },

    refreshDiscover:
        async () => {

            await loadDiscoverSongs();

        },

    updateSong:
        (song) => {

            if (
                window.cloudMusicCore &&
                typeof window.cloudMusicCore
                    .updateSong ===
                    "function"
            ) {

                window.cloudMusicCore
                    .updateSong(
                        song
                    );

            }

        }

};


/* =========================================================
   INITIALIZATION
   ========================================================= */

if (volumeBar) {

    volumeBar.value =
        "1";

}

if (audioPlayer) {

    audioPlayer.volume =
        1;

}

checkSession();
