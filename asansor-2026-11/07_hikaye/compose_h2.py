import subprocess, sys, os
B_YT = 'b_yt2'
D = os.path.dirname(os.path.abspath(__file__)); S = D + '/..'; A = S + '/asansor2'; K = A + '/klip/'; OV = D + '/ov/'
KEMER = '/home/claude/isingundemi-medya/videolar/kemer/kemer-dogru-takilis-youtube.mp4'
TEMPO = 1.10
VY, VH = 680, 810
# voice lines (file, start, end)
V = {'tr': (A + '/tr_t2.mp3', 0.0, 2.8), 'ku': (A + '/ku_t1.mp3', 0.08, 3.94), 'ar': (A + '/ar_t1.mp3', 0.1, 3.6), 'en': (A + '/en_t1.mp3', 0.08, 3.0)}
HOOK = 1.2; PRE = 0.08; POST = 0.12; OUTRO = 2.3
segs = []; t = HOOK
for k in ['tr', 'ku', 'ar', 'en']:
    f, a, b = V[k]; d = (b - a) / TEMPO
    segs.append((k, t, t + PRE, t + PRE + d + POST)); t = t + PRE + d + POST
OUT0 = t; TOTAL = OUT0 + OUTRO
print('segs', [(k, round(s, 2), round(e, 2)) for k, s, v, e in segs], 'total', round(TOTAL, 2))
inp = []; fl = []; n = [0]
def I(*a):
    inp.extend(a); n[0] += 1; return n[0] - 1
# ---- video pieces (all 1080x810)
def piece(src, tin, dur, lab, mode='std', speed=1.0):
    k = I('-i', src)
    if mode == 'kemer':  # avoid burned caption: crop top area
        geo = 'crop=1133:850:420:0,scale=1080:810'
    elif mode == 'yangin':
        geo = 'scale=-2:810,crop=1080:810:(iw-1080)/2:0'
    elif mode == 'right':
        geo = 'scale=-2:810,crop=1080:810:360:0'
    else:
        geo = 'scale=-2:810,crop=1080:810:(iw-1080)/2:0'
    fl.append(f"[{k}:v]trim={tin}:{tin + dur / speed + 0.1:.3f},setpts=PTS-STARTPTS,setpts={1 / speed:.4f}*PTS,fps=30,{geo},setsar=1,trim=0:{dur:.3f},setpts=PTS-STARTPTS,format=yuv420p[{lab}]")
    return lab
P = []
hook = [(S + '/yangin/video/s5.mp4', 2.4, 'yangin'), (KEMER, 49.0, 'kemer'), (K + 's07b_a.mp4', 2.6, 'std'), (K + 's11c.mp4', 4.0, 'std')]
hd = HOOK / 4
for i, (f, tin, m) in enumerate(hook):
    P.append(piece(f, tin, hd, f'h{i}', m))
vis = {'tr': (K + 's01_a.mp4', 0.0, 'std'), 'ku': (K + 's07a_a.mp4', 0.3, 'std'), 'ar': (K + 's07b_a.mp4', 0.6, 'std'), 'en': (K + 's04_a.mp4', 0.0, 'std')}
for k, s, v, e in segs:
    f, tin, m = vis[k]; d = e - s; src = 5.0 - tin
    P.append(piece(f, tin, d, f'v{k}', m, speed=min(1.0, (src - 0.1) / d)))
P.append(piece(K + 's12c.mp4', 0.0, OUTRO, 'vo', 'right', speed=min(1.0, 4.9 / OUTRO)))
fl.append(''.join(f'[{p}]' for p in P) + f"concat=n={len(P)}:v=1:a=0,settb=1/30,fps=30[vid]")
k = I('-loop', '1', '-t', f'{TOTAL:.3f}', '-i', OV + 'frame.png'); fl.append(f"[{k}:v]fps=30,format=yuv420p[bg]")
fl.append(f"[bg][vid]overlay=0:{VY}[b0]"); base = 'b0'
REG = {'wm': (1400, 100), 'b': (346, 250), 's': (556, 100), 'c': (1500, 170)}
def ov(png, a, b, fd=0.12, dy=0, pop=False):
    global base
    Y, H = REG['wm'] if png == 'wm' else REG[png[0]]
    k = I('-loop', '1', '-t', f'{b + 0.2:.3f}', '-i', OV + png + '.png')
    if pop:
        fl.append(f"[{k}:v]format=rgba,crop=1080:{H}:0:{Y},fade=t=out:st={b - fd:.3f}:d={fd}:alpha=1,scale=w='trunc(1080*(1+0.18*max(0\\,1-(t-{a:.3f})/0.16))/2)*2':h=-2:eval=frame[o{n[0]}]")
        fl.append(f"[{base}][o{n[0]}]overlay=x='(1080-w)/2':y='{Y}+({H}-h)/2':eval=frame:enable='between(t,{a:.3f},{b:.3f})'[p{n[0]}]")
    else:
        fl.append(f"[{k}:v]format=rgba,crop=1080:{H}:0:{Y},fade=t=in:st={a:.3f}:d={fd}:alpha=1,fade=t=out:st={b - fd:.3f}:d={fd}:alpha=1[o{n[0]}]")
        fl.append(f"[{base}][o{n[0]}]overlay=0:'{Y}+{dy}*max(0,1-(t-{a:.3f})/{fd})':eval=frame:enable='between(t,{a:.3f},{b:.3f})'[p{n[0]}]")
    base = f'p{n[0]}'
