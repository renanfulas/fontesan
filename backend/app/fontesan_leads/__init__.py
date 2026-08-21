"""Public lead capture for the Fontesan static site's contact form.

Not part of ``app/domain_engine`` on purpose: this has no persona, prompt or
knowledge base. It is a plain contact-form submission from a separate static
site, persisted through the same operational Postgres this backend already
runs, mirroring how ``app/feedback`` sits beside the FAQ domains.
"""
