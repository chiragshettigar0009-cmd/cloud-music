/* =========================================================
   CLOUD MUSIC v1.1
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

let playlists = [];

let currentPlaylist = null;

let playlistSongs = [];

let selectedSongForPlaylist = null;


/*
    Playback queue.

    Library:
        playbackQueue = songs

    Playlist:
        playbackQueue = playlist songs

    This lets the player use the same controls
    for both library and playlists.
*/

let playbackQueue = [];

let playbackIndex = -1;

let currentSong = null;


/* =========================================================
   DOM ELEMENTS
   ========================================================= */

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


/* Upload */

const fileInput =
    document.getElementById("fileInput");

const uploadButton =
    document.getElementById("uploadButton");

const uploadProgressContainer =
    document.getElementById(
        "uploadProgressContainer"
    );

const uploadFileName =
    document.getElementById("uploadFileName");

const uploadPercent =
    document.getElementById("uploadPercent");

const uploadProgress =
    document.getElementById("uploadProgress");


/* Library */

const songCount =
    document.getElementById("songCount");

const refreshButton =
    document.getElementById("refreshButton");

const loading =
    document.getElementById("loading");

const emptyState =
    document.getElementById("emptyState");

const songList =
    document.getElementById("songList");


/* Playlists */

const playlistCount =
    document.getElementById("playlistCount");

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


/* Playlist view */

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


/* Add to playlist modal */

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


/* Player */

const player =
    document.getElementById("player");

const audioPlayer =
    document.getElementById("audioPlayer");

const playerTitle =
    document.getElementById("playerTitle");

const playerStatus =
    document.getElementById("playerStatus");

const previousButton =
    document.getElementById(
        "previousButton"
    );

const playButton =
    document.getElementById("playButton");

const nextButton =
    document.getElementById("nextButton");

const currentTime =
    document.getElementById(
        "currentTime"
    );

const totalTime =
    document.getElementById(
        "totalTime"
    );

const seekBar =
    document.getElementById("seekBar");

const volumeBar =
    document.getElementById("volumeBar");


/* Toast */

const toast =
    document.getElementById("toast");


/* =========================================================
   AUTH MODE
   ========================================================= */

let loginMode = true;


/* =========================================================
   HELPERS
   ========================================================= */

function showToast(message) {

    toast.textContent = message;

    toast.classList.add("show");

    clearTimeout(
        showToast.timeout
    );

    showToast.timeout =
        setTimeout(() => {

            toast.classList.remove(
                "show"
            );

        }, 3000);
}


function showAuthMessage(
    message,
    isError = true
) {

    authMessage.textContent =
        message;

    authMessage.classList.toggle(
        "error",
        isError
    );
}


function formatTime(seconds) {

    if (
        !Number.isFinite(seconds) ||
        seconds < 0
    ) {
        return "0:00";
    }

    const minutes =
        Math.floor(seconds / 60);

    const remainingSeconds =
        Math.floor(seconds % 60);

    return `${minutes}:${String(
        remainingSeconds
    ).padStart(2, "0")}`;
}


function formatFileSize(bytes) {

    if (!bytes) {
        return "0 B";
    }

    if (bytes < 1024) {
        return `${bytes} B`;
    }

    if (bytes < 1024 * 1024) {

        return `${(
            bytes / 1024
        ).toFixed(1)} KB`;

    }

    if (bytes < 1024 * 1024 * 1024) {

        return `${(
            bytes /
            (1024 * 1024)
        ).toFixed(1)} MB`;

    }

    return `${(
        bytes /
        (1024 * 1024 * 1024)
    ).toFixed(1)} GB`;
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
        .replace(/[_-]+/g, " ")
        .trim();
}


