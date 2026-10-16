import React, { useEffect, useState } from 'react';
import { ArrowDown, ArrowRight, ArrowUpRight, Menu, X, Pill, HeartPulse, Globe2, Search, PackageCheck, ClipboardList, CheckCircle2 } from 'lucide-react';
import Hero3D from './components/Hero3D';
import Pharma3DShowcase from './components/Pharma3DShowcase';
import MedicalDevices3D from './components/MedicalDevices3D';
import Sourcing3D from './components/Sourcing3D';
import TiltCard from './components/TiltCard';
import Enquiry3DBackdrop from './components/Enquiry3DBackdrop';

const images = {
  hero: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=1800&q=85',
  capsules: 'https://images.unsplash.com/photo-1574157668644-cce54591add8?auto=format&fit=crop&w=1200&q=85',
  blister: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=1200&q=85',
  bottle: 'https://images.unsplash.com/photo-1763668444855-401b58dceb20?auto=format&fit=crop&w=1200&q=85',
  device: 'https://images.unsplash.com/photo-1770836037704-44bd8c7b6978?auto=format&fit=crop&w=1600&q=85',
  sourcing: 'https://images.unsplash.com/photo-1769355104335-acef3aa4c9b6?auto=format&fit=crop&w=1600&q=85'
};

function Header() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);
  return (
    <header className="header">
      <a href="#top" className="brand" onClick={close}>
        <span className="brand-symbol">M<span>+</span></span>
        <span className="brand-copy">MEDSOURCE<small>PHARMA · MEDICAL · SOURCING</small></span>
      </a>
      <button className="mobile-toggle" onClick={() => setOpen(!open)} aria-label="Toggle navigation">
        {open ? <X /> : <Menu />}
      </button>
      <nav className={open ? 'nav open' : 'nav'}>
        <a href="#pharma" onClick={close}>Pharmaceuticals</a>
        <a href="#devices" onClick={close}>Medical devices</a>
        <a href="#sourcing" onClick={close}>Product sourcing</a>
        <a className="nav-button" href="#enquiry" onClick={close}>
          Request a quote <ArrowUpRight size={15} />
        </a>
      </nav>
    </header>
  );
}

function useScrollEffects() {
  useEffect(() => {
    const reveals = [...document.querySelectorAll('.reveal')];
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    reveals.forEach((el) => revealObserver.observe(el));

    let ticking = false;
    const update = () => {
      document.querySelectorAll('[data-parallax]').forEach((el) => {
        const rect = el.getBoundingClientRect();
        const center = rect.top + rect.height / 2 - window.innerHeight / 2;
        const strength = Number(el.dataset.parallax) || 0.12;
        el.style.setProperty('--parallax-y', `${center * strength * -0.12}px`);
      });
      ticking = false;
    };
    const scroll = () => {
      if (!ticking) {
        requestAnimationFrame(update);
        ticking = true;
      }
    };
    window.addEventListener('scroll', scroll, { passive: true });
    update();
    return () => {
      revealObserver.disconnect();
      window.removeEventListener('scroll', scroll);
    };
  }, []);
}

function Hero() {
  return (
    <section className="hero" id="top">
      {/* 3D WebGL Composition */}
      <Hero3D />

      {/* Atmospheric depth gradients */}
      <div className="hero-image-shade" />

      {/* Front Typography & CTAs */}
      <div className="hero-content wrap">
        <div className="eyebrow">
          <span /> PHARMACEUTICALS · MEDICAL DEVICES · SOURCING
        </div>
        <h1>
          Healthcare products.<br />
          <em>Connected.</em>
        </h1>
        <p>
          Discover pharmaceutical products, medical devices, and reliable product sourcing solutions through a unified commercial supply platform.
        </p>
        <div className="hero-actions">
          <a className="btn primary" href="#categories">
            Explore categories <ArrowRight size={16} />
          </a>
          <a className="hero-text-link" href="#sourcing">
            Buy & sell products <ArrowDown size={15} />
          </a>
        </div>
      </div>

      <div className="hero-index">
        <span>01</span><i /> PRODUCT DISCOVERY
      </div>

      <div className="hero-bottom wrap">
        <span>PHARMACEUTICAL PRODUCTS</span>
        <span>MEDICAL DEVICES</span>
        <span>PRODUCT SOURCING</span>
      </div>
    </section>
  );
}

