REVOKE ALL ON FUNCTION public.can_read_site_signups() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.can_read_site_signups() FROM anon;
GRANT EXECUTE ON FUNCTION public.can_read_site_signups() TO authenticated;
