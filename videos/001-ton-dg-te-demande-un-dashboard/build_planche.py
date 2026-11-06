src=open('/home/claude/charte-moustakim.html').read().split('\n')
css='\n'.join(src[57:90])
css=css.replace('.frame .cv{','.frame .cvX{')
F='/home/claude/fonts/node_modules/@fontsource/'
ff=''.join(f"@font-face{{font-family:'{n}';font-weight:{w};{st}src:url('file://{F}{p}')}}\n" for n,w,st,p in [
('Inter Tight',400,'','inter-tight/files/inter-tight-latin-400-normal.woff2'),('Inter Tight',500,'','inter-tight/files/inter-tight-latin-500-normal.woff2'),
('Inter Tight',700,'','inter-tight/files/inter-tight-latin-700-normal.woff2'),('Inter Tight',800,'','inter-tight/files/inter-tight-latin-800-normal.woff2'),
('Instrument Serif',400,'font-style:italic;','instrument-serif/files/instrument-serif-latin-400-italic.woff2'),('Geist Mono',400,'','geist-mono/files/geist-mono-latin-400-normal.woff2')])
extra="""
:root{--sans:'Inter Tight',sans-serif;--serif:'Instrument Serif',serif;--mono:'Geist Mono',monospace}
body{margin:0;background:#F8F8F7;color:#2B2622;font-family:var(--sans);padding:28px}
h1{font-size:26px;letter-spacing:-.03em;margin:0 0 4px}
.sub{font-family:var(--mono);font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:#6F6962;margin-bottom:22px}
.grid{display:grid;grid-template-columns:repeat(4,250px);gap:26px 22px}
.fw{width:250px}.cap{font-size:12.5px;color:#6F6962;margin:9px 2px 0;line-height:1.35}.cap b{color:#2B2622}
.frame{width:250px;perspective:900px}
.frame .tx b{font-weight:800}
.leg{position:absolute;left:8%;right:8%;transform:translateY(-50%);text-align:center;font-size:8.4cqw;font-weight:500;letter-spacing:-.035em;line-height:1.05}
.leg b{font-weight:800}.leg .sr{font-family:var(--serif);font-style:italic;font-weight:400;font-size:1.25em}
.phone{position:absolute;left:11%;right:11%;top:15%;height:60%;background:#fff;border-radius:7cqw;border:1cqw solid #fff;box-shadow:0 7cqw 11cqw -4cqw rgba(43,38,34,.38),0 0 0 .35cqw #D6D3CE;transform:rotateY(-10deg) rotateX(3deg);overflow:hidden;display:flex;flex-direction:column}
.ph-h{display:flex;align-items:center;gap:2.4cqw;padding:3cqw 3.6cqw;background:#fff;border-bottom:.3cqw solid #ECE9E3}
.ph-h i{width:7.5cqw;height:7.5cqw;border-radius:50%;background:#2B2622;color:#fff;font-style:normal;font-weight:800;font-size:2.8cqw;display:flex;align-items:center;justify-content:center}
.ph-h b{font-size:3.8cqw;letter-spacing:-.02em}.ph-h span{display:block;font-size:2.4cqw;color:#6F6962;font-weight:400}
.ph-b{flex:1;background:#F1ECE0;padding:4cqw 3.4cqw;display:flex;flex-direction:column;gap:2.6cqw}
.m{max-width:74%;padding:2.2cqw 3cqw;border-radius:3.2cqw;font-size:4.1cqw;line-height:1.2;letter-spacing:-.015em;font-weight:500;box-shadow:0 .3cqw .6cqw rgba(43,38,34,.08)}
.m.in{background:#fff;align-self:flex-start;border-top-left-radius:.8cqw}
.m.out{background:#D9E5FD;align-self:flex-end;border-top-right-radius:.8cqw}
.m small{display:block;font-family:var(--mono);font-size:2cqw;color:#8A847C;text-align:right;margin-top:.8cqw;font-weight:400}
.d3{position:absolute;left:12%;right:12%;top:26%;height:30%;background:#14161C;border-radius:4.5cqw;padding:3.6cqw;color:#fff;transform:rotateX(16deg) rotateY(-16deg) rotateZ(1deg);box-shadow:-3cqw 9cqw 12cqw -3cqw rgba(20,22,28,.5),0 1cqw 2cqw rgba(20,22,28,.3)}
.d3 small{font-size:2.6cqw;color:rgba(255,255,255,.65);font-weight:500}
.d3 .k{display:flex;gap:3cqw;margin:1.6cqw 0 2.4cqw}.d3 .k b{white-space:nowrap;font-size:6.6cqw;font-weight:800;letter-spacing:-.04em;line-height:1}
.d3 .k div{flex:1}
.d3 svg{width:100%;height:42%}
.tile{position:absolute;left:50%;top:26%;width:34cqw;height:34cqw;margin-left:-17cqw;background:#fff;border-radius:8cqw;box-shadow:0 8cqw 12cqw -4cqw rgba(43,38,34,.3),0 1cqw 2cqw rgba(43,38,34,.1);display:flex;align-items:center;justify-content:center;transform:rotateX(10deg) rotateY(-12deg)}
.tile.on-blue{box-shadow:0 8cqw 12cqw -4cqw rgba(8,30,100,.55)}
.tile .q{font-family:var(--serif);font-style:italic;font-size:26cqw;color:#2260F5;line-height:1;margin-top:2cqw}
.chip{position:absolute;left:50%;transform:translateX(-50%);padding:3cqw 7cqw;border-radius:99cqw;font-size:7cqw;font-weight:700;letter-spacing:-.03em;white-space:nowrap}
.chip.no{background:#fff;color:#8A847C;text-decoration:line-through;box-shadow:0 2cqw 4cqw -1cqw rgba(43,38,34,.2)}
.chip.yes{background:#2260F5;color:#fff;box-shadow:0 5cqw 8cqw -2cqw rgba(34,96,245,.5);font-size:9cqw;padding:3.6cqw 8cqw}
.us{position:absolute;left:8%;right:8%;top:17%;background:#fff;border-radius:5cqw;padding:4.4cqw;box-shadow:0 5cqw 9cqw -3cqw rgba(43,38,34,.22),0 .8cqw 1.6cqw rgba(43,38,34,.08);display:flex;flex-direction:column;gap:3.6cqw}
.us small{font-family:var(--mono);font-size:2.6cqw;letter-spacing:.08em;text-transform:uppercase;color:#6F6962}
.us .r{display:flex;gap:3.2cqw;align-items:center}
.us .r i{flex:0 0 11cqw;width:11cqw;height:11cqw;border-radius:50%;background:#EAF0FE;display:flex;align-items:center;justify-content:center}
.us .r i svg{width:6cqw;height:6cqw}
.us .r p{margin:0;font-size:5.3cqw;line-height:1.15;letter-spacing:-.025em;font-weight:500}
.us .r p b{color:#2260F5;font-weight:800}
.kp{position:absolute;left:12%;right:12%;background:#fff;border-radius:4.4cqw;padding:3.2cqw 4.4cqw;display:flex;align-items:center;gap:3.2cqw;box-shadow:0 5cqw 8cqw -3cqw rgba(43,38,34,.22),0 .8cqw 1.4cqw rgba(43,38,34,.08);font-size:5.2cqw;font-weight:600;letter-spacing:-.025em}
.kp i{width:8cqw;height:8cqw;border-radius:2.4cqw;background:#EAF0FE;display:flex;align-items:center;justify-content:center;flex:0 0 8cqw}
.kp i svg{width:4.6cqw;height:4.6cqw}
.face{position:absolute;left:0;right:0;top:20%;display:flex;flex-direction:column;align-items:center;gap:3cqw}
.face i{width:34cqw;height:34cqw;border-radius:50%;background:#E9E2D4;border:1cqw solid #fff;display:flex;align-items:center;justify-content:center;font:400 4cqw var(--mono);color:#6F6962;text-align:center;box-shadow:0 5cqw 9cqw -3cqw rgba(43,38,34,.3)}
.face b{font-size:6cqw;letter-spacing:-.03em}
.face span{font-family:var(--mono);font-size:2.8cqw;letter-spacing:.08em;text-transform:uppercase;color:#6F6962}
"""
B='#2260F5'
ic=lambda p:f'<svg viewBox="0 0 24 24" fill="none" stroke="{B}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">{p}</svg>'
I_user=ic('<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7"/>')
I_pin=ic('<path d="M12 22s7-6.2 7-12a7 7 0 1 0-14 0c0 5.8 7 12 7 12z"/><circle cx="12" cy="10" r="2.5"/>')
I_team=ic('<circle cx="9" cy="8" r="3.2"/><path d="M3 20c0-3.6 2.7-5.6 6-5.6s6 2 6 5.6"/><circle cx="17" cy="9" r="2.6"/><path d="M17 14.6c2.6.2 4.4 1.9 4.4 5"/>')
I_bar=ic('<path d="M5 20V10M12 20V4M19 20v-7"/>')
I_clock=ic('<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>')
def fr(cls,inner,cap): return f'<div class="fw"><div class="frame {cls}">{inner}<div class="safe">zone réseau</div></div><p class="cap">{cap}</p></div>'
S=[]
S.append(fr('fp','<div class="phone"><div class="ph-h"><i>DG</i><div><b>DG</b><span>en ligne</span></div></div><div class="ph-b"><div class="m in">Hello Mo,<small>08:12</small></div><div class="m out">Bonjour !<small>08:12</small></div><div class="m in">Peux-tu me faire un dashboard pour lundi ?<small>08:13</small></div></div></div>',
 '<b>1 · Conversation · perle</b> · 0–5 s. Style WhatsApp : « Hello Mo, » → « Bonjour ! » → la demande. Les messages arrivent un à un, téléphone en légère perspective. Silence de la voix, sons de notification.'))
