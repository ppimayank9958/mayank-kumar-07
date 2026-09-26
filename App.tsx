import { type FormEvent, type ReactNode, useEffect, useRef, useState } from 'react';
import { ArrowUpRight, Check, Code2, Copy, FlaskConical, Github, GraduationCap, Instagram, Linkedin, Mail, Menu, MoveRight, Orbit, PenTool, Smartphone, Sparkles, Target, X } from 'lucide-react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import { Route, Switch, useLocation, Router as WouterRouter } from 'wouter';

const queryClient = new QueryClient();

const navItems = [
  { label: 'About', href: '#about' },
  { label: 'Journey', href: '#journey' },
  { label: 'What I Build', href: '#build' },
  { label: 'Projects', href: '#work' },
  { label: 'Skills', href: '#skills' },
  { label: 'Goals', href: '#goals' },
  { label: 'Contact', href: '#contact' },
];

const buildItems = [
  { title: 'Web Experiences', icon: Code2, description: 'Responsive, expressive web products that make a first impression and keep earning attention.' },
  { title: 'Mobile Applications', icon: Smartphone, description: 'Useful mobile ideas shaped into clear flows, from the first tap to the habit that follows.' },
  { title: 'Education Technology', icon: GraduationCap, description: 'Tools that make learning feel more active, personal, and possible for more people.' },
  { title: 'UI / UX Concepts', icon: PenTool, description: 'Interfaces explored in words, wires, and pixels until the underlying idea becomes clear.' },
  { title: 'Experimental Projects', icon: FlaskConical, description: 'Small, strange, promising experiments that teach me something worth carrying forward.' },
];

const projects = [
  {
    number: '01',
    title: 'Finly',
    type: 'Product / Fintech',
    description: 'A calmer way for young professionals to make sense of money, built around small decisions instead of big spreadsheets.',
    tags: ['React', 'Product thinking', 'Data viz'],
    tone: 'ink',
    metric: '01 · product in motion',
  },
  {
    number: '02',
    title: 'Campus OS',
    type: 'Community / Systems',
    description: 'The operating layer for student communities: events, people, ideas, and the energy between them.',
    tags: ['Next.js', 'Systems design', 'Community'],
    tone: 'teal',
    metric: '02 · building in public',
  },
  {
    number: '03',
    title: 'Aster',
    type: 'Exploration / AI',
    description: 'An experiment in making AI feel less like a chatbot and more like a thoughtful creative collaborator.',
    tags: ['Python', 'LLMs', 'Interaction'],
    tone: 'gold',
    metric: '03 · still becoming',
  },
];

const skills = ['JavaScript', 'TypeScript', 'React', 'Next.js', 'Node.js', 'Python', 'PostgreSQL', 'Figma', 'Product thinking', 'Writing'];

const profileFacts = [
  { label: 'Name', value: 'Mayank Kumar' },
  { label: 'Role', value: 'Developer & Builder' },
  { label: 'Focus', value: 'Building useful digital experiences' },
  { label: 'Interests', value: 'Technology, Coding, Product Development, UI/UX, AI' },
];

const exploringTopics = [
  { label: 'Artificial Intelligence', note: 'AI, LLMs, and intelligent systems', icon: Sparkles },
  { label: 'Modern Web Dev', note: 'Fast, expressive, useful web experiences', icon: Code2 },
  { label: 'Mobile Development', note: 'Clear flows for small screens', icon: Smartphone },
  { label: 'Cloud Technology', note: 'Reliable systems behind the interface', icon: Orbit },
  { label: 'Automation', note: 'Making repetitive work feel lighter', icon: Target },
  { label: 'AI/ML Research', note: 'Following ideas worth understanding', icon: FlaskConical },
  { label: 'Product Development', note: 'Turning observations into real things', icon: PenTool },
  { label: 'Startup Ideas', note: 'Exploring the shape of something bigger', icon: MoveRight },
];

const goals = [
  { title: 'Become a Stronger Developer', status: 'Ongoing', statusTone: 'ongoing', note: 'Master advanced patterns, contribute to open source, and deepen my understanding of software architecture.', icon: Code2 },
  { title: 'Build Meaningful Products', status: 'Near Future', statusTone: 'near', note: 'Ship digital products that solve real problems for real people — not just demos or experiments.', icon: Sparkles },
  { title: 'Explore Advanced Technologies', status: 'Ongoing', statusTone: 'ongoing', note: 'Go deeper into AI, cloud computing, and modern web architecture. Build things that were not possible five years ago.', icon: Orbit },
  { title: 'Work on Larger Real-World Projects', status: 'Medium Term', statusTone: 'medium', note: 'Collaborate with teams, contribute to products with real user bases, and learn from the challenges that scale brings.', icon: Target },
  { title: 'Explore Entrepreneurship', status: 'Long Term', statusTone: 'long', note: 'Take an idea from concept to product, understand markets, and build something with genuine value.', icon: PenTool },
  { title: 'Never Stop Learning', status: 'Always', statusTone: 'always', note: 'Stay curious, stay humble, stay hungry. The best developers are the ones who never stop being students.', icon: GraduationCap },
];

