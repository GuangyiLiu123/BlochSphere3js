# 🌐 Bloch Sphere Visualizer

An interactive 3D visualization tool for quantum states using the Bloch sphere representation. Built with Three.js for smooth, real-time manipulation of quantum states and gate operations.

## ✨ Features

### 🎯 Interactive Quantum State Manipulation
- **Real-time controls**: Adjust θ (theta) and φ (phi) angles with smooth sliders
- **Preset quantum states**: Quick access to common states (|0⟩, |1⟩, |+⟩, |−⟩, |i⟩, |−i⟩)
- **Visual state vector**: 3D arrow showing current quantum state position on the sphere

### 🔄 Quantum Gate Operations
- **Pauli Gates**: X, Y, Z gate operations with smooth animations
- **Hadamard Gate**: Superposition state creation
- **Animated transitions**: Smooth state transformations for better understanding

### 📊 Measurement & Probability
- **Real-time probabilities**: Live display of |0⟩ and |1⟩ measurement probabilities
- **Interactive measurement**: Simulate quantum measurement with state collapse
- **Visual probability bars**: Graphical representation of measurement outcomes

### 🎨 3D Visualization
- **Interactive 3D sphere**: Mouse-controlled rotation, zoom, and pan
- **Coordinate axes**: Labeled X, Y, Z axes with quantum state annotations
- **Modern UI**: Dark theme with gradient styling and smooth animations

## 🚀 Quick Start

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Node.js (optional, for development server)

### Option 1: Direct Browser Opening
1. Simply open `index.html` in your web browser
2. All dependencies are loaded via CDN

### Option 2: Development Server (Recommended)
1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm start
   ```

3. Open your browser to `http://localhost:3000`

## 🎮 Usage Guide

### Basic Controls
1. **Angle Sliders**: Use θ and φ sliders to manually adjust the quantum state
2. **Mouse Interaction**: 
   - Left click + drag: Rotate view
   - Mouse wheel: Zoom in/out
   - Right click + drag: Pan view

### Preset States
Click any preset button to instantly set the quantum state:
- **|0⟩**: Ground state (north pole)
- **|1⟩**: Excited state (south pole) 
- **|+⟩**: Positive superposition (X-axis)
- **|−⟩**: Negative superposition (-X-axis)
- **|i⟩**: Positive Y superposition (Y-axis)
- **|−i⟩**: Negative Y superposition (-Y-axis)

### Quantum Gates
Apply quantum operations with animated transitions:
- **Pauli-X**: Bit flip operation (|0⟩ ↔ |1⟩)
- **Pauli-Y**: Bit and phase flip
- **Pauli-Z**: Phase flip operation
- **Hadamard**: Creates superposition states

### Measurement
- **Probability Display**: Real-time calculation of measurement probabilities
- **Measure Button**: Perform quantum measurement with random outcome
- **State Collapse**: Visual demonstration of measurement-induced state collapse

## 🔧 Technical Details

### Architecture
- **Frontend**: Pure JavaScript (ES6+), HTML5, CSS3
- **3D Graphics**: Three.js for WebGL rendering
- **Physics**: Accurate Bloch sphere mathematics
- **Responsive**: Mobile-friendly responsive design

### Quantum Mathematics
The visualizer implements proper Bloch sphere mathematics:
- **State Representation**: |ψ⟩ = cos(θ/2)|0⟩ + e^(iφ)sin(θ/2)|1⟩
- **Gate Operations**: Matrix representations of common quantum gates
- **Measurement**: Born rule probability calculations

### File Structure
```
bloch-sphere/
├── index.html          # Main HTML structure
├── styles.css          # Modern CSS styling
├── bloch-sphere.js     # Core JavaScript logic
├── package.json        # Project configuration
└── README.md          # This documentation
```

## 🎯 Educational Use

Perfect for:
- **Quantum Computing Courses**: Visual aid for quantum state concepts
- **Physics Education**: Understanding quantum mechanics principles
- **Self-Learning**: Interactive exploration of quantum states
- **Research**: Quick visualization of quantum operations

## 🌟 Advanced Features

### Customization Options
- Toggle coordinate axes visibility
- Toggle sphere wireframe display
- Animation speed controls
- Theme customization

### Keyboard Shortcuts
- **R**: Reset to |0⟩ state
- **Space**: Perform measurement
- **1-6**: Quick access to preset states

## 🔮 Future Enhancements

Planned features for future versions:
- Multi-qubit systems visualization
- Custom gate sequence builder
- Quantum circuit integration
- Export/import state configurations
- VR/AR support for immersive learning

## 🤝 Contributing

Contributions are welcome! Areas for improvement:
- Additional quantum gates
- Better mobile experience
- Performance optimizations
- Educational tutorials

## 📄 License

MIT License - Feel free to use for educational and commercial purposes.

## 🎓 Learn More

### Quantum Computing Resources
- [IBM Quantum Experience](https://quantum-computing.ibm.com/)
- [Microsoft Quantum Development Kit](https://azure.microsoft.com/en-us/products/quantum)
- [Qiskit Textbook](https://qiskit.org/textbook/)

### Bloch Sphere Theory
- Understanding quantum superposition
- Quantum gate operations
- Measurement theory in quantum mechanics

---

**Happy quantum exploring! 🚀**
