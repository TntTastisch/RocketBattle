let KEY_SPACE = false;
let KEY_UP = false;
let KEY_DOWN = false;
let canvas;
let ctx;
let backgroundimg = new Image();
let shootDelay = false;
let explosion = new Audio("sounds/explosion.mp3");
explosion.volume = 0.7

let shootSound = new Audio("sounds/shootSound.mp3");
shootSound.volume = 0.5 

let rocket = {
    x: 50,
    y: 200,
    width: 100,
    height: 50,
    src: 'img/rocket.png',
    invincible: true,
};

let ufos = [];
let shots = [];

document.onkeydown = function(e) {
    switch (e.keyCode) {
        case 32:
            KEY_SPACE = true;
            break;
        case 87:
        case 38:
            KEY_UP = true;
            break;
        case 83:
        case 40:
            KEY_DOWN = true;
            break;
        default:
    }
};

document.onkeyup = function(e) {
    switch (e.keyCode) {
        case 32:
            KEY_SPACE = false;
            break;
        case 87:
        case 38:
            KEY_UP = false;
            break;
        case 83:
        case 40:
            KEY_DOWN = false;
            break;
    }
};

function createUfos() {
    let ufo = {
        x: 1300,
        y: Math.random() * 500,
        width: 100,
        height: 40,
        src: 'img/ufo.png',
        img: new Image(),
    };
    ufo.img.src = ufo.src;
    ufos.push(ufo);
}

function startGame() {
    canvas = document.getElementById('playground');
    ctx = canvas.getContext('2d');
    load();
    setTimeout(() => {
        rocket.invincible = false;
    }, 3000);

    setInterval(update, (1 * 1000) / 25);
    setInterval(createUfos, 2 * 1000);
    setInterval(checkCollision, 1 * 1000 / 25);
    setInterval(checkSpace, 1 * 1000 / 25);
    draw();
}

function checkSpace() {
    if (KEY_SPACE) {
        if(!shootDelay) {
            if (!rocket.dead) {
                shootDelay = true;

                let shot = {
                    x: rocket.x + 110,
                    y: rocket.y + 22,
                    width: 20,
                    height: 4,
                    src: 'img/shot.png',
                    img: new Image(),
                };
                shot.img.src = shot.src;
                shootSound.play();
                shots.push(shot);
                setTimeout(() => {
                    shootDelay = false;
                }, 1500);
            }
        }
    }
}

function reset() {
    ufos.pop();
    shots.pop();
    rocket = {
        x: 50,
        y: 200,
        width: 100,
        height: 50,
        src: 'img/rocket.png',
        invincible: true,
    };
    setTimeout(() => {
        rocket.invincible = false;
    }, 3000);
    load();
}

function checkCollision() {
    ufos.forEach(function(ufo) {
        if (!rocket.invincible) {
            if (!ufo.hit) {
                if (
                    rocket.x < ufo.x + ufo.width &&
                    rocket.x + rocket.width > ufo.x &&
                    rocket.y < ufo.y + ufo.height &&
                    rocket.y + rocket.height > ufo.y
                ) {
                    rocket.img.src = 'img/boom.png';
                    rocket.dead = true;
                    explosion.play();
                    ufos = ufos.filter((u) => u != ufo);
                    setTimeout(() => {
                        reset();
                    }, 2000);
                    console.log('[UFO] A collision was found!');
                }
            }
        }

        shots.forEach(function(shot) {
            if (
                shot.x < ufo.x + ufo.width &&
                shot.x + shot.width > ufo.x &&
                shot.y < ufo.y + ufo.height &&
                shot.y + shot.height > ufo.y
            ) {
                ufo.img.src = 'img/boom.png';
                ufo.hit = true;
                explosion.play();
                console.log('[SHOTS] A collision was found!');

                shots = shots.filter((u) => u != shot);

                setTimeout(() => {
                    ufos = ufos.filter((u) => u != ufo);
                }, 2000);
            }
        });
    });
}

function load() {
    backgroundimg.src = 'img/background.jpg';
    rocket.img = new Image();
    rocket.img.src = rocket.src;
}

function update() {
    if (!rocket.dead) {
        if (KEY_UP) {
            if (rocket.y > 0) {
                rocket.y -= 7;
            }
        }

        if (KEY_DOWN) {
            if (!(rocket.y + rocket.height > 718)) {
                rocket.y += 7;
            }
        }
    }

    ufos.forEach(function(ufo) {
        if (!ufo.hit) {
            ufo.x -= 10;
        }
    });

    shots.forEach(function(shot) {
        shot.x += 15;
    });
}

function draw() {
    ctx.drawImage(backgroundimg, 0, 0);
    ctx.drawImage(rocket.img, rocket.x, rocket.y, rocket.width, rocket.height);

    ufos.forEach(function(ufo) {
        ctx.drawImage(ufo.img, ufo.x, ufo.y, ufo.width, ufo.height);
    });

    shots.forEach(function(shot) {
        ctx.drawImage(shot.img, shot.x, shot.y, shot.width, shot.height);
    });

    requestAnimationFrame(draw);
}
