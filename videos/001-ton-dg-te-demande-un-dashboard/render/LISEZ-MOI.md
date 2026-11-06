# Rendu de la vidéo 001

Code de l'aperçu v1 (animation + effets sonores, sans voix). Le noyau de style est dans `kit/moustakim_kit.js` (à copier dans `src/kit/`), les polices dans `assets/fonts/` (non versionnées ici).

Commande (depuis un dossier projet qui contient `src/`, `assets/fonts/` et `package.json`) :
`MVD_TOOLKIT=/opt/npm-tools node src/render.js --from 0 --to 26 --fps 30 --out out --name part1`, puis la seconde moitié, concaténation avec ffmpeg et ajout de l'audio `sfx.wav` (généré par `sfx.py` à partir de la bibliothèque d'effets de Mo).

Durée : environ 4 minutes pour 52 s à 1080×1920 sur 2 cœurs, en deux moitiés en parallèle. Le MP4 final reste hors du dépôt.
