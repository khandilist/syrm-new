'use client';

import { useEffect, useRef } from 'react';

export default function BrandStory() {
    const root = useRef<HTMLElement>(null);

    useEffect(() => {
        let raf = 0;

        const update = () => {
            cancelAnimationFrame(raf);

            raf = requestAnimationFrame(() => {
                const section = root.current;
                if (!section) return;

                const rect = section.getBoundingClientRect();
                const travel = Math.max(1, rect.height - window.innerHeight);
                const gather = Math.min(1, Math.max(0, -rect.top / travel));

                section.style.setProperty('--gather', gather.toFixed(4));
            });
        };

        update();
        window.addEventListener('scroll', update, { passive: true });
        window.addEventListener('resize', update);

        return () => {
            cancelAnimationFrame(raf);
            window.removeEventListener('scroll', update);
            window.removeEventListener('resize', update);
        };
    }, []);

    return (
        <section
            id="brand-story"
            ref={root}
            className="brand-story brand-scroll"
            aria-labelledby="brand-story-title"
        >
            <div className="brand-stage">
                <div className="brand-particles" aria-hidden="true">
                    <svg viewBox="0 0 100 100" preserveAspectRatio="none">
                        <path d="M12 33 L27 25 L43 36 L60 23 L77 35 L93 27" />
                        <path d="M18 69 L35 58 L50 67 L66 55 L84 63" />
                        <path d="M27 25 L35 58 M43 36 L50 67 M60 23 L66 55 M77 35 L84 63" />
                    </svg>

                    {Array.from({ length: 44 }, (_, i) => {
                        const left = 8 + ((i * 31) % 86);
                        const top = 8 + ((i * 47) % 80);

                        return (
                            <i
                                key={i}
                                style={{
                                    left: `${left}%`,
                                    top: `${top}%`,
                                    transform: `translate(
                                        calc(var(--gather) * ${50 - left}vw * .34),
                                        calc(var(--gather) * ${50 - top}vh * .34)
                                    )`,
                                }}
                            />
                        );
                    })}
                </div>

                <div className="shell brand-copy">
                    <div className="brand-copy-inner">
                        <header className="brand-intro">
                            <span className="coverage-label">Brand story</span>

                            <h2 id="brand-story-title" className="brand-story-heading">
                                The meaning behind SYRM
                            </h2>

                            <p className="brand-origin">
                                Our name is inspired by <i>Sireum</i>, the Sundanese word for ant.
                            </p>
                        </header>

                        <h3 className="brand-statement">
                            <span>Individual actions.</span>
                            <em>Collective intelligence.</em>
                        </h3>

                        <div className="brand-body">
                            <p>
                                One ant is small. Together, a colony can accomplish something remarkable.
                                We believe human experience holds the same collective potential:
                                individual actions, brought together, become something greater.
                            </p>

                            <p>
                                At SYRM, we collect those actions from the real world-turning everyday
                                demonstrations into a shared foundation for useful intelligence.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
