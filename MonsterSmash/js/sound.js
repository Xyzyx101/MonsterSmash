ms.sound = (function () {
    var globalSFXVol = 1
        , globalMusicVol = 1
        , sfxCache = []
        , musicCache = []
        , activeMusic = null
    ;

    function play(name) {
        var sfx = sfxCache[name];
        sfx.play();
        return sfx;
    }

    function playMusic(name) {
        if (activeMusic) {
            activeMusic.stop();
        }
        activeMusic = musicCache[name];
        activeMusic.play();
    }

    function stopMusic() {
        if (activeMusic) {
            activeMusic.stop();
        }
    }

    function loadSFX(name, resource) {
        resource = resource || {};
        resource.name = name;
        resource.isLoaded = false;
        sfx = new Howl({
            urls: ["sounds/" + name + ".ogg"
                    , "sounds/" + name + ".mp3"]
            , loop: false
            , volume: 1
            , onload: function () {
                resource.isLoaded = true;
            }
        });
        sfxCache[name] = sfx;
        return resource;
    }

    function loadMusic(name, resource) {
        resource.name = name;
        resource.loaded = false;
        musicCache[name] = new Howl({
            urls: ["sounds/music/" + name + ".ogg"
                    , "sounds/music/" + name + ".mp3"]
            , loop: true
            , volume: 0.65
            , onload: function () {
                resource.loaded = true;
            }
        });
        return resource;
    }

    return {
        play: play
        , stop: stop
        , playMusic: playMusic
        , stopMusic: stopMusic
        , loadSFX: loadSFX
        , loadMusic: loadMusic
    };
})();