import React, { useEffect, useRef, useState } from "react";
import Lenis from "@studio-freight/lenis";
import {
  motion,
  useMotionValue,
  useSpring,
  useScroll,
  useTransform,
} from "framer-motion";
import "./styles.css";
import {
  SiReact,
  SiTypescript,
  SiAngular,
  SiDotnet,
  SiMysql,
  SiHackerrank,
  SiNextdotjs,
  SiJira,
} from "react-icons/si";
import gsap from "gsap";
import { DownloadCloudIcon, Github, Instagram, Linkedin } from "lucide-react";
import { Document, Page, pdfjs } from "react-pdf";

pdfjs.GlobalWorkerOptions.workerSrc =
  process.env.PUBLIC_URL + "/pdf.worker.min.mjs";

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

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return isMobile;
}

function FlipCircle() {
  const [flipped, setFlipped] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setFlipped((prev) => !prev);
    }, 2000); // time between flips

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flip-circle-wrapper">
      <motion.div
        className="flip-circle"
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{
          duration: 0.6,
          ease: [0.83, 0, 0.17, 1],
        }}
      >
        <div className="flip-face flip-front">
          <img
            src="https://storage.googleapis.com/shreesha/photo.png"
            alt="front"
          />
        </div>

        <div className="flip-face flip-back">
          <img
            src="https://storage.googleapis.com/shreesha/avatar.png"
            alt="back"
          />
        </div>
      </motion.div>
    </div>
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
    }, 1400);

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

  const renderWord = (word) =>
    word.split("").map((letter, i) => (
      <span
        key={i}
        className="hero-letter"
        onMouseEnter={(e) => interactive && startWave(e.currentTarget)}
        onMouseLeave={(e) => interactive && stopWave(e.currentTarget)}
      >
        {letter}
      </span>
    ));

  return (
    <div className="hero-name">
      <div className="hero-name-row hero-row-wrapper">
        <div className="hero-word hero-first">{renderWord("shreesha")}</div>

        <FlipCircle />

        <div className="hero-word hero-last">{renderWord("venkatram")}</div>
      </div>
    </div>
  );
}

function useHasPointer() {
  const [hasPointer, setHasPointer] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(hover: hover) and (pointer: fine)");
    setHasPointer(mediaQuery.matches);

    const handler = (e) => setHasPointer(e.matches);
    mediaQuery.addEventListener("change", handler);

    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  return hasPointer;
}

/* ─── Custom Cursor ─── */
function Cursor() {
  const hasPointer = useHasPointer();

  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  const ringX = useSpring(mouseX, { stiffness: 120, damping: 18 });
  const ringY = useSpring(mouseY, { stiffness: 120, damping: 18 });

  const [clicked, setClicked] = useState(false);
  const [hovering, setHovering] = useState(false);

  useEffect(() => {
    if (!hasPointer) return;

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
  }, [hasPointer, mouseX, mouseY]);

  if (!hasPointer) return null;

  return (
    <>
      <motion.div
        className="c-dot"
        style={{ x: mouseX, y: mouseY }}
        animate={{ scale: clicked ? 0.6 : 1 }}
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
          About
        </button>

        <button onClick={() => handleScroll("#work")} className="nav-link">
          Work
        </button>

        <button onClick={() => handleScroll("#contact")} className="nav-link">
          Contact
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
        </div>
      </div>

      <div className="hero-bottom keyboard-stage">
        <div className="keyboard-visual">
          <Keyboard3D />
        </div>
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
    image: "https://storage.googleapis.com/shreesha/projects/clone.png",
    link: "https://github.com/Shreesha99",
    alt: "Screenshot of clone applications project showcasing various UI components and layouts inspired by popular platforms.",
  },
  {
    num: "02",
    title: "Personal Portfolio Platform",
    tag: "Design + Dev",
    year: "2024",
    desc: "Interactive portfolio built with advanced motion and UI micro interactions.",
    image: "https://storage.googleapis.com/shreesha/projects/port.png",
    link: "https://www.cvshreesha.in/",
    alt: "Screenshot of personal portfolio project showcasing a clean, modern design with interactive elements and smooth animations.",
  },
  {
    num: "03",
    title: "SaaS Product Experiments",
    tag: "Product Engineering",
    year: "2025",
    desc: "SaaS experiments exploring workflow systems and automation.",
    image: "https://storage.googleapis.com/shreesha/projects/POS.jpg",
    link: "https://elysium-pos.vercel.app/",
    alt: "Screenshot of SaaS product experiment showcasing a sleek dashboard interface with various workflow automation features and data visualizations.",
  },
  {
    num: "04",
    title: "The Elysium Project",
    tag: "Full Stack System",
    year: "2025",
    desc: "Architecting intelligent POS ecosystem with scalable backend.",
    image: "https://storage.googleapis.com/shreesha/projects/elysium.png",
    link: "https://the-elysium-project.in",
    alt: "Screenshot of The Elysium Project showcasing an intelligent POS ecosystem with a user-friendly interface, real-time analytics, and seamless integration of various business operations.",
  },
];

