import * as THREE from 'three';

const isMobile = window.innerWidth < 768 || /Mobi|Android/i.test(navigator.userAgent);
const pixelRatio = Math.min(window.devicePixelRatio, isMobile ? 1 : 1.5);

const canvas = document.getElementById('three-canvas');
const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: !isMobile,
    alpha: true,
    powerPreference: 'high-performance'
});

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(pixelRatio);
renderer.setClearColor(0x000000, 0);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(0, 3, 7);
camera.lookAt(0, 1, 0);

// Lighting - premium studio setup
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);

const keyLight = new THREE.DirectionalLight(0xffffff, 2.0);
keyLight.position.set(5, 8, 5);
scene.add(keyLight);

const fillLight = new THREE.PointLight(0x0d9488, 1.5, 30);
fillLight.position.set(-4, 3, 4);
scene.add(fillLight);

const rimLight = new THREE.PointLight(0xd4a853, 1.0, 30);
rimLight.position.set(3, 2, -4);
scene.add(rimLight);

// Materials - premium aluminum look
const aluminumMaterial = new THREE.MeshStandardMaterial({
    color: 0x2a2a35,
    metalness: 0.9,
    roughness: 0.35
});

const darkAluminumMaterial = new THREE.MeshStandardMaterial({
    color: 0x1e1e2a,
    metalness: 0.85,
    roughness: 0.4
});

const screenMaterial = new THREE.MeshStandardMaterial({
    color: 0x050809,
    metalness: 0.1,
    roughness: 0.8,
    emissive: 0x0d9488,
    emissiveIntensity: 0.05
});

const keyboardMaterial = new THREE.MeshStandardMaterial({
    color: 0x151520,
    metalness: 0.3,
    roughness: 0.7
});

const trackpadMaterial = new THREE.MeshStandardMaterial({
    color: 0x252530,
    metalness: 0.6,
    roughness: 0.3
});

const screenGlowMaterial = new THREE.MeshBasicMaterial({
    color: 0x0d9488,
    transparent: true,
    opacity: 0.15
});

const bezelMaterial = new THREE.MeshStandardMaterial({
    color: 0x1a1a25,
    metalness: 0.9,
    roughness: 0.2
});

// Dimensions
const baseWidth = 5;
const baseDepth = 3.2;
const baseHeight = 0.12;
const lidWidth = 5;
const lidHeight = 3.0;
const lidThickness = 0.06;
const hingeY = 0.06;
const hingeZ = -baseDepth / 2 + 0.08;

const laptop = new THREE.Group();

// Base - main body
const baseGeometry = new THREE.BoxGeometry(baseWidth, baseHeight, baseDepth);
const base = new THREE.Mesh(baseGeometry, aluminumMaterial);
base.position.y = -baseHeight / 2;
laptop.add(base);

// Keyboard recess
const keyboardRecessGeometry = new THREE.BoxGeometry(4.4, 0.02, 2.0);
const keyboardRecess = new THREE.Mesh(keyboardRecessGeometry, darkAluminumMaterial);
keyboardRecess.position.set(0, 0.005, -0.15);
laptop.add(keyboardRecess);

// Keyboard
const keyboardWidth = 4.2;
const keyboardDepth = 1.8;
const keyboardGeometry = new THREE.BoxGeometry(keyboardWidth, 0.02, keyboardDepth);
const keyboard = new THREE.Mesh(keyboardGeometry, keyboardMaterial);
keyboard.position.set(0, 0.015, -0.2);
laptop.add(keyboard);

// Keys - merged into single geometry
const keyPositions = [];
const keyRows = 6;
const keyCols = 18;
const keyGap = 0.04;

for (let row = 0; row < keyRows; row++) {
    for (let col = 0; col < keyCols; col++) {
        keyPositions.push([
            -2.1 + 0.3 + col * (0.18 + keyGap),
            0.03,
            -0.9 + row * (0.18 + keyGap)
        ]);
    }
}

const mergedKeyGeometry = new THREE.BufferGeometry();
const vertices = [];
const indices = [];
let vertexOffset = 0;

const keyVerts = [
    [-0.09, -0.006, -0.09], [0.09, -0.006, -0.09], [0.09, 0.006, -0.09], [-0.09, 0.006, -0.09],
    [-0.09, -0.006, 0.09], [0.09, -0.006, 0.09], [0.09, 0.006, 0.09], [-0.09, 0.006, 0.09]
];

const keyFaces = [
    [0,1,2,3], [5,4,7,6], [4,0,3,7], [1,5,6,2], [3,2,6,7], [4,5,1,0]
];

