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
        audio: [""]
        , images: [""]
        , sprites: ["monsterSprite", "PoliceCarSprite"]
    }
    , buildings: [
        
        {
            buildingStyle: 1
            , xPos: 300
            , size: { width: 8, height: 6 }
        }, {
            buildingStyle: 1
            , xPos: 900
            , size: { width: 3, height: 9 }
        }, {
            buildingStyle: 1
            , xPos: 1700
            , size: { width: 5, height: 4 }
        }
        /*{
            buildingStyle: 1
            , xPos: 300
            , size: { width: 3, height: 2 }
        }*/
    ]
    , spawners:[
        {
            type: "PoliceCar"
            , position: { x: 400 }
            , rate: 30000
        }
    ]
};