let canvas, context
document.addEventListener("DOMContentLoaded", main, true)
let bestScore = 0
let score = 0
let end = false
//*******************Creating Planet class***********************//
class Planet {
    constructor () {
    }
    x = Math.floor( Math.random() * (WIDTH - 200) * 10) / 10
    y = Math.floor(Math.random() * (HEIGHT - 30) * 10) / 10
    vx = Math.floor(Math.random() * 10) - 4
    vy = Math.floor(Math.random() * 10) - 4
    r = Math.floor(Math.random() * 10) + 10
    d = 500
    m = Math.PI * this.r * this.r * this.d
    color = `#${(Math.random().toString(16) + '000000').substring(2,8).toUpperCase()}`
}
class Sputnik {
    constructor() {
    }
    x = WIDTH - 100
    y = HEIGHT / 2
    vx = 0
    vy = 0
    r = 6
    d = 200
    m = Math.PI * this.r * this.r * this.d
}
//***************************************************************//

let planets = [] // Array of planets
let sputnik
const G = 10 // The universal gravitation constant
let count = 10 // Initial number of planets
let dt = 0.02 // physics step
let HEIGHT = window.innerHeight, WIDTH = window.innerWidth // canvas sizes - full-size
let timer // timer of game
function main () {
    //*********Creating canvas and placing him in web-page*******//
    canvas = document.createElement('canvas')
    canvas.height = HEIGHT
    canvas.width = WIDTH
    canvas.id = 'canvas'
    canvas.style.position = 'absolute'
    canvas.style.top = '0'
    canvas.style.left = '0'
    document.body.appendChild(canvas)
    context = canvas.getContext("2d")
    //***********************************************************//
    let newPlanet;
    sputnik = new Sputnik()
    for (let i = 0; i < count; i++) {
        newPlanet = new Planet()
        planets.push(newPlanet)
    }
    timer = setInterval(Step, dt * 1000)
    function Step() {
        let a, ax, ay, dx, dy, r;
        if (!end && planets.length < 3) {
            for (let i = 0; i < 5; i++) {
                newPlanet = new Planet()
                planets.push(newPlanet)
                score += 1
            }
        } else if (!sputnik) {
            clearInterval(timer)
            gameOver()
        } else {
            // важно провести вычисление каждый с каждым
            for (let i = 0; i < planets.length; i++) // считаем текущей
                for (let j = 0; j < planets.length; j++) // считаем второй
                {
                    if (i === j) continue;
                    dx = planets[j].x - planets[i].x;
                    dy = planets[j].y - planets[i].y;

                    r = dx * dx + dy * dy;// here R^2
                    if (r < 0.1) r = 0.1; // avoid too small number
                    a = G * planets[j].m / 2 / r;

                    r = Math.sqrt(r); // here R
                    ax = a * dx / r; // a * cos
                    ay = a * dy / r; // a * sin

                    planets[i].vx += ax * dt;
                    planets[i].vy += ay * dt;
                    //**********Check for collision*************//
                    let RI = planets[i].r;
                    let RJ = planets[j].r;
                    let XI = planets[i].x;
                    let YI = planets[i].y;
                    let XJ = planets[j].x;
                    let YJ = planets[j].y;
                    if (XI < XJ + 2 * RJ && XI + 2 * RI > XJ && YI < YJ + 2 * RJ && YI + 2 * RI > YJ) {
                        if (planets[i].m > planets[j].m) {
                            planets[i].m += planets[j].m;
                            planets[i].r = Math.sqrt((planets[i].m / (planets[i].d * Math.PI)));
                            planets.splice(j, 1);
                        }
                    }
                    // if(
                    //    (planets[i].x > planets[j].x - 2 * planets[j].r && planets[i].y > planets[j].y - 2 * planets[j].r && planets[i].x < planets[j].x) ||
                    //    (planets[j].x > planets[i].x - 2 * planets[i].r && planets[j].y > planets[i].y - 2 * planets[i].r && planets[i].x - 2 * planets[i].r > planets[j].x - 2 * planets[j].r) ||
                    //    (planets[i].x - 2 * planets[i].r < planets[j].x && planets[i].y > planets[j].y - 2 * planets[j].r && planets[i].x - 2 * planets[i].r > planets[j].x - 2 * planets[j].r) ||
                    //    (planets[i].x > planets[j].x - 2 * planets[j].r && planets[i].y - 2 * planets[i].r < planets[j].y && planets[i].x < planets[j].x)
                    // ) {
                    //     if (planets[i].m > planets[j].m) {
                    //                 planets[i].m += planets[j].m;
                    //                 planets[i].r = Math.sqrt((planets[i].m / (planets[i].d * Math.PI)));
                    //                 planets.splice(j, 1);
                    //             }
                    // }
                }
            for (let i = 0; i < planets.length; i++) {
                if (planets[i].x - 2 * planets[i].r < 0) {
                    planets[i].vx = 15;
                }
                if (planets[i].x > WIDTH) {
                    planets[i].vx = -15;
                }
                if (planets[i].y - 2 * planets[i].r < 0) {
                    planets[i].vy = 15;
                }
                if (planets[i].y > HEIGHT) {
                    planets[i].vy = -15;
                }
                planets[i].x += planets[i].vx * dt;
                planets[i].y += planets[i].vy * dt;
            }
            Draw();
        }

    }
    function Draw(){
        context.fillStyle = "#000000";
        context.fillRect(0, 0, WIDTH, HEIGHT);
        for(let i = 0; i < planets.length; i++){
            context.fillStyle = planets[i].color;
            context.beginPath();
            context.arc(
                planets[i].x - planets[i].r,
                planets[i].y - planets[i].r,
                planets[i].r *3/2,
                0,
                Math.PI * 2
            );
            context.closePath();
            context.fill();
        }
    }
    function gameOver() {
        context.fillStyle = "#919191";
        context.fillRect(WIDTH/2 - WIDTH/10, HEIGHT/2 - HEIGHT/10, WIDTH/5, HEIGHT/5);
        context.fillStyle = "#696868";
        context.fillRect(WIDTH/2 - WIDTH/10 + 5, HEIGHT/2 - HEIGHT/10 + 5, WIDTH/5 - 10, HEIGHT/5 - 10);
        context.fillStyle = "#FFF"
        context.font = "40px serif"
        context.fillText(`Игра окончена`,WIDTH/2 - WIDTH/10 + 50, HEIGHT/2 - HEIGHT/10 + 60)
        context.font = "20px serif"
        context.fillText(`Итог: ${score} баллов! Прошлый рекорд: ${bestScore}`,
        WIDTH/2 - WIDTH/10 + 50, HEIGHT/2 - HEIGHT/10 + 90)
        if (score > bestScore) {
            bestScore = score
            document.cookie = "bestScore = " + bestScore
        }
        context.fillText(`Сыграть снова?`,WIDTH/2 - WIDTH/10 + 50, HEIGHT/2 - HEIGHT/10 + 120)
        context.fillStyle = "#30718d"
        context.fillRect(WIDTH/2 - WIDTH/10 + 200, HEIGHT/2 - HEIGHT/10 + 100, 100, 40)
        context.fillStyle = "#FFF"
        context.fillText(`Сыграть!`,WIDTH/2 - WIDTH/10 + 210, HEIGHT/2 - HEIGHT/10 + 125)
        canvas.addEventListener('click', (e) => {
            let x = e.clientX
            let y = e.clientY
            if ((x > WIDTH/2 - WIDTH/10 + 200 && x < WIDTH/2 - WIDTH/10 + 300) && (y > HEIGHT/2 - HEIGHT/10 + 100 && y < HEIGHT/2 - HEIGHT/10 + 140)) {
                planets.splice(1, 100)
                main()
            }
        })
    }
}