S.append(fr('fp','<div class="d3"><small>Projet agricole · suivi (fictif)</small><div class="k"><div><small>Avancement</small><b>72 %</b></div><div><small>Zones</small><b>14</b></div><div><small>Retards</small><b style="color:#FF8A6B">5</b></div></div><svg viewBox="0 0 100 30" preserveAspectRatio="none"><path d="M0 24 L16 20 L32 22 L48 12 L64 15 L80 6 L100 9" fill="none" stroke="#7FA6FF" stroke-width="2.2" stroke-linecap="round"/></svg></div><div class="leg" style="top:69%">Tu ouvres<br><b>Power BI.</b></div>',
 '<b>2 · Objet + légende · perle</b> · 5–9 s. Un dashboard fictif apparaît en 3D (carte ardoise, rotation lente). Le logo Power BI est la marque de Microsoft : je ne le dessine pas. Si tu le veux, tu me fournis le fichier officiel.'))
S.append(fr('fb','<div class="tile on-blue"><svg viewBox="0 0 24 24" width="60%" fill="none" stroke="#2260F5" stroke-width="2.6" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg></div><div class="leg" style="top:70%">C\'est la première<br><span class="sr">erreur.</span></div>',
 '<b>3 · Accroche · bleu</b> · 9–12 s. Seule scène bleue. La croix tombe en 3D, rebondit une fois.'))
