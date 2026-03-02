import React, { useEffect, useRef, useState } from "react";
import Lenis from "@studio-freight/lenis";
import { motion, useMotionValue, useSpring, animate } from "framer-motion";
import "./styles.css";
import {
  SiReact,
  SiTypescript,
  SiAngular,
  SiDotnet,
  SiMysql,
} from "react-icons/si";
import gsap from "gsap";
import { DownloadCloudIcon } from "lucide-react";

/* ─── SVG Distortion Filter ─── */
function DistortFilter() {
  return (
    <svg style={{ position: "absolute", width: 0, height: 0 }}>
      <defs>
        <filter id="wavy">
          <feTurbulence
            id="turbulence"
            type="turbulence"
            baseFrequency="0.02 0.04"
            numOctaves="3"
            result="noise"
            seed="2"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="noise"
            scale="0"
            id="displace"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </defs>
    </svg>
  );
}

/* ─── Preloader ─── */
function Preloader({ onDone }) {
  const [count, setCount] = useState(0);
  const [phase, setPhase] = useState("count"); // count | flash | done

  useEffect(() => {
    // Count from 0 to 100 quickly, then flash
    const controls = animate(0, 100, {
      duration: 1.6,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setCount(Math.round(v)),
      onComplete: () => {
        setPhase("flash");
        setTimeout(() => {
          setPhase("done");
          setTimeout(onDone, 400);
        }, 350);
      },
    });
    return () => controls.stop();
  }, []);

  if (phase === "done") return null;

  return (
    <motion.div
      className="preloader"
      animate={phase === "flash" ? { backgroundColor: "#000" } : {}}
      transition={{ duration: 0.3 }}
    >
      <motion.span
        className="preloader-count"
        animate={
          phase === "flash" ? { color: "#fff", scale: 1.3, opacity: 0 } : {}
        }
        transition={{ duration: 0.3 }}
      >
        {count}
      </motion.span>
    </motion.div>
  );
}

/* ─── Wavy Name ─── */
function WavyName() {
  const animFrameRef = useRef(null);
  const phaseRef = useRef(0);
  const [interactive, setInteractive] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setInteractive(true);
    }, 1400); // after drop animation finishes

    return () => clearTimeout(timer);
  }, []);

  const startWave = (el) => {
    const displace = document.getElementById("displace");
    const turb = document.getElementById("turbulence");
    if (!displace || !turb) return;

    el.style.filter = "url(#wavy)";

    let scale = 0;
    let targetScale = 10;

    const tick = () => {
      phaseRef.current += 0.04;

      turb.setAttribute(
        "baseFrequency",
        `${0.015 + Math.sin(phaseRef.current) * 0.008} ${
          0.04 + Math.cos(phaseRef.current * 0.7) * 0.012
        }`
      );

      scale += (targetScale - scale) * 0.08;
      displace.setAttribute("scale", String(scale));

      animFrameRef.current = requestAnimationFrame(tick);
    };

    animFrameRef.current = requestAnimationFrame(tick);
  };

  const stopWave = (el) => {
    const displace = document.getElementById("displace");
    if (!displace) return;

    let scale = parseFloat(displace.getAttribute("scale") || "0");

    const fadeOut = () => {
      scale *= 0.88;
      displace.setAttribute("scale", String(scale));

      if (scale > 0.5) {
        animFrameRef.current = requestAnimationFrame(fadeOut);
      } else {
        displace.setAttribute("scale", "0");
        el.style.filter = "none";
      }
    };

    cancelAnimationFrame(animFrameRef.current);
    animFrameRef.current = requestAnimationFrame(fadeOut);
  };

  const letters = "shreesha venkatram".split("");

  return (
    <div className="hero-name">
      {letters.map((letter, i) => (
        <span
          key={i}
          className="hero-letter"
          onMouseEnter={(e) => interactive && startWave(e.currentTarget)}
          onMouseLeave={(e) => interactive && stopWave(e.currentTarget)}
        >
          {letter}
        </span>
      ))}
    </div>
  );
}

