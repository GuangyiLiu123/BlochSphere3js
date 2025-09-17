/**
 * Interactive Bloch Sphere Visualizer
 * A comprehensive quantum state visualization tool using Three.js
 */
// Complex number utilities
function complex(re, im) {
  return { re, im };
}

function add(c1, c2) {
  return { re: c1.re + c2.re, im: c1.im + c2.im };
}

function sub(c1, c2) {
  return { re: c1.re - c2.re, im: c1.im - c2.im };
}

function mul(c1, c2) {
  return {
    re: c1.re * c2.re - c1.im * c2.im,
    im: c1.re * c2.im + c1.im * c2.re
  };
}

function scale(c, s) {
  return { re: c.re * s, im: c.im * s };
}

function abs(c) {
  return Math.sqrt(c.re * c.re + c.im * c.im);
}

function arg(c) {
  return Math.atan2(c.im, c.re);
}

class BlochSphereVisualizer {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.controls = null;
        this.sphere = null;
        this.stateVector = null;
        this.axes = [];
        this.labels = [];
        
        // Quantum state parameters
        this.theta = 0; // Polar angle (0 to π)
        this.phi = 0;   // Azimuthal angle (0 to 2π)
        
        // Animation properties
        this.isAnimating = false;
        this.animationQueue = [];
        
