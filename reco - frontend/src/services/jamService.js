const API_BASE_URL = "http://localhost/api/";

const API_CALL_URL = (...path) => API_BASE_URL + path.join("/");
const API_QUERY_PARAMS = (url, params) => url + "?" + new URLSearchParams(params);


// import { apiUrl } from './util/request';
// import useCookie from './util/useCookie';

// const WEBSOCKET_URL = "ws://localhost:8080/api/ws/jam";

// function App() {
//     const [sessionToken, setSessionToken, removeSessionToken] = useCookie(SESSION_TOKEN_KEY);
//     let ws = useRef(null);

//     function fetchWithToken(url, info) {
//         const headersWithToken = "headers" in info ? info.headers : {};
//         headersWithToken[SESSION_TOKEN_KEY] = sessionToken;
//         info.headers = headersWithToken;

//         return fetch(url, info).then(res => {
//             if (res.ok) {
//                 return res;
//             } else {
//                 if (res.status === 401) removeSessionToken();
//                 return Promise.reject(res);
//             }
//         });
//     }

//     function makeWebsocket(sessionToken) {
//         const ws = new WebSocket(WEBSOCKET_URL);
//         ws.onopen = () => {
//             ws.send(sessionToken);
//         }
//         ws.onmessage = message => console.log(message);
//         ws.onerror = console.error;
    
//         return ws;
//     }

class JamAPIService {
    constructor(sessionToken, removeSessionToken) {
        this.removeSessionToken = removeSessionToken;
        this.sessionToken = sessionToken;
    }

    login(data) {
        return fetch(API_CALL_URL("internal", "login"), {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify(data)
        });
    }

    signup(data) {
        return fetch(API_CALL_URL("internal", "signup"), {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify(data)
        });
    }

    existingUser(username) {
        return fetch(API_QUERY_PARAMS(API_CALL_URL("internal", "user"), {
            "username": username
        }));
    }

    getInstruments() {
        return fetch(API_CALL_URL("user", "choices", "instruments"));
    }

    findArtists(query, page) {
        return fetch(API_QUERY_PARAMS(API_CALL_URL("artist", "search"), {
            "artist": query,
            "page": page
        }),
        {
            method: "GET",
            headers: {
                "Accept": "application/json"
            },
        });
    }

    test() {
        return fetch(API_CALL_URL("test", "user", "random"), {
            method: "GET",
            headers: {
                "Accept": "application/json"
            },
        });
    }
}
export default JamAPIService;