/**
 * Created by GSN on 6/2/2015.
 */


var res = {
    //font
    FONT_BITMAP_NUMBER_1:"fonts/number_1.fnt",
    FONT_BITMAP_DICE_NUMBER: "fonts/diceNumber.fnt",
    //zcsd
    //screen
    ZCSD_SCREEN_MENU:"zcsd/screen_menu.json",
    ZCSD_SCREEN_NETWORK:"zcsd/screen_network.json",
    ZCSD_SCREEN_LOCALIZATION:"zcsd/screen_localize.json",
    ZCSD_SCREEN_DRAGON_BONES:"zcsd/screen_dragon_bones.json",
    ZCSD_SCREEN_DECRYPTION:"zcsd/screen_decryption.json",
    ZCSD_SCREEN_ZALO:"zcsd/screen_zalo.json",
    //popup
    ZCSD_POPUP_MINI_GAME:"zcsd/game/mini_game/PopupMiniGame.json",

    //images
    Slot1_png : "zcsd/slot1.png",

    ResourceType: {
        gold: "gold",
        elixir: "elixir",
        darkElixir: "darkElixir",
        coin: "coin"
    },


    BattleUI: {
        battleIcon: "res/game/BattleGUI/icon/attack.png",
        battleActionLayer: "game/BattleGUI/BattleMap/SelectedTroopBar/Layer.json",
        battleLobby: "game/BattleGUI/BattleSelection/Node.json",
        endBattle: "game/BattleGUI/BattleMap/EndBattleUI/Layer.json",
        backButton: "game/BattleGUI/icon/button.png",
        battleUserResource: "game/UserResource.json",
        maxStage: 10,
        stage: {
            path: "res/game/BattleGUI/BattleMap/map",
            stage1: "1.map",
            stage2: "2.map",
            stage3: "3.map",
            stage4: "4.map",
            stage5: "5.map",
            stage6: "6.map",
            stage7: "7.map",
            stage8: "8.map",
            stage9: "9.map",
            stage10: "10.map"
        },
        timeTick: 0.025,
        maxTroopTypes: 10,
        effect: {
            path: "res/game/BattleGUI/BattleMap/effect",
            junkConstructs0: "junk_contructs_0.png",
            junkConstructs1: "junk_contructs_1.png",
            junkElixirDrill: "junk_elixirdrill.png",
            junkTownHall: "junk_mainhouse.png",
            junkWall0: "junk_wall_0.png",
            junkWall1: "junk_wall_1.png",
            junkWall2: "junk_wall_2.png",
            cannonBullet: "cannon_bullet.png",
            cannonFire: {
                path: "res/game/BattleGUI/BattleMap/effect/cannon_fire",
                length: 10
            },
            buildingExplosion: {
                path: "res/game/BattleGUI/BattleMap/effect/buildingExplosion",
                length: 11
            },
            attackHit0: {
                path: "res/game/BattleGUI/BattleMap/effect/attackHit0",
                length: 6
            },
            attackHit1: {
                path: "res/game/BattleGUI/BattleMap/effect/attackHit1",
                length: 5
            },
            attackHit2: {
                path: "res/game/BattleGUI/BattleMap/effect/attackHit2",
                length: 5
            },
            cannonHit: {
                path: "res/game/BattleGUI/BattleMap/effect/cannon_hit",
                length: 11
            },
            mortarBulletNormal: {
                path: "res/game/BattleGUI/BattleMap/effect/mortarbullet_normal",
                length: 10
            },
            mortarBulletExplosion: {
                path: "res/game/BattleGUI/BattleMap/effect/mortarbullet_explosion",
                length: 12
            },
            bulletOffset: {
                scale: 40,
                mortar: {
                    x: 0,
                    y: 0.5
                },
                SOUTH: {
                    x: 0,
                    y: -1
                },
                SOUTHWEST: {
                    x: -1,
                    y: -1
                },
                WEST: {
                    x: -1,
                    y: 0
                },
                NORTHWEST: {
                    x: -1,
                    y: 1
                },
                NORTH: {
                    x: 0,
                    y: 1
                },
                NORTHEAST: {
                    x: 1,
                    y: 1
                },
                EAST: {
                    x: 1,
                    y: 0
                },
                SOUTHEAST: {
                    x: 1,
                    y: -1
                }
            }
        },
        defenceType: {
            cannon: 0,
            archerTower: 1,
            mortar: 2,
            airDefence: 3
        },
        bulletSpeed: {
            cannon: 900,
            arrow: 600,
            archer_arrow: 600,
            mortar: 250,
            air: 600,
            mortarGravity: 100,
            mortarZInitial: 100
        }
    },

    Direction: {
        SOUTH: 0,
        SOUTHWEST: 1,
        WEST: 2,
        NORTHWEST: 3,
        NORTH: 4,
        NORTHEAST: -3,
        EAST: -2,
        SOUTHEAST: -1
    },

    MapUI: {
        actionTag: {
            idleAnimated: 1
        },
        infoPopup: "game/MapGUI/InfoPopup/InfoPopup.json",
        upgradePopup: "game/MapGUI/UpgradePopup/Node.json",
        lackOfResPopup: "game/MapGUI/LackOfResPopup/Popup.json",
        lackOfBuilderPopup: "game/MapGUI/LackOfBuilderPopup/Popup.json",
        tmxMap: "res/game/MapGUI/42x42map.tmx",
        grassTileSize: {
            width: 76,
            height: 57
        },
        rootTilePosition: {
            x: 20,
            y: -22
        },
        maxObjectSize: {
            width: 5,
            height: 5
        },

        fixedVariables: {
            headerShiftWhileUpgrading: 80
        },

        upgradeGUIPath: {
            path: "res/game/MapGUI/upgrade_building_gui",
            type: {
                progress_bar: "building_time_bar.png",
                progress_bar_bg: "building_time_bg.png",
                gold_required: "small/gold.png",
                elixir_required: "small/elixir.png",
                darkElixir_required: "small/dElixir.png",
                coin_required: "small/G.png",
                health_bar: "health_bar.png",
                health_bar_bg: "bg_health_bar.png"
            }
        },

        actionWithObject: {
            remove: 1,
            build: 2,
            upgrade: 3
        },

        buildings: {
            path: "res/game/MapGUI/Buildings",
            effectPath: "res/game/MapGUI/Effects",
            effect: {
                upgradingFence: {
                    path: "upgrading.png"
                },
                levelUp: {
                    path: "levelup",
                    animatedList: ["00.png","01.png","02.png","03.png","04.png","05.png","06.png","07.png","08.png","09.png","10.png","11.png"]
                }
            },
            type: {
                ArmyCamp: {
                    name: "AMC_1",
                    animated: ["00.png", "01.png", "02.png", "03.png", "04.png"]
                },
                Barrack: {
                    name: "BAR_1",
                    animated: ["00.png", "01.png", "02.png", "03.png", "04.png"]
                },
                BuilderHut: {
                    name: "BDH_1"
                },
                DarkElixirCollector: {
                    name: "RES_3"
                },
                DarkElixirStorage: {
                    name: "STO_3"
                },
                ElixirCollector: {
                    name: "RES_2",
                    animated: ["00.png", "01.png", "02.png", "03.png", "04.png", "05.png", "06.png", "07.png", "08.png", "09.png"]
                },
                ElixirStorage: {
                    name: "STO_2"
                },
                GoldMine: {
                    name: "RES_1",
                    animated: ["00.png", "01.png", "02.png", "03.png", "04.png", "05.png", "06.png", "07.png", "08.png", "09.png"]
                },
                GoldStorage: {
                    name: "STO_1"
                },
                Laboratory: {
                    name: "LAB_1"
                },
                Obstacle: {
                    name: "OBS"
                },
                TownHall: {
                    name: "TOW_1"
                },
                Wall: {
                    name: "WAL_1"
                },
                Cannon: {
                    name: "DEF_1",
                    animated: ["image0000.png", "image0001.png", "image0002.png", "image0003.png", "image0004.png"],
                    attackLen: 7
                },
                ArcherTower: {
                    name: "DEF_2",
                    animated: ["image0000.png", "image0001.png", "image0002.png", "image0003.png", "image0004.png"],
                    attackLen: 13
                },
                Mortar: {
                    name: "DEF_3",
                    animated: ["image0000.png", "image0001.png", "image0002.png", "image0003.png", "image0004.png"],
                    attackLen: 5
                },
                AirDefense: {
                    name: "DEF_5",
                    animated: ["image0000.png", "image0001.png", "image0002.png", "image0003.png", "image0004.png"],
                    attackLen: 5
                }
            },

            id: {
                newBuilding: 100000,
                unavailable: -2,
                grass: -1
            }

        },

        action: {
            path: "res/game/MapGUI/Action_Building_Icon",
            height: 150,
            actionSpace: 40,
            type: {
                share: {
                    path: "btn_share.png",
                    name: "share",
                    vname: "Chia sẻ"
                },
                upgrade: {
                    path: "upgrade_icon.png",
                    name: "upgrade",
                    vname: "Nâng cấp"
                },
                info: {
                    path: "info_icon.png",
                    name: "info",
                    vname: "Thông tin"
                },
                remove: {
                    path: "remove_icon.png",
                    name: "remove",
                    vname: "Phá bỏ"
                },
                train_troop: {
                    path: "train_icon.png",
                    name: "train_troop",
                    vname: "Huấn luyện"
                },
                quick_finish: {
                    path: "quick_finish.png",
                    name: "quick_finish",
                    vname: "Xong ngay"
                },
                cancel: {
                    path: "cancel_icon.png",
                    name: "cancel",
                    vname: "Hủy"
                }
            },


            buildAction: {
                type: {
                    accept: {
                        path: "accept.png",
                        name: "accept"
                    },
                    cancel: {
                        path: "cancel.png",
                        name: "cancel"
                    }
                }
            }
        },

        buildingAttribute: {
            path: "res/game/MapGUI/upgrade_building_gui/small",
            troopCapacity: {
                name: "Sức chứa lính",
                iconPath: "TroopCapacity_Icon.png"
            },
            goldCapacity: {
                name: "Sức chứa vàng",
                iconPath: "Gold_Capacity_Icon.png"
            },
            goldProductionRate: {
                name: "Sản lượng vàng",
                iconPath: "Gold_ProductionRate_Icon.png"
            },
            elixirCapacity: {
                name: "Sức chứa dầu",
                iconPath: "Elixir_Capacity_Icon.png"
            },
            elixirProductionRate: {
                name: "Sản lượng dầu",
                iconPath: "Elixir_ProductionRate_Icon.png"
            },
            hitpoints: {
                name: "Máu",
                iconPath: "Hitpoints_Icon.png"
            },
            damage: {
                name: "Sát thương",
                iconPath: "DAMA_DEF.png"
            }
        },

        zPosition: {
            background: -100,
            grass: -99,
            greenred: -98,
            invisible: -101,
            arrow: 1000,
            progressBar: 1002,
            progressBackground: 1001,
            button: 1003,
            resourceRequired: 1004,
            buildingAttribute: 1005,
            shopFrame: 1100
        },
        background: {
            backgroundLayer: [
                "res/game/MapGUI/layer1.png",
                "res/game/MapGUI/layer2.png",
                "res/game/MapGUI/layer3.png",
                "res/game/MapGUI/layer4.png"
            ],
            path: "res/game/MapGUI/BG",
            name: {
                arrow: "arrowmove",
                grass: "grass",
                obsgrass: "obsgrass",
                greenred: "GREEN",
                red: "RED"
            },
            scale: {
                backgroundLayer: 40 * 1.36,
                grass: 2,
                nameString: 2
            }
        }

    },
    TroopUI: {
        troopName: {
            ARM_1: "Chiến binh",
            ARM_2: "Cung thủ",
            ARM_4: "Gã khổng lồ",
            ARM_6: "Bom bay"
        }
    },
    Troop: {
        name: {
            barrack: "ARM_1",
            archer: "ARM_2",
            giant: "ARM_4",
            flyingBomb: "ARM_6"
        }
    }
};

