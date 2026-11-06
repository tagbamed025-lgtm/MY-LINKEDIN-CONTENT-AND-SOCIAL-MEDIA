import numpy as np, subprocess, wave
SR=44100; D=52.0; P='/home/claude/work/b/Moustakim-LinkedIn/3-SKILL-achete-Motion-Video-Director/sound-effects/'
def load(f):
    raw=subprocess.run(['ffmpeg','-v','error','-i',P+f,'-ac','2','-ar',str(SR),'-f','f32le','-'],capture_output=True).stdout
    return np.frombuffer(raw,dtype=np.float32).reshape(-1,2).copy()
def prep(x,align,dur=None):
    x=x/(np.abs(x).max()+1e-9)*0.7
    m=np.abs(x).mean(1); k=int(.01*SR); e=np.convolve(m,np.ones(k)/k,'same')
    if align=='peak': a=int(np.argmax(e))
    else: a=int(np.argmax(e>0.08*e.max()))
    if dur is not None:
        n=int(dur*SR); x=x[:n]; f=int(min(.25,dur/3)*SR); x[-f:]*=np.linspace(1,0,f)[:,None]
    f=int(.004*SR); x[:f]*=np.linspace(0,1,f)[:,None]
    return x,a
W='Whooshes/'; PO='Pop/'; CK='Clicks/'
WH=W+'Smooth And Fast Whoosh.wav'; W2=W+'Simple Whoosh 2.wav'; WD=W+'Whoosh Deep Light 2.wav'
PP=PO+'Premium And Smooth Pop.wav'; SP=PO+'Smooth Pop.wav'; UI=PO+'Sweet UI Open.wav'; SL=PO+'Slow And Smooth Pop.wav'; NP=PO+'Normal Pop.wav'
CC=CK+'Cinematic Click.wav'; C2=CK+'Click 2.wav'
EV=[
(0.45,SP,'start',-26,.5),(1.05,PP,'start',-22,1.0),(1.95,SP,'start',-27,.5),(2.55,UI,'start',-24,1.0),(3.15,SP,'start',-27,.5),(3.8,PP,'start',-22,1.0),
(5.2,WH,'peak',-23,1.6),(5.5,SL,'start',-24,.7),(6.2,CC,'start',-29,.1),
(9.2,WD,'peak',-22,2.0),(9.72,NP,'start',-20,.5),(10.45,CC,'start',-28,.1),
(12.4,W2,'peak',-27,1.5),(12.75,CC,'start',-29,.1),(13.4,CC,'start',-29,.1),
(16.2,W2,'peak',-27,1.5),(16.4,SP,'start',-24,.5),(16.9,CC,'start',-28,.1),
(19.4,W2,'peak',-27,1.5),(19.7,SP,'start',-25,.5),(20.35,PP,'start',-23,1.0),(21.0,C2,'start',-26,.15),(21.3,UI,'start',-24,1.0),(22.0,CC,'start',-29,.1),
(24.4,WH,'peak',-23,1.6),(24.6,SL,'start',-24,.7),(25.6,SP,'start',-25,.5),(25.9,CC,'start',-29,.1),(28.6,SP,'start',-25,.5),(28.9,CC,'start',-29,.1),(33.2,SP,'start',-25,.5),(33.5,CC,'start',-29,.1),
(38.4,WH,'peak',-24,1.6),(38.7,SP,'start',-25,.5),(39.2,SP,'start',-25,.5),(39.7,SP,'start',-25,.5),(40.7,CC,'start',-29,.1),
(43.6,WH,'peak',-25,1.6),(43.9,PP,'start',-22,1.6),(44.4,CC,'start',-29,.1),(45.2,CC,'start',-29,.1),(45.85,CC,'start',-29,.1),(47.6,UI,'start',-24,1.0)]
L=np.zeros((int(D*SR),2),np.float32)
for t,f,al,g,du in EV:
    x,a=prep(load(f),al,du); x=x*10**(g/20); i=int(t*SR)-a
    if i<0: x=x[-i:]; i=0
    j=min(len(L),i+len(x)); L[i:j]+=x[:j-i]
L*= 0.5/np.abs(L).max()   # aperçu sans voix : crête -6 dBFS
with wave.open('sfx.wav','wb') as w: w.setnchannels(2);w.setsampwidth(2);w.setframerate(SR);w.writeframes((np.clip(L,-1,1)*32767).astype('<i2').tobytes())
print('sfx ok',len(EV),'événements')
