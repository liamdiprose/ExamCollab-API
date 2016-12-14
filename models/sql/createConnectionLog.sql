
-- Log connection from IP address and current time

INSERT INTO public.ip_connections (ip_addr) VALUES (${ip});

DELETE FROM public.ip_connections
WHERE connection_time < now() - interval '3 seconds';

SELECT COUNT(*) AS NumberOfConnections FROM public.ip_connections
WHERE ip_addr=${ip};

