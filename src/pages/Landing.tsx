import React, { Suspense } from 'react';
import { Link } from 'react-router-dom';
import { Canvas } from '@react-three/fiber';
import { Environment, OrbitControls, ContactShadows, Float } from '@react-three/drei';
import RingModel from '@/components/RingModel';
import { Box, Settings, DollarSign, Share2 } from 'lucide-react';

// Hero Section Component
const HeroSection = () => {
    // Ring 1: Shiny Gold with Diamond
    const heroRing1 = {
        id: 1,
        profile: 'P7',
        size: 54,
        width: 4.5,
        height: 1.8,
        metal: { type: 'gold', karat: 18, color: 'yellow', finish: 'polished' },
        partition: { count: 1, ratio: '1', shape: 'straight' },
        segments: [{ metal: 'gold', color: 'yellow', karat: 18, finish: 'polished' }],
        groove: { type: 'none', position: 0.5, width: 0.2, depth: 0.1 },
        edgeStyle: 'rounded',
        stones: { enabled: true, type: 'diamond', setting: 'solitaire_smooth', count: 1, size: 0.1 },
        engraving: { enabled: false, text: '', type: 'laser', position: 'inside', font: 'font1', isHandwriting: false, isFingerprint: false, isGraphics: false },
        autoThickness: true
    };

    // Ring 2: Matching Gold Band
    const heroRing2 = {
        id: 2,
        profile: 'P7',
        size: 60,
        width: 5.0,
        height: 1.8,
        metal: { type: 'gold', karat: 18, color: 'yellow', finish: 'polished' },
        partition: { count: 1, ratio: '1', shape: 'straight' },
        segments: [{ metal: 'gold', color: 'yellow', karat: 18, finish: 'polished' }],
        groove: { type: 'none', position: 0.5, width: 0.2, depth: 0.1 },
        edgeStyle: 'rounded',
        stones: { enabled: false, type: 'diamond', setting: 'none', count: 0, size: 0.03 },
        engraving: { enabled: false, text: '', type: 'laser', position: 'inside', font: 'font1', isHandwriting: false, isFingerprint: false, isGraphics: false },
        autoThickness: true
    };

    return (
        <section className="relative min-h-[95vh] w-full overflow-hidden bg-[conic-gradient(at_top,_var(--tw-gradient-stops))] from-zinc-900 via-black to-zinc-900 flex flex-col items-center justify-center text-center pt-24 pb-12">
            {/* Background Ambience */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#FFD700]/10 via-transparent to-transparent pointer-events-none" />

            {/* Logo & Headline */}
            <div className="container px-4 z-10 animate-fade-in-up space-y-8">
                <div className="flex flex-col items-center gap-6">
                    {/* "Logo" Text */}
                    <div className="text-3xl font-display font-medium tracking-[0.2em] text-[#FFD700] uppercase opacity-90 drop-shadow-md">
                        Vera
                    </div>
                    {/* Main Headline */}
                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-bold text-white tracking-tight max-w-5xl leading-tight drop-shadow-2xl">
                        Design Your <span className="text-transparent bg-clip-text bg-gradient-to-br from-[#FDB931] via-[#FFD700] to-[#FDB931]">Wedding Rings</span>
                    </h1>
                </div>
            </div>

            {/* 3D Centerpiece */}
            <div className="h-[45vh] w-full max-w-6xl relative z-0 my-8 animate-fade-in delay-100 opacity-0 fill-mode-forwards" style={{ animationFillMode: 'forwards' }}>
                <Canvas shadows camera={{ position: [0, 1, 6.5], fov: 28 }} dpr={[1, 2]}>
                    <ambientLight intensity={0.8} />
                    <spotLight position={[10, 15, 10]} angle={0.25} penumbra={1} intensity={3} castShadow color="#FFF8E7" shadow-bias={-0.0001} />
                    <spotLight position={[-10, 5, -5]} angle={0.4} penumbra={1} intensity={2} color="#FFD700" />
                    <Environment preset="city" />
                    <ContactShadows position={[0, -1, 0]} opacity={0.6} scale={15} blur={1.5} far={4} color="#000000" />

                    <Suspense fallback={null}>
                        <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5} floatingRange={[-0.1, 0.1]}>
                            <group rotation={[0, 0, 0]}>
                                {/* Ring 1 (Left/Front) */}
                                <RingModel
                                    config={heroRing1 as any}
                                    positionX={-0.55}
                                    positionZ={0.6}
                                    rotationX={Math.PI / 10}
                                    rotationY={-Math.PI / 6}
                                />
                                {/* Ring 2 (Right/Back) */}
                                <RingModel
                                    config={heroRing2 as any}
                                    positionX={0.55}
                                    positionZ={-0.6}
                                    rotationX={Math.PI / 6}
                                    rotationY={Math.PI / 8}
                                />
                            </group>
                        </Float>
                        <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.5} enablePan={false} minPolarAngle={Math.PI / 2.5} maxPolarAngle={Math.PI / 1.8} />
                    </Suspense>
                </Canvas>
            </div>

            {/* CTA Section */}
            <div className="container px-4 z-10 animate-fade-in-up delay-200 space-y-8 mt-auto mb-8">
                <p className="text-lg md:text-2xl text-zinc-300 font-light max-w-3xl mx-auto leading-relaxed">
                    Design your own 3D wedding ring with over <span className="text-white font-medium">100 customization options</span>.
                </p>

                <div className="flex flex-col sm:flex-row gap-6 justify-center items-center pt-4">
                    <Link
                        to="/design"
                        className="group relative px-10 py-5 bg-gradient-to-r from-[#FFD700] via-[#FDB931] to-[#FFD700] text-black font-bold text-lg rounded-full shadow-[0_0_30px_rgba(255,215,0,0.3)] hover:shadow-[0_0_50px_rgba(255,215,0,0.5)] hover:scale-105 active:scale-95 transition-all duration-300 overflow-hidden"
                    >
                        <span className="relative z-10">Start Design Now</span>
                        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                    </Link>
                    <button
                        onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                        className="text-sm font-medium text-zinc-500 hover:text-white transition-colors uppercase tracking-[0.15em] border-b border-transparent hover:border-white/50 pb-1"
                    >
                        Learn More
                    </button>
                </div>
            </div>

            {/* Scroll Indicator */}
            <div className="absolute bottom-8 animate-bounce text-zinc-600">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M7 13l5 5 5-5M7 6l5 5 5-5" />
                </svg>
            </div>
        </section>
    );
};

