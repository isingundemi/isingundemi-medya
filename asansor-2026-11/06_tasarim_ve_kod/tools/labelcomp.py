import sys,subprocess,numpy as np
from PIL import Image,ImageDraw,ImageFont,ImageFilter
src,out,rect,mode=sys.argv[1],sys.argv[2],[int(x) for x in sys.argv[3].split(',')],sys.argv[4]
x0,y0,x1,y1=rect;W,H=x1-x0,y1-y0
COL={'g':((46,158,79),'✓'),'b':((31,111,209),'✓'),'y':((242,194,48),'!'),'r':((198,40,40),'✕')}
FB='/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'
def label(c):
    S=4;im=Image.new('RGB',(W*S,H*S),(245,245,245));d=ImageDraw.Draw(im)
    col,sym=COL[c]
    d.rectangle([2*S,2*S,W*S-2*S,H*S-2*S],fill=col)
    d.rectangle([2*S,2*S,W*S-2*S,int(H*S*0.17)],fill=(255,255,255))
    f=ImageFont.truetype(FB,int(H*S*0.075));t='PERİYODİK'
    tw=d.textlength(t,font=f);d.text(((W*S-tw)/2,int(H*S*0.045)),t,font=f,fill=(40,40,40))
    f2=ImageFont.truetype(FB,int(H*S*0.42));tw=d.textlength(sym,font=f2)
    tc=(40,40,40) if c=='y' else (255,255,255)
    d.text(((W*S-tw)/2,int(H*S*0.28)),sym,font=f2,fill=tc)
    for k in range(3):
        yy=int(H*S*(0.8+k*0.05));d.rectangle([int(W*S*0.2),yy,int(W*S*0.8),yy+int(S*1.5)],fill=tc)
    return np.asarray(im.resize((W,H),Image.LANCZOS)).astype(np.float32)
L={c:label(c) for c in COL}
def sched(i):
    if mode=='slot':
        if i>=46: return 'r'
        return 'gbyr'[(i//6)%4]
    return 'gbyr'[(i//24)%4]
probe=subprocess.run(['ffprobe','-v','error','-select_streams','v','-show_entries','stream=width,height','-of','csv=p=0',src],capture_output=True,text=True).stdout.strip().split(',')
w,h=int(probe[0]),int(probe[1])
dec=subprocess.Popen(['ffmpeg','-v','error','-i',src,'-f','rawvideo','-pix_fmt','rgb24','-'],stdout=subprocess.PIPE)
enc=subprocess.Popen(['ffmpeg','-v','error','-y','-f','rawvideo','-pix_fmt','rgb24','-s',f'{w}x{h}','-r','24','-i','-','-c:v','libx264','-crf','12','-preset','slow','-pix_fmt','yuv420p',out],stdin=subprocess.PIPE)
ref=None;i=0
while True:
    b=dec.stdout.read(w*h*3)
    if len(b)<w*h*3: break
    f=np.frombuffer(b,np.uint8).reshape(h,w,3).copy()
    reg=f[y0:y1,x0:x1].astype(np.float32)
    if ref is None: ref=reg.copy()
    diff=np.abs(reg-ref).max(2)
    m=(diff<10).astype(np.uint8)*255
    mi=Image.fromarray(m).filter(ImageFilter.MinFilter(11)).filter(ImageFilter.GaussianBlur(1.2))
    a=(np.asarray(mi).astype(np.float32)/255)[...,None]
    # shading: keep original luminance variation lightly
    shade=(reg.mean(2,keepdims=True)/max(ref.mean(),1))
    lab=np.clip(L[sched(i)]*np.clip(shade,0.85,1.05),0,255)
    f[y0:y1,x0:x1]=(lab*a+reg*(1-a)).astype(np.uint8)
    enc.stdin.write(f.tobytes());i+=1
enc.stdin.close();enc.wait();print('frames',i)
