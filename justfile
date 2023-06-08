default:
  just --list

run_game_bot: build_game_bot
    cd game_bot && npm run start

build_game_bot:
    rm -rf game_bot/compiled_js
    cd game_bot && npm run build

install_game_bot:
    cd game_bot && npm install
    cd game_bot && npm link ../judgement_utils

build_game_server:
    cd game_server && rm -rf /compiled_js
    cd game_server && npm run build

install_game_server:
    cd game_server && npm install
    cd game_server && npm link ../judgement_utils

run_game_server: build_game_server
    cd game_server && npm run start
    

