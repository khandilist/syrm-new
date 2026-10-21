'use client';

import { type FormEvent, useEffect, useRef, useState } from 'react';
import { CheckCircle2, ChevronDown, LoaderCircle, Search } from 'lucide-react';
import { staticPath } from '@/lib/static-path';

const COUNTRY_OPTIONS = [
  'Argentina', 'Australia', 'Austria', 'Bangladesh', 'Belgium', 'Brazil',
  'Canada', 'Chile', 'China', 'Colombia', 'Czech Republic', 'Denmark',
  'Egypt', 'Finland', 'France', 'Germany', 'Greece', 'Hong Kong',
  'India', 'Indonesia', 'Ireland', 'Israel', 'Italy', 'Japan', 'Kenya',
  'Malaysia', 'Mexico', 'Netherlands', 'New Zealand', 'Nigeria', 'Norway',
  'Pakistan', 'Philippines', 'Poland', 'Portugal', 'Singapore', 'South Africa',
  'South Korea', 'Spain', 'Sweden', 'Switzerland', 'Taiwan', 'Thailand',
  'Turkey', 'United Arab Emirates', 'United Kingdom', 'United States',
  'Vietnam',
];

const EMPTY_FORM = {
  name: '',
  company: '',
  country: '',
  email: '',
  requirements: '',
};

