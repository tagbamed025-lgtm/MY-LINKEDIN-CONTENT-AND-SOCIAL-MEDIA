import numpy as np, subprocess, wave
SR=44100; D=43.0; P='/home/claude/work/b/Moustakim-LinkedIn/3-SKILL-achete-Motion-Video-Director/sound-effects/'
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
(0.3,SP,'start',-26,.5),(0.7,PP,'start',-22,1.0),(1.25,SP,'start',-27,.5),(1.65,UI,'start',-24,1.0),(2.1,SP,'start',-27,.5),(2.5,PP,'start',-22,1.0),
(5.0,WH,'peak',-23,1.6),(5.3,SL,'start',-24,.7),(6.9,CC,'start',-29,.1),
(8.3,WD,'peak',-22,2.0),(8.5,NP,'start',-20,.5),(8.78,CC,'start',-28,.1),
(9.95,W2,'peak',-27,1.5),(10.15,CC,'start',-29,.1),(11.55,CC,'start',-29,.1),
(12.95,W2,'peak',-27,1.2),(13.08,CC,'start',-29,.1),
(13.85,W2,'peak',-27,1.2),(13.9,SP,'start',-24,.5),(14.08,CC,'start',-28,.1),
(14.95,W2,'peak',-27,1.5),(15.05,SP,'start',-25,.5),(15.7,PP,'start',-23,1.0),(16.45,C2,'start',-26,.15),(16.8,UI,'start',-24,1.0),(17.5,CC,'start',-29,.1),
(18.7,WH,'peak',-23,1.6),(18.9,SL,'start',-24,.7),(22.17,SP,'start',-25,.5),(22.4,CC,'start',-29,.1),(23.26,SP,'start',-25,.5),(23.5,CC,'start',-29,.1),(26.53,SP,'start',-25,.5),(26.8,CC,'start',-29,.1),
(30.7,WH,'peak',-24,1.6),(30.8,SP,'start',-25,.5),(31.2,SP,'start',-25,.5),(31.6,SP,'start',-25,.5),(32.1,CC,'start',-29,.1),
(34.8,WH,'peak',-25,1.6),(35.05,CC,'start',-28,.1),(36.0,W2,'peak',-27,1.2),(36.1,UI,'start',-24,1.0),(36.4,CC,'start',-29,.1),(37.3,W2,'peak',-27,1.2),(37.75,PP,'start',-22,1.2),(38.05,CC,'start',-29,.1)]
L=np.zeros((int(D*SR),2),np.float32)
for t,f,al,g,du in EV:
    x,a=prep(load(f),al,du); x=x*10**(g/20); i=int(t*SR)-a
    if i<0: x=x[-i:]; i=0
    j=min(len(L),i+len(x)); L[i:j]+=x[:j-i]
L*= 0.5/np.abs(L).max()
with wave.open('audio/sfx4.wav','wb') as w: w.setnchannels(2);w.setsampwidth(2);w.setframerate(SR);w.writeframes((np.clip(L,-1,1)*32767).astype('<i2').tobytes())
print('sfx ok',len(EV),'événements')
