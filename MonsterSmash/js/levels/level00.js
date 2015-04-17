ms.levels.level00 = {
    levelSize: {
        width: 2048
        ,height: 768
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
        , sprites: ["monsterSprite", "PoliceCarSprite", "ProjectileSprite"]
    }
    , buildings: [
        {
            buildingStyle: 0
            , xPos: 200
            , size: { width: 8, height: 6 }
        }, {
            buildingStyle: 3
            , xPos: 800
            , size: { width: 3, height: 9 }
        }, {
            buildingStyle: 2
            , xPos: 1150
            , size: { width: 3, height: 2 }
        }, {
            buildingStyle: 2
            , xPos: 1350
            , size: { width: 3, height: 2 }
        }, {
            buildingStyle: 5
            , xPos: 1700
            , size: { width: 5, height: 4 }
        }
    ]
    , spawners:[
        {
            type: "PoliceCar"
            , position: { x: 400 }
            , rate: 30000
        }
    ]
};