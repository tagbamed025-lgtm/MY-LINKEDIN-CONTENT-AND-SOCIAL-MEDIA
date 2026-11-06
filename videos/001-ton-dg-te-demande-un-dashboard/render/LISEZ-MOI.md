# Rendu de la vidéo 001 (v5)

Code de la v5 : animation, voix, musique et effets sonores. Le noyau de style est dans `kit/moustakim_kit.js` (à copier dans `src/kit/`), les polices dans `assets/fonts/` (non versionnées ici : Inter Tight, Instrument Serif italique, Geist Mono via @fontsource). Les images utilisées par la scène sont dans `assets/img/` (le logo Power BI est le fichier fourni par Mo ; les avatars sont dans `personnages/` à la racine du dépôt).

Durée : 43 s, 1080×1920, 30 fps. Calage sur la voix de Mo : décalage de 5,0 s (les 5 premières secondes, la conversation, n'ont pas de voix).

## Rendu image

Depuis un dossier projet qui contient `src/`, `assets/` et `package.json` :
`MVD_TOOLKIT=/opt/npm-tools node src/render.js --from 0 --to 21.5 --fps 30 --scale 1 --out out --name p1`, puis `--from 21.5 --to 43 --name p2` en parallèle, concaténation `ffmpeg -f concat -c copy`. Environ 4 minutes sur 2 cœurs.

## Audio (hors dépôt : la voix et le MP4 ne sont pas versionnés)

- Voix : chaîne `voice_chain.sh` de la bible (nettoyage, −16 LUFS), placée à +5,0 s.
- Musique : `audio/music.py` (original, 88 BPM, niveaux par section, kick à partir de la user story).
- Effets : `audio/sfx.py` (bibliothèque d'effets de Mo, temps calés sur les scènes).
- Mixage : `sidechaincompress` de la musique par la voix (seuil 0,05, ratio 8, 20 ms / 400 ms), musique −10 dB, effets −6 dB, puis `loudnorm` −15 LUFS. Mesure du mixage v4 : −15,4 LUFS, crête −4,4 dBFS.
