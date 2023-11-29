import { useRef } from "react";

export default function ThumbnailGenerator({url, onGeneratedUrl, onGeneratedBlob, onMetaLoaded}){
    const canvas_el = useRef();
    const video_el = useRef();
    const tryGenerate = () => {
        const video = video_el.current;
        const canvas = canvas_el.current;
        canvas.getContext('2d', {willReadFrequently: true}).drawImage(video, 0, 0, 360, 200);
        if(canvas.getContext('2d').getImageData(0, 0, 1, 1).data[3] > 0){ //alpha
            console.log("ready");
            onGeneratedUrl && onGeneratedUrl(canvas.toDataURL('image/png'))
            onGeneratedBlob && canvas.toBlob((blob)=> { onGeneratedBlob(blob) }, 'image/png');
        }
        else{ console.log("not ready"); setTimeout(()=> { tryGenerate() }, 1000) }
    }
    return(
        <div>
            <canvas className="thumbnail-generator" ref={canvas_el} height={200} width={360} />
            <video className="thumbnail-generator" ref={video_el} crossOrigin="anonymous" src={url}
                onLoadedMetadata={(e) => { console.log("meta - " + e.target.duration); onMetaLoaded && onMetaLoaded(e)}}
                onCanPlayThrough={(e) => tryGenerate()}
            >
            </video>
        </div>
    )
}