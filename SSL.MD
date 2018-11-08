# SSL
Without cutting any services, we should renew the cert via the DNS
````sudo certbot certonly --manual --preferred-challenges dns -d forum.ovale.io````