for (const [px, py, pz] of keyPositions) {
    for (const [x, y, z] of keyVerts) {
        vertices.push(x + px, y + py, z + pz);
    }
    for (const face of keyFaces) {
        indices.push(
            vertexOffset + face[0], vertexOffset + face[1], vertexOffset + face[2],
            vertexOffset + face[0], vertexOffset + face[2], vertexOffset + face[3]
        );
    }
    vertexOffset += 8;
}

mergedKeyGeometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
mergedKeyGeometry.setIndex(indices);
mergedKeyGeometry.computeVertexNormals();

const mergedKeys = new THREE.Mesh(mergedKeyGeometry, keyboardMaterial);
laptop.add(mergedKeys);

// Trackpad
const trackpadGeometry = new THREE.BoxGeometry(1.8, 0.01, 1.0);
const trackpad = new THREE.Mesh(trackpadGeometry, trackpadMaterial);
trackpad.position.set(0, 0.02, 0.7);
laptop.add(trackpad);

// Trackpad border
const trackpadBorderGeometry = new THREE.BoxGeometry(1.9, 0.005, 1.1);
const trackpadBorder = new THREE.Mesh(trackpadBorderGeometry, bezelMaterial);
trackpadBorder.position.set(0, 0.018, 0.7);
laptop.add(trackpadBorder);

// LID GROUP
const lidGroup = new THREE.Group();
lidGroup.position.set(0, hingeY, hingeZ);

// Lid back (aluminum)
const lidBackGeometry = new THREE.BoxGeometry(lidWidth, lidHeight, 0.02);
const lidBack = new THREE.Mesh(lidBackGeometry, aluminumMaterial);
lidBack.position.set(0, lidHeight / 2, -lidThickness / 2 + 0.01);
lidGroup.add(lidBack);

// Apple logo on back (simplified as a circle)
const logoGeometry = new THREE.CircleGeometry(0.2, 32);
const logoMaterial = new THREE.MeshStandardMaterial({ color: 0x1a1a25, metalness: 0.9, roughness: 0.3 });
const logo = new THREE.Mesh(logoGeometry, logoMaterial);
logo.position.set(0, lidHeight / 2, -lidThickness / 2 - 0.001);
logo.rotation.y = Math.PI;
lidGroup.add(logo);

// Lid front bezel
const lidFrontGeometry = new THREE.BoxGeometry(lidWidth, lidHeight, 0.02);
const lidFront = new THREE.Mesh(lidFrontGeometry, bezelMaterial);
lidFront.position.set(0, lidHeight / 2, lidThickness / 2 - 0.01);
lidGroup.add(lidFront);

// Screen display (black background)
const displayGeometry = new THREE.BoxGeometry(lidWidth - 0.2, lidHeight - 0.2, 0.01);
const display = new THREE.Mesh(displayGeometry, screenMaterial);
display.position.set(0, lidHeight / 2, lidThickness / 2 + 0.005);
lidGroup.add(display);

// Screen content - canvas texture
const codeCanvas = document.createElement('canvas');
codeCanvas.width = 512;
codeCanvas.height = 340;
const ctx = codeCanvas.getContext('2d');