function Keyboard3D() {
  const layout = [
    ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
    ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
    ["Z", "X", "C", "V", "B", "N", "M"],
  ];

  const techMap = {
    R: <SiReact color="#61DAFB" aria-hidden="true" />,
    T: <SiTypescript color="#3178C6" aria-hidden="true" />,
    A: <SiAngular color="#DD0031" aria-hidden="true" />,
    S: <SiMysql color="#4479A1" aria-hidden="true" />,
    D: <SiDotnet color="#512BD4" aria-hidden="true" />,
    N: <SiNextdotjs color="#0070F3" aria-hidden="true" />,
    J: <SiJira color="#0052CC" aria-hidden="true" />,
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
  const isMobile = useIsMobile();
  const [hovered, setHovered] = useState(false);

  const active = isMobile ? true : hovered;

  return (
    <motion.div
      className="key"
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      animate={
        active
          ? { y: -12, rotateX: 22, rotateY: 8 }
          : { y: 0, rotateX: 0, rotateY: 0 }
      }
      transition={{ type: "spring", stiffness: 260, damping: 18 }}
    >
      <div className="key-cap">
        <motion.span
          className="key-letter"
          animate={{ opacity: active && icon ? 0 : 1 }}
          transition={{ duration: 0.2 }}
        >
          {letter}
        </motion.span>

        {icon && (
          <motion.div
            className="key-icon"
            animate={{
              opacity: active ? 1 : 0,
              scale: active ? 1 : 0.7,
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
      <img src={image} alt="Floating preview image for selected work section" />
    </motion.div>
  );
}

function ResumeSection() {
  const ref = useRef(null);
  const innerRef = useRef(null);
  const [inView, setInView] = useState(false);
  const [pageWidth, setPageWidth] = useState(800);
  const [numPages, setNumPages] = useState(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const updateWidth = () => {
      setPageWidth(Math.min(window.innerWidth * 0.75, 850) * scale);
    };
    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, [scale]);

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

  useEffect(() => {
    if (!inView) return;

    gsap.fromTo(
      innerRef.current.children,
      { y: 30, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        stagger: 0.12,
        duration: 1,
        ease: "power3.out",
      }
    );
  }, [inView]);

  return (
    <section className="resume-section" id="resume">
      <motion.div
        ref={ref}
        className="resume-inner"
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      >
        <div ref={innerRef}>
          <span className="section-label">RESUME</span>

          <motion.h2
            className="resume-heading"
            whileHover={{ y: -2 }}
            transition={{ type: "spring", stiffness: 180, damping: 20 }}
          >
            Professional Experience & Technical Background
          </motion.h2>
          <motion.div
            className="resume-preview"
            data-lenis-prevent
            whileHover={{ rotateX: 2, rotateY: -2, scale: 1.01 }}
            transition={{ type: "spring", stiffness: 160, damping: 22 }}
          >
            <Document
              file="/resume/Shreesha_Resume.pdf"
              onLoadSuccess={({ numPages }) => setNumPages(numPages)}
              loading={<div style={{ padding: 40 }}>Loading resume...</div>}
            >
              {Array.from(new Array(numPages), (_, index) => (
                <Page
                  key={index}
                  pageNumber={index + 1}
                  width={pageWidth}
                  renderTextLayer={false}
                  renderAnnotationLayer={false}
                />
              ))}
            </Document>
          </motion.div>

          <motion.a
            href="https://storage.googleapis.com/shreesha/resume/Shreesha_Resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="resume-download"
            whileHover={{
              y: -6,
              scale: 1.05,
              backgroundColor: "#8ab4ff",
              color: "#000",
            }}
            whileTap={{ scale: 0.96 }}
            transition={{ type: "spring", stiffness: 260, damping: 18 }}
          >
            <DownloadCloudIcon size={20} />
            Download Resume
          </motion.a>
        </div>
      </motion.div>
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
        <span className="section-label">Selected Work</span>
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
  const contentRef = useRef(null);
  const [inView, setInView] = useState(false);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [40, -40]);

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

  useEffect(() => {
    if (!inView) return;

    gsap.fromTo(
      contentRef.current.querySelectorAll("p"),
      { y: 24, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        stagger: 0.18,
        duration: 1,
        ease: "power3.out",
      }
    );
  }, [inView]);

  return (
    <section className="about-section" id="about">
      <motion.div
        ref={ref}
        className="about-inner"
        style={{ y }}
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="about-left">
          <span className="section-label">ABOUT</span>

          <div className="about-stats">
            <motion.div
              className="stat"
              whileHover={{ y: -6, scale: 1.05, color: "#6cf2c2" }}
              transition={{ type: "spring", stiffness: 220, damping: 18 }}
            >
              <Counter
                number={3.5}
                suffix="+"
                label="Years Experience"
                trigger={inView}
              />
            </motion.div>

            <motion.div
              className="stat"
              whileHover={{ y: -6, scale: 1.05, color: "#8ab4ff" }}
              transition={{ type: "spring", stiffness: 220, damping: 18 }}
            >
              <Counter
                number={30}
                suffix="+"
                label="Projects Built"
                trigger={inView}
              />
            </motion.div>
          </div>
        </div>

        <div ref={contentRef} className="about-right">
          <motion.p whileHover={{ x: 4 }}>
            I’m <strong className="about-highlight">Shreesha</strong>, a{" "}
            <strong>Full Stack Engineer</strong> focused on building robust,
            high performance systems that operate at scale. At{" "}
            <strong>Siemens Gamesa Renewable Energy</strong>, I work on
            enterprise applications that support real world renewable energy
            operations, contributing across both frontend and backend layers.
          </motion.p>

          <motion.p whileHover={{ x: 4 }}>
            Over the past three years, I’ve architected and integrated{" "}
            <strong>REST APIs</strong>, streamlined complex production
            codebases, and enhanced application performance across large scale
            systems.
          </motion.p>

          <motion.p whileHover={{ x: 4 }}>
            Working within <strong>Agile teams</strong>, I collaborate closely
            with stakeholders and engineers to translate business requirements
            into intuitive interfaces and dependable backend services. I aim to
            design systems that are{" "}
            <strong>
              maintainable, scalable, and built for long term impact
            </strong>
            .
          </motion.p>

          <div className="skills-row">
            {[
              { name: "Angular", icon: <SiAngular />, color: "#dd0031" },
              { name: ".NET & C#", icon: <SiDotnet />, color: "#512bd4" },
              { name: "SQL", icon: <SiMysql />, color: "#4479a1" },
              { name: "React", icon: <SiReact />, color: "#61dafb" },
              { name: "TypeScript", icon: <SiTypescript />, color: "#3178c6" },
            ].map((skill) => (
              <motion.span
                key={skill.name}
                className="skill-tag"
                whileHover={{
                  y: -6,
                  backgroundColor: skill.color,
                  color: "#000",
                }}
                transition={{ type: "spring", stiffness: 260, damping: 18 }}
              >
                <span className="skill-icon">{skill.icon}</span>
                {skill.name}
              </motion.span>
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
          <p className="about-highlight">unforgettable.</p>
        </h2>
        <div className="contact-details">
          <a
            href="mailto:shreeshavenkatram99@gmail.com"
            className="contact-email"
          >
            shreeshavenkatram99@gmail.com
          </a>
          <a href="tel:+919606239247" className="contact-email">
            +91 9606 239 247
          </a>
        </div>
      </motion.div>

      <div className="footer-bar">
        <div className="footer-socials">
          <a
            href="https://github.com/Shreesha99"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-social"
            aria-label="Shreesha Venkatram GitHub Profile"
          >
            <Github size={30} aria-hidden="true" />
          </a>

          <a
            href="https://www.linkedin.com/in/shreesha-venkatram/"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-social"
            aria-label="Shreesha Venkatram LinkedIn Profile"
          >
            <Linkedin size={30} aria-hidden="true" />
          </a>

          <a
            href="https://www.hackerrank.com/profile/shreeshavenkatr1"
            className="footer-social"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Shreesha Venkatram HackerRank Profile"
          >
            <SiHackerrank size={30} aria-hidden="true" />
          </a>
          <a
            href="https://www.instagram.com/shreesha_venkatram/"
            className="footer-social"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Shreesha Venkatram Instagram Profile"
          >
            <Instagram size={30} aria-hidden="true" />
          </a>
        </div>
        <div className="footer-name-wrap">
          <AnimatedLogo />
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

      <main className="page">
        <Navbar visible={loaded} />
        <Hero visible={loaded} />
        <About />
        <ResumeSection />
        <Works />
        <Contact />
      </main>
    </>
  );
}
