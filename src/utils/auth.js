const clientId = "127717";
const clientSecret = "6dd9c6362b17c022911e28e9ecea4a8e0e27531a";

export const getToken = () => {
    return localStorage.getItem('strava_access_token');
};

export const setToken = (token) => {
    localStorage.setItem('strava_access_token', token);
};

export const clearToken = () => {
    localStorage.removeItem('strava_access_token');
};

export const fetchAccessToken = async (code) => {
    const response = await fetch("https://www.strava.com/oauth/token", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            client_id: clientId,
            client_secret: clientSecret,
            code: code,
            grant_type: "authorization_code",
        }),
    });
    const data = await response.json();
    if (data.access_token) {
        setToken(data.access_token);
        return data.access_token;
    } else {
        throw new Error("Access token is missing in the response");
    }
};
