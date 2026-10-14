import { motion, useReducedMotion } from "motion/react";
import { ArrowLink } from "@/components/site-sections";

/**
 * The most dramatic CTA on the site. Black fades into a subtle teal atmosphere.
 */
export function FinalCta() {
  const reduced = useReducedMotion();
  return (
    <section className="grain relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[420px] bg-[radial-gradient(60%_100%_at_50%_100%,rgba(25,167,160,0.18),transparent)]"
      />
      <div
        aria-hidden
        className="grid-bg pointer-events-none absolute inset-0 opacity-40 [mask-image:radial-gradient(60%_60%_at_50%_80%,black,transparent)]"
      />

      <div className="container-x relative flex flex-col items-center py-28 text-center md:py-44">
        <motion.span
          className="label-tech"
          initial={reduced ? false : { opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          HAVE SOMETHING IN MIND?
        </motion.span>

        <h2 className="display mt-6 text-[15vw] leading-[0.85] md:text-[9vw]">
          <span className="block overflow-hidden">
            <motion.span
              className="block"
              initial={reduced ? false : { y: "110%" }}
              whileInView={{ y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            >
              HAVE AN IDEA?
            </motion.span>
          </span>
          <span className="block overflow-hidden">
            <motion.span
              className="block text-accent"
              initial={reduced ? false : { y: "110%" }}
              whileInView={{ y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 1, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            >
              LET'S BUILD IT.
            </motion.span>
          </span>
        </h2>

        <motion.div
          className="mt-12"
          initial={reduced ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          <ArrowLink to="/contact" tone="accent">
            Start a project
          </ArrowLink>
        </motion.div>
      </div>
    </section>
  );
}
