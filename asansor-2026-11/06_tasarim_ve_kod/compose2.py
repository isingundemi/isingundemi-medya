import subprocess, json, sys, os
D = os.path.dirname(os.path.abspath(__file__)); K = D + '/klip/'; O = D + '/../asansor/klip/'; OV = D + '/ov/'
MODE = sys.argv[1] if len(sys.argv) > 1 else 'reels'   # reels | yt
TRK = sys.argv[2] if len(sys.argv) > 2 else 'tr2'       # voice key for reels
L = json.load(open(D + '/lines.json'))
VO = {'tr2': D + '/tr_t2.mp3', 'tr1': D + '/tr_t1.mp3', 'en1': D + '/en_t1.mp3', 'ku1': D + '/ku_t1.mp3', 'ar1': D + '/ar_t1.mp3'}
LEAD, TAIL = 0.3, 0.5
MINS = [3.4, 0, 0, 0, 0, 0, 11.0, 0, 0, 0, 6.4, 0]
langs = [TRK] if MODE == 'reels' else ['tr2', 'en1', 'ku1', 'ar1']
dur = []
for i in range(12):
    m = max(L[k][i][1] - L[k][i][0] for k in langs)
    d = max(LEAD + m + TAIL, MINS[i])
    if i == 11: d += 1.3
    dur.append(round(d, 3))
T = [0.0]
for d in dur: T.append(T[-1] + d)
TOTAL = T[-1]
print('scene durations', dur, 'total', round(TOTAL, 2))
# scenes: list of (file, trim_start, trim_end, portion_of_scene)
SC = [
    [(K + 's01_a.mp4', 0, 5.0, 1)],
    [(K + 's02_a.mp4', 0, 5.0, 1)],
    [(O + 'S2_b.mp4', 0, 5.0, 1)],
    [(K + 's04_a.mp4', 0, 5.0, 1)],
    [(K + 's05_a.mp4', 0, 5.0, 1)],
    [(K + 's06_a.mp4', 0, 3.2, 1)],
    [(K + 's07a_a.mp4', 0, 5.0, None), (K + 's07b_a.mp4', 0.8, 5.0, None)],
    [(K + 's08_a.mp4', 0, 5.0, 1)],
    [(O + 'S4_a.mp4', 0, 5.0, 1)],
    [(K + 's10_a.mp4', 0, 5.0, 1)],
    [(K + 's11c.mp4', 0, 5.04, 1)],
    [(K + 's12c.mp4', 0, 5.04, 1)],
]
X = 0.25
if MODE == 'reels':
    VW, VH, VY, BGW, BGH = 1080, 720, 750, 1080, 1920
    scale = 'scale=-2:720:flags=lanczos,crop=1080:720'
else:
    VW, VH, VY, BGW, BGH = 1920, 960, 120, 1920, 1080
    scale = 'scale=1920:-2:flags=lanczos,crop=1920:960'
inp = []; fl = []; n = [0]
def I(*a):
    inp.extend(a); n[0] += 1; return n[0] - 1
parts = []
for i, subs in enumerate(SC):
    need = dur[i] + (X if i < 11 else 0)
    if i == 6:
        gov = round(LEAD + (L[langs[0]][6][0] and 0) + (29.36 - 25.68) + 0.2, 3) if MODE == 'reels' else round(need * 0.38, 3)
        portions = [gov, need - gov]
    else:
        portions = [need]
    segs = []
    for j, (f, a, b, _) in enumerate(subs):
        k = I('-i', f); pd = portions[j]; src = b - a
        sp = max(1.0, pd / (src - 0.04)) if src < pd else 1.0
        lab = f'c{i}_{j}'
        fl.append(f"[{k}:v]trim={a}:{b},setpts=PTS-STARTPTS,setpts={sp:.4f}*PTS,fps=30,{scale},setsar=1,trim=0:{pd:.3f},setpts=PTS-STARTPTS,format=yuv420p[{lab}]")
        segs.append(lab)
    if len(segs) > 1:
        fl.append(''.join(f'[{s}]' for s in segs) + f"concat=n={len(segs)}:v=1:a=0,settb=1/30,fps=30[sc{i}]")
    else:
        fl.append(f"[{segs[0]}]settb=1/30[sc{i}]")
    parts.append(f'sc{i}')
