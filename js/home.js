/**
 * Debug
 */


let stats = new Stats();
stats.showPanel(0);
//document.body.appendChild(stats.dom);


/**
 * Tools
 */


const lerp = (x, y, a) => x * (1 - a) + y * a;
const clamp = (a, min = 0, max = 1) => Math.min(max, Math.max(min, a));
const invlerp = (x, y, a) => clamp((a - x) / (y - x));
const range = (x1, y1, x2, y2, a) => lerp(x2, y2, invlerp(x1, y1, a));


const shortAngleDist = (a0, a1) => {
    var max = Math.PI * 2;
    var da = (a1 - a0) % max;
    return 2 * da % max - da;
}

const angleLerp = (a0, a1, t) => {
    return a0 + shortAngleDist(a0, a1) * t;
}


Math.average = function(input) {
    this.output = 0;
    for (this.i = 0; this.i < input.length; this.i++) {
        this.output += Number(input[this.i]);
    }
    return this.output / input.length;
}


const lerpColor = function(a, b, amount) {
    const ar = a >> 16,
        ag = a >> 8 & 0xff,
        ab = a & 0xff,

        br = b >> 16,
        bg = b >> 8 & 0xff,
        bb = b & 0xff,

        rr = ar + amount * (br - ar),
        rg = ag + amount * (bg - ag),
        rb = ab + amount * (bb - ab);

    return (rr << 16) + (rg << 8) + (rb | 0);
};

/**
 * Tracks
 */

const tracks = [{
    name: "HOUSTON ",
    sub: "intro",
    url: "01",
}, {
    name: "ASTRONAUTE",
    sub: " ",
    url: "02",
}, {
    name: "SOLAAR PLEURE",
    sub: " ",
    url: "03",
}, {
    name: "GOSPEL",
    sub: " ",
    url: "04",
}, {
    name: "KASH",
    sub: "feat. Lefa & Dinos",
    url: "05",
}, {
    name: "BAGARRER",
    sub: "",
    url: "06",
}, {
    name: "MARYAM",
    sub: " ",
    url: "07",
}, {
    name: "NEPTUNE TERMINUS",
    sub: " ",
    url: "08",
}, {
    name: "INTERSTELLAR",
    sub: "feat. Gaël Faye",
    url: "09",
}, {
    name: "MON ROI",
    sub: " ",
    url: "10",
}, {
    name: "AMBITION",
    sub: "GUINÉE CONAKRY",
    url: "11",
}, {
    name: "COLLISION",
    sub: "feat Josman",
    url: "12",
}, {
    name: "Après-soirée",
    sub: "feat. Jok’Air",
    url: "13",
}, {
    name: "A CHAQUE JOUR…",
    sub: " ",
    url: "14",
}, {
    name: "Boomerang",
    sub: "Bonus digipack",
    url: "15",
}, {
    name: "La fin du monde",
    sub: "Bonus digipack",
    url: "16",
}]



const objectsToTest = []


var camera, cloudParticles = [];
let stars = [];
let cible;
let cibleView;
let cibleMove;
let neptune;

let step = "start"

let start = new THREE.Vector3(450, 0, 0)
let targetPos = new THREE.Vector3(0, 0, 0)
let Middle = new THREE.Vector3(0, 0, 0)
var up = new THREE.Vector3(0, 1, 0);

let vecCible = new THREE.Vector3()
let vecCibleView = new THREE.Vector3()

let hoverBtn = false

let desktop = window.matchMedia("(min-width: 769px)").matches

const startEvent = desktop ? "mousedown" : "touchstart"
const endEvent = desktop ? "mouseup" : "touchend"
const moveEvent = desktop ? "mousemove" : "touchmove"


const playIcon = document.querySelector('.play-icon')
const pauseIcon = document.querySelector('.pause-icon')
const btnPlay = document.querySelector('.btn-play');
const btnNext = document.querySelector('.btn-next');
const btnPrev = document.querySelector('.btn-prev');
const btnSound = document.querySelector('.btn-sound');
const soundSelect = document.querySelector('.sound-select');
const soundCursor = document.querySelector('.sound-cursor');
const soundLine = document.querySelector('.soundLine');
const circleBack = document.querySelector('.btn-play .circle-back');
const circleTurn = document.querySelector('.btn-play .circle-turn circle');
const circleProgress = document.querySelector('.btn-play .circle-progress circle');

