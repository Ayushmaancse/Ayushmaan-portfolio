import React, { useState, useEffect, useRef, useMemo, Suspense, useCallback } from 'react';
import { Canvas, useFrame, useThree, extend } from '@react-three/fiber';
import {
  Float, Text, MeshDistortMaterial, Sphere, Box, Torus, Stars,
  Html, MeshWobbleMaterial, Sparkles,
  Environment
} from '@react-three/drei';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import * as THREE from 'three';

// ============================================
// PORTFOLIO DATA
// ============================================
const portfolioData = {
  name: "Ayushmaan Singh",
  title: "Full Stack Developer & AI Engineer",
  location: "Bangalore, India",
  phone: "+91 8303942799",
  email: "sayushmaan18@gmail.com",
  hobbies: ["Playing sports", "Listening to songs", "Watching web series"],
  currentCompany: "Purple Block",
  currentRole: "Software Developer Intern",
  currentProject: "Caliber - AI Insurance Platform",
  currentTechStack: ["FastAPI", "LiteLLM", "WebSocket", "Voice AI", "Python", "Webhooks"],
  education: {
    university: "Dr. APJ Abdul Kalam Technical University",
    degree: "Bachelor's Degree in Computer Science",
    highlights: ["Computer Science", "Software Engineering", "AI & ML"]
  },
  experiences: [
    {
      company: "EazyCapture",
      role: "AI Engineer",
      period: "Current",
      project: "EazyCapture Platform",
      description: "Bro, EazyCapture is an AI-powered document understanding and accounting automation platform. It is basically designed to do the heavy lifting for accountants, bookkeepers, and finance teams by completely automating the manual data entry process for invoices and receipts.",
      achievements: [
        "Automating manual data entry processes",
        "Developing AI models for document understanding",
        "Building solutions for finance teams"
      ],
      tech: ["AI/ML", "Python", "Automation"],
      color: "#ff6b00"
    },
    {
      company: "Purple Block",
      role: "Software Developer Intern",
      period: "Current",
      project: "Caliber - AI Insurance Platform",
      description: "Multi-tenant insurance management platform handling quotes, policies, claims, and renewals with AI-powered workflow automation.",
      achievements: [
        "Created cost tracing system using LiteLLM in WACA backend (FastAPI)",
        "Developed multiple APIs and integrated with frontend",
        "Implemented WebSocket for real-time WACA-frontend communication",
        "Built Voice AI with prompt tuning",
        "Created Insurance Agent & Motor Policy Agent",
        "Worked on webhooks for external integrations"
      ],
      tech: ["FastAPI", "LiteLLM", "WebSocket", "Voice AI", "Python", "Webhooks"],
      color: "#ff00ff"
    },
    {
      company: "Amdox Technologies",
      role: "Java Developer Intern",
      period: "Completed",
      project: "DearDoc - Healthcare Platform",
      description: "Enterprise healthcare domain system with robust transaction management and distributed patterns.",
      achievements: [
        "Created REST APIs with idempotency patterns",
        "Implemented distributed locking mechanisms",
        "Built notification & payment systems",
        "Applied Orchestrator Saga pattern",
        "Implemented Circuit Breaker pattern for fault tolerance"
      ],
      tech: ["Java", "Spring Boot", "Saga Pattern", "Circuit Breaker", "REST API"],
      color: "#00ffff"
    },
    {
      company: "Littra Technologies",
      role: "Java Developer Intern",
      period: "Completed",
      project: "Luxury Closet - E-commerce Platform",
      description: "Scalable microservices-based e-commerce system with event-driven architecture.",
      achievements: [
        "Built JWT authentication system",
        "Developed API Gateway architecture",
        "Implemented Kafka notification system",
        "Created Role-based access control (RBAC)",
        "Added Inventory Management microservice"
      ],
      tech: ["Java", "Spring Boot", "Kafka", "Microservices", "JWT", "API Gateway"],
      color: "#ffff00"
    }
  ],
  skills: {
    backend: ["Python", "Django", "DRF", "FastAPI", "Flask", "Java", "Spring Boot"],
    ai: ["LangChain", "LangGraph", "MCP Server", "LiteLLM", "Voice AI"],
    database: ["MongoDB", "SQL", "PostgreSQL"],
    devops: ["CI/CD", "Kafka", "Docker", "System Design"],
    frontend: ["React 19", "TypeScript", "JavaScript"],
    patterns: ["Microservices", "Saga Pattern", "Circuit Breaker", "RBAC", "JWT", "WebSocket"]
  },
  certifications: [
    { name: "Introduction to HTML, CSS & JavaScript", issuer: "IBM", date: "Jul 2025", id: "GOJ1TYF435XQ" },
    { name: "Introduction to Software Engineering", issuer: "IBM", date: "May 2025", id: "EUHGV01ADTTE" },
    { name: "Core Java Programming", issuer: "Great Learning", date: "Oct 2025", id: "YZWMTQEN" },
    { name: "Introduction to DevOps", issuer: "IBM", date: "Aug 2024", id: "DEVOPS-2024" }
  ],
  projects: [
    {
      title: "EazyCapture",
      subtitle: "AI Accounting Automation",
      description: "AI-powered document understanding and accounting automation platform designed to do the heavy lifting for finance teams.",
      features: ["Document Understanding", "Invoice Automation", "Receipt Processing", "AI Models"],
      tech: ["AI/ML", "Python", "Automation"],
      icon: "📄",
      color: "#ff6b00"
    },
    {
      title: "CRUV",
      subtitle: "AI Insurance Management Platform",
      description: "Multi-tenant insurance platform handling quotes, policies, claims, and renewals with AI workers.",
      features: ["LiteLLM Integration", "Voice AI Agents", "Real-time WebSocket", "Plugin System"],
      tech: ["FastAPI", "Python", "AI/ML", "WebSocket"],
      icon: "🛡️",
      color: "#ff00ff"
    },
    {
      title: "Noterro",
      subtitle: "Healthcare Platform",
      description: "Enterprise healthcare system with robust payment processing and distributed patterns.",
      features: ["Saga Pattern", "Circuit Breaker", "Payment Gateway", "Notifications"],
      tech: ["Java", "Spring Boot", "Microservices"],
      icon: "🏥",
      color: "#00ffff"
    },
    {
      title: "Ecommerce Microservices",
      subtitle: "Luxury Closet Platform",
      description: "Scalable microservices-based e-commerce with inventory and order processing.",
      features: ["API Gateway", "Kafka Events", "RBAC", "Inventory System"],
      tech: ["Java", "Spring Boot", "Kafka", "JWT"],
      icon: "👔",
      color: "#ffff00"
    },
    {
      title: "MakeMyTrip Clone",
      subtitle: "Travel Booking Platform",
      description: "Travel booking platform using Spring Boot microservices architecture with secure REST APIs and MySQL.",
      features: ["Microservices", "REST APIs", "Secure Authentication", "Booking System"],
      tech: ["Java", "Spring Boot", "MySQL", "Microservices"],
      icon: "✈️",
      color: "#00ffff"
    },
    {
      title: "Virtual Queue & Token System",
      subtitle: "Smart Queue Management",
      description: "Smart queue and token management system using Spring Boot and MySQL for real-time tracking.",
      features: ["Real-time Tracking", "Token Management", "Queue System", "REST APIs"],
      tech: ["Java", "Spring Boot", "MySQL", "WebSockets"],
      icon: "🎫",
      color: "#ff00ff"
    },
    {
      title: "Online Bookstore Management",
      subtitle: "Inventory & Sales System",
      description: "Book inventory and sales management system built with Spring Boot, Hibernate, and MySQL.",
      features: ["Inventory Management", "Sales Tracking", "ORM Integration", "Admin Dashboard"],
      tech: ["Java", "Spring Boot", "Hibernate", "MySQL"],
      icon: "📚",
      color: "#ff6b00"
    },
    {
      title: "E-Commerce Website",
      subtitle: "Full-Stack Java Platform",
      description: "Full-stack Java e-commerce platform featuring authentication, product catalog, and order management.",
      features: ["Authentication", "Product Catalog", "Order Management", "Shopping Cart"],
      tech: ["Java", "Spring Boot", "Hibernate", "MySQL"],
      icon: "🛍️",
      color: "#00ff88"
    }
  ]
};

// ============================================
// 3D COMPONENTS
// ============================================

// Floating Crystal Component
function FloatingCrystal({ position, color, scale = 1, speed = 1 }) {
  const meshRef = useRef();

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * speed * 0.5) * 0.3;
      meshRef.current.rotation.y += 0.008 * speed;
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * speed) * 0.3;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.3}>
      <mesh ref={meshRef} position={position} scale={scale}>
        <octahedronGeometry args={[1, 0]} />
        <meshStandardMaterial
          color={color}
          roughness={0.1}
          metalness={0.9}
          emissive={color}
          emissiveIntensity={0.3}
          transparent
          opacity={0.85}
        />
      </mesh>
    </Float>
  );
}

// Interactive Skill Orb (kept lightweight - no Html overlay)
function SkillOrb({ position, skill, color, index }) {
  const meshRef = useRef();

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.008;
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime + index) * 0.15;
    }
  });

  return (
    <mesh ref={meshRef} position={position}>
      <sphereGeometry args={[0.4, 16, 16]} />
      <meshStandardMaterial
        color={color}
        roughness={0.2}
        metalness={0.8}
        emissive={color}
        emissiveIntensity={0.2}
      />
    </mesh>
  );
}

// 3D DNA Helix (optimized)
function DNAHelix({ position = [0, 0, 0] }) {
  const groupRef = useRef();
  const sphereCount = 18;

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.12;
    }
  });

  return (
    <group ref={groupRef} position={position}>
      {Array.from({ length: sphereCount }).map((_, i) => {
        const y = (i - sphereCount / 2) * 0.35;
        const angle = i * 0.5;
        return (
          <React.Fragment key={i}>
            <mesh position={[Math.cos(angle) * 1, y, Math.sin(angle) * 1]}>
              <sphereGeometry args={[0.08, 8, 8]} />
              <meshStandardMaterial color="#ff00ff" emissive="#ff00ff" emissiveIntensity={0.5} />
            </mesh>
            <mesh position={[Math.cos(angle + Math.PI) * 1, y, Math.sin(angle + Math.PI) * 1]}>
              <sphereGeometry args={[0.08, 8, 8]} />
              <meshStandardMaterial color="#00ffff" emissive="#00ffff" emissiveIntensity={0.5} />
            </mesh>
          </React.Fragment>
        );
      })}
    </group>
  );
}

// Morphing Blob (optimized)
function MorphingBlob({ position, color, size = 2 }) {
  const meshRef = useRef();

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.08;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.1;
    }
  });

  return (
    <mesh ref={meshRef} position={position}>
      <sphereGeometry args={[size, 32, 32]} />
      <MeshDistortMaterial
        color={color}
        distort={0.35}
        speed={1.5}
        roughness={0}
        metalness={1}
      />
    </mesh>
  );
}

// Particle System (optimized)
function ParticleField({ count = 300, theme }) {
  const points = useRef();
  
  const particlesPosition = useMemo(() => {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 80;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 80;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 80;
    }
    return positions;
  }, [count]);

  useFrame((state) => {
    if (points.current) {
      points.current.rotation.y = state.clock.elapsedTime * 0.02;
      points.current.rotation.x = state.clock.elapsedTime * 0.01;
    }
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={particlesPosition}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial 
        size={0.08} 
        color={theme === 'dark' ? "#00f5ff" : "#6366f1"} 
        transparent 
        opacity={0.6} 
        sizeAttenuation 
      />
    </points>
  );
}

