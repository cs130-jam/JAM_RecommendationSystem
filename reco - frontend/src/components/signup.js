import React, {useEffect, useRef, useState} from 'react';
import '../App.css';
import InputField from '../util/inputField';
import useInterval from '../util/useInterval';
import ErrorInputField from '../util/errorInputField';
import DropdownField from '../util/dropdownField';
import { Alert } from 'react-bootstrap';

const CHECK_USERNAME_DELAY = 2000; // every 2 seconds
const ARTIST_SEARCH_DELAY = 1000; // every second
const MIN_ARTIST_SEARCH_LEN = 2;

function matchingPrefixIgnoreCase(prefix, entries) {
    prefix = prefix.toLowerCase();
    return entries.filter(entry => {
        const compareLength = Math.min(prefix.length, entry.length);
        return prefix.substring(0, compareLength) === entry.substring(0, compareLength).toLowerCase();
    });
}

const instrumentsListStyle = {
    margin: "0px",
    padding: "0px",
    listStyleType: "none"
}

const artistContainer = {
    height: "60px",
    position: "relative"
}

const artistImageStyle = {
    width: "60px",
    height: "60px",
    borderRadius: "3px"
}

const artistNameStyle = {
    fontSize: "18pt",
    position: "absolute",
    top: "15px",
    left: "70px"
}

const artistButtonStyle = {
    marginTop: "18px",
    marginRight: "-10px"
}

const alertStyle = {
    top: '0'
};