prev = parts[0]
for i in range(1, 12):
    fl.append(f"[{prev}][{parts[i]}]xfade=transition=fade:duration={X}:offset={T[i] - X / 2:.3f}[x{i}]"); prev = f'x{i}'
fl.append(f"[{prev}]trim=0:{TOTAL:.3f},setpts=PTS-STARTPTS[vid]")
bgf = OV + ('frame.png' if MODE == 'reels' else 'frame_yt.png')
k = I('-loop', '1', '-t', f'{TOTAL:.3f}', '-i', bgf); fl.append(f"[{k}:v]fps=30,format=yuv420p[bg]")
fl.append(f"[bg][vid]overlay=0:{VY}[b0]"); base = 'b0'
sfx_ovl = 'ov_yt/' if MODE == 'yt' else ''
def ov(png, a, b, fd=0.25, dy=12):
    global base
    k = I('-loop', '1', '-t', f'{TOTAL:.3f}', '-i', OV + sfx_ovl + png + '.png')
    fl.append(f"[{k}:v]format=rgba,fade=t=in:st={a:.3f}:d={fd}:alpha=1,fade=t=out:st={b - fd:.3f}:d={fd}:alpha=1[o{n[0]}]")
    fl.append(f"[{base}][o{n[0]}]overlay=0:'{dy}*max(0,1-(t-{a:.3f})/{fd})':eval=frame:enable='between(t,{a:.3f},{b:.3f})'[p{n[0]}]"); base = f'p{n[0]}'
ov('wm', 0.0, TOTAL, 0.3, 0)
# chips (scene 11 uses labels4 until 'Kırmızı')
K11 = T[10] + LEAD + (49.76 - 47.6)
for i in range(12):
    a, b = T[i] + 0.12, T[i + 1] - 0.05
    if i == 10:
        ov('labels4', a, K11, 0.22, 10); ov('chip10', K11, b, 0.18, 8)
    else:
        ov(f'chip{i}', a, b, 0.22, 10)
# captions (reels only, TR take2 timing)
CAP = [(0, 0, 2.8), (1, 3.04, 5.04), (1, 5.28, 7.2), (2, 7.44, 11.92), (3, 12.08, 16.72), (4, 16.96, 18.76), (4, 18.96, 22.96), (5, 23.2, 25.52),
       (6, 25.68, 29.12), (6, 29.36, 31.4), (6, 31.52, 34.72), (7, 35.2, 37.44), (7, 37.6, 39.4), (8, 39.52, 43.84), (9, 43.92, 47.4),
       (10, 47.6, 49.6), (10, 49.76, 51.56), (10, 51.68, 53.2), (11, 53.36, 54.88), (11, 55.04, 57.12)]
if MODE == 'reels' and TRK == 'tr2':
    for c, (li, s, e) in enumerate(CAP):
        ls = L['tr2'][li][0]; a = T[li] + LEAD + (s - ls) - 0.05
        nxt = CAP[c + 1] if c + 1 < len(CAP) else None
        if nxt and nxt[0] == li: b = T[li] + LEAD + (nxt[1] - ls) - 0.07
        else: b = min(T[li] + LEAD + (e - ls) + 0.45, T[li + 1] - 0.02)
        ov(f'cap{c}', a, b, 0.15, 8)
