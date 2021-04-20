import { DocumentCardImage } from '@fluentui/react';
import { DocumentCard, Stack } from 'office-ui-fabric-react';
import React from 'react';
import {Gif} from '../gif';

// Takes array of gifs in Giphy API Gif data format to display.
export const GifDisplay: React.FunctionComponent<{gifs:Gif[]}> = ({gifs}) => {
    const copyGifUrl = React.useCallback((url) => navigator.clipboard.writeText(url), [])

    const displays2 = gifs.map((x, k) => (<DocumentCard style={{width:100}} key={x.id} 
        onClick={(e) => copyGifUrl(x.url)}>
        <video 
            width="100%"
            loop={true} 
            autoPlay={true}>
                <source src={x.images.original_mp4.mp4} />
        </video>
    </DocumentCard>))

    return (<Stack horizontal wrap horizontalAlign="center">{displays2}</Stack>);
}