const bigTarget = document.querySelector('.player-top')
const intro = document.querySelector('.intro-content')
const endContent = document.querySelector('.end-content')
const topContent = document.querySelector('.player-top-content')
const soundIndicator = document.querySelector('.sound-indicator')
const soundText = document.querySelector('.sound-text')
const instruction = document.querySelector('.instruction-text')
const progress = document.querySelector('.progress')
const progressBar = document.querySelector('.bar')

const trackTitle = document.querySelector('.track-title')
const trackSub = document.querySelector('.under-track')

const preOrder = document.querySelector('.cta-preorder')



/**
 * Logo
 */

const paths = document.querySelectorAll('.logo-fill path')

paths.forEach((path) => {
    path.style.transitionDelay = Math.random()*1.5 + "s"
})

/**
 * Base
 */


const canvas = document.querySelector('#main-canvas')
const scene = new THREE.Scene()

let pov = desktop ? 50 : 70
camera = new THREE.PerspectiveCamera(pov, window.innerWidth / window.innerHeight, 1, 3000);

let ambient = new THREE.AmbientLight(0x222222);
scene.add(ambient);



/**
 * Intro
 */




const loadingManager = new THREE.LoadingManager(
    // Loaded
    () => {

        intro.classList.remove("off")

        document.querySelector('.preloader').classList.add('off')
        animate();
        document.querySelector('#lines').classList.add('start')



            setTimeout(() => {
                try{
                    preOrder.classList.remove('alpha')
                }catch (e){
                    return false;
                }

            }, 1500)

            setTimeout(() => {
                try{
                    instruction.classList.remove('alpha')
                }catch (e){
                    return false;
                }

            }, 1700)


        
        

    },

    // Progress
    (itemUrl, itemsLoaded, itemsTotal) => {
        const progressRatio = itemsLoaded / itemsTotal
        //console.log(itemUrl, progressRatio)

    }
)


let loader = new THREE.TextureLoader(loadingManager);

/**
 * Sizes
 */

const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}


/**
 * Renderer
 */


const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: false,
    performance: "default"
})

renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.render(scene, camera);


window.addEventListener('resize', () => {
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})


/**
 * Environment map
 */


var geometry = new THREE.SphereBufferGeometry(800, 60, 40);
geometry.scale(-1, 1, 1);

let src = "img/sky_def_small.jpeg"

loader.load(src, function(texture) {
    var material = new THREE.MeshBasicMaterial({
        map: texture,
        blending: THREE.AdditiveBlending,
        transparent: true,
        opacity: 1
    });

    mesh = new THREE.Mesh(geometry, material);

    scene.add(mesh);

})


camera.position.copy(start);


/**
 * galaxy
 */

let galaxies = []

const generateWhiteGalaxy = (start, size, starSize, starSizeMobile, count, position) => {

if(window.devicePixelRatio==1){
    count/=10
}

    let WhiteGeometry = null
    let WhiteMaterial = null
    let WhitePoints = null

    WhiteGeometry = new THREE.BufferGeometry()

    const positions = new Float32Array(count * 3)

    for (let i = 0; i < count; i++) {
        const i3 = i * 3


        var spherical = new THREE.Spherical();

        spherical.phi = Math.random() * Math.PI * 2;
        spherical.theta = Math.random() * Math.PI * 2;
        spherical.radius = start + Math.random() * size; // 10 is the desired radius
        let pos = new THREE.Vector3().setFromSpherical(spherical);

        positions[i3] = pos.x
        positions[i3 + 1] = pos.y
        positions[i3 + 2] = pos.z;
    }

    WhiteGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))

    WhiteMaterial = new THREE.PointsMaterial({
        color: '#FBDBBA',
        size: desktop ? starSize : starSizeMobile,
        sizeAttenuation: true,
        depthWrite: true,

    })

    /**
     * Points
     */
    WhitePoints = new THREE.Points(WhiteGeometry, WhiteMaterial)
    scene.add(WhitePoints)

    WhitePoints.position.copy(position)

    galaxies.push(WhitePoints)

}

generateWhiteGalaxy(100, 500, .1, .25, 15000, Middle)



/**
 * superstars
 */

let random = false

