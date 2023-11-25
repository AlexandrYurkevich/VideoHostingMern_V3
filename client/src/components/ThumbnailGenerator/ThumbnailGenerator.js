import { useRef } from "react";
import uploadService from "../../services/UploadService";
import { config } from "../../shared";

export default function ThumbnailGenerator({url, onGenerated, onMetaLoaded}){
    const canvas_el = useRef();
    const video_el = useRef();
    const tryGenerate = () =>{
        const video = video_el.current;
        const canvas = canvas_el.current;
        canvas.getContext('2d').drawImage(video, 0, 0, 360, 200);
        if(canvas.getContext('2d').getImageData(0, 0, 1, 1).data[3] > 0){ //alpha
            const thumbnail = canvas.toDataURL('image/png');
            onGenerated(thumbnail)
        }
        else{ setTimeout(()=> { tryGenerate() }, 1000) }
    }
    return(
        <div>
            <canvas className="thumbnail-generator" ref={canvas_el} height={200} width={360} />
            <video className="thumbnail-generator" crossOrigin="anonymous" ref={video_el} src={`${config.backendUrl}/${url}`}
                onLoadedMetadata={(e) => onMetaLoaded && onMetaLoaded(e)}
                onCanPlayThrough={(e) => tryGenerate()}
            >
            </video>
        </div>
    )
}