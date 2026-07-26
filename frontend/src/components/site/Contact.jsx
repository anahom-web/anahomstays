import { useState } from "react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { MessageCircle, Phone, Mail } from "lucide-react";
import { RevealLines, Magnetic } from "./Reveal";
import Frame from "./Frame";

// The film ends where it began — the opening frame returns, barely there.
const ECHO_ID = "20_oyfxs5";

/**
 * The final scene — one strong ending.
 * A single enormous invitation, three quiet channels, and a form that
 * reads like a note, not a corporate enquiry.
 *
 * Enquiries go to Netlify Forms: no server to run or pay for, and every
 * submission lands in the Netlify dashboard (and in your inbox once a
 * notification is set up). The matching hidden form in public/index.html
 * is what lets Netlify discover this one at deploy time.
 */
const FORM_NAME = "contact";

/** Netlify expects a URL-encoded body, including the form's name. */
const encode = (data) =>
  Object.keys(data)
    .map((k) => `${encodeURIComponent(k)}=${encodeURIComponent(data[k])}`)
    .join("&");

const WHATSAPP = "917972930334";
const PHONE = "+917972930334";
const EMAIL = "contact@anahomstays.com";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "", intent: "homeowner" });
  const [botField, setBotField] = useState("");
  const [loading, setLoading] = useState(false);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error("Please share your name, email and a short note.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: encode({ "form-name": FORM_NAME, "bot-field": botField, ...form }),
      });
      if (!res.ok) throw new Error(`Submission failed (${res.status})`);
      toast.success("Thank you — we'll be in touch soon.");
      setForm({ name: "", email: "", phone: "", message: "", intent: "homeowner" });
    } catch (err) {
      // An enquiry is too valuable to drop. If the submission endpoint is
      // unavailable, hand the message to the visitor's mail app with
      // everything already written, so it still reaches the founders.
      const subject = `Anahom enquiry — ${form.name}`;
      const body = [
        `Name: ${form.name}`,
        `Email: ${form.email}`,
        form.phone && `Phone: ${form.phone}`,
        `I am a: ${form.intent}`,
        "",
        form.message,
      ]
        .filter(Boolean)
        .join("\n");
      toast.error("We couldn't send that from here — opening your email instead.");
      window.location.href = `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    } finally {
      setLoading(false);
    }
  };

  const channels = [
    { icon: MessageCircle, label: "WhatsApp", href: `https://wa.me/${WHATSAPP}`, testId: "contact-whatsapp" },
    { icon: Phone, label: "Call", href: `tel:${PHONE}`, testId: "contact-call" },
    { icon: Mail, label: "Email", href: `mailto:${EMAIL}`, testId: "contact-email" },
  ];

  return (
    <section
      id="contact"
      data-testid="contact-section"
      className="relative overflow-hidden bg-anahom-charcoal pt-28 md:pt-40 lg:pt-48 pb-20 md:pb-28 px-6 md:px-12 lg:px-24 text-anahom-white"
    >
      {/* the opening frame, returning */}
      <div className="absolute inset-0 opacity-[0.09] pointer-events-none" aria-hidden="true">
        <Frame id={ECHO_ID} w={1600} alt="" className="h-full w-full" />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-anahom-charcoal/60 via-transparent to-anahom-charcoal pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-screen-2xl">
        {/* The invitation */}
        <div className="mb-20 md:mb-32">
          <span className="inline-block text-xs md:text-sm font-sans tracking-[0.28em] uppercase text-anahom-sand/70 mb-8">
            Partner With Us
          </span>
          <RevealLines
            as="h2"
            className="font-display font-light text-[clamp(2.6rem,7vw,6.5rem)] leading-[1.02] tracking-tight text-anahom-white"
            lines={["If you know a home", "that deserves better."]}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-20">
          {/* Channels */}
          <div className="lg:col-span-5">
            <div className="space-y-0">
              {channels.map((c) => (
                <a
                  key={c.label}
                  href={c.href}
                  target="_blank"
                  rel="noreferrer"
                  data-testid={c.testId}
                  className="group flex items-center gap-4 border-t border-anahom-white/12 py-6 hover:text-anahom-bronze transition-colors duration-500"
                >
                  <c.icon className="w-5 h-5" strokeWidth={1.4} />
                  <span className="font-display text-2xl md:text-3xl flex-1">{c.label}</span>
                  <span className="text-xl opacity-40 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-500">→</span>
                </a>
              ))}
            </div>
            <p className="mt-10 font-sans text-sm text-anahom-white/45 leading-relaxed max-w-xs">
              Every enquiry is read by the founders — and answered personally.
            </p>
          </div>

          {/* The note */}
          <div className="lg:col-span-7">
            <form
              name={FORM_NAME}
              method="POST"
              data-netlify="true"
              netlify-honeypot="bot-field"
              onSubmit={onSubmit}
              data-testid="contact-form"
              className="space-y-10"
            >
              {/* Netlify needs the form's name travelling with the payload */}
              <input type="hidden" name="form-name" value={FORM_NAME} />
              {/* Honeypot: invisible to people, irresistible to bots */}
              <p className="hidden" aria-hidden="true">
                <label>
                  Do not fill this in
                  <input
                    name="bot-field"
                    tabIndex={-1}
                    autoComplete="off"
                    value={botField}
                    onChange={(e) => setBotField(e.target.value)}
                  />
                </label>
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <Field name="name" label="Your name" value={form.name} onChange={onChange} testId="contact-name" />
                <Field name="email" label="Email" type="email" value={form.email} onChange={onChange} testId="contact-email-input" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <Field name="phone" label="Phone (optional)" value={form.phone} onChange={onChange} testId="contact-phone" />
                <div className="relative">
                  <label htmlFor="contact-intent" className="block text-[11px] font-sans tracking-[0.22em] uppercase text-anahom-white/45 mb-3">
                    I am a
                  </label>
                  <select
                    id="contact-intent"
                    name="intent"
                    value={form.intent}
                    onChange={onChange}
                    data-testid="contact-intent"
                    className="w-full bg-transparent border-b border-anahom-white/20 py-3 font-sans text-xl text-anahom-white focus:outline-none focus:border-anahom-bronze transition-colors duration-500"
                  >
                    <option className="text-anahom-charcoal" value="homeowner">Homeowner</option>
                    <option className="text-anahom-charcoal" value="broker">Property Broker / Agent</option>
                    <option className="text-anahom-charcoal" value="referral">I know someone with a property</option>
                    <option className="text-anahom-charcoal" value="guest">Guest</option>
                    <option className="text-anahom-charcoal" value="general">Just curious</option>
                  </select>
                </div>
              </div>
              <div>
                <label htmlFor="contact-message" className="block text-[11px] font-sans tracking-[0.22em] uppercase text-anahom-white/45 mb-3">
                  A short note
                </label>
                <textarea
                  id="contact-message"
                  name="message"
                  value={form.message}
                  onChange={onChange}
                  rows={4}
                  data-testid="contact-message"
                  placeholder="Tell us a little about your home..."
                  className="w-full bg-transparent border-b border-anahom-white/20 py-3 font-sans text-xl text-anahom-white placeholder:text-anahom-white/25 focus:outline-none focus:border-anahom-bronze transition-colors duration-500 resize-none"
                />
              </div>
              <Magnetic strength={0.25}>
                <motion.button
                  type="submit"
                  disabled={loading}
                  data-testid="contact-submit"
                  whileTap={{ scale: 0.97 }}
                  className="inline-flex items-center gap-3 bg-anahom-white text-anahom-charcoal font-sans text-sm tracking-wide px-8 py-4 rounded-full hover:bg-anahom-bronze hover:text-anahom-white transition-colors duration-500 disabled:opacity-50"
                >
                  {loading ? "Sending..." : "Send with care"}
                  <span>→</span>
                </motion.button>
              </Magnetic>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

function Field({ name, label, value, onChange, type = "text", testId }) {
  const id = `contact-field-${name}`;
  return (
    <div>
      <label htmlFor={id} className="block text-[11px] font-sans tracking-[0.22em] uppercase text-anahom-white/45 mb-3">
        {label}
      </label>
      <input
        id={id}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        data-testid={testId}
        className="w-full bg-transparent border-b border-anahom-white/20 py-3 font-sans text-xl text-anahom-white focus:outline-none focus:border-anahom-bronze transition-colors duration-500"
      />
    </div>
  );
}
