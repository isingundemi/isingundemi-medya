# usage: dl.sh name url1 url2
n=$1; shift; i=0
for u in "$@"; do s=$(echo a b | cut -d' ' -f$((i+1))); curl -sSL -o ${n}_$s.mp4 "$u"; i=$((i+1)); done
for s in a b; do [ -f ${n}_$s.mp4 ] && ffmpeg -v error -y -i ${n}_$s.mp4 -vf "select='eq(n\,0)+eq(n\,40)+eq(n\,80)+eq(n\,119)',scale=320:-1,tile=4x1" -frames:v 1 ${n}_$s.jpg; done
