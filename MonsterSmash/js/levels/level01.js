ms.levels.level01 = {
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
        , sprites: ["monsterSprite", "PoliceCarSprite", "ProjectileSprite", "PolicemanSprite"]
    }
    , buildings: [
        {
            buildingStyle: 0
            , xPos: 200
            , size: { width: 4, height: 4 }
        }, {
            buildingStyle: 3
            , xPos: 550
            , size: { width: 3, height: 2 }
        }, {
            buildingStyle: 2
            , xPos: 950
            , size: { width: 3, height: 4 }
        }, {
            buildingStyle: 4
            , xPos: 1200
            , size: { width: 3, height: 2 }
        }, {
            buildingStyle: 1
            , xPos: 1400
            , size: { width: 3, height: 2 }
        }, {
            buildingStyle: 3
            , xPos: 1600
            , size: { width: 2, height: 4 }
        }
    ]
    , spawners: [
        {
            type: "PoliceCar"
            , position: { x: 400 }
            , rate: 20000
        }, {
            type: "PoliceCar"
            , position: { x: 850 }
            , rate: 30000
        }, {
            type: "PoliceCar"
            , position: { x: 1200 }
            , rate: 20000
        }, {
            type: "PoliceCar"
            , position: { x: 1700 }
            , rate: 20000
        }
    ]
};