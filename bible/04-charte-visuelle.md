# Charte visuelle Moustakim (LinkedIn) — Validé

Résumé texte de l'artifact « Charte Motion Moustakim LinkedIn ». L'artifact fait foi.

## Fonds

| Fond | Code | Usage |
|---|---|---|
| Gris perle | #F2F2F2 | Fond principal (environ 70 % des scènes), bords en pointillé |
| Blanc pur | #FFFFFF | Chiffres, preuves |
| Blanc lumière | blanc + halo bleu rgba(34,96,245,.16) depuis le bas | Moments d'émotion |
| Bleu | #2260F5 | Accroche et appel à l'action, une scène sur huit au plus |
| Sable | #E9E2D4 | Citations, moments calmes |

Pas de noir, pas de lavande.

## Textes

| Rôle | Code |
|---|---|
| Encre café | #2B2622 |
| Taupe | #6F6962 |
| Gris d'entrée (mot qui arrive) | #A8A8AA |
| Corail (pertes seulement) | #D9482B |
| Ardoise (cartes de dashboard seulement) | #14161C |

## Polices

Inter Tight (400/500/700/800, interlettrage −3 %). Instrument Serif italique pour un seul mot d'émotion. Geist Mono pour sources et étiquettes.

## Règles de motion

- Un seul texte au centre, 8 mots maximum par scène.
- Apparition mot par mot : 0,25 à 0,35 s par mot, du gris d'entrée à l'encre.
- Courbe easeOutQuint. Entrée d'une carte : 0,85 s, zoom 0,62 → 1, flou 20 → 0. Sorties : 0,4 à 0,6 s.
- Aucune image fixe au-delà de 1,2 s. Poussée de caméra lente (1 % par seconde).
- Bandeau permanent (Validé, 6 novembre soir, remplace « pas de badge permanent ») : mini-avatar de Mo + « Moustakim », petit, en haut à gauche (x 70 px, y 300 px à 1080×1920), pour la reconnaissance. Il est masqué sur la dernière scène, où le profil complet de Mo apparaît. Il ne gêne pas le contenu, qui reste au milieu de l'écran. Pas de courbe de progression.
- Centrage vertical (Validé, 6 novembre) : dans chaque scène, le groupe objet + légende est centré à 50 % de la hauteur, avec la même distance en haut et en bas. La légende est rapprochée de l'objet (écart réduit). Les cartes et la user story sont aussi centrées. Cette règle prime sur les positions en % des gabarits ci-dessous.
- Dernière scène : question finale + profil (avatar, nom complet, titre « Data · Suivi-évaluation · Communication »). Pas de « l'accro à l'IA » dans cette scène pour les vidéos data ; l'accroche IA est réservée aux vidéos sur l'IA.
- Zone de sécurité : rien dans les 15 % du haut ni les 12 % du bas.
- Planche de vignettes validée avant tout rendu. Fichiers nommés avec une version (v1, v2…).

## Signature

Aucune courbe ni ligne de progression en bas de l'écran (décision de Mo, 6 novembre 2026). Le visuel reste propre : un fond, un objet ou une phrase, rien d'autre.

## Gabarits (mesurés sur les 7 vidéos de référence)

| Gabarit | Position |
|---|---|
| 1. Phrase seule | zone à 32 % du haut, 26 % de haut, centre à 45 %, 100–120 px |
| 2. Objet + légende | objet 34 % du haut, 24 % de haut, ~48 % de large ; légende centrée à 61 %, 64–76 px, 2 à 5 mots |
| 3. Carte / graphique / dashboard | 84 % de large, de 19 % à 54 % ; légende à 61 % |
| 4. Message | bulles flottantes sans téléphone ni écran de messagerie (référence : vidéo Instagram/WhatsApp, 7 novembre) ; bulles grises, ~55 % de large, centrées vers 50 % de hauteur ; avatar rond en bas à gauche de la dernière bulle ; points de saisie avant chaque message ; les anciennes bulles s'estompent ; carte de sondage possible dessous |
| 5. Chiffre héros | 35 % du haut, 17 % de haut, 150–175 px ; légende à 61 % |

Une phrase : 2 lignes maximum, toujours centrée. Une scène = une phrase au milieu (rarement deux).

Une scène = un objet (ou un logo) + une seule ligne de légende dessous, à 61 %. Privilégier un objet par scène (dashboard 3D, téléphone, tuile, cartes) plutôt que du texte seul : Mo trouvait la v1 trop « que du texte ». Taille des légendes : ≈42 px mesuré sur les références ; la v5 utilise 62–100 px (aucun retour négatif de Mo à ce jour).

## Personnages

Style 3D réaliste-stylisé, figurines douces, lumière de studio, finition mate, générés par Mo dans ChatGPT à partir de son avatar comme référence de style. Chaque personnage est généré en une seule image à deux vignettes : tête seule (à gauche) et buste (à droite), même visage, fond blanc uni. Claude détoure et range les fichiers dans `personnages/` (`<nom>-tete.png`, `<nom>-buste.png`).

Distribution actuelle : Mo (avatar de marque), le DG, la cheffe de projet, l'agent de terrain, la bailleuse de fonds, la stagiaire, plus trois personnages occasionnels d'autres origines (expert d'Asie de l'Est, consultante européenne, expert d'Asie du Sud). Tous fictifs. Aucun symbole culturel ou religieux ajouté, aucun logo.

## Son

Voix de Mo (enregistrée ou clonée par lui). Chaîne de voix −16 LUFS, effets sonores de sa bibliothèque, mixage final −15 LUFS. Musique : une signature originale unique pour toutes les vidéos (Validé, 6 novembre soir), 88 BPM, générée par `videos/001-…/render/audio/music.py` ; elle baisse sous la voix (sidechain).
