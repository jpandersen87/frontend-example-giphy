import { DocumentCard, MessageBar, MessageBarType, Stack } from 'office-ui-fabric-react';
import React from 'react';
import {Gif} from '../gif';

// Takes array of gifs in Giphy API Gif data format to display.
export const GifDisplay: React.FunctionComponent<{gifs:Gif[]}> = ({gifs}) => {
    const [copyMessageTimeout, setCopyMessageTimeout] = React.useState<number|undefined>();
    const copyGifUrl = React.useCallback((url) => {
        setCopyMessageTimeout(prevVal => {
            if(prevVal){
                clearTimeout(prevVal);
            }
            return window.setTimeout(() => setCopyMessageTimeout(undefined), 2000);

        });
        navigator.clipboard.writeText(url);
    }, []);

    const displays = gifs.map((x, k) => (<DocumentCard style={{width:100}} key={x.id} 
        onClick={(e) => copyGifUrl(x.url)}>
        <video 
            width="100%"
            loop={true} 
            autoPlay={true}>
                <source src={x.images.original_mp4.mp4} />
        </video>
    </DocumentCard>))

    return (
        <React.Fragment>
            <Stack horizontal wrap horizontalAlign="center">
                {displays}
            </Stack>
            {copyMessageTimeout ? (
                <Stack 
                    styles={{
                        root:{
                            position:'fixed', 
                            bottom:0, 
                            left:0
                        }
                    }}>
                    <MessageBar messageBarType={MessageBarType.success}>
                        Gif copied to clipboard!
                    </MessageBar>
                </Stack>
            ) : undefined}
        </React.Fragment>);
}