function drawCodeScreen(showCursor) {
    ctx.fillStyle = '#0a0f12';
    ctx.fillRect(0, 0, 512, 340);
    
    ctx.fillStyle = '#1a1a25';
    ctx.fillRect(0, 0, 512, 28);
    
    ctx.fillStyle = '#ff5f57';
    ctx.beginPath(); ctx.arc(15, 14, 5, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#ffbd2e';
    ctx.beginPath(); ctx.arc(32, 14, 5, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#28c840';
    ctx.beginPath(); ctx.arc(49, 14, 5, 0, Math.PI * 2); ctx.fill();
    
    ctx.fillStyle = '#0d9488';
    ctx.fillRect(70, 0, 80, 28);
    ctx.fillStyle = '#e8ecef';
    ctx.font = '11px Inter, sans-serif';
    ctx.fillText('main.tsx', 80, 18);
    
    ctx.fillStyle = '#111d20';
    ctx.fillRect(0, 28, 40, 312);
    
    ctx.font = '12px "Fira Code", monospace';
    const lines = [
        { text: 'import React from "react";', color: '#c792ea' },
        { text: '', color: '#8a9da3' },
        { text: 'export default function App() {', color: '#82aaff' },
        { text: '  const [count, setCount] = useState(0);', color: '#f07178' },
        { text: '', color: '#8a9da3' },
        { text: '  return (', color: '#82aaff' },
        { text: '    <div className="app">', color: '#c3e88d' },
        { text: '      <h1>Hello World</h1>', color: '#c3e88d' },
        { text: '      <button onClick={() =>', color: '#c3e88d' },
        { text: '        setCount(c => c + 1)}>', color: '#c3e88d' },
        { text: '        Count: {count}', color: '#f78c6c' },
        { text: '      </button>', color: '#c3e88d' },
        { text: '    </div>', color: '#c3e88d' },
        { text: '  );', color: '#82aaff' },
        { text: '}', color: '#82aaff' },
    ];
    
    lines.forEach((line, i) => {
        const y = 48 + i * 18;
        ctx.fillStyle = '#4a5568';
        ctx.fillText(String(i + 1).padStart(2, ' '), 8, y);
        ctx.fillStyle = line.color;
        ctx.fillText(line.text, 48, y);
    });
    
    if (showCursor) {
        ctx.fillStyle = '#0d9488';
        ctx.fillRect(48 + ctx.measureText('  const [count, setCount] = ').width, 48 + 2 * 18 - 12, 2, 14);
    }
    
    ctx.fillStyle = '#0d1518';
    ctx.fillRect(0, 240, 512, 100);
    ctx.fillStyle = '#0d9488';
    ctx.fillRect(0, 240, 512, 1);
    ctx.font = '11px "Fira Code", monospace';
    ctx.fillStyle = '#8a9da3';
    ctx.fillText('$ npm run dev', 8, 258);
    ctx.fillStyle = '#28c840';
    ctx.fillText('✓ Compiled successfully!', 8, 274);
    ctx.fillStyle = '#8a9da3';
    ctx.fillText('Local: http://localhost:3000', 8, 290);
}

let showCursor = true;
drawCodeScreen(showCursor);
setInterval(() => {
    showCursor = !showCursor;
    drawCodeScreen(showCursor);
    codeTexture.needsUpdate = true;
}, 500);

const codeTexture = new THREE.CanvasTexture(codeCanvas);
codeTexture.minFilter = THREE.LinearFilter;

// Screen content plane - clearly in front of display
const screenContentMaterial = new THREE.MeshBasicMaterial({ 
    map: codeTexture, 
    transparent: true, 
    depthWrite: false,
    depthTest: true
});
const screenContentGeometry = new THREE.PlaneGeometry(lidWidth - 0.3, lidHeight - 0.3);
const screenContent = new THREE.Mesh(screenContentGeometry, screenContentMaterial);
screenContent.position.set(0, lidHeight / 2, lidThickness / 2 + 0.02);
screenContent.renderOrder = 10;
lidGroup.add(screenContent);

// Screen glass reflection (subtle)
const glassMaterial = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    metalness: 0.0,
    roughness: 0.05,
    transparent: true,
    opacity: 0.03,
    depthWrite: false
});
const glassGeometry = new THREE.PlaneGeometry(lidWidth - 0.15, lidHeight - 0.15);
const glass = new THREE.Mesh(glassGeometry, glassMaterial);
glass.position.set(0, lidHeight / 2, lidThickness / 2 + 0.03);
glass.renderOrder = 20;
lidGroup.add(glass);

// Bezel frame
const bezelThickness = 0.06;
const bezelDepth = 0.03;

// Top bezel
const bezelTop = new THREE.Mesh(new THREE.BoxGeometry(lidWidth, bezelThickness, bezelDepth), bezelMaterial);
bezelTop.position.set(0, lidHeight - bezelThickness / 2, lidThickness / 2 - bezelDepth / 2);
lidGroup.add(bezelTop);

// Bottom bezel
const bezelBottom = new THREE.Mesh(new THREE.BoxGeometry(lidWidth, bezelThickness, bezelDepth), bezelMaterial);
bezelBottom.position.set(0, bezelThickness / 2, lidThickness / 2 - bezelDepth / 2);
lidGroup.add(bezelBottom);

// Left bezel
const bezelLeft = new THREE.Mesh(new THREE.BoxGeometry(bezelThickness, lidHeight, bezelDepth), bezelMaterial);
bezelLeft.position.set(-lidWidth / 2 + bezelThickness / 2, lidHeight / 2, lidThickness / 2 - bezelDepth / 2);
lidGroup.add(bezelLeft);

// Right bezel
const bezelRight = new THREE.Mesh(new THREE.BoxGeometry(bezelThickness, lidHeight, bezelDepth), bezelMaterial);
bezelRight.position.set(lidWidth / 2 - bezelThickness / 2, lidHeight / 2, lidThickness / 2 - bezelDepth / 2);
lidGroup.add(bezelRight);

// Camera notch
const notchMaterial = new THREE.MeshStandardMaterial({ color: 0x1a1a25, metalness: 0.8, roughness: 0.3 });
const notch = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.04, 0.02), notchMaterial);
notch.position.set(0, lidHeight - bezelThickness / 2, lidThickness / 2 - 0.01);
lidGroup.add(notch);

