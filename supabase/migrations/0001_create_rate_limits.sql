-- Migration: Create Rate Limits Table for Contact Form
-- Creates a table to persist IP-based rate limiting across serverless function invocations

CREATE TABLE IF NOT EXISTS public.rate_limits (
    ip text PRIMARY KEY,
    last_request_time timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.rate_limits ENABLE ROW LEVEL SECURITY;

-- Allow anonymous access to insert and update their own rate limit, and select
-- Note: In a stricter production environment, this table would be updated using a service_role key
-- from the API route to prevent anon users from mutating other IPs. 
-- However, since the API relies on ANON key currently, we allow public upsert.
CREATE POLICY "Allow public read of rate limits" ON public.rate_limits FOR SELECT USING (true);
CREATE POLICY "Allow public insert of rate limits" ON public.rate_limits FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update of rate limits" ON public.rate_limits FOR UPDATE USING (true);