S.append(fr('fl','<div class="tile"><span class="q">?</span></div><div class="leg" style="top:70%">Qu\'est-ce qu\'il<br>veut <span class="sr" style="color:#2260F5">décider</span> ?</div>',
 '<b>4 · Question · blanc lumière</b> · 12–19 s. Le point d\'interrogation flotte, léger balancement.'))
S.append(fr('fs','<div class="chip no" style="top:25%">Montrer</div><div class="chip yes" style="top:37%">Décider</div><div class="leg" style="top:66%">Un dashboard<br>sert à <span class="sr">décider.</span></div>',
 '<b>5 · Idée · sable</b> · 19–24 s. « Montrer » se barre, « Décider » grossit et passe en bleu.'))
S.append(fr('fl',f'<div class="us"><small>User story · exemple fictif</small><div class="r"><i>{I_user}</i><p>En tant que <b>DG</b></p></div><div class="r"><i>{I_pin}</i><p>Je veux savoir <b>quelles zones du projet agricole sont en retard</b></p></div><div class="r"><i>{I_team}</i><p>Pour décider <b>où envoyer l\'équipe de terrain</b> avant la fin du mois</p></div></div>',
 '<b>6 · Puces animées · blanc lumière</b> · 24–38 s. Une ligne à la fois, au rythme de la voix : l\'icône pop, le texte se déroule, le bleu surligne.'))
S.append(fr('fp',f'<div class="kp" style="top:15%"><i>{I_bar}</i>Avancement par zone</div><div class="kp" style="top:27%"><i>{I_clock}</i>Jours de retard</div><div class="kp" style="top:39%"><i>{I_team}</i>Équipes disponibles</div><div class="leg" style="top:66%">Là, tu sais<br><b>quoi mesurer.</b></div>',
 '<b>7 · Cartes · perle</b> · 38–43 s. Trois indicateurs entrent en cascade. La voix ajoute « Le dashboard vient après » sans texte à l\'écran.'))
S.append(fr('fl','<div class="face"><i>photo<br>de Mo</i><b>Moustakim</b><span>l\'accro à l\'IA</span></div><div class="leg" style="top:63%;font-size:8cqw"><b>Pas de question,<br>pas de dashboard.</b></div><div class="leg" style="top:76%;font-size:4.6cqw;color:#6F6962">Ta demande la plus floue ?</div>',
 '<b>8 · Appel à l\'action · blanc lumière</b> · 43–52 s. Ton visage en grand, seule apparition. Plus de courbe ni de badge.'))
html=f"<!DOCTYPE html><html lang='fr'><head><meta charset='utf-8'><style>{ff}{css}{extra}</style></head><body><h1>Vidéo 001 — Ton DG te demande un dashboard</h1><div class='sub'>Planche de storyboard v2 · 9:16 · 8 scènes · environ 52 s · à valider avant rendu</div><div class='grid'>{''.join(S)}</div></body></html>"
open('planche-001-v2.html','w').write(html)
