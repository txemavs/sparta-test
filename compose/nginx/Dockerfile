FROM nginx

#Self signed Certifites
COPY certs.sh ./
RUN chmod +x certs.sh
RUN mkdir -p /etc/nginx/certs
COPY certs /etc/nginx/certs

RUN rm /etc/nginx/conf.d/default.conf
COPY default.conf /etc/nginx/conf.d
COPY secure.conf /etc/nginx/conf.d