export default function ContactStory() {
  const root = useRef<HTMLElement>(null);
  const countryDropdownRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [isCountryOpen, setIsCountryOpen] = useState(false);
  const [countryQuery, setCountryQuery] = useState('');

  useEffect(() => {
    const update = () => {
      if (!root.current) return;
      const rect = root.current.getBoundingClientRect();
      root.current.style.setProperty('--arrival', String(Math.max(0, Math.min(1, 1 - rect.top / (innerHeight * .4)))));
      const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
      const progress = reduced ? 1 : Math.max(0, Math.min(1, -rect.top / (rect.height - innerHeight)));
      root.current.style.setProperty('--reveal', String(progress));
      setReady(progress > .7);
    };

    update();
    addEventListener('scroll', update, { passive: true });
    addEventListener('resize', update);
    return () => {
      removeEventListener('scroll', update);
      removeEventListener('resize', update);
    };
  }, []);

  useEffect(() => {
    if (!isCountryOpen) return;

    const handleOutsideClick = (event: MouseEvent) => {
      if (countryDropdownRef.current && !countryDropdownRef.current.contains(event.target as Node)) {
        setIsCountryOpen(false);
        setCountryQuery('');
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsCountryOpen(false);
        setCountryQuery('');
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isCountryOpen]);

  const filteredCountries = COUNTRY_OPTIONS.filter((country) =>
    country.toLowerCase().includes(countryQuery.trim().toLowerCase()),
  );

  const updateField = (field: keyof typeof formData, value: string) => {
    setFormData((current) => ({ ...current, [field]: value }));
  };

  const validate = () => {
    const requiredFields = [formData.name, formData.company, formData.country, formData.email];
    const isValid = requiredFields.every((field) => field.trim().length > 0);
    if (!isValid) {
      setSubmitError('Please complete all required fields, including your country.');
    }
    return isValid;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setSuccessMessage('');
    setSubmitError('');

    try {
      const response = await fetch('https://www.ubiklan.com/api/contact/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer badasdaokokioa2323sdfasd==92uhu2h3===232',
        },
        body: JSON.stringify(formData),
      });

      let data: { error?: string } = {};
      try {
        data = await response.json();
      } catch {
        // The endpoint may return an empty body for non-JSON failures.
      }

      if (!response.ok) {
        throw new Error(data.error || 'The request could not be submitted. Please try again.');
      }

      setSuccessMessage('Your collection request was sent. We will follow up using the email address provided.');
      setFormData(EMPTY_FORM);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'The request could not be submitted. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="contact-story" ref={root}>
      <div className="contact-stage">
        <div className="connection-field" aria-hidden="true" />
        <h2 className="connection-title">Your next breakthrough.<br /><em>Starts in the real world.</em></h2>
        <img
          className="contact-hands"
          src={staticPath('/brand/connection-hands.png')}
          alt="Wireframe human and robot hands reaching toward each other"
        />
        <div className={`contact-reveal ${ready ? 'ready' : ''}`} inert={!ready}>
          <span className="section-index">START A COLLECTION</span>
          <h2>What does your robot<br />need to learn?</h2>

          {successMessage ? (
            <div className="request-form-success">
              <CheckCircle2 size={34} />
              <strong>Request sent</strong>
              <p>{successMessage}</p>
              <button
                type="button"
                onClick={() => {
                  setSuccessMessage('');
                  setSubmitError('');
                  setFormData(EMPTY_FORM);
                }}
              >
                Submit another brief
              </button>
            </div>
          ) : (
            <form className="request-form" onSubmit={handleSubmit}>
              <label className="contact-field-wide">
                Full Name
                <input
                  autoComplete="name"
                  name="name"
                  placeholder="Dr. Alex Rivera"
                  required
                  value={formData.name}
                  onChange={(event) => updateField('name', event.target.value)}
                />
              </label>
              <label>
                Company
                <input
                  autoComplete="organization"
                  name="company"
                  placeholder="Acme Robotics"
                  required
                  value={formData.company}
                  onChange={(event) => updateField('company', event.target.value)}
                />
              </label>
              <label>
                Work Email
                <input
                  autoComplete="email"
                  name="email"
                  type="email"
                  placeholder="alex@ai-lab.io"
                  required
                  value={formData.email}
                  onChange={(event) => updateField('email', event.target.value)}
                />
              </label>
              <label className="contact-field-wide">
                Country
                <div ref={countryDropdownRef} className="contact-country-picker">
                  <button
                    type="button"
                    role="combobox"
                    aria-expanded={isCountryOpen}
                    aria-controls="contact-country-options"
                    aria-label="Select a country"
                    className={isCountryOpen ? 'open' : ''}
                    onClick={() => {
                      setIsCountryOpen((open) => !open);
                      setCountryQuery('');
                    }}
                  >
                    <span className={formData.country ? 'selected' : ''}>
                      {formData.country || 'Select a country'}
                    </span>
                    <ChevronDown size={16} />
                  </button>

                  {isCountryOpen && (
                    <div id="contact-country-options" className="contact-country-menu" role="listbox">
                      <div className="contact-country-search">
                        <Search size={14} />
                        <input
                          autoFocus
                          type="search"
                          value={countryQuery}
                          onChange={(event) => setCountryQuery(event.target.value)}
                          placeholder="Search countries..."
                          aria-label="Search countries"
                        />
                      </div>
                      <div className="contact-country-options">
                        {filteredCountries.length > 0 ? (
                          filteredCountries.map((country) => (
                            <button
                              type="button"
                              role="option"
                              aria-selected={formData.country === country}
                              key={country}
                              onClick={() => {
                                updateField('country', country);
                                setIsCountryOpen(false);
                                setCountryQuery('');
                              }}
                            >
                              {country}
                            </button>
                          ))
                        ) : (
                          <p>No countries found.</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </label>
              <label className="contact-field-wide">
                Tasks, environments, and data requirements
                <textarea
                  name="requirements"
                  rows={3}
                  required
                  placeholder="Describe the tasks, environments, capture setup, session rules, and delivery requirements..."
                  value={formData.requirements}
                  onChange={(event) => updateField('requirements', event.target.value)}
                />
              </label>
              {submitError && (
                <small role="alert" className="request-form-error">{submitError}</small>
              )}
              <button className="button" type="submit" disabled={loading}>
                {loading ? (
                  <span className="contact-submit-state">
                    <LoaderCircle size={16} />
                    Sending request...
                  </span>
                ) : (
                  'Request data ↗'
                )}
              </button>
            </form>
          )}
        </div>
        <span className="contact-scroll-hint">{ready ? '' : 'SCROLL INTO THE CONNECTION ↓'}</span>
      </div>
      <span id="request" className="contact-anchor" />
    </section>
  );
}
