import numpy as np, wave
SR=44100; BPM=88; B=60/BPM; DUR=43.0; N=int(SR*DUR)
L=np.zeros(N); R=np.zeros(N); np.random.seed(7)
def add(sig,t,pan=0.0,g=1.0):
    i=int(t*SR); j=min(N,i+len(sig))
    if i>=N: return
    s=sig[:j-i]*g; L[i:j]+=s*(1-pan)*.7071*1.414/1.414; R[i:j]+=s*(1+pan)*.7071
def env(n,a,d):
    e=np.ones(n); na=max(1,int(a*SR)); e[:na]=np.linspace(0,1,na)
    if d: e=e*np.exp(-np.arange(n)/SR/d)
    return e
def lpf(x,fc):
    X=np.fft.rfft(x); f=np.fft.rfftfreq(len(x),1/SR); X*=1/(1+(f/fc)**4); return np.fft.irfft(X,len(x))
nf=lambda m:440*2**((m-69)/12)
# niveaux : 0 intro, 1 inquiet, 2 creux (« sur la liste »), 3 espoir, 4 élan, 5 punchline, 6 final
def lvl(t):
    if t<5.0: return 0
    if t<13.85: return 1
    if t<14.95: return 2
    if t<30.7: return 3
    if t<34.8: return 4
    if t<40.8: return 5
    return 6
Am=[[57,60,64],[53,57,60],[48,52,55],[55,59,62]]   # Am F C G (sombre -> lumineux)
Cm=[[48,52,55],[55,59,62],[57,60,64],[53,57,60]]   # C G Am F (espoir)
def prog(t): return Cm if t>=14.95 else Am
bar=4*B
# nappe (pad)
t=0.0
while t<DUR:
    L_=lvl(t); ci=int(t/bar)%4; ch=prog(t)[ci]; n=int(bar*SR)+int(.6*SR); tt=np.arange(n)/SR; sig=np.zeros(n)
    for m in ch:
        for dt in (-.12,.0,.12): sig+=2*((tt*nf(m)*(1+dt/100))%1)-1
    fc={0:500,1:700,2:420,3:900,4:1200,5:800,6:1400}[L_]
    sig=lpf(sig,fc)*np.minimum(1,tt/.9)*np.minimum(1,(n/SR-tt)/.6)
    add(sig,t,0,{0:.018,1:.024,2:.016,3:.026,4:.032,5:.022,6:.034}[L_])
    if L_>=1:  # basse douce
        bn=int(bar*SR); bt=np.arange(bn)/SR
        bs=np.sin(2*np.pi*nf(ch[0]-24)*bt)*np.minimum(1,(bar-bt)/.15)*np.minimum(1,bt/.05)
        add(bs,t,0,{1:.09,2:.05,3:.10,4:.15,5:.10,6:.16}[L_])
    t+=bar
# notes de piano/pluck (croches espacées)
k=0; t=0.0
while t<DUR:
    L_=lvl(t); dense={0:0,1:2,2:0,3:1,4:1,5:2,6:1}[L_]
    if L_ in (1,2,3,4,5,6) and (dense==1 or (dense==2 and k%2==0)) and L_!=2:
        ci=int(t/bar)%4; ch=prog(t)[ci]; seq=[ch[0]+12,ch[2]+12,ch[1]+24,ch[2]+12] if L_>=4 else [ch[0]+24,ch[2]+12]
        m=seq[k%len(seq)]; n=int(1.3*SR); tt=np.arange(n)/SR
        s=(np.sin(2*np.pi*nf(m)*tt)+.35*np.sin(4*np.pi*nf(m)*tt)+.12*np.sin(6*np.pi*nf(m)*tt))*env(n,.004,.55)
        add(s,t,.3 if k%2 else -.3,{1:.05,3:.06,4:.075,5:.06,6:.07}[L_])
    k+=1; t+=B/2
# batterie douce : seulement à partir de l'élan (25.4) jusqu'à 48.7 puis final
def kick():
    n=int(.4*SR); tt=np.arange(n)/SR; f=48+70*np.exp(-tt*28); return np.sin(2*np.pi*np.cumsum(f)/SR)*np.exp(-tt*8)
def hat():
    n=int(.05*SR); x=np.random.randn(n); x=x-lpf(x,7500); return x*np.exp(-np.arange(n)/SR*70)
def rim():
    n=int(.12*SR); tt=np.arange(n)/SR; return (np.sin(2*np.pi*900*tt)+np.random.randn(n)*.5)*np.exp(-tt*45)
K,Hh,Rm=kick(),hat(),rim(); b=0; t=0.0
while t<DUR:
    L_=lvl(t)
    if L_ in (4,5,6):
        add(K,t,0,.30 if L_==4 else .24)
        if b%2==1: add(Rm,t,0,.07)
        add(Hh,t+B/2,.2,.045)
    b+=1; t+=B
# riser avant la punchline et montée finale
def riser(t0,d,g):
    n=int(d*SR); tt=np.arange(n)/SR; x=(lpf(np.random.randn(n),1800)+lpf(np.random.randn(n),6000)*tt/d)*(tt/d)**2; add(x,t0,0,g)
riser(11.6,2.2,.045); riser(33.3,1.5,.045)
add(K,13.85,0,.5); add(K,14.95,0,.5); add(K,34.8,0,.6); add(K,40.8,0,.65)
# accord final lumineux
n=int(2.2*SR); tt=np.arange(n)/SR; fin=np.zeros(n)
for m in [48,55,60,64,67]:
    for dt in (-.1,.1): fin+=2*((tt*nf(m)*(1+dt/100))%1)-1
add(lpf(fin,1400)*np.minimum(1,tt/.05)*np.exp(-tt/2.2),40.8,0,.05)
out=np.stack([L,R],1)
fi=int(1.2*SR); out[:fi]*=np.linspace(0,1,fi)[:,None]; fo=int(2.0*SR); out[-fo:]*=np.linspace(1,0,fo)[:,None]
out=np.tanh(out*1.1)/1.1; out/=np.abs(out).max()/0.85
w=wave.open('audio/music4.wav','wb'); w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((out*32767).astype('<i2').tobytes()); w.close(); print('music ok')