laptop.add(lidGroup);

// Side ports (USB-C)
const portGeometry = new THREE.BoxGeometry(0.02, 0.03, 0.08);
const portMaterial = new THREE.MeshStandardMaterial({ color: 0x1a1a25, metalness: 0.9, roughness: 0.3 });

// Left ports
const leftPort1 = new THREE.Mesh(portGeometry, portMaterial);
leftPort1.position.set(-baseWidth / 2 - 0.01, 0, -0.5);
leftPort1.rotation.y = Math.PI / 2;
laptop.add(leftPort1);

const leftPort2 = new THREE.Mesh(portGeometry, portMaterial);
leftPort2.position.set(-baseWidth / 2 - 0.01, 0, 0.5);
leftPort2.rotation.y = Math.PI / 2;
laptop.add(leftPort2);

// Right ports
const rightPort1 = new THREE.Mesh(portGeometry, portMaterial);
rightPort1.position.set(baseWidth / 2 + 0.01, 0, -0.5);
rightPort1.rotation.y = Math.PI / 2;
laptop.add(rightPort1);

const rightPort2 = new THREE.Mesh(portGeometry, portMaterial);
rightPort2.position.set(baseWidth / 2 + 0.01, 0, 0.5);
rightPort2.rotation.y = Math.PI / 2;
laptop.add(rightPort2);

// Rubber feet
const footGeometry = new THREE.CylinderGeometry(0.08, 0.1, 0.02, 16);
const footMaterial = new THREE.MeshStandardMaterial({ color: 0x111111, metalness: 0.0, roughness: 0.9 });

const footPositions = [
    [-baseWidth / 2 + 0.2, -baseHeight - 0.01, -baseDepth / 2 + 0.2],
    [baseWidth / 2 - 0.2, -baseHeight - 0.01, -baseDepth / 2 + 0.2],
    [-baseWidth / 2 + 0.2, -baseHeight - 0.01, baseDepth / 2 - 0.2],
    [baseWidth / 2 - 0.2, -baseHeight - 0.01, baseDepth / 2 - 0.2],
];

footPositions.forEach(pos => {
    const foot = new THREE.Mesh(footGeometry, footMaterial);
    foot.position.set(...pos);
    laptop.add(foot);
});

// Position laptop
laptop.position.set(0, 1, 0);
laptop.rotation.y = -0.2;
laptop.scale.set(0.8, 0.8, 0.8);
scene.add(laptop);

// Scroll state
let scrollProgress = 0;
let targetScrollProgress = 0;

window.addEventListener('scroll', () => {
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    targetScrollProgress = window.scrollY / scrollHeight;
}, { passive: true });

// Animation - throttled
const clock = new THREE.Clock();
let animationId = null;
let lastTime = 0;
const targetFPS = 30;
const frameInterval = 1000 / targetFPS;

function animate(currentTime) {
    animationId = requestAnimationFrame(animate);
    
    const delta = currentTime - lastTime;
    if (delta < frameInterval) return;
    lastTime = currentTime - (delta % frameInterval);
    
    const elapsedTime = clock.getElapsedTime();
    scrollProgress += (targetScrollProgress - scrollProgress) * 0.04;
    
    const openProgress = Math.min(scrollProgress / 0.12, 1);
    const easedOpen = 1 - Math.pow(1 - openProgress, 3);
    
    const startAngle = Math.PI / 2 - 0.5;
    const endAngle = -0.15;
    lidGroup.rotation.x = startAngle + (endAngle - startAngle) * easedOpen;
    
    laptop.position.y = 1 + Math.sin(elapsedTime * 0.4) * 0.06;
    
    if (easedOpen > 0.3) {
        const rotProgress = (easedOpen - 0.3) / 0.7;
        laptop.rotation.y = -0.2 + Math.sin(elapsedTime * 0.25) * 0.1 * rotProgress;
    }
    
    laptop.rotation.y += targetScrollProgress * 0.01;
    
    fillLight.position.x = Math.sin(elapsedTime * 0.3) * 5;
    fillLight.position.z = Math.cos(elapsedTime * 0.3) * 5;
    
    camera.position.x = Math.sin(elapsedTime * 0.15) * 0.3;
    camera.position.y = 3 + Math.cos(elapsedTime * 0.1) * 0.15;
    camera.lookAt(0, 1, 0);
    
    renderer.render(scene, camera);
}

animate(0);

// Debounced resize
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(pixelRatio);
    }, 100);
});

// Visibility API
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        if (animationId) {
            cancelAnimationFrame(animationId);
            animationId = null;
        }
    } else {
        clock.start();
        if (!animationId) animate(0);
    }
});
