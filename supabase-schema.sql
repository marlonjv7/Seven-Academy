create table if not exists public.missionary_applications (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  full_name text not null,
  age integer,
  country_city text not null,
  whatsapp text not null,
  email text,
  skills text not null,
  help_area text not null,
  availability text not null,
  missionary_experience text,
  message text
);

alter table public.missionary_applications enable row level security;

-- Permite que el formulario público inserte nuevas respuestas.
-- No permite leer, editar ni borrar registros desde la landing.
create policy "public_can_submit_missionary_application"
on public.missionary_applications
for insert
to anon
with check (true);
