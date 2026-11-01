import subprocess, sys, os
D = os.path.dirname(os.path.abspath(__file__)); K = D + '/klip/'; O = D + '/../asansor/klip/'; OV = D + '/ovz/'
VOF = D + '/zipla_t1.mp3'
LINES = [(0.0, 3.07), (3.51, 3.98), (4.39, 8.72), (9.13, 12.89)]
LEAD = 0.3
dur = [3.07 + 0.75, 0.47 + 1.0, 4.33 + 0.75, 3.76 + 2.2]
T = [0.0]
for d in dur: T.append(T[-1] + d)
TOTAL = T[-1]; X = 0.25
SC = [[(K + 's06_a.mp4', 0, 3.2)], [(K + 's11_a.mp4', 2.6, 4.4)], [(K + 's02_a.mp4', 0, 4.0)], [(K + 's07b_a.mp4', 1.0, 5.0)]]
inp = []; fl = []; n = [0]
def I(*a):
    inp.extend(a); n[0] += 1; return n[0] - 1
parts = []
for i, subs in enumerate(SC):
    need = dur[i] + (X if i < 3 else 0)
    f, a, b = subs[0]; k = I('-i', f); src = b - a
    sp = max(1.0, need / (src - 0.04)) if src < need else 1.0
    fl.append(f"[{k}:v]trim={a}:{b},setpts=PTS-STARTPTS,setpts={sp:.4f}*PTS,fps=30,scale=-2:720:flags=lanczos,crop=1080:720,setsar=1,trim=0:{need:.3f},setpts=PTS-STARTPTS,format=yuv420p,settb=1/30[sc{i}]")
    parts.append(f'sc{i}')
prev = parts[0]
for i in range(1, 4):
    fl.append(f"[{prev}][{parts[i]}]xfade=transition=fade:duration={X}:offset={T[i] - X / 2:.3f}[x{i}]"); prev = f'x{i}'
fl.append(f"[{prev}]trim=0:{TOTAL:.3f},setpts=PTS-STARTPTS[vid]")
k = I('-loop', '1', '-t', f'{TOTAL:.3f}', '-i', OV + 'frame.png'); fl.append(f"[{k}:v]fps=30,format=yuv420p[bg]")
fl.append("[bg][vid]overlay=0:750[b0]"); base = 'b0'
def ov(png, a, b, fd=0.22, dy=10):
    global base
    k = I('-loop', '1', '-t', f'{TOTAL:.3f}', '-i', OV + png + '.png')
    fl.append(f"[{k}:v]format=rgba,fade=t=in:st={a:.3f}:d={fd}:alpha=1,fade=t=out:st={b - fd:.3f}:d={fd}:alpha=1[o{n[0]}]")
    fl.append(f"[{base}][o{n[0]}]overlay=0:'{dy}*max(0,1-(t-{a:.3f})/{fd})':eval=frame:enable='between(t,{a:.3f},{b:.3f})'[p{n[0]}]"); base = f'p{n[0]}'
ov('wm', 0, TOTAL, 0.3, 0)
for i in range(4):
    ov(f'chip{i}', T[i] + 0.1, T[i + 1] - 0.05)
    ov(f'cap{i}', T[i] + LEAD - 0.05, min(T[i] + LEAD + LINES[i][1] - LINES[i][0] + 0.45, T[i + 1] - 0.02), 0.15, 8)
fl.append(f"[{base}]fade=t=in:st=0:d=0.2,fade=t=out:st={TOTAL - 0.4:.3f}:d=0.4,format=yuv420p[vout]")
k = I('-i', VOF); al = []
fl.append(f"[{k}:a]asplit=4" + ''.join(f'[s{i}]' for i in range(4)))
for i, (a, b) in enumerate(LINES):
    dl = int((T[i] + LEAD) * 1000)
    fl.append(f"[s{i}]atrim={max(0, a - 0.04):.3f}:{b + 0.12:.3f},asetpts=PTS-STARTPTS,aresample=48000,aformat=channel_layouts=stereo,adelay={dl}|{dl}[v{i}]"); al.append(f'[v{i}]')
fl.append(''.join(al) + f"amix=inputs=4:normalize=0,apad=whole_dur={TOTAL:.3f},atrim=0:{TOTAL:.3f}[voc]")
km = I('-i', D + '/muz_a.mp3')
fl.append(f"[{km}:a]aresample=48000,aformat=channel_layouts=stereo,atrim=0:{TOTAL:.3f},volume=0.62,afade=t=in:d=0.3,afade=t=out:st={TOTAL - 1.8:.3f}:d=1.8[m]")
kf = I('-i', D + '/../asansor/sfx_fren.mp3'); dl = int((T[3] + 1.6) * 1000)
fl.append(f"[{kf}:a]aresample=48000,aformat=channel_layouts=stereo,volume=0.55,adelay={dl}|{dl},apad=whole_dur={TOTAL:.3f}[sf]")
fl.append("[voc]asplit=2[vv][sc];[m][sc]sidechaincompress=threshold=0.05:ratio=2.5:attack=40:release=400:makeup=1[md]")
fl.append("[vv]highpass=f=70,acompressor=threshold=0.12:ratio=2.5:attack=8:release=120:makeup=1.3[vc]")
fl.append("[vc][md][sf]amix=inputs=3:normalize=0,loudnorm=I=-14:TP=-1.5:LRA=9[aout]")
outp = D + '/asansor2_zipla.mp4'
cmd = ['ffmpeg', '-hide_banner', '-loglevel', 'error', '-y'] + inp + ['-filter_complex', ';'.join(fl), '-map', '[vout]', '-map', '[aout]', '-t', f'{TOTAL:.3f}',
       '-c:v', 'libx264', '-preset', 'slow', '-crf', '16', '-pix_fmt', 'yuv420p', '-r', '30', '-c:a', 'aac', '-b:a', '256k', '-ar', '48000', '-movflags', '+faststart', outp]
r = subprocess.run(cmd, capture_output=True, text=True)
if r.returncode: print('FFERR', r.stderr[-1500:]); sys.exit(1)
print('wrote', outp, round(TOTAL, 2))