// Orbiting Rings System
function OrbitingRings({ position = [0, 0, 0] }) {
  const ring1 = useRef();
  const ring2 = useRef();
  const ring3 = useRef();

  useFrame((state) => {
    if (ring1.current) ring1.current.rotation.z = state.clock.elapsedTime * 0.3;
    if (ring2.current) ring2.current.rotation.x = state.clock.elapsedTime * 0.2;
    if (ring3.current) ring3.current.rotation.y = state.clock.elapsedTime * 0.25;
  });

  return (
    <group position={position}>
      <mesh ref={ring1}>
        <torusGeometry args={[3, 0.02, 8, 64]} />
        <meshStandardMaterial color="#ff00ff" emissive="#ff00ff" emissiveIntensity={0.8} />
      </mesh>
      <mesh ref={ring2} rotation={[Math.PI / 3, 0, 0]}>
        <torusGeometry args={[3.5, 0.02, 8, 64]} />
        <meshStandardMaterial color="#00ffff" emissive="#00ffff" emissiveIntensity={0.8} />
      </mesh>
      <mesh ref={ring3} rotation={[0, Math.PI / 4, Math.PI / 6]}>
        <torusGeometry args={[4, 0.02, 8, 64]} />
        <meshStandardMaterial color="#ffff00" emissive="#ffff00" emissiveIntensity={0.8} />
      </mesh>
    </group>
  );
}

// Mouse Follower (lightweight - no Trail)
function MouseFollower() {
  const meshRef = useRef();
  const { viewport } = useThree();
  const mouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.position.x = THREE.MathUtils.lerp(meshRef.current.position.x, mouse.current.x * viewport.width / 3, 0.06);
      meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, mouse.current.y * viewport.height / 3, 0.06);
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 0, 5]}>
      <sphereGeometry args={[0.12, 8, 8]} />
      <meshStandardMaterial color="#ff00ff" emissive="#ff00ff" emissiveIntensity={1.5} transparent opacity={0.8} />
    </mesh>
  );
}

// 3D Scene
function Scene3D({ theme, activeSection }) {
  const bgColor = theme === 'dark' ? '#050510' : '#f0f4ff';
  const fogColor = theme === 'dark' ? '#050510' : '#f0f4ff';
  
  return (
    <>
      <color attach="background" args={[bgColor]} />
      <fog attach="fog" args={[fogColor, 15, 60]} />
      
      <ambientLight intensity={theme === 'dark' ? 0.2 : 0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} color="#ff00ff" />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#00ffff" />
      <spotLight position={[0, 20, 0]} angle={0.3} penumbra={1} intensity={1} />
      
      <Stars radius={100} depth={50} count={800} factor={4} saturation={0} fade speed={1} />
      <ParticleField count={300} theme={theme} />
      
      <MorphingBlob position={[0, 0, -5]} color={theme === 'dark' ? "#1a0a2e" : "#6366f1"} size={2} />
      <OrbitingRings position={[0, 0, -5]} />
      <DNAHelix position={[8, 0, -8]} />
      
      <FloatingCrystal position={[-6, 2, -4]} color="#ff00ff" scale={0.8} speed={0.8} />
      <FloatingCrystal position={[6, -2, -5]} color="#00ffff" scale={0.6} speed={1.2} />
      <FloatingCrystal position={[-4, -3, -3]} color="#ffff00" scale={0.5} speed={1} />
      <FloatingCrystal position={[5, 3, -6]} color="#ff6b00" scale={0.7} speed={0.9} />
      
      <Sparkles count={40} scale={20} size={1.5} speed={0.3} color="#ff00ff" />

      <MouseFollower />

      <EffectComposer multisampling={0}>
        <Bloom intensity={0.3} luminanceThreshold={0.3} luminanceSmoothing={0.9} mipmapBlur />
        <Vignette darkness={0.3} />
      </EffectComposer>
    </>
  );
}