const starsPosition = {
    0: { distance: 84.98519281710068, angle: 2.7, height: 18.347292880143954 },
    1: { distance: 233.9305531532975, angle: 4.519396101659581, height: -27.81672984520498 },
    2: { distance: 120.06495806615169, angle: 5.044086295206683, height: -55.97926806824954 },
    3: { distance: 151.66354089558666, angle: 6.04778454254519, height: 24.206691500268235 },
    4: { distance: 216.97903545345202, angle: 7.83795273612406, height: -13.4061645082295207 },
    5: { distance: 140.8858980967047, angle: -9.6048532575606, height: -40.736842957666177 },
    6: { distance: 210.46023533615516, angle: 11.852330773596823, height: -20.726873029099032 },
    7: { distance: 247.56946967063278, angle: 11.090091985626518, height: 37.1637724925105 },
    8: { distance: 231.0031392431586, angle: 13.045972375063329, height: 14.047660863097214 },
    9: { distance: 176.39099724828222, angle: 14.586134751255242, height: 48.83438845060668 },
    10: { distance: 152.35685264888323, angle: 12.445311362891884, height: -43.74010087123128 },
    11: { distance: 208.1308096289807, angle: 16.591598623728482, height: 12.806052075224606 },
    12: { distance: 155.42467839552835, angle: 19.554051115700464, height: -69.669215160027306 },
    13: { distance: 245.44606512647601, angle: 20.856629814380147, height: -44.316403589028653 },
    14: { distance: 134.61301986527513, angle: 21.25205429613668, height: -59.76534588568647 },
    15: { distance: 287.4870409926943, angle: 22.34135333379411, height: -15.093260509701764 },


}



let starGeo = new THREE.PlaneBufferGeometry(20, 20, 2, 2);
let angle = Math.PI * .75


const textureS2 = loader.load("img/starGreen.png");

loader.load("img/starGreen.png", function(texture) {
    for (var i = 0; i < 16; i++) {

        let starMat = new THREE.MeshBasicMaterial({
            map: textureS2,
            transparent: true,
            depthWrite: false,
            depthTest: true,

            blending: THREE.AdditiveBlending
        });

        if (!random) {
            angle = starsPosition[i].angle
            distance = starsPosition[i].distance
            height = starsPosition[i].height

        }
        else {
            angle += Math.random() + Math.PI / 4
            distance = 50 + Math.random() * 200
            height = Math.cos(Math.random() * Math.PI * 2) * 50
        }

        let extra = desktop ? 0 : 20

        stars.push({ mesh: new THREE.Mesh(starGeo, starMat), angle, distance })

        let sx = Math.cos(angle) * distance
        let sy = height + extra
        let sz = Math.sin(angle) * distance

        stars[i].mesh.position.set(sx, sy, sz);

        stars[i].mesh.lookAt(camera.position);
        scene.add(stars[i].mesh)

        stars[i].mesh.name = i
        objectsToTest.push(stars[i].mesh)

        stars[i].visited = false

        starsPosition[i] = { distance, angle, height: sy }
    }


})



/**
 * Mouse
 */
let starHover;
let moveUnivers = false;
let memoX;
let memoY;
let memoAngle;

const mouse = new THREE.Vector2()

window.addEventListener(moveEvent, (event) => {

    let iks = desktop ? event.clientX : event.touches[0].clientX
    let igrek = desktop ? event.clientY : event.touches[0].clientY

    mouse.x = iks / sizes.width * 2 - 1
    mouse.y = -(igrek / sizes.height) * 2 + 1

})

window.addEventListener(startEvent, (event) => {


    let iks = desktop ? event.clientX : event.touches[0].clientX
    let igrek = desktop ? event.clientY : event.touches[0].clientY

    mouse.x = iks / sizes.width * 2 - 1
    mouse.y = -(igrek / sizes.height) * 2 + 1

    memoX = mouse.x
    memoY = mouse.y


    memoAngle = Math.atan2(direction.z, direction.x) % (Math.PI * 2);

    moveUnivers = true
    document.body.classList.add('move')

})

window.addEventListener(endEvent, (event) => {

    if (desktop && starHover > -1 && (Math.abs(memoX - mouse.x) < .2) && (starHover != nStar || !soundPlaying) && frustum.intersectsObject(stars[starHover].mesh) && !hoverBtn) {
        gotoStar(starHover)
    }

    moveUnivers = false
    if (!desktop) hoverBtn = false

    document.body.classList.remove('move')
})

/**
 * keyboard
 */

let nStar = -1;

let finish = false

var backView = true

var audio = new Audio();

let direction = new THREE.Vector3(-1, 0, 0)
let memoDirection = new THREE.Vector3()
let decalView = desktop ? 5 : 4

let isNeptune = false



/**
 * smoke
 */