function Categories() {
  const items = [
    {
      id: '01',
      title: 'Pharmaceutical products',
      text: 'Explore medicine formats, packaged blister products, and oral solid dosage formulations.',
      image: images.capsules,
      icon: Pill,
      href: '#pharma',
      className: 'category-tall'
    },
    {
      id: '02',
      title: 'Medical devices',
      text: 'Discover patient telemetry monitors, diagnostic equipment, and clinical instruments.',
      image: images.device,
      icon: HeartPulse,
      href: '#devices',
      className: ''
    },
    {
      id: '03',
      title: 'Product sourcing',
      text: 'Connect qualified product requirements with vetted buyers and verified manufacturers.',
      image: images.sourcing,
      icon: Globe2,
      href: '#sourcing',
      className: ''
    }
  ];

  return (
    <section className="categories section wrap" id="categories">
      <div className="section-heading reveal">
        <div>
          <div className="eyebrow">PRODUCT CATEGORIES <span className="line" /></div>
          <h2>
            One platform.<br />
            <em>Three key categories.</em>
          </h2>
        </div>
        <p>
          Explore available product categories, review specifications, and initiate a commercial supply enquiry.
        </p>
      </div>

      <div className="category-grid">
        {items.map((item, i) => {
          const Icon = item.icon;
          return (
            <TiltCard key={item.id} maxTilt={10} className={`category-card ${item.className} reveal delay-${i}`}>
              <a href={item.href} className="category-card-inner">
                <div className="category-photo">
                  <img src={item.image} alt={item.title} loading="lazy" />
                  <div className="photo-gradient" />
                </div>
                <div className="category-top">
                  <span>{item.id} / 03</span>
                  <span className="circle-arrow"><ArrowUpRight size={18} /></span>
                </div>
                <div className="category-info">
                  <span className="category-icon"><Icon size={19} /></span>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                  <span className="category-link">Explore category <ArrowRight size={15} /></span>
                </div>
              </a>
            </TiltCard>
          );
        })}
      </div>
    </section>
  );
}

function ProductShowcase() {
  const [active, setActive] = useState('All products');
  const products = [
    { name: 'Capsules & tablets', type: 'Pharmaceuticals', image: images.capsules, spec: 'USP 500mg • Oral Solid Dose' },
    { name: 'Blister-pack products', type: 'Pharmaceuticals', image: images.blister, spec: 'Unit-Dose Barrier Pack' },
    { name: 'Medical equipment', type: 'Medical devices', image: images.device, spec: 'ICU Telemetry & Diagnostic Probes' },
    { name: 'Sourcing & distribution', type: 'Product sourcing', image: images.sourcing, spec: 'Monitored Storage (2°C – 8°C)' }
  ];

  const shown = active === 'All products' ? products : products.filter((p) => p.type === active);

  return (
    <section className="showcase section wrap">
      <div className="section-heading reveal">
        <div>
          <div className="eyebrow">PRODUCT EXPLORER <span className="line" /></div>
          <h2>Explore the <em>range.</em></h2>
        </div>
        <p>
          Browse primary product areas and submit an enquiry for your required volume and specifications.
        </p>
      </div>

      <div className="filters reveal">
        {['All products', 'Pharmaceuticals', 'Medical devices', 'Product sourcing'].map((f) => (
          <button key={f} className={active === f ? 'active' : ''} onClick={() => setActive(f)}>
            {f}
          </button>
        ))}
      </div>

      <div className="product-grid">
        {shown.map((p, i) => (
          <TiltCard key={p.name} maxTilt={12} className={`product-card-wrap reveal delay-${i}`}>
            <article className="product-card">
              <a href="#enquiry" className="product-photo">
                <img src={p.image} alt={p.name} loading="lazy" />
                <span><ArrowUpRight size={17} /></span>
              </a>
              <div className="product-meta">
                {p.type} <span>0{i + 1}</span>
              </div>
              <h3>{p.name}</h3>
              <p className="product-spec-line">{p.spec}</p>
              <a href="#enquiry" className="product-enquire">
                Enquire about this category <ArrowRight size={14} />
              </a>
            </article>
          </TiltCard>
        ))}
      </div>
    </section>
  );
}