        this.init();
        this.setupEventListeners();
        this.updateQuantumState();
    }
    
    init() {
        const container = document.getElementById('three-container');
        
        // Scene setup
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x1e293b);
        
        // Camera setup
        this.camera = new THREE.PerspectiveCamera(
            75, 
            container.offsetWidth / container.offsetHeight, 
            0.1, 
            1000
        );
        this.camera.position.set(3, 3, 3);
        
        // Renderer setup
        this.renderer = new THREE.WebGLRenderer({ 
            antialias: true,
            alpha: true 
        });
        this.renderer.setSize(container.offsetWidth, container.offsetHeight);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        container.appendChild(this.renderer.domElement);
        
        // Controls setup
        this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.screenSpacePanning = false;
        this.controls.minDistance = 2;
        this.controls.maxDistance = 10;
        
        // Lighting
        this.setupLighting();
        
        // Create Bloch sphere components
        this.createSphere();
        this.createAxes();
        this.createStateVector();
        
        // Start render loop
        this.animate();
        
        // Handle window resize
        window.addEventListener('resize', () => this.onWindowResize());
    }
    
    setupLighting() {
        // Ambient light
        const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
        this.scene.add(ambientLight);
        
        // Directional light
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(5, 5, 5);
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.width = 2048;
        directionalLight.shadow.mapSize.height = 2048;
        this.scene.add(directionalLight);
        
        // Point light for better illumination
        const pointLight = new THREE.PointLight(0x2563eb, 0.5, 100);
        pointLight.position.set(-5, 5, 5);
        this.scene.add(pointLight);
    }
    
    createSphere() {
        // Sphere wireframe
        const sphereGeometry = new THREE.SphereGeometry(1, 32, 16);
        const sphereMaterial = new THREE.MeshBasicMaterial({
            color: 0x475569,
            wireframe: true,
            transparent: true,
            opacity: 0.3
        });
        this.sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
        this.scene.add(this.sphere);
        
        // Sphere surface (semi-transparent)
        const surfaceMaterial = new THREE.MeshPhongMaterial({
            color: 0x1e293b,
            transparent: true,
            opacity: 0.1,
            side: THREE.DoubleSide
        });
        const surfaceSphere = new THREE.Mesh(sphereGeometry, surfaceMaterial);
        this.scene.add(surfaceSphere);
    }
    
    createAxes() {
        const axisLength = 1.3;
        
    // Scene X axis (right) - color will represent Bloch Y (blue)
        const xGeometry = new THREE.CylinderGeometry(0.02, 0.02, axisLength * 2, 8);
        const xMaterial = new THREE.MeshPhongMaterial({ color: 0x2563eb }); // scene X colored blue (Bloch Y)
        const xAxis = new THREE.Mesh(xGeometry, xMaterial);
        xAxis.rotation.z = Math.PI / 2;
        this.scene.add(xAxis);
        this.axes.push(xAxis);
        
    // Scene Y axis (up) - color represents Bloch Z (green)
    const yAxis = new THREE.Mesh(xGeometry, new THREE.MeshPhongMaterial({ color: 0x10b981 }));
    // cylinder default aligns with Y, so no rotation needed for vertical axis
    this.scene.add(yAxis);
    this.axes.push(yAxis);

    // Scene Z axis (out of page) - color represents Bloch X (red)
    const zAxis = new THREE.Mesh(xGeometry, new THREE.MeshPhongMaterial({ color: 0xef4444 }));
    zAxis.rotation.x = Math.PI / 2;
    this.scene.add(zAxis);
    this.axes.push(zAxis);
        
        // Axis arrows
        this.createAxisArrows();
        
        // Axis labels
        this.createAxisLabels();
    }
    
    createAxisArrows() {
        const arrowGeometry = new THREE.ConeGeometry(0.05, 0.15, 8);
        // Arrow positions: match scene axes where Y is up (we treat Bloch Z as scene Y)
        const positions = [
            // Scene +X (right) : represents Bloch Y -> blue
            { pos: [1.4, 0, 0], rot: [0, 0, -Math.PI/2], color: 0x2563eb }, // +X
            { pos: [-1.4, 0, 0], rot: [0, 0, Math.PI/2], color: 0x2563eb }, // -X
            // Scene +Y (up) : represents Bloch Z -> green
            { pos: [0, 1.4, 0], rot: [0, 0, 0], color: 0x10b981 }, // +Y
            { pos: [0, -1.4, 0], rot: [Math.PI, 0, 0], color: 0x10b981 }, // -Y
            // Scene +Z (out of page) : represents Bloch X -> red
            { pos: [0, 0, 1.4], rot: [Math.PI/2, 0, 0], color: 0xef4444 }, // +Z
            { pos: [0, 0, -1.4], rot: [-Math.PI/2, 0, 0], color: 0xef4444 } // -Z
        ];
        
        positions.forEach(({ pos, rot, color }) => {
            const arrow = new THREE.Mesh(arrowGeometry, new THREE.MeshPhongMaterial({ color }));
            arrow.position.set(...pos);
            arrow.rotation.set(...rot);
            this.scene.add(arrow);
        });
    }
    
    createAxisLabels() {
        // Create simple sprite labels for +X, +Y, +Z
        // Use colored sprites so they always face the camera
        this.labels = this.labels || [];

        // Place labels so Z appears at top (scene +Y). Label colors reflect Bloch axis colors:
        // X = red, Y (Bloch Z) = green (up), Z (scene depth) = blue
        // Label axes with Bloch axis names at the corresponding scene axis endpoints:
        // scene +Z -> Bloch X (out of page)
        // scene +X -> Bloch Y (right)
        // scene +Y -> Bloch Z (up)
        const labelConfigs = [
            { text: 'Y', pos: [1.6, 0, 0], color: '#2563eb' }, // scene +X shows Bloch Y
            { text: 'Z', pos: [0, 1.6, 0], color: '#10b981' }, // scene +Y shows Bloch Z
            { text: 'X', pos: [0, 0, 1.6], color: '#ef4444' }  // scene +Z shows Bloch X
        ];

        labelConfigs.forEach(cfg => {
            const sprite = this.createTextSprite(cfg.text, cfg.color, 128);
            sprite.position.set(...cfg.pos);
            sprite.scale.set(0.25, 0.25, 0.25);
            this.scene.add(sprite);
            this.labels.push(sprite);
        });
    }

    createTextSprite(text, color = '#ffffff', size = 64) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const d = size;
        canvas.width = d;
        canvas.height = d;

        // Background transparent
        ctx.clearRect(0, 0, d, d);

        // Text style
        ctx.font = `${d * 0.6}px sans-serif`;
        ctx.fillStyle = color;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(text, d / 2, d / 2 + d * 0.05);

        const texture = new THREE.CanvasTexture(canvas);
        texture.needsUpdate = true;

        const material = new THREE.SpriteMaterial({ map: texture, depthTest: false });
        return new THREE.Sprite(material);
    }
    
    createStateVector() {
        // State vector arrow
        const arrowGeometry = new THREE.CylinderGeometry(0.02, 0.02, 1, 8);
        const arrowMaterial = new THREE.MeshPhongMaterial({ 
            color: 0x06b6d4,
            emissive: 0x023d4d,
            emissiveIntensity: 0.2
        });
        this.stateVector = new THREE.Mesh(arrowGeometry, arrowMaterial);
        
        // Arrow head
        const headGeometry = new THREE.ConeGeometry(0.06, 0.2, 8);
        const arrowHead = new THREE.Mesh(headGeometry, arrowMaterial);
        arrowHead.position.set(0, 0.6, 0);
        this.stateVector.add(arrowHead);
        
        this.scene.add(this.stateVector);
    }
    
    setupEventListeners() {
        // Angle sliders
        const thetaSlider = document.getElementById('theta-slider');
        const phiSlider = document.getElementById('phi-slider');
        const thetaValue = document.getElementById('theta-value');
        const phiValue = document.getElementById('phi-value');
        
        thetaSlider.addEventListener('input', (e) => {
            this.theta = (parseFloat(e.target.value) * Math.PI) / 180;
            thetaValue.textContent = e.target.value + '°';
            this.updateQuantumState();
        });
        
        phiSlider.addEventListener('input', (e) => {
            this.phi = (parseFloat(e.target.value) * Math.PI) / 180;
            phiValue.textContent = e.target.value + '°';
            this.updateQuantumState();
        });
        
        // Preset state buttons
        document.querySelectorAll('.preset-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const state = e.target.dataset.state;
                this.setPresetState(state);
                this.animateButton(btn);
            });
        });
        
        // Quantum gate buttons
        document.querySelectorAll('.gate-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const gate = e.target.dataset.gate;
                this.applyQuantumGate(gate);
                this.animateButton(btn);
            });
        });
        
        // Settings checkboxes
        document.getElementById('show-axes').addEventListener('change', (e) => {
            this.toggleAxesVisibility(e.target.checked);
        });
        
        document.getElementById('show-sphere').addEventListener('change', (e) => {
            this.toggleSphereVisibility(e.target.checked);
        });
        
        // Action buttons
        document.getElementById('measure-btn').addEventListener('click', () => {
            this.performMeasurement();
        });
        
        document.getElementById('reset-btn').addEventListener('click', () => {
            this.resetState();
        });
    }
    
    updateQuantumState() {
        // Update state vector position on Bloch sphere
        const x = Math.sin(this.theta) * Math.cos(this.phi);
        const y = Math.sin(this.theta) * Math.sin(this.phi);
        const z = Math.cos(this.theta);
        
    // Map Bloch -> scene so:
    // Bloch X comes out of the paper -> scene Z = x
    // Bloch Y goes to the right         -> scene X = y
    // Bloch Z goes up                   -> scene Y = z
    const sx = y; // scene X <- Bloch Y
    const sy = z; // scene Y <- Bloch Z (up)
    const sz = x; // scene Z <- Bloch X (out of page)

    // Position and orient state vector in scene coordinates
    this.stateVector.position.set(sx * 0.5, sy * 0.5, sz * 0.5);
    this.stateVector.lookAt(new THREE.Vector3(sx, sy, sz));
    this.stateVector.rotateX(Math.PI / 2);
        
        // Update quantum state display
        this.updateStateDisplay();
        this.updateProbabilities();
    }
    
    updateStateDisplay() {
    const alpha = new Complex(Math.cos(this.theta / 2), 0);
    const beta = Complex.exp(new Complex(0, this.phi)).scale(Math.sin(this.theta / 2));

    // Format complex numbers for display
    const alphaStr = this.formatComplex(alpha.real, alpha.imag);
    const betaStr = this.formatComplex(beta.real, beta.imag);
        
        const stateCoords = document.getElementById('state-coords');
        stateCoords.textContent = `|ψ⟩ = ${alphaStr}|0⟩ + (${betaStr})|1⟩`;

    }
    
    updateProbabilities() {
        const prob0 = Math.cos(this.theta / 2) ** 2;
        const prob1 = Math.sin(this.theta / 2) ** 2;
        
        document.getElementById('prob-0').textContent = `${(prob0 * 100).toFixed(1)}%`;
        document.getElementById('prob-1').textContent = `${(prob1 * 100).toFixed(1)}%`;
        
        document.getElementById('bar-0').style.width = `${prob0 * 100}%`;
        document.getElementById('bar-1').style.width = `${prob1 * 100}%`;
    }
    
    formatComplex(real, imag) {
        if (Math.abs(imag) < 1e-10) {
            return real.toFixed(3);
        }
        const realStr = Math.abs(real) < 1e-10 ? '' : real.toFixed(3);
        const imagStr = Math.abs(imag - 1) < 1e-10 ? 'i' : 
                      Math.abs(imag + 1) < 1e-10 ? '-i' : 
                      `${imag.toFixed(3)}i`;
        
        if (realStr === '') return imagStr;
        if (imag > 0) return `${realStr} + ${imagStr}`;
        return `${realStr} - ${imagStr.substring(1)}`;
    }
    
    setPresetState(state) {
        const states = {
            'ground': { theta: 0, phi: 0 },           // |0⟩
            'excited': { theta: Math.PI, phi: 0 },    // |1⟩
            'plus': { theta: Math.PI/2, phi: 0 },     // |+⟩ = (|0⟩ + |1⟩)/√2
            'minus': { theta: Math.PI/2, phi: Math.PI }, // |−⟩ = (|0⟩ - |1⟩)/√2
            'right': { theta: Math.PI/2, phi: Math.PI/2 }, // |i⟩ = (|0⟩ + i|1⟩)/√2
            'left': { theta: Math.PI/2, phi: 3*Math.PI/2 } // |−i⟩ = (|0⟩ - i|1⟩)/√2
        };
        
        if (states[state]) {
            this.animateToState(states[state].theta, states[state].phi);
        }
    }
    
    applyQuantumGate(gate) {
        const gates = {
            'x': () => this.applyPauliX(),
            'y': () => this.applyPauliY(), 
            'z': () => this.applyPauliZ(),
            'h': () => this.applyHadamard()
        };
        
        if (gates[gate]) {
            gates[gate]();
        }
    }
    
    applyPauliX() {
        // Pauli-X gate: |0⟩ ↔ |1⟩ (rotation by π around X-axis)
        const newTheta = Math.PI - this.theta;
        const newPhi = (this.phi + Math.PI) % (2 * Math.PI);
        this.animateToState(newTheta, newPhi);
    }
    
    applyPauliY() {
        // Fixed Pauli Y As before, what it did before was simply negate the phi angle
        // Now, it actually rotates a half turn
        const newTheta = Math.PI - this.theta;
        let newPhi = (Math.PI - this.phi) % (2 * Math.PI);
        if (newPhi < 0) newPhi += 2 * Math.PI;

        this.animateToState(newTheta, newPhi);
    }

    
    applyPauliZ() {
        // Pauli-Z gate: rotation by π around Z-axis
        const newPhi = (this.phi + Math.PI) % (2 * Math.PI);
        this.animateToState(this.theta, newPhi);
    }
    
    applyHadamard() {
        // Hadamard gate: complex transformation
        if (Math.abs(this.theta) < 1e-10) {
            // |0⟩ → |+⟩
            this.animateToState(Math.PI/2, 0);
        } else if (Math.abs(this.theta - Math.PI) < 1e-10) {
            // |1⟩ → |−⟩
            this.animateToState(Math.PI/2, Math.PI);
        } else {
            // General case - simplified for visualization

            const x  = Math.sin(this.theta) * Math.cos(this.phi);
            const y  = Math.sin(this.theta) * Math.sin(this.phi);
            const z  = Math.cos(this.theta);

            const x2 = z;
            const y2 = -y;
            const z2 = x;

            const newTheta = Math.acos(z2);
            let newPhi = Math.atan2(y2, x2);
            if (newPhi < 0) newPhi += 2 * Math.PI;
            this.animateToState(newTheta, newPhi);
        }
    }
    
    animateToState(targetTheta, targetPhi, duration = 1000) {
        if (this.isAnimating) return;
        
        this.isAnimating = true;
        const startTheta = this.theta;
        const startPhi = this.phi;
        const startTime = Date.now();
        
        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Smooth easing function
            const eased = 1 - Math.pow(1 - progress, 3);
            
            this.theta = startTheta + (targetTheta - startTheta) * eased;
            this.phi = startPhi + (targetPhi - startPhi) * eased;
            
            this.updateQuantumState();
            this.updateSliders();
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                this.isAnimating = false;
            }
        };
        
        requestAnimationFrame(animate);
    }
    
    updateSliders() {
        const thetaDegrees = (this.theta * 180) / Math.PI;
        const phiDegrees = (this.phi * 180) / Math.PI;
        
        document.getElementById('theta-slider').value = thetaDegrees;
        document.getElementById('phi-slider').value = phiDegrees;
        document.getElementById('theta-value').textContent = `${thetaDegrees.toFixed(0)}°`;
        document.getElementById('phi-value').textContent = `${phiDegrees.toFixed(0)}°`;
    }
    
    performMeasurement() {
        const measureBtn = document.getElementById('measure-btn');
        measureBtn.classList.add('measuring');
        
        // Simulate measurement
        setTimeout(() => {
            const prob0 = Math.cos(this.theta / 2) ** 2;
            const measurement = Math.random() < prob0 ? 0 : 1;
            
            // Collapse to measured state
            if (measurement === 0) {
                this.animateToState(0, 0); // |0⟩
            } else {
                this.animateToState(Math.PI, 0); // |1⟩
            }
            
            // Show measurement result
            alert(`Measurement result: |${measurement}⟩`);
            
            measureBtn.classList.remove('measuring');
        }, 1000);
    }
    
    resetState() {
        this.animateToState(0, 0); // Reset to |0⟩ state
    }
    
    toggleAxesVisibility(visible) {
        this.axes.forEach(axis => {
            axis.visible = visible;
        });
        // Toggle label sprites alongside axes
        if (this.labels && this.labels.length) {
            this.labels.forEach(lbl => lbl.visible = visible);
        }
    }
    
    toggleSphereVisibility(visible) {
        this.sphere.visible = visible;
    }
    
    animateButton(button) {
        button.classList.add('gate-active');
        setTimeout(() => {
            button.classList.remove('gate-active');
        }, 300);
    }
    
    animate() {
        requestAnimationFrame(() => this.animate());
        
        this.controls.update();
        this.renderer.render(this.scene, this.camera);
    }
    
    onWindowResize() {
        const container = document.getElementById('three-container');
        const width = container.offsetWidth;
        const height = container.offsetHeight;
        
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
    }
}

// Simple Complex number class for calculations
class Complex {
    constructor(real, imag) {
        this.real = real;
        this.imag = imag;
    }
    
    static exp(z) {
        const r = Math.exp(z.real);
        return new Complex(r * Math.cos(z.imag), r * Math.sin(z.imag));
    }
    
    // multiply by another complex
    mul(other) {
        return new Complex(
            this.real * other.real - this.imag * other.imag,
            this.real * other.imag + this.imag * other.real
        );
    }

    // scale by real
    scale(s) {
        return new Complex(this.real * s, this.imag * s);
    }
}

// Initialize the visualizer when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new BlochSphereVisualizer();
});