const journeyItems = [
  { title: 'Foundations with Technology', note: 'The first questions, experiments, and tools that made building feel possible.', icon: Sparkles },
  { title: 'The Coding Begins', note: 'Learning how ideas become real through persistence, practice, and small wins.', icon: Code2 },
  { title: 'Learning with AI', note: 'Exploring new ways to think, create, and work alongside intelligent tools.', icon: Orbit },
  { title: 'Exploring Python & JavaScript', note: 'Going deeper into the languages behind useful products and expressive experiences.', icon: FlaskConical },
  { title: 'Mobile Development with Flutter', note: 'Shaping mobile ideas into clear, tactile flows that people can carry with them.', icon: Smartphone },
  { title: 'Real-World Projects', note: 'Moving from exercises to products with real constraints, feedback, and purpose.', icon: Target },
  { title: 'Designing for Product Thinking', note: 'Learning to connect interface decisions to the bigger problem worth solving.', icon: PenTool },
  { title: 'Exploring AI & Modern Web', note: 'Following the overlap between intelligent systems, design, and the open web.', icon: GraduationCap },
  { title: 'Building Bigger, Thinking Larger', note: 'Keeping the next chapter open for ambitious ideas and meaningful work.', icon: MoveRight },
];

function AppLink({ href, children, className = '', onClick }: { href: string; children: ReactNode; className?: string; onClick?: () => void }) {
  return <a data-testid={`link-${href.replace('#', '')}`} href={href} onClick={onClick} className={className}>{children}</a>;
}

function Cursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const move = (event: MouseEvent) => {
      if (cursorRef.current) {
        cursorRef.current.style.left = `${event.clientX}px`;
        cursorRef.current.style.top = `${event.clientY}px`;
      }
    };
    const enter = (event: MouseEvent) => {
      if ((event.target as HTMLElement).closest('a, button, input, textarea')) cursorRef.current?.classList.add('is-hovering');
    };
    const leave = (event: MouseEvent) => {
      if ((event.target as HTMLElement).closest('a, button, input, textarea')) cursorRef.current?.classList.remove('is-hovering');
    };
    window.addEventListener('mousemove', move);
    document.addEventListener('mouseover', enter);
    document.addEventListener('mouseout', leave);
    return () => {
      window.removeEventListener('mousemove', move);
      document.removeEventListener('mouseover', enter);
      document.removeEventListener('mouseout', leave);
    };
  }, []);
  return <div ref={cursorRef} className="custom-cursor hidden md:block" aria-hidden="true" />;
}

