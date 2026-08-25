-- Store member first and last names on profiles (email signup + Google OAuth).

alter table public.profiles
  add column if not exists first_name text,
  add column if not exists last_name text;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  meta jsonb := coalesce(new.raw_user_meta_data, '{}'::jsonb);
  v_first text;
  v_last text;
  v_full text;
  v_space int;
begin
  v_first := nullif(trim(coalesce(meta->>'first_name', meta->>'given_name')), '');
  v_last := nullif(trim(coalesce(meta->>'last_name', meta->>'family_name')), '');

  if v_first is null and v_last is null then
    v_full := nullif(trim(coalesce(meta->>'full_name', meta->>'name')), '');
    if v_full is not null then
      v_first := split_part(v_full, ' ', 1);
      v_space := strpos(v_full, ' ');
      if v_space > 0 then
        v_last := nullif(trim(substring(v_full from v_space + 1)), '');
      end if;
    end if;
  end if;

  insert into public.profiles (id, email, first_name, last_name)
  values (new.id, new.email, v_first, v_last);
  return new;
end;
$$;