function sanitizeFilename(
    filename
) {

    return filename
        .replace(/[<>:"/\\|?*\x00-\x1F]/g, "_")
        .replace(/\s+/g, " ")
        .trim()
        .slice(0, 180);
}


function getExtensionFromPath(
    path
) {

    const filename =
        path.split("/").pop();

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
            song.title || "song"
        );

    if (!title) {
        title = "song";
    }

    return `${title}.${extension}`;
}


/* =========================================================
   APK / WEBVIEW DOWNLOAD HELPER
   ========================================================= */

/*
    IMPORTANT:

    Do NOT use:

        fetch()
        -> blob()
        -> URL.createObjectURL()
        -> <a download>

    for downloads.

    Android WebViews frequently handle that badly.

    Instead we give the WebView a real HTTPS URL.
    Supabase's signed URL can explicitly request
    download behavior.
*/

function openDownloadUrl(
    url,
    filename
) {

    if (!url) {
        throw new Error(
            "No download URL was created."
        );
    }


    /*
        First try a normal anchor using the real
        HTTPS URL.

        The server-side download response from
        Supabase is what tells the WebView that
        this is a downloadable file.
    */

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


/*
    Creates a signed Supabase URL configured
    to trigger a download.

    The bucket stays PRIVATE.
*/

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
   AUTH
   ========================================================= */

authModeButton.addEventListener(
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


authForm.addEventListener(
    "submit",
    async (event) => {

        event.preventDefault();

        const email =
            emailInput.value.trim();

        const password =
            passwordInput.value;

        if (!email || !password) {
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

            currentUser = null;

            showAuthScreen();

        }
    }
);


function showAuthScreen() {

    authScreen.classList.remove(
        "hidden"
    );

    app.classList.add(
        "hidden"
    );

    player.classList.add(
        "hidden"
    );
}


async function enterApp(user) {

    currentUser = user;

    authScreen.classList.add(
        "hidden"
    );

    app.classList.remove(
        "hidden"
    );

    userEmail.textContent =
        user.email || "";

    await loadSongs();

    await loadPlaylists();
}


/* =========================================================
   LOGOUT
   ========================================================= */

logoutButton.addEventListener(
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

        currentUser = null;

        songs = [];

        playlists = [];

        currentPlaylist = null;

        playlistSongs = [];

        playbackQueue = [];

        playbackIndex = -1;

        currentSong = null;

        audioPlayer.pause();

        audioPlayer.removeAttribute(
            "src"
        );

        audioPlayer.load();

        showAuthScreen();

    }
);


/* =========================================================
   UPLOAD
   ========================================================= */

uploadButton.addEventListener(
    "click",
    () => {

        fileInput.click();

    }
);


fileInput.addEventListener(
    "change",
    async () => {

        const file =
            fileInput.files[0];

        if (!file) {
            return;
        }

        await uploadSong(file);

        fileInput.value = "";

    }
);


async function uploadSong(file) {

    if (!currentUser) {

        showToast(
            "Please log in first."
        );

        return;
    }


    /*
        IMPORTANT:

        The publishable key is NOT used as
        the user's Authorization token.

        We get the actual logged-in user's
        access token here.
    */

    const {
        data: {
            session
        }
    } =
        await supabaseClient.auth
            .getSession();

    const accessToken =
        session?.access_token;

    if (!accessToken) {

        showToast(
            "Your session expired. Please log in again."
        );

        return;
    }


    const extension =
        file.name.includes(".")
            ? file.name
                .split(".")
                .pop()
                .toLowerCase()
            : "audio";


    const uniqueName =
        `${crypto.randomUUID()}.${extension}`;


    const storagePath =
        `${currentUser.id}/${uniqueName}`;


    let duration = null;


    try {

        duration =
            await getAudioDuration(file);

    } catch (error) {

        console.warn(
            "Could not read audio duration:",
            error
        );

    }


    uploadButton.disabled =
        true;

    uploadProgressContainer.classList.remove(
        "hidden"
    );

    uploadFileName.textContent =
        file.name;

    uploadPercent.textContent =
        "0%";

    uploadProgress.style.width =
        "0%";


    try {

        await uploadFileWithProgress(
            file,
            storagePath,
            accessToken,
            (percent) => {

                uploadPercent.textContent =
                    `${percent}%`;

                uploadProgress.style.width =
                    `${percent}%`;

            }
        );


        const {
            data,
            error
        } =
            await supabaseClient
                .from("songs")
                .insert({
                    user_id:
                        currentUser.id,

                    title:
                        getTitleFromFilename(
                            file.name
                        ),

                    audio_path:
                        storagePath,

                    file_size_bytes:
                        file.size,

                    duration_seconds:
                        duration
                })
                .select()
                .single();


        if (error) {

            await supabaseClient.storage
                .from("songs")
                .remove([
                    storagePath
                ]);

            throw error;
        }


        songs.unshift(data);

        renderSongs();

        showToast(
            "Song uploaded successfully."
        );


    } catch (error) {

        console.error(
            "Upload error:",
            error
        );

        showToast(
            error.message ||
            "Upload failed."
        );


    } finally {

        uploadButton.disabled =
            false;

        setTimeout(() => {

            uploadProgressContainer.classList.add(
                "hidden"
            );

        }, 800);

    }
}


function getAudioDuration(file) {

    return new Promise(
        (resolve, reject) => {

            const audio =
                document.createElement(
                    "audio"
                );

            const url =
                URL.createObjectURL(
                    file
                );

            audio.preload =
                "metadata";

            audio.onloadedmetadata =
                () => {

                    const duration =
                        Math.round(
                            audio.duration
                        );

                    URL.revokeObjectURL(
                        url
                    );

                    resolve(
                        Number.isFinite(
                            duration
                        )
                            ? duration
                            : null
                    );

                };

            audio.onerror =
                () => {

                    URL.revokeObjectURL(
                        url
                    );

                    reject(
                        new Error(
                            "Could not read audio metadata."
                        )
                    );

                };

            audio.src = url;

        }
    );
}


/*
    XHR is intentionally used here because
    it allows upload progress.

    The Authorization header MUST contain
    the user's access token.
*/

function uploadFileWithProgress(
    file,
    storagePath,
    accessToken,
    onProgress
) {

    return new Promise(
        (resolve, reject) => {

            const xhr =
                new XMLHttpRequest();


            const uploadUrl =
                `${SUPABASE_URL}/storage/v1/object/songs/${encodeURIComponent(
                    storagePath
                )}`;


            xhr.open(
                "POST",
                uploadUrl,
                true
            );


            xhr.setRequestHeader(
                "Authorization",
                `Bearer ${accessToken}`
            );


            xhr.setRequestHeader(
                "apikey",
                SUPABASE_KEY
            );


            xhr.setRequestHeader(
                "x-upsert",
                "false"
            );


            xhr.upload.onprogress =
                (event) => {

                    if (
                        event.lengthComputable
                    ) {

                        const percent =
                            Math.round(
                                (
                                    event.loaded /
                                    event.total
                                ) * 100
                            );

                        onProgress(
                            percent
                        );

                    }

                };


            xhr.onload =
                () => {

                    if (
                        xhr.status >= 200 &&
                        xhr.status < 300
                    ) {

                        resolve();

                    } else {

                        let message =
                            "Upload failed.";

                        try {

                            const response =
                                JSON.parse(
                                    xhr.responseText
                                );

                            if (
                                response.message
                            ) {

                                message =
                                    response.message;

                            }

                        } catch (error) {
                            // Ignore invalid JSON.
                        }

                        reject(
                            new Error(
                                message
                            )
                        );

                    }

                };


            xhr.onerror =
                () => {

                    reject(
                        new Error(
                            "Network error during upload."
                        )
                    );

                };


            xhr.onabort =
                () => {

                    reject(
                        new Error(
                            "Upload cancelled."
                        )
                    );

                };


            xhr.send(file);

        }
    );
}


/* =========================================================
   LOAD SONGS
   ========================================================= */

refreshButton.addEventListener(
    "click",
    async () => {

        await loadSongs();

    }
);


async function loadSongs() {

    if (!currentUser) {
        return;
    }

    loading.classList.remove(
        "hidden"
    );

    emptyState.classList.add(
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
                audio_path,
                file_size_bytes,
                duration_seconds,
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


    loading.classList.add(
        "hidden"
    );


    if (error) {

        console.error(
            "Load songs error:",
            error
        );

        showToast(
            "Could not load your music."
        );

        return;
    }


    songs = data || [];

    renderSongs();
}


/* =========================================================
   RENDER SONGS
   ========================================================= */

function renderSongs() {

    songList.innerHTML = "";

    songCount.textContent =
        `${songs.length} ${
            songs.length === 1
                ? "song"
                : "songs"
        }`;


    if (songs.length === 0) {

        emptyState.classList.remove(
            "hidden"
        );

        return;

    }


    emptyState.classList.add(
        "hidden"
    );


    songs.forEach(
        (song) => {

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
                parts.join(" • ");


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

                    playFromLibrary(
                        song
                    );

                }
            );


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
                playButtonForSong
            );

            actions.appendChild(
                playlistButton
            );

            actions.appendChild(
                downloadButton
            );

            actions.appendChild(
                deleteButton
            );


            card.appendChild(
                info
            );

            card.appendChild(
                actions
            );


            songList.appendChild(
                card
            );

        }
    );
}


