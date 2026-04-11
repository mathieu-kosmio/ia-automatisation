FROM nginx:alpine

# Copier le site
COPY . /usr/share/nginx/html/

# Au démarrage, générer config.js depuis la variable d'env BREVO_API_KEY
# puis lancer nginx
CMD ["/bin/sh", "-c", "\
  echo \"window.__SITE_CONFIG = { BREVO_KEY: '${BREVO_API_KEY}', BREVO_LIST: 17 };\" \
  > /usr/share/nginx/html/config.js && \
  nginx -g 'daemon off;'"]