fl.append(f"[{base}]fade=t=in:st=0:d=0.2,fade=t=out:st={TOTAL - 0.4:.3f}:d=0.4,format=yuv420p[vout]")
# ---------- audio
def voice_track(key, label):
    k = I('-i', VO[key]); ls = L[key]; al = []
    fl.append(f"[{k}:a]asplit=12" + ''.join(f'[{label}s{i}]' for i in range(12)))
    for i in range(12):
        a, b = ls[i]; dl = int((T[i] + LEAD) * 1000)
        fl.append(f"[{label}s{i}]atrim={max(0, a - 0.04):.3f}:{b + 0.12:.3f},asetpts=PTS-STARTPTS,aresample=48000,aformat=channel_layouts=stereo,afade=t=in:d=0.02,afade=t=out:st={b - a + 0.06:.3f}:d=0.06,adelay={dl}|{dl}[{label}v{i}]")
        al.append(f'[{label}v{i}]')
    fl.append(''.join(al) + f"amix=inputs=12:normalize=0,apad=whole_dur={TOTAL:.3f},atrim=0:{TOTAL:.3f}[{label}]")
SFX = [('sfx_halat.mp3', T[0] + 2.45, 0.6), ('sfx_fren.mp3', T[4] + min(4.4, dur[4] - 1.2), 0.35), ('sfx_fren.mp3', T[6] + dur[6] * 0.72, 0.6)]
def bed(label):
    sl = []
    for j, (f, t, g) in enumerate(SFX):
        kk = I('-i', D + '/../asansor/' + f); dl = int(t * 1000)
        fl.append(f"[{kk}:a]aresample=48000,aformat=channel_layouts=stereo,volume={g},adelay={dl}|{dl},apad=whole_dur={TOTAL:.3f}[{label}x{j}]"); sl.append(f'[{label}x{j}]')
    km = I('-i', D + '/muz75.mp3')
    fl.append(f"[{km}:a]aresample=48000,aformat=channel_layouts=stereo,apad=whole_dur={TOTAL:.3f},atrim=0:{TOTAL:.3f},volume=0.62,afade=t=in:d=0.3,afade=t=out:st={TOTAL - 2.2:.3f}:d=2.2[{label}m]")
    return sl
def mix(vlabel, out):
    sl = bed(out)
    fl.append(f"[{vlabel}]asplit=2[{out}vv][{out}sc];[{out}m][{out}sc]sidechaincompress=threshold=0.05:ratio=2.5:attack=40:release=400:makeup=1[{out}md]")
    fl.append(f"[{out}vv]highpass=f=70,acompressor=threshold=0.12:ratio=2.5:attack=8:release=120:makeup=1.3[{out}vc]")
    fl.append(f"[{out}vc][{out}md]{''.join(sl)}amix=inputs={2 + len(sl)}:normalize=0,loudnorm=I=-14:TP=-1.5:LRA=9[{out}]")
outs = []
for key in langs:
    lab = 'V' + key; voice_track(key, lab); mix(lab, 'A' + key); outs.append('A' + key)
name = f'asansor2_{MODE}' + (f'_{TRK}' if MODE == 'reels' else '')
outp = f'{D}/{name}.mp4'
cmd = ['ffmpeg', '-hide_banner', '-loglevel', 'error', '-y'] + inp + ['-filter_complex', ';'.join(fl), '-map', '[vout]', '-map', f'[{outs[0]}]',
       '-t', f'{TOTAL:.3f}', '-c:v', 'libx264', '-preset', 'slow', '-crf', '16', '-pix_fmt', 'yuv420p', '-r', '30', '-c:a', 'aac', '-b:a', '256k', '-ar', '48000', '-movflags', '+faststart', outp]
if MODE == 'yt':
    # export each language mix as separate m4a too
    for o in outs[1:]:
        cmd += ['-map', f'[{o}]', '-vn', '-c:a', 'aac', '-b:a', '256k', '-t', f'{TOTAL:.3f}', f'{D}/{name}_{o[1:]}.m4a']
r=subprocess.run(cmd, capture_output=True, text=True)
if r.returncode: print('FFERR', r.stderr[-1500:]); sys.exit(1)
print('wrote', outp)
json.dump({'T': T, 'dur': dur, 'total': TOTAL, 'langs': langs}, open(f'{D}/timeline_{name}.json', 'w'))