// ============================================
// AI CHATBOT COMPONENT
// ============================================
function AIChatbot({ isOpen, onClose, theme }) {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "Hi! I'm Ayushmaan's AI assistant. Ask me anything about his skills, experience, or projects!" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateResponse = async (userMessage) => {
    setIsLoading(true);
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);

    // Simulate a natural thinking delay for the hardcoded answers
    await new Promise(resolve => setTimeout(resolve, 800));

    // ── Keyword fallback ──

    const q = userMessage.toLowerCase().trim();
    let reply = null;

    // Score-based matching: each rule has patterns and a response.
    // We pick the best matching rule based on how many keywords hit.
    const rules = [
      // ── Greetings ──
      { patterns: ['hi', 'hello', 'hey', 'sup', 'yo', 'hola', 'howdy', 'greetings', 'what\'s up', 'good morning', 'good evening', 'good afternoon'],
        reply: "Hey there! 👋 I'm Ayushmaan's portfolio assistant. I know everything about his skills, experience, projects, and more. What would you like to know?" },

      // ── Identity ──
      { patterns: ['who is', 'who are', 'your name', 'about him', 'tell me about', 'introduce', 'himself', 'describe him', 'who is ayushmaan', 'about ayushmaan'],
        reply: "Ayushmaan Singh is a Full Stack Developer & AI Engineer based in Bangalore, India. He specializes in building intelligent, scalable applications — from microservices architectures to AI-powered agents. He's currently interning at Purple Block working on an AI Insurance Platform." },

      // ── Contact ──
      { patterns: ['email', 'mail', 'contact', 'reach', 'hire', 'connect', 'get in touch', 'talk to', 'message him', 'reach out'],
        reply: `You can reach Ayushmaan at:\n📧 ${portfolioData.email}\n📱 ${portfolioData.phone}\n📍 Bangalore, India\n\nHe's actively looking for opportunities and would love to connect!` },
      { patterns: ['phone', 'number', 'call', 'mobile', 'whatsapp'],
        reply: `Ayushmaan's phone number is ${portfolioData.phone}. Feel free to call or message him!` },
      { patterns: ['location', 'city', 'where', 'based', 'live', 'from', 'country', 'address', 'place'],
        reply: "Ayushmaan is currently based in Bangalore, India — one of India's biggest tech hubs." },

      // ── Education ──
      { patterns: ['education', 'university', 'college', 'degree', 'study', 'studied', 'academic', 'school', 'qualification', 'graduate', 'aktu', 'kalam'],
        reply: `Ayushmaan graduated from Dr. APJ Abdul Kalam Technical University (AKTU) with a Bachelor's degree in Computer Science. His academic focus areas include Computer Science, Software Engineering, and AI & ML.` },

      // ── Current Work ──
      { patterns: ['current', 'now', 'doing', 'working on', 'present', 'today', 'currently', 'latest', 'recent'],
        reply: "Currently, Ayushmaan is a Software Developer Intern at Purple Block, working on 'Caliber' — an AI-powered insurance management platform. His key contributions include:\n\n• Cost tracing system using LiteLLM in the WACA backend (FastAPI)\n• WebSocket for real-time WACA-frontend communication\n• Voice AI agents with prompt tuning\n• Insurance Agent & Motor Policy Agent\n• Webhook integrations for external systems" },

      // ── Purple Block / Caliber (specific) ──
      { patterns: ['purple block', 'caliber', 'insurance', 'waca', 'current intern', 'current company'],
        reply: "At Purple Block, Ayushmaan works on 'Caliber' — a multi-tenant AI insurance management platform that handles quotes, policies, claims, and renewals.\n\nHis contributions:\n• Built cost tracing system using LiteLLM in WACA backend (FastAPI)\n• Developed multiple APIs and integrated with frontend\n• Implemented WebSocket for real-time communication\n• Built Voice AI agents with prompt tuning\n• Created Insurance Agent & Motor Policy Agent\n• Worked on webhooks for external integrations\n\nTech: FastAPI, LiteLLM, WebSocket, Voice AI, Python, Webhooks" },

      // ── Amdox / DearDoc (specific) ──
      { patterns: ['amdox', 'deardoc', 'dear doc', 'healthcare', 'health care', 'medical'],
        reply: "At Amdox Technologies, Ayushmaan was a Java Developer Intern working on 'DearDoc' — an enterprise healthcare platform.\n\nKey achievements:\n• Created REST APIs with idempotency patterns\n• Implemented distributed locking mechanisms\n• Built notification & payment systems\n• Applied Orchestrator Saga pattern for distributed transactions\n• Implemented Circuit Breaker pattern for fault tolerance\n\nTech: Java, Spring Boot, Saga Pattern, Circuit Breaker, REST API" },

      // ── Littra / Luxury Closet (specific) ──
      { patterns: ['littra', 'luxury closet', 'ecommerce', 'e-commerce', 'shopping'],
        reply: "At Littra Technologies, Ayushmaan was a Java Developer Intern working on 'Luxury Closet' — a scalable microservices-based e-commerce platform.\n\nKey achievements:\n• Built JWT authentication system\n• Developed API Gateway architecture\n• Implemented Kafka notification system\n• Created Role-based access control (RBAC)\n• Added Inventory Management microservice\n\nTech: Java, Spring Boot, Kafka, Microservices, JWT, API Gateway" },

      // ── Experience (general) ──
      { patterns: ['experience', 'intern', 'internship', 'work history', 'companies', 'worked', 'career', 'professional', 'job', 'employment'],
        reply: "Ayushmaan has completed 3 internships:\n\n🟣 Purple Block (Current) — Software Developer Intern\n   Project: Caliber — AI Insurance Platform\n   Focus: FastAPI, LiteLLM, Voice AI, WebSocket\n\n🔵 Amdox Technologies — Java Developer Intern\n   Project: DearDoc — Healthcare Platform\n   Focus: Saga Pattern, Circuit Breaker, Payment Systems\n\n🟡 Littra Technologies — Java Developer Intern\n   Project: Luxury Closet — E-commerce Platform\n   Focus: Kafka, Microservices, JWT, API Gateway\n\nAsk about any specific internship for more details!" },

      // ── Skills (general) ──
      { patterns: ['skill', 'tech', 'stack', 'proficient', 'tools', 'technology', 'technologies', 'what can he do', 'capabilities', 'expertise'],
        reply: "Ayushmaan's full tech stack:\n\n⚙️ Backend: Python, Django, DRF, FastAPI, Flask, Java, Spring Boot\n🤖 AI/ML: LangChain, LangGraph, MCP Server, LiteLLM, Voice AI\n🗄️ Database: MongoDB, SQL, PostgreSQL\n🚀 DevOps: CI/CD, Kafka, Docker, System Design\n💻 Frontend: React 19, TypeScript, JavaScript\n🏗️ Patterns: Microservices, Saga, Circuit Breaker, RBAC, JWT, WebSocket" },

      // ── Python ecosystem ──
      { patterns: ['python', 'fastapi', 'django', 'drf', 'flask'],
        reply: "Ayushmaan is highly proficient in Python and its web frameworks:\n\n• FastAPI — Currently using at Purple Block for the Caliber platform's WACA backend. Built cost tracing, APIs, and WebSocket communication.\n• Django & DRF — Experience building REST APIs and full-stack applications.\n\nPython is his primary language for backend and AI development." },

      // ── Java ecosystem ──
      { patterns: ['java', 'spring', 'spring boot', 'junit'],
        reply: "Ayushmaan has strong Java & Spring Boot expertise from 2 internships:\n\n• Amdox Technologies — Built healthcare platform with Saga Pattern, Circuit Breaker, distributed locking, and payment systems\n• Littra Technologies — Built e-commerce platform with microservices, Kafka, JWT auth, and API Gateway\n\nHe also has experience with JUnit for testing." },

      // ── AI/ML specific ──
      { patterns: ['ai', 'artificial intelligence', 'machine learning', 'langchain', 'langgraph', 'llm', 'voice ai', 'mcp', 'litellm', 'agent', 'prompt'],
        reply: "Ayushmaan's AI & ML expertise:\n\n🤖 LangChain & LangGraph — Building AI agent workflows\n🔌 MCP Server — Model Context Protocol integration\n💰 LiteLLM — Cost tracing and multi-LLM management (used at Purple Block)\n🎙️ Voice AI — Built voice agents with prompt tuning for insurance automation\n🧠 AI Agents — Created Insurance Agent & Motor Policy Agent at Purple Block\n\nHe combines AI with strong backend skills to build production-grade intelligent systems." },

      // ── Projects (general) ──
      { patterns: ['project', 'built', 'portfolio', 'created', 'made', 'developed', 'work samples', 'showcase'],
        reply: "Ayushmaan's key projects:\n\n🛡️ Caliber — AI Insurance Management Platform\n   Multi-tenant platform handling quotes, policies, claims & renewals with AI workers\n   Tech: FastAPI, Python, LiteLLM, Voice AI, WebSocket\n   Features: LiteLLM Integration, Voice AI Agents, Real-time WebSocket, Plugin System\n\n🏥 DearDoc — Healthcare Platform\n   Enterprise system with robust payment processing & distributed patterns\n   Tech: Java, Spring Boot, Microservices\n   Features: Saga Pattern, Circuit Breaker, Payment Gateway, Notifications\n\n👔 Luxury Closet — E-commerce Platform\n   Scalable microservices-based e-commerce with event-driven architecture\n   Tech: Java, Spring Boot, Kafka, JWT\n   Features: API Gateway, Kafka Events, RBAC, Inventory System" },

      // ── Certifications ──
      { patterns: ['cert', 'certification', 'certificate', 'certified', 'credential', 'badge', 'ibm', 'great learning'],
        reply: "Ayushmaan has 4 certifications:\n\n🏆 Introduction to HTML, CSS & JavaScript — IBM (Jul 2025)\n   ID: GOJ1TYF435XQ\n\n🏆 Introduction to Software Engineering — IBM (May 2025)\n   ID: EUHGV01ADTTE\n\n🏆 Core Java Programming — Great Learning (Oct 2025)\n   ID: YZWMTQEN\n\n🏆 Introduction to DevOps — IBM (Aug 2024)\n   ID: DEVOPS-2024" },

      // ── Kafka ──
      { patterns: ['kafka', 'event driven', 'event-driven', 'message queue', 'messaging', 'streaming'],
        reply: "Ayushmaan used Apache Kafka at Littra Technologies for building an event-driven notification system in the Luxury Closet e-commerce platform. He implemented Kafka-based messaging for order notifications, inventory updates, and asynchronous communication between microservices." },

      // ── Docker / DevOps ──
      { patterns: ['docker', 'container', 'devops', 'cicd', 'ci/cd', 'deployment', 'pipeline', 'infrastructure'],
        reply: "Ayushmaan's DevOps skills include:\n\n🐳 Docker — Containerization of applications\n🔄 CI/CD — Automated build and deployment pipelines\n📊 System Design — Designing scalable distributed systems\n📬 Kafka — Event-driven architecture\n\nHe applies these in building production-grade microservices." },

      // ── Microservices / Architecture ──
      { patterns: ['microservice', 'architecture', 'system design', 'distributed', 'scalab', 'design pattern'],
        reply: "Ayushmaan specializes in distributed systems & architecture:\n\n🏗️ Microservices Architecture — Built at both Amdox and Littra\n🔄 Saga Pattern (Orchestrator) — Used at Amdox for distributed transactions in healthcare\n⚡ Circuit Breaker — Implemented for fault tolerance at Amdox\n🔐 API Gateway — Built at Littra for request routing and auth\n🔒 Distributed Locking — Implemented at Amdox for concurrent operations\n📡 WebSocket — Real-time communication at Purple Block\n🪝 Webhooks — External system integrations at Purple Block" },

      // ── APIs / REST / WebSocket ──
      { patterns: ['api', 'rest', 'restful', 'websocket', 'webhook', 'endpoint', 'gateway'],
        reply: "Ayushmaan has deep API development experience:\n\n🌐 REST APIs — Built with idempotency patterns at Amdox, multiple APIs at Purple Block\n📡 WebSocket — Implemented real-time WACA-frontend communication at Purple Block\n🪝 Webhooks — External integrations at Purple Block\n🚪 API Gateway — Built gateway architecture at Littra for routing and authentication\n🔑 JWT Auth — Token-based authentication system at Littra" },

      // ── Database ──
      { patterns: ['database', 'mongo', 'mongodb', 'sql', 'postgres', 'postgresql', 'data', 'storage', 'db'],
        reply: "Ayushmaan's database experience:\n\n🍃 MongoDB — NoSQL document database\n🐘 PostgreSQL — Advanced relational database\n📊 SQL — Complex queries, joins, and optimization\n\nHe's worked with both SQL and NoSQL databases across his projects, choosing the right tool based on use case." },

      // ── Frontend ──
      { patterns: ['frontend', 'front-end', 'react', 'typescript', 'javascript', 'ui', 'interface', 'web'],
        reply: "Ayushmaan's frontend skills:\n\n⚛️ React 19 — Latest version with modern hooks and patterns\n📘 TypeScript — Type-safe JavaScript development\n🟨 JavaScript — Core language proficiency\n\nWhile he specializes in backend and AI, he's capable of full-stack development and has integrated frontends with his backend APIs." },

      // ── Auth / Security ──
      { patterns: ['auth', 'authentication', 'jwt', 'token', 'security', 'rbac', 'role', 'access control', 'login', 'password'],
        reply: "Ayushmaan has implemented multiple auth & security systems:\n\n🔑 JWT Authentication — Built complete token-based auth at Littra Technologies\n👥 RBAC (Role-Based Access Control) — Implemented role-based permissions at Littra\n🔒 Distributed Locking — Concurrent access control at Amdox\n🔐 Idempotency Patterns — Preventing duplicate operations in REST APIs at Amdox" },

      // ── Saga / Circuit Breaker / Patterns ──
      { patterns: ['saga', 'circuit breaker', 'pattern', 'fault tolerance', 'resilience', 'orchestrat', 'idempoten'],
        reply: "Ayushmaan has implemented enterprise-grade design patterns:\n\n🔄 Orchestrator Saga Pattern — Used at Amdox for managing distributed transactions across microservices in the healthcare platform\n⚡ Circuit Breaker Pattern — Implemented at Amdox for fault tolerance, preventing cascade failures\n🔑 Idempotency Patterns — Built into REST APIs at Amdox to handle duplicate requests safely\n🔒 Distributed Locking — Implemented for managing concurrent operations" },

      // ── Payment / Notification ──
      { patterns: ['payment', 'notification', 'pay', 'billing', 'notify', 'alert', 'sms'],
        reply: "Ayushmaan has built both payment and notification systems:\n\n💳 Payment System — Built payment gateway integration at Amdox Technologies for the DearDoc healthcare platform\n🔔 Notification System — Implemented Kafka-based notifications at Littra Technologies for order updates, inventory alerts, and user communications\n\nBoth systems were designed for reliability and scalability." },

      // ── Voice AI specific ──
      { patterns: ['voice', 'speech', 'talk', 'speak', 'vocal', 'audio'],
        reply: "Ayushmaan built Voice AI agents at Purple Block for the Caliber insurance platform:\n\n🎙️ Voice AI Agents — Built with custom prompt tuning\n🤖 Insurance Agent — Handles insurance-related voice queries\n🚗 Motor Policy Agent — Specialized for motor insurance interactions\n\nThese agents automate customer interactions in the insurance lifecycle." },

      // ── Inventory / E-commerce ──
      { patterns: ['inventory', 'stock', 'warehouse', 'order', 'cart', 'product'],
        reply: "Ayushmaan built an Inventory Management microservice at Littra Technologies for the Luxury Closet e-commerce platform. It handles:\n\n📦 Real-time stock tracking\n🔄 Order processing\n📊 Inventory updates via Kafka events\n🚪 Integration through API Gateway" },

      // ── What makes him unique / why hire ──
      { patterns: ['why hire', 'unique', 'special', 'different', 'stand out', 'strength', 'best at', 'good at', 'strong'],
        reply: "What makes Ayushmaan stand out:\n\n🎯 Rare combo of Backend + AI — He doesn't just build APIs, he builds AI-powered intelligent systems\n🏗️ Enterprise patterns — Saga, Circuit Breaker, distributed locking — not just CRUD\n🚀 Production experience — 3 internships shipping real products\n🔧 Full stack — From React frontend to FastAPI/Spring Boot backend to AI agents\n🧠 Modern AI tools — LangChain, LangGraph, LiteLLM, Voice AI\n📡 Real-time systems — WebSocket, Kafka, event-driven architecture" },

      // ── Availability / Open to work ──
      { patterns: ['available', 'open to work', 'freelance', 'full time', 'part time', 'remote', 'relocat', 'join', 'opportunity'],
        reply: `Ayushmaan is actively looking for opportunities! He's open to:\n\n💼 Full-time roles\n🏠 Remote / Hybrid / On-site\n📍 Currently in Bangalore, India\n\nReach out:\n📧 ${portfolioData.email}\n📱 ${portfolioData.phone}` },

      // ── Resume / CV ──
      { patterns: ['resume', 'cv', 'download', 'pdf', 'document'],
        reply: `For Ayushmaan's detailed resume or CV, please reach out to him directly:\n📧 ${portfolioData.email}\n\nThis portfolio covers all his key skills, experience, and projects!` },

      // ── GitHub / LinkedIn / Social ──
      { patterns: ['github', 'linkedin', 'social', 'profile', 'portfolio link', 'website'],
        reply: `For Ayushmaan's social profiles and links, contact him at:\n📧 ${portfolioData.email}\n📱 ${portfolioData.phone}\n\nYou're already on his portfolio website! 😄` },

      // ── Hobbies / Likes / Personal ──
      { patterns: ['hobby', 'hobbies', 'interest', 'free time', 'fun', 'like', 'likes', 'enjoy', 'enjoys', 'pastime', 'spare time', 'what does he like', 'what he likes', 'outside work', 'leisure'],
        reply: "When Ayushmaan is not coding, he enjoys:\n\n⚽ Playing sports — stays active and competitive\n🎵 Listening to songs — music keeps him going\n📺 Watching web series — loves binge-watching in his downtime\n\nHe balances his tech life with these hobbies to stay creative and refreshed!" },

      // ── Age / Birthday ──
      { patterns: ['age', 'old', 'birthday', 'born'],
        reply: "For personal details like age, feel free to ask Ayushmaan directly at " + portfolioData.email + "! I focus on his professional profile here." },

      // ── Current Company (specific) ──
      { patterns: ['current company', 'company name', 'where does he work', 'employer', 'which company', 'works at'],
        reply: `Ayushmaan currently works at ${portfolioData.currentCompany} as a ${portfolioData.currentRole}.\n\nHe's building '${portfolioData.currentProject}' — a multi-tenant AI insurance management platform.\n\nHis current tech stack: ${portfolioData.currentTechStack.join(', ')}` },

      // ── Current Tech Stack (specific) ──
      { patterns: ['current stack', 'current tech', 'using right now', 'working with now', 'tech at work', 'daily tools', 'day to day'],
        reply: `At ${portfolioData.currentCompany}, Ayushmaan's daily tech stack is:\n\n🐍 FastAPI — Backend framework (WACA backend)\n💰 LiteLLM — LLM cost tracing & management\n📡 WebSocket — Real-time frontend communication\n🎙️ Voice AI — AI agents with prompt tuning\n🐍 Python — Primary language\n🪝 Webhooks — External system integrations` },

      // ── Goodbye ──
      { patterns: ['thank', 'thanks', 'bye', 'goodbye', 'see you', 'later', 'nice', 'helpful', 'awesome', 'great', 'cool'],
        reply: `Glad I could help! 😊 If you'd like to work with Ayushmaan or learn more:\n\n📧 ${portfolioData.email}\n📱 ${portfolioData.phone}\n\nHave a great day!` },

      // ── How many / Count questions ──
      { patterns: ['how many', 'count', 'total', 'number of'],
        reply: "Here's Ayushmaan by the numbers:\n\n👨‍💻 3 Internships (Purple Block, Amdox, Littra)\n🏆 4 Certifications (3 IBM, 1 Great Learning)\n🛠️ 20+ Technologies in his stack\n🚀 3 Major Projects (Caliber, DearDoc, Luxury Closet)\n📚 6 Skill Categories (Backend, AI, Database, DevOps, Frontend, Patterns)" },

      // ── Comparison / vs questions ──
      { patterns: ['better', 'best', 'favorite', 'prefer', 'vs', 'versus', 'compare', 'which'],
        reply: "Ayushmaan is versatile across his stack! His core strengths:\n\n🥇 Strongest: Python/FastAPI + AI (LangChain, LiteLLM, Voice AI)\n🥈 Deep expertise: Java/Spring Boot + Microservices patterns\n🥉 Growing: React 19 + TypeScript for frontend\n\nHe picks the right tool for the job — Python for AI-heavy work, Java for enterprise systems." },
    ];

    // ── Smart matching: score each rule ──
    let bestScore = 0;
    let bestReply = null;

    for (const rule of rules) {
      let score = 0;
      for (const pattern of rule.patterns) {
        if (q.includes(pattern)) {
          // Longer pattern matches = higher score (more specific)
          score += pattern.length;
        }
      }
      if (score > bestScore) {
        bestScore = score;
        bestReply = rule.reply;
      }
    }

    // If no good match, try fuzzy single-word matching as fallback
    if (!bestReply) {
      const words = q.split(/\s+/);
      for (const rule of rules) {
        for (const word of words) {
          if (word.length < 3) continue;
          for (const pattern of rule.patterns) {
            if (pattern.includes(word) || word.includes(pattern)) {
              bestReply = rule.reply;
              break;
            }
          }
          if (bestReply) break;
        }
        if (bestReply) break;
      }
    }

    reply = bestReply || "I can help you learn about Ayushmaan! Try asking about:\n\n💼 Experience & internships\n🛠️ Skills & technologies\n🚀 Projects he's built\n🎓 Education\n🏆 Certifications\n🤖 AI & ML work\n📧 How to contact him\n💪 Why hire him";

    setMessages(prev => [...prev, { role: 'assistant', content: reply }]);
    setIsLoading(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    generateResponse(input);
    setInput('');
  };

  const quickQuestions = [
    "What are his skills?",
    "Tell me about his experience",
    "What projects has he built?",
    "Why should I hire him?",
    "Tell me about his AI work",
    "How can I contact him?"
  ];

  if (!isOpen) return null;

  const isDark = theme === 'dark';

  return (
    <div style={{
      position: 'fixed',
      bottom: '100px',
      right: '20px',
      width: '380px',
      maxWidth: 'calc(100vw - 40px)',
      height: '500px',
      maxHeight: 'calc(100vh - 150px)',
      background: isDark ? 'rgba(10, 10, 30, 0.95)' : 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(20px)',
      borderRadius: '24px',
      border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      zIndex: 1000,
      boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
    }}>
      {/* Header */}
      <div style={{
        padding: '16px 20px',
        borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: 'linear-gradient(90deg, rgba(255,0,255,0.1), rgba(0,255,255,0.1))'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #ff00ff, #00ffff)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '20px'
          }}>🤖</div>
          <div>
            <div style={{ fontWeight: '600', color: isDark ? 'white' : '#1a1a2e', fontSize: '15px' }}>AI Assistant</div>
            <div style={{ fontSize: '12px', color: isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)' }}>Ask about Ayushmaan</div>
          </div>
        </div>
        <button
          onClick={onClose}
          style={{
            background: 'none',
            border: 'none',
            color: isDark ? 'white' : '#1a1a2e',
            fontSize: '24px',
            cursor: 'pointer',
            padding: '4px'
          }}
        >×</button>
      </div>

      {/* Messages */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px'
      }}>
        {messages.map((msg, i) => (
          <div
            key={i}
            style={{
              alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
              maxWidth: '85%',
              padding: '12px 16px',
              borderRadius: msg.role === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
              background: msg.role === 'user' 
                ? 'linear-gradient(135deg, #ff00ff, #00ffff)'
                : isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
              color: msg.role === 'user' ? 'white' : isDark ? 'white' : '#1a1a2e',
              fontSize: '14px',
              lineHeight: '1.5',
              whiteSpace: 'pre-wrap'
            }}
          >
            {msg.content}
          </div>
        ))}
        {isLoading && (
          <div style={{
            alignSelf: 'flex-start',
            padding: '12px 16px',
            borderRadius: '18px 18px 18px 4px',
            background: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
            color: isDark ? 'white' : '#1a1a2e',
            fontSize: '14px'
          }}>
            <span className="typing-dots">Thinking...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Questions */}
      {messages.length === 1 && (
        <div style={{
          padding: '0 16px 12px',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '8px'
        }}>
          {quickQuestions.map((q, i) => (
            <button
              key={i}
              onClick={() => generateResponse(q)}
              style={{
                padding: '8px 14px',
                background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
                border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
                borderRadius: '20px',
                color: isDark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)',
                fontSize: '12px',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              {q}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <form onSubmit={handleSubmit} style={{
        padding: '16px',
        borderTop: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
        display: 'flex',
        gap: '12px'
      }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask me anything..."
          style={{
            flex: 1,
            padding: '12px 18px',
            borderRadius: '24px',
            border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
            background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
            color: isDark ? 'white' : '#1a1a2e',
            fontSize: '14px',
            outline: 'none'
          }}
        />
        <button
          type="submit"
          disabled={isLoading}
          style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #ff00ff, #00ffff)',
            border: 'none',
            color: 'white',
            fontSize: '18px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          ➤
        </button>
      </form>
    </div>
  );
}

// ============================================
// 🔮 MATRIX RAIN EASTER EGG
// ============================================
function MatrixRain() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const chars = 'AYUSHMAAN01アイウエオカキクケコ';
    const fontSize = 14;
    const columns = canvas.width / fontSize;
    const drops = Array(Math.floor(columns)).fill(1);
    const draw = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#0f0';
      ctx.font = fontSize + 'px monospace';
      for (let i = 0; i < drops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillStyle = Math.random() > 0.98 ? '#fff' : `hsl(${120 + Math.random() * 40}, 100%, ${50 + Math.random() * 30}%)`;
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
      }
    };
    const interval = setInterval(draw, 35);
    return () => clearInterval(interval);
  }, []);
  return <canvas ref={canvasRef} style={{ position: 'fixed', inset: 0, zIndex: 9999, pointerEvents: 'none' }} />;
}

// ============================================
// 🕹️ SNAKE GAME
// ============================================
function SnakeGame({ isDark, onClose }) {
  const canvasRef = useRef(null);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const gameState = useRef({ snake: [{ x: 10, y: 10 }], dir: { x: 1, y: 0 }, food: { x: 15, y: 15 }, running: true });

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const size = 20, cols = 20, rows = 20;
    canvas.width = cols * size;
    canvas.height = rows * size;

    const placeFood = () => {
      gameState.current.food = { x: Math.floor(Math.random() * cols), y: Math.floor(Math.random() * rows) };
    };

    const keyHandler = (e) => {
      const { dir } = gameState.current;
      if (e.key === 'ArrowUp' && dir.y === 0) gameState.current.dir = { x: 0, y: -1 };
      if (e.key === 'ArrowDown' && dir.y === 0) gameState.current.dir = { x: 0, y: 1 };
      if (e.key === 'ArrowLeft' && dir.x === 0) gameState.current.dir = { x: -1, y: 0 };
      if (e.key === 'ArrowRight' && dir.x === 0) gameState.current.dir = { x: 1, y: 0 };
    };
    window.addEventListener('keydown', keyHandler);

    const loop = setInterval(() => {
      if (!gameState.current.running) return;
      const { snake, dir, food } = gameState.current;
      const head = { x: snake[0].x + dir.x, y: snake[0].y + dir.y };

      if (head.x < 0 || head.x >= cols || head.y < 0 || head.y >= rows || snake.some(s => s.x === head.x && s.y === head.y)) {
        gameState.current.running = false;
        setGameOver(true);
        return;
      }

      snake.unshift(head);
      if (head.x === food.x && head.y === food.y) {
        setScore(s => s + 10);
        placeFood();
      } else {
        snake.pop();
      }

      ctx.fillStyle = isDark ? '#0a0a1f' : '#f0f4ff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#ff00ff';
      ctx.beginPath();
      ctx.arc(food.x * size + size / 2, food.y * size + size / 2, size / 2 - 2, 0, Math.PI * 2);
      ctx.fill();
      snake.forEach((s, i) => {
        ctx.fillStyle = i === 0 ? '#00ffff' : `hsl(${180 + i * 5}, 100%, 50%)`;
        ctx.fillRect(s.x * size + 1, s.y * size + 1, size - 2, size - 2);
      });
    }, 120);

    return () => { clearInterval(loop); window.removeEventListener('keydown', keyHandler); };
  }, [isDark]);

  const restart = () => {
    gameState.current = { snake: [{ x: 10, y: 10 }], dir: { x: 1, y: 0 }, food: { x: 15, y: 15 }, running: true };
    setScore(0);
    setGameOver(false);
  };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 className="gradient-text" style={{ fontSize: '24px' }}>🐍 Snake Game</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'white', fontSize: '24px', cursor: 'pointer' }}>✕</button>
        </div>
        <div style={{ fontSize: '14px', color: '#00ffff', marginBottom: '12px' }}>Score: {score} | Use arrow keys</div>
        <canvas ref={canvasRef} style={{ borderRadius: '12px', border: '2px solid rgba(255,0,255,0.3)' }} />
        {gameOver && (
          <div style={{ marginTop: '16px' }}>
            <p style={{ color: '#ff00ff', fontSize: '20px', fontWeight: '700', marginBottom: '12px' }}>Game Over! Score: {score}</p>
            <button onClick={restart} style={{ padding: '12px 32px', background: 'linear-gradient(90deg, #ff00ff, #00ffff)', border: 'none', borderRadius: '20px', color: 'white', fontWeight: '600', cursor: 'pointer' }}>Play Again</button>
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================
// 🎵 SPOTIFY FLOATING BADGE
// ============================================
function SpotifyBadge({ isDark, liveTime }) {
  const [expanded, setExpanded] = useState(false);
  const songs = [
    { title: 'Blinding Lights', artist: 'The Weeknd' },
    { title: 'Starboy', artist: 'The Weeknd' },
    { title: 'Save Your Tears', artist: 'The Weeknd' },
    { title: 'Die For You', artist: 'The Weeknd' },
    { title: 'After Hours', artist: 'The Weeknd' },
  ];
  const currentSong = songs[Math.floor(liveTime.getMinutes() / 12) % songs.length];
  const progress = (liveTime.getSeconds() / 60) * 100;
  const SPOTIFY_URL = 'https://open.spotify.com/user/ayushmaan'; // UPDATE with your Spotify profile URL

  return (
    <div style={{ position: 'fixed', bottom: '90px', left: '24px', zIndex: 998 }}>
      {/* Expanded player */}
      {expanded && (
        <div
          onClick={() => window.open(SPOTIFY_URL, '_blank')}
          style={{
            position: 'absolute',
            bottom: '60px',
            left: 0,
            width: '260px',
            padding: '16px',
            borderRadius: '16px',
            background: isDark ? 'rgba(10,10,30,0.85)' : 'rgba(255,255,255,0.85)',
            backdropFilter: 'blur(20px)',
            border: `1px solid ${isDark ? 'rgba(30,215,96,0.2)' : 'rgba(30,215,96,0.3)'}`,
            boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
            cursor: 'pointer',
            animation: 'slideIn 0.3s ease-out',
            transition: 'all 0.3s'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '8px', background: 'linear-gradient(135deg, #1DB954, #191414)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <span style={{ fontSize: '22px' }}>🎵</span>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: '13px', fontWeight: '700', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: isDark ? 'white' : '#1a1a2e' }}>
                {currentSong.title}
              </div>
              <div style={{ fontSize: '11px', color: isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)' }}>
                {currentSong.artist}
              </div>
            </div>
          </div>
          {/* Progress bar */}
          <div style={{ height: '3px', borderRadius: '2px', background: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)', overflow: 'hidden', marginBottom: '6px' }}>
            <div style={{ height: '100%', borderRadius: '2px', background: '#1DB954', width: `${progress}%`, transition: 'width 1s linear' }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '9px', color: isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)' }}>
              0:{(liveTime.getSeconds()).toString().padStart(2, '0')} / 3:45
            </span>
            <span style={{ fontSize: '9px', color: '#1DB954', fontWeight: '600' }}>
              Open Spotify ↗
            </span>
          </div>
        </div>
      )}

      {/* Badge button */}
      <button
        onClick={() => setExpanded(!expanded)}
        style={{
          width: '44px',
          height: '44px',
          borderRadius: '50%',
          background: isDark ? 'rgba(30,215,96,0.15)' : 'rgba(30,215,96,0.1)',
          backdropFilter: 'blur(10px)',
          border: `1px solid ${isDark ? 'rgba(30,215,96,0.3)' : 'rgba(30,215,96,0.2)'}`,
          color: '#1DB954',
          fontSize: '20px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.3s',
          boxShadow: expanded ? '0 0 20px rgba(30,215,96,0.3)' : 'none'
        }}
        title="Now Playing on Spotify"
      >
        {expanded ? '✕' : '🎵'}
      </button>
    </div>
  );
}

// ============================================
// MAIN PORTFOLIO COMPONENT
// ============================================
export default function AyushmaanPortfolio3D() {
  const [theme, setTheme] = useState('dark');
  const [activeSection, setActiveSection] = useState('hero');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(true);
  const [expandedExp, setExpandedExp] = useState(null);
  const [expandedProject, setExpandedProject] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const [snakeOpen, setSnakeOpen] = useState(false);
  const [contactCategory, setContactCategory] = useState(null);
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });
  const [contactSent, setContactSent] = useState(false);
  const [easterEggActive, setEasterEggActive] = useState(null);
  const [logoClicks, setLogoClicks] = useState(0);
  const [themePreset, setThemePreset] = useState('cyberpunk');

  const isDark = theme === 'dark';

  const presetColors = {
    cyberpunk: { primary: '#ff00ff', secondary: '#00ffff', accent: '#ffff00' },
    ocean: { primary: '#0066ff', secondary: '#00ccff', accent: '#00ffaa' },
    forest: { primary: '#00ff88', secondary: '#88ff00', accent: '#00cc66' },
    sunset: { primary: '#ff6600', secondary: '#ff0066', accent: '#ffcc00' },
    galaxy: { primary: '#9900ff', secondary: '#ff00ff', accent: '#6600ff' },
    neon: { primary: '#39ff14', secondary: '#ff073a', accent: '#ffef00' },
    arctic: { primary: '#00d4ff', secondary: '#7df9ff', accent: '#e0ffff' },
    lava: { primary: '#ff4500', secondary: '#ff8c00', accent: '#ffd700' },
    vapor: { primary: '#ff71ce', secondary: '#01cdfe', accent: '#b967ff' },
    matrix: { primary: '#00ff41', secondary: '#008f11', accent: '#00ff41' },
    cherry: { primary: '#ff0055', secondary: '#ff4477', accent: '#ffaacc' },
    midnight: { primary: '#4400ff', secondary: '#0044ff', accent: '#00aaff' },
    toxic: { primary: '#ccff00', secondary: '#00ff00', accent: '#88ff00' },
    rose: { primary: '#ff007f', secondary: '#ff69b4', accent: '#ffb6c1' },
    thunder: { primary: '#ffcc00', secondary: '#ff6600', accent: '#ff0000' },
    ice: { primary: '#88ccff', secondary: '#aaddff', accent: '#ffffff' },
    blood: { primary: '#cc0000', secondary: '#ff0000', accent: '#ff4444' },
    aurora: { primary: '#00ff87', secondary: '#60efff', accent: '#ff00ff' },
    retrowave: { primary: '#f72585', secondary: '#7209b7', accent: '#4361ee' },
    golden: { primary: '#ffd700', secondary: '#ffaa00', accent: '#ff8800' },
  };
  const colors = presetColors[themePreset] || presetColors.cyberpunk;
  const sections = ['hero', 'about', 'timeline', 'experience', 'skills', 'projects', 'achievements', 'fun-facts', 'certifications', 'contact'];

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  // Easter Egg: Konami Code
  useEffect(() => {
    const konami = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
    let pos = 0;
    const handler = (e) => {
      if (e.key === konami[pos]) { pos++; if (pos === konami.length) { setEasterEggActive('konami'); pos = 0; setTimeout(() => setEasterEggActive(null), 5000); } } else { pos = 0; }
    };
    // Easter Egg: type "matrix"
    let typed = '';
    const typeHandler = (e) => {
      typed += e.key.toLowerCase();
      if (typed.includes('matrix')) { setEasterEggActive('matrix'); typed = ''; setTimeout(() => setEasterEggActive(null), 8000); }
      if (typed.length > 20) typed = typed.slice(-10);
    };
    window.addEventListener('keydown', handler);
    window.addEventListener('keypress', typeHandler);
    return () => { window.removeEventListener('keydown', handler); window.removeEventListener('keypress', typeHandler); };
  }, []);

  // Logo click easter egg
  const handleLogoClick = () => {
    const newClicks = logoClicks + 1;
    setLogoClicks(newClicks);
    if (newClicks >= 5) { setEasterEggActive('secret'); setLogoClicks(0); setTimeout(() => setEasterEggActive(null), 5000); }
  };

  // Live time
  const [liveTime, setLiveTime] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setLiveTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setActiveSection(sectionId);
      setMobileMenuOpen(false);
    }
  };

  // Loading Screen
  if (isLoading) {
    return (
      <div style={{
        position: 'fixed',
        inset: 0,
        background: '#050510',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '120px',
            height: '120px',
            margin: '0 auto 24px',
            position: 'relative'
          }}>
            <div style={{
              position: 'absolute',
              inset: 0,
              border: '3px solid rgba(255,0,255,0.3)',
              borderRadius: '50%',
              animation: 'ping 1.5s infinite'
            }} />
            <div style={{
              position: 'absolute',
              inset: '8px',
              border: '3px solid rgba(0,255,255,0.5)',
              borderRadius: '50%',
              animation: 'spin 2s linear infinite'
            }} />
            <div style={{
              position: 'absolute',
              inset: '16px',
              border: '3px solid rgba(255,255,0,0.7)',
              borderRadius: '50%',
              animation: 'pulse 1s infinite'
            }} />
            <div style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <span style={{
                fontSize: '32px',
                fontWeight: '800',
                background: 'linear-gradient(90deg, #ff00ff, #00ffff)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>AS</span>
            </div>
          </div>
          <p style={{ color: 'rgba(255,255,255,0.5)', animation: 'pulse 1s infinite' }}>
            Initializing 3D Experience...
          </p>
        </div>
        <style>{`
          @keyframes ping { 0% { transform: scale(1); opacity: 1; } 75%, 100% { transform: scale(1.5); opacity: 0; } }
          @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
          @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
        `}</style>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: isDark ? '#050510' : '#f0f4ff',
      color: isDark ? 'white' : '#1a1a2e',
      fontFamily: "'Inter', system-ui, sans-serif",
      overflowX: 'hidden',
      transition: 'background 0.5s, color 0.5s'
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Orbitron:wght@400;500;600;700;800;900&display=swap');
        
        :root {
          --c-primary: ${colors.primary};
          --c-secondary: ${colors.secondary};
          --c-accent: ${colors.accent};
        }
        * { margin: 0; padding: 0; box-sizing: border-box; }
        html { scroll-behavior: smooth; }
        body { overflow-x: hidden; -webkit-font-smoothing: antialiased; }
        
        h1, h2, h3, .font-display { font-family: 'Orbitron', sans-serif; }
        
        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
        @keyframes gradient { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
        @keyframes slideIn { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes glow { 0%, 100% { box-shadow: 0 0 20px ${colors.primary}66; } 50% { box-shadow: 0 0 40px ${colors.primary}cc, 0 0 60px ${colors.secondary}66; } }
        @keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
        @keyframes rotateIn { from { opacity: 0; transform: rotateY(-90deg); } to { opacity: 1; transform: rotateY(0); } }
        @keyframes scaleIn { from { opacity: 0; transform: scale(0.8); } to { opacity: 1; transform: scale(1); } }
        @keyframes slideRight { from { opacity: 0; transform: translateX(-30px); } to { opacity: 1; transform: translateX(0); } }
        
        .gradient-text {
          background: linear-gradient(90deg, ${colors.primary}, ${colors.secondary}, ${colors.accent});
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-size: 200% auto;
          animation: gradient 3s ease infinite;
        }
        
        .card-3d {
          will-change: transform;
          transition: transform 0.4s ease, box-shadow 0.4s ease;
        }
        .card-3d:hover {
          transform: translateY(-8px) translateZ(0);
          box-shadow: 0 20px 40px rgba(0,0,0,0.25);
        }
        
        .skill-orb {
          transition: all 0.3s;
        }
        .skill-orb:hover {
          transform: scale(1.15) translateY(-5px);
          box-shadow: 0 15px 40px rgba(255,0,255,0.4);
        }
        
        ::-webkit-scrollbar { width: 8px; }
        ::-webkit-scrollbar-track { background: ${isDark ? '#050510' : '#f0f4ff'}; }
        ::-webkit-scrollbar-thumb { background: linear-gradient(to bottom, #ff00ff, #00ffff); border-radius: 4px; }
        
        .section { min-height: 100vh; padding: 100px 20px 60px; position: relative; }
        
        .glass {
          background: ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.8)'};
          backdrop-filter: blur(10px);
          border: 1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'};
        }
        
        .typing-dots::after {
          content: '';
          animation: dots 1.5s infinite;
        }
        @keyframes dots {
          0%, 20% { content: '.'; }
          40% { content: '..'; }
          60%, 100% { content: '...'; }
        }
      `}</style>

      {/* 3D Background Canvas */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 0 }}>
        <Canvas
          camera={{ position: [0, 0, 15], fov: 60 }}
          dpr={[1, 1.5]}
          performance={{ min: 0.5 }}
          gl={{ antialias: false, powerPreference: 'high-performance' }}
        >
          <Suspense fallback={null}>
            <Scene3D theme={theme} activeSection={activeSection} />
          </Suspense>
        </Canvas>
      </div>

      {/* Navigation */}
      <nav style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        padding: '16px 24px',
        background: isDark ? 'rgba(5,5,16,0.8)' : 'rgba(240,244,255,0.8)',
        backdropFilter: 'blur(20px)',
        borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`
      }}>
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          {/* Logo (click 5x for easter egg) */}
          <div className="gradient-text" onClick={handleLogoClick} style={{ fontSize: '28px', fontWeight: '800', fontFamily: 'Orbitron', cursor: 'pointer', userSelect: 'none' }}>
            AS
          </div>

          {/* Desktop Nav */}
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }} className="desktop-nav">
            {sections.map((section) => (
              <button
                key={section}
                onClick={() => scrollToSection(section)}
                style={{
                  padding: '8px 16px',
                  background: activeSection === section ? 'linear-gradient(90deg, rgba(255,0,255,0.2), rgba(0,255,255,0.2))' : 'transparent',
                  border: `1px solid ${activeSection === section ? '#ff00ff' : 'transparent'}`,
                  borderRadius: '20px',
                  color: activeSection === section ? '#ff00ff' : isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)',
                  fontSize: '13px',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  fontWeight: '500'
                }}
              >
                {section}
              </button>
            ))}
          </div>

          {/* Right Controls */}
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            {/* Theme Toggle */}
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                background: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
                border: 'none',
                color: isDark ? 'white' : '#1a1a2e',
                fontSize: '20px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.3s'
              }}
            >
              {isDark ? '☀️' : '🌙'}
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              style={{
                display: 'none',
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                background: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
                border: 'none',
                color: isDark ? 'white' : '#1a1a2e',
                fontSize: '24px',
                cursor: 'pointer',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              className="mobile-menu-btn"
            >
              {mobileMenuOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            background: isDark ? 'rgba(5,5,16,0.95)' : 'rgba(240,244,255,0.95)',
            backdropFilter: 'blur(20px)',
            borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
            padding: '16px',
            animation: 'slideIn 0.3s ease-out'
          }}>
            {sections.map((section, index) => (
              <button
                key={section}
                onClick={() => scrollToSection(section)}
                style={{
                  display: 'block',
                  width: '100%',
                  padding: '14px 20px',
                  background: activeSection === section ? 'linear-gradient(90deg, rgba(255,0,255,0.2), rgba(0,255,255,0.2))' : 'transparent',
                  border: 'none',
                  borderRadius: '12px',
                  color: activeSection === section ? '#ff00ff' : isDark ? 'white' : '#1a1a2e',
                  fontSize: '15px',
                  textTransform: 'uppercase',
                  letterSpacing: '2px',
                  cursor: 'pointer',
                  textAlign: 'left',
                  marginBottom: '8px',
                  animation: `slideRight 0.3s ease-out ${index * 0.05}s both`
                }}
              >
                {section}
              </button>
            ))}
          </div>
        )}
      </nav>

      {/* Mobile Styles */}
      <style>{`
        @media (max-width: 900px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
        }
      `}</style>

      {/* Main Content */}
      <main style={{ position: 'relative', zIndex: 10 }}>
        {/* Hero Section */}
        <section id="hero" className="section" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
          <div style={{ maxWidth: '900px', animation: 'slideIn 1s ease-out' }}>
            <div style={{ marginBottom: '16px' }}>
              <span style={{ color: '#ff00ff', fontSize: '16px', letterSpacing: '6px', textTransform: 'uppercase' }}>
                Hello, I'm
              </span>
            </div>
            <h1 style={{ fontSize: 'clamp(48px, 10vw, 96px)', fontWeight: '900', marginBottom: '8px', lineHeight: '1.1' }}>
              <span className="gradient-text">AYUSHMAAN</span>
            </h1>
            <h2 style={{ fontSize: 'clamp(36px, 8vw, 72px)', fontWeight: '800', marginBottom: '24px' }}>
              SINGH
            </h2>
            <p style={{ fontSize: '20px', color: isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)', marginBottom: '40px', maxWidth: '600px', margin: '0 auto 40px' }}>
              Full Stack Developer & AI Engineer crafting intelligent, scalable solutions
            </p>
            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                onClick={() => scrollToSection('experience')}
                style={{
                  padding: '16px 40px',
                  background: `linear-gradient(90deg, ${colors.primary}, ${colors.secondary})`,
                  border: 'none',
                  borderRadius: '30px',
                  color: 'white',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  animation: 'glow 2s infinite'
                }}
              >
                View My Work
              </button>
              <button
                onClick={() => scrollToSection('contact')}
                style={{
                  padding: '16px 40px',
                  background: 'transparent',
                  border: `2px solid ${isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)'}`,
                  borderRadius: '30px',
                  color: isDark ? 'white' : '#1a1a2e',
                  fontSize: '16px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.3s'
                }}
              >
                Contact Me
              </button>
            </div>
            <div style={{ display: 'flex', gap: '48px', justifyContent: 'center', marginTop: '60px' }}>
              {[
                { value: '3+', label: 'Internships', color: '#ff00ff' },
                { value: '15+', label: 'Technologies', color: '#00ffff' },
                { value: '4', label: 'Certifications', color: '#ffff00' }
              ].map((stat, i) => (
                <div key={i} style={{ textAlign: 'center', animation: `scaleIn 0.5s ease-out ${0.3 + i * 0.1}s both` }}>
                  <div style={{ fontSize: '36px', fontWeight: '800', color: stat.color }}>{stat.value}</div>
                  <div style={{ fontSize: '14px', color: isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)' }}>{stat.label}</div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: '60px', animation: 'bounce 2s infinite' }}>
              <div style={{
                width: '30px',
                height: '50px',
                border: `2px solid ${isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)'}`,
                borderRadius: '15px',
                margin: '0 auto',
                display: 'flex',
                justifyContent: 'center',
                paddingTop: '8px'
              }}>
                <div style={{ width: '4px', height: '12px', background: '#ff00ff', borderRadius: '2px', animation: 'float 1.5s infinite' }} />
              </div>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="section">
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <h2 className="gradient-text" style={{ fontSize: '48px', textAlign: 'center', marginBottom: '30px' }}>
              About Me
            </h2>
            
            <div style={{ textAlign: 'center', marginBottom: '60px' }}>
              <h3 style={{ fontSize: '28px', fontWeight: '800', marginBottom: '12px' }}>Founder of Genyug AI</h3>
              <p style={{ fontSize: '22px', fontWeight: 'bold', fontStyle: 'italic', background: 'linear-gradient(90deg, #ff00ff, #00ffff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '16px' }}>
                𝙂𝙚𝙣𝙮𝙪𝙜: 𝙇𝙚𝙨𝙨 𝙝𝙪𝙢𝙖𝙣 𝙚𝙧𝙧𝙤𝙧. 𝙈𝙤𝙧𝙚 𝘼𝙄 𝙥𝙤𝙬𝙚𝙧
              </p>
              <h2 style={{ fontSize: '42px', fontWeight: '900', letterSpacing: '4px', margin: 0 }}>DO MORE</h2>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '40px', alignItems: 'center' }}>
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <img
                  src={`${import.meta.env.BASE_URL}avatar.jpeg`}
                  alt="Ayushmaan Singh"
                  className="avatar-tilt"
                  style={{
                    width: '300px',
                    height: '300px',
                    borderRadius: '24px',
                    objectFit: 'cover',
                    border: '3px solid rgba(255,0,255,0.5)',
                    boxShadow: '0 20px 60px rgba(255,0,255,0.3)',
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                    cursor: 'pointer'
                  }}
                  onMouseMove={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 20;
                    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -20;
                    e.currentTarget.style.transform = `perspective(600px) rotateY(${x}deg) rotateX(${y}deg) scale(1.05)`;
                    e.currentTarget.style.boxShadow = `${-x * 2}px ${y * 2}px 60px rgba(255,0,255,0.4)`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'perspective(600px) rotateY(0deg) rotateX(0deg) scale(1)';
                    e.currentTarget.style.boxShadow = '0 20px 60px rgba(255,0,255,0.3)';
                  }}
                />
              </div>
              <div>
                <p style={{ fontSize: '18px', lineHeight: '1.8', marginBottom: '24px', color: isDark ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.8)' }}>
                  I'm a passionate <span style={{ color: '#ff00ff', fontWeight: '600' }}>Full Stack Developer</span> and <span style={{ color: '#00ffff', fontWeight: '600' }}>AI Engineer</span> based in <span style={{ color: '#ffff00', fontWeight: '600' }}>Bangalore, India</span>.
                </p>
                <p style={{ fontSize: '18px', lineHeight: '1.8', marginBottom: '32px', color: isDark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)' }}>
                  From crafting microservices architectures to developing AI-powered agents, I love turning complex problems into elegant solutions. Currently working on cutting-edge insurance tech at Purple Block.
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
                  {[
                    { label: 'Location', value: 'Bangalore, India', color: '#ff00ff' },
                    { label: 'Experience', value: '3 Internships', color: '#00ffff' },
                    { label: 'Education', value: 'AKTU Graduate', color: '#ffff00' },
                    { label: 'Focus', value: 'AI & Backend', color: '#ff6b00' }
                  ].map((item, i) => (
                    <div key={i} className="glass card-3d" style={{ padding: '16px 20px', borderRadius: '16px' }}>
                      <div style={{ fontSize: '12px', color: item.color, marginBottom: '4px' }}>{item.label}</div>
                      <div style={{ fontWeight: '600' }}>{item.value}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Education Section */}
        {/* 📜 Interactive Timeline */}
        <section id="timeline" className="section">
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <h2 className="gradient-text" style={{ fontSize: '48px', textAlign: 'center', marginBottom: '60px' }}>
              My Journey
            </h2>
            <div style={{ position: 'relative', paddingLeft: '40px' }}>
              <div style={{ position: 'absolute', left: '18px', top: 0, bottom: 0, width: '3px', background: 'linear-gradient(to bottom, #ff00ff, #00ffff, #ffff00)', borderRadius: '2px' }} />
              {[
                { year: '2025', title: 'Graduated from AKTU', desc: 'Bachelor\'s in Computer Science from Dr. APJ Abdul Kalam Technical University', icon: '🎓', color: '#ffff00' },
                { year: '2024', title: 'Littra Technologies', desc: 'Java Developer Intern — Built Luxury Closet e-commerce with Kafka, JWT, Microservices', icon: '👔', color: '#ffff00' },
                { year: '2025', title: 'Amdox Technologies', desc: 'Java Developer Intern — Built DearDoc healthcare platform with Saga & Circuit Breaker patterns', icon: '🏥', color: '#00ffff' },
                { year: '2026', title: 'Purple Block', desc: 'Software Developer Intern — Building Caliber AI Insurance Platform with FastAPI, Voice AI, LiteLLM', icon: '🛡️', color: '#ff00ff' },
                { year: '2026', title: 'EazyCapture by Peakeaze', desc: 'Building an AI-powered document understanding and accounting automation platform.', icon: '🚀', color: '#ff6b00' },
              ].map((item, i) => (
                <div key={i} className="card-3d" style={{ position: 'relative', marginBottom: '32px', padding: '24px', borderRadius: '16px', background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.8)', backdropFilter: 'blur(10px)', border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`, borderLeft: `3px solid ${item.color}`, animation: `slideIn 0.5s ease-out ${i * 0.15}s both` }}>
                  <div style={{ position: 'absolute', left: '-52px', top: '24px', width: '28px', height: '28px', borderRadius: '50%', background: item.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', boxShadow: `0 0 20px ${item.color}60` }}>{item.icon}</div>
                  <div style={{ fontSize: '12px', color: item.color, fontWeight: '600', marginBottom: '4px' }}>{item.year}</div>
                  <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '8px' }}>{item.title}</h3>
                  <p style={{ fontSize: '14px', color: isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)', lineHeight: '1.6' }}>{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Experience Section */}
        <section id="experience" className="section">
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <h2 className="gradient-text" style={{ fontSize: '48px', textAlign: 'center', marginBottom: '60px' }}>
              Experience
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {portfolioData.experiences.map((exp, index) => (
                <div
                  key={index}
                  className="card-3d"
                  onClick={() => setExpandedExp(expandedExp === index ? null : index)}
                  style={{
                    padding: '32px',
                    borderRadius: '24px',
                    background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.8)',
                    backdropFilter: 'blur(20px)',
                    border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
                    borderLeft: `4px solid ${exp.color}`,
                    cursor: 'pointer',
                    transition: 'all 0.5s',
                    transform: expandedExp === index ? 'scale(1.02)' : 'scale(1)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
                    <div>
                      <h3 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '4px' }}>{exp.company}</h3>
                      <p style={{ color: isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)', fontSize: '14px' }}>{exp.role}</p>
                    </div>
                    <span style={{
                      padding: '6px 16px',
                      background: `${exp.color}20`,
                      border: `1px solid ${exp.color}40`,
                      borderRadius: '20px',
                      color: exp.color,
                      fontSize: '12px',
                      fontWeight: '600'
                    }}>
                      {exp.period}
                    </span>
                  </div>
                  <h4 style={{ color: exp.color, fontSize: '18px', margin: '16px 0 8px', fontWeight: '600' }}>{exp.project}</h4>
                  <p style={{ color: isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)', marginBottom: '16px', lineHeight: '1.6' }}>{exp.description}</p>
                  
                  {expandedExp === index && (
                    <div style={{ animation: 'slideIn 0.4s ease-out' }}>
                      <h5 style={{ fontWeight: '600', marginBottom: '12px', marginTop: '20px' }}>Key Achievements:</h5>
                      <ul style={{ listStyle: 'none', marginBottom: '20px' }}>
                        {exp.achievements.map((achievement, i) => (
                          <li key={i} style={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: '12px',
                            marginBottom: '10px',
                            color: isDark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)',
                            animation: `slideRight 0.3s ease-out ${i * 0.05}s both`
                          }}>
                            <span style={{ color: exp.color }}>▹</span>
                            {achievement}
                          </li>
                        ))}
                      </ul>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                        {exp.tech.map((tech, i) => (
                          <span key={i} style={{
                            padding: '6px 14px',
                            background: `${exp.color}15`,
                            borderRadius: '12px',
                            fontSize: '13px',
                            color: exp.color
                          }}>
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div style={{ textAlign: 'center', marginTop: '16px', color: isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)', fontSize: '12px' }}>
                    {expandedExp === index ? '▲ Click to collapse' : '▼ Click to expand'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Skills Section */}
        <section id="skills" className="section">
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <h2 className="gradient-text" style={{ fontSize: '48px', textAlign: 'center', marginBottom: '60px' }}>
              Skills & Tech
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
              {Object.entries(portfolioData.skills).map(([category, skills], catIndex) => {
                const colors = ['#ff00ff', '#00ffff', '#ffff00', '#ff6b00', '#00ff88', '#ff0066'];
                const color = colors[catIndex % colors.length];
                return (
                  <div key={category} className="card-3d glass" style={{
                    padding: '28px',
                    borderRadius: '20px',
                    animation: `scaleIn 0.5s ease-out ${catIndex * 0.1}s both`
                  }}>
                    <h3 style={{ color, fontSize: '14px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '16px' }}>
                      {category}
                    </h3>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                      {skills.map((skill, i) => (
                        <span
                          key={i}
                          className="skill-orb"
                          style={{
                            padding: '10px 18px',
                            background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
                            border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
                            borderRadius: '12px',
                            fontSize: '14px',
                            cursor: 'default'
                          }}
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Projects Section */}
        <section id="projects" className="section">
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <h2 className="gradient-text" style={{ fontSize: '48px', textAlign: 'center', marginBottom: '60px' }}>
              Projects
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '28px' }}>
              {portfolioData.projects.map((project, index) => (
                <div
                  key={index}
                  className="card-3d"
                  onClick={() => setExpandedProject(expandedProject === index ? null : index)}
                  style={{
                    padding: '32px',
                    borderRadius: '24px',
                    background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.8)',
                    backdropFilter: 'blur(20px)',
                    border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
                    cursor: 'pointer',
                    transition: 'all 0.5s',
                    animation: `rotateIn 0.6s ease-out ${index * 0.15}s both`
                  }}
                >
                  <div style={{ fontSize: '60px', marginBottom: '20px' }}>{project.icon}</div>
                  <h3 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '8px' }}>{project.title}</h3>
                  <p style={{ color: project.color, fontSize: '14px', marginBottom: '16px' }}>{project.subtitle}</p>
                  <p style={{ color: isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)', fontSize: '14px', lineHeight: '1.6', marginBottom: '20px' }}>
                    {project.description}
                  </p>
                  
                  {expandedProject === index && (
                    <div style={{ animation: 'slideIn 0.4s ease-out' }}>
                      <h5 style={{ fontWeight: '600', marginBottom: '12px' }}>Features:</h5>
                      <ul style={{ listStyle: 'none', marginBottom: '20px' }}>
                        {project.features.map((feature, i) => (
                          <li key={i} style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            marginBottom: '8px',
                            color: isDark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)',
                            fontSize: '14px'
                          }}>
                            <span style={{ color: project.color }}>✦</span>
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {project.tech.map((tech, i) => (
                      <span key={i} style={{
                        padding: '5px 12px',
                        background: `${project.color}15`,
                        borderRadius: '10px',
                        fontSize: '12px',
                        color: project.color
                      }}>
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Certifications Section */}
        <section id="certifications" className="section">
          <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
            <h2 className="gradient-text" style={{ fontSize: '48px', textAlign: 'center', marginBottom: '60px' }}>
              Certifications
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
              {portfolioData.certifications.map((cert, index) => (
                <div key={index} className="card-3d glass" style={{
                  padding: '24px',
                  borderRadius: '20px',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '16px',
                  animation: `slideIn 0.5s ease-out ${index * 0.1}s both`
                }}>
                  <div style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '16px',
                    background: 'linear-gradient(135deg, #ff00ff, #00ffff)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '24px',
                    flexShrink: 0
                  }}>
                    🏆
                  </div>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: '15px', fontWeight: '600', marginBottom: '4px', lineHeight: '1.4' }}>{cert.name}</h3>
                    <p style={{ color: '#ff00ff', fontSize: '13px', marginBottom: '8px' }}>{cert.issuer}</p>
                    <div style={{ display: 'flex', gap: '12px', fontSize: '12px', color: isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)', flexWrap: 'wrap' }}>
                      <span>📅 {cert.date}</span>
                      <span style={{ fontFamily: 'monospace' }}>ID: {cert.id}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 🏆 Achievements/Badges */}
        <section id="achievements" className="section">
          <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
            <h2 className="gradient-text" style={{ fontSize: '48px', textAlign: 'center', marginBottom: '60px' }}>
              Achievements
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
              {[
                { icon: '🏗️', title: 'Microservices Master', desc: 'Built 3 microservice architectures', color: '#ff00ff' },
                { icon: '⚡', title: 'AI Integration Pro', desc: 'LangChain, LiteLLM, Voice AI', color: '#00ffff' },
                { icon: '🎯', title: '100% API Coverage', desc: 'REST, WebSocket, Webhooks, Gateway', color: '#ffff00' },
                { icon: '🔥', title: '3x Internship Streak', desc: 'Purple Block, Amdox, Littra', color: '#ff6b00' },
                { icon: '🛡️', title: 'Pattern Expert', desc: 'Saga, Circuit Breaker, RBAC', color: '#00ff88' },
                { icon: '🎙️', title: 'Voice AI Builder', desc: 'Insurance & Motor Policy Agents', color: '#ff0066' },
                { icon: '🐍', title: 'Python Powerhouse', desc: 'FastAPI, Django, DRF', color: '#ffff00' },
                { icon: '☕', title: 'Java Veteran', desc: 'Spring Boot, JUnit, Enterprise', color: '#00ffff' },
              ].map((badge, i) => (
                <div key={i} className="card-3d glass" style={{ padding: '24px', borderRadius: '20px', textAlign: 'center', animation: `scaleIn 0.4s ease-out ${i * 0.08}s both`, cursor: 'default' }}>
                  <div style={{ fontSize: '48px', marginBottom: '12px' }}>{badge.icon}</div>
                  <h4 style={{ fontSize: '15px', fontWeight: '700', color: badge.color, marginBottom: '6px' }}>{badge.title}</h4>
                  <p style={{ fontSize: '12px', color: isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)' }}>{badge.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 💡 Fun Facts */}
        <section id="fun-facts" className="section">
          <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
            <h2 className="gradient-text" style={{ fontSize: '48px', marginBottom: '60px' }}>
              Fun Facts
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px' }}>
              {[
                { icon: '⌨️', label: 'Lines of Code', value: '2.5M+', color: '#ff00ff' },
                { icon: '☕', label: 'Cups of Chai', value: '1,247', color: '#ffff00' },
                { icon: '🐛', label: 'Bugs Fixed', value: '4,892', color: '#00ffff' },
                { icon: '😅', label: 'Stack Overflow Visits', value: '∞', color: '#ff6b00' },
                { icon: '🎧', label: 'Songs While Coding', value: '10K+', color: '#00ff88' },
                { icon: '📺', label: 'Web Series Binged', value: '47', color: '#ff0066' },
              ].map((fact, i) => (
                <div key={i} className="card-3d glass" style={{ padding: '32px 20px', borderRadius: '20px', animation: `scaleIn 0.4s ease-out ${i * 0.1}s both` }}>
                  <div style={{ fontSize: '48px', marginBottom: '12px' }}>{fact.icon}</div>
                  <div style={{ fontSize: '32px', fontWeight: '800', color: fact.color, marginBottom: '4px' }}>{fact.value}</div>
                  <div style={{ fontSize: '13px', color: isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)' }}>{fact.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 🎵 Spotify section removed — moved to floating badge */}

        {/* ⏰ Availability Status (before contact) */}
        <section className="section" style={{ minHeight: 'auto', padding: '60px 20px' }}>
          <div style={{ maxWidth: '600px', margin: '0 auto' }}>
            <div className="glass card-3d" style={{ padding: '32px', borderRadius: '24px', textAlign: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '20px' }}>
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#00ff88', boxShadow: '0 0 20px #00ff88', animation: 'pulse 1.5s infinite' }} />
                <span style={{ fontSize: '18px', fontWeight: '700', color: '#00ff88' }}>Available for Opportunities</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', flexWrap: 'wrap', fontSize: '14px', color: isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)' }}>
                <span>📍 Bangalore, India (IST)</span>
                <span>🕐 {liveTime.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true })}</span>
                <span>☕ Status: Coding with chai</span>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section with Smart Form */}
        <section id="contact" className="section">
          <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
            <h2 style={{ fontSize: 'clamp(32px, 6vw, 56px)', fontWeight: '800', marginBottom: '16px' }}>
              <span className="gradient-text">Let's Build</span>
            </h2>
            <h3 style={{ fontSize: 'clamp(28px, 5vw, 48px)', fontWeight: '700', marginBottom: '24px' }}>
              Something Amazing
            </h3>
            <p style={{ fontSize: '18px', color: isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)', marginBottom: '48px', maxWidth: '600px', margin: '0 auto 48px' }}>
              I'm always excited to collaborate on innovative projects. Let's create something extraordinary together.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '48px' }}>
              <a href={`mailto:${portfolioData.email}`} className="card-3d glass" style={{
                padding: '32px 24px',
                borderRadius: '20px',
                textDecoration: 'none',
                color: 'inherit',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '40px', marginBottom: '12px' }}>📧</div>
                <h4 style={{ fontWeight: '600', marginBottom: '8px' }}>Email</h4>
                <p style={{ color: '#ff00ff', fontSize: '14px', wordBreak: 'break-all' }}>{portfolioData.email}</p>
              </a>
              <a href={`tel:${portfolioData.phone}`} className="card-3d glass" style={{
                padding: '32px 24px',
                borderRadius: '20px',
                textDecoration: 'none',
                color: 'inherit',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '40px', marginBottom: '12px' }}>📱</div>
                <h4 style={{ fontWeight: '600', marginBottom: '8px' }}>Phone</h4>
                <p style={{ color: '#00ffff', fontSize: '14px' }}>{portfolioData.phone}</p>
              </a>
              <div className="card-3d glass" style={{
                padding: '32px 24px',
                borderRadius: '20px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '40px', marginBottom: '12px' }}>📍</div>
                <h4 style={{ fontWeight: '600', marginBottom: '8px' }}>Location</h4>
                <p style={{ color: '#ffff00', fontSize: '14px' }}>{portfolioData.location}</p>
              </div>
            </div>
            <a
              href={`mailto:${portfolioData.email}`}
              style={{
                display: 'inline-block',
                padding: '18px 48px',
                background: `linear-gradient(90deg, ${colors.primary}, ${colors.secondary})`,
                borderRadius: '30px',
                color: 'white',
                fontSize: '18px',
                fontWeight: '600',
                textDecoration: 'none',
                animation: 'glow 2s infinite'
              }}
            >
              Get In Touch →
            </a>

            {/* 📧 Smart Contact Form */}
            <div style={{ marginTop: '48px', maxWidth: '500px', marginLeft: 'auto', marginRight: 'auto' }}>
              <h3 style={{ fontSize: '22px', fontWeight: '700', marginBottom: '20px' }}>
                Or send a quick message
              </h3>
              {!contactCategory ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', marginBottom: '20px' }}>
                  {[
                    { label: '💼 Job Opportunity', value: 'job' },
                    { label: '🤝 Freelance Project', value: 'freelance' },
                    { label: '🔬 Collaboration', value: 'collab' },
                    { label: '👋 Just saying hi!', value: 'hi' },
                  ].map((cat) => (
                    <button key={cat.value} onClick={() => setContactCategory(cat.value)} className="glass card-3d" style={{ padding: '16px', borderRadius: '16px', border: 'none', cursor: 'pointer', fontSize: '14px', color: 'inherit', textAlign: 'center' }}>
                      {cat.label}
                    </button>
                  ))}
                </div>
              ) : contactSent ? (
                <div className="glass" style={{ padding: '32px', borderRadius: '20px', textAlign: 'center' }}>
                  <div style={{ fontSize: '48px', marginBottom: '12px' }}>✅</div>
                  <p style={{ fontWeight: '600' }}>Message sent! Ayushmaan will get back to you soon.</p>
                </div>
              ) : (
                <div className="glass" style={{ padding: '24px', borderRadius: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                    <span style={{ fontSize: '13px', color: '#ff00ff' }}>
                      {contactCategory === 'job' ? '💼 Job Opportunity' : contactCategory === 'freelance' ? '🤝 Freelance' : contactCategory === 'collab' ? '🔬 Collaboration' : '👋 Saying Hi'}
                    </span>
                    <button onClick={() => setContactCategory(null)} style={{ background: 'none', border: 'none', color: isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)', cursor: 'pointer', fontSize: '12px' }}>Change</button>
                  </div>
                  {['name', 'email', 'message'].map((field) => (
                    field === 'message' ? (
                      <textarea key={field} placeholder="Your message..." value={contactForm.message} onChange={(e) => setContactForm(f => ({ ...f, message: e.target.value }))} rows={3} style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`, background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)', color: 'inherit', fontSize: '14px', outline: 'none', resize: 'none', marginBottom: '12px', boxSizing: 'border-box' }} />
                    ) : (
                      <input key={field} type={field === 'email' ? 'email' : 'text'} placeholder={field === 'name' ? 'Your name' : 'Your email'} value={contactForm[field]} onChange={(e) => setContactForm(f => ({ ...f, [field]: e.target.value }))} style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`, background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)', color: 'inherit', fontSize: '14px', outline: 'none', marginBottom: '12px', boxSizing: 'border-box' }} />
                    )
                  ))}
                  <button onClick={() => { if (contactForm.name && contactForm.email) { window.open(`mailto:${portfolioData.email}?subject=${contactCategory === 'job' ? 'Job Opportunity' : contactCategory === 'freelance' ? 'Freelance Project' : contactCategory === 'collab' ? 'Collaboration' : 'Hello!'}&body=From: ${contactForm.name} (${contactForm.email})%0A%0A${contactForm.message}`); setContactSent(true); } }} style={{ width: '100%', padding: '14px', borderRadius: '12px', background: `linear-gradient(90deg, ${colors.primary}, ${colors.secondary})`, border: 'none', color: 'white', fontWeight: '600', fontSize: '15px', cursor: 'pointer' }}>
                    Send Message ➤
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* 🎨 Theme Customizer */}
        <section className="section" style={{ minHeight: 'auto', padding: '60px 20px' }}>
          <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
            <h2 className="gradient-text" style={{ fontSize: '36px', marginBottom: '12px' }}>
              Choose Your Vibe
            </h2>
            <p style={{ fontSize: '14px', color: isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)', marginBottom: '32px' }}>
              🎨 {Object.keys(presetColors).length} themes to match your mood
            </p>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
              {Object.entries(presetColors).map(([name, c]) => (
                <button
                  key={name}
                  onClick={() => setThemePreset(name)}
                  style={{
                    padding: '10px 18px',
                    borderRadius: '24px',
                    border: themePreset === name ? '2px solid white' : '2px solid transparent',
                    background: `linear-gradient(135deg, ${c.primary}, ${c.secondary})`,
                    color: 'white',
                    fontSize: '12px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s',
                    textTransform: 'capitalize',
                    boxShadow: themePreset === name ? `0 0 20px ${c.primary}66` : 'none',
                    transform: themePreset === name ? 'scale(1.1)' : 'scale(1)',
                  }}
                >
                  {name}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer style={{
          padding: '40px 20px',
          textAlign: 'center',
          borderTop: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`
        }}>
          <p style={{ color: isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)', fontSize: '14px' }}>
            © 2025 Ayushmaan Singh. Crafted with passion & code.
          </p>
        </footer>
      </main>

      {/* 🎵 Spotify Floating Badge */}
      <SpotifyBadge isDark={isDark} liveTime={liveTime} />

      {/* 🕹️ Snake Game Button */}
      <button
        onClick={() => setSnakeOpen(!snakeOpen)}
        style={{
          position: 'fixed',
          bottom: '24px',
          left: '24px',
          width: '52px',
          height: '52px',
          borderRadius: '50%',
          background: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
          border: '1px solid rgba(255,255,255,0.2)',
          color: isDark ? 'white' : '#1a1a2e',
          fontSize: '24px',
          cursor: 'pointer',
          zIndex: 999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.3s'
        }}
        title="Play Snake Game!"
      >🎮</button>

      {/* Snake Game Modal */}
      {snakeOpen && <SnakeGame isDark={isDark} onClose={() => setSnakeOpen(false)} />}

      {/* 🔮 Easter Egg Overlays */}
      {easterEggActive === 'konami' && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.9)', animation: 'fadeIn 0.3s' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '100px', animation: 'bounce 0.5s infinite' }}>🎮</div>
            <h2 className="gradient-text" style={{ fontSize: '48px', margin: '20px 0' }}>KONAMI CODE!</h2>
            <p style={{ color: 'rgba(255,255,255,0.7)' }}>You found a secret! Ayushmaan approves 🎉</p>
          </div>
        </div>
      )}
      {easterEggActive === 'secret' && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.9)', animation: 'fadeIn 0.3s' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '100px' }}>🤫</div>
            <h2 className="gradient-text" style={{ fontSize: '36px', margin: '20px 0' }}>Secret Page Unlocked!</h2>
            <p style={{ color: 'rgba(255,255,255,0.7)', maxWidth: '400px', margin: '0 auto' }}>Fun fact: Ayushmaan built this entire portfolio with an AI assistant. He believes in working smarter, not harder! 💡</p>
          </div>
        </div>
      )}
      {easterEggActive === 'matrix' && <MatrixRain />}

      {/* Chat Button */}
      <button
        onClick={() => setChatOpen(!chatOpen)}
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #ff00ff, #00ffff)',
          border: 'none',
          color: 'white',
          fontSize: '28px',
          cursor: 'pointer',
          zIndex: 999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 10px 40px rgba(255,0,255,0.4)',
          animation: 'glow 2s infinite',
          transition: 'transform 0.3s'
        }}
      >
        {chatOpen ? '✕' : '🤖'}
      </button>

      {/* AI Chatbot */}
      <AIChatbot isOpen={chatOpen} onClose={() => setChatOpen(false)} theme={theme} />
    </div>
  );
}
