/* =========================================================
   CLOUD MUSIC
   UPLOAD SYSTEM
   ========================================================= */

(() => {
    "use strict";


    /* =====================================================
       CORE
       ===================================================== */

    const waitForCore = () => {
        if (!window.cloudMusic) {
            console.error(
                "Cloud Music core is not ready."
            );

            return false;
        }

        return true;
    };


    /* =====================================================
       DOM
       ===================================================== */

    const fileInput =
        document.getElementById("fileInput");

    const uploadButton =
        document.getElementById("uploadButton");

    const selectedAudioName =
        document.getElementById(
            "selectedAudioName"
        );

    const songTitleInput =
        document.getElementById(
            "songTitleInput"
        );

    const artistNameInput =
        document.getElementById(
            "artistNameInput"
        );

    const thumbnailInput =
        document.getElementById(
            "thumbnailInput"
        );

    const thumbnailButton =
        document.getElementById(
            "thumbnailButton"
        );

    const thumbnailPreview =
        document.getElementById(
            "thumbnailPreview"
        );

    const thumbnailPlaceholder =
        document.getElementById(
            "thumbnailPlaceholder"
        );

    const thumbnailPreviewImage =
        document.getElementById(
            "thumbnailPreviewImage"
        );

    const removeThumbnailButton =
        document.getElementById(
            "removeThumbnailButton"
        );

    const startUploadButton =
        document.getElementById(
            "startUploadButton"
        );

    const uploadProgressContainer =
        document.getElementById(
            "uploadProgressContainer"
        );

    const uploadFileName =
        document.getElementById(
            "uploadFileName"
        );

    const uploadPercent =
        document.getElementById(
            "uploadPercent"
        );

    const uploadProgress =
        document.getElementById(
            "uploadProgress"
        );


    /* =====================================================
       STATE
       ===================================================== */

    let selectedAudioFile =
        null;

    let selectedThumbnailFile =
        null;

    let thumbnailPreviewUrl =
        null;

    let uploadInProgress =
        false;


    /* =====================================================
       HELPERS
       ===================================================== */

    function getCore() {
        if (!waitForCore()) {
            throw new Error(
                "Cloud Music core is unavailable."
            );
        }

        return window.cloudMusic;
    }


    function showToast(message) {
        const core =
            getCore();

        core.showToast(message);
    }


    function getCurrentUser() {
        const core =
            getCore();

        return core.getCurrentUser();
    }


    function getSupabaseClient() {
        const core =
            getCore();

        return core.getSupabaseClient();
    }


    function getSupabaseUrl() {
        const core =
            getCore();

        return core.getSupabaseUrl();
    }


    function getSupabaseKey() {
        const core =
            getCore();

        return core.getSupabaseKey();
    }


    function getTitleFromFilename(filename) {

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


    function sanitizeFilename(filename) {

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


    function getExtension(filename) {

        if (
            !filename ||
            !filename.includes(".")
        ) {
            return "audio";
        }

        return filename
            .split(".")
            .pop()
            .toLowerCase();

    }


    function getImageExtension(file) {

        const type =
            file?.type || "";

        if (type === "image/png") {
            return "png";
        }

        if (type === "image/webp") {
            return "webp";
        }

        if (type === "image/gif") {
            return "gif";
        }

        return "jpg";
    }


    /* =====================================================
       AUDIO SELECTION
       ===================================================== */

    uploadButton.addEventListener(
        "click",
        () => {

            if (uploadInProgress) {
                return;
            }

            fileInput.click();

        }
    );


    fileInput.addEventListener(
        "change",
        () => {

            const file =
                fileInput.files?.[0];

            if (!file) {
                return;
            }

            selectedAudioFile =
                file;

            selectedAudioName.textContent =
                file.name;

            songTitleInput.value =
                getTitleFromFilename(
                    file.name
                );

        }
    );


    /* =====================================================
       THUMBNAIL SELECTION
       ===================================================== */

    thumbnailButton.addEventListener(
        "click",
        () => {

            if (uploadInProgress) {
                return;
            }

            thumbnailInput.click();

        }
    );


    thumbnailInput.addEventListener(
        "change",
        () => {

            const file =
                thumbnailInput.files?.[0];

            if (!file) {
                return;
            }

            if (
                !file.type.startsWith(
                    "image/"
                )
            ) {

                showToast(
                    "Please choose an image file."
                );

                thumbnailInput.value =
                    "";

                return;
            }


            selectedThumbnailFile =
                file;


            showThumbnailPreview(
                file
            );

        }
    );


    function showThumbnailPreview(file) {

        if (thumbnailPreviewUrl) {

            URL.revokeObjectURL(
                thumbnailPreviewUrl
            );

        }


        thumbnailPreviewUrl =
            URL.createObjectURL(
                file
            );


        thumbnailPreviewImage.src =
            thumbnailPreviewUrl;


        thumbnailPreviewImage.classList.remove(
            "hidden"
        );


        thumbnailPlaceholder.classList.add(
            "hidden"
        );


        removeThumbnailButton.classList.remove(
            "hidden"
        );

    }


    /* =====================================================
       REMOVE THUMBNAIL
       ===================================================== */

    removeThumbnailButton.addEventListener(
        "click",
        () => {

            selectedThumbnailFile =
                null;

            thumbnailInput.value =
                "";


            if (thumbnailPreviewUrl) {

                URL.revokeObjectURL(
                    thumbnailPreviewUrl
                );

                thumbnailPreviewUrl =
                    null;

            }


            thumbnailPreviewImage.removeAttribute(
                "src"
            );


            thumbnailPreviewImage.classList.add(
                "hidden"
            );


            thumbnailPlaceholder.classList.remove(
                "hidden"
            );


            removeThumbnailButton.classList.add(
                "hidden"
            );

        }
    );


    /* =====================================================
       VALIDATION
       ===================================================== */

    function validateUpload() {

        if (!selectedAudioFile) {

            showToast(
                "Choose an audio file first."
            );

            return false;

        }


        const title =
            songTitleInput.value.trim();


        if (!title) {

            showToast(
                "Enter a song name."
            );

            songTitleInput.focus();

            return false;

        }


        const artist =
            artistNameInput.value.trim();


        if (!artist) {

            showToast(
                "Enter the artist name."
            );

            artistNameInput.focus();

            return false;

        }


        if (
            selectedThumbnailFile &&
            !selectedThumbnailFile.type.startsWith(
                "image/"
            )
        ) {

            showToast(
                "The thumbnail must be an image."
            );

            return false;

        }


        return true;

    }


    /* =====================================================
       UPLOAD BUTTON
       ===================================================== */

    startUploadButton.addEventListener(
        "click",
        async () => {

            if (uploadInProgress) {
                return;
            }


            if (
                !validateUpload()
            ) {
                return;
            }


            await uploadSong();

        }
    );


    /* =====================================================
       MAIN UPLOAD
       ===================================================== */

    async function uploadSong() {

        const user =
            getCurrentUser();


        if (!user) {

            showToast(
                "Please log in first."
            );

            return;

        }


        uploadInProgress =
            true;


        startUploadButton.disabled =
            true;

        uploadButton.disabled =
            true;

        thumbnailButton.disabled =
            true;


        const supabase =
            getSupabaseClient();


        let session;


        try {

            const result =
                await supabase.auth.getSession();


            session =
                result.data?.session;


        } catch (error) {

            console.error(
                "Session error:",
                error
            );

            showToast(
                "Could not verify your session."
            );

            finishUpload();

            return;

        }


        const accessToken =
            session?.access_token;


        if (!accessToken) {

            showToast(
                "Your session expired. Please log in again."
            );

            finishUpload();

            return;

        }


        const audioExtension =
            getExtension(
                selectedAudioFile.name
            );


        const audioStoragePath =
            `${user.id}/${crypto.randomUUID()}.${audioExtension}`;


        let thumbnailStoragePath =
            null;


        let duration =
            null;


        try {

            try {

                duration =
                    await getAudioDuration(
                        selectedAudioFile
                    );

            } catch (error) {

                console.warn(
                    "Could not read audio duration:",
                    error
                );

            }


            showUploadProgress(
                selectedAudioFile.name
            );


            /* =============================================
               AUDIO
               ============================================= */

            await uploadFileWithProgress(
                selectedAudioFile,
                audioStoragePath,
                accessToken,
                updateUploadProgress
            );


            /* =============================================
               THUMBNAIL
               ============================================= */

            if (
                selectedThumbnailFile
            ) {

                const thumbnailExtension =
                    getImageExtension(
                        selectedThumbnailFile
                    );


                thumbnailStoragePath =
                    `${user.id}/thumbnails/${crypto.randomUUID()}.${thumbnailExtension}`;


                await uploadFile(
                    selectedThumbnailFile,
                    thumbnailStoragePath,
                    accessToken
                );

            }


            /* =============================================
               DATABASE
               ============================================= */

            const title =
                songTitleInput.value.trim();


            const artist =
                artistNameInput.value.trim();


            const {
                data,
                error
            } =
                await supabase
                    .from("songs")
                    .insert({

                        user_id:
                            user.id,

                        title:
                            title,

                        artist_name:
                            artist,

                        audio_path:
                            audioStoragePath,

                        thumbnail_path:
                            thumbnailStoragePath,

                        file_size_bytes:
                            selectedAudioFile.size,

                        duration_seconds:
                            duration,

                        is_public:
                            false

                    })
                    .select()
                    .single();


            if (error) {

                throw error;

            }


            /* =============================================
               SUCCESS
               ============================================= */

            showToast(
                "Song uploaded successfully."
            );


            resetUploadForm();


            try {

                await getCore()
                    .refreshSongs();

            } catch (error) {

                console.warn(
                    "Could not refresh library:",
                    error
                );

            }

        } catch (error) {

            console.error(
                "Upload error:",
                error
            );


            /* =============================================
               CLEANUP AUDIO
               ============================================= */

            try {

                await supabase.storage
                    .from("songs")
                    .remove([
                        audioStoragePath
                    ]);

            } catch (cleanupError) {

                console.warn(
                    "Could not remove uploaded audio:",
                    cleanupError
                );

            }


            /* =============================================
               CLEANUP THUMBNAIL
               ============================================= */

            if (
                thumbnailStoragePath
            ) {

                try {

                    await supabase.storage
                        .from("songs")
                        .remove([
                            thumbnailStoragePath
                        ]);

                } catch (cleanupError) {

                    console.warn(
                        "Could not remove uploaded thumbnail:",
                        cleanupError
                    );

                }

            }


            showToast(
                error?.message ||
                "Upload failed."
            );

        } finally {

            finishUpload();

        }

    }


    /* =====================================================
       UPLOAD PROGRESS
       ===================================================== */

    function showUploadProgress(
        filename
    ) {

        uploadProgressContainer.classList.remove(
            "hidden"
        );


        uploadFileName.textContent =
            filename;


        uploadPercent.textContent =
            "0%";


        uploadProgress.style.width =
            "0%";

    }


    function updateUploadProgress(
        percent
    ) {

        uploadPercent.textContent =
            `${percent}%`;


        uploadProgress.style.width =
            `${percent}%`;

    }


    function finishUpload() {

        uploadInProgress =
            false;


        startUploadButton.disabled =
            false;

        uploadButton.disabled =
            false;

        thumbnailButton.disabled =
            false;


        setTimeout(
            () => {

                uploadProgressContainer.classList.add(
                    "hidden"
                );

            },
            800
        );

    }


    /* =====================================================
       AUDIO DURATION
       ===================================================== */

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


                audio.src =
                    url;

            }
        );

    }


    /* =====================================================
       AUDIO UPLOAD WITH PROGRESS
       ===================================================== */

    function uploadFileWithProgress(
        file,
        storagePath,
        accessToken,
        onProgress
    ) {

        return new Promise(
            (
                resolve,
                reject
            ) => {

                const xhr =
                    new XMLHttpRequest();


                const supabaseUrl =
                    getSupabaseUrl();


                const supabaseKey =
                    getSupabaseKey();


                const uploadUrl =
                    `${supabaseUrl}/storage/v1/object/songs/${encodeURIComponent(
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
                    supabaseKey
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

                            return;

                        }


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


                xhr.send(
                    file
                );

            }
        );

    }


    /* =====================================================
       NORMAL FILE UPLOAD
       ===================================================== */

    function uploadFile(
        file,
        storagePath,
        accessToken
    ) {

        return new Promise(
            (
                resolve,
                reject
            ) => {

                const supabaseUrl =
                    getSupabaseUrl();


                const supabaseKey =
                    getSupabaseKey();


                const uploadUrl =
                    `${supabaseUrl}/storage/v1/object/songs/${encodeURIComponent(
                        storagePath
                    )}`;


                const xhr =
                    new XMLHttpRequest();


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
                    supabaseKey
                );


                xhr.setRequestHeader(
                    "x-upsert",
                    "false"
                );


                xhr.onload =
                    () => {

                        if (
                            xhr.status >= 200 &&
                            xhr.status < 300
                        ) {

                            resolve();

                            return;

                        }


                        let message =
                            "Thumbnail upload failed.";


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

                    };


                xhr.onerror =
                    () => {

                        reject(
                            new Error(
                                "Network error during thumbnail upload."
                            )
                        );

                    };


                xhr.send(
                    file
                );

            }
        );

    }


    /* =====================================================
       RESET
       ===================================================== */

    function resetUploadForm() {

        selectedAudioFile =
            null;


        selectedThumbnailFile =
            null;


        fileInput.value =
            "";


        thumbnailInput.value =
            "";


        songTitleInput.value =
            "";


        artistNameInput.value =
            "";


        selectedAudioName.textContent =
            "No audio selected";


        if (thumbnailPreviewUrl) {

            URL.revokeObjectURL(
                thumbnailPreviewUrl
            );

            thumbnailPreviewUrl =
                null;

        }


        thumbnailPreviewImage.removeAttribute(
            "src"
        );


        thumbnailPreviewImage.classList.add(
            "hidden"
        );


        thumbnailPlaceholder.classList.remove(
            "hidden"
        );


        removeThumbnailButton.classList.add(
            "hidden"
        );

    }


})();