var g_resources = [
    "CloseNormal.png",
    "CloseSelected.png",
    "game/animation/character/chipu/skeleton.xml",
    "game/animation/eff_dice_number/skeleton.xml",
    "game/animation/effDiceNumber/skeleton.xml",
    "game/animation/firework_test/skeleton.xml",
    "game/animation/ruongngusac/skeleton.xml",
    "game/animation/Dragon/skeleton.json",
    "game/animation/DragonBoy/skeleton.json",
    "game/animation/lobby_girl/skeleton.xml",
    "config.json",
    "Default/Button_Disable.png",
    "Default/Button_Normal.png",
    "Default/Button_Press.png",

    "favicon.ico",
    "HelloWorld.png",
    "fonts/diceNumber.fnt",
    "fonts/diceNumber.png",
    "fonts/eff_number.fnt",
    "fonts/eff_number.png",
    "fonts/number_1.fnt",
    "fonts/number_1.png",
    "game/animation/character/chipu/texture.plist",
    "game/animation/character/chipu/texture.png",
    "game/animation/eff_dice_number/texture.plist",
    "game/animation/eff_dice_number/texture.png",
    "game/animation/effDiceNumber/texture.plist",
    "game/animation/effDiceNumber/texture.png",
    "game/animation/firework_test/texture.plist",
    "game/animation/firework_test/texture.png",
    "game/animation/ruongngusac/texture.xml",
    "game/animation/ruongngusac/texture.png",
    "game/animation/Dragon/texture.json",
    "game/animation/Dragon/texture.png",
    "game/animation/DragonBoy/texture.json",
    "game/animation/DragonBoy/texture.png",
    "game/animation/lobby_girl/texture.plist",
    "game/animation/lobby_girl/texture.png",
    "ipConfig.json",
    "localize/config.json",
    "localize/vi.txt",
    "localize/en.txt",
    "shaders/change_color.fsh",
    "zcsd/screen_decryption.json",
    "zcsd/screen_dragon_bones.json",
    "zcsd/screen_localize.json",
    "zcsd/screen_menu.json",
    "zcsd/screen_network.json",
    "zcsd/screen_zalo.json"
];
