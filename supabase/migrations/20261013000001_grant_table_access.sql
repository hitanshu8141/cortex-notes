-- Let logged-in users reach the tables through the Supabase API.
-- Row-level security policies still limit them to their own rows.
-- Logged-out (anon) visitors get no access.

grant select, update on public.profiles to authenticated;
grant select, insert, update, delete on public.notes to authenticated;