function Navigation({ active, menuOpen, setMenuOpen }: { active: string; menuOpen: boolean; setMenuOpen: (value: boolean) => void }) {
  return (
    <header className="fixed top-0 z-50 w-full px-5 pt-4 md:px-10 md:pt-6">
      <nav className="mx-auto flex max-w-[1320px] items-center justify-between rounded-full border border-[#192033]/15 bg-[#f4f0e8]/85 px-4 py-3 shadow-[0_8px_30px_rgba(25,32,51,.06)] backdrop-blur-xl md:px-5">
        <AppLink href="#about" className="display-face flex items-center gap-2 text-lg font-bold tracking-tight" onClick={() => setMenuOpen(false)}>
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#192033] text-sm text-[#f4f0e8]">MK</span>
          <span className="hidden sm:inline">Mayank Kumar</span>
        </AppLink>
        <div className="hidden items-center gap-0.5 lg:flex">
          {navItems.map((item) => (
            <AppLink key={item.href} href={item.href} className={`rounded-full px-3 py-2 text-[10px] font-bold uppercase tracking-[.12em] transition-colors ${active === item.href.slice(1) ? 'nav-active bg-[#192033] text-[#f4f0e8]' : 'text-[#192033]/60 hover:bg-[#192033]/8 hover:text-[#192033]'}`}>
              {item.label}
            </AppLink>
          ))}
        </div>
        <AppLink href="#contact" className="magnetic hidden items-center gap-2 rounded-full bg-[#f7b955] px-4 py-2.5 text-[11px] font-extrabold uppercase tracking-[.15em] text-[#192033] hover:-translate-y-0.5 md:flex">
          Let&apos;s talk <ArrowUpRight size={14} />
        </AppLink>
        <button data-testid="button-toggle-menu" aria-label="Toggle navigation" onClick={() => setMenuOpen(!menuOpen)} className="rounded-full border border-[#192033]/15 p-2 lg:hidden">
          {menuOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </nav>
      {menuOpen && (
        <div className="mx-auto mt-2 max-w-[1320px] rounded-3xl border border-[#192033]/15 bg-[#f4f0e8]/95 p-3 shadow-xl backdrop-blur-xl lg:hidden">
          {navItems.map((item) => <AppLink key={item.href} href={item.href} onClick={() => setMenuOpen(false)} className="block rounded-2xl px-4 py-3 text-sm font-bold uppercase tracking-[.1em] hover:bg-[#f7b955]">{item.label}</AppLink>)}
        </div>
      )}
    </header>
  );
}

function SectionIntro({ kicker, title, children, dark = false }: { kicker: string; title: ReactNode; children?: ReactNode; dark?: boolean }) {
  return (
    <div className={`mb-14 grid gap-8 md:mb-20 md:grid-cols-[1.15fr_.85fr] md:items-end ${dark ? 'text-[#f4f0e8]' : ''}`}>
      <div>
        <p className={`mono-face mb-5 text-[10px] uppercase tracking-[.28em] ${dark ? 'text-[#67decf]' : 'text-[#168f88]'}`}>{kicker}</p>
        <h2 className="display-face max-w-3xl text-5xl font-bold leading-[.94] md:text-7xl">{title}</h2>
      </div>
      {children && <div className={`max-w-sm text-sm leading-7 ${dark ? 'text-[#f4f0e8]/65' : 'text-[#192033]/60'}`}>{children}</div>}
    </div>
  );
}

function Introduction() {
  return (
    <section id="about" className="grid-texture min-h-[100svh] px-6 py-24 text-[#f4f0e8] md:px-12 md:py-28">
      <div className="mx-auto max-w-[1320px]">
        <div className="mx-auto flex min-h-[calc(100svh-9rem)] max-w-[1050px] flex-col items-center justify-center text-center">
          <div className="reveal">
            <p className="mono-face mb-5 text-[10px] uppercase tracking-[.28em] text-[#168f88]">01 / The person behind the pixels</p>
            <h1 className="display-face text-6xl font-bold leading-[.86] md:text-[9rem]">Mayank <span className="text-[#168f88]">Kumar.</span></h1>
            <div className="role-marquee mt-8" aria-label="Developer, Builder, Student, Creator">
              <div className="marquee-track flex w-max items-center gap-12 whitespace-nowrap">
                <span className="text-sm font-bold uppercase tracking-[.16em] text-[#f4f0e8] md:text-base">Developer <span className="text-[#f7b955]">•</span> Builder <span className="text-[#f7b955]">•</span> Student <span className="text-[#f7b955]">•</span> Creator</span>
                <span aria-hidden="true" className="text-sm font-bold uppercase tracking-[.16em] text-[#f4f0e8] md:text-base">Developer <span className="text-[#f7b955]">•</span> Builder <span className="text-[#f7b955]">•</span> Student <span className="text-[#f7b955]">•</span> Creator</span>
              </div>
            </div>
          </div>
          <div className="reveal reveal-delay-1 mt-10 max-w-2xl">
            <p className="display-face text-3xl font-semibold leading-tight md:text-4xl">I turn ideas into digital experiences and products.</p>
            <p className="mt-6 max-w-md text-sm leading-7 text-[#192033]/60">I&apos;m a curious developer and builder learning in public, exploring new ideas, and working toward products that feel useful, considered, and a little more human.</p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <AppLink href="#work" className="magnetic flex items-center gap-2 rounded-full bg-[#192033] px-5 py-3 text-xs font-bold text-[#f4f0e8] hover:-translate-y-1">Explore My Work <ArrowUpRight size={15} /></AppLink>
              <AppLink href="#contact" className="magnetic flex items-center gap-2 rounded-full border border-[#192033]/20 px-5 py-3 text-xs font-bold hover:-translate-y-1">Let&apos;s Connect <MoveRight size={15} /></AppLink>
            </div>
            <div className="mt-10 flex items-center justify-center gap-3">
              <a data-testid="link-intro-github" href="https://github.com" target="_blank" rel="noreferrer" aria-label="GitHub" className="rounded-full border border-[#192033]/15 p-2.5 transition-colors hover:bg-[#f7b955]"><Github size={16} /></a>
              <a data-testid="link-intro-linkedin" href="https://linkedin.com" target="_blank" rel="noreferrer" aria-label="LinkedIn" className="rounded-full border border-[#192033]/15 p-2.5 transition-colors hover:bg-[#f7b955]"><Linkedin size={16} /></a>
              <a data-testid="link-intro-instagram" href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram" className="rounded-full border border-[#192033]/15 p-2.5 transition-colors hover:bg-[#f7b955]"><Instagram size={16} /></a>
              <a data-testid="link-intro-email" href="mailto:hello@mayankbuilds.dev" aria-label="Email Mayank" className="rounded-full border border-[#192033]/15 p-2.5 transition-colors hover:bg-[#f7b955]"><Mail size={16} /></a>
              <span className="ml-2 h-px w-10 bg-[#192033]/20" />
              <span className="mono-face text-[9px] uppercase tracking-[.2em] text-[#192033]/45">Open to good ideas</span>
            </div>
          </div>
        </div>
        <div className="reveal reveal-delay-2 mt-20 grid gap-8 border-y border-[#192033]/15 py-8 lg:grid-cols-[.65fr_1.35fr] lg:items-center">
          <figure data-testid="image-profile-placeholder" className="relative flex min-h-[260px] items-end overflow-hidden rounded-[1.5rem] bg-[#e4ddd0] p-5">
            <div className="absolute -right-10 -top-16 h-52 w-52 rounded-full border border-[#168f88]/35" />
            <div className="absolute bottom-8 left-1/2 h-36 w-36 -translate-x-1/2 rounded-full bg-[#192033] text-center text-[#f4f0e8] shadow-[0_18px_40px_rgba(25,32,51,.18)]">
              <span className="display-face absolute inset-0 flex items-center justify-center text-5xl font-bold">MK</span>
            </div>
            <figcaption className="relative z-10 flex w-full items-center justify-between border-t border-[#192033]/15 pt-3 text-[9px] uppercase tracking-[.16em] text-[#192033]/55">
              <span>Profile image placeholder</span><span className="text-[#168f88]">Replace later</span>
            </figcaption>
          </figure>
          <dl className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
            {profileFacts.map((fact) => <div data-testid={`profile-fact-${fact.label.toLowerCase()}`} key={fact.label} className="border-b border-[#192033]/15 pb-4"><dt className="mono-face text-[10px] uppercase tracking-[.2em] text-[#168f88]">{fact.label}</dt><dd className="mt-2 max-w-sm text-sm font-semibold leading-6">{fact.value}</dd></div>)}
          </dl>
        </div>
        <div className="reveal reveal-delay-2 mt-24 grid gap-8 border-t border-[#192033]/15 pt-8 md:grid-cols-3">
          <div><p className="mono-face text-[10px] text-[#168f88]">What I care about</p><p className="mt-4 text-lg leading-snug">Clear thinking, generous products, and the courage to start before everything is figured out.</p></div>
          <div><p className="mono-face text-[10px] text-[#168f88]">Where I am</p><p className="mt-4 text-lg leading-snug">Based in India, learning from everywhere, building toward something of my own.</p></div>
          <div><p className="mono-face text-[10px] text-[#168f88]">The short version</p><p className="mt-4 text-lg leading-snug">Give me a blank canvas and a question worth asking.</p></div>
        </div>
      </div>
    </section>
  );
}

function WhatIBuild() {
  const [active, setActive] = useState(0);
  const selected = buildItems[active];
  return (
    <section id="build" className="bg-[#f7b955] px-6 py-24 md:px-12 md:py-36">
      <div className="mx-auto max-w-[1320px]">
        <SectionIntro kicker="02 / What I build" title={<>Many formats.<br /><span className="text-[#168f88]">One point of view.</span></>} >
          I like the early stage: finding the shape of the problem, trying the first interaction, and making an idea tangible enough for someone else to react to.
        </SectionIntro>
        <div className="grid gap-4 md:grid-cols-[1.05fr_.95fr]">
          <div className="grid gap-3 sm:grid-cols-2">
            {buildItems.map((item, index) => {
              const Icon = item.icon;
              return <button data-testid={`button-build-${index}`} key={item.title} onClick={() => setActive(index)} className={`build-offering ${active === index ? 'is-active' : ''} rounded-[1.35rem] border border-[#192033]/20 p-5 text-left ${index === 4 ? 'sm:col-span-2' : ''}`}>
                <Icon size={22} strokeWidth={1.6} />
                <span className="mt-14 block text-lg font-bold">{item.title}</span>
                <span className="mt-2 block text-xs opacity-60">{String(index + 1).padStart(2, '0')}</span>
              </button>;
            })}
          </div>
          <div className="reveal relative flex min-h-[380px] flex-col justify-between overflow-hidden rounded-[1.75rem] bg-[#192033] p-7 text-[#f4f0e8] md:min-h-full">
            <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full border border-[#67decf]/30" />
            <div className="absolute -bottom-24 -left-16 h-72 w-72 rounded-full border border-[#f7b955]/25" />
            <div className="relative flex items-center justify-between"><span className="mono-face text-[10px] uppercase tracking-[.23em] text-[#67decf]">Selected lens</span><Sparkles size={16} className="text-[#f7b955]" /></div>
            <div className="relative">
              <h3 className="display-face text-4xl font-bold md:text-5xl">{selected.title}</h3>
              <p className="mt-5 max-w-sm text-sm leading-7 text-[#f4f0e8]/60">{selected.description}</p>
            </div>
            <div className="relative flex items-center justify-between border-t border-[#f4f0e8]/15 pt-4 text-[10px] uppercase tracking-[.18em] text-[#f4f0e8]/45"><span>Click a format to explore</span><ArrowUpRight size={16} /></div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Work() {
  return (
    <section id="work" className="px-6 py-24 md:px-12 md:py-36">
      <div className="mx-auto max-w-[1320px]">
        <SectionIntro kicker="03 / Projects" title={<>Selected work.<br /><span className="text-[#168f88]">Ideas with a pulse.</span></>} >
          These are explorations in public: questions I got curious enough to turn into a product, a system, or a useful little world.
        </SectionIntro>
        <div className="grid gap-5 md:grid-cols-3">
          {projects.map((project, index) => (
            <article data-testid={`card-project-${project.title.toLowerCase().replace(' ', '-')}`} key={project.title} className={`work-card reveal reveal-delay-${index + 1} flex min-h-[420px] flex-col justify-between rounded-[1.75rem] p-6 ${project.tone === 'ink' ? 'bg-[#192033] text-[#f4f0e8]' : project.tone === 'teal' ? 'bg-[#168f88] text-[#f4f0e8]' : 'bg-[#f7b955] text-[#192033]'}`}>
              <div>
                <div className="flex items-start justify-between"><span className="mono-face text-[10px] opacity-60">{project.number} — {project.type}</span><ArrowUpRight className="work-arrow opacity-70" size={20} /></div>
                <h3 className="display-face mt-16 text-5xl font-bold">{project.title}</h3>
                <p className="mt-5 max-w-xs text-sm leading-6 opacity-70">{project.description}</p>
              </div>
              <div><p className="mono-face mb-4 text-[9px] uppercase tracking-[.2em] opacity-55">{project.metric}</p><div className="flex flex-wrap gap-2">{project.tags.map((tag) => <span key={tag} className="rounded-full border border-current/20 px-3 py-1 text-[10px] font-bold">{tag}</span>)}</div></div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function SkillsAndExploring() {
  const [activeNode, setActiveNode] = useState(0);
  return (
    <>
      <section id="skills" className="bg-[#192033] px-6 py-24 text-[#f4f0e8] md:px-12 md:py-36">
        <div className="mx-auto max-w-[1320px]">
          <SectionIntro dark kicker="04 / Skills & technologies" title={<>The stack is a means.<br /><span className="text-[#f7b955]">The feeling is the work.</span></>} >
            I care about the technical details because they create the conditions for good thinking: fast feedback, clear systems, and interfaces that feel obvious only after someone has cared enough.
          </SectionIntro>
          <div className="reveal grid gap-12 border-t border-[#f4f0e8]/15 pt-8 md:grid-cols-[.7fr_1.3fr]">
            <div><p className="mono-face text-[10px] uppercase tracking-[.25em] text-[#67decf]">Currently fluent in</p><p className="mt-5 max-w-xs text-sm leading-7 text-[#f4f0e8]/55">A deliberately mixed toolkit for turning a blank canvas into a real thing.</p></div>
            <div className="flex flex-wrap content-start gap-3">{skills.map((skill) => <span data-testid={`skill-${skill.toLowerCase().replace(' ', '-')}`} key={skill} className="skill-pill rounded-full border border-[#f4f0e8]/20 px-4 py-3 text-sm">{skill}</span>)}</div>
          </div>
        </div>
      </section>
      <section id="exploring" className="exploring-section px-6 py-24 text-[#f4f0e8] md:px-12 md:py-32">
        <div className="mx-auto max-w-[1320px]">
          <div className="exploring-heading reveal">
            <p className="mono-face text-[10px] uppercase tracking-[.28em] text-[#f7b955]">05 / Exploring</p>
            <h2 className="display-face mt-4 text-5xl font-bold leading-[.9] md:text-7xl">Currently <span className="text-[#f7b955]">Exploring.</span></h2>
            <p className="mt-5 max-w-sm text-sm leading-7 text-[#f4f0e8]/50">Areas I&apos;m actively learning, experimenting with, and building in.</p>
          </div>
          <div className="mt-12 grid gap-10 md:grid-cols-[.55fr_1.45fr] md:items-center">
            <div className="orbit-scene reveal" aria-hidden="true">
              <div className="orbit-scene-glow" />
              <div className="orbit-scene-ring orbit-scene-ring-a" />
              <div className="orbit-scene-ring orbit-scene-ring-b" />
              <div className="orbit-scene-ring orbit-scene-ring-c" />
              <div className="orbit-scene-core">MK</div>
              <span className="orbit-scene-ball orbit-scene-ball-a" />
              <span className="orbit-scene-ball orbit-scene-ball-b" />
              <span className="orbit-scene-ball orbit-scene-ball-c" />
              <span className="orbit-scene-ball orbit-scene-ball-d" />
            </div>
            <div className="exploring-topics reveal reveal-delay-1">
              {exploringTopics.map((topic, index) => {
                const Icon = topic.icon;
                return <button data-testid={`button-explore-${index}`} aria-pressed={activeNode === index} key={topic.label} onClick={() => setActiveNode(index)} className={`exploring-topic-card ${activeNode === index ? 'is-active' : ''}`}>
                  <span className="exploring-topic-icon"><Icon size={13} /></span>
                  <span><strong>{topic.label}</strong><small>{topic.note}</small></span>
                </button>;
              })}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function Journey() {
  return (
    <section id="journey" className="journey-section px-6 py-24 md:px-12 md:py-32">
      <div className="mx-auto max-w-[980px]">
        <div className="journey-heading reveal">
          <p className="mono-face text-[10px] uppercase tracking-[.28em] text-[#f7b955]">06 / Journey</p>
          <h2 className="display-face mt-4 text-6xl font-bold leading-[.86] md:text-8xl">My <span className="text-[#f7b955]">Journey.</span></h2>
          <p className="mt-5 max-w-sm text-sm leading-7 text-[#f4f0e8]/55">A timeline of learning, building, and becoming more intentional about the things I bring into the world.</p>
        </div>
        <div className="journey-list mt-14">
          {journeyItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <div key={item.title} className={`journey-row reveal reveal-delay-${(index % 3) + 1}`}>
                <div className="journey-marker"><Icon size={13} /></div>
                <article className="journey-card">
                  <div className="flex items-center justify-between gap-4">
                    <span className="mono-face text-[9px] uppercase tracking-[.2em] text-[#f7b955]">0{index + 1} / milestone</span>
                    <span className="mono-face text-[9px] text-[#f4f0e8]/30">in progress</span>
                  </div>
                  <h3 className="display-face mt-4 text-xl font-bold md:text-2xl">{item.title}</h3>
                  <p className="mt-2 max-w-2xl text-xs leading-6 text-[#f4f0e8]/50">{item.note}</p>
                </article>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function Milestones() {
  const milestones = [
    { value: '10+', label: 'Projects Built', note: 'From small experiments to useful things.' },
    { value: '3+', label: 'Years Coding', note: 'Learning by making, breaking, and rebuilding.' },
    { value: '5+', label: 'Technologies', note: 'A growing toolkit for turning ideas real.' },
    { value: '∞', label: 'Ideas in Queue', note: 'Always another question worth exploring.' },
  ];
  return (
    <section id="milestones" className="milestones-section px-6 py-20 md:px-12 md:py-24">
      <div className="mx-auto max-w-[1320px]">
        <p className="mono-face text-[10px] uppercase tracking-[.28em] text-[#f7b955]">07 / Milestones</p>
        <h2 className="display-face mt-4 text-5xl font-bold leading-none md:text-7xl">Milestones<span className="text-[#f7b955]">.</span></h2>
        <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {milestones.map((milestone, index) => <article key={milestone.label} className={`milestone-card reveal reveal-delay-${index + 1}`}>
            <span className="milestone-symbol" aria-hidden="true">{index === 0 ? '◌' : index === 1 ? '⌁' : index === 2 ? '✣' : '∞'}</span>
            <strong>{milestone.value}</strong>
            <h3>{milestone.label}</h3>
            <p>{milestone.note}</p>
          </article>)}
        </div>
      </div>
    </section>
  );
}

function Goals() {
  return (
    <section id="goals" className="goals-section px-6 py-24 md:px-12 md:py-32">
      <div className="mx-auto max-w-[1320px]">
        <div className="goals-heading reveal">
          <p className="mono-face text-[10px] uppercase tracking-[.28em] text-[#f7b955]">08 / Goals</p>
          <h2 className="display-face mt-4 text-5xl font-bold leading-[.9] md:text-7xl">Where I&apos;m <span className="text-[#f7b955]">Going.</span></h2>
          <p className="mt-5 max-w-md text-sm leading-7 text-[#f4f0e8]/50">Ambitious but grounded. Here&apos;s what I&apos;m working toward.</p>
        </div>
        <div className="goals-grid mt-12">
          {goals.map((goal, index) => {
            const Icon = goal.icon;
            return <article key={goal.title} className={`goal-card reveal reveal-delay-${(index % 3) + 1}`}>
              <div className="flex items-center justify-between gap-4">
                <Icon size={14} className="text-[#cdb083]" />
                <span className={`goal-status goal-status-${goal.statusTone}`}>{goal.status}</span>
              </div>
              <h3 className="display-face mt-8 text-xl font-bold leading-tight">{goal.title}</h3>
              <p>{goal.note}</p>
            </article>;
          })}
        </div>
      </div>
    </section>
  );
}

function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [copied, setCopied] = useState(false);
  const email = 'hello@mayankbuilds.dev';
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!form.name.trim() || !/^\S+@\S+\.\S+$/.test(form.email) || form.subject.trim().length < 3 || form.message.trim().length < 12) { setStatus('error'); return; }
    setStatus('loading');
    window.setTimeout(() => setStatus('success'), 900);
  };
  const copyEmail = async () => {
    try { await navigator.clipboard.writeText(email); } catch { /* clipboard unavailable */ }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };
  return (
    <section id="contact" className="bg-[#168f88] px-6 py-24 text-[#f4f0e8] md:px-12 md:py-36">
      <div className="mx-auto max-w-[1320px]">
        <div className="grid gap-14 md:grid-cols-[.9fr_1.1fr] md:gap-24">
          <div className="reveal">
            <p className="mono-face text-[10px] uppercase tracking-[.28em] text-[#f7b955]">09 / Contact</p><h2 className="display-face mt-5 text-6xl font-bold leading-[.88] md:text-8xl">Have a<br /><span className="text-[#f7b955]">spark?</span></h2>
            <p className="mt-8 max-w-sm text-sm leading-7 text-[#f4f0e8]/70">Tell me what you&apos;re thinking. A product, a problem, a wild tangent — I&apos;m always up for a conversation that might become something.</p>
            <button data-testid="button-copy-email" onClick={copyEmail} className="magnetic mt-8 flex items-center gap-3 border-b border-[#f4f0e8]/35 pb-2 text-sm font-bold hover:border-[#f7b955]">{copied ? <Check size={16} /> : <Copy size={16} />} {copied ? 'Copied to clipboard' : email}</button>
            <div className="mt-14 flex gap-3"><a data-testid="link-github" href="https://github.com" target="_blank" rel="noreferrer" aria-label="GitHub" className="rounded-full border border-[#f4f0e8]/25 p-3 transition-colors hover:bg-[#f7b955] hover:text-[#192033]"><Github size={17} /></a><a data-testid="link-linkedin" href="https://linkedin.com" target="_blank" rel="noreferrer" aria-label="LinkedIn" className="rounded-full border border-[#f4f0e8]/25 p-3 transition-colors hover:bg-[#f7b955] hover:text-[#192033]"><Linkedin size={17} /></a><a data-testid="link-instagram" href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram" className="rounded-full border border-[#f4f0e8]/25 p-3 transition-colors hover:bg-[#f7b955] hover:text-[#192033]"><Instagram size={17} /></a><a data-testid="link-email" href={`mailto:${email}`} aria-label="Email Mayank" className="rounded-full border border-[#f4f0e8]/25 p-3 transition-colors hover:bg-[#f7b955] hover:text-[#192033]"><Mail size={17} /></a></div>
          </div>
          <form onSubmit={submit} className="reveal reveal-delay-1 rounded-[1.75rem] bg-[#f4f0e8] p-6 text-[#192033] md:p-9">
            <div className="mb-8 flex items-center justify-between"><p className="mono-face text-[10px] uppercase tracking-[.22em] text-[#168f88]">Start a thread</p><span className="h-2 w-2 rounded-full bg-[#f7b955]" /></div>
            <label className="mb-6 block text-sm font-bold">Your name<input data-testid="input-name" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} className="mt-2 w-full border-b border-[#192033]/20 bg-transparent py-3 text-lg outline-none transition-colors focus:border-[#168f88]" placeholder="How should I call you?" /></label>
            <label className="mb-6 block text-sm font-bold">Email address<input data-testid="input-email" type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} className="mt-2 w-full border-b border-[#192033]/20 bg-transparent py-3 text-lg outline-none transition-colors focus:border-[#168f88]" placeholder="you@somewhere.com" /></label>
            <label className="mb-6 block text-sm font-bold">Subject<input data-testid="input-subject" value={form.subject} onChange={(event) => setForm({ ...form, subject: event.target.value })} className="mt-2 w-full border-b border-[#192033]/20 bg-transparent py-3 text-lg outline-none transition-colors focus:border-[#168f88]" placeholder="What are we exploring?" /></label>
            <label className="mb-2 block text-sm font-bold">What&apos;s on your mind?<textarea data-testid="input-message" value={form.message} onChange={(event) => setForm({ ...form, message: event.target.value })} className="mt-2 min-h-28 w-full resize-none border-b border-[#192033]/20 bg-transparent py-3 text-lg outline-none transition-colors focus:border-[#168f88]" placeholder="A sentence or two is perfect." /></label>
            {status === 'error' && <p data-testid="status-form-error" className="mt-4 text-xs font-bold text-[#c84d45]">Add your name, a valid email, subject, and a little more detail.</p>}
            {status === 'success' && <p data-testid="status-form-success" className="mt-4 flex items-center gap-2 text-xs font-bold text-[#168f88]"><Check size={15} /> Message staged — I&apos;ll be in touch soon.</p>}
            <button data-testid="button-submit-contact" disabled={status === 'loading' || status === 'success'} className="magnetic mt-8 flex w-full items-center justify-between rounded-full bg-[#192033] px-5 py-4 text-sm font-bold text-[#f4f0e8] transition-transform hover:-translate-y-1 disabled:opacity-60">{status === 'loading' ? 'Sending a signal…' : status === 'success' ? 'Signal received' : 'Send the signal'}<MoveRight size={17} /></button>
          </form>
        </div>
      </div>
    </section>
  );
}

function Home() {
  const [active, setActive] = useState('about');
  const [menuOpen, setMenuOpen] = useState(false);
  const [showTop, setShowTop] = useState(false);
  useEffect(() => {
    document.title = 'Mayank Kumar — Developer, builder, future entrepreneur';
    const meta = document.querySelector('meta[name="description"]') ?? document.createElement('meta');
    meta.setAttribute('name', 'description');
    meta.setAttribute('content', 'The portfolio of Mayank Kumar — a developer and builder turning curious ideas into useful things.');
    document.head.appendChild(meta);
    const revealObserver = new IntersectionObserver((entries) => entries.forEach((entry) => entry.isIntersecting && entry.target.classList.add('is-visible')), { threshold: .14 });
    document.querySelectorAll('.reveal').forEach((element) => revealObserver.observe(element));
    const sectionObserver = new IntersectionObserver((entries) => entries.forEach((entry) => entry.isIntersecting && setActive(entry.target.id)), { rootMargin: '-25% 0px -60% 0px' });
    navItems.forEach((item) => { const section = document.querySelector(item.href); if (section) sectionObserver.observe(section); });
    const scroll = () => setShowTop(window.scrollY > 700);
    window.addEventListener('scroll', scroll, { passive: true });
    return () => { revealObserver.disconnect(); sectionObserver.disconnect(); window.removeEventListener('scroll', scroll); };
  }, []);
  return (
    <div className="portfolio-shell min-h-[100dvh]">
      <Cursor />
      <Navigation active={active} menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <main><Introduction /><WhatIBuild /><Work /><SkillsAndExploring /><Journey /><Milestones /><Goals /><Contact /></main>
      <footer className="flex flex-col gap-6 bg-[#192033] px-6 py-8 text-[#f4f0e8]/55 md:flex-row md:items-center md:justify-between md:px-12"><p className="display-face text-lg font-bold text-[#f4f0e8]">Mayank Kumar<span className="text-[#f7b955]">.</span></p><div className="flex flex-wrap items-center gap-3 text-[10px] uppercase tracking-[.16em]"><span>© 2026 Mayank Kumar. All rights reserved.</span><span aria-hidden="true">·</span><span>Designed &amp; Built by Mayank Kumar</span></div></footer>
      <button data-testid="button-back-to-top" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} aria-label="Back to top" className={`back-top fixed bottom-6 right-6 z-40 rounded-full bg-[#f7b955] p-3 text-[#192033] shadow-lg ${showTop ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-4 opacity-0'}`}><ArrowUpRight size={18} /></button>
    </div>
  );
}

function Router() {
  return <RoutedErrorBoundary><Switch><Route path="/" component={Home} /><Route component={NotFound} /></Switch></RoutedErrorBoundary>;
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function App() {
  return <QueryClientProvider client={queryClient}><TooltipProvider><WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}><Router /></WouterRouter><Toaster /></TooltipProvider></QueryClientProvider>;
}

export default App;