let universe = new THREE.Group();
loader.load("img/smoke.png", function(texture) {

    texture.offset.set(-1, -1);
    texture.repeat.set(3, 3);

    cloudMaterial = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        side: THREE.BackSide,
        opacity: desktop ? .2 : .3,
        depthWrite: false,
        depthTest: true,
        blending: THREE.AdditiveBlending
    });




    for (let p = 0; p < 12; p++) {

        let galaxy = new THREE.Group();
        let cloud = new THREE.Mesh(new THREE.SphereBufferGeometry(300 + p * 30, 64, 64), cloudMaterial);


        cloud.rotation.y = Math.PI;
        cloud.scale.z = .5

        cloud.rotation.x = Math.random() * Math.PI * 2;
        cloud.speed = (.5 - Math.random())


        cloudParticles.push(cloud);
        galaxy.rotation.y = 2.5 - p / 2
        galaxy.rotation.z = (.5 - Math.random())


        galaxy.add(cloud)

        universe.add(galaxy);
    }

    universe.rotation.z = Math.PI / 12
    scene.add(universe)
});



/**
 * tick
 */


let autoplay = false;

var orbitAngle = 0
var orbitchange = 0

let starHoverLast = -1
let isHovering = false

let goto = new THREE.Vector3(0, 0, 0)

let time = 0
let angleY = 0
let memoVolume = 0
let speed = 0.004
let speedLerping = desktop ? .01 : .005

var target = new THREE.Vector2()
const raycaster = new THREE.Raycaster()



var frustum = new THREE.Frustum();
var cameraViewProjectionMatrix = new THREE.Matrix4();




const animate = () => {

    requestAnimationFrame(animate);
    stats.begin()

    time += .0015


    cloudParticles.forEach(p => {
        p.rotation.x -= p.speed / 300;
    });


    raycaster.setFromCamera(mouse, camera)
    const intersects = raycaster.intersectObjects(objectsToTest)

    //starHover = -1
    if (intersects.length > 0 && step != "start") {

        document.body.classList.add('pointer')
        starHover = parseInt(intersects[intersects.length - 1].object.name)
        isHovering = true


        if (starHover != nStar || !soundPlaying) {
            var scale = lerp(stars[starHover].mesh.scale.x, 1.5, .1)
            stars[starHover].mesh.scale.set(scale, scale, scale);
        }
    }
    else {
        document.body.classList.remove('pointer')
        starHoverLast = starHover
        isHovering = false
    }


    let float = noise.simplex2(time, 0) / 20
    var newSpeed = nStar == -1 ? 0.0042 : 0.042
    if (nStar == 16) newSpeed *= 1.5

    speed = lerp(speed, newSpeed, speedLerping)


    let distOrbit = nStar < 16 ? 40 : 5.5

    if (!desktop && nStar != 16) {
        distOrbit /= 2
    }

    if (!desktop && nStar == 16) {
        distOrbit = 4
    }


    if (!moveUnivers || hoverBtn) {

        let angleSpeed = .001

        direction.applyAxisAngle(up, -angleSpeed);

    }
    else {

        let m

        if (desktop) {
            m = (memoX - mouse.x) / sizes.width * 2000
        }
        else {
            m = (memoX - mouse.x) / sizes.width * 450
        }


        if (desktop) {
            angleY = -(memoY - mouse.y) / sizes.height * 20000 * distOrbit / 40
        }
        else {
            angleY = -(memoY - mouse.y) / sizes.height * 50000 * distOrbit / 40
        }

        let newAngle = memoAngle + m

        direction.x = Math.cos(newAngle)
        direction.z = Math.sin(newAngle)
    }



    //back to global view

    vecCibleView.x = lerp(vecCibleView.x, 0, speed / 2)
    vecCibleView.y = lerp(vecCibleView.y, 0, speed / 2)
    vecCibleView.z = lerp(vecCibleView.z, 0, speed / 2)

    vecCible.x = lerp(vecCible.x, 0, speed / 2)
    vecCible.y = lerp(vecCible.y, 0, speed / 2)
    vecCible.z = lerp(vecCible.z, 0, speed / 2)


    camera.position.x = lerp(camera.position.x, 0 - direction.x * distOrbit, speed / 2)
    camera.position.y = lerp(camera.position.y, 0 + angleY, speed / 2) + float / 2
    camera.position.z = lerp(camera.position.z, 0 - direction.z * distOrbit, speed / 2)


    camera.lookAt(vecCible)

    for (var i = 0; i < stars.length; i++) {

        stars[i].mesh.lookAt(camera.position);
        stars[i].mesh.rotation.z += time + stars[i].angle
    }


    renderer.render(scene, camera);
    stats.end()
}