const SignUp = (props) => {
    const setSessionToken = props.setSessionToken;
    const apiService = props.apiService;
    const [isValidInterests, setIsValidInterests] = useState(true); 
    const [failMessage, setFailMessage] = useState("");

    const [isValidUsername, setIsValidUsername] = useState(true);
    const [username, setUsername] = useState("");
    const lastUsername = useRef("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");

    const [instruments, setInstruments] = useState([]);
    const [filteredInstruments, setFilteredInstruments] = useState([]);
    const [knownInstruments, setKnownInstruments] = useState([]);
    const [instQuery, setInstQuery] = useState("");

    const [cachedSearches, setCachedSearches] = useState({});
    const [artistQueryResults, setArtistQueryResults] = useState([]);
    const [artistQuery, setArtistQuery] = useState("");
    const [artists, setArtists] = useState([]);

    const [pageIndex, setPageIndex] = useState(0);

    async function checkUsername() {
        if (username === lastUsername.current) return isValidUsername;

        let response = await apiService.current.existingUser(username);
        setIsValidUsername(response.ok);
        lastUsername.current = username;
        return response.ok;
    }

    useInterval(checkUsername, CHECK_USERNAME_DELAY);

    async function userCredentials() {
        if (password !== confirmPassword || password === "" || username === "") {
            return;
        }

        let validUsername = await checkUsername();
        if (!validUsername) {
            return;
        }

        setPageIndex(pageIndex + 1);
    }

    function userNames() {
        if (firstName.length === 0) {
            return;
        }

        setPageIndex(pageIndex + 1);
    }

    function prevPage() {
        setPageIndex(pageIndex - 1);
    }

    function getFilteredInstruments(query) {
        return matchingPrefixIgnoreCase(query, instruments);
    }
    useEffect(() => {
        setFilteredInstruments(getFilteredInstruments(instQuery));
    }, [instQuery, instruments]);

    function onInstrumentSelect(instrument) {
        if (knownInstruments.includes(instrument.name)) return;
        setKnownInstruments([...knownInstruments, instrument.name]);
    }

    async function getInstruments() {
        let response = await apiService.current.getInstruments();
        let json = await response.json();
        setInstruments(json);
    }
    useEffect(() => getInstruments(), []);

    function removeInstrument(instrument) {
        setKnownInstruments(knownInstruments.filter(filteredInstrument => filteredInstrument !== instrument));
    }

    function instrumentsDone() {
        setPageIndex(pageIndex + 1);
    }

    useInterval(() => {
        let cached = cachedSearches[artistQuery];
        getArtistsForQuery(artistQuery, cached ? cached.wantedCount : 10, {...cachedSearches});
    }, ARTIST_SEARCH_DELAY);


    async function getArtistsForQuery(query, wantedCount, cachedSearches) {
        if (query.length <= MIN_ARTIST_SEARCH_LEN) return null;

        let cached = cachedSearches[query];

        if (cached && cached.wantedCount !== wantedCount) {
            cached.wantedCount = wantedCount;
            setCachedSearches(cachedSearches);
        }
        if (cached && cached.responses.length >= wantedCount) return;
        if (cached && cached.page === cached.totalPages) return;

        let page = cached ? cached.page + 1 : 1;
        let response = await apiService.current.findArtists(query, page);
        let json = await response.json();
        if (!cached) {
            cachedSearches[query] = {
                "page": page,
                "totalPages": json.totalPages,
                "responses": json.responses,
                "wantedCount": wantedCount
            };
            cached = cachedSearches[query];
        } else {
            cached.page = page;
            cached.totalPages = json.totalPages;
            cached.responses = [...cached.responses, json.responses];
        }

        if (cached.responses.lenth < wantedCount) {
            getArtistsForQuery(query, wantedCount, cachedSearches);
        } else {
            setCachedSearches(cachedSearches);
        }
    }

    function onArtistSelect(entry) {
        if (artists.length >= 2) setIsValidInterests(true);
        setArtists([...artists, entry.content]);
    }

    useEffect(() => {
        let cached = cachedSearches[artistQuery];
        if (!cached) {
            setArtistQueryResults([]);
            return;
        }

        setArtistQueryResults(cached.responses.slice(0, cached.wantedCount).map(response => {
            return {
                "html": (
                    <div style={artistContainer}>
                        <img style={artistImageStyle} src={response.thumb}/>
                        <div style={artistNameStyle}>{response.name}</div>
                    </div>
                    ),
                "content": response
            };
        }));
    }, [artistQuery, cachedSearches]);

    function moreEntries() {
        let cached = cachedSearches[artistQuery];
        if (!cached) return;

        getArtistsForQuery(artistQuery, cached.wantedCount + 10, {...cachedSearches});
    }

    function removeArtist(removeEntry) {
        setArtists(artists.filter(artist => artist.path !== removeEntry.path));
    }

    async function createAccount() {
        if (artists.length < 3) {
            setIsValidInterests(false);
            return;
        }

        let locationPromise = new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(pos => resolve(pos), error => reject(error));
        });
        let location = await locationPromise;
        let response = await apiService.current.signup({
            "username": username,
            "password": password,
            "firstName": firstName,
            "lastName": lastName,
            "location": {
                "longitude": location.coords.longitude.toString(),
                "latitude": location.coords.latitude.toString()
            },
            "musicInterests": artists.map(artist => {
                return {"name": artist.name, "path": artist.path}
            }),
            "instruments": knownInstruments
        });
        if (response.ok) {
            let json = await response.json();
            setSessionToken(json.token);
        } else {
            let error = await response.json();
            if (error.status === 400) {
                setFailMessage(error.message);
            } else {
                console.log(error);
            }
        }
    }

    const pages = [
        (
            <div className="container-fluid g-0">
                <p className="jam-title-text">Sign Up</p>
                <ErrorInputField 
                    value={username} 
                    onInput={setUsername}
                    label="Username: " 
                    type="text" 
                    isError={!isValidUsername || username.length === 0} 
                    message={username.length === 0 ? "Username is required" : "Username taken"}/>
                <InputField value={password} onInput={setPassword} label="Password:" type="password" />
                <ErrorInputField 
                    value={confirmPassword}
                    onInput={setConfirmPassword}
                    label="Confirm Password: " 
                    type="password" 
                    isError={password !== confirmPassword}
                    message="Passwords must match"/>
                <div className="row g-0">
                    <div className="col-4">
                        {/* <button className="jam-submit-button disabled" disabled>Back</button> */}
                    </div>
                    <div className="col-4"></div>
                    <div className="col-4">
                        <button className="jam-submit-button" onClick={userCredentials}>Next</button>
                    </div>  
                </div>
            </div> 
        ),
        (
            <div className="container-fluid g-0">
                <p className="jam-title-text">Sign Up</p>
                <ErrorInputField 
                    value={firstName}
                    onInput={setFirstName}
                    label="First Name: " 
                    type="text" 
                    isError={firstName.length === 0}
                    message="First name is required"/>
                <InputField value={lastName} onInput={setLastName} label="Last Name:" type="text" />
                <div className="row g-0">
                    <div className="col-4">
                        <button className="jam-submit-button" onClick={prevPage}>Back</button>
                    </div>
                    <div className="col-4"></div>
                    <div className="col-4">
                        <button className="jam-submit-button" onClick={userNames}>Next</button>
                    </div>  
                </div>
            </div> 
        ),
        (
            <div className="container-fluid g-0">
                <p className="jam-title-text">Sign Up</p>
                <DropdownField 
                    value={instQuery}
                    onInput={setInstQuery}
                    label="Add Known Instruments:" 
                    type="text"
                    hasMore={false}
                    onSelect={onInstrumentSelect}
                    entries = {filteredInstruments.map(inst => {return {
                        name: inst, 
                        html: (<span>{inst}</span>)
                    }})}/>
                <ul style={instrumentsListStyle}>
                    {knownInstruments.map(instrument => (
                        <li className="removable-list-entry" key={instrument}>
                            <span>{instrument}</span>
                            <button onClick={e => removeInstrument(instrument)}>x</button>
                        </li>
                    ))}
                </ul>
                <div className="row g-0">
                    <div className="col-4">
                        <button className="jam-submit-button" onClick={prevPage}>Back</button>
                    </div>
                    <div className="col-4"></div>
                    <div className="col-4">
                        <button className="jam-submit-button" onClick={instrumentsDone}>Next</button>
                    </div>  
                </div>
            </div>
        ),
        (
            <div className="container-fluid g-0">
                {!isValidInterests && <Alert style={alertStyle} variant="danger">Enter at least 3 artists</Alert>}
                {failMessage.length > 0 && <Alert style={alertStyle} variant="danger">{failMessage}</Alert>}
                <p className="jam-title-text">Sign Up</p>
                <DropdownField 
                    value={artistQuery}
                    onInput={setArtistQuery}
                    label="Add Favorite Artists:" 
                    type="text"
                    hasMore={cachedSearches[artistQuery] && cachedSearches[artistQuery].page < cachedSearches[artistQuery].totalPages}
                    onMore={moreEntries}
                    onSelect={onArtistSelect}
                    entries={artistQueryResults}/>
                <ul style={instrumentsListStyle}>
                    {artists.map(artist => (
                        <li className="removable-list-entry" key={artist.path}>
                            <div style={artistContainer}>
                                <img style={artistImageStyle} src={artist.thumb}/>
                                <div style={artistNameStyle}>{artist.name}</div>
                                <button style={artistButtonStyle} onClick={e => removeArtist(artist)}>x</button>
                            </div>
                        </li>
                    ))}
                </ul>
                <div className="row g-0">
                    <div className="col-4">
                        <button className="jam-submit-button" onClick={prevPage}>Back</button>
                    </div>
                    <div className="col-4"></div>
                    <div className="col-4">
                        <button className="jam-submit-button" onClick={createAccount}>Create Account</button>
                    </div>  
                </div>
            </div> 
        )
    ];

    return (
        <div className="d-flex justify-content-center align-items-center">
            <div className="jam-form">
                {pages[pageIndex]}
            </div>
        </div>
    );
};

export default SignUp;