/* =========================================================
   PLAYBACK
   ========================================================= */

async function playFromLibrary(song) {

    playbackQueue =
        [...songs];

    playbackIndex =
        playbackQueue.findIndex(
            (item) =>
                item.id === song.id
        );


    if (playbackIndex === -1) {
        playbackIndex = 0;
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


async function playSong(song) {

    if (!song) {
        return;
    }


    player.classList.remove(
        "hidden"
    );


    playerTitle.textContent =
        song.title;

    playerStatus.textContent =
        "Loading...";


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


        if (!data?.signedUrl) {

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


        playerStatus.textContent =
            "Playing";

        playButton.textContent =
            "❚❚";


    } catch (error) {

        console.error(
            "Playback error:",
            error
        );

        playerStatus.textContent =
            "Unable to play";

        showToast(
            "Could not play this song."
        );

    }
}


/* Player play/pause */

playButton.addEventListener(
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

                playerStatus.textContent =
                    "Playing";

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

            playerStatus.textContent =
                "Paused";

            playButton.textContent =
                "▶";

        }

    }
);


/* Previous */

previousButton.addEventListener(
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


/* Next */

nextButton.addEventListener(
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


/* Automatic next song */

audioPlayer.addEventListener(
    "ended",
    async () => {

        if (
            playbackIndex <
            playbackQueue.length - 1
        ) {

            playbackIndex++;

            await playCurrentQueueSong();

        } else {

            playButton.textContent =
                "▶";

            playerStatus.textContent =
                "Finished";

        }

    }
);


/* Audio loading */

audioPlayer.addEventListener(
    "loadedmetadata",
    () => {

        totalTime.textContent =
            formatTime(
                audioPlayer.duration
            );

        seekBar.value =
            "0";

    }
);


/* Current time */

audioPlayer.addEventListener(
    "timeupdate",
    () => {

        const duration =
            audioPlayer.duration;

        if (
            Number.isFinite(duration) &&
            duration > 0
        ) {

            const percentage =
                (
                    audioPlayer.currentTime /
                    duration
                ) * 100;

            seekBar.value =
                percentage;

        }


        currentTime.textContent =
            formatTime(
                audioPlayer.currentTime
            );

    }
);


/* Seek */

seekBar.addEventListener(
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


/* Volume */

volumeBar.addEventListener(
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

async function downloadSong(song) {

    try {

        showToast(
            `Preparing ${song.title}...`
        );


        /*
            IMPORTANT:

            We no longer fetch the file into a
            browser Blob.

            Supabase creates a real HTTPS signed
            URL with download behavior enabled.
        */

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

async function deleteSong(song) {

    const confirmed =
        window.confirm(
            `Delete "${song.title}" from your library?`
        );


    if (!confirmed) {
        return;
    }


    try {

        const {
            error:
                storageError
        } =
            await supabaseClient.storage
                .from("songs")
                .remove([
                    song.audio_path
                ]);


        if (storageError) {
            throw storageError;
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

            audioPlayer.pause();

            audioPlayer.removeAttribute(
                "src"
            );

            audioPlayer.load();

            currentSong = null;

            player.classList.add(
                "hidden"
            );

        }


        songs =
            songs.filter(
                (item) =>
                    item.id !== song.id
            );


        renderSongs();

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

createPlaylistButton.addEventListener(
    "click",
    () => {

        playlistCreatePanel.classList.remove(
            "hidden"
        );

        playlistNameInput.focus();

    }
);


cancelPlaylistButton.addEventListener(
    "click",
    () => {

        closePlaylistCreatePanel();

    }
);


function closePlaylistCreatePanel() {

    playlistCreatePanel.classList.add(
        "hidden"
    );

    playlistNameInput.value =
        "";

}


savePlaylistButton.addEventListener(
    "click",
    async () => {

        await createPlaylist();

    }
);


playlistNameInput.addEventListener(
    "keydown",
    async (event) => {

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


function renderPlaylists() {

    playlistList.innerHTML =
        "";


    playlistCount.textContent =
        `${playlists.length} ${
            playlists.length === 1
                ? "playlist"
                : "playlists"
        }`;


    if (playlists.length === 0) {

        emptyPlaylistState.classList.remove(
            "hidden"
        );

        return;

    }


    emptyPlaylistState.classList.add(
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
        .classList.add(
            "hidden"
        );


    document
        .querySelector(
            ".library-section"
        )
        .classList.add(
            "hidden"
        );


    await loadPlaylistSongs(
        playlist.id
    );
}


/* =========================================================
   CLOSE PLAYLIST
   ========================================================= */

backToPlaylistsButton.addEventListener(
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
            .classList.remove(
                "hidden"
            );


        document
            .querySelector(
                ".library-section"
            )
            .classList.remove(
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
                audio_path,
                file_size_bytes,
                duration_seconds,
                created_at
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
                parts.join(" • ");


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
   ADD SONG TO PLAYLIST MODAL
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


closePlaylistModalButton.addEventListener(
    "click",
    () => {

        closeAddToPlaylistModal();

    }
);


addToPlaylistModal.addEventListener(
    "click",
    (event) => {

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


    if (playlists.length === 0) {

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
                    item.id === playlistId
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

playPlaylistButton.addEventListener(
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


    if (playbackIndex === -1) {

        playbackIndex =
            0;

    }


    await playCurrentQueueSong();
}


/* =========================================================
   DOWNLOAD ENTIRE PLAYLIST
   ========================================================= */

downloadPlaylistButton.addEventListener(
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


            /*
                Fetching here is intentional.

                We need the actual audio bytes to
                construct the ZIP.

                The final ZIP download itself will
                NOT use a blob URL.
            */

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
                type: "blob",
                compression: "STORE"
            });


        /*
            -------------------------------------------------
            IMPORTANT APK FIX
            -------------------------------------------------

            Do NOT download this ZIP through:

                URL.createObjectURL(zipBlob)

            Android WebViews often don't handle that
            correctly.

            Instead we temporarily upload the ZIP to
            the user's own private Supabase folder.

            Then we create a real HTTPS signed URL
            with download behavior enabled.

            The WebView can then hand the HTTPS
            download to Android's download system.
        */

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


        /*
            Send the REAL HTTPS URL to the
            WebView instead of a blob URL.
        */

        openDownloadUrl(
            signedZipUrl,
            `${safePlaylistName}.zip`
        );


        showToast(
            "Playlist download started."
        );


        /*
            Do not delete immediately.

            The Android download manager may
            still be starting the transfer.

            Clean it up after 15 minutes.
        */

        setTimeout(
            async () => {

                try {

                    await supabaseClient.storage
                        .from("songs")
                        .remove([
                            temporaryZipPath
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


        /*
            If something failed after the ZIP was
            uploaded, clean it up immediately.
        */

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
   INITIALIZATION
   ========================================================= */

volumeBar.value =
    "1";

audioPlayer.volume =
    1;


checkSession();
