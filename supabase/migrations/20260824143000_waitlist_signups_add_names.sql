-- First and last name on public waitlist / notify forms.

alter table public.book_release_signups
  add column if not exists first_name text,
  add column if not exists last_name text;

alter table public.newsletter_signups
  add column if not exists first_name text,
  add column if not exists last_name text;

alter table public.advance_listen_signups
  add column if not exists first_name text,
  add column if not exists last_name text;
