# Site Parcours IA Filière Bois — Kosmio × Xylofutur
# Serveur Node sans dépendance : sert les fichiers statiques et expose
# POST /api/lead, qui parle à Brevo côté serveur.
#
# La clé Brevo n'est JAMAIS écrite dans un fichier servi au navigateur.
# Elle est lue dans l'environnement du conteneur au démarrage.
#
# Variables à définir dans Coolify :
#   BREVO_API_KEY   (secret, obligatoire)
#   BREVO_LIST_ID   (optionnel, 17 par défaut)
#   SITE_URL        (optionnel, https://ia-automatisation.kosm.io par défaut)
#   NOTIFY_EMAIL    (optionnel, mathieu@kosm.io par défaut)

FROM node:22-alpine

WORKDIR /app

# config.js n'a plus de raison d'être : la clé ne passe plus par le navigateur.
COPY . /app
RUN rm -f /app/config.js

ENV NODE_ENV=production
ENV PORT=80
EXPOSE 80

# Le conteneur écoute sur le port 80, comme l'image nginx précédente, pour
# qu'aucun réglage de port ne change côté Coolify. Pour passer en utilisateur
# non privilégié, mettre PORT=3000, EXPOSE 3000, ajouter USER node, et
# corriger le port applicatif dans Coolify. Le serveur n'écrit aucun fichier.

HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:'+(process.env.PORT||80)+'/api/health').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

CMD ["node", "server.js"]