function Enquiry() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', type: 'Pharmaceutical products', details: '' });
  const update = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  return (
    <section className="enquiry-section" id="enquiry">
      {/* Ambient Mesh Backdrop */}
      <Enquiry3DBackdrop />

      <div className="enquiry-backdrop" />
      <div className="wrap enquiry-layout">
        <div className="enquiry-copy reveal">
          <div className="eyebrow light">PRODUCT ENQUIRY <span className="line" /></div>
          <h2>
            Tell us what<br />
            you’re <em>looking for.</em>
          </h2>
          <p>
            Request product availability, pricing, or supply documentation for pharmaceuticals and medical devices.
          </p>
          <div className="enquiry-note">
            <ClipboardList size={20} />
            <span>
              <strong>Buyer & supplier enquiries</strong>
              <small>Share product specifications, required quantities, destination country, or delivery timelines.</small>
            </span>
          </div>
        </div>

        <div className="enquiry-panel reveal">
          {sent ? (
            <div className="success">
              <CheckCircle2 size={34} />
              <h3>Enquiry preview complete.</h3>
              <p>This is a demonstration enquiry form. Connect your enterprise endpoint before commercial deployment.</p>
              <button className="btn dark" onClick={() => setSent(false)}>
                Create another enquiry <ArrowRight size={15} />
              </button>
            </div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setSent(true);
              }}
            >
              <div className="form-title">
                <span>REQUEST PRODUCT INFORMATION</span>
                <span>01 / 01</span>
              </div>
              <label>
                Name
                <input name="name" required value={form.name} onChange={update} placeholder="Your name" />
              </label>
              <label>
                Business email
                <input type="email" name="email" required value={form.email} onChange={update} placeholder="name@company.com" />
              </label>
              <label>
                Product category
                <select name="type" value={form.type} onChange={update}>
                  <option>Pharmaceutical products</option>
                  <option>Medical devices</option>
                  <option>Product sourcing / buy & sell</option>
                </select>
              </label>
              <label>
                Product requirements
                <textarea
                  name="details"
                  rows="3"
                  required
                  value={form.details}
                  onChange={update}
                  placeholder="Product name, volume, purity standards, delivery location..."
                />
              </label>
              <button className="btn dark full" type="submit">
                Submit enquiry <ArrowRight size={16} />
              </button>
              <small className="form-note">Demonstration enquiry form. Form data is stored in local state.</small>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <div className="wrap footer-top">
        <a href="#top" className="brand footer-brand">
          <span className="brand-symbol">M<span>+</span></span>
          <span className="brand-copy">MEDSOURCE<small>PHARMA · MEDICAL · SOURCING</small></span>
        </a>
        <div className="footer-nav">
          <a href="#pharma">Pharmaceuticals</a>
          <a href="#devices">Medical devices</a>
          <a href="#sourcing">Product sourcing</a>
          <a href="#enquiry">Enquiries</a>
        </div>
        <a className="back-top" href="#top">Back to top ↑</a>
      </div>
      <div className="wrap footer-bottom">
        <span>PHARMACEUTICAL PRODUCTS · MEDICAL DEVICES · PRODUCT SOURCING</span>
        <span>© {new Date().getFullYear()} MEDSOURCE</span>
      </div>
    </footer>
  );
}

export default function App() {
  useScrollEffects();

  return (
    <>
      <Header />
      <main>
        <Hero />
        <Categories />
        <Pharma3DShowcase />
        <MedicalDevices3D />
        <Sourcing3D sourcingImage={images.sourcing} />
        <ProductShowcase />
        <Enquiry />
      </main>
      <Footer />
    </>
  );
}