// Features Section
const FeaturesSection = () => {
    const features = [
        { icon: Box, title: "Realistic 3D Design", desc: "View your ring from every angle with photorealistic rendering." },
        { icon: Settings, title: "100+ Customization Options", desc: "Customize metals, profiles, engravings, and stones to your exact taste." },
        { icon: DollarSign, title: "Direct & Accurate Price", desc: "See the exact price update instantly as you design." },
        { icon: Share2, title: "Save & Share Design", desc: "Save your unique design and share it with your partner." }
    ];

    return (
        <section id="features" className="py-24 bg-white text-zinc-900">
            <div className="container px-4 md:px-6">
                <div className="text-center mb-16 space-y-4">
                    <h2 className="text-3xl md:text-5xl font-display font-bold text-zinc-900">Experience Excellence</h2>
                    <p className="text-zinc-500 max-w-2xl mx-auto text-lg leading-relaxed">
                        We combine traditional craftsmanship with cutting-edge 3D technology to give you full control.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((f, i) => (
                        <div key={i} className="group p-8 rounded-2xl bg-zinc-50 border border-zinc-100 hover:border-[#FFD700]/50 hover:shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] hover:-translate-y-2 transition-all duration-300 flex flex-col items-center text-center">
                            <div className="w-16 h-16 bg-white shadow-sm rounded-2xl flex items-center justify-center mb-6 text-[#D4AF37] group-hover:bg-[#FFD700] group-hover:text-white transition-all duration-300 border border-zinc-100">
                                <f.icon size={28} />
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-zinc-900 group-hover:text-[#D4AF37] transition-colors">{f.title}</h3>
                            <p className="text-zinc-500 leading-relaxed text-sm">{f.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

// Gallery Section
const GallerySection = () => {
    // Generate 6 placeholders
    const galleryItems = [1, 2, 3, 4, 5, 6];

    return (
        <section className="py-24 bg-zinc-950 text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-900 via-zinc-950 to-zinc-950 pointer-events-none" />

            <div className="container px-4 md:px-6 relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                    <div className="space-y-4 text-center md:text-left">
                        <h2 className="text-3xl md:text-5xl font-display font-bold">Unique Designs</h2>
                        <p className="text-zinc-400 text-lg">Explore what others have created with Vera.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {galleryItems.map((i) => (
                        <div key={i} className="aspect-[4/5] rounded-2xl bg-zinc-900/50 border border-zinc-800/50 backdrop-blur-sm overflow-hidden relative group cursor-pointer hover:border-[#FFD700]/40 transition-all duration-500 shadow-2xl">
                            {/* Visual Placeholder - Simulating Ring Images */}
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-zinc-700 group-hover:scale-105 transition-transform duration-700 bg-gradient-to-b from-transparent to-black/20">
                                <div className="w-32 h-32 rounded-full bg-gradient-to-tr from-zinc-800 to-zinc-700 opacity-20 mb-6 group-hover:opacity-30 transition-opacity" />
                                <span className="text-xs font-medium uppercase tracking-[0.2em] text-zinc-600 group-hover:text-zinc-400 transition-colors">Design No. 0{i}</span>
                            </div>

                            {/* Hover Overlay */}
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-end pb-10 backdrop-blur-[1px]">
                                <Link
                                    to="/design"
                                    className="px-8 py-3 bg-white text-black font-bold rounded-full transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 hover:bg-[#FFD700] hover:shadow-lg"
                                >
                                    Customize Logic
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-16 text-center">
                    <Link
                        to="/design"
                        className="inline-flex items-center gap-2 px-8 py-3 rounded-full border border-zinc-800 hover:border-[#FFD700] text-zinc-400 hover:text-[#FFD700] font-medium transition-all group bg-zinc-900/50 hover:bg-zinc-900"
                    >
                        Create Your Own <span className="group-hover:translate-x-1 transition-transform">→</span>
                    </Link>
                </div>
            </div>
        </section>
    );
};

// Footer
const Footer = () => (
    <footer className="bg-black text-zinc-500 py-16 border-t border-zinc-900">
        <div className="container px-4 md:px-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-12">
                <div className="flex flex-col items-center md:items-start gap-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FFD700] to-[#FDB931] flex items-center justify-center text-black font-bold font-serif text-xl shadow-[0_0_15px_rgba(255,215,0,0.3)]">V</div>
                        <span className="text-white font-display font-bold text-2xl tracking-wide">Vera</span>
                    </div>
                    <p className="text-zinc-600 text-sm max-w-xs text-center md:text-left">
                        Crafting eternal moments with precision and passion.
                    </p>
                </div>

                <div className="flex flex-wrap justify-center gap-8 text-sm font-medium">
                    <Link to="/" className="text-zinc-400 hover:text-[#FFD700] transition-colors">Home</Link>
                    <Link to="/design" className="text-zinc-400 hover:text-[#FFD700] transition-colors">Design</Link>
                    <a href="#" className="text-zinc-400 hover:text-[#FFD700] transition-colors">Contact Us</a>
                    <a href="#" className="text-zinc-400 hover:text-[#FFD700] transition-colors">Privacy Policy</a>
                </div>
            </div>

            <div className="pt-8 border-t border-zinc-900 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-zinc-600">
                <div>© 2025 Vera 3D Ring. All rights reserved.</div>
                <div className="flex gap-4">
                    {/* Social Placeholders */}
                    <div className="w-5 h-5 bg-zinc-800 rounded-full hover:bg-[#FFD700] transition-colors cursor-pointer" />
                    <div className="w-5 h-5 bg-zinc-800 rounded-full hover:bg-[#FFD700] transition-colors cursor-pointer" />
                    <div className="w-5 h-5 bg-zinc-800 rounded-full hover:bg-[#FFD700] transition-colors cursor-pointer" />
                </div>
            </div>
        </div>
    </footer>
);

export default function Landing() {
    return (
        <div className="min-h-screen bg-black text-white selection:bg-[#FFD700] selection:text-black font-sans">
            <HeroSection />
            <FeaturesSection />
            <GallerySection />
            <Footer />
        </div>
    );
}
