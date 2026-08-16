import React, { useMemo, useState } from "react";
import {
  ArrowRight,
  BookOpen,
  Camera,
  CheckCircle2,
  ChevronRight,
  Earth,
  HandHeart,
  HeartHandshake,
  Menu,
  MessageCircle,
  ShieldCheck,
  Sparkles,
  Users,
  X,
} from "lucide-react";
import logo from "./assets/seven-academy-logo.svg";
import navbarLogo from "./assets/seven-academy-navbar.svg";
import { supabase } from "./supabase";

const whatsappNumber = (import.meta.env.VITE_WHATSAPP_NUMBER || "").replace(
  /\D/g,
  "",
);

const navItems = [
  ["Propósito", "#proposito"],
  ["Qué hacemos", "#que-hacemos"],
  ["Método", "#metodo"],
  ["Misioneros", "#misioneros"],
];

const actionCards = [
  {
    icon: HandHeart,
    title: "Ayuda en momentos de necesidad",
    text: "Movilizamos personas, habilidades y recursos para responder con humanidad cuando una comunidad necesita apoyo.",
  },
  {
    icon: BookOpen,
    title: "Colportaje con propósito",
    text: "Compartimos literatura que inspira, con un énfasis especial en El Conflicto de los Siglos y en conversaciones que acerquen esperanza.",
  },
  {
    icon: Camera,
    title: "Contenido y proyectos audiovisuales",
    text: "Convertimos ideas de misión en historias, videos y campañas que puedan viajar más lejos y conectar con nuevas personas.",
  },
  {
    icon: Users,
    title: "Formación y acompañamiento",
    text: "Preparamos jóvenes para servir mejor: comunicación, colportaje, creación de contenido, trabajo en equipo y desarrollo de proyectos.",
  },
];

const steps = [
  [
    "01",
    "Escuchamos",
    "Entendemos quién eres, qué sabes hacer y dónde puedes aportar.",
  ],
  [
    "02",
    "Conectamos",
    "Unimos necesidades reales con personas, habilidades, equipos y oportunidades.",
  ],
  [
    "03",
    "Creamos una ruta",
    "Definimos una misión concreta, responsables, recursos y una forma práctica de ejecutarla.",
  ],
  [
    "04",
    "Actuamos y medimos",
    "Servimos, documentamos aprendizajes y mejoramos el siguiente proyecto.",
  ],
];

