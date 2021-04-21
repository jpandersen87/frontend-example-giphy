import React from 'react';
import axios, { AxiosError } from 'axios';
import {Gif, GifData, GifsData} from '../gif';
import {GifDisplay} from './GifDisplay';
import {useDebounce} from '../Hooks/useDebounce';
import { DefaultButton, MessageBar, MessageBarType, SearchBox, Spinner, SpinnerSize } from '@fluentui/react';

// Giphy Search component. Requests 3 individual random gifs on mount by default to show
// before user uses search.
export const GifSearch: React.FunctionComponent<{numRandom?:number, limit?:number}> = ({numRandom=3,limit=25}) => {
    const [searchQuery, setSearchQuery] = React.useState<string>();
    const [searchOffset, setSearchOffset] = React.useState<number>(0);
    const lastSearchQuery = React.useRef(searchQuery);
    const debouncedSetSearchQuery = useDebounce(setSearchQuery, 500);
    const [gifs, setGifs] = React.useState<Gif[]>([]);
    const [error, setError] = React.useState<AxiosError>();
    // Set offset for next set of gifs based off limit
    const paginateGifs = React.useCallback(() => {
        setSearchOffset((val) => val + limit);
    }, [limit]);
    let errorMessage;

    // Get random gifs to show before search
    React.useEffect(() => {
        async function fetchRandom(){
            const randomGifReqs = [];
    
            for(var i = 0; i < numRandom; i++){
              randomGifReqs.push(axios.get<GifData>(`https://api.giphy.com/v1/gifs/random?api_key=${process.env.REACT_APP_GIPHY_API_KEY}&tag=&rating=g`));
            }
    
            try {
                const reqs = await Promise.all(randomGifReqs)
                setGifs(reqs.map(x => x.data.data));
            } catch(e){
                setError(e);
            }
        };
        fetchRandom();
    }, [numRandom]);

    // Get gifs from search/pagination
    React.useEffect(() => {
        async function fetchSearch(){
            try {
                const req = await axios.get<GifsData>(`https://api.giphy.com/v1/gifs/search?api_key=${process.env.REACT_APP_GIPHY_API_KEY}&q=${searchQuery}&limit=${limit}&offset=${searchOffset}&rating=g&lang=en`);
                // If new term search, replace all gifs
                if(searchQuery !== lastSearchQuery.current){
                    setGifs(req.data.data);
                    lastSearchQuery.current = searchQuery;
                } else {    // Else we're paginating, add to array
                    setGifs((gifs) => gifs.concat(req.data.data));
                }
            } catch(e){
                setError(e);
            }
        }
        // Reset offset first before doing new term search
        if(searchQuery){ 
            if(searchQuery !== lastSearchQuery.current && searchOffset > 0){
                setSearchOffset(0);
            } else {       
                fetchSearch();
            }
        }
    }, [searchQuery, searchOffset, limit]);

    if(error){
        // Giphy communication error
        if(error.response || error.request){
            if(error.response && error.response.data === "API Usage Exceeded"){
                errorMessage = "Giphy usage exceeded. Please wait an hour and try again."
            } else {
                errorMessage = "Unexpected error occured while communicating with Giphy. Please try again later.";
            }
        } else {    // Unknown error, report to console as well
            console.error(error);
            errorMessage = "Unexpected error occured. Please try again later.";
        }
    }

    return (
        <div>
            {errorMessage ? 
                <MessageBar 
                    messageBarType={MessageBarType.error}>
                        {errorMessage}
                </MessageBar> : undefined}
            <SearchBox
                placeholder="dog" 
                onChange={(e) => debouncedSetSearchQuery(e?.target.value)}
                onClear={(val) => setSearchQuery(val)}
                />
            {gifs ? <GifDisplay gifs={gifs} /> : <Spinner size={SpinnerSize.large} />}
            {searchQuery ? <DefaultButton text="Show more" onClick={e => paginateGifs()} /> : undefined}
        </div>
    )
  }