import numpy as np, soundfile as sf
SR=44100; DUR=27
rng=np.random.default_rng(9)
n=int(DUR*SR); y=np.zeros(n)
def T(d): return np.arange(int(d*SR))/SR
def add(sig,t,g=1.0):
    i=int(t*SR)
    if i>=n or i<0: return
    s=sig[:n-i]; y[i:i+len(s)]+=s*g
def env(t,a=0.004,d=3.0): return np.minimum(t/a,1)*np.exp(-t*d)
def sine(f,d,dec=4.0): t=T(d); return np.sin(2*np.pi*f*t)*env(t,0.004,dec)
def sweep(f0,f1,d,dec=3.0,saw=False):
    t=T(d); f=f0+(f1-f0)*(t/d); ph=2*np.pi*np.cumsum(f)/SR
    s=(2*((ph/(2*np.pi))%1)-1) if saw else np.sin(ph); return s*env(t,0.004,dec)
def lp(x,k): return np.convolve(x,np.ones(k)/k,mode='same')
def noise(d): return rng.standard_normal(int(d*SR))
# jaunty bed 104bpm
beat=60/104
for b in range(int(DUR/beat)):
    t0=b*beat; fq=[196,247,220,262][(b//2)%4]
    add(sweep(120,45,0.22,12),t0,0.18)
    add(np.diff(noise(0.05),prepend=0)*np.exp(-T(0.05)*80),t0+beat/2,0.05)
    add(sine(fq,0.26,9)*0.5,t0+beat*0.25,0.10); add(sine(fq*2,0.18,12)*0.2,t0+beat*0.75,0.08)
# whooshes
for c in [0.2,4.3,13.6,22.0]:
    t=T(0.35); w=np.diff(noise(0.35),prepend=0)*np.sin(np.pi*t/0.35)**2; add(w,c-0.1,0.35)
# sign pops
for tp in [1.2,1.6]: add(sweep(300,900,0.12,14),tp,0.5)
# counting ticks 4.5-7.1 rising
for k in range(18): add(sine(500+k*45,0.08,30),4.5+k*0.15,0.22)
add(sine(1318,0.7,6)+0.6*sine(1760,0.7,6),7.1,0.4)
# crowd murmur swelling 4.4-10.8
d=6.4; m=lp(noise(d),40)*np.linspace(0.2,1,int(d*SR))**1.5; m*= (1+0.4*np.sin(2*np.pi*2.3*T(d))); add(m,4.4,2.2)
# record scratch + sad trombone
add(sweep(2400,180,0.4,5,True)*0.6+np.diff(noise(0.4),prepend=0)*np.exp(-T(0.4)*6)*0.4,10.6,0.5)
for k,(f,d,tt) in enumerate([(233,0.38,11.8),(220,0.38,12.2),(208,0.38,12.6)]): add(sweep(f,f*0.98,d,2.2,True)*0.5,tt,0.28)
add(sweep(196,120,1.0,1.8,True)*0.5,13.0,0.28)
# card slam boom
add(sweep(70,34,1.3,2.6),14.0,1.0); add(noise(0.4)*np.exp(-T(0.4)*12),14.0,0.4); add(sweep(150,50,0.4,7),14.0,0.6)
# rising dings during counter climb
for k in range(12): add(sine(880*(1.06**k),0.3,9)+0.5*sine(1760*(1.06**k),0.3,9),16.0+k*0.15,0.22)
add(sine(2093,0.5,8)+sine(2637,0.5,8),17.8,0.35)
# stampede rumble 17.0-20.3 + thumps
d=3.3; r=lp(noise(d),90)*np.minimum(T(d)/0.5,1)*np.minimum((d-T(d))/0.8,1); add(r,17.0,3.5)
for k in range(26): add(sweep(95,40,0.12,25)*(0.8+0.2*np.sin(k)),17.0+k*0.125,0.5)
# boing + cash register
add(sweep(200,520,0.5,4)*(1+0.5*np.sin(2*np.pi*14*T(0.5))),20.8,0.4)
add(sine(2093,0.5,8)+sine(2637,0.5,8),23.5,0.4); add(sine(3136,0.6,7),23.62,0.35)
f=int(1.0*SR); y[-f:]*=np.linspace(1,0,f)
y=np.tanh(y*1.0); y/=np.max(np.abs(y))/0.9
sf.write("/home/user/CEO-TURBO-USE-THIS-ONE-/videos/ceoturbo-ads/assets/audio/ad7.wav",y,SR); print("ok")