const initialForm = {
  full_name: "",
  age: "",
  country_city: "",
  whatsapp: "",
  email: "",
  skills: "",
  help_area: "",
  availability: "",
  missionary_experience: "",
  message: "",
  consent: false,
};

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState({ type: "", message: "" });
  const [sending, setSending] = useState(false);

  const year = useMemo(() => new Date().getFullYear(), []);

  const update = (event) => {
    const { name, value, type, checked } = event.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const composeWhatsAppMessage = () => {
    return [
      "Hola Seven Academy 👋",
      "Quiero participar o servir como misionero/a.",
      "",
      `Nombre: ${form.full_name}`,
      `Edad: ${form.age || "No indicada"}`,
      `Ciudad / País: ${form.country_city}`,
      `WhatsApp: ${form.whatsapp}`,
      `Correo: ${form.email || "No indicado"}`,
      `Lo que sé hacer: ${form.skills}`,
      `Dónde puedo ayudar: ${form.help_area}`,
      `Disponibilidad: ${form.availability}`,
      `Experiencia misionera: ${form.missionary_experience || "No indicada"}`,
      `Mensaje: ${form.message || "Sin mensaje adicional"}`,
    ].join("\n");
  };

  const submitForm = async (event) => {
    event.preventDefault();
    setStatus({ type: "", message: "" });

    if (!form.consent) {
      setStatus({
        type: "error",
        message: "Debes aceptar el uso de tus datos para continuar.",
      });
      return;
    }

    setSending(true);
    try {
      if (!supabase) {
        throw new Error(
          "La base de datos aún no está configurada. Revisa VITE_SUPABASE_URL y VITE_SUPABASE_PUBLISHABLE_KEY.",
        );
      }

      const { error } = await supabase.from("missionary_applications").insert({
        full_name: form.full_name,
        age: form.age ? Number(form.age) : null,
        country_city: form.country_city,
        whatsapp: form.whatsapp,
        email: form.email || null,
        skills: form.skills,
        help_area: form.help_area,
        availability: form.availability,
        missionary_experience: form.missionary_experience || null,
        message: form.message || null,
      });

      if (error) throw error;

      const message = encodeURIComponent(composeWhatsAppMessage());
      if (whatsappNumber) {
        window.open(
          `https://wa.me/${whatsappNumber}?text=${message}`,
          "_blank",
          "noopener,noreferrer",
        );
      }

      setStatus({
        type: "success",
        message: whatsappNumber
          ? "Tus datos fueron guardados. Abrimos WhatsApp para que completes el contacto con Seven Academy."
          : "Tus datos fueron guardados. Falta configurar el número oficial de WhatsApp en VITE_WHATSAPP_NUMBER.",
      });
      setForm(initialForm);
    } catch (error) {
      setStatus({
        type: "error",
        message:
          error.message ||
          "No pudimos enviar el formulario. Inténtalo nuevamente.",
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="site-shell">
      <header className="topbar">
        <a className="brand" href="#inicio" aria-label="Seven Academy - Inicio">
          <img className="navbar-logo" src={navbarLogo} alt="Seven Academy" />
        </a>
        <nav className="desktop-nav" aria-label="Navegación principal">
          {navItems.map(([label, href]) => (
            <a key={href} href={href}>
              {label}
            </a>
          ))}
        </nav>
        <a className="nav-cta desktop-cta" href="#misioneros">
          Quiero sumarme <ArrowRight size={17} />
        </a>
        <button
          className="menu-button"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Abrir menú"
        >
          {menuOpen ? <X /> : <Menu />}
        </button>
      </header>

      {menuOpen && (
        <div className="mobile-nav">
          {navItems.map(([label, href]) => (
            <a key={href} href={href} onClick={() => setMenuOpen(false)}>
              {label}
            </a>
          ))}
          <a href="#misioneros" onClick={() => setMenuOpen(false)}>
            Quiero sumarme
          </a>
        </div>
      )}

      <main>
        <section className="hero" id="inicio">
          <div className="hero-glow hero-glow-red" />
          <div className="hero-glow hero-glow-blue" />
          <div className="hero-grid" />
          <div className="hero-copy">
            <div className="eyebrow">
              <Sparkles size={16} /> Jóvenes que convierten la fe en acción
            </div>
            <h1>
              Una misión puede empezar con <span>lo que ya sabes hacer.</span>
            </h1>
            <p className="hero-lead">
              Seven Academy conecta personas, talentos y proyectos para servir,
              compartir esperanza y construir una red misionera que pueda actuar
              donde haga falta.
            </p>
            <div className="hero-actions">
              <a className="primary-button" href="#misioneros">
                Quiero ser parte <ArrowRight size={18} />
              </a>
              <a className="secondary-button" href="#que-hacemos">
                Conoce lo que hacemos <ChevronRight size={18} />
              </a>
            </div>
            <div className="hero-proof">
              <div>
                <Earth size={18} />
                <span>
                  Participación abierta a jóvenes de distintos lugares del mundo
                </span>
              </div>
              <div>
                <HeartHandshake size={18} />
                <span>
                  Servicio, literatura, contenido y formación con propósito
                </span>
              </div>
            </div>
          </div>
          <div className="hero-visual" aria-hidden="true">
            <div className="logo-orbit">
              <div className="orbit orbit-one" />
              <div className="orbit orbit-two" />
              <img src={logo} alt="" />
            </div>
            <div className="mission-card mission-card-one">
              <ShieldCheck size={22} />
              <span>Responder cuando alguien necesita ayuda</span>
            </div>
            <div className="mission-card mission-card-two">
              <BookOpen size={22} />
              <span>Llevar literatura y esperanza</span>
            </div>
          </div>
        </section>

        <section className="statement" id="proposito">
          <div className="section-kicker">Nuestra esencia</div>
          <h2>
            No queremos hacer proyectos por hacerlos. Queremos entender la
            necesidad, crear una ruta y mover personas hacia una acción útil.
          </h2>
          <div className="triple-grid">
            <article>
              <span>01</span>
              <h3>Misión</h3>
              <p>
                Formar y conectar jóvenes que sirvan a otros mediante proyectos
                misioneros, colportaje, comunicación, ayuda solidaria y acciones
                concretas de impacto.
              </p>
            </article>
            <article>
              <span>02</span>
              <h3>Visión</h3>
              <p>
                Construir una red misionera replicable, capaz de preparar
                personas, producir proyectos y abrir oportunidades de servicio,
                estudio y misión en distintos países.
              </p>
            </article>
            <article>
              <span>03</span>
              <h3>Propósito</h3>
              <p>
                Escuchar la esencia de cada persona o necesidad, reunir los
                recursos adecuados y transformar una buena intención en una
                misión bien ejecutada.
              </p>
            </article>
          </div>
        </section>

        <section className="actions-section" id="que-hacemos">
          <div className="section-heading">
            <div>
              <div className="section-kicker">Qué hacemos</div>
              <h2>Cuatro formas de convertir intención en servicio.</h2>
            </div>
            <p>
              Seven Academy une misión, creatividad y organización para que cada
              persona encuentre una forma real de aportar.
            </p>
          </div>
          <div className="action-grid">
            {actionCards.map(({ icon: Icon, title, text }) => (
              <article className="action-card" key={title}>
                <div className="icon-box">
                  <Icon size={24} />
                </div>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="manifesto-band">
          <div className="manifesto-number">7</div>
          <div>
            <div className="section-kicker light">Más que una academia</div>
            <h2>Una comunidad que aprende, crea, sirve y vuelve a salir.</h2>
            <p>
              Creemos en una misión práctica: conocer personas, detectar
              necesidades, formar equipos, llevar un mensaje de esperanza y usar
              nuestras habilidades para resolver problemas reales.
            </p>
          </div>
        </section>

        <section className="method-section" id="metodo">
          <div className="section-heading">
            <div>
              <div className="section-kicker">Nuestro método</div>
              <h2>Escuchar → conectar → crear → actuar.</h2>
            </div>
            <p>
              Así evitamos improvisar y hacemos que cada misión tenga un
              propósito claro.
            </p>
          </div>
          <div className="steps-grid">
            {steps.map(([num, title, text]) => (
              <article key={num} className="step-card">
                <span>{num}</span>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="invite-section">
          <div className="invite-copy">
            <div className="section-kicker light">¿Dónde encajas tú?</div>
            <h2>
              No necesitas saber hacerlo todo. Necesitamos saber qué puedes
              aportar.
            </h2>
            <p>
              Puedes sumarte desde colportaje, comunicación, producción
              audiovisual, diseño, desarrollo web, logística, oración,
              enseñanza, ventas, fotografía, edición, idiomas, liderazgo, salud,
              organización o cualquier habilidad que pueda servir a una misión.
            </p>
            <ul>
              <li>
                <CheckCircle2 size={19} /> Puedes participar desde tu ciudad.
              </li>
              <li>
                <CheckCircle2 size={19} /> Puedes apoyar una misión puntual o un
                proceso continuo.
              </li>
              <li>
                <CheckCircle2 size={19} /> Tu experiencia puede convertirse en
                una herramienta de servicio.
              </li>
            </ul>
          </div>
          <div className="invite-panel">
            <MessageCircle size={28} />
            <h3>Cuéntanos quién eres.</h3>
            <p>
              Queremos conocerte antes de asignarte una tarea. La misión empieza
              escuchando.
            </p>
            <a href="#misioneros">
              Completar formulario <ArrowRight size={18} />
            </a>
          </div>
        </section>

        <section className="form-section" id="misioneros">
          <div className="form-intro">
            <div className="section-kicker">Formulario misionero</div>
            <h2>¿Qué sabes hacer y cómo puedes ayudar?</h2>
            <p>
              Completa tus datos. Guardaremos tu respuesta en nuestra base de
              datos y después podrás continuar la conversación directamente por
              WhatsApp.
            </p>
            <div className="privacy-note">
              <ShieldCheck size={20} />
              <span>
                Usa estos datos únicamente para coordinar oportunidades,
                proyectos y comunicaciones relacionadas con Seven Academy.
              </span>
            </div>
          </div>

          <form className="mission-form" onSubmit={submitForm}>
            <div className="field-row">
              <label>
                Nombre completo
                <input
                  required
                  name="full_name"
                  value={form.full_name}
                  onChange={update}
                  placeholder="Tu nombre"
                />
              </label>
              <label>
                Edad
                <input
                  name="age"
                  type="number"
                  min="14"
                  max="100"
                  value={form.age}
                  onChange={update}
                  placeholder="Ej. 22"
                />
              </label>
            </div>
            <div className="field-row">
              <label>
                Ciudad / País
                <input
                  required
                  name="country_city"
                  value={form.country_city}
                  onChange={update}
                  placeholder="Medellín, Colombia"
                />
              </label>
              <label>
                WhatsApp
                <input
                  required
                  name="whatsapp"
                  value={form.whatsapp}
                  onChange={update}
                  placeholder="+57 300 000 0000"
                />
              </label>
            </div>
            <label>
              Correo electrónico
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={update}
                placeholder="nombre@correo.com"
              />
            </label>
            <label>
              ¿Qué sabes hacer?
              <textarea
                required
                name="skills"
                value={form.skills}
                onChange={update}
                placeholder="Ej. edición de video, ventas, fotografía, diseño, primeros auxilios, enseñanza, idiomas..."
              />
            </label>
            <label>
              ¿En qué área te gustaría ayudar?
              <select
                required
                name="help_area"
                value={form.help_area}
                onChange={update}
              >
                <option value="">Selecciona una opción</option>
                <option>Misiones y ayuda solidaria</option>
                <option>Colportaje y literatura</option>
                <option>Creación de contenido</option>
                <option>Producción audiovisual</option>
                <option>Diseño / tecnología / web</option>
                <option>Logística y organización</option>
                <option>Formación / enseñanza</option>
                <option>Oración y acompañamiento</option>
                <option>Otra</option>
              </select>
            </label>
            <div className="field-row">
              <label>
                Disponibilidad
                <select
                  required
                  name="availability"
                  value={form.availability}
                  onChange={update}
                >
                  <option value="">Selecciona</option>
                  <option>Proyecto puntual</option>
                  <option>Fines de semana</option>
                  <option>Entre semana</option>
                  <option>Remoto / virtual</option>
                  <option>Viajes misioneros</option>
                  <option>Disponibilidad flexible</option>
                </select>
              </label>
              <label>
                Experiencia misionera
                <input
                  name="missionary_experience"
                  value={form.missionary_experience}
                  onChange={update}
                  placeholder="Cuéntanos brevemente"
                />
              </label>
            </div>
            <label>
              ¿Hay algo más que debamos saber?
              <textarea
                name="message"
                value={form.message}
                onChange={update}
                placeholder="Cuéntanos tu motivación, ideas o limitaciones."
              />
            </label>
            <label className="consent">
              <input
                type="checkbox"
                name="consent"
                checked={form.consent}
                onChange={update}
              />
              <span>
                Acepto que Seven Academy use estos datos para contactarme y
                coordinar actividades relacionadas con el proyecto.
              </span>
            </label>
            {status.message && (
              <div className={`form-status ${status.type}`}>
                {status.message}
              </div>
            )}
            <button className="submit-button" disabled={sending} type="submit">
              {sending ? "Enviando..." : "Guardar y continuar por WhatsApp"}{" "}
              <ArrowRight size={18} />
            </button>
          </form>
        </section>
      </main>

      <footer>
        <div className="footer-brand">
          <img src={logo} alt="Seven Academy" />
          <div>
            <strong>SEVEN ACADEMY</strong>
            <span>Misión que se convierte en acción.</span>
          </div>
        </div>
        <div className="footer-copy">
          © {year} Seven Academy. Creado para conectar personas, propósito y
          servicio.
        </div>
      </footer>
    </div>
  );
}

export default App;