function ScrollHint({ visible }) {
  return (
    <motion.div
      className="scroll-hint"
      initial={{ opacity: 0, y: 20 }}
      animate={visible ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay: 0.8 }}
    >
      <span className="scroll-text">Scroll</span>

      <motion.div
        className="scroll-arrow"
        animate={{ y: [0, 6, 0] }}
        style={{ rotate: 45 }}
        transition={{
          duration: 1.4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </motion.div>
  );
}

/* ─── Custom Cursor ─── */
function Cursor() {
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  const ringX = useSpring(mouseX, { stiffness: 120, damping: 18 });
  const ringY = useSpring(mouseY, { stiffness: 120, damping: 18 });

  const [clicked, setClicked] = useState(false);
  const [hovering, setHovering] = useState(false);

  useEffect(() => {
    const move = (e) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    const down = () => setClicked(true);
    const up = () => setClicked(false);

    const handleHover = (e) => {
      const target = e.target;
      if (target.closest("a, button, .key")) {
        setHovering(true);
      } else {
        setHovering(false);
      }
    };

    window.addEventListener("mousemove", move);
    window.addEventListener("mousedown", down);
    window.addEventListener("mouseup", up);
    window.addEventListener("mouseover", handleHover);

    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mousedown", down);
      window.removeEventListener("mouseup", up);
      window.removeEventListener("mouseover", handleHover);
    };
  }, []);

  return (
    <>
      <motion.div
        className="c-dot"
        style={{ x: mouseX, y: mouseY }}
        animate={{
          scale: clicked ? 0.6 : 1,
        }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
      />

      <motion.div
        className="c-ring"
        style={{ x: ringX, y: ringY }}
        animate={{
          scale: hovering ? 1.8 : 1,
          opacity: hovering ? 0.4 : 0.8,
        }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
      />
    </>
  );
}

function Navbar({ visible }) {
  const [open, setOpen] = useState(false);

  const handleScroll = (id) => {
    setOpen(false);

    const el = document.querySelector(id);
    if (el && window.lenis) {
      window.lenis.scrollTo(el, {
        offset: -80,
        duration: 1.2,
      });
    }
  };

  return (
    <motion.header
      className="navbar"
      initial={{ opacity: 0 }}
      animate={{ opacity: visible ? 1 : 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="nav-logo">
        <AnimatedLogo />
      </div>

      <nav className={`nav-links ${open ? "open" : ""}`}>
        <button onClick={() => handleScroll("#about")} className="nav-link">
          ABOUT
        </button>

        <button onClick={() => handleScroll("#work")} className="nav-link">
          WORK
        </button>

        <button onClick={() => handleScroll("#contact")} className="nav-link">
          CONTACT
        </button>
      </nav>

      <div
        className={`hamburger ${open ? "active" : ""}`}
        onClick={() => setOpen(!open)}
      >
        <span />
        <span />
        <span />
      </div>
    </motion.header>
  );
}

function AnimatedLogo() {
  return (
    <div className="logo-text">
      <a href="/">cvs</a>
    </div>
  );
}

/* ─── Hero Section ─── */
function Hero({ visible }) {
  return (
    <motion.section
      className="hero"
      initial={{ opacity: 0 }}
      animate={{ opacity: visible ? 1 : 0 }}
      transition={{ duration: 0.6, delay: 0.1 }}
    >
      {/* White upper half */}
      <div className="hero-top">
        <div className="hero-top-grid">
          <motion.div
            className="hero-subtitle"
            initial={{ y: 20, opacity: 0 }}
            animate={visible ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            Web & App Design + Dev
          </motion.div>

          <motion.p
            className="hero-bio"
            initial={{ y: 20, opacity: 0 }}
            animate={visible ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            I don’t see creativity as something you switch on, it’s something
            you live with. It’s the instinct to question, to experiment, to
            refine. I’m drawn to bold ideas and thoughtful execution, and I work
            closely with ambitious people to turn raw concepts into experiences
            that feel purposeful, expressive, and alive. Where design meets
            code, I build work that not only looks beautiful, but means
            something.
          </motion.p>
        </div>

        {/* The massive name — clips between white and black */}
        <div className="hero-name-container">
          {visible && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
            >
              <WavyName />
            </motion.div>
          )}
          <ScrollHint visible={visible} />
        </div>
      </div>

      <div className="hero-bottom keyboard-stage">
        <Keyboard3D />
      </div>
    </motion.section>
  );
}

/* ─── Works Section ─── */
const projects = [
  {
    num: "01",
    title: "Clone Applications",
    tag: "Frontend Engineering",
    year: "2024",
    desc: "Built high fidelity recreations of modern platforms to master UI systems and scalable component systems.",
    image: "/projects/clone.png",
    link: "https://github.com/Shreesha99",
  },
  {
    num: "02",
    title: "Personal Portfolio Platform",
    tag: "Design + Dev",
    year: "2024",
    desc: "Interactive portfolio built with advanced motion and UI micro interactions.",
    image: "/projects/port.png",
    link: "https://www.cvshreesha.in/",
  },
  {
    num: "03",
    title: "SaaS Product Experiments",
    tag: "Product Engineering",
    year: "2025",
    desc: "SaaS experiments exploring workflow systems and automation.",
    image: "/projects/POS.jpg",
    link: "https://elysium-pos.vercel.app/",
  },
  {
    num: "04",
    title: "The Elysium Project",
    tag: "Full Stack System",
    year: "2025",
    desc: "Architecting intelligent POS ecosystem with scalable backend.",
    image: "/projects/elysium.png",
    link: "https://the-elysium-project.in",
  },
];

function Keyboard3D() {
  const layout = [
    ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
    ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
    ["Z", "X", "C", "V", "B", "N", "M"],
  ];

  const techMap = {
    R: <SiReact color="#61DAFB" />,
    T: <SiTypescript color="#3178C6" />,
    A: <SiAngular color="#DD0031" />,
    S: <SiMysql color="#4479A1" />,
    D: <SiDotnet color="#512BD4" />,
  };
  return (
    <div className="keyboard-wrapper">
      {layout.map((row, rowIndex) => (
        <div key={rowIndex} className="keyboard-row">
          {row.map((key) => (
            <Key key={key} letter={key} icon={techMap[key]} />
          ))}
        </div>
      ))}
    </div>
  );
}

function NamePreloader({ onDone }) {
  const [expanded, setExpanded] = useState(false);
  const [exit, setExit] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setExpanded(true), 900);
    const t2 = setTimeout(() => setExit(true), 2400);
    const t3 = setTimeout(() => onDone(), 3300);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  return (
    <motion.div
      className="name-preloader"
      initial={{ x: 0 }}
      animate={exit ? { x: "100%" } : { x: 0 }}
      transition={{
        duration: 1,
        ease: [0.83, 0, 0.17, 1],
      }}
    >
      <div className="name-wrap">
        <motion.div layout className="name-row">
          {/* FIRST NAME */}
          <div className="name-block">
            <motion.span layout className="initial">
              s
            </motion.span>
            {expanded && (
              <motion.span
                layout
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: "auto", opacity: 1 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="expand"
              >
                hreesha
              </motion.span>
            )}
          </div>

          {/* LAST NAME */}
          <div className="name-block">
            <motion.span layout className="initial">
              v
            </motion.span>
            {expanded && (
              <motion.span
                layout
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: "auto", opacity: 1 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="expand"
              >
                enkatram
              </motion.span>
            )}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

function Key({ letter, icon }) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      className="key"
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      whileHover={{
        y: -12,
        rotateX: 22,
        rotateY: 8,
      }}
      whileTap={{
        y: 2,
        rotateX: 12,
      }}
      transition={{ type: "spring", stiffness: 260, damping: 18 }}
    >
      <div className="key-cap">
        <motion.span
          className="key-letter"
          animate={{ opacity: hovered && icon ? 0 : 1 }}
          transition={{ duration: 0.2 }}
        >
          {letter}
        </motion.span>

        {icon && (
          <motion.div
            className="key-icon"
            animate={{
              opacity: hovered ? 1 : 0,
              scale: hovered ? 1 : 0.7,
            }}
            transition={{ duration: 0.25 }}
          >
            {icon}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

function WorkRow({ project, i }) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setInView(true);
      },
      { threshold: 0.1 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <motion.div
      ref={ref}
      className="work-row"
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: i * 0.07, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
    >
      <span className="work-num">{project.num}</span>
      <span className="work-title">{project.title}</span>
      <span className="work-tag">{project.tag}</span>
      <span className="work-year">{project.year}</span>
      <span className="work-arrow">↗</span>
    </motion.div>
  );
}

function FloatingPreview({ image, x, y, visible }) {
  return (
    <motion.div
      className="floating-preview"
      style={{
        top: y,
        left: x,
      }}
      animate={{
        opacity: visible ? 1 : 0,
        scale: visible ? 1 : 0.9,
      }}
      transition={{ duration: 0.25 }}
    >
      <img src={image} alt="" />
    </motion.div>
  );
}

function ResumeSection() {
  return (
    <section className="resume-section" id="resume">
      <div className="resume-inner">
        <span className="section-label">RESUME</span>

        <h2 className="resume-heading">
          Professional Experience & Technical Background
        </h2>

        <div className="resume-preview">
          <iframe src="/resume/Shreesha_Resume.pdf" title="Resume" />
        </div>

        <a
          href="/resume/Shreesha_Resume.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="resume-download"
        >
          <DownloadCloudIcon size={20} /> Download Resume
        </a>
      </div>
    </section>
  );
}

function Works() {
  const [hoveredProject, setHoveredProject] = useState(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  useEffect(() => {
    const move = (e) => {
      mouseX.set(e.clientX + 30);
      mouseY.set(e.clientY - 120);
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  return (
    <section className="works-section" id="work">
      <div className="section-header">
        <span className="section-label">SELECTED WORK</span>
      </div>

      <div className="works-list">
        {projects.map((p, i) => (
          <a
            key={p.num}
            href={p.link}
            target="_blank"
            rel="noopener noreferrer"
            onMouseEnter={() => setHoveredProject(p)}
            onMouseLeave={() => setHoveredProject(null)}
          >
            <WorkRow project={p} i={i} />
          </a>
        ))}
      </div>

      <FloatingPreview
        image={hoveredProject?.image}
        x={mouseX}
        y={mouseY}
        visible={!!hoveredProject}
      />
    </section>
  );
}

function Counter({ number, suffix, label, trigger }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!trigger) return;

    let start = 0;
    const duration = 1200;
    const increment = number / (duration / 16);

    const counter = setInterval(() => {
      start += increment;
      if (start >= number) {
        setCount(number);
        clearInterval(counter);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(counter);
  }, [trigger, number]);

  return (
    <div className="stat">
      <strong>
        {count}
        {suffix}
      </strong>
      <span>{label}</span>
    </div>
  );
}

function About() {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) setInView(true);
      },
      { threshold: 0.3 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section className="about-section" id="about">
      <motion.div
        ref={ref}
        className="about-inner"
        initial={{ opacity: 0, y: 40 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="about-left">
          <span className="section-label">ABOUT</span>

          <div className="about-stats">
            <Counter
              number={3}
              suffix="+"
              label="Years Experience"
              trigger={inView}
            />
            <Counter
              number={40}
              suffix="+"
              label="Projects Built"
              trigger={inView}
            />
            {/* <Counter
              number={12}
              suffix="+"
              label="Clients / Teams"
              trigger={inView}
            /> */}
          </div>
        </div>

        <div className="about-right">
          <p>
            I’m <strong>Shreesha</strong>, a{" "}
            <strong>Full Stack Engineer</strong> focused on building robust,
            high performance systems that operate at scale. At{" "}
            <strong>Siemens Gamesa Renewable Energy</strong>, I work on
            enterprise applications that support real world renewable energy
            operations, contributing across both frontend and backend layers.
          </p>

          <p>
            Over the past three years, I’ve architected and integrated{" "}
            <strong>REST APIs</strong>, streamlined complex production
            codebases, and enhanced application performance across large scale
            systems. I enjoy transforming heavy, intricate logic into
            structured, efficient, and scalable solutions.
          </p>

          <p>
            Working within <strong>Agile teams</strong>, I collaborate closely
            with stakeholders and engineers to translate business requirements
            into intuitive interfaces and dependable backend services. My
            approach goes beyond shipping features, I aim to design systems that
            are{" "}
            <strong>
              maintainable, scalable, and built for long term impact
            </strong>
            .
          </p>

          <div className="skills-row">
            {[
              { name: "Angular", icon: <SiAngular /> },
              { name: ".NET & C#", icon: <SiDotnet /> },
              { name: "SQL", icon: <SiMysql /> },
              { name: "React", icon: <SiReact /> },
              { name: "TypeScript", icon: <SiTypescript /> },
            ].map((skill) => (
              <span key={skill.name} className="skill-tag">
                <span className="skill-icon">{skill.icon}</span>
                {skill.name}
              </span>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}

/* ─── Contact / Footer ─── */
function Contact() {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) setInView(true);
      },
      { threshold: 0.1 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section className="contact-section" id="contact">
      <motion.div
        ref={ref}
        className="contact-inner"
        initial={{ opacity: 0, y: 50 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      >
        <p className="contact-eyebrow">Ready to work together?</p>
        <h2 className="contact-heading">
          Let's make something
          <br />
          unforgettable.
        </h2>
        <a
          href="mailto:shreeshavenkatram99@gmail.com"
          className="contact-email"
        >
          shreeshavenkatram99@gmail.com
        </a>
      </motion.div>

      <div className="footer-bar">
        <div className="footer-socials">
          <a
            href="https://github.com/Shreesha99"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-social"
          >
            GITHUB
          </a>

          <a
            href="https://www.linkedin.com/in/shreesha-venkatram/"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-social"
          >
            LINKEDIN
          </a>

          <a
            href="https://www.cvshreesha.in/"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-social"
          >
            PORTFOLIO
          </a>

          <a
            href="mailto:shreeshavenkatram99@gmail.com"
            className="footer-social"
          >
            EMAIL
          </a>
        </div>
        <div className="footer-name-wrap">
          <AnimatedLogo />
          {/* <span className="footer-name">shreesha</span> */}
        </div>
      </div>
    </section>
  );
}

/* ─── Root App ─── */
export default function App() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!loaded) return;

    const lenis = new Lenis({
      duration: 1.2,
      smoothWheel: true,
    });

    window.lenis = lenis;

    const raf = (time) => {
      lenis.raf(time);
      requestAnimationFrame(raf);
    };

    requestAnimationFrame(raf);

    return () => lenis.destroy();
  }, [loaded]);

  return (
    <>
      <DistortFilter />
      <Cursor />

      {!loaded && <NamePreloader onDone={() => setLoaded(true)} />}

      <div className="page">
        <Navbar visible={loaded} />
        <Hero visible={loaded} />
        <About />
        <ResumeSection />
        <Works />
        <Contact />
      </div>
    </>
  );
}
