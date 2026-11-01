import subprocess,re,sys,json
def segs(f,n=12):
    out=subprocess.run(['ffmpeg','-i',f,'-af','silencedetect=noise=-38dB:d=0.18','-f','null','-'],capture_output=True,text=True).stderr
    ss=[float(x) for x in re.findall(r'silence_start: ([0-9.]+)',out)];se=[float(x) for x in re.findall(r'silence_end: ([0-9.]+)',out)]
    dur=float(subprocess.run(['ffprobe','-v','error','-show_entries','format=duration','-of','csv=p=0',f],capture_output=True,text=True).stdout)
    gaps=[(e-s,s,e) for s,e in zip(ss,se) if s>0.1 and e<dur-0.1]
    gaps=sorted(sorted(gaps,reverse=True)[:n-1],key=lambda g:g[1])
    start=0.0;res=[]
    for g in gaps: res.append((round(start,2),round(g[1],2)));start=g[2]
    # trailing silence
    last_end=dur
    if ss and ss[-1]>start and (len(se)<len(ss) or se[-1]>=dur-0.05): last_end=ss[-1]
    res.append((round(start,2),round(last_end,2)))
    return res,dur
R={}
for f in sys.argv[1:]:
    r,d=segs(f);R[f]=r;print(f,round(d,2),[round(b-a,2) for a,b in r])
json.dump(R,open('segs.json','w'))
