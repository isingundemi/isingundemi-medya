import sys,numpy as np
from PIL import Image,ImageFilter
C=Image.open('../asansor/C.png').convert('RGB')
src=C.crop((1865,152,2125,255))
a=np.asarray(src).astype(np.float32)
# helmet base color = bright neutral; logo = colored/darker
base=np.array([236,236,238],np.float32)
d=np.sqrt(((a-base)**2).sum(2))
sat=a.max(2)-a.min(2)
alpha=np.clip((d-28)/40,0,1)*np.clip((sat-22)/25,0,1)
al=Image.fromarray((alpha*255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(0.6))
def put(dst_path,out,box):
    im=Image.open(dst_path).convert('RGB');x0,y0,x1,y1=box
    w,h=x1-x0,y1-y0
    s=src.resize((w,h),Image.LANCZOS);m=al.resize((w,h),Image.LANCZOS)
    # match helmet shading: multiply by local luminance ratio
    reg=im.crop(box);ra=np.asarray(reg).astype(np.float32);lum=ra.mean(2,keepdims=True)/236.0
    sa=np.clip(np.asarray(s).astype(np.float32)*np.clip(lum,0.6,1.05),0,255)
    out_reg=Image.fromarray(sa.astype(np.uint8))
    hm=((ra.min(2)>150)&(ra.max(2)-ra.min(2)<30)).astype(np.uint8)*255
    hm=Image.fromarray(hm).filter(ImageFilter.MinFilter(5)).filter(ImageFilter.GaussianBlur(1.5))
    m=Image.fromarray((np.asarray(m).astype(np.float32)*np.asarray(hm).astype(np.float32)/255).astype(np.uint8))
    im.paste(out_reg,(x0,y0),m)
    im.save(out)
if __name__=='__main__':
    put(sys.argv[1],sys.argv[2],tuple(int(v) for v in sys.argv[3].split(',')))
