import json,re
L=json.load(open('lines.json'));TX=json.load(open('texts.json'))
dur=[4.66,5.64,6.0,6.14,7.36,3.32,11.6,5.84,6.0,5.76,7.42,7.42];LEAD=0.3
T=[0.0]
for d in dur: T.append(T[-1]+d)
def ts(t):
    h=int(t//3600);m=int(t%3600//60);s=t%60
    return f"{h:02d}:{m:02d}:{int(s):02d},{int(round((s-int(s))*1000)):03d}"
key={'tr':'tr2','en':'en1','ku':'ku1','ar':'ar1'}
for lg,k in key.items():
    cues=[]
    for i in range(12):
        a,b=L[k][i];start=T[i]+LEAD;end=start+(b-a)
        txt=TX[lg][i]
        parts=[p.strip() for p in re.split(r'(?<=[.?!؟])\s+',txt) if p.strip()]
        # merge very short parts
        merged=[]
        for p in parts:
            if merged and (len(p)<14 or len(merged[-1])<14): merged[-1]+=' '+p
            else: merged.append(p)
        tot=sum(len(p) for p in merged);t0=start
        for j,p in enumerate(merged):
            t1=t0+(end-start)*len(p)/tot
            e=t1+0.35 if j==len(merged)-1 else t1
            cues.append((t0,min(e,T[i+1]-0.05),p));t0=t1
    with open(f'altyazi_{lg}.srt','w') as f:
        for n,(a,b,p) in enumerate(cues,1): f.write(f"{n}\n{ts(a)} --> {ts(b)}\n{p}\n\n")
    print(lg,len(cues))
print([round(t,1) for t in T])
