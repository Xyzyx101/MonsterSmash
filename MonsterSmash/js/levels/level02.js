ms.levels.level02 = {
    levelSize: {
        width: 2048
        , height: 768
    }
    , playerSpawn: {
        x: 100
        , y: 100
    }
    , background: {
        image: "images/backgrounds/Background01-half.png"
        , color: { r: 0, g: 0, b: 0 }
    }
    , resources: {
        audio: ["collapse", "eat", "gun", "machineGun", "powerUp", "roar01", "punch"]
        , images: [""]
        , sprites: ["monsterSprite", "PoliceCarSprite", "ProjectileSprite", "PolicemanSprite"]
    }
    , buildings: [
        {
            buildingStyle: 1
            , xPos: 150
            , size: { width: 4, height: 3 }
        }, {
            buildingStyle: 4
            , xPos: 500
            , size: { width: 2, height: 6 }
        }, {
            buildingStyle: 3
            , xPos: 900
            , size: { width: 3, height: 10 }
        }, {
            buildingStyle: 3
            , xPos: 1150
            , size: { width: 3, height: 10 }
        }, {
            buildingStyle: 0
            , xPos: 1700
            , size: { width: 5, height: 4 }
        }
    ]
    , spawners: [
        {
            type: "PoliceCar"
            , position: { x: 400 }
            , rate: 15000
        }, {
            type: "PoliceCar"
            , position: { x: 850 }
            , rate: 22000
        }, {
            type: "PoliceCar"
            , position: { x: 1250 }
            , rate: 22000
        }, {
            type: "PoliceCar"
            , position: { x: 1700 }
            , rate: 15000
        }
    ]
};