ov('wm', 0, TOTAL, 0.2)
# hook: stamp + chips building up
ov('b_4dil', 0.0, HOOK + 0.02, 0.06, pop=True)
ov('c_hook', 0.25, HOOK + 0.02, 0.15, 8)
for i, st in enumerate(['s_tr', 's_tk', 's_tka', 's_all']):
    ov(st, i * hd, (i + 1) * hd + (0.02 if i < 3 else 0.02), 0.03)
for k, s, v, e in segs:
    ov(f'b_{k}', s, e, 0.06, pop=True)
    ov(f's_{k}', s, e, 0.04)
    ov(f'c_{k}', v - 0.02, e - 0.03, 0.1, 6)
ov(B_YT, OUT0, TOTAL, 0.08, pop=True)
ov('s_all', OUT0, TOTAL, 0.06)
ov('c_yt', OUT0 + 0.2, TOTAL, 0.15, 8)
fl.append(f"[{base}]fade=t=in:st=0:d=0.08,fade=t=out:st={TOTAL - 0.35:.3f}:d=0.35,format=yuv420p[vout]")
# ---- audio
al = []
for k, s, v, e in segs:
    f, a, b = V[k]; kk = I('-i', f); dl = int(v * 1000)
    fl.append(f"[{kk}:a]atrim={max(0, a - 0.03):.3f}:{b + 0.1:.3f},asetpts=PTS-STARTPTS,atempo={TEMPO},aresample=48000,aformat=channel_layouts=stereo,afade=t=in:d=0.02,adelay={dl}|{dl},apad=whole_dur={TOTAL:.3f}[vv{k}]"); al.append(f'[vv{k}]')
fl.append(''.join(al) + f"amix=inputs={len(al)}:normalize=0,atrim=0:{TOTAL:.3f}[voc]")
# sfx: bass hits on hook cuts + outro, clicks on switches
hits = [i * hd for i in range(4)] + [OUT0]
clicks = [s for k, s, v, e in segs]
sl = []
for j, t0 in enumerate(hits):
    kk = I('-f', 'lavfi', '-t', '0.5', '-i', 'sine=f=52:sample_rate=48000'); dl = int(t0 * 1000)
    fl.append(f"[{kk}:a]volume=1.6,afade=t=out:st=0:d=0.45,aformat=channel_layouts=stereo,adelay={dl}|{dl},apad=whole_dur={TOTAL:.3f}[hb{j}]"); sl.append(f'[hb{j}]')
for j, t0 in enumerate(clicks):
    kk = I('-f', 'lavfi', '-t', '0.06', '-i', 'anoisesrc=c=white:a=0.9:r=48000'); dl = int(t0 * 1000)
    fl.append(f"[{kk}:a]highpass=f=2500,afade=t=out:st=0:d=0.05,volume=0.8,aformat=channel_layouts=stereo,adelay={dl}|{dl},apad=whole_dur={TOTAL:.3f}[ck{j}]"); sl.append(f'[ck{j}]')
    kk = I('-f', 'lavfi', '-t', '0.09', '-i', 'sine=f=1750:sample_rate=48000');
    fl.append(f"[{kk}:a]afade=t=out:st=0:d=0.08,volume=0.35,aformat=channel_layouts=stereo,adelay={dl + 15}|{dl + 15},apad=whole_dur={TOTAL:.3f}[cb{j}]"); sl.append(f'[cb{j}]')
# music with dips at switches
km = I('-ss', '6', '-i', A + '/muz75.mp3')
dips = '+'.join(f"between(t,{c:.3f},{c + 0.16:.3f})" for c in clicks)
fl.append(f"[{km}:a]aresample=48000,aformat=channel_layouts=stereo,atrim=0:{TOTAL:.3f},asetpts=PTS-STARTPTS,volume='0.7*(1-0.85*({dips}))':eval=frame,afade=t=in:d=0.05,afade=t=out:st={TOTAL - 0.8:.3f}:d=0.8[m]")
fl.append("[voc]asplit=2[vx][sc];[m][sc]sidechaincompress=threshold=0.05:ratio=2.5:attack=30:release=300:makeup=1[md]")
fl.append("[vx]highpass=f=70,acompressor=threshold=0.12:ratio=2.5:attack=8:release=120:makeup=1.3[vc]")
fl.append(f"[vc][md]{''.join(sl)}amix=inputs={2 + len(sl)}:normalize=0,loudnorm=I=-14:TP=-1.5:LRA=9[aout]")
outp = D + ('/hikaye_4dil_teaser.mp4' if B_YT == 'b_yt2' else '/hikaye_4dil.mp4')
cmd = ['ffmpeg', '-hide_banner', '-loglevel', 'error', '-y'] + inp + ['-filter_complex', ';'.join(fl), '-map', '[vout]', '-map', '[aout]', '-t', f'{TOTAL:.3f}',
       '-c:v', 'libx264', '-preset', 'slow', '-crf', '17', '-pix_fmt', 'yuv420p', '-r', '30', '-c:a', 'aac', '-b:a', '256k', '-ar', '48000', '-movflags', '+faststart', outp]
r = subprocess.run(cmd, capture_output=True, text=True)
if r.returncode: print('FFERR', r.returncode, r.stderr[-2000:], r.stdout[-500:]); sys.exit(1)
print('wrote', outp, round(TOTAL, 2))
